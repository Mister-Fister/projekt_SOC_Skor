import React, {useState , useEffect} from 'react'
import { collection, query, onSnapshot, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../../FirebaseConfigs/FirebaseConfig'
import Navbar from '../Navbar'
import Productcontainer from './Productcontainer'
import './Allproductpage.css'
import { async } from '@firebase/util'


const Allproductpage = (props) => {

    const [products, setProducts] = useState([]);
    const [sortDirection, setSortDirection] = useState("desc");
    useEffect(() =>{
        const getProducts = async () => {

            const productsArray = [];
            const path = `products-${props.type.toUpperCase()}`
           try {
                const querySnapshot = await getDocs(collection(db, path));
                querySnapshot.forEach((doc) => {
                  productsArray.push({ ...doc.data(), id: doc.id });
                });
                productsArray.sort((a, b) => {
                  if (sortDirection === "asc") {
                    return a.price - b.price; 
                  } else {
                    return b.price - a.price; 
                  }
                });
                setProducts(productsArray);
              } catch (error) {
                console.log(error.message);
              }
            };
    getProducts()
},[sortDirection])

const handleSortAscending = () => {
  setSortDirection("asc");
};

const handleSortDescending = () => {
  setSortDirection("desc");
};

useEffect(() => {
  fetch(`/api/products?type=${props}`)
    .then(response => response.json())
    .then(data => setProducts(data));
}, [props]);

  return (
    <div className='allproductpage'>
      <Navbar/>
      <button
          className={`sort-button ${
            sortDirection === "asc" ? "active" : ""
          }`}
          onClick={handleSortAscending}
        >
          Najlacnejšie
        </button>
        <button
          className={`sort-button ${
            sortDirection === "desc" ? "active" : ""
          }`}
          onClick={handleSortDescending}
        >
          Najdrahšie
        </button>
      <div className='allproductcontainer'>
        {products.map((product) => (
            <Productcontainer
          
            product={product}
            />           
        ))
        }       
      </div>
    </div>
  )
}

export default Allproductpage
