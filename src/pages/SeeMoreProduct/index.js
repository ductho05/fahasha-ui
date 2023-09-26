import { useState, useEffect } from 'react'
import className from 'classnames/bind'
import { useParams } from 'react-router-dom'
import styles from './SeeMoreProduct.module.scss'
import DropMenu from '../../components/DropMenu'
import Paging from '../../components/Paging'
import GridProduct from '../../components/GridProduct'
import { optionsArange, optionsNumProduct, api } from '../../constants'
import { Backdrop, CircularProgress } from '@mui/material'

const cx = className.bind(styles)
function SeeMoreProduct() {

    let { categoryId } = useParams()
    if (categoryId == 0) {
        categoryId = ''
    }
    const [showProgress, setShowProgress] = useState(false)
    const [products, setProducts] = useState([])
    const [pages, setPages] = useState([])
    const [numPages, setNumPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [listCurrentPage, setListCurrentPage] = useState([])
    const [optionSelected, setOptionSelected] = useState(
        {
            title: '10 sản phẩm',
            value: 10
        }
    )
    const [optionSelectedFilter, setOptionSelectedFilter] = useState(
        {
            title: 'Sắp xếp theo',
            value: '',
            type: ''
        },
    )

    useEffect(() => {
        document.title = 'Sản phẩm'
    }, [])

    const fiveAndLast = (pages, page) => {
        var index = page > 0 ? page - 1 : page
        return pages.length - 1 - page > 5 ? pages.slice(index - 1, index + 4).concat(numPages) : pages
    }
    const fetchPages = () => {
        fetch(`${api}/products/count_product?category=${categoryId}`)
            .then(response => response.json())
            .then(result => {
                const numPages = Math.ceil(result.data / optionSelected.value)
                let tempPages = []
                for (let i = 1; i <= numPages; i++) {
                    tempPages.push(i)
                }
                setNumPages(numPages)
                setPages(tempPages)
                var initListPage = numPages > 5 ? tempPages.slice(0, 5).concat(numPages) : tempPages
                setListCurrentPage(initListPage)
            })
    }

    const fetchProduct = () => {
        setShowProgress(true)
        fetch(`${api}/products/?category=${categoryId}&perPage=${optionSelected.value}&page=${currentPage}&filter=${optionSelectedFilter.value}&sort=${optionSelectedFilter.type}`)
            .then(response => response.json())
            .then(result => {
                setShowProgress(false)
                setProducts(result.data)
            })
            .catch(err => {
                setShowProgress(false)
                console.error(err.message)
            })
    }
    useEffect(() => {
        setProducts([])
        fetchProduct()
        fetchPages()
    }, [currentPage, optionSelected, optionSelectedFilter, categoryId])

    return (
        <div className={cx('wrapper')}>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showProgress}>
                <CircularProgress color="inherit" />
            </Backdrop>
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

                <div className={cx('filter_num_product')}>
                    <DropMenu
                        options={optionsNumProduct}
                        size='small'
                        optionSelected={optionSelected}
                        setOptionSelected={setOptionSelected}
                    />
                </div>
            </div>

            <div className={cx('product_list')}>
                <GridProduct products={products} />
            </div>

            <div className={numPages > 1 || !showProgress ? cx('bottom') : cx('hidden')}>
                <Paging
                    numPages={numPages}
                    pages={pages}
                    listCurrentPage={listCurrentPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    setListCurrentPage={setListCurrentPage}
                    fiveAndLast={fiveAndLast}
                />
            </div>
        </div>
    )
}

export default SeeMoreProduct
