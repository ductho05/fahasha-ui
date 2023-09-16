import classNames from "classnames/bind"
import styles from './AdminLayout.module.scss'
import SideBar from "./SideBar/Sidebar"
import NavBar from "./NavBar/NavBar"

const cx = classNames.bind(styles)
function AdminLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('navbar')}>
                <SideBar />
            </div>
            <div className={cx('container')}>
                <NavBar />
                {children}
            </div>
        </div>
    )
}

export default AdminLayout
