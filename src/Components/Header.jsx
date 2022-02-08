import React, { useState, useEffect, useContext, useRef } from 'react'
import '../Styles/Header.css'
import Button from '@mui/material/Button';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import IconButton from '@mui/material/IconButton';
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import Badge from '@mui/material/Badge';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SignUp from './SignUp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from '@firebase/auth';
import { auth } from '../Config/firebase';
import { ProductContext } from '../App';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { DatabaseUserContext } from '../App';
import { useHistory } from "react-router-dom";
import DrawerSilder from './DrawerSilders';

export const Logo = () => {
    return <Link to='/' style={{ textDecoration: 'none' }} >
        <div className="header__logo">
            <span> E- shop</span>
        </div>
    </Link>
}
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



const Header = () => {
    const [databaseUser, setDatabaseUser] = useContext(DatabaseUserContext)
    const [user, setUser] = useContext(UserContext)
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const headerRef = useRef(null)
    const [openSignUpBackdrop, setSignUpOpenBackdrop] = useState(false)
    const [signInEmail, setSignInEmail] = useState('')
    const [signInPassword, setSignInPassword] = useState('')
    const [signInMessage, setSignInMessage] = useState(false)
    const [signOutMessage, setSignOutMessage] = useState(false)
    const [signInErrorMessage, setSignInErrorMessage] = useState(false)
    const [products, setProducts, progress, setProgress] = useContext(ProductContext)
    const history = useHistory()
    const [pleaseSignIn, setPleaseSignIn] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const signOutUser = () => {
        signOut(auth).then(() => {
            console.log('You have been signed out')
            setSignOutMessage(true)
            setTimeout(() => {
                history.push('/')
                window.location.reload();
            }, 600);

        }).catch((error) => {
            console.log(error)
            alert(error)
        })
    }
    const signIn = (e) => {
        setProgress(true)
        e.preventDefault()
        signInWithEmailAndPassword(auth, signInEmail, signInPassword).then((userCredentials) => {

            setOpenBackdrop(false)
            setProgress(false)
            setSignInMessage(true)


        }).catch((error) => {
            setSignInErrorMessage(true)
            setProgress(false)
        })


    }
    const handleCreateNewAccountClick = () => {
        setOpenBackdrop(!openBackdrop);
        setSignUpOpenBackdrop(!openSignUpBackdrop)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSignInMessage(false);
        setSignOutMessage(false)
        setSignInErrorMessage(false)
        setPleaseSignIn(false)
    };

    const handleOptionsClick = (option) => {
        if (user) {
            history.push(`/headerOptions/${option}/${user.uid}`)
        } else {
            setPleaseSignIn(true)
        }
    }


    return (
        <>
            <div className='header' ref={headerRef}>
                <Logo />

                <div className="header__searchBox">
                    <input type="text" placeholder='Search Products' />
                </div>



                <div className="header__optionsContainer">

                    <div className="optionsContainer__welcome">
                        <p>Hello, {databaseUser ? databaseUser.name.split(' ')[0] : ' Guest'} </p>
                    </div>



                    <Button className='optionsContainer__button' onClick={user ? signOutUser : () => setOpenBackdrop(true)} >
                        <div className="optionsContainer__auth optionsContainer__options" >
                            <span> {user ? 'Sign Out' : 'Sign In'} </span> <PersonRoundedIcon />
                        </div>
                    </Button>



                    <Button className='optionsContainer__button' onClick={() => handleOptionsClick('orders')}>
                        <div className="optionsContainer__orders optionsContainer__options">
                            <span> Orders </span>
                            <Badge badgeContent={databaseUser ? databaseUser.orders.length : 0} color="primary" >
                                <LocalMallRoundedIcon color="action" />
                            </Badge>
                        </div>
                    </Button>

                    <Button className='optionsContainer__button' onClick={() => handleOptionsClick('wishlist')}>
                        <div className="optionsContainer__wishlist optionsContainer__options">
                            <span> Wishlist</span>
                            <Badge badgeContent={databaseUser ? databaseUser.wishlist.length : 0} color="primary" >
                                <FavoriteRoundedIcon color="action" />
                            </Badge>
                        </div>
                    </Button>

                    <Button className='optionsContainer__button' onClick={() => handleOptionsClick('cart')}>

                        <div className="optionsContainer__cart optionsContainer__options" >
                            <span> Cart</span> <Badge badgeContent={databaseUser ? databaseUser.cart.length : 0} color="primary" >
                                <ShoppingCartRoundedIcon color="action" />
                            </Badge>

                        </div>
                    </Button>


                </div>
                <div className="header__hamburger">

                    <IconButton size="large" onClick={() => setDrawerOpen(!drawerOpen)}>
                        <MenuRoundedIcon />
                    </IconButton>

                </div>
            </div>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
                className='backdrop'
            >
                <Box
                    sx={{
                        width: 400,
                        bgcolor: 'rgb(246, 246, 246)',
                        padding: '1rem 0em'
                    }}
                    className='backDropInputBox'

                >
                    <div className="backdrop__header__logo header__logo">
                        E- <span>shop</span>
                    </div>
                    <form action="" className='backDropInputBox__form' onSubmit={signIn}>
                        <h3 className='backDropInputBox__heading'> Sign In </h3>
                        <p className="backDropInputBox__text">
                            Please enter your E-shop's username and Password
                        </p>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className='signup__form__boxes'>
                            <EmailIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <TextField id="input-with-sx" label="Email" type='email' variant="standard" required onChange={(e) => setSignInEmail(e.target.value)} />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className='signup__form__boxes'>
                            <LockIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <TextField id="input-with-sx" label="Password" variant="standard" type='password' required onChange={(e) => setSignInPassword(e.target.value)} />
                        </Box>
                        <Button type='submit' className='backDropInputBox__submitButton'>
                            Sign In
                        </Button>
                    </form>


                    <p className="backDropInputBox__createNewAccount backDropInputBox__propmts" onClick={handleCreateNewAccountClick}>
                        Don't have an account ? Create One
                    </p>

                </Box>
                <Button className='backdrop__closeButton' variant='outlined' onClick={() => { setOpenBackdrop(!openBackdrop) }}>
                    Close
                </Button>
            </Backdrop>
            <SignUp openSignUpBackdrop={openSignUpBackdrop} setSignUpOpenBackdrop={setSignUpOpenBackdrop} />


            <Snackbar open={signInMessage} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }} >
                    <span className='alertMessage' > You are Signed In. </span>
                </Alert>
            </Snackbar>
            <Snackbar open={signOutMessage} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }} >
                    <span className='alertMessage' > You are Signed Out. </span>
                </Alert>
            </Snackbar>
            <Snackbar open={signInErrorMessage} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }} >
                    <span className='alertMessage' > Error Occured. Please try again. </span>
                </Alert>
            </Snackbar>
            <Snackbar open={pleaseSignIn} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }} >
                    <span className='alertMessage' > Please Sign In. </span>
                </Alert>
            </Snackbar>

            <DrawerSilder drawerState={drawerOpen} setDrawerState={setDrawerOpen} handleOptionsClick={handleOptionsClick} user={user} signOutUser={signOutUser} setOpenBackdrop={setOpenBackdrop} databaseUser={databaseUser} />

        </>
    )
}

export default Header
