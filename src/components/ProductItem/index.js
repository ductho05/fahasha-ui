import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar } from "@fortawesome/free-solid-svg-icons"
import classNames from "classnames/bind"
import styles from './ProductItem.module.scss'

const cx = classNames.bind(styles)
function ProductItem({ product }) {

    const stars = [1, 2, 3, 4, 5]
    return (
        <Link to={`/product-detail/${product._id}`} state={product._id}
            className={cx('wrapper')}>
            <div className={cx('image')}>
                <img src={product.images} />
                <p className={product.price === product.old_price ? cx('hidden') : cx('discount')}>{(100 - ((product.price / product.old_price) * 100)).toFixed(1)}%</p>
            </div>
            <div className={cx('body')}>
                <p className={cx('name')}>
                    {product.title}
                </p>
                <div className={cx('mid_body')}>
                    <p className={cx('price')}>{
                        product.price.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        })
                    }</p>
                    <p className={product.episode ? cx('have', 'episodes') : cx('episodes')}>{product.episode}</p>
                </div>
                <p className={product.price === product.old_price ? cx('hidden') : cx('discount_price')}>{
                    product.old_price.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    })
                }</p>

                <div className={cx('rate')}>
                    {
                        stars.map((star, index) => (
                            <span key={index} className={star <= product.rate ? cx('star_active', 'star') : cx('star')}>
                                <FontAwesomeIcon icon={faStar} />
                            </span>
                        ))
                    }
                    <p className={cx('rate_number')}>(0)</p>
                </div>
            </div>
        </Link>
    )
}

export default ProductItem
