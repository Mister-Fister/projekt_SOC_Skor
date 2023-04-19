import './App.css';
import{BrowserRouter , Routes, RouteProps, Route} from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import PgFOF from './Components/PgFOF';
import Cart from './Components/Cart';
import UserProfile from'./Components/UserProfile';
import Addproduct from './Components/Addproduct';
import Allproductpage from './Components/ProductShow/Allproductpage';
import Specificproductpage from './Components/ProductShow/Specificproductpage';
import SpecificproductpageAdmin from './Components/ProductShow/SpecificproductpageAdmin';
import CartInfo from './Components/CartInfo';
import CartFinal from './Components/CartFinal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='projekt_SOC_Skor/' element={<Home/>}/>
        <Route exact path='/' element={<Home/>}/>
        <Route exact path='/home' element={<Home/>}/>
        <Route exact path='/signup' element={<Signup/>}/>
        <Route exact path='/login' element={<Login/>}/>
        <Route exact path='/cart' element={<Cart/>}/>
        <Route exact path='/userprofile' element={<CartInfo/>}/>
        <Route exact path='/addproduct' element={<Addproduct/>}/>
        <Route exact path='/product-typemobiles' element={<Allproductpage type={'Mobile'}/>}/>
        <Route exact path='/product-type/kamery' element={<Allproductpage type={'Kamery'}/>}/>
        <Route exact path='/product-type/laptopy' element={<Allproductpage type={'Laptopy'}/>}/>
        <Route exact path='/product-type/tablety' element={<Allproductpage type={'Tablety'}/>}/>
        <Route exact path='/product-type/klávensnice' element={<Allproductpage type={'Klávensnice'}/>}/>
        <Route exact path='/product-type/myšky' element={<Allproductpage type={'Myšky'}/>}/>
        <Route exact path='/product/:type/:id' element={<Specificproductpage/>}/>
        <Route exact path='/product/:type/:id/admin' element={<SpecificproductpageAdmin/>}/>
        <Route exact path='/cartdata' element={<Cart/>}/>
        <Route exact path='/cartahoj' element={<CartInfo/>}/>
        <Route exact path='/cart/sumup' element={<CartFinal/>}/>
        <Route path='*' element={<PgFOF/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
