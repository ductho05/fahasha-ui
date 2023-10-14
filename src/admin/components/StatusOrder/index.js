import React from 'react'
import classNames from 'classnames/bind';
import styles from './StatusOrder.module.scss'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { HOANTHANH, DAHUY, CHOXACNHAN, DANGGIAO } from '../../../constants';

const cx = classNames.bind(styles)

function StatusOrder({ status }) {
    const [action, setAction] = React.useState(() => {
        if (status === CHOXACNHAN) {
            return "Xác nhận đơn hàng"
        } else if (status === DANGGIAO) {
            return "Hoàn thành đơn hàng"
        } else if (status === HOANTHANH) {
            return "Đã hoàn thành"
        } else if (status === DAHUY) {
            return "Đã hủy"
        }
    })

    return (
        <div className={status === HOANTHANH || status === DAHUY ? cx('status', 'disabled', status === DAHUY && 'cancle') : cx('status')}>
            {action}
            {
                status === HOANTHANH &&
                <CheckCircleIcon className={cx('icon')} />
            }
            {
                status === DAHUY &&
                <ErrorIcon className={cx('icon')} />
            }
        </div>
    )
}

export default StatusOrder