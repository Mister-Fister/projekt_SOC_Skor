import React, {useState} from 'react'
import Navbar from './Navbar'
import {Link, useNavigate} from 'react-router-dom'
import {getAuth, signInWithEmailAndPassword} from "firebase/auth"
import './Login.css'

const Login = () => {
  const [password, setPassword] =useState("");
  const [email, setEmail] =useState("");
  const [errorMsg, setErrorMsg] =useState("");
  const [succcessMsg, setSuccessMrg] =useState("");
  const auth = getAuth();
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth,email,password)
    .then((useCredential) => {
      setSuccessMrg('Prihlásili ste sa úspešne')
      setEmail('')
      setPassword('')
      setErrorMsg('')
      setTimeout(() =>{
        setSuccessMrg('');
        navigate('/home');
      },2000)
    })
    .catch((error) => {
      const errorCode = error.code;
      console.log(error.message)
      if(error.message == 'Firebase: Error (auth/invalid-email).'){
        setErrorMsg('Vyplnte všetky políčka');
      }
      if(error.message == 'Firebase: Error (auth/user-not-found).'){
        setErrorMsg('Email sme nenašli');
      }
      if(error.message == 'Firebase: Error (auth/wrong-password).'){
        setErrorMsg('Zlé heslo');
      }
    })
  }

  return (
    <div>
      <Navbar/>
      <div className='login-container'>
          <form className='login-form'>
              <p>Login</p>

              {succcessMsg && <>
              <div className='success-msg'>
                {succcessMsg}
              </div></>}
              {errorMsg && <>
              <div className='error-msg'>
                  {errorMsg}
              </div></>}

              <label>Email</label>
              <input onChange={(e)=>setEmail(e.target.value)} type='email' placeholder='Váš email'/>

              <label>Heslo</label>
              <input onChange={(e)=>setPassword(e.target.value)} type='password' placeholder='Vaše heslo'/>

              <button onClick={handleLogin}>Login</button>
              <div>
                <span>Nemáte účet?</span>
                <Link to='/signup'>Registrovať sa</Link>
              </div>
          </form>
      </div>
    </div>
  )
}

export default Login

