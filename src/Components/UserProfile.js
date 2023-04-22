import React, { useState, useEffect } from 'react';
import { auth, db } from '../FirebaseConfigs/FirebaseConfig';
import { updatePassword as updateAuthPassword } from 'firebase/auth';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './UserProfile.css';

const UserProfile = () => {
  function GetCurrentUser() {
    const [user, setUser] = useState('');

    useEffect(() => {
      auth.onAuthStateChanged((userlogged) => {
        if (userlogged) {
          const getUsers = async () => {
            const q = query(
              collection(db, 'users'),
              where('uid', '==', userlogged.uid)
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

  const [newPassword, setNewPassword] = useState('');
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [passwordUpdateError, setPasswordUpdateError] = useState('');


  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      await updateAuthPassword(auth.currentUser, newPassword);
      setPasswordUpdated(true);
      setPasswordUpdateError('')
      handleUpdate();
    } catch (error) {
      setPasswordUpdated(false);
      setPasswordUpdateError(error.message);
    }
  };


  const handleUpdate = () =>{
    updateDoc(doc(db,`users`, loggeduser[0].id),{
      password: newPassword
    });    
       
  }

  return (
    <div>
      <Navbar />
      <div className='userprofile-outercontainer'>
        {loggeduser ? (
          <div className='user-profile'>
            <p>Info o účte</p>
            <div className='data-row'>
            
              <span>Vaše meno</span>
              <span>{loggeduser[0].username}</span>
            </div>
            <div className='data-row'>
              <span>Váš email</span>
              <span>{loggeduser[0].email}</span>
            </div>
            <form onSubmit={handlePasswordChange}>
              <div className='data-row'>
                <span>heslo</span>
                <span>{loggeduser[0].password}</span>
                
              </div>
            </form>
            {passwordUpdated && (
              <div className='data-row'>
                Heslo bolo úspešne zmenené!
              </div>
            )}
            {passwordUpdateError && (
              <div className='data-row'>
                Nastala chyba pri zmene hesla: {passwordUpdateError}
              </div>
            )}
            <div className='data-row'>
              <span>Vaše uid</span>
              <span>{loggeduser[0].uid}</span>
            </div>

            <Link to="/newpass"><button type='submit'>Zmeniť heslo</button> </Link>
          </div>
        ) : (
          <div>Nieste prihlásený</div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;