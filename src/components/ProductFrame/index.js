import { useState } from 'react'
import classNames from 'classnames/bind'
import styles from './ProductFrame.module.scss'
import Button from '../Button'
import { Link } from 'react-router-dom'

const cx = classNames.bind(styles)
function ProductFrame({ productList, Component }) {

    const title = productList.reduce((acc, item) => {
        return item.title ? acc += 1 : acc
    }, 0)
    const categoryId = productList.length > 0 ? productList[0].products[0].categoryId._id : 0
    const [currentTab, setCurrentTab] = useState(0)
    let handleTab = (index) => {
        setCurrentTab(index)
    }
    return (
        <div className={cx('wrapper')}>
            <div className={title > 0 ? cx('heading') : cx('hidden', 'heading')}>
                <ul className={cx('tabs_list')}>
                    {
                        productList.map((category, index) => (
                            <li
                                onClick={() => handleTab(index)}
                                key={index}
                                className={currentTab === index ? cx('tab_item', 'tab_active') : cx('tab_item')}
                            >
                                {category.title}
                            </li>
                        ))
                    }
                </ul>
            </div>

            <div className={cx('content')}>

                {
                    productList.map((category, index) => (
                        <div key={index} className={currentTab === index ? cx('product_list', 'content_active') : cx('product_list')}>
                            <Component products={category.products}>

                            </Component>
                        </div>
                    ))
                }
            </div>

            <div className={cx('bottom')}>
                <Link to={`/seemore-product/${categoryId}`}>
                    <Button>Xem Thêm</Button>
                </Link>
            </div>
        </div>
    )
}

export default ProductFrame
