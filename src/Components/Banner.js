import React from 'react'
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css'
import banner1 from './bannerImg/banner1.jpg'
import banner2 from './bannerImg/banner2.jpg'
import banner3 from './bannerImg/banner3.jpg'
import './Banner.css'

const Banner = () => {
  return (
        <Carousel>
            <Carousel.Item>
                <img
                className="d-block w-100"
                src={banner1}
                alt="First slide"
                />
                
            </Carousel.Item>
            <Carousel.Item>
                <img
                className="d-block w-100"
                src={banner2}
                alt="Second slide"
                />

                
            </Carousel.Item>
            <Carousel.Item>
                <img
                className="d-block w-100"
                src={banner3}
                alt="Third slide"
                />

                
            </Carousel.Item>
        </Carousel>
  )
}

export default Banner
