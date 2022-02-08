import React, { createContext, useEffect, useState } from 'react'
import './App.css';
import Header from './Components/Header';
import SubHeader from './Components/SubHeader';
import ImageSlider from './Components/ImageSlider';
import Products from './Components/Products'
import Checkout from './Components/Checkout';
import SellerDashboard from './Components/SellerDashboard';
import HeaderOptions from './Components/HeaderOptions'
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { Switch, Route } from 'react-router-dom';
import ProductInfo from './Components/ProductInfo';
import NoMatch from './Components/NoMatch'
import SignUp from './Components/SignUp';
import { onAuthStateChanged } from '@firebase/auth';
import { db, auth } from './Config/firebase';
import { doc, onSnapshot } from '@firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import SuccessfulOrder from './Components/SuccessfulOrder'
import Offers from './Components/Offers';
import MyAccount from './Components/MyAccount';


const promise = loadStripe('pk_test_51Jg04sSALDkyivIS8CSIcr4Xtp8y1W8uR6IcfBGunzt56hlIYi5FhUElJXNgIvvIQUJ8rx3BPH0ZiZsl1v08Tw4C00tq6CM5Fp')


export const ProductContext = createContext()
export const UserContext = createContext()
export const DatabaseUserContext = createContext()

function App() {
  const [products, setProducts] = useState(null)
  const [progress, setProgress] = useState(false)
  const [user, setUser] = useState(null)
  const [databaseUser, setDatabaseUser] = useState(null)


  useEffect(() => {

    const unsub = onAuthStateChanged(auth, (userCredentials) => {
      if (userCredentials) {
        setUser(userCredentials)
      } else {
        setUser(null)
        setDatabaseUser(null)


      }
    })
    window.scroll({ top: 0, left: 0 })
    return unsub
  }, [])

  useEffect(() => {

    if (user) {
      const docRef = doc(db, 'users', user.uid)
      const unsub = onSnapshot(docRef, (doc) => {
        setDatabaseUser(doc.data())
      })

    }

  }, [user])
  return (
    <>
      {progress ? <Box sx={{ width: '100%' }} className='progressBar'>
        <LinearProgress />
      </Box> : null}
      <DatabaseUserContext.Provider value={[databaseUser, setDatabaseUser]}>
        <ProductContext.Provider value={[products, setProducts, progress, setProgress]}>
          <UserContext.Provider value={[user, setUser]}>
            <Switch>
              <Route exact path='/'>
                <Header />
                <SubHeader />
                <ImageSlider />
                <Products />
              </Route>
            

              <Route exact path='/productinfo/:p_id'>
                <Header />
                <ProductInfo />
              </Route>

              <Route exact path='/checkout/:p_id'>
                <Header />
                <Elements stripe={promise}>
                  <Checkout />
                </Elements>
              </Route>


              <Route exact path='/signup'>
                <Header />
              </Route>

              <Route exact path='/headerOptions/myAccount/:userId'>     
                <Header />
                <MyAccount/>
              </Route>

              <Route exact path='/orderSuccessful/:p_id/:userId'>
               
                <Header />
                <SuccessfulOrder />
               
              </Route>

              <Route exact path='/headerOptions/:option/:userId'>
               
                <Header />
                <HeaderOptions />
               
              </Route>
              <Route exact path='/sellerAccount/:userId'>
               
                <Header />
                <SellerDashboard />
               
              </Route>

              <Route path="*">
                <NoMatch />
              </Route>

            </Switch>
          </UserContext.Provider>
        </ProductContext.Provider>
      </DatabaseUserContext.Provider>
    </>
  );
}

export default App;
