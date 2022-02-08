import React, { useState, useContext } from 'react'
import '../Styles/SignUp.css'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import { Logo } from './Header';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Button from '@mui/material/Button'
import { ProductContext } from '../App';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { db, auth } from '../Config/firebase';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { UserContext } from '../App';
import { doc, setDoc } from '@firebase/firestore';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const SignUp = ({ openSignUpBackdrop, setSignUpOpenBackdrop }) => {

    const [products, setProducts, progress, setProgress] = useContext(ProductContext)
    const [user, setUser] = useContext(UserContext)
    const [signUpInputValues, setSignUpInputValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: ''
    })
    const [successfullAccountCreationMessage, setsuccessfullAccountCreationMessage] = useState(false);
    const [errorAccountCreation, setErrorAccountCreation] = useState(false)


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setsuccessfullAccountCreationMessage(false);
        setErrorAccountCreation(false)
    };



    const handleSignUpFormSubmit = (event) => {
        event.preventDefault()
        setProgress(true)



        if (signUpInputValues.password === signUpInputValues.confirmPassword) {

            createUserWithEmailAndPassword(auth, signUpInputValues.email, signUpInputValues.password).then(async (userCredentials) => {

                //New account successfully created
                setSignUpOpenBackdrop(!openSignUpBackdrop)
                setProgress(false)
                setsuccessfullAccountCreationMessage(true);

                //insert this user in database
                const docRef = doc(db,'users',userCredentials.user.uid) 
                await setDoc(docRef,{
                    email:signUpInputValues.email,
                    name:signUpInputValues.username,
                    address:signUpInputValues.address,
                    cart:[],
                    wishlist:[],
                    orders:[],
                    isSeller:false,
                    storeName:null,
                    storeAddress:null

                })

                
            }).catch((error) => {
                alert(error)
                setErrorAccountCreation(true)
                setProgress(false)
            })


        } else {
            setErrorAccountCreation(true)
            setProgress(false)
        }






    }
    return (

        <>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openSignUpBackdrop}
                style={{ display: 'flex', flexDirection: 'column' }}


            >
                <Box
                    sx={{
                        width: 500,
                        minHeight: '80vh',
                        bgcolor: 'white',
                    }}
                >
                    <div className="signup__logoContainer">
                        <Logo />
                    </div>
                    <form className="signup__form" onSubmit={handleSignUpFormSubmit}>

                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className='signup__form__boxes'>
                            <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <TextField id="input-with-sx" label="Your Name" variant="standard" required onChange={(e) => setSignUpInputValues({ ...signUpInputValues, username: e.target.value })} />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className='signup__form__boxes'>
                            <EmailIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <TextField id="input-with-sx" label="Your Email" variant="standard" required onChange={(e) => setSignUpInputValues({ ...signUpInputValues, email: e.target.value })} />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className='signup__form__boxes'>
                            <LockIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <TextField id="input-with-sx" label="Set Password" variant="standard" type='password' required onChange={(e) => setSignUpInputValues({ ...signUpInputValues, password: e.target.value })} />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className='signup__form__boxes'>
                            <LockIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <TextField id="input-with-sx" label="Confirm Password" variant="standard" type='password' required onChange={(e) => setSignUpInputValues({ ...signUpInputValues, confirmPassword: e.target.value })} />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className='signup__form__boxes'>
                            <LockIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <TextField id="input-with-sx" label="Your Address" variant="standard" type='text' required onChange={(e) => setSignUpInputValues({ ...signUpInputValues, address: e.target.value })} />
                        </Box>

                        <Button variant="contained" type='submit' className='signup__form__button'> Sign Up </Button>


                    </form>


                </Box>
                <Button className='backdrop__closeButton' variant='outlined' onClick={() => { setSignUpOpenBackdrop(!openSignUpBackdrop) }}>
                    Close
                </Button>

            </Backdrop>
            <Snackbar open={successfullAccountCreationMessage} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    <span className='alertMessage' > Account Created Successfully. </span>
                </Alert>
            </Snackbar>

            <Snackbar open={errorAccountCreation} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }} >
                    <span className='alertMessage' > Can't create account. Please try Again. </span>
                </Alert>
            </Snackbar>


        </>
    )
}

export default SignUp
