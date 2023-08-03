import { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import { useStore } from '../../../../stores/hooks'
import styles from './Evaluate.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { api } from '../../../../constants'
import { Dialog } from '@mui/material'
import EvaluateForm from '../../../../components/Forms/EvaluateForm'
import { useNavigate } from 'react-router-dom'

const cx = classNames.bind(styles)
function Evaluate() {

    const navigate = useNavigate()
    const rates = [1, 2, 3, 4, 5]
    const tabs = ['Nhận xét của tôi', 'Sản phẩm đã mua chưa đánh giá']
    const [evalutes, setEvaluates] = useState([])
    const [productNotRates, setProductNotRates] = useState([])
    const [state, dispatch] = useStore()
    const [currentTab, setCurrentTab] = useState(0)
    const [showEvalDialog, setShowEvalDialog] = useState(false)
    const [product, setProduct] = useState()
    const [orderItem, setOrderItem] = useState()

    useEffect(() => {
        fetch(`${api}/evaluates?user=${state.user._id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(result => {
                if (result.status == 'OK') {
                    console.log(result.data)
                    setEvaluates(result.data)
                }
            })
            .catch(err => console.log(err))
    }, [showEvalDialog])

    useEffect(() => {
        fetch(`${api}/orderitems/order/filter?user=${state.user._id}&status_order=HOANTHANH&status=CHUADANHGIA`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(result => {
                if (result.status == 'OK') {
                    setProductNotRates(result.data)
                }
            })
            .catch(err => console.log(err))
    }, [showEvalDialog])

    const handleTab = (index) => {
        setCurrentTab(index)
    }

    const handleEval = (id, item) => {
        setOrderItem(item)
        setProduct(id)
        setShowEvalDialog(true)
    }

    const handleSeenDetailEval = (id) => {
        navigate(`/product-detail/${id}/comments-detail`)
    }

    return (
        <div className={cx('wrapper')}>
            <Dialog open={showEvalDialog}>
                <EvaluateForm setShow={setShowEvalDialog} product={product} orderItem={orderItem} />
            </Dialog>
            <ul className={cx('tab_list')}>
                {
                    tabs.map((tab, index) => (
                        <li
                            onClick={() => handleTab(index)}
                            key={index}
                            className={currentTab == index ? cx('tab_item', 'tab_active') : cx('tab_item')}
                        >{tab}</li>
                    ))
                }
            </ul>
            <ul className={currentTab == 0 ? cx('list') : cx('hide')}>
                {
                    evalutes.map((evalute, index) => (
                        <li key={index} className={cx('item')}>
                            <p className={cx('days')}>{new Date(evalute.createdAt).toLocaleDateString()}</p>
                            <p className={cx('name')}>{evalute.product.title}</p>
                            <div className={cx('rate',)}>
                                {
                                    rates.map((rate, index) => (
                                        <span key={index} className={rate <= evalute.rate ? cx('rate_star', 'star_active') : cx('rate_star')}>
                                            <FontAwesomeIcon icon={faStar} />
                                        </span>
                                    ))
                                }
                            </div>
                            <p className={cx('content')}>{evalute.comment}</p>
                            <p onClick={() => handleSeenDetailEval(evalute.product._id)} className={cx('btn_detail')}>Xem chi tiết</p>
                        </li>
                    ))
                }

                <p className={evalutes.length <= 0 ? cx('no_evalute') : cx('hide')}>Bạn chưa có đánh giá nào</p>
            </ul>

            <ul className={currentTab == 1 ? cx('product_list') : cx('hide')}>
                {
                    productNotRates.map((item, index) => (
                        <>
                            <li key={index} className={cx('product_item')}>
                                <div className={cx('thumbnail')}>
                                    <img src={item.product.images} />
                                </div>
                                <div className={cx('product_body')}>
                                    <p className={cx('product_name')}>{item.product.title}</p>
                                    <p className={cx('author')}>Tác giả: 	{item.product.author}</p>
                                </div>
                                <p onClick={() => handleEval(item.product._id, item)} className={cx('btn_eval')}>Viết đánh giá</p>
                            </li>
                            <p onClick={() => handleEval(item.product._id, item)} className={cx('btn_eval_mobile')}>Viết đánh giá</p>
                        </>
                    ))
                }

                <p className={productNotRates.length <= 0 ? cx('no_evalute') : cx('hide')}>Bạn không có sản phẩm nào chưa đánh giá</p>
            </ul>
        </div>
    )
}

export default Evaluate