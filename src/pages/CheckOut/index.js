import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import 'moment/locale/vi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './CheckOut.module.scss';
import { useForm, useController } from 'react-hook-form';
import { apiProvinces, api, orderImages, appPath, API_ADDRESS, API_ADDRESS } from '../../constants';
import { Link, useNavigate, Redirect, useLocation, useParams } from 'react-router-dom';
import numeral from 'numeral';
import { apiMaps, API_KEY, locationShop } from '../../constants';
import { useStore } from '../../stores/hooks';
import localstorage from '../../localstorage';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Modal, Button, Input, message } from 'antd';
import Page404 from '../Page404';
import SendNotification from '../../service/SendNotification';
import { getAuthInstance } from '../../utils/axiosConfig';
import localstorge from '../../stores/localstorge';
// import { useData, useAdmin } from '../../../';

import { useData, useAdmin } from '../../stores/DataContext';
import axios from 'axios';
// import { useData } from '../../hooks/useData';
const cx = classNames.bind(styles);
function CheckOut() {
    const authInstance = getAuthInstance();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [auto, setAuto] = useState(false);
    const [isReload, setIsReload] = useState(false);
    //  const { orderId } = useParams();
    const [listCheckouts, setListCheckouts] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [listProvinces, setListProvinces] = useState([]);
    const [listDistrics, setListDistrics] = useState([]);
    const [listWards, setListWards] = useState([]);
    const [addressOrder, setAddressOrder] = useState('');
    const [locationAddress, setLocationAddress] = useState([]);
    const [distance, setDistance] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);
    const [deliveryTime, setDeliveryTime] = useState('');
    const [isSubmit, setIsSubmit] = useState(false);
    const [order, setOrder] = useState();
    const [state, dispatch] = useStore();
    const [productNotQuanlity, setProductNotQuanlity] = useState([]);
    const [productFlash, setProductFlash] = useState([]);
    const [showProgress, setShowProgress] = useState(false);
    // const location = useLocation();
    const [isAllowOpen, setIsAllowOpen] = useState(true);
    const namecart = `myCart_${state.user._id}`;
    // const [city, setCity] = useState('');
    // const [districs, setDistrics] = useState('');
    // const [wards, setWards] = useState('');
    // const [address, setAddress] = useState('');
    const statusVNPayCheckout = `statusVNPayCheckout_${state.user._id}`;
    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState(
        localStorage.getItem(namecart) ? JSON.parse(localStorage.getItem(namecart)).items : [],
    );

    const { data, setData } = useData();
    // const [code, setCode] = useState('');
    // const info = (coupon) => {
    //     message.info({
    //         content: coupon,
    //         duration: 1.5,
    //     });
    // };
    const [isUpdateSold, setIsUpdateSold] = useState(false);
    //const product = localStorage.getItem(namecart) ? JSON.parse(localStorage.getItem(namecart)).items : [];
    //const [mycheckout, setmycheckout] = useState([]);
    const mycheckout = product.filter((phantu) => phantu.isGetcheckout == 1);
    const dataCheckout = localStorage.getItem(statusVNPayCheckout)
        ? JSON.parse(localStorage.getItem(statusVNPayCheckout))
        : {};
    const price = listCheckouts.reduce((total, curr) => total + curr.quantity * curr.product.price, 0);
    const quantity = listCheckouts.reduce((total, curr) => total + curr.quantity, 0);

    // lấy tất cả chữ số có trong token trên localstored
    const token = () => {
        let token = localStorage.getItem('token') ? localStorage.getItem('token').match(/\d+/g) : null;
        // lấy 5 chữ số cuối cùng
        token = token ? token.slice(-5).join('') : null;
        // chuyển sang số
        token = token ? parseInt(token) : null;
        return token;
    };
    //console.log('token', token());
    useEffect(() => {
        setProduct(localStorage.getItem(namecart) ? JSON.parse(localStorage.getItem(namecart)).items : []);
    }, [isLoading]);

    console.log('mychecko2121ut', listCheckouts);
    if (mycheckout.length == 0) {
        navigate('/cart');
    }

    //console.log('mycheckou12t', orderId);

    const addUserFlash = async () => {
        const listFlash = localStorage.getItem('listFlash')
            ? JSON.parse(localStorage.getItem('listFlash'))
            : productFlash;

        if (listFlash) {
            const flashArray = listFlash;

            for (const item of flashArray) {
                try {
                    const response = await fetch(`${api}/flashusers/add`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(item),
                    });

                    console.log('sddasd21212as', response);
                } catch (error) {
                    console.log('ádassdasd', error);
                }
            }
        }
    };

    useEffect(() => {
        if (order) {
            localstorage.set('curent_checkoutid', order._id);
            console.log('da den day roi ne');
            navigate(`/order-success/${order._id}`);
        }
    }, [order]);

    // await addUserFlash();

    // const updateSold = async (id, quantity) => {
    //     const carts = localStorage.getItem(namecart) ? JSON.parse(localStorage.getItem(namecart)) : [];
    //     const newCarts = {
    //         id: state.user._id,
    //         items: carts.items.filter((cart) => cart.id !== id),
    //     };
    //     localstorage.set(namecart, newCarts);
    //     await authInstance
    //         .post(`/products/update-sold/${id}`, {
    //             sold: quantity,
    //         })
    //         .then((result) => {
    //             console.log('update thanh cong', id, quantity);
    //             console.log('result1212', result);
    //         })
    //         .catch((err) => {
    //             console.error('err21', err);
    //         });
    // };

    // lấy danh sách sản phẩm flash sale trong don hang
    useEffect(() => {
        mycheckout.map((item) => {
            // check product flash sale
            //  if (isAllowOpen) {
            // cho phep lay danh sach san pham flash sale
            fetch(`${api}/flashsales?productId=${item.id}&filter=expired`)
                .then((response) => response.json())
                .then((products) => {
                    if (products.data.length == 1) {
                        console.log('djasdjhaks', products.data);

                        setProductFlash((prev) => {
                            return [
                                ...prev,
                                {
                                    userid: state.user._id,
                                    flashid: products.data[0]._id,
                                    mount: item.count,
                                },
                            ];
                        });
                    } else {
                        console.log('Xuat hien 2 cai');
                    }
                })
                .catch((err) => console.log(err));

            fetch(`${api}/products/id/${item.id}`)
                .then((response) => response.json())
                .then((products) => {
                    setListCheckouts((prev1) => {
                        return [
                            ...prev1,
                            {
                                product: products.data,
                                quantity: item.count,
                            },
                        ];
                    });
                })
                .catch((err) => console.log(err));
        });

        // });
    }, []);

    // kiểm tra sản phẩm flash còn đủ sl không
    useEffect(() => {
        if (productFlash.length > 0) {
            //let check = false;
            var flashs = [];
            productFlash.map((item) => {
                console.log('product121sh', item);
                fetch(`${api}/flashsales/${item.flashid}?mount=${item.mount}`)
                    .then((response) => response.json())
                    .then((response) => {
                        if (response.message == 'Not enough quantity') {
                            console.log('abasdhgc', response.data);
                            setProductNotQuanlity((prev1) => {
                                // kiểm tra sản phẩm có trong mảng chưa
                                const index = prev1.findIndex(
                                    (item1) => item1.product._id == response.data.product._id,
                                );
                                if (index == -1) {
                                    return [...prev1, response.data];
                                }
                                return prev1;
                            });
                            isAllowOpen && setOpen(true);
                        }
                    })
                    .catch((err) => console.log(err));
            });
        }
    }, [productFlash]);

    useEffect(() => {
        if (isUpdateSold) {
            // listCheckouts.map((item) => {
            //     console.log('item1212', item);
            authInstance
                .put(`/products/update-sold`, {
                    list: listCheckouts.map((item) => ({
                        id: item.product._id,
                        sold: item.quantity,
                    })),
                })
                .then((result) => {
                    //  console.log('update thanh cong', item.product._id, item.quantity);
                    console.log('result1212', result.data.data);
                })
                .catch((err) => {
                    console.error('err21', err);
                });
            // });
        }
    }, [isUpdateSold]);

    const placeOrder = async (data1, type) => {
        try {
            const listFlash = localStorage.getItem('listFlash')
                ? JSON.parse(localStorage.getItem('listFlash'))
                : productFlash;
            const listNewCheckout = localStorage.getItem('listCkeckOut')
                ? JSON.parse(localStorage.getItem('listCkeckOut'))
                : listCheckouts;

            const orderResult = await authInstance.post(`/orders/insert`, {
                ...data1,
                flashsales: listFlash,
                items: listNewCheckout,
            });

            if (orderResult.data.status === 'OK') {
                const order = orderResult.data.data;
                let item_order_checkout = [];

                if (type === 'vnp') {
                    item_order_checkout = localStorage.getItem('item_order_checkout')
                        ? JSON.parse(localStorage.getItem('item_order_checkout'))
                        : [];
                } else if (type === 'cash') {
                    item_order_checkout = listCheckouts;
                }

                const orderItems = item_order_checkout.map((item) => ({
                    quantity: item.quantity,
                    price: item.product.price * item.quantity,
                    order: order._id,
                    product: item.product._id,
                }));

                if (item_order_checkout.length) {
                    //  console.log('orderItems2121242', orderItems);
                    // Tạo một mảng các promise từ việc gọi authInstance.post
                    // thêm vào bảng orderitems
                    const postPromises = orderItems.map(async (orderItem) => {
                        try {
                            const result = await authInstance.post(`/orderitems/insert`, {
                                ...orderItem,
                            });

                            if (result.data.status === 'OK') {
                                // update số lượng sp tren localst sau khi bán
                                const carts = localStorage.getItem(namecart)
                                    ? JSON.parse(localStorage.getItem(namecart))
                                    : [];
                                const newCarts = {
                                    id: state.user._id,
                                    items: carts.items.filter((cart) => cart.id !== orderItem.product),
                                };
                                localstorage.set(namecart, newCarts);
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    });
                    // Thực hiện cập nhật sold trước khi tiếp tục
                    //console.log('đang chờ...');

                    // Chờ cho tất cả các promises (cả post và put) hoàn tất trước khi tiếp tục
                    const wait = await Promise.all(postPromises);
                    // console.log('xong roi');
                    if (wait) {
                        // Cập nhật lại số lượng sản phẩm trong giỏ hàng
                        setIsUpdateSold(true);
                        // Sau khi hoàn thành tất cả, gọi addUserFlash
                        await addUserFlash();
                        // update lại status của mã giảm giá
                        console.log('update thanh cong111', data);
                        if (data?.item) {
                            fetch(`${api}/vouchers/update/${data?.item._id}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    status: false,
                                }),
                            })
                                .then((response) => response.json())
                                .then((result) => {
                                    setData({
                                        ...data,
                                        item: {
                                            ...data?.item,
                                            status: false,
                                        },
                                    });
                                })
                                .catch((err) => console.log(err));
                        }
                        setOrder(order);
                        setShowProgress(false);
                    }
                    //await Promise.all(postPromises2);
                } else {
                    setShowProgress(false);
                    setOrder(order);
                }
                const title = 'Thông báo đơn hàng';
                const description = `${state.user.fullName} vừa đặt đơn hàng mới. Chuẩn bị hàng thôi!`;
                const image = orderImages;
                const url = `${appPath}/admin/orders`;

                // axios
                //     .post(
                //         `${api}/webpush/send`,
                //         {
                //             filter: 'admin',
                //             notification: {
                //                 title,
                //                 description,
                //                 image,
                //                 url,
                //             },
                //         },
                //         {
                //             headers: {
                //                 Authorization: `Bearer ${localstorge.get()}`,
                //             },
                //         },
                //     )
                //     .then((result) => {
                //         if (result.data.status === 'OK') {
                //             state.socket.emit('send-notification', {
                //                 type: 'admin',
                //                 userId: null,
                //                 notification: {
                //                     title,
                //                     description,
                //                     image,
                //                     url,
                //                     user: null,
                //                 },
                //             });
                //         }
                //     })
                //     .catch((err) => {
                //         console.error(err);
                //     });

                // Các dòng mã khác ở đây
            } else if (orderResult.data.status === 'Not enough quantity in flash sale') {
                // Các dòng mã khác ở đây
                // console.log('result.data.data1213', result.data.data);
                setShowProgress(false);
                localStorage.setItem('dataNotQuanlity', JSON.stringify(orderResult.data.data));
                navigate(`/order-success/err-E14`);
            } else if (orderResult.data.status === 'Not enough quantity') {
                // Các dòng mã khác ở đây
                // không đủ sl trong kho
                setShowProgress(false);
                localStorage.setItem('dataNotQuanlity', JSON.stringify(orderResult.data.data));
                navigate(`/order-success/err-E08`);
            } else {
                // Các dòng mã khác ở đây
                setShowProgress(false);
                navigate(`/order-success/err-E99`);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const addCheckout = async (data, type) => {
        console.log('data21423', data, listCheckouts);
        setShowProgress(true);

        placeOrder(data, type);
    };

    // Chuyển hướng về lại trang checkout sau khi thanh toán bên VNpay
    useEffect(() => {
        // Lấy chuỗi truy vấn (query string) sau dấu "?"
        const queryString = window.location.search;
        // Phân tích chuỗi truy vấn để lấy các tham số
        const urlParams = new URLSearchParams(queryString);
        // Lấy giá trị của tham số "name"
        const signed = urlParams.get('signed');
        const status = urlParams.get('status');
        // kiểm tra trùng khớp thì pass
        if (JSON.stringify(dataCheckout) !== '{}' && parseInt(dataCheckout.signed) - token() == signed) {
            setIsAllowOpen(false);
            delete dataCheckout.signed;
            localStorage.removeItem('is_order_success_page');
            switch (status) {
                case '00':
                    addCheckout(dataCheckout, 'vnp');
                    break;
                case '24':
                    navigate(`/order-success/err-E24`);
                    break;
                default:
            }
        }
    }, []);

    async function getCurrentLocationDetails(latitude, longitude) {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            );

            if (response.status === 200) {
                const data = response.data;

                console.log('data142', data);

                // Trích xuất thông tin về tỉnh, huyện, xã từ dữ liệu trả về
                const address = data.display_name.split(',');
                console.log('Thông tin chi tiết về vị trí hiện tại:');
                console.log('Xã/Phường:', address);
                // setAddress(address[0]);
                // setWards(address[1]);
                // setDistrics(address[2]);
                // setCity(address[3]);
                cityController.field.onChange(address[3]);
                districsController.field.onChange(address[2]);
                wardsController.field.onChange(address[1]);
                addressController.field.onChange(address[0]);
            } else {
                console.error('Failed to fetch data from the API');
            }
            setShowProgress(false);
        } catch (error) {
            console.error('Error:', error.message);
            setShowProgress(false);
        }
    }
    // Get list product to checkout

    const fetchProvince = async () => {

        const response = await axios.get("https://vapi.vnappmob.com/api/province/")

        if (response.status === 200) {
            setListProvinces(response.data.results)
        }
    }

    const fetchDistrict = async (province_id) => {

        const response = await axios.get(`https://vapi.vnappmob.com/api/province/district/${province_id}`)

        if (response.status === 200) {
            setListDistrics(response.data.results)
        }
    }

    const fetchWards = async (ward_id) => {

        const response = await axios.get(`https://vapi.vnappmob.com/api/province/ward/${ward_id}`)

        if (response.status === 200) {
            setListWards(response.data.results)
        }
    }

    useEffect(() => {
        if (auto) {
            setShowProgress(true);
            if ('geolocation' in navigator) {
                // Lấy vị trí hiện tại của người dùng
                navigator.geolocation.getCurrentPosition(function (position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    // console.log('Vị trí hiện tại của bạn:');
                    // console.log('Latitude:', latitude);
                    // console.log('Longitude:', longitude);
                    getCurrentLocationDetails(latitude, longitude);
                });
            } else {
                console.log('Trình duyệt không hỗ trợ Geolocation.');
            }
        }
    }, [auto, isReload]);

    useEffect(() => {
        fetch(`${API_ADDRESS}/api/province`)
            .then((response) => response.json())
            .then((response) => {
                // setListProvinces(result);
                console.log("result123", response)
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, []);

    useEffect(() => {
        document.title = 'Thanh toán';
    }, []);

    const {
        setValue,
        control,
        handleSubmit,
        formState: { errors },
        watch,
        clearErrors,
    } = useForm({
        mode: 'onBlur',
    });

    useEffect(() => {
        if (state.user?._id) {
            setValue('user', state.user?._id);
        } else {
            setValue('user', '');
        }
    }, []);

    const submit = (data) => {
        console.log('data12121', data);
        if (data) {
            if (data.payment_method == 'Thanh toán bằng VNPay') {
                // gan len local ds Checkout
                localStorage.setItem('listCkeckOut', JSON.stringify(listCheckouts));
                // luu vao trong local
                localStorage.setItem('listFlash', JSON.stringify(productFlash));
                localstorage.set('item_order_checkout', listCheckouts);
                authInstance
                    .post(`/orders/create_payment_url?amount=${data.price}`)
                    .then((result) => {
                        console.log('sdda33sdas', result.data.data);
                        data.signed = parseInt(result.data.data.signed) + token();

                        localstorage.set(statusVNPayCheckout, data);
                        window.location.href = result.data.data.data;
                    })
                    .catch((err) => {
                        console.log('ádassdasd', err);
                    });
                // fetch(`${api}/orders/create_payment_url?amount=${data.price}`, {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                // })
                //     .then((response) => response.json())
                //     .then((result) => {
                //         console.log('result1212', result);
                //         data.signed = result.signed;
                //         localstorage.set(statusVNPayCheckout, data);
                //         //window.location.href = result.data;
                //     });
            } else {
                localStorage.removeItem('is_order_success_page');
                addCheckout(data, 'cash');
            }
        }
    };

    const inputRef = useRef({});
    const setInputRef = (name, ref) => {
        inputRef.current[name] = ref;
    };

    const nameController = useController({
        name: 'name',
        control,
        rules: {
            required: 'Thông tin này không được để trống',
        },
        defaultValue: '',
    });

    const emailController = useController({
        name: 'email',
        control,
        rules: {
            required: 'Thông tin này không được để trống',
            pattern: {
                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Email không đúng định dạng. Vui lòng nhập lại',
            },
        },
    });

    const phoneController = useController({
        name: 'phone',
        control,
        rules: {
            required: 'Thông tin này không được để trống',
            minLength: {
                value: 10,
                message: 'Vui lòng nhập đúng định dạng số điện thoại',
            },
        },
    });

    const addressController = useController({
        name: 'address',
        control,
        rules: {
            required: 'Thông tin này không được để trống',
        },
    });

    const countryController = useController({
        name: 'country',
        control: control,
        rules: {
            required: 'Vui lòng chọn quốc gia',
        },
        defaultValue: 'Việt Nam',
    });

    const cityController = useController({
        name: 'city',
        control,
        rules: {
            required: 'Vui lòng chọn tỉnh/thành phố',
        },
        defaultValue: '',
    });

    const districsController = useController({
        name: 'districs',
        control,
        rules: {
            required: 'Vui lòng chọn quận/huyện',
        },
        defaultValue: '',
    });

    const wardsController = useController({
        name: 'wards',
        control,
        rules: {
            required: 'Vui lòng chọn xã/phường',
        },
        defaultValue: '',
    });

    const paymentMethodController = useController({
        name: 'payment_method',
        control,
        rules: {
            required: 'Vui lòng chọn phương thức thanh toán',
        },
    });

    const shippingMethodController = useController({
        name: 'shipping_method',
        control,
        rules: {
            required: 'Vui lòng chọn phương thức vận chuyển',
        },
    });

    const messageMethodController = useController({
        name: 'message',
        control,
        defaultValue: '',
    });

    const handleClearError = (name) => {
        clearErrors(name);
        inputRef.current[name].focus();
    };

    const handleCheckNote = () => {
        if (!isChecked) {
            setValue('message', '');
        }
        setIsChecked(!isChecked);
    };

    useEffect(() => {
        let province_id = 0
        listProvinces.forEach(p => {
            if (p.province_name == watch('city')) {
                province_id = p.province_id
                return
            }
        })

        if (province_id !== 0) {
            fetchDistrict(province_id)
        }
    }, [watch('city')]);

    useEffect(() => {
        let district_id = 0
        listDistrics.forEach(d => {
            if (d.district_name == watch('districs')) {
                district_id = d.district_id
                return
            }
        })

        if (district_id !== 0) {
            fetchWards(district_id)
        }
    }, [watch('districs')]);

    useEffect(() => {
        const address = `${watch('address')}, ${watch('wards')}, ${watch('districs')}, ${watch('city')}, ${watch(
            'country',
        )}`;
        setAddressOrder(address);
    }, [watch('address'), watch('wards'), watch('districs'), watch('city'), watch('country')]);

    useEffect(() => {
        fetch(`${apiMaps}geocoding/v5/mapbox.places/${addressOrder}.json?access_token=${API_KEY}`)
            .then((response) => response.json())
            .then((result) => {
                if (result.features.length) {
                    setLocationAddress(result['features'][0]['center']);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [addressOrder]);

    useEffect(() => {
        fetch(
            `${apiMaps}directions/v5/mapbox/driving/${locationShop[0]},${locationShop[1]};${locationAddress[0]},${locationAddress[1]}.json?access_token=${API_KEY}`,
        )
            .then((response) => response.json())
            .then((result) => {
                if (!result.message) {
                    setDistance(result['routes'][0]['distance'] / 1000);
                }
            });
    }, [locationAddress]);

    useEffect(() => {
        var timeShipping = 0;
        if (distance <= 5.5) {
            setShippingCost(15000);
            timeShipping = 0.5;
        } else if (distance > 5.5 && distance <= 10.5) {
            setShippingCost(20000);
            timeShipping = 1;
        } else if (distance > 10.5 && distance <= 20.5) {
            setShippingCost(25000);
            timeShipping = 1.5;
        } else {
            setShippingCost(30000);
            timeShipping = distance / 120;
        }
        moment.locale('vi');
        const deliverytime = moment().add(timeShipping, 'days').calendar();
        setDeliveryTime(deliverytime);
    }, [distance]);

    useEffect(() => {
        setValue(
            'quantity',
            listCheckouts.reduce((total, curr) => total + curr.quantity, 0),
        );
        setValue(
            'price',
            listCheckouts.reduce((total, curr) => total + curr.quantity * curr.product.price, 0) *
            (data?.item ? (100 - data?.item.discount) / 100 : 1) +
            shippingCost,
        );
        setValue('shippingCost', shippingCost);
    }, [isSubmit]);

    // UPDATE Lai danh sach don hang khi nhan vao nut tuy chinh
    const updateListCheckouts = (deleteData) => {
        const newListCheckouts = [];
        const newProductFlash = [];
        productFlash.map((item) => {
            const index = deleteData.findIndex((item1) => item1._id == item.flashid);
            if (index == -1) {
                newProductFlash.push(item);
            } else {
                newProductFlash.push({
                    ...item,
                    mount: deleteData[index].num_sale - deleteData[index].sold_sale,
                });
            }
        });

        // update lai danh sach san pham flash sale vi danh sach don hang da thay doi
        setProductFlash(newProductFlash);

        deleteData.map((item) => {
            // sales
            item.num_sale - item.sold_sale > 0 &&
                newListCheckouts.push({
                    product: {
                        ...item.product,
                        title: item.product.title + ' (FlashSale)',
                    },
                    quantity: item.num_sale - item.sold_sale,
                });
            // giá gốc
            newListCheckouts.push({
                product: {
                    ...item.product,
                    price: item.product.containprice,
                },
                quantity:
                    mycheckout.filter((phantu) => phantu.id == item.product._id)[0]?.count -
                    item.num_sale +
                    item.sold_sale,
            });
        });

        listCheckouts.map((item) => {
            const index = deleteData.findIndex((item1) => item1.product._id == item.product._id);
            if (index == -1) {
                newListCheckouts.push({
                    product: item.product,
                    quantity: item.quantity,
                });
            }
        });

        // lấy những sản phẩm không có trong mảng deleteData
        // mycheckout.map((item) => {
        //     if (!deleteData.includes(item)) {
        //         newListCheckouts.push({
        //             product: item.product,
        //             quantity: item.count,
        //         });
        //     }
        // });
        setListCheckouts(newListCheckouts);

        // console.log('newListChec2kouts', newListCheckouts);
    };
    // Update trạng thái chọn mua trong giỏ hàng lên local
    const updateLocalCart = (deleteData, option) => {
        console.log('deleteData', deleteData);
        var myCart = JSON.parse(localStorage.getItem(namecart));
        // product.map((item, index) => {
        //     if (newSelectedRowKeys.includes(item.id)) {
        //         myCart.items[index].isGetcheckout = 1;
        //     } else {
        //         myCart.items[index].isGetcheckout = 0;
        //     }
        // });
        if (option == 'delete') {
            deleteData.map((item) => {
                myCart.items.filter((phantu) => phantu.id == item.product._id)[0].isGetcheckout = 0;
            });
        } else if (option == 'continue') {
            console.log('sdufgjsd', myCart, deleteData);
            deleteData.map((item) => {
                myCart.items.filter((phantu) => phantu.id == item.product._id)[0].count =
                    item.num_sale - item.sold_sale;
            });
        }
        // } else {
        //     deleteData.map((item) => {
        //         myCart.items.filter((phantu) => phantu.id == item.product._id)[0].count =
        //             item.num_sale - item.sold_sale;
        //     });
        // }
        localStorage.setItem(namecart, JSON.stringify(myCart));
    };

    useEffect(() => {
        setValue('deliveryDate', deliveryTime);
    }, [deliveryTime]);

    return (
        <div className={cx('wrapper')}>
            <Backdrop sx={{ color: '#fff', zIndex: 10000 }} open={showProgress}>
                <CircularProgress color="error" />
            </Backdrop>
            <Modal
                // vị trí hiển thị của modal
                style={{
                    top: '15%',
                }}
                title="Cảnh báo đơn hàng vượt mức chương trình FlashSale"
                open={open}
                footer={null}
                maskClosable={false}
                closable={false}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 20,
                    }}
                >
                    <img
                        style={{
                            width: 100,
                            height: 100,
                        }}
                        src="https://img.icons8.com/color/48/000000/warning-shield.png"
                    />
                </div>
                <p>
                    Hệ thống phát hiện có những sản phẩm trong giỏ hàng của bạn đang có số lượng vượt quá mức chương
                    trình FlashSale.
                    <li>Cụ thể là các sản phẩm sau:</li>
                    {productNotQuanlity.map((item, index) => (
                        <li key={index}>
                            <strong>{item.product.title}</strong> <br /> Số lượng:{' '}
                            {mycheckout.filter((phantu) => phantu.id == item.product._id)[0]?.count} - Được phép mua:{' '}
                            {item.num_sale - item.sold_sale}
                        </li>
                    ))}
                    Hệ thống cho bạn các lựa chọn sau:
                    <li>
                        1. Nhấn <strong>[Tiếp tục]</strong> để tiếp tục thanh toán với số lượng sản phẩm còn lại trong
                        chương trình.
                    </li>
                    <li>
                        {' '}
                        3. Nhấn <strong>[Tùy chỉnh]</strong> để tiếp tục thanh toán với số lượng sản phẩm còn lại trong
                        chương trình và thêm số lượng sản phẩm với giá thường.
                    </li>
                    <li>
                        {' '}
                        2. Nhấn <strong>[Loại bỏ]</strong> để loại bỏ sản phẩm vượt quá số lượng trong chương trình.
                    </li>
                </p>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        flexDirection: 'row',
                        marginTop: 20,
                    }}
                >
                    <Button
                        type="primary"
                        style={{
                            marginRight: 10,
                        }}
                        onClick={() => {
                            updateLocalCart(productNotQuanlity, 'continue');
                            // setIsLoading(!isLoading);
                            setOpen(false);
                            // load lại trang
                            window.location.reload();
                        }}
                    >
                        Tiếp tục
                    </Button>
                    <Button
                        style={{
                            marginRight: 10,
                        }}
                        onClick={() => {
                            updateListCheckouts(productNotQuanlity);
                            setOpen(false);
                        }}
                    >
                        Tùy chỉnh
                    </Button>

                    <Button
                        type="dashed"
                        onClick={() => {
                            updateLocalCart(productNotQuanlity, 'delete');
                            // setIsLoading(!isLoading);
                            setOpen(false);
                            // load lại trang
                            window.location.reload();
                        }}
                    >
                        Loại bỏ
                    </Button>
                </div>
            </Modal>
            <form
                onSubmit={handleSubmit(submit)}
                className="shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] mb-[20px] rounded-[12px] overflow-hidden"
            >
                <div className={cx('shipping_address')}>
                    <h3 className={cx('heading')}>Địa chỉ giao hàng</h3>
                    <div className={cx('form_group')}>
                        <div className={cx('form_content')}>
                            <p className={cx('label')}>Họ và tên người nhận</p>
                            <div className={errors.name ? cx('form_input', 'error') : cx('form_input')}>
                                <input
                                    type="text"
                                    {...nameController.field}
                                    onBlur={nameController.field.onBlur}
                                    placeholder="Nhập tên người nhận"
                                    spellCheck={false}
                                    ref={(ref) => setInputRef('name', ref)}
                                />
                                <p
                                    onClick={() => handleClearError('name')}
                                    className={errors.name ? cx('error_btn') : cx('hidden')}
                                >
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </p>
                            </div>
                        </div>
                        <p className={cx('form_error')}>{errors.name?.message}</p>
                    </div>

                    <div className={cx('form_group')}>
                        <div className={cx('form_content')}>
                            <p className={cx('label')}>Email</p>
                            <div className={errors.email ? cx('form_input', 'error') : cx('form_input')}>
                                <input
                                    type="text"
                                    {...emailController.field}
                                    onBlur={emailController.field.onBlur}
                                    placeholder="Nhập email"
                                    spellCheck={false}
                                    ref={(ref) => setInputRef('email', ref)}
                                />
                                <p
                                    onClick={() => handleClearError('email')}
                                    className={errors.email ? cx('error_btn') : cx('hidden')}
                                >
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </p>
                            </div>
                        </div>
                        <p className={cx('form_error')}>{errors.email?.message}</p>
                    </div>

                    <div className={cx('form_group')}>
                        <div className={cx('form_content')}>
                            <p className={cx('label')}>Số điện thoại</p>
                            <div className={errors.phone ? cx('form_input', 'error') : cx('form_input')}>
                                <input
                                    type="text"
                                    {...phoneController.field}
                                    onBlur={phoneController.field.onBlur}
                                    placeholder="Ví dụ: 0979123xxx (10 ký tự số)"
                                    spellCheck={false}
                                    ref={(ref) => setInputRef('phone', ref)}
                                />
                                <p
                                    onClick={() => handleClearError('phone')}
                                    className={errors.phone ? cx('error_btn') : cx('hidden')}
                                >
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </p>
                            </div>
                        </div>
                        <p className={cx('form_error')}>{errors.phone?.message}</p>
                    </div>
                    <div className={cx('form_group')}>
                        <div className={cx('form_content')}>
                            <p className={cx('label')}>Quốc gia</p>
                            <select {...countryController.field} className={cx('select')}>
                                <option value="Việt Nam">Việt Nam</option>
                            </select>
                            <p
                                onClick={() => {
                                    setAuto(true);
                                    setIsReload(!isReload);
                                    console.log(
                                        'click',
                                        addressController.field,
                                        cityController.field,
                                        countryController.field,
                                    );
                                }}
                                className={cx('get_location')}
                            >
                                Vị trí hiện tại
                            </p>
                        </div>
                        <p className={cx('form_error')}>{errors.country?.message}</p>
                    </div>

                    <div className={cx('form_group')}>
                        <div className={cx('form_content')}>
                            <p className={cx('label')}>Tỉnh/Thành Phố</p>
                            <select {...cityController.field} className={cx('select')}>
                                <option value={``} selected disabled hidden>
                                    {!auto ? `Chọn` : cityController.field.value}
                                </option>
                                {listProvinces.map((province) => (
                                    <option key={province.province_id} value={province.province_name}>
                                        {province.province_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className={cx('form_error')}>{errors.city?.message}</p>
                    </div>

                    <div className={cx('form_group')}>
                        <div className={cx('form_content')}>
                            <p className={cx('label')}>Quận/Huyện</p>
                            <select {...districsController.field} disabled={!watch('city')} className={cx('select')}>
                                {!watch('city') ? (
                                    <option value="" selected disabled hidden>
                                        Vui lòng chọn tỉnh/thành phố trước
                                    </option>
                                ) : (
                                    <option value="" selected disabled hidden>
                                        {!auto ? `Chọn` : districsController.field.value}
                                    </option>
                                )}
                                {listDistrics.map((distric) => (
                                    <option key={distric.district_id} value={distric.district_name}>
                                        {distric.district_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className={cx('form_error')}>{errors.districs?.message}</p>
                    </div>

                    <div className={cx('form_group')}>
                        <div className={cx('form_content')}>
                            <p className={cx('label')}>Phường/Xã</p>
                            <select {...wardsController.field} disabled={!watch('districs')} className={cx('select')}>
                                {!watch('districs') ? (
                                    <option value="" selected disabled hidden>
                                        Vui lòng chọn quận/huyện trước
                                    </option>
                                ) : (
                                    <option value="" selected disabled hidden>
                                        {!auto ? `Chọn` : wardsController.field.value}
                                    </option>
                                )}
                                {listWards.map((ward) => (
                                    <option key={ward.district_id} value={ward.ward_name}>
                                        {ward.ward_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className={cx('form_error')}>{errors.wards?.message}</p>
                    </div>

                    <div className={cx('form_group')}>
                        <div className={cx('form_content')}>
                            <p className={cx('label')}>Địa chỉ nhận hàng</p>
                            <div className={errors.address ? cx('form_input', 'error') : cx('form_input')}>
                                <input
                                    type="text"
                                    {...addressController.field}
                                    onBlur={addressController.field.onBlur}
                                    placeholder="Nhập địa chỉ nhận hàng"
                                    spellCheck={false}
                                    ref={(ref) => setInputRef('address', ref)}
                                />
                                <p
                                    onClick={() => handleClearError('address')}
                                    className={errors.address ? cx('error_btn') : cx('hidden')}
                                >
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </p>
                            </div>
                        </div>
                        <p className={cx('form_error')}>{errors.address?.message}</p>
                    </div>
                </div>

                <div className={cx('payment_method')}>
                    <h3 className={cx('heading')}>Phương thức vận chuyển</h3>
                    <div className={cx('payment_content')}>
                        <input
                            {...shippingMethodController.field}
                            type="radio"
                            id="shipping_method"
                            value="Giao hàng tiêu chuẩn"
                        />
                        <label for="shipping_method" className={cx('payment_label')}>
                            Giao hàng tiêu chuẩn: {numeral(shippingCost).format('0,0[.]00 VNĐ')} đ
                        </label>
                    </div>
                    <p className={cx('form_error', 'error_radio')}>{errors.payment_method?.message}</p>
                </div>

                <div className={cx('payment_method')}>
                    <h3 className={cx('heading')}>Phương thức thanh toán</h3>
                    <div className={cx('payment_content')}>
                        <input
                            {...paymentMethodController.field}
                            type="radio"
                            id="payment_method1"
                            value="Thanh toán bằng tiền mặt khi nhận hàng"
                        />
                        <label for="payment_method1" className={cx('payment_label')}>
                            Thanh toán bằng tiền mặt khi nhận hàng
                        </label>
                    </div>
                    <div className={cx('payment_content')}>
                        <input
                            {...paymentMethodController.field}
                            type="radio"
                            id="payment_method2"
                            value="Thanh toán bằng VNPay"
                        />
                        <label for="payment_method2" className={cx('payment_label')}>
                            Thanh toán bằng VNPay
                        </label>
                    </div>
                    <p className={cx('form_error', 'error_radio')}>{errors.payment_method?.message}</p>
                </div>

                <div className={cx('payment_method')}>
                    <h3 className={cx('heading')}>Thông tin khác</h3>
                    <div className={cx('payment_content')}>
                        <input type="checkbox" id="note" checked={isChecked} onChange={handleCheckNote} />
                        <label for="note" className={cx('note_label')}>
                            Ghi chú
                        </label>
                        <div
                            className={
                                errors.message
                                    ? cx('form_input', 'input_note', 'error')
                                    : cx('form_input', 'input_note')
                            }
                        >
                            <input
                                {...messageMethodController.field}
                                onBlur={messageMethodController.field.onBlur}
                                type="text"
                                placeholder="Nhập ghi chú"
                                spellCheck={false}
                                ref={(ref) => setInputRef('message', ref)}
                            />
                            <p
                                onClick={() => handleClearError('message')}
                                className={errors.message ? cx('error_btn', 'btn_message') : cx('hidden')}
                            >
                                <FontAwesomeIcon icon={faCircleXmark} />
                            </p>
                        </div>
                        <p className={cx('form_error', 'error_radio')}>{errors.message?.message}</p>
                    </div>
                </div>
                <div className={cx('summary')}>
                    <div className={cx('top', 'top_total')}>
                        <div className={cx('total_price_order')}>
                            <p className={cx('top_label', 'label_top_total')}>Tổng số tiền</p>
                            <p className={cx('top_price', 'price_top_total')}>
                                {watch('shipping_method')
                                    ? numeral(
                                        Math.floor(price * (data?.item ? (100 - data?.item.discount) / 100 : 1)) +
                                        shippingCost,
                                    ).format('0,0[.]00 VNĐ')
                                    : numeral(
                                        Math.floor(price * (data?.item ? (100 - data?.item.discount) / 100 : 1)),
                                    ).format('0,0[.]00 VNĐ')}{' '}
                                đ
                            </p>
                        </div>
                    </div>
                    <div className={cx('bottom')}>
                        <Link to="/cart" className={cx('back_to_cart', 'hide_on_tablet_mobile')}>
                            <p className={cx('back_icon')}>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </p>
                            <p>Quay về giỏ hàng</p>
                        </Link>
                        <input
                            type="submit"
                            value="Xác nhận thanh toán"
                            className={cx('btn_checkout')}
                            style={{
                                backgroundColor: price ? '#c92127' : 'GrayText',
                            }}
                            disabled={price == 0}
                            onClick={() => {
                                setIsSubmit(!isSubmit);
                            }}
                        />
                    </div>
                </div>
            </form>

            <div
                className={cx(
                    'payment_method',
                    'shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] mb-[20px] rounded-[12px] overflow-hidden',
                )}
            >
                <h3 className={cx('heading')}>Kiểm tra lại đơn hàng</h3>
                {listCheckouts.map((item, index) => (
                    <li key={index} className={cx('product_item')}>
                        <img src={item.product.images} />
                        <div className={cx('product_content')}>
                            <a href="#" className={cx('product_info')}>
                                <p className={cx('name')}>{item.product.title}</p>
                            </a>
                            <div className={cx('product_price')}>
                                <p className={cx('price')}>{numeral(item.product.price).format('0,0[.]00 VNĐ')} đ</p>
                                <p
                                    className={
                                        item.product.price === item.product.old_price ? cx('hidden') : cx('old_price')
                                    }
                                >
                                    {numeral(item.product.old_price).format('0,0[.]00 VNĐ')} đ
                                </p>
                            </div>
                            <p className={cx('quantity', 'hide_on_mobile')}>{item.quantity}</p>
                            <p className={cx('quantity', 'hide_on_tablet', 'hide_on_pc')}>Số lượng: {item.quantity}</p>
                            <p className={cx('total_price_item')}>
                                {numeral(item.quantity * item.product.price).format('0,0[.]00 VNĐ')} đ
                            </p>
                        </div>
                    </li>
                ))}
                <div className={cx('top')}>
                    <div className={cx('price_order')}>
                        <p className={cx('top_label')}>Thành tiền</p>
                        <p className={cx('top_price')}>{numeral(price).format('0,0[.]00 VNĐ')} đ</p>
                    </div>
                    <div className={cx('shipping_cost')}>
                        <p className={cx('top_label')}>Giảm giá</p>

                        <p className={cx('top_price')}>
                            {data?.item ? numeral((price * data?.item.discount) / 100).format('0,0[.]00 VNĐ') : 0} đ
                        </p>
                    </div>
                    <div className={cx('shipping_cost')}>
                        <p className={cx('top_label')}>
                            Phí vận chuyển {watch('shipping_method') ? `(${watch('shipping_method')})` : ''}
                        </p>

                        <p className={cx('top_price')}>
                            {watch('shipping_method') ? numeral(shippingCost).format('0,0[.]00 VNĐ') : 0} đ
                        </p>
                    </div>

                    <div className={cx('shipping_cost')}>
                        <p className={cx('top_label')}>Thời gian dự kiến nhận hàng</p>
                        <p className={cx('top_price', 'hide_on_mobile')}>{deliveryTime}</p>
                    </div>
                    <p className={cx('top_price', 'hide_on_pc', 'hide_on_tablet', 'time')}>{deliveryTime}</p>
                </div>
            </div>
        </div>
    );
}

export default CheckOut;
