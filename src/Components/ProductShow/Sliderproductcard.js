import React, { useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {auth,db} from '../../FirebaseConfigs/FirebaseConfig'
import { collection, getDocs, query, QuerySnapshot, where, doc, updateDoc, addDoc  } from 'firebase/firestore'
import './Sliderproductcard.css'

const Sliderproductcard = (product) => {

  const navigate = useNavigate()

  const[succcessMsg,setSuccessMsg] = useState('')
  const[errorMsg,setErrorMsg] = useState('')
  function GetCurrentUser() {
    const [user, setUser] = useState('');
    const usersCollectionRef = collection(db, "users");

    useEffect(() => {
      auth.onAuthStateChanged((userlogged) => {
        if (userlogged) {
          const getUsers = async () => {
            const q = query(
              collection(db, "users"),
              where("uid", "==", userlogged.uid)
            );
            const data = await getDocs(q);
            setUser(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
          };
          getUsers();
        } else {
          setUser(null);
        }
      });
    }, []);
    return user;
  }
  const loggeduser = GetCurrentUser();

  const addtocart = ()=>{
    if(loggeduser)
    {
      addDoc(collection(db,`cart-${loggeduser[0].uid}` ),{
         product: product.product, 
         quantity:1
      }).then(() => {
        setSuccessMsg("Produkt pridaný do košíka");
      }).catch((error) => {setErrorMsg(error.message)})
    }
    else{
      setErrorMsg("najprv sa musíte prihlásiť")
    }
  }

    let tax = 10/100 ;

    let dph = product.product.price
    let mrp = parseFloat(product.product.price);
    mrp = mrp + mrp*tax
    const saleprice = mrp.toFixed(2);
    let p = product.product;

    const loading = () => {
      navigate("/loading");
      setTimeout(() => {
        navigate(`/product/${p.producttype}/${p.id}`, { replace: true });
      }, 20);
    }

  return (
    <div className='mini-product-container'>
      <div className='mini-img-container'>
        <button className='clean' onClick={loading}>
          <img src={product.product.productimage}></img>
        </button>
      </div>
      <div className='mini-product-details'>
        <p className='mini-producttitle'>{product.product.producttitle}</p>
        <div className='mini-price-container'>
            <p className='mrp'><p className='rate'>{saleprice}€</p></p>
        </div>      
          <button onClick={addtocart} className='showmore-btn'>Do košíka</button>
      </div>
    </div>
  )
}

export default Sliderproductcard
