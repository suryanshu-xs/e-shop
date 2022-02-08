import React, { useContext, useEffect, useRef, useState } from 'react'
import '../Styles/SellerDashboard.css'
import { useHistory, useParams } from 'react-router'
import { UserContext, DatabaseUserContext, ProductContext } from '../App'
import SellerAccordion from './SellerAccordion'
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import { Button } from '@mui/material'
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import SnackBarMessage from './SnackBarMessage'
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Typography } from '@mui/material'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { addDoc, arrayUnion, collection, doc, updateDoc } from '@firebase/firestore'
import Checkbox from '@mui/material/Checkbox';
import { db, storage } from '../Config/firebase'
import { ProductDiv } from './Products'
import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage'




const SellerDashboard = () => {
    const { userId } = useParams()
    const [user, setUser] = useContext(UserContext)
    const [databaseUser, setDatabaseUser] = useContext(DatabaseUserContext)
    const [products, setProducts, progress, setProgress] = useContext(ProductContext)

    const [radionBtnChange, setRadioBtnChange] = useState(false)
    const history = useHistory()

    const [storeInfo, setStoreInfo] = useState({
        storeName: '',
        storeAddress: ''
    })
    const [uploadedProductId, setUploadedProductId] = useState(null)
    const [testCheck, setTestCheck] = useState(false)
    const [categoryArray, setCategoryArray] = useState([])
    const [productInfo, setProductInfo] = useState({
        available: true,
        brandName: '',
        category: categoryArray,
        images: [],
        warranty: 0,
        discount: 0,
        name: '',
        price: 0,
        soldBy: []
    })
    const imageFileName = useRef(null)
    const [fileArray, setFileArray] = useState([])
    const [openSnackBar, setOpenSnackBar] = useState(false)
    const [message, setMessage] = useState({
        message: '',
        messageType: ''
    })



    const handleSellerInformationSubmit = async (event) => {
        event.preventDefault()
        const docRef = doc(db, 'users', userId)
        try {
            await updateDoc(docRef, {
                isSeller: true,
                storeName: storeInfo.storeName,
                storeAddress: storeInfo.storeAddress
            })
        } catch (error) {
            alert(error)
        }


    }
    const handleRadioBtnCheck = (event) => {
        if (event.target.checked) {
            setCategoryArray([...categoryArray, event.target.name])
        } else {
            let temp = categoryArray.filter((name, index) => {
                return name !== event.target.name
            })
            setCategoryArray(temp)
        }
        setProductInfo({ ...productInfo, category: categoryArray })
    }


    const handleProductImages = (event) => {
        // let temp = []
        //  const files = [...event.target.files]
        //  files.map((file)=>{
        //     temp.push(file)

        //  })

        //  setFileArray(temp)

        setFileArray(event.target.files)


    }



    const initalizeWithNewValues = () => {
        setProductInfo({ ...productInfo, category: [...categoryArray] })
        setProductInfo({
            ...productInfo, soldBy: [
                {
                    sellerName: databaseUser.storeName,
                    sellerAddress: databaseUser.storeAddress
                }
            ]
        })
    }

    const uploadImage = () => {
        setProgress(true)



        for (let i = 0; i < fileArray.length; i++) {
            const storageRef = ref(storage, `productsImages/${user.uid}/${fileArray[i].name}`)
            const file = fileArray[i];

            const uplaodTask = uploadBytesResumable(storageRef, file);
            uplaodTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }, (error) => {
                setProgress(false)
                setOpenSnackBar(true)
                setMessage({
                    message: error.message,
                    messageType: 'error'
                })


            }, () => {
                getDownloadURL(uplaodTask.snapshot.ref).then((downloadURL) => {
                    const docRef = doc(db, 'products', uploadedProductId)
                    updateDoc(docRef, {
                        images: arrayUnion(downloadURL)
                    }).then(() => {
                        setProgress(false)
                        setOpenSnackBar(true)
                        setMessage({
                            message: 'Product Updated',
                            messageType: 'success'
                        })
                        history.push('/')
                        
                    }).catch((error) => {
                        setProgress(false)
                        setOpenSnackBar(true)
                        setMessage({
                            message: error.message,
                            messageType: 'error'
                        })

                    })
                })
            })
        }
    }
    const uplaodProductDetails = async () => {

        setProgress(true)
        const docRef = await addDoc(collection(db, 'products'), {
            available: productInfo.available,
            brandName: productInfo.brandName,
            category: productInfo.category,
            discount: productInfo.discount > 0 ? productInfo.discount : null,
            name: productInfo.name,
            price: productInfo.price,
            warranty: productInfo.warranty > 0 ? productInfo.warranty : null,
            soldBy: [
                {
                    sellerName: databaseUser.storeName,
                    sellerAddress: databaseUser.storeAddress
                }
            ],
            images: [],
            reviews: [],
            purchased: 0

        })
        setProgress(false)
        setUploadedProductId(docRef.id)



    }
    useEffect(() => {


        if (uploadedProductId) {
            uploadImage()
        }

    }, [uploadedProductId])

    const handleProductFormSubmit = (event) => {
        event.preventDefault()
        initalizeWithNewValues()

        //upload the form except the image feild
        uplaodProductDetails()




    }

    return (
        <div className='sellerDashboard'>
            <h2 className='sellerDashboard__heading'> Welcome {databaseUser?.name} </h2>
            {
                !databaseUser?.isSeller ? <>
                    <h3 className='sellerDashboard__prompt'> Let's set up your E-shop Seller Account. </h3>
                    <div className="sellerDashboard__form__wrapper">

                        <div className="sellerDashboard__form">
                            <form className="testDiv" onSubmit={handleSellerInformationSubmit}>

                                <div className='sellerDashboard__form__inputWithIcon'>
                                    <Typography> Store Name :  </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                        <TextField id="input-with-sx"
                                            label='Your Store'
                                            variant="standard"
                                            required
                                            onChange={(e) => {
                                                setStoreInfo({
                                                    ...storeInfo,
                                                    storeName: e.target.value
                                                })
                                            }} />
                                    </Box>
                                </div>

                                <div className='sellerDashboard__form__inputWithIcon'>
                                    <Typography> Store Address :  </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                        <TextField id="input-with-sx" label='Address' variant="standard" required onChange={(e) => {
                                            setStoreInfo({
                                                ...storeInfo,
                                                storeAddress: e.target.value
                                            })
                                        }} />
                                    </Box>
                                </div>

                                <FormGroup className='sellerDashboard__form__radioBtn'>
                                    <FormControlLabel control={<Switch />} label="Agree to E-shop's terms and conditions" required onChange={() => setRadioBtnChange(!radionBtnChange)} />
                                </FormGroup>

                                <Button
                                    disabled={!radionBtnChange}
                                    type='submit'
                                    variant='contained'
                                    color='success'
                                    className='sellerDashboard__form__submitBtn'
                                >
                                    Submit
                                </Button>
                            </form>
                        </div>


                        <div className="sellerDashboard__accordion">

                            <p className='sellerDashboard__accordion__faq'> Frequently Asked Questions </p>

                            <SellerAccordion />
                        </div>
                    </div>
                </> : <div className='seller__storeInformation'>

                    {/* if user is already a seller */}

                    {/* show store name */}

                    <h2 className='storeInformation__storeName'> Store Name : {databaseUser.storeName} </h2>
                    <h3 className='storeInformation__storeAddress'> Store Address : {databaseUser.storeAddress} </h3>

                    {/* show store address */}
                    {/* add a product */}


                    <div className="addProductsToYourStore">
                        <h2 className='seller__products'> Add Products to Your E-shop Store.</h2>

                        <form className="addProductsToYourStore__store" encType="multipart/form-data" onSubmit={handleProductFormSubmit}>



                            <div className='sellerDashboard__form__inputWithIcon'>
                                <Typography> Product Name :  </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                    <TextField id="input-with-sx"
                                        label='Name'
                                        variant="standard"
                                        required
                                        onChange={(e) => setProductInfo({
                                            ...productInfo,
                                            name: e.target.value
                                        })}
                                    />
                                </Box>
                            </div>


                            <div className='sellerDashboard__form__inputWithIcon'>
                                <Typography> Brand Name :  </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                    <TextField id="input-with-sx"
                                        label='Brand'
                                        variant="standard"
                                        required
                                        onChange={(e) => setProductInfo({
                                            ...productInfo,
                                            brandName: e.target.value
                                        })}
                                    />
                                </Box>
                            </div>


                            <div className='sellerDashboard__form__inputWithIcon'>
                                <Typography> Amount :  </Typography>
                                <TextField
                                    id="standard-number"
                                    label="Price"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                    onChange={(e) => setProductInfo({
                                        ...productInfo,
                                        price: parseInt(e.target.value)
                                    })}
                                    variant="standard"
                                />

                            </div>

                            <div className='sellerDashboard__form__inputWithIcon'>
                                <Typography> Discount :  </Typography>
                                <TextField
                                    id="standard-number"
                                    label="Discount"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                    variant="standard"
                                    onChange={(e) => setProductInfo({
                                        ...productInfo,
                                        discount: parseInt(e.target.value)
                                    })}
                                />

                            </div>

                            <div className='sellerDashboard__form__inputWithIcon'>
                                <Typography> Warranty :  </Typography>
                                <TextField
                                    id="standard-number"
                                    label="Years"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                    variant="standard"
                                    onChange={(e) => setProductInfo({
                                        ...productInfo,
                                        warranty: parseInt(e.target.value)
                                    })}
                                />

                            </div>

                            <div className='sellerDashboard__form__inputWithIcon extra__uploads'>

                                <span className='uploadFiles__text'> Upload Images </span>

                                <span className='uploadFiles__input__container '>
                                    <label htmlFor="input" className='uplaodFiles__input__label'>
                                        <Button
                                            variant='contained'
                                            color='success'
                                            className='uplaodFiles__input__button'
                                        > Select </Button>
                                        <input type="file"
                                            multiple
                                            required
                                            onChange={handleProductImages} />
                                    </label>
                                </span>




                            </div>


                            <p className="imageFile__name" ref={imageFileName}>

                            </p>


                            <div className='sellerDashboard__form__inputWithIcon'>

                                <FormGroup className='sellerDashboard__form__inputWithIcon__radionBtn'>
                                    <FormControlLabel
                                        control={<Switch defaultChecked />} label="Product In Stock"
                                        required
                                        onChange={() => setProductInfo({
                                            ...productInfo,
                                            available: !productInfo.available
                                        })}
                                    />

                                </FormGroup>

                            </div>


                            <div className='radioBoxesContainer__wrapper'>
                                <InputLabel htmlFor="standard-adornment-amount" className='radioBoxesContainer'> Select Product Type (For Search Results) </InputLabel>

                                <FormControlLabel control={<Checkbox name='grocery' />} label="Grocery" onChange={handleRadioBtnCheck} />

                                <FormControlLabel control={<Checkbox name='electronics' />} label="Electronics" onChange={handleRadioBtnCheck} />

                                <FormControlLabel control={<Checkbox name='gadgets' />} label="Gadgets" onChange={handleRadioBtnCheck} />

                                <FormControlLabel control={<Checkbox name='mobiles' />} label="Mobiles" onChange={handleRadioBtnCheck} />

                                <FormControlLabel control={<Checkbox name='laptops' />} label="Laptops" onChange={handleRadioBtnCheck} />

                                <FormControlLabel control={<Checkbox name='pc' />} label="PC" onChange={handleRadioBtnCheck} />

                                <FormControlLabel control={<Checkbox name='clothing' />} label="Clothing" onChange={handleRadioBtnCheck} />

                                <FormControlLabel control={<Checkbox name='footwear' />} label="Footwear" onChange={handleRadioBtnCheck} />

                                <FormControlLabel control={<Checkbox name='medicine' />} label="Medicine" onChange={handleRadioBtnCheck} />

                                <FormControlLabel control={<Checkbox name="girl's wear" />} label="Girl's Wear" onChange={handleRadioBtnCheck} />

                                <FormControlLabel control={<Checkbox name="men's wear" />} label="Men's Wear" onChange={handleRadioBtnCheck} />

                                <FormControlLabel control={<Checkbox name='camera' />} label="Camers" onChange={handleRadioBtnCheck} />
                                <FormControlLabel control={<Checkbox name='earphones' />} label="Earphones" onChange={handleRadioBtnCheck} />
                                <FormControlLabel control={<Checkbox name='headphones' />} label="Headphones" onChange={handleRadioBtnCheck} />
                                <FormControlLabel control={<Checkbox name='speakers' />} label="Speakers" onChange={handleRadioBtnCheck} />
                                <FormControlLabel control={<Checkbox name='other' />} label="Other" onChange={handleRadioBtnCheck} />

                            </div>





                            <Button
                                type='submit'
                                variant='contained'
                                color='success'
                                className='sellerDashboard__form__submitBtn'
                            >
                                Add
                            </Button>

                        </form>


                    </div>



                    <h2 className='seller__products'> Your E-shop Store Products </h2>
                    {/* your e-shop Store (products uploaded by seller)*/}


                    <div className="seller__products__store">
                        {
                            products?.map((product, index) => {
                                return product.data.soldBy.map((seller) => {
                                    if (seller.sellerName === databaseUser?.storeName) {
                                        return <ProductDiv id={product.id} {...product.data} />
                                    }
                                })
                            })
                        }
                    </div>




                </div>
            }
            <SnackBarMessage open={openSnackBar} setOpen={setOpenSnackBar} message={message.message} messageType={message.messageType} />
        </div>

    )
}

export default SellerDashboard
