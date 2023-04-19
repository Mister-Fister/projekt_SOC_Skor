import React ,{useState} from 'react'
import trash from './assets/removebtn.png'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfigs/FirebaseConfig';
import { async } from '@firebase/util';

const CartInfocontainer = (props) => {

 const [productquantity, setProductQuantity] = useState(props.itemdata.quantity);
  let p = props.itemdata.product.price
  let tax = 10/100;

  let one = (parseFloat(p) + parseFloat(p) * tax).toFixed(2)
  let onedph = parseFloat(p)
  let alldph = (onedph * productquantity).toFixed(2)
  let mrp = parseFloat(p)
  mrp = (mrp + mrp * tax)*productquantity
  const saleprice = mrp.toFixed(2)

  const deletecartitem = async () => {
    await deleteDoc(doc(db,`cart-${props.userid}`,`${props.itemdata.id}`))
    .then(()=>{
      console.log('možno?')
    })
  }
  
  const increasequantity = async () =>{
    setProductQuantity(productquantity + 1)

    const itemref = doc(db,`cart-${props.userid}`, `${props.itemdata.id}`)
    await updateDoc(itemref,{
      quantity:productquantity +1
    })
  }
  const decreasequantity = async () =>{
    if(productquantity >=1){
      setProductQuantity(productquantity -1)
      const itemref = doc(db,`cart-${props.userid}`, `${props.itemdata.id}`)
      await updateDoc(itemref,{
        quantity:productquantity -1
      })
    }
    else{
      deletecartitem();
    }
  }

  

  return (
        <div className='cart-prod-container'>
        <div className='cart-prod-imgtitle'>
          <div className='prod-image'>
              <img src={props.itemdata.product.productimage}></img>
          </div>
          <div className='prod-title'>
              {props.itemdata.product.producttitle}
          </div>
        </div>
        <div className='prodquantity-div-container'>
          <div className='prodquantity-div-only'>
              {productquantity}
          </div>
        </div>
        <div className='one-price-contianer'>
          <div className='saleprice-one'>
            {one}€
          </div>
          <div className='dph'>
            {onedph.toFixed(2)}€ bez DPH
          </div>
        </div>

        <div className='prodprice'>
          <div className='saleprice'>
            {saleprice}€
          </div>
          <div className='dph'>
            {alldph}€ bez DPH
          </div>
        </div>
      </div>
  )
}

export default CartInfocontainer
