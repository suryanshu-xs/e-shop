import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { db } from '../Config/firebase'
import { DatabaseUserContext, UserContext, ProductContext } from '../App'
import { ProductDiv } from './Products'
import '../Styles/HeaderOptions.css'
import { collection, doc, getDocs, onSnapshot, query, where } from '@firebase/firestore'
import { motion } from 'framer-motion'
import { useHistory } from 'react-router'


const HeaderOptions = () => {
    const { option, userId } = useParams()
    const [databaseUser, setDatabaseUser] = useContext(DatabaseUserContext)
    const [user, setUser] = useContext(UserContext)
    const [products, setProducts, progress, setProgress] = useContext(ProductContext)

    const [optionData, setOptionData] = useState(null)
    const [queriedProducts, setQueriedProducts] = useState(null)
    const history = useHistory()

    useEffect(() => {
        setProgress(true)
        const userDocRef = doc(db, 'users', userId);
        const unsub = onSnapshot(userDocRef, (snapshot) => {
            switch (option) {
                case 'orders': setOptionData(snapshot.data().orders);
                    break;

                case 'cart': setOptionData(snapshot.data().cart);
                    break;

                case 'wishlist': setOptionData(snapshot.data().wishlist);
                    break;

                default:
                    history.push('/')
                    break;
            }
        })


        setProgress(false)

        return unsub

    }, [option])


    useEffect(async () => {
        setProgress(true)
        let temp = []
        const collectionRef = collection(db, 'products')
        const querySnapshot = await getDocs(collectionRef);
        querySnapshot.forEach((doc) => {
            if (optionData?.includes(doc.id)) {
                temp.push({
                    id: doc.id,
                    data: doc.data()
                })
            }
        })
        setQueriedProducts(temp)
        setProgress(false)

    }, [optionData])


    if (queriedProducts) {
        console.log(queriedProducts)
    }


    return (
        <>
            <div className='headerOptions'>
                <h1 className='headerOptions__heading'> Your {option} </h1>

                <motion.div className="productOptionContainer" layout>
                    {
                        queriedProducts?.map((product) => {
                            return <ProductDiv id={product.id} {...product.data} />
                        })
                    }
                </motion.div>
            </div>

        </>
    )
}

export default HeaderOptions
