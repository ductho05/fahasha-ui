import { useState, useEffect } from 'react'
import className from 'classnames/bind'
import { useParams } from 'react-router-dom'
import styles from './SearchProduct.module.scss'
import DropMenu from '../../components/DropMenu'
import Paging from '../../components/Paging'
import GridProduct from '../../components/GridProduct'
import { optionsArange, optionsNumProduct, api } from '../../constants'
import { Backdrop, CircularProgress } from '@mui/material'
import GridProductLoading from '../../components/GridProductLoading'
import { Checkbox, Rate, Select } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

const cx = className.bind(styles)
const priceOptions = [
    {
        label: "0đ - 150,000 đ",
        valueMin: 0,
        valueMax: 150000
    },
    {
        label: "150000 đ - 300,000 đ",
        valueMin: 150000,
        valueMax: 300000
    },
    {
        label: "300,000 đ - 500,000 đ",
        valueMin: 300000,
        valueMax: 500000
    },
    {
        label: "500,000 đ - 700,000 đ",
        valueMin: 500000,
        valueMax: 700000
    },
    {
        label: "700.000 đ - Trở lên",
        valueMin: 700000
    }
]

const rateOptions = [1, 2, 3, 4, 5]
function SearchProduct() {
    const { title } = useParams()
    const [showProgress, setShowProgress] = useState(false)
    const [products, setProducts] = useState([])
    const [pages, setPages] = useState([])
    const [numPages, setNumPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [listCurrentPage, setListCurrentPage] = useState([])
    const [optionSelected, setOptionSelected] = useState(
        {
            title: '12 sản phẩm',
            value: 12
        }
    )
    const [optionSelectedFilter, setOptionSelectedFilter] = useState(
        {
            title: 'Sắp xếp theo',
            value: null,
            type: null
        },
    )
    const [price, setPrice] = useState(null)
    const [rate, setRate] = useState(null)
    const [options, setOptions] = useState([])
    const [selectCategory, setSelectCategory] = useState(null)

    useEffect(() => {
        document.title = 'Sản phẩm'
    }, [])

    const fiveAndLast = (pages, page) => {
        var index = page > 0 ? page - 1 : page
        return pages.length - 1 - page > 5 ? pages.slice(index - 1, index + 4).concat(numPages) : pages
    }

    useEffect(() => {
        fetch(`${api}/categories?filter=simple`)
            .then(response => response.json())
            .then(result => {
                if (result.status == "OK") {
                    const newList = result.data.map(category => {
                        return {
                            label: category.name,
                            value: category._id
                        }
                    })
                    setOptions(newList)
                }
            })
            .catch(err => console.log(err.message))
    }, [])

    const fetchPages = (quantity) => {
        const numPages = Math.ceil(quantity / optionSelected.value)
        let tempPages = []
        for (let i = 1; i <= numPages; i++) {
            tempPages.push(i)
        }
        setNumPages(numPages)
        setPages(tempPages)
        var initListPage = numPages > 5 ? tempPages.slice(0, 5).concat(numPages) : tempPages
        setListCurrentPage(initListPage)
    }

    const fetchProduct = () => {

        let query = `${api}/products/?title=${title}&perPage=${optionSelected.value}&page=${currentPage}`

        if (selectCategory) {
            query += `&category=${selectCategory.value}`
        }

        if (optionSelectedFilter.value) {
            query += `&filter=${optionSelectedFilter.value}&sort=${optionSelectedFilter.type}`
        }
        if (price) {
            if (price.valueMin && price.valueMax) {
                query += `&minPrice=${price.valueMin}&maxPrice=${price.valueMax}`
            } else {
                query += `&minPrice=${price.valueMin}`
            }
        }
        if (rate) {
            query += `&rate=${rate}`
        }
        setShowProgress(true)
        fetch(query)
            .then(response => response.json())
            .then(result => {
                setShowProgress(false)
                setProducts(result.data.products)
                fetchPages(result.data.quantity)
            })
            .catch(err => {
                setShowProgress(false)
                console.error(err.message)
            })
    }

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const handleChangePrice = (option) => {

        setPrice(option)
    }

    const handleChangeRate = (rateItem) => {

        setRate(rateItem)
    }

    const handleChangeCategory = (value, option) => {

        setSelectCategory(option)
    }

    const handleClearFilter = () => {
        setPrice(null)
        setRate(null)
        setSelectCategory(null)
    }

    useEffect(() => {
        setProducts([])
        fetchProduct()
    }, [currentPage, optionSelected, optionSelectedFilter])

    useEffect(() => {
        setCurrentPage(1)
        setProducts([])
        fetchProduct()
    }, [rate, price, selectCategory])

    return (
        <div className={cx('wrapper')}>
            <div className='flex items-center p-[20px] shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] mb-[20px] rounded-[12px]'>
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

            <div className='flex gap-[20px]'>
                <div className='flex-[2] h-max p-[20px] shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] mb-[20px] rounded-[12px]'>
                    <div className="border-b pt-[20px]">
                        <h1 className="text-[1.6rem] text-[#333] uppercase font-[600]">
                            Nhóm sản phẩm
                        </h1>
                        <Select
                            onChange={handleChangeCategory}
                            showSearch
                            placeholder="Chọn danh mục"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            options={options}
                            className="my-[20px] w-full"
                        />
                    </div>
                    <div className="border-b pt-[20px]">
                        <h1 className="text-[1.6rem] text-[#333] uppercase font-[600]">
                            Giá
                        </h1>
                        {
                            priceOptions.map(option => (
                                <div key={option.label} className="p-[10px]">
                                    <Checkbox
                                        onChange={() => handleChangePrice(option)}
                                        checked={option.valueMin === price?.valueMin}
                                        className="text-[1.5rem] text-[#333] font-[500]"
                                    >
                                        {option.label}
                                    </Checkbox>
                                </div>
                            ))
                        }
                    </div>
                    <div className="border-b pt-[20px]">
                        <h1 className="text-[1.6rem] text-[#333] uppercase font-[600]">
                            Đánh giá
                        </h1>
                        {
                            rateOptions.map(rateItem => (
                                <div key={rateItem} className="p-[10px]">
                                    <Checkbox
                                        onChange={() => handleChangeRate(rateItem)}
                                        checked={rate === rateItem}
                                        className="text-[1.5rem] text-[#333] font-[500]"
                                    >
                                        <Rate disabled defaultValue={rateItem} />
                                    </Checkbox>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className='flex-[8] h-max p-[20px] shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] mb-[20px] rounded-[12px]'>
                    {
                        selectCategory || price || rate ?
                            <div className="flex pt-[20px] pb-[10px] items-center gap-[15px] flex-wrap">
                                <p className='text-[1.6rem] text-[#333] font-[500]'>Lọc theo: </p>
                                {
                                    selectCategory &&
                                    <p className="flex items-center px-[20px] py-[14px] bg-[#f7941e1a] text-[#F7941E] rounded-[6px]">
                                        Nhóm: {selectCategory.label}
                                        <CloseOutlined onClick={() => setSelectCategory(null)} className='ml-[10px] cursor-pointer' />
                                    </p>
                                }
                                {
                                    price &&
                                    <p className="flex items-center px-[20px] py-[14px] bg-[#f7941e1a] text-[#F7941E] rounded-[6px]">
                                        Giá tiền: {price.label}
                                        <CloseOutlined onClick={() => setPrice(null)} className='ml-[10px] cursor-pointer' />
                                    </p>
                                }
                                {
                                    rate &&
                                    <p className="flex items-center px-[20px] py-[14px] bg-[#f7941e1a] text-[#F7941E] rounded-[6px]">
                                        <span>Đánh giá: {rate} sao</span>
                                        <CloseOutlined onClick={() => setRate(null)} className='ml-[10px] cursor-pointer' />
                                    </p>
                                }
                                <div
                                    onClick={handleClearFilter}
                                    className='flex cursor-pointer items-center px-[10px] py-[12px] text-[#F7941E] border border-[#f7941E] rounded-[6px]'
                                >
                                    <p>Xóa bộ lọc</p>
                                </div>
                            </div>
                            : ""
                    }

                    <div className={cx('product_list')}>
                        {
                            showProgress ? <GridProductLoading /> : <GridProduct products={products} />
                        }

                    </div>
                    {
                        products.length <= 0 ?
                            <div className="w-full p-[20px] border border-[#fcd344] bg-[#fafaec]">
                                <p className="text-[#333] text-[1.6rem] font-[500]">Không có sản phẩm phù hợp với từ khóa tìm kiếm</p>
                            </div> : ""
                    }

                    {
                        products.length > 0 ? <div className={numPages > 1 || !showProgress ? cx('bottom') : cx('hidden')}>
                            <Paging
                                numPages={numPages}
                                pages={pages}
                                listCurrentPage={listCurrentPage}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                setListCurrentPage={setListCurrentPage}
                                fiveAndLast={fiveAndLast}
                            />
                        </div> : ""
                    }
                </div>
            </div>
        </div>
    )
}

export default SearchProduct
