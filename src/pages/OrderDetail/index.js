import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import classNames from 'classnames/bind'
import numeral from 'numeral'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import styles from './OrderDetail.module.scss'
import { api } from '../../constants'

const cx = classNames.bind(styles)
function OrderDetail() {

    const { orderId } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState({})
    const [orderItems, setOrderItems] = useState([])

    useEffect(() => {
        document.title = 'Chi tiết đơn hàng'
    }, [])

    useEffect(() => {
        fetch(`${api}/orders/id/${orderId}`)
            .then(response => response.json())
            .then(result => {
                if (result.status == 'OK') {
                    setOrder(result.data)
                }
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        fetch(`${api}/orderitems/order?id=${orderId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(result => {
                if (result.status == 'OK') {
                    setOrderItems(result.data)
                }
            })
            .catch(err => console.log(err))
    }, [])

    const handleBack = () => {
        navigate(`/account/${1}`)
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <h3 onClick={handleBack} className={cx('btn_back')}>
                    <FontAwesomeIcon icon={faAngleLeft} />
                    <p>Trở lại</p>
                </h3>
                <p className={cx('order_code')}>Mã đơn hàng. {order._id}</p>
                <p className={cx('order_status')}>{order.status}</p>
            </div>
            <div className={cx('body')}>
                <div className={cx('left')}>
                    <h3 className={cx('left_title')}>Địa chỉ nhận hàng</h3>
                    <p className={cx('name')}>{order.name}</p>
                    <p className={cx('phone')}>{order.phone}</p>
                    <p className={cx('address')}>{`${order.address}, ${order.wards}, ${order.districs}, ${order.city}, ${order.country}`}</p>
                </div>

                <div className={cx('right')}>
                    <h3 className={cx('right_title')}>Sản phẩm</h3>
                    <ul className={cx('product_list')}>
                        {
                            orderItems.map((item, index) => (
                                <li key={index} className={cx('product_item')}>
                                    <div className={cx('thumbnail')}>
                                        <img src={item.product.images} />
                                    </div>
                                    <div className={cx('product_body')}>
                                        <p className={cx('product_name')}>{item.product.title}</p>
                                        <p className={cx('author')}>Tác giả: 	{item.product.author}</p>
                                        <p className={cx('quantity')}>x{item.quantity}</p>
                                    </div>
                                    <p classNames={cx('total_price_item')}>{numeral(item.price).format('0,0[.]00 VNĐ')} đ</p>
                                </li>
                            ))
                        }
                    </ul>
                    <ul className={cx('summary_list')}>
                        <li className={cx('summary_item')}>
                            <p className={cx('label')}>Tổng tiền hàng</p>
                            <p className={cx('value')}>{numeral(order.price).format('0,0[.]00 VNĐ')} đ</p>
                        </li>

                        <li className={cx('summary_item')}>
                            <p className={cx('label')}>Phí giao hàng</p>
                            <p className={cx('value')}>{numeral(order.shippingCost).format('0,0[.]00 VNĐ')} đ</p>
                        </li>

                        <li className={cx('summary_item')}>
                            <p className={cx('label')}>Phương thức giao hàng</p>
                            <p className={cx('value')}>{order.shipping_method}</p>
                        </li>

                        <li className={cx('summary_item')}>
                            <p className={cx('label')}>Thành tiền</p>
                            <p className={cx('value', 'total_price')}>{numeral(order.price).format('0,0[.]00 VNĐ')} đ</p>
                        </li>

                        <li className={cx('summary_item')}>
                            <p className={cx('label')}>Phương thức thanh toán</p>
                            <p className={cx('value')}>{order.payment_method}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default OrderDetail
