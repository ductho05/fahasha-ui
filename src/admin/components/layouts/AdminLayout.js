import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import styles from './AdminLayout.module.scss';
import SideBar from './SideBar/Sidebar';
import NavBar from './NavBar/NavBar';
import { api } from '../../../constants';
import { Progress } from 'antd';
import { Scrollbar } from 'react-scrollbars-custom';
const cx = classNames.bind(styles);
function AdminLayout({ children }) {
    const container = useRef(null);
    const [isLoaded, setIsLoaded] = useState(
        localStorage.getItem('temporary_data')
            ? {
                  products: true,
                  flashsales: true,
              }
            : {
                  products: false,
                  flashsales: false,
              },
    );
    const [percent, setPercent] = useState(0);
    const [data, setData] = useState(
        localStorage.getItem('temporary_data')
            ? JSON.parse(localStorage.getItem('temporary_data'))
            : {
                  products: [],
                  flashsales: [],
              },
    );

    // useEffect(() => {
    //     // Hàm này sẽ được gọi khi component được mount và mỗi khi localStorage thay đổi.
    //     const handleStorageChange = (e) => {
    //         if (e.key === 'temporary_data') {
    //             // Xử lý khi có thay đổi trong localStorage với key là 'yourLocalStorageKey'.
    //             const updatedValue = e.newValue; // Giá trị mới từ localStorage.
    //             console.log('LocalStorage has changed:', updatedValue);
    //         }
    //     };

    //     // Đăng ký sự kiện lắng nghe thay đổi trong localStorage.

    //     // Trả về một hàm xử lý để huỷ bỏ sự kiện khi component bị unmounted.
    //     return () => {
    //         window.removeEventListener('storage', handleStorageChange);
    //     };
    // });

    window.addEventListener('storage', handleStorageChange);

    function handleStorageChange(e) {
        console.log('LocalStorage has changed:', e);
    }

    // useEffect(() => {
    //     setIsLoaded((prev) => ({ ...prev, flashsales: false }));
    //     if (JSON.parse(localStorage.getItem('temporary_data')).flashsales.length == 0) {
    //         fetch(`${api}/flashsales`)
    //             .then((response) => response.json())
    //             .then((result) => {
    //                 setData((prev) => ({ ...prev, flashsales: result.data }));
    //                 setIsLoaded((prev) => ({ ...prev, flashsales: true }));
    //             })
    //             .catch((err) => console.log(err));
    //     }
    // }, [isLoaded.flashsales]);

    useEffect(() => {
        lottie.loadAnimation({
            container: container.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('../../../assets/json/loadAdminPage.json'),
        });
        if (!localStorage.getItem('temporary_data')) {
            setIsLoaded([false, false]);
            fetch(`${api}/products?filter=sold&sort=asc`)
                .then((response) => {
                    return response.json();
                })
                .then((flashsales) => {
                    setData((prev) => ({ ...prev, products: flashsales.data }));
                    setIsLoaded((prev) => ({ ...prev, products: true }));
                })
                .catch((err) => console.log(err));

            fetch(`${api}/flashsales`)
                .then((response) => response.json())
                .then((result) => {
                    setData((prev) => ({ ...prev, flashsales: result.data }));
                    setIsLoaded((prev) => ({ ...prev, flashsales: true }));
                })
                .catch((err) => console.log(err));
        } else {
            setIsLoaded({ products: true, flashsales: true });
        }
    }, []);

    useEffect(() => {
        if (isLoaded.flashsales && isLoaded.products && !localStorage.getItem('temporary_data')) {
            localStorage.setItem('temporary_data', JSON.stringify(data));
        }
    }, [isLoaded]);

    return (
        <>
            {!(isLoaded.flashsales && isLoaded.products) && !localStorage.getItem('temporary_data') && (
                <div className={cx('wrapper-loading')}>
                    <div className={cx('animation-loading')} ref={container}></div>
                </div>
            )}

            <div className={cx('wrapper')}>
                <div className={cx('navbar')}>
                    <SideBar />
                </div>             

                <Scrollbar style={{ width: 250, height: '100vh' }} className={cx('container')}>
                    <NavBar />
                    {children}
                </Scrollbar>
            </div>
        </>
    );
}

export default AdminLayout;
