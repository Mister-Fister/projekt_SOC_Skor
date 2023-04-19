import React, { useState, useEffect} from 'react'
import Navbar from './Navbar'
import {auth,db} from '../FirebaseConfigs/FirebaseConfig'
import { collection, getDocs, deleteDoc, query, QuerySnapshot, where, doc, updateDoc, addDoc  } from 'firebase/firestore'
import CartInfocontainer from './CartInfocontainer'
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


const CartInfo = () => {

  const navigate = useNavigate();
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

  const [cartbasic, setCartDatabasic] = useState([]);

if (loggeduser) {
  const getCartDatabasic = async () => {
    const path = `cart-${loggeduser[0].uid}`;
    const cartArray = [];

    getDocs(collection(db, path)).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const { product, quantity } = doc.data();
        const { producttitle, price } = product;
        cartArray.push({ producttitle, price, quantity });
      });

      setCartDatabasic(cartArray); 
    }).catch((error) => {
      console.log('Error: ', error);
    });
  };

  getCartDatabasic();
}

const [errorMsg, setErrorMsg] =useState("");

const handlefinishedcart = (e) => {

  e.preventDefault();
  const cartData = {
    cartItems: cartbasic.map(({ producttitle, price, quantity }) => ({ producttitle, price, quantity })),
    totalPrice: cartbasic.reduce((total, item) => total + (item.price * item.quantity), 0),
    email: loggeduser[0].email,
    mesto: value,
    method: method,

  };

  if(value == ""){
    setErrorMsg("vyberte si lokáciu")
  }
  else if(method == ""){
    setErrorMsg("vyberte si spôsob platby")
  }
  else{
    const cartFinalRef = collection(db, `cart-final${loggeduser[0].uid}`);
  const deleteCartFinal = async () => {
    const querySnapshot = await getDocs(cartFinalRef);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  };

  deleteCartFinal().then(() => {
    addDoc(collection(db, `cart-final${loggeduser[0].uid}`), cartData)
      .then(() => navigate('/cart/sumup'))
      .catch(error => console.log('Error adding cart data to Firestore:', error));
  }).catch(error => console.log('Error deleting cart data from Firestore:', error));
  }

  
};


const [value, setValue] = useState('');

const handleChange = (event) => {

  setValue(event.target.value);
 };

 const [method, setMethod] = useState('');

const handleMethod = (event) => {

  setMethod(event.target.value);
 };



  return (
    <div>
      <Navbar/>
      {errorMsg && <>
              <div className='error-msg'>
                  {errorMsg}
              </div></>}
       <div className='cart-container'>
          <div className='cart-body'>         
          <div className='cart-head'>
              Dodacie údaje: 
          </div>
          <div className='cart-split-next'>
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
                  <CartInfocontainer
                  key={item.id} 
                  itemdata={item}
                  userid={loggeduser[0].uid}/>
                  ))}
            </div>
            <div className='help'>
              <div className='anybody'>
                <div>
                  vyberte si lokáciu boxu
                </div>
                <div>
                  <select value={value} onChange={handleChange}>
                    <option value=""> </option>
                    <option value="Cadca">Čadca</option>
                    <option value="Zilina">Žilina</option>
                  </select>
                </div>
                <div>
                  metóda pladby
                </div>
                <select value={method} onChange={handleMethod}>
                  <option value=""> </option>
                  <option value="kartou">Kartou</option>
                  <option value="hotovost">Hotovosť</option>
                </select>
              </div>
              <div className='price-next'>
                <div className='big-price'>
                  Celková cena: {(cartbasic.reduce((total, item) => total + (item.price * item.quantity), 0) + cartbasic.reduce((total, item) => total + (item.price * item.quantity), 0) * 10/100).toFixed(2)}€
                </div>
                <div className='dph-all'>
                  Celková cena bez DPH: {(cartbasic.reduce((total, item) => total + (item.price * item.quantity), 0)).toFixed(2)}€
                </div>
              </div>
            </div>
              <div className='cart-btns-next'>
                  <a  href={`/cartdata`}>
                    <button className='cart-btn-back' >Späť</button>
                  </a>
                  <Link to="/cart/sumup">
                    <button onClick={handlefinishedcart}>Pokračovať</button>
                  </Link>
              </div>
            </div>     
          </div>     
        </div>       
    </div>
  )
}

export default CartInfo
