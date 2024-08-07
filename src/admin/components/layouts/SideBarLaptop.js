import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './SideBar/SideBar.module.scss';
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
import ReviewsIcon from '@mui/icons-material/Reviews';
import CategoryIcon from '@mui/icons-material/Category';
import { Tooltip } from 'antd';
import { tabList } from './SideBar/Sidebar';
import { useStore } from '../../../stores/hooks';
import { logout } from '../../../stores/actions';
import { useState, useEffect } from 'react';

// const tabList = [
//     {
//         type: 'main',
//         tabs: [
//             {
//                 id: 0,
//                 icon: DashboardIcon,
//                 name: 'Dashboard',
//                 link: '/admin',
//             },
//         ],
//     },
//     {
//         type: 'lists',
//         tabs: [
//             {
//                 id: 1,
//                 icon: PersonOutlineOutlinedIcon,
//                 name: 'Người dùng',
//                 link: '/admin/user',
//             },
//             {
//                 id: 2,
//                 icon: Inventory2OutlinedIcon,
//                 name: 'Sản phẩm',
//                 link: '/admin/products',
//             },
//             {
//                 id: 3,
//                 icon: ViewStreamOutlinedIcon,
//                 name: 'Đơn hàng',
//                 link: '/admin/orders',
//             },
//             {
//                 id: 4,
//                 icon: CategoryIcon,
//                 name: 'Loại sản phẩm',
//                 link: '/admin/categories'
//             },
//             {
//                 id: 5,
//                 icon: ReviewsIcon,
//                 name: 'Đánh giá',
//                 link: '/admin/reviews',
//             },
//         ],
//     },
//     {
//         type: 'useful',
//         tabs: [
//             {
//                 id: 6,
//                 icon: StackedLineChartOutlinedIcon,
//                 name: 'Thống kê',
//                 link: '/admin/statistics',
//             },
//             {
//                 id: 7,
//                 icon: NotificationsNoneOutlinedIcon,
//                 name: 'Thông báo',
//                 link: '/admin/notifications',
//             },
//             {
//                 id: 8,
//                 icon: LoyaltyIcon,
//                 name: 'Flash Sale',
//                 link: '/admin/flashsale',
//             },
//         ],
//     },
//     {
//         type: 'users',
//         tabs: [
//             {
//                 id: 9,
//                 icon: AccountBoxOutlinedIcon,
//                 name: 'Thông tin tài khoản',
//                 link: '/account/0',
//             },
//             {
//                 id: 10,
//                 icon: LogoutOutlinedIcon,
//                 name: 'Đăng xuất',
//             },
//         ],
//     },
// ];

const cx = classNames.bind(styles);
function SideBarLaptop({ url }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [state, dispatch] = useStore();
    const [currentTab, setCurrentTab] = useState(
        url == '/admin'
            ? 0
            : url.includes(`/admin/user`)
            ? 1
            : url.includes(`/admin/products`)
            ? 2
            : url.includes(`/admin/orders`)
            ? 3
            : url.includes(`/admin/categories`)
            ? 4
            : url.includes(`/admin/reviews`)
            ? 5
            : url == '/admin/wishlists'
            ? 6
            : url == '/admin/vouchers'
            ? 7
            : url == '/admin/statistics'
            ? 8
            : url == '/admin/notifications'
            ? 9
            : url.includes(`/admin/flashsale`)
            ? 10
            : url == '/admin/account'
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
                : url.includes(`/admin/categories`)
                ? 4
                : url.includes(`/admin/reviews`)
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

    const handleClickTab = (id) => {
        setCurrentTab(id);
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    const genericHamburgerLine = `h-1 w-full my-1 rounded-full transition ease transform duration-300`;

    return (
        <div className="p-[10px]">
            <button
                className="flex flex-col h-12 w-[50px] justify-center items-center group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div
                    className={`${genericHamburgerLine} bg-black ${
                        isOpen
                            ? 'rotate-45 translate-y-3 opacity-50 group-hover:opacity-100'
                            : 'opacity-50 group-hover:opacity-100'
                    }`}
                />
                <div
                    className={`${genericHamburgerLine} bg-black ${
                        isOpen ? 'opacity-0' : 'opacity-50 group-hover:opacity-100'
                    }`}
                />
                <div
                    className={`${genericHamburgerLine} bg-black ${
                        isOpen
                            ? '-rotate-45 -translate-y-3 opacity-50 group-hover:opacity-100'
                            : 'opacity-50 group-hover:opacity-100'
                    }`}
                />
            </button>
            <div className={cx('bottom')}>
                <ul className={cx('items')}>
                    {tabList.map((tabItem, typeindex) => (
                        <div key={typeindex}>
                            <p className={cx('name')}>{tabItem.type}</p>
                            {tabItem.tabs.map((tab, index) => {
                                const Icon = tab.icon;
                                return (
                                    <Tooltip title={tab.name} placement="right">
                                        {tab.logout ? (
                                            <div
                                                onClick={() => handleLogout(tab.id)}
                                                style={{
                                                    padding: '10px',
                                                }}
                                                key={index}
                                                className={tab.id == currentTab ? cx('item', 'active') : cx('item')}
                                            >
                                                <Icon className={cx('icon')} />
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
                                            </Link>
                                        )}
                                    </Tooltip>
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
        </div>
    );
}

export default SideBarLaptop;
