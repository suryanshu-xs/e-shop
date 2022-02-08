import React, { useContext, useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router'
import '../Styles/MyAccount.css'
import { DatabaseUserContext, UserContext, ProductContext } from '../App';
import { Avatar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneAndroidRoundedIcon from '@mui/icons-material/PhoneAndroidRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { db, storage, auth } from '../Config/firebase';
import { doc, updateDoc } from '@firebase/firestore';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from '@firebase/storage';
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail } from '@firebase/auth';
import ReauthUser from './ReauthUser';






const MyAccount = () => {

    const [user, setUser] = useContext(UserContext)
    const [databaseUser, setDatabaseUser] = useContext(DatabaseUserContext)
    const [products, setProducts, progress, setProgress] = useContext(ProductContext)
    const [avatarImageSrc, setAvatarImageSrc] = useState('')
    const [userInformation, setUserInformation] = useState({
        name: databaseUser?.name,
        email: databaseUser?.email,
        address: databaseUser?.address,
        phone: databaseUser?.phone ? databaseUser.phone : '',
    })
    const [reAuthUserCred, setReAuthUserCred] = useState({
        email: '',
        password: ''
    })

    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [disabled, setDisabled] = useState(true)

    useEffect(() => {
        setProgress(true)

        setUserInformation({
            name: databaseUser?.name,
            email: databaseUser?.email,
            address: databaseUser?.address,
            phone: databaseUser?.phone ? databaseUser.phone : '',
        })

        setProgress(false)


    }, [databaseUser])
    const { userId } = useParams()

    const loadFile = (event) => {
        setProgress(true)
        setAvatarImageSrc(URL.createObjectURL(event.target.files[0]))
        const storageRef = ref(storage, `userImages/${userId}`)

        const uploadTask = uploadBytesResumable(storageRef, event.target.files[0])
        uploadTask.on('state_changed', (snapshot) => {
            setProgress(true)
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, (error) => {
            alert(error)
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

                updateUserPhoto(downloadURL)
            })
        })
        setProgress(false)
    }

    const updateUserPhoto = async (downloadURL) => {
        setProgress(true)

        const docRef = doc(db, 'users', userId)

        try {
            await updateDoc(docRef, {
                ...userInformation,
                photo: downloadURL
            })
            setDisabled(true)
        } catch (error) {
            alert(error)
        }


        setProgress(false)

    }

    const updateUserInformation = async (event) => {
        event.preventDefault()


        setProgress(true)

        const docRef = doc(db, 'users', userId)

        // console.log('Database user email', databaseUser.email)
        // console.log('Changed email', userInformation.email);

        try {

            if (databaseUser.email === userInformation.email) {
                await updateDoc(docRef, {
                    name: userInformation.name,
                    address: userInformation.address,
                    phone: userInformation.phone
                })
            } else {
                setOpenBackdrop(true)
                // console.log(reAuthUserCred)

                // reauthenticateWithCredential(currentUser,credentials).then((result)=>{
                //     console.log(result)
                // }).catch((error)=>{
                //     console.log(error);
                // })

                // updateEmail(currentUser, userInformation.email).then(() => {
                //     alert('Email updated')
                //     updateDoc(docRef, {
                //         name: userInformation.name,
                //         email: userInformation.email,
                //         address: userInformation.address,
                //         phone: userInformation.phone
                //     }).then(()=>{
                //         alert('email updated in databse')
                //     }).catch((error)=>{
                //         console.log('databse updation error',error); 
                //     })
                // }).catch((error) => {
                //     alert(error)
                // })



            }
            setDisabled(true)
        } catch (error) {
            alert(error)
        }


        setProgress(false)



    }

    return (
        <div className='myAccount'>

            <h1 className='myAccount__heading'> Welcome {databaseUser?.name} </h1>


            <div className="myAccount__profileImag__container">
                <Avatar src={databaseUser?.photo} className='myAccount__profileImage' />
                <IconButton>
                    <label for="file-input" className="input-label">
                        <CameraAltRoundedIcon className='profileImage__iconButton__icon' />
                        <input type="file" accept='image/*' id="file-input" onChange={loadFile} />
                    </label>
                </IconButton>
            </div>

            <div className="myAccount__details">

                <h2 className='myAccount__details__heading'> Account Details </h2>

                <div className="myAccount__details__container">

                    <form action="" className='details__container__form' onChange={() => setDisabled(false)} onSubmit={updateUserInformation}>

                        <div className="accountDetails__inputContainer">
                            <p className="accountDetails__inputContainer__label">
                                Name :
                            </p>

                            <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className='accountDetails__inputContainer__box' key='Name'>

                                <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                <TextField id='Name' label='' type='text' variant="standard" value={userInformation?.name} onChange={(event) => setUserInformation({ ...userInformation, name: event.target.value })} required value={userInformation?.name} />

                            </Box>
                        </div>
                        <div className="accountDetails__inputContainer">
                            <p className="accountDetails__inputContainer__label">
                                Email :
                            </p>

                            <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className='accountDetails__inputContainer__box' key='Email'>

                                <EmailRoundedIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                <TextField id='Email' type='email' label='' variant="standard" value={userInformation?.email} onChange={(event) => setUserInformation({ ...userInformation, email: event.target.value })} required value={userInformation?.email} />

                            </Box>
                        </div>
                        <div className="accountDetails__inputContainer">
                            <p className="accountDetails__inputContainer__label">
                                Address :
                            </p>

                            <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className='accountDetails__inputContainer__box' key='Address'>

                                <HomeRoundedIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                <TextField id='Address' label='' variant="standard" value={userInformation?.address} onChange={(event) => setUserInformation({ ...userInformation, address: event.target.value })} required value={userInformation?.address} />

                            </Box>
                        </div><div className="accountDetails__inputContainer">
                            <p className="accountDetails__inputContainer__label">
                                Phone :
                            </p>

                            <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className='accountDetails__inputContainer__box' key='Name'>

                                <PhoneAndroidRoundedIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                <TextField id='Name' label='' variant="standard" value={userInformation?.phone} onChange={(event) => setUserInformation({ ...userInformation, phone: event.target.value })} value={userInformation?.phone ? userInformation.phone : ''} />

                            </Box>
                        </div>


                        <Button type='submit' disabled={disabled} className='container__form__button' > Update </Button>
                    </form>
                </div>
            </div>

            <ReauthUser userInformation={userInformation} openBackdrop={openBackdrop} setOpenBackdrop={setOpenBackdrop} reAuthUserCred={reAuthUserCred} setReAuthUserCred={setReAuthUserCred} />


        </div>
    )
}


export default MyAccount
