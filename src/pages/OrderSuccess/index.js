import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Dialog } from "@mui/material"
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'

import styles from './OrderSuccess.module.scss'

const cx = classNames.bind(styles)
function OrderSuccess() {
    const navigate = useNavigate()
    const { orderId } = useParams()

    useEffect(() => {
        document.title = 'Thanh toán thành công'
    }, [])

    const handleBackToCart = () => {
        navigate('/cart')
    }

    const handleToOrder = () => {
        navigate(`/account/order/detail/${orderId}`)
    }

    return (
        <div>
            <Dialog open={true}>
                <div className={cx('dialog')}>
                    <div className={cx('heading')}>
                        <FontAwesomeIcon icon={faCircleCheck} />
                    </div>
                    <p className={cx('dialog_notice')}>Thanh toán đơn hàng thành công!</p>
                    <ul className={cx('btns')}>
                        <li className={cx('btn', 'back_to_cart')} onClick={handleBackToCart}>Quay lại giỏ hàng</li>
                        <li className={cx('btn', 'order_detail')} onClick={handleToOrder}>Chi tiết đơn hàng</li>
                    </ul>
                </div>
            </Dialog>
        </div>
    )
}

export default OrderSuccess
