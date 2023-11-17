import React from 'react'
import { Carousel } from 'antd';
import SLIDE1 from '../../assets/images/SlideBg/SLIDE1.png'
import SLIDE2 from '../../assets/images/SlideBg/SLIDE2.jpg'
import SLIDE3 from '../../assets/images/SlideBg/SLIDE3.jpg'
import SLIDE4 from '../../assets/images/SlideBg/SLIDE4.jpg'

const contentStyle = {
    height: 'max-content',
    width: '100vw',
    objectFit: 'contain'
};
function HomeHero() {
    return (
        <Carousel autoplay>
            <div>
                <img src={SLIDE1} style={contentStyle} />
            </div>
            <div>
                <img src={SLIDE2} style={contentStyle} />
            </div>
            <div>
                <img src={SLIDE3} style={contentStyle} />
            </div>
            <div>
                <img src={SLIDE4} style={contentStyle} />
            </div>
        </Carousel>
    )
}

export default HomeHero