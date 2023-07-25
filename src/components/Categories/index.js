import classNames from 'classnames/bind'
import styles from './Categories.module.scss'

const cx = classNames.bind(styles)
function Categories({ categoryList }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <img src='https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_menu_red.svg' />
                <h3>Danh mục sản phẩm</h3>
            </div>
            <ul className={cx('body')}>
                {
                    categoryList.map((category, index) => (
                        <li key={index} className={cx('category_item')}>
                            <a href='#' className={cx('category_link')}>
                                <img src={category.image} />
                                <p>{category.title}</p>
                            </a>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Categories
