import classNames from 'classnames/bind';
import { useEffect } from 'react';
import styles from './AdminLayout.module.scss';
import SideBar from './SideBar/Sidebar';
import NavBar from './NavBar/NavBar';
import { api } from '../../../constants';
const cx = classNames.bind(styles);
function AdminLayout({ children }) {
    useEffect(() => {
        if (!localStorage.getItem('temporary_data')) {
            fetch(`${api}/products?page=${1}&perPage=${1100}&filter=sold&sort=asc&num=200`)
                .then((response) => response.json())
                .then((flashsales) => {
                    localStorage.setItem('temporary_data', JSON.stringify(flashsales.data));
                })
                .catch((err) => console.log(err));
        }
    }, []);
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
    );
}

export default AdminLayout;
