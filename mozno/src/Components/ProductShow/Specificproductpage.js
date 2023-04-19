import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { getDownloadURL, storage, ref } from 'firebase/storage'
import { useParams, Link } from 'react-router-dom'
import { db, auth } from '../../FirebaseConfigs/FirebaseConfig'
import { useNavigate } from 'react-router-dom'
import { async } from '@firebase/util'
import { getDoc, doc, collection, query, where, getDocs, addDoc, deleteDoc, updateDoc} from 'firebase/firestore'
import ProductSlider from './ProductSlider'
import './Specificproductpage.css'
import { Carousel } from 'react-bootstrap';


const Specificproductpage = () => {
    const{type, id}= useParams()
    const[product, setProduct] = useState('');
    const[successMsg, setSuccessMsg] = useState('');
    const[errorMsg, setErrorMsg] = useState('');

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


    function GetCurrentProduct(){
      useEffect(() => {
        const getProduct = async () =>{
          const docRef = doc(db,`products-${type.toUpperCase()}`, id );
          const docSnap = await getDoc(docRef);
          setProduct(docSnap.data());
        };
        getProduct();
      },[])
      return product
    }
    GetCurrentProduct();

    let tax = 10/100;
    let dph = product.price
    let mrp = parseFloat(product.price);
    mrp = mrp + mrp*tax
    const saleprice = mrp.toFixed(2);


    const addtocart = ()=>{
      if(loggeduser)
      {
        addDoc(collection(db,`cart-${loggeduser[0].uid}` ),{
          product, quantity:1
        }).then(() => {
          setSuccessMsg("Produkt pridaný do košíka");
        }).catch((error) => {setErrorMsg(error.message)})
      }
      else{
        setErrorMsg("najprv sa musíte prihlásiť")
      }
    }

    const navigate = useNavigate();

    const deleteitem = async () => {
      await deleteDoc(doc(db,`products-${type.toUpperCase()}`, id ))
      .then(()=>{
        setSuccessMsg("Produkt vymazaný");
        setTimeout(() =>{
          setSuccessMsg('');
          navigate('/home');
        },2000)
      })
    }


    
    const[keyspecsupdate, setKeyspecs] = useState('');
    const[priceupdate, setPriceupdate] = useState('');
    const[descriptionupdate, setDescriptionpdate] = useState('');
    const[titleupdate, setTitleupdate] = useState('');
    const[brandupdate, setBrandupdate] = useState('');
    const[warrantyupdate, setwarrantyupdate] = useState('');

    

  return (
    <div>
      <Navbar/>
        {loggeduser && loggeduser[0].email =="matusskor@gmail.com"?
      <div className='container'>
      <div className='myprod-container'>
        <div>             
          <div>
                      {product && product.productimage && (
              <Carousel className='prod-img-cont'>
                {product.productimage.map((imageUrl, index) => (
                  <Carousel.Item key={index}>
                    <img className="d-block w-100" src={imageUrl} alt={`Slide ${index}`} />
                  </Carousel.Item>
                ))}
              </Carousel>
            )}
          </div>
          <div className='extra'>
            značka: {product.brand}
          </div>
          <div className='extra'>
            záruka na {product.warranty} mesiacov
          </div>
        </div>
        

        <div className='prod-data'>
            <p className='prod-head'>{product.producttitle}</p>
                
            <p className='prod-keyspecs'>{product.keyspecs}</p>
            <div className='price-cart-containter'>
              <div className='specific-price-container'>
                  <p className='cena'><b>{saleprice}</b>€</p>
                  <p className='dph'> Cena bez DPH: {dph}€</p>
              </div>
              <div className='buy-cart'>
                <button className='btn' onClick={addtocart}>Pridať do košíka</button>
              </div>
            </div>

            <p className='prod-details-head'> Detaily</p>
            <p className='prod-description'>{product.description}</p>

        </div>
      </div>

      <Link to={`/product/${product.producttype}/${id}/Admin`}><button className='admin-panel-button' >Admin panel</button></Link>

      {successMsg && 
      <div className='succes-msg'>
        {successMsg}
      </div>}
      {errorMsg && 
      <div className='error-msg'>
        {errorMsg}
      </div>}
      <p className='prod-details-head2'>Podobné produkty</p>
      <ProductSlider type={type}></ProductSlider>
      </div>
      :
      <div className='container'>
        <div className='myprod-container'>
          <div>             
            <div>
                        {product && product.productimage && (
                <Carousel className='prod-img-cont'>
                  {product.productimage.map((imageUrl, index) => (
                    <Carousel.Item key={index}>
                      <img className="d-block w-100" src={imageUrl} alt={`Slide ${index}`} />
                    </Carousel.Item>
                  ))}
                </Carousel>
              )}
            </div>
            <div className='extra'>
              značka: {product.brand}
            </div>
            <div className='extra'>
              záruka na {product.warranty} mesiacov
            </div>
          </div>
          

          <div className='prod-data'>
              <p className='prod-head'>{product.producttitle}</p>
              <p className='prod-keyspecs'>{product.keyspecs}</p>
              <div className='price-cart-containter'>
                <div className='specific-price-container'>
                    <p className='cena'><b>{saleprice}</b>€</p>
                    <p className='dph'> Cena s DPH: {dph}€</p>
                </div>
                <div className='buy-cart'>
                  <button className='btn' onClick={addtocart}>Pridať do košíka</button>
                </div>
              </div>

              <p className='prod-details-head'> Detaily</p>
              <p className='prod-description'>{product.description}</p>

          </div>
        </div>
        {successMsg && 
        <div className='succes-msg'>
          {successMsg}
        </div>}
        {errorMsg && 
        <div className='error-msg'>
          {errorMsg}
        </div>}
        <p className='prod-details-head2'>Podobné produkty</p>
        <ProductSlider type={type}></ProductSlider>
    </div>
      }
 </div>
    
    
  )
}

export default Specificproductpage
