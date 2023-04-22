import React, { useState, useEffect } from 'react';
import { auth, db } from '../FirebaseConfigs/FirebaseConfig';
import { updatePassword as updateAuthPassword } from 'firebase/auth';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import Navbar from './Navbar';
import './NewPassword.css'

const NewPassword = () => {
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
            <form onSubmit={handlePasswordValidation}>
              <div>
                <input
                  type='password'
                  value={passwordCheck}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                />
              </div>
              <div>
                <button type='submit'>ok</button>
              </div>
            </form>
          )}
          {passwordValidated && (
            <form onSubmit={handlePasswordChange}>
              <div>
                <input
                  type='password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
    
                <input
                  type='password'
                  value={newPasswordCheck}
                  onChange={(e) => setNewPasswordCheck(e.target.value)}
                />
              </div>
              <div>
                <button type='submit'>Zmeniť heslo</button>
              </div>
              {passwordUpdated && <div>Heslo bolo úspešne zmenené!</div>}
              {passwordUpdateError && (
                <div>Nastala chyba pri zmene hesla: {passwordUpdateError}</div>
              )}
            </form>
          )}
        </div>
      );
    };
export default NewPassword
