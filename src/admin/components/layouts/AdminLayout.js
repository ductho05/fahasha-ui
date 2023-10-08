import classNames from "classnames/bind"
import styles from './AdminLayout.module.scss'
import SideBar from "./SideBar/Sidebar"
import NavBar from "./NavBar/NavBar"
import { Scrollbar } from 'react-scrollbars-custom';

const cx = classNames.bind(styles)
function AdminLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('navbar')}>
                <SideBar />
            </div>
            <Scrollbar
                style={{ width: 250, height: 600 }}
                className={cx('container')}
            >
                <NavBar />
                {children}
            </Scrollbar>
        </div>
    )
}

export default AdminLayout
