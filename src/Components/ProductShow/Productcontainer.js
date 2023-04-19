import React, { useState, useEffect} from 'react'
import {auth,db} from '../../FirebaseConfigs/FirebaseConfig'
import { collection, getDocs, query, QuerySnapshot, where, doc, updateDoc, addDoc  } from 'firebase/firestore'

import './Productcontainer.css'

const Productcontainer = (product) => {

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

  let p = product.product;
  let tax = 10/100 ;

  let dph = p.price
  let mrp = parseFloat(p.price);
  mrp = mrp + mrp*tax
  const saleprice = mrp.toFixed(2);
  return (
    <div className='product-container'>
      <Link className='full' to={`/product/${p.producttype}/${p.id}`}>
      <img src={p.productimage[0]} className="product-image"></img>
      </Link>
      <div className='product-details'>   
      <Link className='full' to={`/product/${p.producttype}/${p.id}`}>
        <button className='product-title'>{p.producttitle}</button>
      </Link> 
      <p className='product-keyspecs'>
        {p.keyspecs}
      </p>
          <div className='price-container'>
            <p className='mrp'><p className='rate'>{saleprice}€</p></p>
          </div>
          <div className='buy-cart'>
            <button onClick={addtocart} className='btn'>Do košíka</button>
          </div>
      </div>
    </div>
  )
}

export default Productcontainer
