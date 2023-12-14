import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ProductItem.module.scss';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Skeleton from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";


const cx = classNames.bind(styles);
function ProductItem({ product }) {
    const stars = [1, 2, 3, 4, 5];

    return (
        <Link to={`/product-detail/${product._id}`} state={product._id} className={cx('wrapper')}>
            <div className={cx('image')}>
                <LazyLoadImage src={product.images} />
                <p className={product.price === product.old_price ? cx('hidden') : cx('discount')}>
                    {`${(100 - (product.price / product.old_price) * 100).toFixed(1)}%`}
                </p>
            </div>
            <div className={cx('body')}>
                <p className={cx('name')}>{product.title}</p>
                <div className={cx('mid_body')}>
                    <p className={cx('price')}>{
                        product?.price?.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        })
                    }
                    </p>
                    <p className={product.episode ? cx('have', 'episodes') : cx('episodes')}>
                        {product.episode}
                    </p>
                </div>
                <p className={product.price === product.old_price ? cx('hidden') : cx('discount_price')}>{
                    product.old_price.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    })
                }
                </p>

                <div className={cx('rate')}>
                    {stars.map((star, index) => (
                        <span key={index} className={star <= product.rate ? cx('star_active', 'star') : cx('star')}>
                            <FontAwesomeIcon icon={faStar} />
                        </span>
                    ))}
                    <p className={cx('rate_number')}>({product.rate})</p>
                </div>
            </div>
        </Link>
    );
}

function Loading() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('image')}>
                <Skeleton animation="wave" variant="rectangular" width={160} height={160} />
                <p className={cx('discount')}>
                    <Skeleton animation="wave" variant="circular" width={36} height={36} />
                </p>
            </div>
            <div className={cx('body')}>
                <p className={cx('name')}>
                    <Skeleton animation="wave" variant="text" sx={{ fontSize: '1.4rem' }} />
                    <Skeleton animation="wave" variant="text" sx={{ fontSize: '1.4rem' }} />
                </p>
                <div className={cx('mid_body')}>
                    <p className={cx('price')}>
                        <Skeleton animation="wave" variant="text" sx={{ fontSize: '1.4rem' }} />
                    </p>
                </div>
                <p className={cx('discount_price')}>
                    <Skeleton animation="wave" variant="text" sx={{ fontSize: '1.4rem' }} />
                </p>

                <div className={cx('rate')}>
                    <Skeleton animation="wave" variant="text" sx={{ fontSize: '1.4rem' }} />
                </div>
            </div>
        </div>
    )
}

ProductItem.Loading = Loading

export default ProductItem;
