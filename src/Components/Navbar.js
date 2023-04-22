import {Link, useNavigate} from 'react-router-dom'
import './Navbar.css'
import React, {useState, useEffect} from 'react'
import {auth, db} from '../FirebaseConfigs/FirebaseConfig'
import { collection, getDocs, query, QuerySnapshot, where } from 'firebase/firestore'
import cartlogo from '../Components/assets/cartlogo.png'
import profilelogo from '../Components/assets/profilelogo.png'
import logo from '../Components/assets/logo.png'

const Navbar = () => {
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

const navigate = useNavigate()

const handleLogout = () =>{
  auth.signOut().then(() =>{
    navigate("/login")
  })
}

const loading1 = () => {
  navigate("/loading");
  setTimeout(() => {
    navigate("/product-type/mobiles", { replace: true });
  }, 20);
}
const loading2 = () => {
  navigate("/loading");
  setTimeout(() => {
    navigate("/product-type/kamery", { replace: true });
  }, 20);
}
const loading3 = () => {
  navigate("/loading");
  setTimeout(() => {
    navigate("/product-type/laptopy", { replace: true });
  }, 20);
}
const loading4 = () => {
  navigate("/loading");
  setTimeout(() => {
    navigate("/product-type/tablety", { replace: true });
  }, 20);
}
const loading5 = () => {
  navigate("/loading");
  setTimeout(() => {
    navigate("/product-type/klávensnice", { replace: true });
  }, 20);
}
const loading6 = () => {
  navigate("/loading");
  setTimeout(() => {
    navigate("/product-type/myšky", { replace: true });
  }, 20);
}

const[cartdata, setcartdata] = useState([]);
if(loggeduser){
  const getcartdata = async () =>{
    const cartArray = [];
    const path = `cart-${loggeduser[0].uid}`
    getDocs(collection(db, path)).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        cartArray.push({ ...doc.data(), id: doc.id})
      });
      setcartdata(cartArray)
    }).catch('Error error error')
  }
  getcartdata()
}



  return (
    <div>
      <div className='navbar'>
        <div className='LeftContainer'>
          <img src={logo} />
        </div>
        <div className='RightContainer'>
            {!loggeduser && <nav>
              <Link to="/"><button>Domov</button></Link>
              <Link to="/signup"><button>Register</button></Link>
              <Link to="/login"><button>Login</button></Link>
              
              <Link to="/cart"><div className='cart-btn'>
                <img src={cartlogo} alt="no img"/>
                <span className='cart-icon-css' >0</span>
              </div></Link>
              <Link to="/userprofile">
                <img src={profilelogo} className='profile-icon'/>
              </Link>            
            </nav>
            }
            {loggeduser && 
            <nav>
              <Link to='/'><button>Domov</button></Link>
              <Link to='/addproduct'><button>Pridať produkt</button></Link>
              <div className='cart-btn'>
                <Link to='/cartdata'><img src={cartlogo} alt="no img"/></Link>
                <button className='cart-icon-css' >{cartdata.length}</button>
              </div>
              <Link to="/userprofile">
                <img src={profilelogo} className='profile-icon'/>
              </Link>
              <button className='logout-btn' onClick={handleLogout}>Logout</button>
            </nav>}
        
        </div>
      </div>
      <div className='product-types'>
            <button onClick={loading1}>Mobily</button>   
            <button onClick={loading2}>Kamery</button>
            <button onClick={loading3}>Laptopy</button>
            <button onClick={loading4}>Tablety</button>
            <button onClick={loading5}>Klávensnice</button>
            <button onClick={loading6}>Myšy</button>
            
      </div>
    </div>
  )
}

export default Navbar
