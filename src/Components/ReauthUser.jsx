import React, { useState, useContext, useEffect } from 'react'
import '../Styles/Header.css'
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import { UserContext, DatabaseUserContext, ProductContext } from '../App';
import { auth, db } from '../Config/firebase';
import { EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail, updateEmail } from '@firebase/auth';
import { doc, updateDoc } from '@firebase/firestore';
import SnackBarMessage from './SnackBarMessage';
import { ControlCameraTwoTone } from '@mui/icons-material';


const ReAuthUser = (email, password) => {
    const currentUser = auth.currentUser;
    const credentials = EmailAuthProvider.credential(email, password)






    reauthenticateWithCredential(currentUser, credentials).then((result) => {
        console.log('reauthuser', result)
    }).catch((error) => {
        alert(error.message)
    })

}



const updateUserEmail = (userInformation, userId) => {
  
    const currentUser = auth.currentUser;

    updateEmail(currentUser, userInformation.email).then((result) => {

        updateUserInDatabase(userInformation, userId)

    }).catch((error) => {
        alert(error.message)
    })

}
const updateUserInDatabase = (userInformation, userId) => {
    const docRef = doc(db, 'users', userId)
    updateDoc(docRef, {
        name: userInformation.name,
        email: userInformation.email,
        address: userInformation.address,
        phone: userInformation.phone
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        alert(error.message)
    })
}
const ReauthUser = ({ userInformation, openBackdrop, setOpenBackdrop, reAuthUserCred, setReAuthUserCred }) => {

    const [user, setUser] = useContext(UserContext)
    const [products, setProducts, progress, setProgress] = useContext(ProductContext)
    const [openSnackBar, setOpenSnackBar] = useState(false)
    const [snackBarProperties, setSnackBarProperties] = useState({
        message: '',
        messageType: ''
    })

    const handlePasswordReset = () =>{
        setProgress(true)
        sendPasswordResetEmail(auth,user.email).then(()=>{
            setOpenSnackBar(true)
            setSnackBarProperties({
                message:'Password Reset Email Send, Please check your email.',
                messageType:'success'
            })
            setOpenBackdrop(false)

        }).catch((error)=>{
            setOpenSnackBar(true)
            setSnackBarProperties({
                message:error.message,
                messageType:'error'
            })
            setOpenBackdrop(false)
            
        })
        setProgress(false)

    }



    const handleCredSubmit = (event) => {
        event.preventDefault()
        setProgress(true)
        setOpenBackdrop(false)

        try {

            ReAuthUser(reAuthUserCred.email, reAuthUserCred.password)
            setTimeout(() => {
               
                updateUserEmail(userInformation, user.uid)
                setOpenSnackBar(true)
                setSnackBarProperties({
                    message: 'Profile Updated',
                    messageType: 'success'
                })

            }, 800);
        } catch (error) {
            alert(error)
            setProgress(false)
            setOpenSnackBar(true)
            setSnackBarProperties({
                message: error,
                messageType: 'error'
            })
        }


        setProgress(false)
    }

    console.log('Account user email : ', user?.email)

    return (
        <div className='reAuthUser'>
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
                    <form action="" className='backDropInputBox__form' onSubmit={handleCredSubmit}>
                        <h3 className='backDropInputBox__heading'> Sign In </h3>
                        <p className="backDropInputBox__text">
                            Please enter your current E-shop's username and Password
                        </p>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className='signup__form__boxes'>
                            <EmailIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />

                            <TextField
                                id="input-with-sx"
                                label="Email" type='email'
                                variant="standard"
                                required
                                onChange={(event) => setReAuthUserCred({
                                    ...reAuthUserCred, email: event.target.value
                                })} />

                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className='signup__form__boxes'>
                            <LockIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />

                            <TextField
                                id="input-with-sx"
                                label="Password"
                                variant="standard"
                                type='password'
                                required
                                onChange={(event) => setReAuthUserCred({
                                    ...reAuthUserCred, password: event.target.value
                                })} />

                        </Box>
                        <Button type='submit' className='backDropInputBox__submitButton'>
                            Submit
                        </Button>
                    </form>

                    <p className="backDropInputBox__forgotPassword backDropInputBox__propmts" onClick={handlePasswordReset}>
                        Forgot Password
                    </p>

                </Box>
                <Button className='backdrop__closeButton' variant='outlined' onClick={() => { setOpenBackdrop(!openBackdrop) }}>
                    Close
                </Button>
            </Backdrop>
            <SnackBarMessage open={openSnackBar} setOpen={setOpenSnackBar} message={snackBarProperties.message} messageType={snackBarProperties.messageType} />
        </div>
    )
}

export default ReauthUser
