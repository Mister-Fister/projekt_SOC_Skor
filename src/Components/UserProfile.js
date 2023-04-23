import React, { useState, useEffect } from 'react';
import { auth, db } from '../FirebaseConfigs/FirebaseConfig';
import { updatePassword as updateAuthPassword } from 'firebase/auth';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './UserProfile.css';
import cog from '../Components/assets/cog.png'

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
            <form>
              <div className='data-row'>
                <span>heslo</span>
                <span>{loggeduser[0].password}</span>
                
              </div>
            </form>
            <div className='data-row'>
              <span>Vaše uid</span>
              <span>{loggeduser[0].uid}</span>
            </div>

            <Link to="/newpass"><button type='submit' className='trihodrano'><img className='staletrirano' src={cog} /></button> </Link>
          </div>
        ) : (
          <div>Nieste prihlásený</div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;