import { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind"
import styles from './SideBar.module.scss'
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ViewStreamOutlinedIcon from '@mui/icons-material/ViewStreamOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import StackedLineChartOutlinedIcon from '@mui/icons-material/StackedLineChartOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Scrollbar } from 'react-scrollbars-custom'

const cx = classNames.bind(styles)
const tabList = [
    {
        type: 'main',
        tabs: [
            {
                id: 0,
                icon: DashboardIcon,
                name: 'Dashboard',
                link: '/admin'
            }
        ]
    },
    {
        type: 'lists',
        tabs: [
            {
                id: 1,
                icon: PersonOutlineOutlinedIcon,
                name: 'Người dùng',
                link: '/admin/user'

            },
            {
                id: 2,
                icon: Inventory2OutlinedIcon,
                name: 'Sản phẩm'
            },
            {
                id: 3,
                icon: ViewStreamOutlinedIcon,
                name: 'Đơn hàng'
            },
            {
                id: 4,
                icon: LocalShippingOutlinedIcon,
                name: 'Vận chuyển'
            },
        ]
    },
    {
        type: 'useful',
        tabs: [
            {
                id: 5,
                icon: StackedLineChartOutlinedIcon,
                name: 'Thống kê'
            },
            {
                id: 6,
                icon: NotificationsNoneOutlinedIcon,
                name: 'Thông báo'
            }
        ]
    },
    {
        type: 'users',
        tabs: [
            {
                id: 7,
                icon: AccountBoxOutlinedIcon,
                name: 'Thông tin tài khoản'
            },
            {
                id: 8,
                icon: LogoutOutlinedIcon,
                name: 'Đăng xuất'
            }
        ]
    },
]
function SideBar() {

    const [currentTab, setCurrentTab] = useState(0)

    const handleClickTab = (id) => {
        setCurrentTab(id)
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('top')}>
                <h2>Fahasha Admin</h2>
            </div>
            <Scrollbar
                removeTrackYWhenNotUsed
                style={{ width: 250, height: 600 }}
            >
                <div className={cx('bottom')}>
                    <ul className={cx('items')}>
                        {
                            tabList.map((tabItem, typeindex) => (
                                <>
                                    <p className={cx('name')}>{tabItem.type}</p>
                                    {
                                        tabItem.tabs.map((tab, index) => {
                                            const Icon = tab.icon
                                            return (
                                                <Link
                                                    onClick={() => handleClickTab(tab.id)}
                                                    to={tab?.link}
                                                    className={tab.id == currentTab ? cx('item', 'active') : cx('item')}>
                                                    <Icon className={cx('icon')} />
                                                    <p className={cx('title')}>
                                                        {tab.name}
                                                    </p>
                                                </Link>
                                            )
                                        })
                                    }
                                </>
                            ))
                        }
                    </ul>
                    <p className={cx('name')}>Theme</p>
                    <div className={cx('theme')}>
                        <p className={cx('box')}></p>
                        <p className={cx('box')}></p>
                    </div>
                </div>
            </Scrollbar>
        </div>
    )
}

export default SideBar