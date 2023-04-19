// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
function StartFirebase(){
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
      
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      return  getDatabase(app);
}
export default StartFirebase;