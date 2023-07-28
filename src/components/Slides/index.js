import { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './Slides.module.scss'
import { LazyLoadImage } from 'react-lazy-load-image-component';

const cx = classNames.bind(styles)

const slideList = [
    {
        url: 'https://cdn0.fahasa.com/media/magentothem/banner7/Stem_mainbanner_T6_Slide_840x320.jpg'
    },
    {
        url: 'https://cdn0.fahasa.com/media/magentothem/banner7/CTKMThang6__840x320.jpg'
    },
    {
        url: 'https://cdn0.fahasa.com/media/magentothem/banner7/Fahasasalethu3_mainbanner_Bo1_Slider_840x320.jpg'
    },
    {
        url: 'https://cdn0.fahasa.com/media/magentothem/banner7/MangaWeekT623_Banner_Slide_840x320.jpg'
    }
]
function Slides() {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        setInterval(() => {
            handleNextSlide()
        }, 10000)
    }, [])

    let handlePrevSlide = () => {
        setCurrentIndex(prev => {
            const length = slideList.length - 1
            return prev === 0 ? length : prev - 1
        })
    }

    let handleNextSlide = () => {
        setCurrentIndex(prev => {
            const length = slideList.length - 1
            return prev === length ? 0 : prev + 1
        })
    }
    return (
        <div className={cx('wrapper')}>
            <div className={cx('slides')}>
                <p
                    onClick={handlePrevSlide}
                    className={cx('btn', 'btn_prev', 'hide-on-tablet-mobile')}
                >
                    <LazyLoadImage src='https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_arrow_gray.svg' />
                </p>
                <a href='#'>
                    <LazyLoadImage className={cx('slider_thumnail')} src={slideList[currentIndex].url} />
                </a>
                <p
                    onClick={handleNextSlide}
                    className={cx('btn', 'btn_next', 'hide-on-tablet-mobile')}>
                    <LazyLoadImage src='https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_arrow_gray.svg' />
                </p>
                <ul className={cx('index_slide_list')}>
                    {
                        slideList.map((slide, index) =>
                            <li
                                onClick={() => setCurrentIndex(index)}
                                key={index}
                                className={index === currentIndex ? cx('index_slide_item', 'active') : cx('index_slide_item')}>

                            </li>
                        )
                    }
                </ul>
            </div>
        </div>
    )
}

export default Slides
