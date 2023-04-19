import React, { useState, useEffect} from 'react'
import Navbar from './Navbar'
import {auth,db} from '../FirebaseConfigs/FirebaseConfig'
import { collection, getDocs, query, QuerySnapshot, where } from 'firebase/firestore'
import './Cart.css'
import CartCard from './CartCard'
import { Link } from 'react-router-dom'

const Cart = () => {

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

const [cartdata, setcartdata]= useState([]);

if(loggeduser) {
  const getcartdata = async () => {
    const cartArray = [];
    const path = `cart-${loggeduser[0].uid}`
    getDocs(collection(db, path)).then((querySnapshot) =>{
      querySnapshot.forEach((doc) =>{
        cartArray.push({ ...doc.data(), id: doc.id})
      });
      setcartdata(cartArray)
    }).catch('Error error error')
  }
  getcartdata()
}

const [cartbasic, setCartDatabasic] = useState("");


const getCartDatabasic = async () => {
  const path = `cart-${loggeduser[0].uid}`;
  const cartArray = [];
  let totalPrice = 0;

  getDocs(collection(db, path)).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const { product, quantity } = doc.data();
      const { price } = product;
      const itemPrice = price * quantity;
      totalPrice += itemPrice;
      cartArray.push({ price, quantity, itemPrice });
    });

    setCartDatabasic(totalPrice); 
  }).catch((error) => {
    console.log('Error: ', error);
  });
}
getCartDatabasic();

const [priceshow, setPriceshow] = useState("");

  useEffect(() => {
    if (cartbasic) {
      const newPriceShow = (cartbasic * 1.1).toFixed(2)
      setPriceshow(newPriceShow);
    }
  }, [cartbasic]);

  return (
    <div>
        <Navbar/>
        {cartdata.length!=0? 
        <div className='cart-container'>
          <div className='cart-body'>         
          <div className='cart-head'>
              Vaše produkty: 
          </div>
          <div className='cart-split'>
            <div>
                Produkt
            </div>
            <div>
                Množstvo
            </div>
            <div>
                Cena za kus
            </div>
            <div>
                Celkom
            </div>
          </div>
          <div className='allcartitems'>
            <div className='allcartitems'>
                {cartdata.map((item)=>(
                  <CartCard
                  key={item.id} 
                  itemdata={item}
                  userid={loggeduser[0].uid}/>
                  ))}
            </div>
            <div className='price'>
              <div className='big-price'>
                Celková cena: {priceshow}€
              </div>
              <div className='dph-all'>
                Celková cena bez DPH: {cartbasic.toFixed(2)}€
              </div>
            </div>
              <div className='cart-btns'>
                  <Link to={`/home`}>
                    <button className='cart-btn-back' >Späť</button>
                  </Link>
                  <Link to={`/cartahoj`}>
                    <button className='cart-btn-next'>Pokračovať</button>
                  </Link>
              </div>
            </div>     
          </div>     
        </div>
             
        : 
        <p>Košík je prázdny</p>}
    </div>
  )
}

export default Cart
