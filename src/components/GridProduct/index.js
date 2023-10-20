import classNames from 'classnames/bind'
import styles from './GridProduct.module.scss'
import ProductItem from '../ProductItem'

const cx = classNames.bind(styles)
function GridProduct({ isLoading, products }) {

    return (
        <div className={cx('grid wide', 'wrapper')}>
            <div className={cx('row')}>
                {
                    products.map(product => (
                        <div className={cx('col l-2-4 m-4 c-6')}>
                            {
                                isLoading ? <ProductItem.Loading /> : < ProductItem product={product} />
                            }
                        </div>
                    ))

                }
            </div>
        </div>
    )
}

export default GridProduct
