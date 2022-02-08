import { collection, doc, onSnapshot, updateDoc } from '@firebase/firestore'
import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router'
import { db } from '../Config/firebase'
import { ProductDiv } from './Products'
import '../Styles/Checkout.css'
import { ProductContext, DatabaseUserContext, UserContext } from '../App'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from '../Config/axios'
import { useHistory } from 'react-router'

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const Checkout = () => {
    const { p_id } = useParams()
    const [productToBeOrderd, setProductToBeOrderd] = useState(null)
    const [products, setProducts, progress, setProgress] = useState(ProductContext)
    const [user, setUser] = useContext(UserContext)
    const [databaseUser, setDatabaseUser] = useContext(DatabaseUserContext)
    const stripe = useStripe()
    const elements = useElements()
    const [error, setError] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [succeeded, setSucceeded] = useState(false)
    let productPrice = 0
    const [deliveryDetails, setDeliveryDetails] = useState({})
    const [clientSecret, setClientSecret] = useState(true)
    const history = useHistory()

    useEffect(() => {
        //generate the special stripe secret which allows us to charge the customer.
        const getClientSecret = async () => {
            if (productToBeOrderd) {
                if (productPrice !== 0) {
                    const response = await axios({
                        method: 'post',
                        //Stripe expects the total in a currencies subunits
                        url: `/payments/create?total=${productPrice * 100}`
                    });
                    //    ;  response.data.clientSecret
                    setClientSecret(response.data.clientSecret)
                }
            }
        }
        window.scroll({ top: 0, left: 0 })

        getClientSecret()
    }, [productToBeOrderd])


    useEffect(() => {

        if (databaseUser) {
            setDeliveryDetails({
                name: databaseUser.name,
                email: databaseUser.email,
                address: databaseUser.address
            })
        }


    }, [databaseUser])

    useEffect(() => {

        const docRef = doc(db, 'products', p_id)
        onSnapshot(docRef, (snapshot) => {
            setProductToBeOrderd(snapshot.data())
        })


    }, [])

    if (productToBeOrderd) {
        productPrice = productToBeOrderd?.price - ((productToBeOrderd?.discount / 100) * productToBeOrderd?.price).toFixed()
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setProcessing(true)
        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({ paymentIntent }) => {
            //payment confirmation
            setSucceeded(true)
            setError(null)
            setProcessing(false)

            const docRef = doc(db, 'users', user.uid)
            //  let newOrdersList = [...databaseUser.orders, p_id]
            //  console.log(newOrdersList);

            updateDoc(docRef, {
                orders: [p_id, ...databaseUser.orders]
            })


            //insert orders in the database

            history.replace(`/orderSuccessful/${p_id}/${user.uid}`)
            const productDocRef = doc(db,'products',p_id)
            updateDoc(productDocRef,{
                purchased:productToBeOrderd.purchased+1
            })

        }).catch((error) => {
            alert('Please try again')
        })

        // do all the fancy stripe stuff

    }

    const handleCardChange = (event) => {
        // Listen for changes in the CardElement and display any errors as the customer types their card details.
        setDisabled(event.empty)
        setError(event.error ? event.error.message : "")
    }


    return (
        <div className='checkout'>
            <h1 className='checkout__heading'>Order Details</h1>
            <div className="productsToBeOrderdContainer">
                <div className="productsToBeOrderd">
                    {productToBeOrderd ? <ProductDiv id={p_id} {...productToBeOrderd} /> : <></>}
                </div>
                <div className="productsToBeOrderdSummary">
                    <p className="productsToBeOrderdSummary__brand">
                        {productToBeOrderd?.brandName}
                    </p>
                    <p className="productsToBeOrderdSummary__name">
                        {productToBeOrderd?.name}
                    </p>

                    <p className="productsToBeOrderdSummary__price">
                        Total : <span> ₹  {productPrice} </span>
                    </p>
                    <p className="productsToBeOrderdSummary__deliverycharge">
                        {productPrice > 40 ? <> <del>₹ 40</del> <span>Free Delivery</span> </> : <> ₹ {productPrice += 40} {productPrice} </>}
                    </p>
                    <p className="productsToBeOrderdSummary__total">

                        <span> Grand Total : </span>


                        {productPrice > 40 ?
                            <strong> ₹ {productPrice} </strong> :

                            <strong>
                                {productPrice + 40}
                            </strong>}

                    </p>
                </div>
            </div>

            {databaseUser ? <>
                <h1 className='confirmDetails'>Confirm Delivery Details</h1>
                <div className="cofirmDeliveryDetails">


                    <div className="confirmEmail confirmInputDiv">
                        <span> Your Name : </span>  <TextField
                            id="outlined-multiline-flexible"
                            label="Name"
                            multiline
                            maxRows={4}
                            value={deliveryDetails?.name}
                            onChange={(e) => setDeliveryDetails({ ...deliveryDetails, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="confirmEmail confirmInputDiv">
                        <span> Your Email : </span>  <TextField
                            id="outlined-multiline-flexible"
                            label="Email"
                            multiline
                            maxRows={4}
                            value={deliveryDetails?.email}
                            onChange={(e) => setDeliveryDetails({ ...deliveryDetails, email: e.target.value })}
                            required
                            type='email'
                        />
                    </div>

                    <div className="confirmEmail confirmInputDiv">
                        <span> Deliver To : </span>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Address"
                            multiline
                            rows={4}

                            value={deliveryDetails?.address}
                            onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })}
                            required
                        />
                    </div>





                </div>
                <div className="payment__section">
                    <div className="payment__title">
                        <h2> Payment Method </h2>
                    </div>
                    <div className="payment__details">
                        <form className='card__form' onSubmit={handleSubmit}>

                            <CardElement onChange={handleCardChange} />

                            <div className="payment__priceContainer">
                                <p> Order Total :
                                    <span>₹ {productPrice}  </span>
                                </p>
                                <Button variant='contained' disabled={processing || disabled || succeeded} className='placeOrderButton' type='submit'>

                                    <span> {processing ? 'Processing' : 'Place Order'} </span>

                                </Button>
                            </div>

                            {error && <Snackbar open={true} autoHideDuration={6000} >
                                <Alert severity="error" sx={{ width: '100%' }}>
                                    {error}
                                </Alert>
                            </Snackbar>}

                        </form>
                    </div>
                </div>
            </> : <>
                <h1 className=' confirmOrderWarning '>
                    Your need to SignIn or Create an E-shop account to continue
                </h1>
                <Link to='/' style={{ textDecoration: 'none' }}>
                    <Button variant='contained' className='backToHome' >
                        Back To Home
                    </Button>
                </Link>
            </>
            }




            <div style={{ height: '100vh' }}></div>



        </div>
    )
}

export default Checkout
