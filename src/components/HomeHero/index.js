import React from 'react'
import { Carousel } from 'antd';
import BG5 from '../../assets/images/SlideBg/BG5.jpg'
import BG8 from '../../assets/images/SlideBg/BG8.jpg'
const contentStyle = {
    height: 'max-content',
    width: '100vw',
    objectFit: 'cover'
};
function HomeHero() {
    return (
        <Carousel autoplay>
            <div>
                <img src={BG5} style={contentStyle} />
            </div>
            <div>
                <img src={BG8} style={contentStyle} />
            </div>
        </Carousel>
    )
}

export default HomeHero