import React, {useState , useEffect} from 'react'
import { collection, query, onSnapshot, getDocs } from 'firebase/firestore'
import { db } from '../../FirebaseConfigs/FirebaseConfig'
import "react-multi-carousel/lib/styles.css"
import Sliderproductcard from './Sliderproductcard'
import Navbar from '../Navbar'
import Carousel from 'react-multi-carousel'
import './ProductSlider.css'


const ProductSlider = (props) => {
    const responsive = {
        superLargeDesktop: {
          breakpoint: { max: 2000, min: 10 },
          items: 7
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 5
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 3
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 3
        }
      };

    const [products, setProducts] = useState([]);
    useEffect(() =>{
        const getProducts = () => {

            const productsArray = [];
            const path = `products-${props.type.toUpperCase()}`
            console.log(props)

            getDocs(collection(db,path)).then((querySnapshot)=>{
                querySnapshot.forEach((doc) => {
                    productsArray.push({ ...doc.data(), id: doc.id})
                    console.log(doc.id, " => ", doc.data());
                })
                setProducts(productsArray)
            }).catch('Error error error')
    }
    getProducts()
},[])


  return (
    <div>
      <Carousel className='cardslider-container2' responsive={responsive}>
        {products.map((product) => (
            <Sliderproductcard className="slide" key={product.id} product={product}/>
        )     
    )}
    </Carousel>
    </div>
  )
}

export default ProductSlider
