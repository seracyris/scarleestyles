import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Styleish from './Pages/Styleish'
import Fckface from './Pages/Fckface'
import FckishPhotos from './Pages/FckishPhotos'
import Contact from './Pages/Contact'
import About from './Pages/About'
import Detail from './Pages/Detail'
import Admin from './Pages/Admin'
import CheckoutPage from './Components/Styleish/Checkout'
import Register from './Components/users/Register';
import Login from './Components/users/Login';
import Account from './Components/users/Account';
import PrivateRoute from './Components/PrivateRoute';
import Navigation from './Pages/Navigation'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigation />}>
            <Route index element={<Home />} />
            <Route path="/styleish" element={<Styleish />} />
            <Route path="/fckface" element={<Fckface />} />
            <Route path="/fckish-photos" element={<FckishPhotos />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/styleish/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route path="/account" element={<Account />} />
            </Route>
            <Route path="products/:slug" element={<Detail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
