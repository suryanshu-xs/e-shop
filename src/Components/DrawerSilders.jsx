import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import MailIcon from '@mui/icons-material/Mail';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Avatar } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SnackBarMessage from './SnackBarMessage';
import '../Styles/DrawerSilder.css'
import PersonIcon from '@mui/icons-material/Person';

import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';

export default function DrawerSilder({ drawerState, setDrawerState, handleOptionsClick, user, signOutUser, setOpenBackdrop, databaseUser }) {

    const history = useHistory()
    const [snackbarOpen,setSnackBarOpen] = React.useState(false)
    const [message,setMessage] = React.useState({
        message:'',
        messageType:''
    })


    const handleSellerOptionClick=()=>{
        if(user?.uid){
            history.push(`/sellerAccount/${user.uid}`)
        }else{
            setSnackBarOpen(true)
            setMessage({
                message:'Please Create an E-shop account or Sign in.',
                messageType:'error'
            })
        }
    }

    const list = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={() => setDrawerState(false)}
            onKeyDown={() => setDrawerState(false)}
        >

            <div className="profileInformation">
                <Avatar className='profileInformation__imnage' src={databaseUser?.photo ? databaseUser.photo : ''} />
                <h3 className="profileInformation__name">
                    {databaseUser ? databaseUser.name.split(' ')[0] : ' Guest'}
                </h3>
                <Button className='optionsContainer__button drawer__optionsContainer__button' onClick={user ? signOutUser : () => setOpenBackdrop(true)} >
                    <div className="optionsContainer__auth optionsContainer__options" >
                        <span> {user ? 'Sign Out' : 'Sign In'} </span>
                    </div>
                </Button>
            </div>



            <List className='drawerList'>

                <ListItem button key='account' onClick={() => history.push('/')} >
                    <ListItemIcon>
                        <HomeRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary='Home' className='listItemText' />
                </ListItem>

                <ListItem button key='account' onClick={() => handleOptionsClick('myAccount')}>
                    <ListItemIcon>
                        <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary='My Account' className='listItemText' />
                </ListItem>

                <ListItem button key='orders' onClick={() => handleOptionsClick('orders')}>
                    <ListItemIcon>
                        <LocalMallIcon />
                    </ListItemIcon>
                    <ListItemText primary='My Orders' />
                </ListItem>


                <ListItem button key='wishlist' onClick={() => handleOptionsClick('wishlist')}>
                    <ListItemIcon>
                        <FavoriteIcon />
                    </ListItemIcon>
                    <ListItemText primary='My Wishlist' />
                </ListItem>

                <ListItem button key='wishlist' onClick={() => handleOptionsClick('cart')}>
                    <ListItemIcon>
                        <ShoppingCartIcon />
                    </ListItemIcon>
                    <ListItemText primary='My Cart' />
                </ListItem>

            

                    <ListItem button key='seller'>
                        <ListItemIcon>
                            <GroupsRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary='Become a Seller' onClick={handleSellerOptionClick}/>
                    </ListItem>
                

            </List>
        </Box>
    );

    return (
        <div>


            {/* <Button onClick={()=>setDrawerOpen(!drawerOpen)}>Open</Button> */}
            <Drawer
                anchor={'right'}
                open={drawerState}
                onClose={() => setDrawerState(!drawerState)}
            >
                {list()}
            </Drawer>

            <SnackBarMessage open={snackbarOpen} setOpen={setSnackBarOpen} message={message.message} messageType={message.messageType}/>


        </div>
    );
}
