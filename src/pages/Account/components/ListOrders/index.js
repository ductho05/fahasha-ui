import { useEffect, useState } from "react"
import classNames from "classnames/bind"
import numeral from "numeral"
import { useNavigate } from 'react-router-dom'
import styles from './ListOrders.module.scss'
import { api } from "../../../../constants"
import { useStore } from '../../../../stores/hooks'
import { Skeleton } from 'antd';
import { getAuthInstance } from '../../../../utils/axiosConfig'

const cx = classNames.bind(styles)
const tabList = [
    {
        title: 'Tất cả',
        value: 'TATCA'
    },
    {
        title: 'Đang chờ xác nhận',
        value: 'CHOXACNHAN'
    },
    {
        title: 'Đang giao',
        value: 'DANGGIAO'
    },
    {
        title: 'Hoàn thành',
        value: 'HOANTHANH'
    },
    {
        title: 'Đã hủy',
        value: 'DAHUY'
    }
]
function ListOrders() {

    const navigate = useNavigate()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [listOrders, setListOrders] = useState([])
    const [state, dispatch] = useStore()
    const [loading, setLoading] = useState(false)

    const authInstance = state.authInstance

    useEffect(() => {
        if (tabList[currentIndex].value == 'TATCA') {
            setLoading(true)
            authInstance.post(`${api}/orders/user`)
                .then(result => {
                    if (result.data.status == 'OK') {
                        setListOrders(result.data.data)
                    }
                    setLoading(false)
                })
                .catch(err => {
                    console.log(err)
                    setLoading(false)
                })
        } else {
            setLoading(true)
            authInstance.post(`${api}/orders/filter?status=${tabList[currentIndex].value}&user=${state.user._id}`)
                .then(result => {
                    if (result.data.status == 'OK') {
                        setListOrders(result.data.data)
                    }
                    setLoading(false)
                })
                .catch(err => {
                    console.log(err)
                    setLoading(false)
                })
        }
    }, [currentIndex])

    const handleTab = (index) => {
        setCurrentIndex(index)
    }

    const handleClickOrder = (id) => {
        navigate(`/account/order/detail/${id}`)
    }


    return (
        <div className={cx('wrapper')}>
            <ul className={cx('tab_list')}>
                {
                    tabList.map((tab, index) => (
                        <li
                            onClick={() => handleTab(index)}
                            key={index}
                            className={index === currentIndex ? cx('tab_item', 'tab_active') : cx('tab_item')}
                        >
                            {tab.title}
                        </li>
                    ))
                }
            </ul>
            {
                loading ? <div className='p-[20px] bg-white'>
                    <Skeleton
                        active
                        paragraph={{
                            rows: 8,
                        }}
                    />
                </div>
                    : <>
                        <ul className={cx('order_list')}>
                            {
                                listOrders.map((order, index) => (
                                    <li onClick={() => handleClickOrder(order._id)} key={index} className={cx('order_item')}>
                                        <div className={cx('order_infor')}>
                                            <p className={cx('username')}>{order.name}</p>
                                            <p className={cx('address')}>{`${order.address}, ${order.wards}, ${order.districs}, ${order.city}, ${order.country}`}</p>
                                            <p className={cx('quantity_product')}>Số lượng:
                                                <span>{`${order.quantity}  sản phẩm`}</span>
                                            </p>
                                        </div>
                                        <div className={cx('total_price')}>
                                            <p className={cx('label')}>Thành tiền: </p>
                                            <p className={cx('price')}>{numeral(order.price).format('0,0[.]00 VNĐ')} đ</p>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>

                        <div className={listOrders.length <= 0 ? cx('listorders_empty') : cx('hide')}>
                            <p className="text-center">Danh sách đơn hàng trống</p>
                        </div>
                    </>
            }
        </div>
    )
}

export default ListOrders
