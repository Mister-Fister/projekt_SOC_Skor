import React, { useState, useEffect} from 'react'
import {auth, db} from '../FirebaseConfigs/FirebaseConfig'
import { updateProfile } from 'firebase/auth'
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore'
import Navbar from './Navbar'
import { updatePassword , EmailAuthProvider} from "firebase/auth";
import './UserProfile.css'
import firebase from './../FirebaseConfigs/FirebaseConfig';

const UserProfile = () => {
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



const [newPassword, setNewPassword] = useState('');
const [errorMsg, setErrorMsg] = useState('');

const handleChangePassword = async () => {
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(loggeduser[0].email, loggeduser[0].password);
    await user.reauthenticateWithCredential(credential);
    await updatePassword(user, newPassword);
    setNewPassword('');
    setErrorMsg('');
    alert('Heslo úspešne zmenené!');
  } catch (error) {
    setErrorMsg(error.message);
  }
};


  return (
    <div>
    <Navbar />
    <div className="userprofile-outercontainer">
      {loggeduser ? (
        <div className="user-profile">
          <p>Info o účte</p>
          <div className="data-row">
            <span>Vaše meno</span>
            <span>{loggeduser[0].username}</span>
          </div>
          <div className="data-row">
            <span>Váš email</span>
            <span>{loggeduser[0].email}</span>
          </div>
          <div className="data-row">
            <span>Vaše heslo</span>
            <input type="password" onChange={(e) => setNewPassword(e.target.value)} value={newPassword} />
            <button onClick={handleChangePassword}>Zmeniť heslo</button>
          </div>
          <div className="data-row">
            <span>Vaše uid</span>
            <span>{loggeduser[0].uid}</span>
          </div>
          {errorMsg && <div className="error-msg">{errorMsg}</div>}
        </div>
      ) : (
        <div>Nieste prihlásený</div>
      )}
    </div>
  </div>
  )
}

export default UserProfile
