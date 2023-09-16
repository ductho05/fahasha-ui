import { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './Slides.module.scss'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Skeleton from 'react-loading-skeleton'

const cx = classNames.bind(styles)

function Slides(props) {

    const { loading = false } = props

    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        setInterval(() => {
            handleNextSlide()
        }, 10000)
    }, [])

    let handlePrevSlide = () => {
        setCurrentIndex(prev => {
            const length = props.slideList.length - 1
            return prev === 0 ? length : prev - 1
        })
    }

    let handleNextSlide = () => {
        setCurrentIndex(prev => {
            const length = props.slideList.length - 1
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
                    <LazyLoadImage className={cx('slider_thumnail')} src={props.slideList[currentIndex].url} />
                </a>
                <p
                    onClick={handleNextSlide}
                    className={cx('btn', 'btn_next', 'hide-on-tablet-mobile')}>
                    <LazyLoadImage src='https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_arrow_gray.svg' />
                </p>
                <ul className={cx('index_slide_list')}>
                    {
                        props.slideList.map((slide, index) =>
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
