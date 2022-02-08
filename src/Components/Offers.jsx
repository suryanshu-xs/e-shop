import { collection, getDocs, onSnapshot, query, where } from '@firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../Config/firebase'
import { ProductDiv } from './Products'
import '../Styles/Offers.css';
import { motion } from 'framer-motion'
import { ProductContext } from '../App';



const Offers = () => {
    const [ offeredProducts,setOfferedProducts ] = useState([])
    const [products, setProducts, progress, setProgress] = useContext(ProductContext)
    

    useEffect(async () => {
        setProgress(true)
        const collectionRef = collection(db,'products')
        const q = query(collectionRef,where('discount','>=',10))
        const temp = []
    
        const unsub = onSnapshot(q,(snapshot)=>{
            snapshot.forEach((doc)=>{
                temp.push({
                    id:doc.id,
                    data:doc.data()
                })
            })
        })
        setOfferedProducts(temp)
        setProgress(false)

        return unsub
        
    }, [])

    console.log('offer',  offeredProducts);


    return (
        <div className='offers'>
            <h1 className='offers__headings'>Offers Available</h1>
            <motion.div className="offers__container" layout>
                { 
                    offeredProducts.map((product)=>{
                        return <ProductDiv id={product.id} {...product.data}/>
                    })
                 }
            </motion.div>
        </div>
    )
}

export default Offers
