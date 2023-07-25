import Carousel from "react-multi-carousel"
import 'react-multi-carousel/lib/styles.css'

import classNames from "classnames/bind"
import styles from './ProductSlider.module.scss'
import ProductItem from "../ProductItem"

const cx = classNames.bind(styles)
function ProductSlider({ products }) {
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 8,
            slidesToSlide: 8
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5,
            slidesToSlide: 3,
        },
        tablet: {
            breakpoint: { max: 1024, min: 500 },
            items: 4,
            slidesToSlide: 2
        },
        mobile: {
            breakpoint: { max: 500, min: 0 },
            items: 2,
            slidesToSlide: 1
        }
    };
    return (
        <div className={cx('wrapper')}>
            <Carousel
                responsive={responsive}
            >
                {
                    products.map((product, index) => (
                        <ProductItem key={index} product={product} />
                    ))
                }
            </Carousel>
        </div>
    )
}

export default ProductSlider
