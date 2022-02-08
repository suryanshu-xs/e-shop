import React, { useEffect, useState, useContext } from 'react'
import '../Styles/Products.css'
import { db } from '../Config/firebase'
import { collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from '@firebase/firestore'
import { ProductContext } from '../App'
import { motion } from 'framer-motion'
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import RemoveShoppingCartRoundedIcon from '@mui/icons-material/RemoveShoppingCartRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Link } from "react-router-dom";
import { DatabaseUserContext } from '../App'
import { UserContext } from '../App'




const Products = () => {
    const collectionRef = collection(db, 'products')
    const [products, setProducts, progress, setProgress] = useContext(ProductContext)
    const [activeTab, setActiveTab] = useState('all')
    const [filter, setFilter] = useState('price');

    const [filterOrder, setFilterOrder] = useState('asc')


    useEffect(async () => {
        setProgress(true)
        try {
            const q = query(collectionRef, orderBy(filter, filterOrder))
            const temp = []
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                temp.push({
                    id: doc.id,
                    data: doc.data()
                })
            });
            setProducts(temp)

        } catch (error) {
            alert(error)
        }
        setProgress(false)
    }, [filter, filterOrder])




    return (
        <div className='products'>
            <h1 className='products__heading'>Product Overview</h1>

            <div className="products__tabs">

                <Button className='products__tabs__button' onClick={() => setActiveTab('all')}> All </Button>
                <Button className='products__tabs__button' onClick={() => setActiveTab('men')}> Men </Button>
                <Button className='products__tabs__button' onClick={() => setActiveTab('women')}> Women </Button>
                <Button className='products__tabs__button' onClick={() => setActiveTab('gadgets')}> Gadgets </Button>
                <Button className='products__tabs__button' onClick={() => setActiveTab('grocery')}> Grocery </Button>

            </div>

            <div className="products__filterTab">

                {/* <h1 className='products__filterTab__heading'>Filter</h1> */}
                <div className="products__filter__wrapper">

                    <Box sx={{ minWidth: 100 }} className='products__filterTab__box'>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Filter</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={filter}
                                label="Filter"
                                onChange={(event) => setFilter(event.target.value)}
                            >
                                <MenuItem className='select-label-menu' value={'price'}>Price</MenuItem>
                                <MenuItem className='select-label-menu' value={'purchased'}>Popularity</MenuItem>
                                <MenuItem className='select-label-menu' value={'discount'}>Discount</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ minWidth: 120 }} className='products__filterTab__box'>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Order By</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={filterOrder}
                                label="Order By"
                                onChange={(event) => setFilterOrder(event.target.value)}
                            >
                                <MenuItem className='select-label-menu' value={'asc'}>Ascending</MenuItem>
                                <MenuItem className='select-label-menu' value={'desc'}>Descending</MenuItem>

                            </Select>
                        </FormControl>
                    </Box>

                </div>

            </div>

            <motion.div className="product__container" layout>
                {
                    products?.map((product) => {

                        if (product.data) {
                            const { name, price, discount, images, purchased, reviews, soldBy, warranty, brandName, category } = product.data

                            if (activeTab === 'all') {
                                return <ProductDiv id={product.id} name={name} price={price} discount={discount} images={images} purchased={purchased} reviews={reviews} soldBy={soldBy} warranty={warranty} brandName={brandName} />
                            } else {


                                if (category.includes(activeTab)) {
                                    return <ProductDiv id={product.id} name={name} price={price} discount={discount} images={images} purchased={purchased} reviews={reviews} soldBy={soldBy} warranty={warranty} brandName={brandName} />
                                } else {
                                    return null
                                }
                            }

                        } else {
                            return null
                        }
                    })
                }
            </motion.div>

        </div>
    )
}


export const ProductDiv = ({ id, name, price, discount, images, purchased, reviews, soldBy, warranty, brandName }) => {

    const [open, setOpen] = useState(false);
    const [addedToWishList, setAddedToWishList] = useState(false)
    const [cartOpen, setCartOpen] = useState(false)
    const [addedToCart, setAddedToCart] = useState(false)
    const [databaseUser, setDatabaseUser] = useContext(DatabaseUserContext)
    const [user, setUser] = useContext(UserContext)

    useEffect(() => {
      
        if(databaseUser){

           
           if(databaseUser.wishlist?.includes(id)){
               setAddedToWishList(true)
           }
           if(databaseUser.cart?.includes(id)){
               setAddedToCart(true)
           }
            
        }
        
        


    }, [databaseUser,user])


    const handleWishList = () => {
        
        if (!addedToWishList) {
            // add to wishlist in database with product id = id
            if (databaseUser) {
                let newWishItem = [...databaseUser.wishlist, id]
                const docRef = doc(db, 'users', user.uid)
                updateDoc(docRef, {
                    wishlist: newWishItem
                })
                setOpen(true);
                setAddedToWishList(true)

            } else {
                alert('Please Sign In')
            }


        } else {

            if (databaseUser) {
                let newWishItem = []
                for (let i = 0; i < databaseUser.wishlist.length; i++) {
                    if (databaseUser.wishlist[i] !== id) {
                        newWishItem.push(databaseUser.wishlist[i])
                    }
                }
                updateDoc(doc(db,'users',user.uid),{
                    wishlist:newWishItem
                })
                setOpen(true);
                setAddedToWishList(false)
            }

        }



    };
    const handleCart = () => {
       

        if (!addedToCart) {

            if (databaseUser) {
                let newCartList = [...databaseUser.cart, id]
                const docRef = doc(db, 'users', user.uid)
                updateDoc(docRef, {
                    cart: newCartList
                })
                setCartOpen(true);
                setAddedToCart(true)

            } else {
                alert('Please Sign In')
            }


        } else {

            if (databaseUser) {
                let cartList = []
                for (let i = 0; i < databaseUser.cart.length; i++) {
                    if (databaseUser.cart[i] !== id) {
                        cartList.push(databaseUser.cart[i])
                    }
                }
                updateDoc(doc(db,'users',user.uid),{
                    cart:cartList
                })
                setCartOpen(true);
                setAddedToCart(false)
            }

        }


        
    }








    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        setCartOpen(false)
    };



    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleWishList}>
                UNDO
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );
    const actionCart = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleCart}>
                UNDO
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );


    return (
        <>
            <div className='productBox' key={id}>
                <div className="productBox__imagewrapper" >
                    <img src={images[0]} alt="" className='productBox__image'/>
                </div>

                <div className="productBox__options">
                    <p className="productBox__options__brandName">
                        {brandName}
                    </p>
                    <div className="productBox__options__buttons">
                        <IconButton onClick={handleWishList}>  {addedToWishList ? <FavoriteRoundedIcon className='wishlistButtons' /> : <FavoriteBorderRoundedIcon className='wishlistButtons' />}  </IconButton>

                        <IconButton onClick={handleCart}>  {addedToCart ? <RemoveShoppingCartRoundedIcon className='cartButtons' /> : <ShoppingCartRoundedIcon className='cartButtons' />}  </IconButton>
                    </div>
                </div>

                <Link to={`/productinfo/${id}`} style={{ textDecoration: 'none',width:'100%' }}>   <div className="productBox__details">
                    <p className="productBox__details__name">
                        {name.length > 40 ? `${name.substring(0, 41)} ....` : name}
                    </p>
                    <p className="productBox__details__price">
                        <span className='productBox__details__price__span' >{`₹  ${price - ((discount / 100) * price).toFixed()}`}</span>


                        <del>{`₹ ${price}`}</del>
                        <span className='productBox__details__price__span__span' >{discount}% off </span>
                    </p>
                </div>
                </Link>

            </div>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                message={addedToWishList ? 'Added To Wishlist' : 'Removed From WishList'}
                action={action}
            />
            <Snackbar
                open={cartOpen}
                autoHideDuration={3000}
                onClose={handleClose}
                message={addedToCart ? 'Added To Cart' : 'Removed From Cart'}
                action={actionCart}
            />
        </>
    )
}
export default Products
