const functions = require("firebase-functions");
const express = require('express')
const cors = require('cors')

const stripe = require('stripe')('sk_test_51Jg04sSALDkyivISLdse8D7OVayogrhUzWs3SRRoUOF81VcLbVqQT52FvkxC2MUeCGWFTJZvcaX3NqVKSj9DVeoO00UFsu4rKv')

// API


// app config

const app = express()


// Middlewares
app.use(cors({ origin:'*' }))
app.use(express.json())


// API routes
app.get('/',(req,res)=>{
    res.send('Hello world')
})
app.post('/payments/create',async (req,res)=>{
    const total = req.query.total;
    console.log('Payment Request Received >> ',total)
    const paymentIntent = await stripe.paymentIntents.create({
        amount:total,
        currency:'INR'

    })

    res.status(201).send({
        clientSecret : paymentIntent.client_secret
    })
 //OK - Created Something
    
})


// Listen Command
exports.api = functions.https.onRequest(app)


//example endpoint
//http://localhost:5001/e-shop-1-1-1/us-central1/api