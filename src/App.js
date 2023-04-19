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
        <Route exact path='projekt_SOC_Skor/home' element={<Home/>}/>
        <Route exact path='projekt_SOC_Skor/signup' element={<Signup/>}/>
        <Route exact path='/login' element={<Login/>}/>
        <Route exact path='projekt_SOC_Skor/cart' element={<Cart/>}/>
        <Route exact path='projekt_SOC_Skor/userprofile' element={<UserProfile/>}/>
        <Route exact path='projekt_SOC_Skor/addproduct' element={<Addproduct/>}/>
        <Route exact path='projekt_SOC_Skor/product-type/mobiles' element={<Allproductpage type={'Mobile'}/>}/>
        <Route exact path='projekt_SOC_Skor/product-type/kamery' element={<Allproductpage type={'Kamery'}/>}/>
        <Route exact path='projekt_SOC_Skor/product-type/laptopy' element={<Allproductpage type={'Laptopy'}/>}/>
        <Route exact path='projekt_SOC_Skor/product-type/tablety' element={<Allproductpage type={'Tablety'}/>}/>
        <Route exact path='projekt_SOC_Skor/product-type/klávensnice' element={<Allproductpage type={'Klávensnice'}/>}/>
        <Route exact path='projekt_SOC_Skor/product-type/myšky' element={<Allproductpage type={'Myšky'}/>}/>
        <Route exact path='projekt_SOC_Skor/product/:type/:id' element={<Specificproductpage/>}/>
        <Route exact path='projekt_SOC_Skor/product/:type/:id/admin' element={<SpecificproductpageAdmin/>}/>
        <Route exact path='projekt_SOC_Skor/cartdata' element={<Cart/>}/>
        <Route exact path='projekt_SOC_Skor/cartahoj' element={<CartInfo/>}/>
        <Route exact path='projekt_SOC_Skor/cart/sumup' element={<CartFinal/>}/>
        <Route path='*' element={<PgFOF/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
