import React, { useState, useEffect, useContext } from 'react'
import '../Styles/ProductInfo.css'
import { useParams } from 'react-router'
import { db } from '../Config/firebase'
import { arrayUnion, collection, doc, getDocs, onSnapshot, serverTimestamp, updateDoc } from '@firebase/firestore'
import { ProductContext, UserContext, DatabaseUserContext } from '../App'
import Rating from '@mui/material/Rating';
import { Slide } from 'react-slideshow-image'
import "react-slideshow-image/dist/styles.css";
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import RemoveShoppingCartRoundedIcon from '@mui/icons-material/RemoveShoppingCartRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import CreateIcon from '@mui/icons-material/Create';
import TextField from '@mui/material/TextField';
import { ProductDiv } from './Products'
import { Link } from 'react-router-dom'




const properties = {
    duration: 4000,
    transitionDuration: 650,
    infinite: true,
    indicators: true,
    prevArrow: <div className='productInfo__slider__arrow slider__arrow__left'><IconButton> <ArrowBackIosNewRoundedIcon className='productInfo__arrow__icon' /> </IconButton> </div>,
    nextArrow: <div className='productInfo__slider__arrow slider__arrow__right'> <IconButton > <ArrowForwardIosRoundedIcon className='productInfo__arrow__icon' /> </IconButton> </div>,
}




const ProductInfo = () => {
    const { p_id } = useParams()
    const [products, setProducts, progress, setProgress] = useContext(ProductContext)
    const [productInfo, setProductInfo] = useState(null)
    const [open, setOpen] = React.useState(false);
    const [addedToWishList, setAddedToWishList] = useState(false)
    const [cartOpen, setCartOpen] = useState(false)
    const [addedToCart, setAddedToCart] = useState(false)
    const [UserRatingValue, setUserRatingValue] = useState(0)
    const [databaseUser, setDatabaseUser] = useContext(DatabaseUserContext)
    const [user, setUser] = useContext(UserContext)
    const [userReview,setUserReview] = useState('')

    let globalRating = null
    
    let relatedProducts = []

    useEffect(() => {
        window.scroll({ top: 0, left: 0 })

    }, [productInfo])

    useEffect(() => {


        if (databaseUser) {
            if (databaseUser.wishlist?.includes(p_id)) {
                setAddedToWishList(true)
            }
            if (databaseUser.cart?.includes(p_id)) {
                setAddedToCart(true)
            }

        }
        
    }, [databaseUser])


    const handleReviewSubmit = async (event) =>{
        const date = new Date()
        event.preventDefault();
        console.log('rating = ',UserRatingValue)
        console.log('rewiew =',userReview)
        const docRef = doc(db,'products',p_id);
        try {
            await updateDoc(docRef,{
            reviews:arrayUnion({
                customerName:databaseUser.name,
                rating:UserRatingValue,
                review:userReview,
                reviewedAt:date.toDateString()
            })
            
        })
        } catch (error) {
            alert(error)
        }
        setUserReview('')
        setUserRatingValue(0)

    }


    const handleWishList = () => {
        if (!addedToWishList) {
            // add to wishlist in database with product id = id
            if (databaseUser) {
                let newWishItem = [...databaseUser.wishlist, p_id]
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
                //remove from wishlist with product id = id
                for (let i = 0; i < databaseUser.wishlist.length; i++) {
                    if (databaseUser.wishlist[i] !== p_id) {
                        newWishItem.push(databaseUser.wishlist[i])
                    }
                }
                updateDoc(doc(db, 'users', user.uid), {
                    wishlist: newWishItem
                })
                setOpen(true);
                setAddedToWishList(false)
            }

        }
    };


    const handleCart = () => {

        if (!addedToCart) {
            // add to cart in database with product id = id

            if (databaseUser) {
                let newCartList = [...databaseUser.cart, p_id]
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
                //remove from wishlist with product id = id
                for (let i = 0; i < databaseUser.cart.length; i++) {
                    if (databaseUser.cart[i] !== p_id) {
                        cartList.push(databaseUser.cart[i])
                    }
                }
                updateDoc(doc(db, 'users', user.uid), {
                    cart: cartList
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

    useEffect(async () => {
        setProgress(true)
        const docRef = doc(db, 'products', p_id)
        const temp = []

        onSnapshot(docRef, (snapshot) => {

            setProductInfo(snapshot.data())
        })
        const collectionRef = collection(db, 'products');

        const querySnapshot = await getDocs(collectionRef)
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            temp.push({
                id: doc.id,
                data: doc.data()
            })
        });
        setProducts(temp)
        setProgress(false)


    }, [p_id])

    if (productInfo) {

        productInfo.reviews.map((review) => {
            globalRating += review.rating
        })
        globalRating = (globalRating / productInfo.reviews.length).toFixed(1)
        // productTags = [...productInfo.tags, ...productInfo.category]

        if (relatedProducts.length === 0) {
            getRelatedProducts()
        }

    }
    function getRelatedProducts() {

        if (products!==null && productInfo.category.length > 0) {

            if (relatedProducts.length === 0) {

                for (let i = 0; i < products.length; i++) {

                    for (let j = 0; j < productInfo.category.length; j++) {
                        if (products[i].data.category.includes(productInfo.category[j])) {
                            if (!relatedProducts.includes(products[i])) {
                                if (p_id !== products[i].id) {
                                    relatedProducts.push(products[i])
                                }

                            }
                        }

                    }
                }
                setProgress(false)
            }
        }

    }


    return (
        <>
            <div className='productInfo' >

                <div className="productInfo__image__container">

                    {
                        productInfo?.name ? <Slide {...properties} className='productInfo__image__wrapper'>
                            {productInfo.images.map((slideImage, index) => (
                                <div className="each-slide" key={index}>
                                    <div style={{ 'backgroundImage': `url(${slideImage})` }} className='each-slide-image'>
                                    </div>
                                </div>
                            ))}
                        </Slide> : <></>
                    }



                </div>

                <div className="productInfo__information__container">



                    {
                        productInfo?.name ? <>
                            <h3 className="information__container__brand">
                                {productInfo.brandName}
                            </h3>
                            <h2 className='productInfo__information__name'> {productInfo.name} </h2>
                            <p className='productInfo__information__sepcialPrice'> {productInfo.discount > 5 ? 'Speical Price' : ''} </p>

                            <h1 className="productInfo__information__price">
                                ₹{productInfo.price - ((productInfo.discount / 100) * productInfo.price).toFixed()}  <small> <del> ₹{productInfo?.price} </del> <span>  {productInfo.discount}% off </span></small>
                            </h1>

                            <Rating name="read-only" value={globalRating} readOnly className='productInfo__information__rating' />

                            <p className="productInfo__information__purchased">
                                <span>{productInfo.purchased}</span> Sold and <span> {productInfo.reviews.length} </span>  Reviews
                            </p>

                            {
                                productInfo.warranty ? <p className="productInfo__information__warranty">
                                    {`Warranty ${productInfo.warranty} years`}
                                </p> : <></>
                            }

                            <p className="productInfo__information__available">
                                {
                                    productInfo.available ? 'In Stock' : ' Out Of Stock '
                                }
                            </p>

                            <div className="productBox__options__buttons">
                                <IconButton onClick={handleWishList}>  {addedToWishList ? <FavoriteRoundedIcon className='wishlistButtons' /> : <FavoriteBorderRoundedIcon className='wishlistButtons' />}  </IconButton>
                            </div>


                            <div className="productInfo__information__checkout">
                                {
                                    productInfo.available ? <>
                                        <Link to={`/checkout/${p_id}`} style={{ textDecoration:'none' }}> <Button variant="contained" className='productInfo__information__checkout__button'>
                                            Buy Now <AddShoppingCartIcon className='productInfo__cartButtons' />
                                        </Button>
                                        </Link>
                                        <Button variant="contained" className='productInfo__information__checkout__button' onClick={handleCart} >
                                            Add To Cart  {addedToCart ? <RemoveShoppingCartRoundedIcon className='productInfo__cartButtons' /> : <ShoppingCartRoundedIcon className='productInfo__cartButtons' />}
                                        </Button>
                                    </> : <Button variant="contained" className='productInfo__information__checkout__button'>
                                        Notify Me
                                    </Button>
                                }
                            </div>

                            <Accordion className='productInfo__information__accordion'>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    className='productInfo__information__accordionSummary'
                                >
                                    <Typography className='accordion__heading'>Sold By</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography className='accordion__details'>

                                        {productInfo.soldBy.map((sellerInfo) => {
                                            return <div className='sellerInfo'>
                                                <span className='sellerInfo__name'>{sellerInfo.sellerName}  </span>
                                                <span className='sellerInfo__address'>{sellerInfo.sellerAddress}</span>
                                            </div>
                                        })}

                                    </Typography>
                                </AccordionDetails>
                            </Accordion>

                            <div className="productInfo__reviewsContainer">
                                <form className="reviewsContainer__userReview" onSubmit={handleReviewSubmit}>
                                    <TextField id="standard-basic" label="Write Review" variant="standard" color="success" required onChange={(e)=>{
                                        setUserReview(e.target.value)
                                    }}/>
                                    <div className="reviewsContainer__userRating">

                                        <Rating

                                            name="simple-controlled"
                                            value={UserRatingValue}
                                            onChange={(event, newValue) => {
                                                setUserRatingValue(newValue);
                                            }}
                                        />
                                        <p> Rate Product </p>
                                    </div>
                                    <Button type='submit' variant="contained" className='reviewsContainer__userRating__button'> Post  <CreateIcon className='productInfo__cartButtons' /> </Button>
                                </form>
                                <div className="reviewsContainer__heading">

                                    <span className='reviewsContainer__heading__heading'> Ratings & Reviews </span>

                                    <span className='reviewsContainer__heading__star'>
                                        <span> {globalRating}</span> <StarIcon className='reviewsContainer__heading__starIcon' />
                                    </span>

                                </div>
                                <div className="reviewsContainer__numbers">

                                    <span className='reviewsContainer__numbers__numbers'> <span> {productInfo.reviews.length} </span> Ratings and  Reviews </span>
                                </div>

                                <div className="reviewsContainer__customerReviews">

                                    <h3 className='customerReviews__heading' > Customer Reviews </h3>

                                    {
                                        productInfo.reviews.map((review, index) => {
                                            return <div key={index} className="customerReviews__customerReviews">
                                                <div className="rating__and__review__wrapper">

                                                    <div className="customerReviews__rating">
                                                        <span> {review.rating} </span> <StarIcon className='customerReviews__rating__starIcon' />

                                                    </div>
                                                    <p className='customerReviews__review'>
                                                        {review.review}
                                                    </p>
                                                </div>
                                                <div className="name__and__date__wrapper">

                                                    <p className="customerReviews__name">
                                                        {review.customerName}
                                                    </p>
                                                    <p className="customerReviews__date">
                                                        {
                                                            review.reviewedAt
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        })
                                    }


                                </div>



                            </div>


                        </> : <></>
                    }




                </div>




            </div>
            {
                relatedProducts.length > 0 ? <div className="similarProducts">
                    <h1 className='similarProducts__heading'> Related To This Item </h1>
                    <div className="similarProducts__container product__container">
                        {
                            relatedProducts.map((relatedProduct) => {
                                if (relatedProduct.data) {
                                    const { name, price, discount, images, purchased, reviews, soldBy, warranty, brandName, category } = relatedProduct.data
                                    return <ProductDiv id={relatedProduct.id} name={name} price={price} discount={discount} images={images} purchased={purchased} reviews={reviews} soldBy={soldBy} warranty={warranty} brandName={brandName} />
                                }
                            })
                        }
                    </div>
                </div> : <></>
            }
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

export default ProductInfo
