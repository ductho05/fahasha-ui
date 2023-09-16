import classNames from 'classnames/bind'
import styles from './ProgressChart.module.scss'
import { CircularProgressbar } from "react-circular-progressbar"
import 'react-circular-progressbar/dist/styles.css';

const cx = classNames.bind(styles)
function ProgressChart() {
    return (
        <>
            <h3 className={cx('total_revenue')}>Tổng doanh thu</h3>
            <div className={cx('body')}>
                <CircularProgressbar
                    value={66}
                    text='66 %'
                    strokeWidth={6}
                    styles={{
                        path: {
                            stroke: `#f88`,
                            transition: 'stroke-dashoffset 0.5s ease 0s',
                        },
                        trail: {
                            stroke: '#d6d6d6',
                        },
                        text: {
                            fill: '#f88',
                            fontSize: '1.8rem',
                        },
                        background: {
                            fill: '#3e98c7',
                        },
                    }}
                    className={cx('sell-today')} />
                <p className={cx('content')}>
                    Tổng doanh thu bán được trong hôm nay
                </p>
                <p className={cx('total')}>230K VNĐ</p>
                <p className={cx('content')}>
                    Doanh thu so với thời điểm trước
                </p>
                <div className={cx('last_revenue')}>
                    <div className={cx('last_item')}>
                        <p className={cx('last_title')}>Hôm trước</p>
                        <p className={cx('last_value', 'yesterday')}>300K</p>
                    </div>
                    <div className={cx('last_item')}>
                        <p className={cx('last_title')}>Tuần trước</p>
                        <p className={cx('last_value', 'last_week')}>2.1M</p>
                    </div>
                    <div className={cx('last_item')}>
                        <p className={cx('last_title')}>Tháng trước</p>
                        <p className={cx('last_value', 'last_month')}>8.4M</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProgressChart
