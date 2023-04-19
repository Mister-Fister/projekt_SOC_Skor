import React, {useState, useEffect} from 'react'
import Banner from './Banner'
import Navbar from './Navbar'
import Products from './Products'
import {auth, db} from '../FirebaseConfigs/FirebaseConfig'
import { collection, getDocs, query, where } from 'firebase/firestore'
import ProductSlider2 from './ProductShow/ProductSlider2'
import './Home.css'



const Home = () => {
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
//if(loggeduser){console.log(loggeduser[0].email)}
  return (
    <div>
    
      <Navbar/>
      <Banner/>
      <div className='slider-head'><p>Top produkty</p></div>
      <div className='homeslider-container'>
        <div className='cat'>Mobily</div> 
        <ProductSlider2 className="home-slider" type={'Mobile'}/>
        <div className='cat'>Laptopy</div>
        <ProductSlider2 className="home-slider" type={'laptopy'}/>
        <div className='cat'>Kamery</div>
        <ProductSlider2 className="home-slider" type={'kamery'}/>
        
        <div className='cat'>Klávesnice</div>
        <ProductSlider2 className="home-slider" type={'Klávensnice'}/>
        <div className='cat'>Myšky</div>
        <ProductSlider2 className="home-slider" type={'Myšky'}/>
        <div className='cat'>Tablety</div>
        <ProductSlider2 className="home-slider" type={'tablety'}/>
      </div>

      <index />
    </div>
  )
}

export default Home
