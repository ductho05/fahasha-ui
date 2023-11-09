import dayjs from 'dayjs';
import React, { useState, useEffect, flashef } from 'react';
import classNames from 'classnames/bind';
import styles from './CountDownCustom.module.scss';
import { Skeleton } from 'antd';
function formatNumber(number) {
    if (number < 10) {
        // Nếu số nhỏ hơn 10, thêm số 0 phía trước và chuyển thành chuỗi
        return '0' + number;
    } else {
        // Nếu số lớn hơn hoặc bằng 10, giữ nguyên số và chuyển thành chuỗi
        return number.toString();
    }
}
const App = ({ title, isLoading, props }) => {
    const cx = classNames.bind(styles);
    const [countdown, setCountdown] = useState(null);
    const deadline = localStorage.getItem('date_flash') ? localStorage.getItem('date_flash') : null;

    useEffect(() => {
        let countDownDate = null;

        countDownDate = deadline
            ? new Date(deadline).getTime()
            : new Date().setHours((Math.floor(new Date().getHours() / 3) + 1) * 3, 0, 0);

        // Cập nhật đồng hồ đếm ngược mỗi 1 giây
        const x = setInterval(() => {
            // Lấy thời gian hiện tại
            const now = new Date().getTime();

            // Tính thời gian còn lại giữa thời gian hiện tại và thời gian kết thúc đếm ngược
            const distance = countDownDate - now;

            // Tính toán thời gian cho giờ, phút và giây
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Hiển thị đồng hồ đếm ngược
            setCountdown(
                days != 0
                    ? `${formatNumber(days)}d`
                    : '' + ` ${formatNumber(hours)}h ${formatNumber(minutes)}m ${formatNumber(seconds)}s`,
            );

            // Nếu đếm ngược kết thúc, dừng cập nhật
            if (distance < 0) {
                clearInterval(x);
                isLoading = !isLoading;
                setCountdown('ĐÃ KẾT THÚC');
            }
        }, 1000);

        // Clear interval khi component unmount
        return () => clearInterval(x);
    }, [isLoading]);
    return (
        <>
            <div className={cx('gift_current__time')}>
                {countdown != 'ĐÃ KẾT THÚC' && (
                    <p
                        className={cx('gift_current__time__title')}
                        style={
                            props
                                ? props
                                : {
                                      fontSize: '2rem',
                                      color: '#d53c3c',
                                      justifyContent: 'center',
                                      width: '150px',
                                      margin: '0 10px',
                                  }
                        }
                    >
                        {countdown ? (
                            title
                        ) : (
                            <Skeleton.Input style={{ width: 100, height: 47 }} active={true} size="default" />
                        )}
                    </p>
                )}
                <p
                    style={
                        countdown == 'ĐÃ KẾT THÚC'
                            ? { color: 'darkgreen' }
                            : {
                                  color: '#ff0000',
                                  justifyContent: props ? 'left' : 'center',
                              }
                    }
                    className={cx('gift_current__time__content')}
                >
                    {countdown ? (
                        <div
                            style={
                                props
                                    ? {
                                          backgroundColor: 'white',
                                          height: '47px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          padding: '0 1rem',
                                          borderRadius: '5px',
                                      }
                                    : {
                                          width: '220px',
                                          margin: '0 10px',
                                      }
                            }
                        >
                            {countdown}
                        </div>
                    ) : (
                        <Skeleton.Input style={{ width: 100, height: 47 }} active={true} size="default" />
                    )}
                </p>
            </div>
        </>
    );
};
export default App;
