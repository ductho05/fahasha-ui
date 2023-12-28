import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ViewStreamOutlinedIcon from '@mui/icons-material/ViewStreamOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import StackedLineChartOutlinedIcon from '@mui/icons-material/StackedLineChartOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Scrollbar } from 'react-scrollbars-custom';
import CategoryIcon from '@mui/icons-material/Category';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReviewsIcon from '@mui/icons-material/Reviews';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../../stores/hooks';
import { logout } from '../../../../stores/actions';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
const cx = classNames.bind(styles);

export const tabList = [
    {
        type: 'Trang chủ',
        tabs: [
            {
                id: 0,
                icon: DashboardIcon,
                name: 'Dashboard',
                link: '/admin',
            },
        ],
    },
    {
        type: 'Quản lý',
        tabs: [
            {
                id: 1,
                icon: PersonOutlineOutlinedIcon,
                name: 'Người dùng',
                link: '/admin/user',
            },
            {
                id: 2,
                icon: Inventory2OutlinedIcon,
                name: 'Sản phẩm',
                link: '/admin/products',
            },
            {
                id: 3,
                icon: ViewStreamOutlinedIcon,
                name: 'Đơn hàng',
                link: '/admin/orders',
            },
            {
                id: 4,
                icon: CategoryIcon,
                name: 'Danh mục sản phẩm',
                link: '/admin/categories',
            },
            {
                id: 5,
                icon: ReviewsIcon,
                name: 'Đánh giá',
                link: '/admin/reviews',
            },
            {
                id: 6,
                icon: FavoriteIcon,
                name: 'Sản phẩm yêu thích',
                link: '/admin/wishlists',
            },
            {
                id: 7,
                icon: ConfirmationNumberIcon,
                name: 'Mã giảm giá',
                link: '/admin/vouchers',
            },
        ],
    },
    {
        type: 'Tính năng',
        tabs: [
            {
                id: 8,
                icon: StackedLineChartOutlinedIcon,
                name: 'Thống kê',
                link: '/admin/statistics',
            },
            {
                id: 9,
                icon: NotificationsNoneOutlinedIcon,
                name: 'Thông báo',
                link: '/admin/notifications',
            },
            {
                id: 10,
                icon: LoyaltyIcon,
                name: 'Flash Sale',
                link: '/admin/flashsale',
            },
        ],
    },
    {
        type: 'Cá nhân',
        tabs: [
            {
                id: 11,
                icon: AccountBoxOutlinedIcon,
                name: 'Thông tin nhân viên',
                link: '/admin/account',
            },
            {
                id: 12,
                icon: LogoutOutlinedIcon,
                name: 'Đăng xuất',
                logout: true,
            },
        ],
    },
];

function SideBar({ url }) {
    const [currentTab, setCurrentTab] = useState(
        url == '/admin'
            ? 0
            : url.includes(`/admin/user`)
            ? 1
            : url.includes(`/admin/products`)
            ? 2
            : url.includes(`/admin/orders`)
            ? 3
            : url.includes(`/admin/reviews`)
            ? 4
            : url.includes(`/admin/categories`)
            ? 5
            : url.includes('/admin/wishlists')
            ? 6
            : url.includes('/admin/vouchers')
            ? 7
            : url.includes('/admin/statistics')
            ? 8
            : url.includes('/admin/notifications')
            ? 9
            : url.includes(`/admin/flashsale`)
            ? 10
            : url.includes('/admin/account')
            ? 11
            : -1,
    );

    useEffect(() => {
        setCurrentTab(
            url == '/admin'
                ? 0
                : url.includes(`/admin/user`)
                ? 1
                : url.includes(`/admin/products`)
                ? 2
                : url.includes(`/admin/orders`)
                ? 3
                : url.includes(`/admin/reviews`)
                ? 4
                : url.includes(`/admin/categories`)
                ? 5
                : url.includes('/admin/wishlists')
                ? 6
                : url.includes('/admin/vouchers')
                ? 7
                : url.includes('/admin/statistics')
                ? 8
                : url.includes('/admin/notifications')
                ? 9
                : url.includes(`/admin/flashsale`)
                ? 10
                : url.includes('/admin/account')
                ? 11
                : -1,
        );
    }, [url]);

    const [state, dispatch] = useStore();
    const handleClickTab = (id) => {
        setCurrentTab(id);
    };

    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('top')}>
                <h2
                    onClick={() => {
                        navigate('/admin');
                    }}
                >
                    TA BookStore Admin
                </h2>
            </div>
            {/* <Scrollbar removeTrackYWhenNotUsed style={{ width: 250, height: '100vh' }}> */}
            <div className={cx('bottom')} style={{ width: 250, height: '100vh' }}>
                <ul className={cx('items')}>
                    {tabList.map((tabItem, typeindex) => (
                        <div key={typeindex}>
                            <p className={cx('name')}>{tabItem.type}</p>
                            {tabItem.tabs.map((tab, index) => {
                                const Icon = tab.icon;
                                return tab.logout ? (
                                    <div
                                        onClick={() => handleLogout(tab.id)}
                                        style={{
                                            padding: '10px',
                                        }}
                                        key={index}
                                        className={tab.id == currentTab ? cx('item', 'active') : cx('item')}
                                    >
                                        <Icon className={cx('icon')} />
                                        <p className={cx('title')}>{tab.name}</p>
                                    </div>
                                ) : (
                                    <Link
                                        style={{
                                            padding: '10px',
                                        }}
                                        key={index}
                                        onClick={() => handleClickTab(tab.id)}
                                        to={tab?.link}
                                        className={tab.id == currentTab ? cx('item', 'active') : cx('item')}
                                    >
                                        <Icon className={cx('icon')} />
                                        <p className={cx('title')}>{tab.name}</p>
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </ul>
                {/* <p className={cx('name')}>Theme</p>
                    <div className={cx('theme')}>
                        <p className={cx('box')}></p>
                        <p className={cx('box')}></p>
                    </div> */}
            </div>
            {/* </Scrollbar> */}
        </div>
    );
}

export default SideBar;
