import React from 'react'
import '../Styles/ImageSlider.css'
import shirts from '../Images/shirts.jpg'
import laptops from '../Images/laptopsHome.jpg';
import ladiesFashion from '../Images/ladiesFashion.jpg'
import phone from '../Images/phoneHome.jpg'
import grocery from '../Images/groceryHome.jpg'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';





const properties = {
    duration: 4000,
    transitionDuration: 900,
    infinite: true,
    indicators: true,
    prevArrow: <div className='slider__arrow slider__arrow__left'><IconButton> <ArrowBackIosNewRoundedIcon className='arrow__icon' /> </IconButton> </div>,
    nextArrow: <div className='slider__arrow slider__arrow__right'> <IconButton > <ArrowForwardIosRoundedIcon className='arrow__icon' /> </IconButton> </div>,
}

const ImageSlider = () => {
    return (
        <Fade {...properties}>
            <div className="each-fade" >
                <img src={shirts} className='each-fade-img' />
                <div className="each-fade-info">
                    <h2 className='each-fade-info-heading'>New Arrivals for Men</h2>
                    <Button className='each-fade-info-button'> Check </Button>

                </div>
            </div>
            <div className="each-fade">
                <img src={laptops} className='each-fade-img' />

                <div className="each-fade-info">
                    <h2 className='each-fade-info-heading'>Amazing Deals on Gadgets</h2>
                    <Button className='each-fade-info-button'> Explore! </Button>



                </div>
            </div>
            <div className="each-fade">
                <img src={ladiesFashion} className='each-fade-img' />
                <div className="each-fade-info">

                    <h2 className='each-fade-info-heading each-fade-info-heading-ladies'>New Styles for Ladies</h2>
                    <Button className='each-fade-info-button'> Buy! </Button>


                </div>
            </div>
            <div className="each-fade">
                <img src={phone} className='each-fade-img' />
                <div className="each-fade-info">
                    <h2 className='each-fade-info-heading'>Phones at Ultra Cheap Cost</h2>
                    <Button className='each-fade-info-button'> Check! </Button>
                </div>
            </div>
            <div className="each-fade">
                <img src={grocery} className='each-fade-img' />
                <div className="each-fade-info">
                    <h2 className='each-fade-info-heading each-fade-info-heading-grocery'>The Grocery MarketPlace</h2>
                    <Button className='each-fade-info-button'> Explore! </Button>
                </div>
            </div>
        </Fade>
    )
}

export default ImageSlider
