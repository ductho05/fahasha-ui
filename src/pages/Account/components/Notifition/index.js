import classNames from 'classnames/bind'
import styles from './Notifition.module.scss'

const cx = classNames.bind(styles)
function Notifition() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('notications_empty')}>
                <p className={cx('message')}>Bạn chưa có thông báo nào</p>
            </div>
        </div>
    )
}

export default Notifition
