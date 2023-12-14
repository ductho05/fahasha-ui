import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import styles from './AdminLayout.module.scss';
import SideBar from './SideBar/Sidebar';
import NavBar from './NavBar/NavBar';
import { api } from '../../../constants';
import { Progress } from 'antd';
import { Scrollbar } from 'react-scrollbars-custom';
import lottie from 'lottie-web';
import { useData } from '../../../stores/DataContext';
import SideBarLaptop from './SideBarLaptop';
import { getAuthInstance } from '../../../utils/axiosConfig';
const cx = classNames.bind(styles);
function AdminLayout({ children }) {

    const authInstance = getAuthInstance()

    const container = useRef(null);
    const { data, setData } = useData();

    const [isLoaded, setIsLoaded] = useState(
        Object.keys(data).length !== 0
            ? {
                evaluates: true,
                orders: true,
                users: true,
                products: true,
                flashsales: true,
                categories: true
            }
            : {
                evaluates: false,
                orders: false,
                users: false,
                products: false,
                flashsales: false,
                categories: false
            },
    );
    const [percent, setPercent] = useState(0);
    const num = 10;
    const [data2, setData2] = useState(
        Object.keys(data).length !== 0
            ? data
            : {
                evaluates: [],
                orders: [],
                users: [],
                products: [],
                flashsales: [],
                categories: []
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

    // window.addEventListener('storage', handleStorageChange);

    // function handleStorageChange(e) {
    //     //console.log('LocalStorage has changed:', e);
    // }

    // useEffect(() => {
    //     setIsLoaded((prev) => ({ ...prev, flashsales: false }));
    //     if (JSON.parse(localStorage.getItem('temporary_data')).flashsales.length == 0) {
    //         fetch(`${api}/flashsales`)
    //             .then((response) => response.json())
    //             .then((result) => {
    //                 setData2((prev) => ({ ...prev, flashsales: result.data }));
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
        if (Object.keys(data).length === 0) {
            setIsLoaded([false, false]);
            fetch(`${api}/products?filter=sold&sort=asc&num=${num}`)
                .then((response) => {
                    return response.json();
                })
                .then((flashsales) => {
                    setData2((prev) => ({ ...prev, products: flashsales.data.products }));
                    setIsLoaded((prev) => ({ ...prev, products: true }));
                })
                .catch((err) => console.log(err));

            fetch(`${api}/flashsales?sort=reverse`)
                .then((response) => response.json())
                .then((result) => {
                    setData2((prev) => ({ ...prev, flashsales: result.data }));
                    setIsLoaded((prev) => ({ ...prev, flashsales: true }));
                })
                .catch((err) => console.log(err));

            fetch(`${api}/evaluates/get`)
                .then(response => response.json())
                .then(result => {

                    setData2((prev) => ({ ...prev, evaluates: result.data }));
                    setIsLoaded((prev) => ({ ...prev, evaluates: true }));
                })
                .catch(err => {

                    console.log(err)
                })
            fetch(`${api}/categories?filter=simple`)
                .then(response => response.json())
                .then(result => {
                    if (result.status == "OK") {
                        setData2((prev) => ({ ...prev, categories: result.data }));
                        setIsLoaded((prev) => ({ ...prev, categories: true }));
                    }
                })
                .catch(err => console.log(err.message))

            authInstance.post("/orders/filter")
                .then(result => {
                    if (result.data.status === "OK") {

                        setData2((prev) => ({ ...prev, orders: result.data.data }));
                        setIsLoaded((prev) => ({ ...prev, orders: true }));
                    }
                })
                .catch(error => {
                    console.log(error)
                })

            authInstance.get(`/users`)
                .then(result => {
                    setData2((prev) => ({ ...prev, users: result.data.data }));
                    setIsLoaded((prev) => ({ ...prev, users: true }));
                })
                .catch(err => {

                    console.log(err)
                })
        } else {
            setIsLoaded({
                evaluates: true,
                orders: true,
                users: true,
                products: true,
                flashsales: true,
                categories: true
            });
        }
    }, []);

    useEffect(() => {
        if (isLoaded.evaluates && isLoaded.categories && isLoaded.orders && isLoaded.users && isLoaded.flashsales && isLoaded.products && Object.keys(data).length === 0) {
            //localStorage.setItem('temporary_data', JSON.stringify(data));
            setData(data2);
        }
    }, [isLoaded]);

    //console.log('AA', !(isLoaded.flashsales && isLoaded.products) && !localStorage.getItem('temporary_data'));

    return (
        <>
            {!(isLoaded.evaluates && isLoaded.categories && isLoaded.orders && isLoaded.users && isLoaded.flashsales && isLoaded.products) && Object.keys(data).length === 0 && (
                <div className={cx('wrapper-loading')}>
                    <div className={cx('animation-loading')} ref={container}></div>
                </div>
            )}
            {!(!(isLoaded.evaluates && isLoaded.categories && isLoaded.orders && isLoaded.users && isLoaded.flashsales && isLoaded.products) && Object.keys(data).length === 0) && (
                <div className={cx('wrapper')}>
                    <div className={cx('navbar')}>
                        <SideBar />
                    </div>
                    <SideBarLaptop />
                    <Scrollbar style={{ width: 250, height: '100vh' }} className={cx('container')}>
                        <NavBar />
                        {children}
                    </Scrollbar>
                </div>
            )}
        </>
    );
}

export default AdminLayout;
