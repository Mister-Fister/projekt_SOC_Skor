import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import {auth, db} from './../FirebaseConfigs/FirebaseConfig'
import { collection, addDoc } from 'firebase/firestore'
import './Signup.css'

const Signup = () => {
  const [username, setUserName] =useState("");
  const [password, setPassword] =useState("");
  const [email, setEmail] =useState("");

  const navigate = useNavigate()
  const [errorMsg, setErrorMsg] =useState("");
  const [succcessMsg, setSuccessMrg] =useState("");

  const handleSubmit = (e)=>{
    e.preventDefault();
    createUserWithEmailAndPassword(auth,email,password)
    .then((userCredential) =>{
      const user = userCredential.user;
      const initialcartvalue=0;


      addDoc(collection(db,"users"),{
        username: username,
        email: email,
        password: password,
        cart: initialcartvalue,
        uid: user.uid
      }).then(()=>{
        setSuccessMrg('Nový používateľ úspešne pridaný')
        setUserName('')
        setEmail('')
        setPassword('')
        setErrorMsg('')
        setTimeout(() =>{
          setSuccessMrg('');
          navigate('/home');
        },4000)
      })
      .catch((error) => {setErrorMsg(error.message)})
    })
    .catch((error) => {
      if(error.message == 'Firebase: Error (auth/invalid-email).'){
        setErrorMsg('Vyplnte všetky políčka')
      }
      if(error.message == 'Firebase: Error (auth/email-already-in-use).'){
        setErrorMsg('Užívateľ už existuje')
      }
    })
  }

  return (
    <div>
      <Navbar/>
      <div className='signup-container'>
          <form className='signup-form' onSubmit={handleSubmit}>
              <p>Vytvoriť účet</p>

              {succcessMsg && <>
              <div className='success-msg'>
                {succcessMsg}
              </div></>}
              {errorMsg && <>
              <div className='error-msg'>
                  {errorMsg}
              </div></>}
              <label>Vaše meno</label>
              <input onChange={(e)=>setUserName(e.target.value)} type='text' placeholder='Meno a priezvisko'/>

              <label>Email</label>
              <input onChange={(e)=>setEmail(e.target.value)} type='email' placeholder='Váš email'/>

              <label>Heslo</label>
              <input onChange={(e)=>setPassword(e.target.value)} type='password' placeholder='Vaše heslo'/>

              <button type='submit'>Signup</button>
              <div>
                <span>Už máte účet?</span>
                <Link to='/login'>Prihlásiť sa</Link>
              </div>
          </form>
      </div>
    </div>
  )
}

export default Signup

