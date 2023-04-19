import React, {useState, useEffect} from 'react'
import Navbar from './Navbar'
import { storage,auth, db} from '../FirebaseConfigs/FirebaseConfig'
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Dropdown from 'react-dropdown'
import { v4 as uuidv4 } from 'uuid';
import firebase from 'firebase/app';

import './Addproduct.css'

const Addproduct = () => {
  



    const[producttitle, setProductTitle] =useState('')
    const[producttype, setProductType] =useState('')
    const[description, setDescription] =useState('')
    const[brand, setBrand] =useState('')
    const[customersupport, setCustomersupport] =useState('')
    const[price, setPrice] =useState('')
    const[warranty, setWarranty] =useState('')
    const[keyspecs, setKeyspecs] = useState('')
    const[productimage, setProductImage] =useState([])


    const[succcessMsg,setSuccessMsg] = useState('')
    const[uploadError,setUploadError] = useState('')

    function GetCurrentUser(){
        const [user,setUser] =useState('')
        const usersCollectionRef = collection(db,"users")
    
        useEffect(()=>{
          auth.onAuthStateChanged(userlogged =>{
            if(userlogged){
              const getUsers = async ()=>{
                const q = query(collection(db,"users"),where("uid","==",userlogged.uid))
                const data = await getDocs(q);
                setUser(data.docs.map((doc) =>({...doc.data(),id:doc.id})))
              }
              getUsers();
            }
            else{
              setUser(null)
            }
          })
        },[])
        return user
    }
    const loggeduser = GetCurrentUser();
    const[imageError,setImageError] = useState('')

    const types = ['image/jpg','image/jpeg','image/png','image/PNG']

    const handleProductImg = (e) =>{
      e.preventDefault();
      let selectedFiles = e.target.files;
  
      if(selectedFiles.length > 0){
          let isValid = true;
          for (let i = 0; i < selectedFiles.length; i++) {
              if (!types.includes(selectedFiles[i].type)) {
                  isValid = false;
                  break;
              }
          }
  
          if(isValid){
              setProductImage(selectedFiles);
              setImageError('')
          }
          else{
              setImageError('Prosím vyberte svoje súbory')
          }
      }else{
          setProductImage(null)
          setImageError('Prosím používajte súbory typu: png / jpg')
      }
  }

  const [value, setValue] = useState('');

const handleChange = (event) => {

  setValue(event.target.value);
 };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    let imageUrls = [];
    let uploadPromises = [];
  
    for (let i = 0; i < productimage.length; i++) {
      const storageRef = ref(storage, `product-images${producttype.toUpperCase()}/${Date.now()} `);
      uploadPromises.push(uploadBytes(storageRef, productimage[i]));
      try {
        const snapshot = await uploadPromises[i];
        const url = await getDownloadURL(snapshot.ref);
        imageUrls.push(url);
      } catch (error) {
        setSuccessMsg('');
        setUploadError(`Chyba pri nahrávaní obrázka: ${error.message}`);
        return;
      }
    }
  
    try {
      await addDoc(collection(db, `products-${value.toUpperCase()}`), {
        producttitle,
        producttype: value,
        description,
        brand,
        customersupport,
        price,
        warranty,
        productimage: imageUrls,
        keyspecs: keyspecs,
      });
      setSuccessMsg('Produkt bol pridaný úspešne');
      setUploadError('');
      setProductTitle('');
      setProductType('');
      setKeyspecs('');
      setBrand('');
      setWarranty('');
      setProductImage(null);
      setDescription('');
      setPrice('');
      setCustomersupport('');
    } catch (error) {
      setSuccessMsg('');
      setUploadError(`Chyba pri pridávaní produktu: ${error.message}`);
    }
  };
  return (
    <div>
        <Navbar/>
        
        {loggeduser && loggeduser[0].email =="matusskor@gmail.com"?
         <div className='addprod-container'>
            <form className='addprod-form' onSubmit={handleAddProduct}>
                <p>Add Data</p>
                {succcessMsg && <div className='success-msg'>{succcessMsg}</div>}
                {uploadError && <div className='error-msg'>{uploadError}</div>}
                <label>Typ</label>
                <select value={value} onChange={handleChange}>

                  <option value=""> </option>
                  <option value="mobile">mobily</option>
                  <option value="kamery">kamery</option>
                  <option value="laptopy">laptopy</option>
                  <option value="tablety">tablety</option>
                  <option value="klávensnice">klávensnice</option>
                  <option value="myšky">myšky</option>

                </select>    
                <label>Názov</label>
                <input type="text" onChange={(e)=>{setProductTitle(e.target.value)}} placeholder="Názov..."/>
                
                

                <label>Špecifikácie</label>
                <textarea onChange={(e)=>{setKeyspecs(e.target.value)}} placeholder="Špecifikácie..."/>

                <label>Značka</label>
                <input type="text" onChange={(e)=>{setBrand(e.target.value)}} placeholder="Značka..."/>

                <label>Záruka</label>
                <input type="text" onChange={(e)=>{setWarranty(e.target.value)}} placeholder="Záruka.."/>

                <label>Obrázok</label>
                <input className='add-image' type="file" multiple onChange={handleProductImg} />
                {imageError && <>
                    <div className='error-msg'>{imageError}</div>
                </>}

                <label value>Opis</label>
                <textarea  onChange={(e)=>{setDescription(e.target.value)}} placeholder="Popíšte produkt..."/>

                <label>Cena bez DPH</label>
                <input type="text" onChange={(e)=>{setPrice(e.target.value)}} placeholder="Cena bez dph..."/>

                <label>Podpora zákazníka</label>
                <input type="text" onChange={(e)=>{setCustomersupport(e.target.value)}} placeholder="Podpora zákazníkov..."/>

                <button type='submit'>Pridať</button>
                
            </form>
         </div> : <div>Nemáte práva na pridanie produktu</div>
        }
    </div>
  )
}

export default Addproduct
