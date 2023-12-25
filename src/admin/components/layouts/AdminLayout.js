import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import styles from './AdminLayout.module.scss';
import SideBar from './SideBar/Sidebar';
import NavBar from './NavBar/NavBar';
import { api, isDeploy } from '../../../constants';
import { Progress } from 'antd';
import { Scrollbar } from 'react-scrollbars-custom';
import lottie from 'lottie-web';
import { useData } from '../../../stores/DataContext';
import SideBarLaptop from './SideBarLaptop';
import { getAuthInstance } from '../../../utils/axiosConfig';
const cx = classNames.bind(styles);
const maxProducts = 1189;
const perPage = 50;
function AdminLayout({ children }) {
    const authInstance = getAuthInstance();
    const container = useRef(null);
    const { data, setData } = useData();
    // const [isComplete, setIsComplete] = useState(false);

    // async function fetchData() {
    //     let i = 2;
    //     let shouldContinue = true;
    //     let newData = [];
    //     //  console.log('dang chay ne...', shouldContinue, data?.products?.length, Math.ceil(maxProducts / perPage));
    //     while (i < Math.floor(maxProducts / perPage) - 15 && shouldContinue) {
    //         try {
    //             console.log('chay ne...', i, data);
    //             const response = await fetch(`${api}/products?perPage=${perPage}&page=${i}`);
    //             const flashsales = await response.json();
    //             newData = [...newData, ...flashsales.data.products];

    //             // setData({
    //             //     ...data,
    //             //     products: newData,
    //             // });

    //             i++;
    //         } catch (err) {
    //             console.log('asghd', err);
    //             shouldContinue = false; // Dừng vòng lặp nếu có lỗi
    //         }
    //     }
    //     // setData({
    //     //     ...data,
    //     //     products: newData,
    //     // });
    //     return newData;
    // }

    const [isLoaded, setIsLoaded] = useState(
        Object.keys(data).length !== 0
            ? {
                evaluates: true,
                orders: true,
                users: true,
                products: true,
                tem_products: true,
                flashsales: true,
                categories: true,
            }
            : {
                evaluates: false,
                orders: false,
                users: false,
                products: false,
                tem_products: false,
                flashsales: false,
                categories: false,
            },
    );
    const [percent, setPercent] = useState(0);
    const num = '';
    const [data2, setData2] = useState(
        Object.keys(data).length !== 0
            ? data
            : {
                evaluates: [],
                orders: [],
                users: [],
                products: [],
                tem_products: [],
                flashsales: [],
                categories: [],
            },
    );

    if (isDeploy) {
        var chat_content = document.querySelector(".fb_dialog_content")
        chat_content.style.display = 'none';
    }

}, [])

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
        // setIsLoaded([false, false]);
        setIsLoaded((prev) => ({ ...prev, products: true }));
        fetch(`${api}/products?perPage=${maxProducts}&page=1`)
            .then((response) => {
                return response.json();
            })
            .then((flashsales) => {
                console.log('flashsales121', flashsales);
                setData({ ...data, products: flashsales.data.products });
                //setIsLoaded((prev) => ({ ...prev, products: true }));
            })
            .catch((err) => console.log(err));

        fetch(`${api}/products?perPage=${perPage}&page=1`)
            .then((response) => {
                return response.json();
            })
            .then((flashsales) => {
                console.log('flashsales121', flashsales);
                setData2((prev) => ({ ...prev, tem_products: flashsales.data.products }));
                setIsLoaded((prev) => ({ ...prev, tem_products: true }));
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
            .then((response) => response.json())
            .then((result) => {
                setData2((prev) => ({ ...prev, evaluates: result.data }));
                setIsLoaded((prev) => ({ ...prev, evaluates: true }));
            })
            .catch((err) => {
                console.log(err);
            });
        fetch(`${api}/categories?filter=simple`)
            .then((response) => response.json())
            .then((result) => {
                if (result.status == 'OK') {
                    setData2((prev) => ({ ...prev, categories: result.data }));
                    setIsLoaded((prev) => ({ ...prev, categories: true }));
                }
            })
            .catch((err) => console.log(err.message));

        authInstance
            .post('/orders/filter')
            .then((result) => {
                if (result.data.status === 'OK') {
                    setData2((prev) => ({ ...prev, orders: result.data.data }));
                    setIsLoaded((prev) => ({ ...prev, orders: true }));
                }
            })
            .catch((error) => {
                console.log(error);
            });

        authInstance
            .get(`/users`)
            .then((result) => {
                setData2((prev) => ({ ...prev, users: result.data.data }));
                setIsLoaded((prev) => ({ ...prev, users: true }));
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        setIsLoaded({
            evaluates: true,
            orders: true,
            users: true,
            products: true,
            tem_products: true,
            flashsales: true,
            categories: true,
        });
    }
}, []);

useEffect(() => {
    if (
        isLoaded.evaluates &&
        isLoaded.categories &&
        isLoaded.orders &&
        isLoaded.users &&
        isLoaded.tem_products &&
        isLoaded.flashsales &&
        isLoaded.products &&
        Object.keys(data).length === 0
    ) {
        //localStorage.setItem('temporary_data', JSON.stringify(data));
        setData(data2);
        // setIsComplete(true);
    }
}, [isLoaded]);

//console.log('AA', !(isLoaded.flashsales && isLoaded.products) && !localStorage.getItem('temporary_data'));

return (
    <>
        {!(
            isLoaded.evaluates &&
            isLoaded.categories &&
            isLoaded.orders &&
            isLoaded.users &&
            isLoaded.tem_products &&
            isLoaded.flashsales &&
            isLoaded.products
        ) &&
            Object.keys(data).length === 0 && (
                <div className={cx('wrapper-loading')}>
                    <div className={cx('animation-loading')} ref={container}></div>
                </div>
            )}
        {!(
            !(
                isLoaded.evaluates &&
                isLoaded.categories &&
                isLoaded.orders &&
                isLoaded.users &&
                isLoaded.tem_products &&
                isLoaded.flashsales &&
                isLoaded.products
            ) && Object.keys(data).length === 0
        ) && (
                <div className={cx('wrapper')}>
                    <div
                        className={cx('navbar')}
                        style={{
                            maxHeight: '100vh',
                            position: 'fixed',
                            top: 0,
                            backgroundColor: 'yourNavbarBackgroundColor', // Thay thế bằng màu nền mong muốn
                            zIndex: 1000, // Tăng giá trị nếu cần
                        }}
                    >
                        <SideBar />
                    </div>
                    <div
                        className={cx('navbarlap')}
                        style={{
                            maxHeight: '100vh',
                            position: 'fixed',
                            top: 0,
                            backgroundColor: 'yourNavbarBackgroundColor', // Thay thế bằng màu nền mong muốn
                            zIndex: 1000, // Tăng giá trị nếu cần
                        }}
                    >
                        <SideBarLaptop />
                    </div>
                    <div style={{ width: 250, height: '100vh' }} className={cx('container')}>
                        <NavBar
                            style={{
                                position: 'fixed',
                                top: 0,
                                backgroundColor: 'yourNavbarBackgroundColor', // Thay thế bằng màu nền mong muốn
                                zIndex: 1000, // Tăng giá trị nếu cần
                            }}
                        />
                        {children}
                    </div>
                </div>
            )}
    </>
);
}

export default AdminLayout;
