import React, { useState, useEffect, useContext } from 'react'
import '../Styles/SuccessfulOrder.css'
import { useHistory, useParams } from 'react-router'
import { db } from '../Config/firebase'
import { ProductContext, UserContext, DatabaseUserContext } from '../App'
import { doc, getDoc } from '@firebase/firestore'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ProductDiv } from './Products'
import { Button } from '@mui/material'
import { Link } from 'react-router-dom'


const SuccessfulOrder = () => {
    const { p_id, userId } = useParams()
    const [orderedProduct, setOrderedProduct] = useState(null)
    const [products, setProducts, progress, setProgress] = useContext(ProductContext)
    const [databaseUser, setDatabaseUser] = useContext(DatabaseUserContext)
    const [user, setUser] = useContext(UserContext)
    const history = useHistory()
    let globalRating = null
    window.scroll({ top: 0, left: 0 })


    useEffect(() => {
        setProgress(true)
        const docRef = doc(db, 'products', p_id)
        getDoc(docRef).then((doc) => {
            setOrderedProduct(doc.data())
        }).catch((error) => {
            alert('Some Error Occured', error)
        })
        setProgress(false)



    }, [p_id])

    if (orderedProduct) {

        orderedProduct.reviews.map((review) => {
            globalRating += review.rating
        })
        globalRating = (globalRating / orderedProduct.reviews.length).toFixed(1)
        // productTags = [...orderedProduct.tags, ...orderedProduct.category]
    }


    // console.log(orderedProduct?orderedProduct:'');
    // console.log('USER ',user);
    // console.log('DatabaseUser ',databaseUser);
    console.log(userId);
    if (userId !== user?.uid) {
        history.push('/')
    }

    return (
        <div className='orderSuccessfull'>

            <div className="successConfirmation">
                <h1 className='orderSuccessfull__heading'>Congratulations!!</h1>
                <CheckCircleIcon className='checkCircleIcon' />
                <h1 className='orderSuccessfull__heading2'>Your Product is on the way!!</h1>
            </div>

            <div className="orderInfo__container">

                {
                    orderedProduct ? <ProductDiv id={p_id} name={orderedProduct?.name} price={orderedProduct?.price} discount={orderedProduct?.discount} images={orderedProduct?.images} brandName={orderedProduct?.brandName} /> : <></>
                }

                <Link to='/' style={{ textDecoration:'none' }}> <Button variant='contained' className='orderInfo__container__backToHome'> Back To Home </Button>
                </Link>
            </div>

        </div>
    )
}

export default SuccessfulOrder
