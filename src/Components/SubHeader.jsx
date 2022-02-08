import React from 'react'
import '../Styles/SubHeader.css'
import home from '../Images/home.png'
import phone from '../Images/phone.jpg'
import grocery from '../Images/grocery.jpg'
import fashion from '../Images/fashion.jpg'
import electronics from '../Images/electronics.jpg'
import Button from '@mui/material/Button';




const SubHeaderItems = ({ text, imgSrc, link }) => {
    return (
        <div className="subHeader__items">
            <img src={imgSrc} alt="" className='subHeader__items__image' />
            <p className="subHeader__items__text">{text}</p>
        </div>
    )
}


const SubHeader = () => {
    return (
        <div className="subHeaderWrapper">
            <div className='subHeader'>
                <Button> <SubHeaderItems text={'Home'} imgSrc={home} /> </Button>
                <Button>  <SubHeaderItems text={'Phone'} imgSrc={phone} /></Button>
                <Button> <SubHeaderItems text={'Electronics'} imgSrc={electronics} /></Button>
                <Button>  <SubHeaderItems text={'Fashion'} imgSrc={fashion} /></Button>
                <Button>   <SubHeaderItems text={'Grocery'} imgSrc={grocery} /></Button>
       
            </div>
        </div>
    )
}

export default SubHeader
