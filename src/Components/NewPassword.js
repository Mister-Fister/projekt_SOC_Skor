import React, { useState, useEffect } from 'react';
import { auth, db } from '../FirebaseConfigs/FirebaseConfig';
import { updatePassword as updateAuthPassword } from 'firebase/auth';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import Navbar from './Navbar';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import './NewPassword.css'

const NewPassword = () => {

  const navigate = useNavigate()

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
      const [newPasswordCheck, setNewPasswordCheck] = useState('');
      const [passwordUpdated, setPasswordUpdated] = useState(false);
      const [passwordUpdateError, setPasswordUpdateError] = useState('');
      const [passwordValidated, setPasswordValidated] = useState(false);

      const handlePasswordChange = async (e) => {
        e.preventDefault();
    
        if (newPassword == newPasswordCheck) {
          try {
            await updateAuthPassword(auth.currentUser, newPassword);
            setPasswordUpdated(true);
            setPasswordUpdateError('');
            handleUpdate();
            setTimeout(() => {
              navigate("/userprofile")
            }, 2000);
          } catch (error) {
            setPasswordUpdated(false);
            setPasswordUpdateError(error.message);
          }
        }
      };
    
      const handleUpdate = () => {
        updateDoc(doc(db, `users`, loggeduser[0].id), {
          password: newPassword,
        });
      };
    
      const handlePasswordValidation = (e) => {
        e.preventDefault();
    
        if (loggeduser[0].password === passwordCheck) {
          setPasswordValidated(true);
        } else {
          setPasswordUpdateError('zlé heslo');
        }
      };
    
      const [passwordCheck, setPasswordCheck] = useState('');
    
      return (
        <div>
          <Navbar />
          {!passwordValidated && (
            <form className='new-pass-container' onSubmit={handlePasswordValidation}>
              <div className='uf'>
                <div className='uf'>Zadajte aktuálne heslo</div>
                <input
                  type='password'
                  value={passwordCheck}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                />
              </div>
              <div >
                <button className='inpu' type='submit'>Pokračovať</button>
              </div>
              <Link to="/userprofile" className='unga'>späť</Link>
              {passwordUpdateError && (
                <div className='error-msg'>Nesprávne heslo</div>
              )}
            </form>
            
          )}
          {passwordValidated && (
            <form className='new-pass-container2' onSubmit={handlePasswordChange}>
              <div className='uf'>
                <div className='uf'>Nové heslo</div>
                <input className='ef'
                  type='password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <div className='uf'>Zopakujte heslo</div>
                <input 
                  type='password'
                  value={newPasswordCheck}
                  onChange={(e) => setNewPasswordCheck(e.target.value)}
                />
              </div>
              <div>
                <button className='inpu' type='submit'>Zmeniť heslo</button>
              </div>
              <Link to="/userprofile" className='unga'>späť</Link>
              {passwordUpdated && <div className='success-msg'>Heslo bolo úspešne zmenené!</div>}
              {passwordUpdateError && (
                <div className='error-msg'>Nastala chyba pri zmene hesla: {passwordUpdateError}</div>
              )}
            </form>
          )}
        </div>
      );
    };
export default NewPassword
