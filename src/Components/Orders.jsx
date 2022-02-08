import React, { useContext, useEffect, useState } from 'react'
import '../Styles/Orders.css'
import { DatabaseUserContext, UserContext, ProductContext } from '../App'
import { doc, onSnapshot } from '@firebase/firestore'
import { db } from '../Config/firebase'
import { useHistory } from 'react-router'



export const OrderedProduct = ({ id, name }) => {
    
    return <h1> {name} </h1>
}





const Orders = () => {

    const [products, setProducts, progress, setProgress] = useContext(ProductContext)
    const [user, setUser] = useContext(UserContext)
    const [databaseUser, setDatabaseUser] = useContext(DatabaseUserContext)
    const history = useHistory()




    return (
        <div className='orders'>

        <h1>Orders</h1>
            

        </div>
    )
}

export default Orders
