import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import classNames from 'classnames/bind'
import numeral from 'numeral'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import styles from './OrderDetail.module.scss'
import { api, appPath, cancelOrderImage, CHOXACNHAN, DAHUY } from '../../constants'
import { Button, Popconfirm, message } from 'antd';
import SendNotification from "../../service/SendNotification"
import { useStore } from "../../stores/hooks"
import Skeleton from '@mui/material/Skeleton';
import { Backdrop, CircularProgress } from '@mui/material'
import { getAuthInstance } from '../../utils/axiosConfig'
import axios from 'axios'
import localstorge from '../../stores/localstorge'

const cx = classNames.bind(styles)
function OrderDetail() {

    const authInstance = getAuthInstance()

    const { orderId } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState({})
    const [orderItems, setOrderItems] = useState([])
    const [state, dispach] = useStore()
    const [loading, setLoading] = useState(false)
    const [loadingUpdate, setLoadingUpdate] = useState(false)
    const [updateSuccess, setUpdateSuccess] = useState(false)

    useEffect(() => {
        document.title = 'Chi tiết đơn hàng'
    }, [])

    useEffect(() => {
        setLoading(true)
        authInstance.get(`/orders/id/${orderId}`)
            .then(result => {
                if (result.data.status == 'OK') {
                    setOrder(result.data.data)
                }
                setLoading(false)
            })
            .catch(err => setLoading(false))
    }, [updateSuccess])

    useEffect(() => {
        setLoading(true)
        authInstance.get(`/orderitems/order?id=${orderId}`)
            .then(result => {
                if (result.data.status == 'OK') {
                    setOrderItems(result.data.data)
                }
                setLoading(false)
            })
            .catch(err => setLoading(false))
    }, [updateSuccess])

    const handleBack = () => {
        navigate(`/account/${1}`)
    }

    const handleUpdate = () => {
        setLoadingUpdate(true)
        authInstance.put(`/orders/update/${order._id}`, {
            status: DAHUY
        })
            .then(result => {
                if (result.data.status === "OK") {
                    const title = "Thông báo đơn hàng"
                    const description = `${state.user.fullName} vừa hủy đơn hàng`
                    const image = cancelOrderImage
                    const url = `${appPath}/admin/orders`
                    message.success("Đã hủy đơn hàng")

                    axios.post(`${api}/webpush/send`, {
                        filter: "admin",
                        notification: {
                            title,
                            description,
                            image,
                            url,
                        }
                    },
                        {
                            headers: {
                                'Authorization': `Bearer ${localstorge.get()}`
                            }
                        }
                    )
                        .then(result => {
                            if (result.data.status === "OK") {

                            }
                        })
                        .catch(err => {
                            console.error(err)
                        })
                    setUpdateSuccess(prev => !prev)
                } else {
                    message.error("Lỗi hủy đơn hàng")
                }
                setLoadingUpdate(false)
            })
            .catch(err => {
                console.error(err)
                message.error("Lỗi hủy đơn hàng")
                setLoadingUpdate(false)
            })
    }

    return (
        <div className="p-[10px] md:p-[20px] lg:p-[40px]">
            <Backdrop
                sx={{ color: '#fff', zIndex: 10000 }}
                open={loadingUpdate}
            >
                <CircularProgress color="error" />
            </Backdrop>
            {
                loading ? <Loading /> :
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
                                {
                                    order.status === CHOXACNHAN &&
                                    <Popconfirm
                                        title="Xác nhận hủy"
                                        description="Đơn hàng sẽ bị hủy"
                                        onConfirm={handleUpdate}
                                        onCancel={() => { }}
                                        okText="Đồng ý"
                                        cancelText="Hủy"
                                    >
                                        <Button className="mt-[20px]" type="primary" danger>
                                            Hủy đơn hàng
                                        </Button>
                                    </Popconfirm>

                                }
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
            }
        </div>
    )
}

const Loading = () => {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <h3 className={cx('btn_back')}>
                    <p>
                        <Skeleton variant='text' sx={{ fontSize: '1.4rem' }} />
                    </p>
                </h3>
                <p className={cx('order_code')}><Skeleton variant='text' sx={{ fontSize: '1.4rem' }} /></p>
                <p className={cx('order_status')}><Skeleton variant='text' sx={{ fontSize: '1.4rem' }} /></p>
            </div>
            <div className={cx('body')}>
                <div className={cx('left')}>
                    <h3 className={cx('left_title')}><Skeleton variant='text' sx={{ fontSize: '2rem' }} /></h3>
                    <p className={cx('name')}><Skeleton variant='text' sx={{ fontSize: '1.4rem' }} /></p>
                    <p className={cx('phone')}><Skeleton variant='text' sx={{ fontSize: '1.4rem' }} /></p>
                    <p className={cx('address')}><Skeleton variant='text' sx={{ fontSize: '1.4rem' }} /></p>
                    <Skeleton variant='rounded' width={130} height={32} />
                </div>

                <div className={cx('right')}>
                    <h3 className={cx('right_title')}><Skeleton variant='text' sx={{ fontSize: '1.4rem' }} /></h3>
                    <ul className={cx('product_list')}>
                        {
                            [1, 2].map((item, index) => (
                                <li key={index} className={cx('product_item')}>
                                    <div className={cx('thumbnail')}>
                                        <Skeleton variant='rounded' width={100} height={100} />
                                    </div>
                                    <div className={cx('product_body')}>
                                        <p className={cx('product_name')}><Skeleton variant='text' sx={{ fontSize: '1.4rem' }} /></p>
                                        <p className={cx('author')}><Skeleton variant='text' sx={{ fontSize: '1.4rem' }} /></p>
                                        <p className={cx('quantity')}><Skeleton variant='text' sx={{ fontSize: '1.4rem' }} /></p>
                                    </div>
                                    <p classNames={cx('total_price_item')}><Skeleton variant='text' sx={{ fontSize: '1.4rem' }} /></p>
                                </li>
                            ))
                        }
                    </ul>
                    <ul className={cx('summary_list')}>
                        <li className={cx('summary_item')}>
                            <p className={cx('label')}><Skeleton variant='text' sx={{ fontSize: '1.4rem' }} /></p>
                            <p className={cx('value')}><Skeleton variant='text' sx={{ fontSize: '1.4rem' }} /></p>
                        </li>

                        <li className={cx('summary_item')}>
                            <p className={cx('label')}><Skeleton variant='text' sx={{ fontSize: '1.4rem' }} /></p>
                            <p className={cx('value')}><Skeleton variant='text' sx={{ fontSize: '1.4rem' }} /></p>
                        </li>

                        <li className={cx('summary_item')}>
                            <p className={cx('label')}><Skeleton variant='text' sx={{ fontSize: '1.4rem' }} /></p>
                            <p className={cx('value')}><Skeleton variant='text' sx={{ fontSize: '1.4rem' }} /></p>
                        </li>

                        <li className={cx('summary_item')}>
                            <p className={cx('label')}><Skeleton variant='text' sx={{ fontSize: '1.4rem' }} /></p>
                            <p className={cx('value', 'total_price')}><Skeleton variant='text' sx={{ fontSize: '1.4rem' }} /></p>
                        </li>

                        <li className={cx('summary_item')}>
                            <p className={cx('label')}><Skeleton variant='text' sx={{ fontSize: '1.4rem' }} /></p>
                            <p className={cx('value')}><Skeleton variant='text' sx={{ fontSize: '1.4rem' }} /></p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default OrderDetail
