import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './Account.module.scss';
import AccountInfo from './components/AccountInfo';
import ListOrders from './components/ListOrders';
import Evaluate from './components/Evaluate';
import Notifition from './components/Notifition';

import { logout } from '../../stores/actions';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../stores/hooks';
import { LOGOUT } from '../../stores/constants';
import FlashSale from '../../admin/pages/UseFul/FlashSale';
import Favorite from '../Favorite';

const cx = classNames.bind(styles);
const listTabs = ['Thông tin tài khoản', 'Đơn hàng của tôi', 'Nhận xét của tôi', 'Thông báo', 'Danh sách yêu thích'];
function Account() {
    const { index } = useParams();
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [state, dispatch] = useStore();

    const handleLogout = () => {
        dispatch(logout({}));
    };

    useEffect(() => {
        document.title = 'Tài khoản';
    }, []);

    useEffect(() => {
        setCurrentIndex(index);
    }, [index]);

    useEffect(() => {
        if (state.action == LOGOUT) {
            navigate('/');
        }
    }, [state]);

    const handleTabClick = (index) => {
        setCurrentIndex(index);
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('account')}>
                    <div className={cx('left')}>
                        <h3 className={cx('heading')}>Tài khoản</h3>
                        <ul className={cx('feature_list')}>
                            {listTabs.map((tab, index) => (
                                <li
                                    onClick={() => handleTabClick(index)}
                                    className={
                                        index == currentIndex ? cx('feature_item', 'active') : cx('feature_item')
                                    }
                                >
                                    {tab}
                                </li>
                            ))}
                            {/* {state.user.isManager && (
                                <li
                                    onClick={() => {
                                        navigate('/admin');
                                    }}
                                    className={cx('feature_item')}
                                >
                                    Quản lý hệ thống
                                </li>
                            )} */}
                            <li onClick={handleLogout} className={cx('feature_item')}>
                                Đăng xuất
                            </li>
                        </ul>
                    </div>

                    <div className={cx('right')}>
                        <div className={currentIndex == 0 ? cx('infomation') : cx('hide')}>
                            <AccountInfo />
                        </div>

                        <div className={currentIndex == 1 ? cx('infomation') : cx('hide')}>
                            <ListOrders />
                        </div>

                        <div className={currentIndex == 2 ? cx('infomation') : cx('hide')}>
                            <Evaluate />
                        </div>

                        <div className={currentIndex == 3 ? cx('infomation') : cx('hide')}>
                            <Notifition />
                        </div>
                        <div className={currentIndex == 4 ? cx('infomation') : cx('hide')}>
                            <Favorite />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Account;
