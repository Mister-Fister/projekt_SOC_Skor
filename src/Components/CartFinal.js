import React, { useState, useEffect} from 'react'
import {auth,db} from '../FirebaseConfigs/FirebaseConfig'
import { initializeApp } from "firebase/app";
import { getDatabase ,ref, set} from "firebase/database";
import { Link } from 'react-router-dom';
import Navbar from './Navbar'
import firebase from "firebase/app";
import "./CartFinal.css"
import "firebase/firestore";
import { useNavigate } from 'react-router-dom'
import { collection, getDocs,setDoc,deleteDoc, query, QuerySnapshot, where } from 'firebase/firestore'



const CartFinal = () => {


 
  const [succcessMsg, setSuccessMrg] =useState("");

    const navigate = useNavigate();
    const firebaseConfig = {
        apiKey: "AIzaSyClmLHHI40s5L-VUY8h-TK0Su7zj6mmK44",
        authDomain: "bilza-8760c.firebaseapp.com",
        databaseURL: "https://bilza-8760c-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "bilza-8760c",
        storageBucket: "bilza-8760c.appspot.com",
        messagingSenderId: "367213897697",
        appId: "1:367213897697:web:f0f333aa568505b76b14a0",
        measurementId: "G-TJ381HXYMH"
      };

      const app = initializeApp(firebaseConfig);
      const database = getDatabase(app);
    
      function GetCurrentUser() {
        const [user, setUser] = useState('');
    
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
      let path = '';
if (loggeduser) {
  path = `cart-final${loggeduser[0].uid}`;
}

      const [cartbasic, setCartDatabasic] = useState([]);
    
      const getCartDatabasic = async () => {
        if (loggeduser) {
          const path = `cart-final${loggeduser[0].uid}`;
          const cartArray = [];
    
          getDocs(collection(db, path))
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                cartArray.push(doc.data());
              });
    
              setCartDatabasic(cartArray);
            })
            .catch((error) => {
              console.log("Error: ", error);
            });
        }
      };
    
      useEffect(() => {
        getCartDatabasic();
      }, [loggeduser]);
    
      const mesto = cartbasic[0]?.mesto;
      const email = cartbasic[0]?.email;

const newData = {};
if (mesto) newData.mesto = mesto;
if (email) newData.email = email;
    

const city = cartbasic[0]?.mesto;
const cityWithDiacritics = city
? city.replace('C', 'Č').replace('Z', 'Ž')
: '';
  
const paymentMethod = cartbasic[0]?.method;
const paymentMethodWithDiacritics = paymentMethod
  ? paymentMethod.replace('ovost', 'ovosť')
  : '';




const pokus = () => {
  let a = Math.floor(Math.random() * 900000000 + 100000000);
  const newRef = ref(database, `Objednavka/${a}`);
  const cartFinalRef = collection(db, `cart-final${loggeduser[0].uid}`);
  const cartRef = collection(db, `cart-${loggeduser[0].uid}`);
  const htmlMessage = `
    ${cartData.cartItems.map((item, index) => `
        číslo položky='${index}'
        názov: ${item.producttitle}
        počet: ${item.quantity}
        cena: ${item.price}€
    `).join('')}
    Cena dokopy: ${cartData.totalPrice}€
    Spôsob platby: ${paymentMethodWithDiacritics}
    Miesto prevzatia: ${cityWithDiacritics}
    
    Vaša objednavka bola soracovaná a môžete si u prísť vyzdvihnúť o 4/5 pracivných dní s týmto kódom ${a}`;
  Promise.all([
    set(newRef, newData),
    getDocs(cartFinalRef).then(querySnapshot => {
      querySnapshot.forEach(doc => deleteDoc(doc.ref));
    }),
    getDocs(cartRef).then(querySnapshot => {
      querySnapshot.forEach(doc => deleteDoc(doc.ref));
    }),
    fetch('https://europe-west1-bilza-8760c.cloudfunctions.net/sendE', { 
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        recipient: loggeduser[0].email,
        subject: "objednávka",
        message: htmlMessage,            
      })
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .then(setSuccessMrg('Objednávka úspešne ukončená'))
    .catch(error => console.error(error))
  ])
  .then(() => setTimeout(() => navigate('/home'), 2000))
  .catch(error => console.error("Error writing document: ", error));
};

    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    
  
    useEffect(() => {
      const getCartData = async () => {
        try {
          const cartFinalRef = collection(db, `cart-final${loggeduser[0].uid}`);
          const querySnapshot = await getDocs(cartFinalRef);
          const cartData = querySnapshot.docs.map((doc) => doc.data())[0];
          setCartData(cartData);
          setLoading(false);
        } catch (error) {
          console.log("Error: ", error);
        }
      };
    
      getCartData();
    }, [loggeduser]);
  
    if (loading) {
      return <p>Loading...</p>;
    }

      return(
        <div>
            <Navbar/>
            <div className='just-flex'>
            <div className='final'>
           <div className='final-nadpis'> OSOBNÉ A DODACIE ÚDAJE</div>
            <div className='final-container'> 
              <div className='stat-container'>
                <div className='stat-show'>
                   Meno a priezvisko
                </div>
                <div>
                 {loggeduser[0]?.username}
                </div>             
              </div>
              <div className='stat-container'>
                <div className='stat-show'>
                  E-mail
                </div>
                <div>
                {loggeduser[0]?.email}
                </div>
              </div>
              <div className='stat-container'>
                <div className='stat-show'>
                Lokácia boxu
                </div>
                <div>
                {cityWithDiacritics}
                </div>
                
              </div>
              <div className='stat-container'>
                <div className='stat-show'>
                  Spôsob platby
                </div>
                <div>
                {paymentMethodWithDiacritics}
                </div>       
              </div>
            </div>
            <div className='final-nadpis'>SÚHRN OBJEDNÁVKY</div>
            <div>
            <div className='item-info-continer'>
            <div className='eh-start'>
            názov
            </div>
            <div className='eh'>
           počet
            </div>
            <div className='eh'>
            cena za kus
            </div>
            <div className='eh-end'>
            cena
            </div>
          </div>



            <div className='final-container'>

        {cartData.cartItems.map((item, index) => (
          <div className='item-info-continer' key={index}>
            <div className='eh-start'>
            {item.producttitle}
            </div>
            <div className='eh'>
            {item.quantity}
            </div>
            <div className='eh'>
            {item.price}€
            </div>
            <div className='eh-end'>
            {item.price*item.quantity}€
            </div>
          </div>
        ))}

      <p className='right'>Cena dokopy: {cartData.totalPrice}€</p>
    </div>

            </div>
            <div className='final-buttons'>            
              <Link  to={`/cartahoj`}>
                      <button className='cart-btn-back'>Späť</button>
              </Link >
              <button className='cart-btn-next' onClick={pokus}>Potvrdiť nákup</button>
            </div>
            
            </div>
            
            </div>
            {succcessMsg && <>
              <div className='success-msg'>
                {succcessMsg}
              </div></>}
            
        </div>
        
       
      ) 
    };

export default CartFinal
