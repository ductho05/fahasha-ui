import classNames from 'classnames/bind'
import styles from './Categories.module.scss'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'

const cx = classNames.bind(styles)
function Categories({ categoryList }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <LazyLoadImage src='https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_menu_red.svg' />
                <h3>Danh mục sản phẩm</h3>
            </div>
            <ul className={cx('body')}>
                {
                    categoryList.map((category) => (
                        <Link to={`/seemore-product/${category.id}`} key={category.id} className={cx('category_item')}>
                            <div className={cx('category_link')}>
                                <LazyLoadImage src={category.image} />
                                <p>{category.title}</p>
                            </div>
                        </Link>
                    ))
                }
            </ul>
        </div>
    )
}

export default Categories
