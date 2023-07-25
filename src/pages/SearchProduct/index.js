import { useState, useEffect } from 'react'
import className from 'classnames/bind'
import { useParams } from 'react-router-dom'
import styles from './SearchProduct.module.scss'
import DropMenu from '../../components/DropMenu'
import Paging from '../../components/Paging'
import GridProduct from '../../components/GridProduct'
import { optionsArange, api } from '../../constants'

const cx = className.bind(styles)
function SearchProduct() {
    const { title } = useParams()
    const [products, setProducts] = useState([])

    const [optionSelectedFilter, setOptionSelectedFilter] = useState(
        {
            title: 'Sắp xếp theo',
            value: '',
            type: ''
        },
    )

    useEffect(() => {
        document.title = 'Tìm kiếm sản phẩm'
    }, [])

    useEffect(() => {
        fetch(`${api}/products/title/${title}`)
            .then(response => response.json())
            .then(result => {
                setProducts(result.data)
            })
    }, [title])

    useEffect(() => {
        if (optionSelectedFilter.type === 'asc' && optionSelectedFilter.value === 'price') {
            products.sort((a, b) => a.price - b.price)
        } else if (optionSelectedFilter.type === 'desc' && optionSelectedFilter.value === 'price') {
            products.sort((a, b) => b.price - a.price)
        } else if (optionSelectedFilter.type === 'desc' && optionSelectedFilter.value === 'sold') {
            products.sort((a, b) => b.sold - a.sold)
        } else if (optionSelectedFilter.type === 'desc' && optionSelectedFilter.value === 'rate') {
            products.sort((a, b) => b.rate - a.rate)
        }
        setProducts(prev => {
            return [
                ...prev
            ]
        })
    }, [optionSelectedFilter])
    return (
        <div className={cx('wrapper')}>
            <div className={cx('result')}>
                <h3>Kết quả tìm kiếm với:</h3>
                <p>{`${title}(${products.length} kết quả)`}</p>
            </div>
            <div className={cx('fillter')}>
                <div className={cx('fillter_arange')}>
                    <p>Sắp xếp theo:</p>
                    <DropMenu
                        options={optionsArange}
                        size='big'
                        optionSelected={optionSelectedFilter}
                        setOptionSelected={setOptionSelectedFilter}
                    />
                </div>
            </div>

            <div className={cx('product_list')}>
                <GridProduct products={products} />
            </div>
        </div>
    )
}

export default SearchProduct
