import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import 'moment/locale/vi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './CheckOut.module.scss';
import { useForm, useController } from 'react-hook-form';
import { apiProvinces, api, orderImages, appPath } from '../../constants';
import { Link, useNavigate, Redirect, useLocation } from 'react-router-dom';
import numeral from 'numeral';
import { apiMaps, API_KEY, locationShop } from '../../constants';
import { useStore } from '../../stores/hooks';
import localstorage from '../../localstorage';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Modal, Button } from 'antd';
import Page404 from '../Page404';
import SendNotification from '../../service/SendNotification';
import { getAuthInstance } from '../../utils/axiosConfig';
import localstorge from '../../stores/localstorge';
import axios from 'axios';

const cx = classNames.bind(styles);
function CheckOut() {
    const authInstance = getAuthInstance();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
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
    const location = useLocation();
    const namecart = `myCart_${state.user._id}`;
    const statusVNPayCheckout = `statusVNPayCheckout_${state.user._id}`;
    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState(
        localStorage.getItem(namecart) ? JSON.parse(localStorage.getItem(namecart)).items : [],
    );
    //const product = localStorage.getItem(namecart) ? JSON.parse(localStorage.getItem(namecart)).items : [];
    //const [mycheckout, setmycheckout] = useState([]);
    const mycheckout = product.filter((phantu) => phantu.isGetcheckout == 1);
    const dataCheckout = localStorage.getItem(statusVNPayCheckout)
        ? JSON.parse(localStorage.getItem(statusVNPayCheckout))
        : {};
    const price = listCheckouts.reduce((total, curr) => total + curr.quantity * curr.product.price, 0);
    const quantity = listCheckouts.reduce((total, curr) => total + curr.quantity, 0);

    useEffect(() => {
        setProduct(localStorage.getItem(namecart) ? JSON.parse(localStorage.getItem(namecart)).items : []);
    }, [isLoading]);

    if (mycheckout.length == 0) {
        navigate('/cart');
    }

    console.log('mycheckou12t', mycheckout);

    const addUserFlash = () => {
        productFlash.map((item) => {
            authInstance
                .post(`/flashusers/add`, {
                    ...item,
                })
                .then((result) => {
                    //console.log('sddasdas', result);
                })
                .catch((err) => {
                    console.log('ádassdasd', err);
                });
        });
    };

    useEffect(() => {
        if (order) {
            addUserFlash();
            localstorage.set('curent_checkoutid', order._id);
            navigate(`/order-success/${order._id}`);
        }
    }, [order]);

    useEffect(() => {
        mycheckout.map((item) => {
            // check product flash sale
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
                    // newCheckout.push({
                    //     product: products.data,
                    //     quantity: item.count,
                    // });
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
    }, []);

    // kiểm tra sản phẩm có trong flash sale không
    useEffect(() => {
        if (productFlash.length > 0) {
            //let check = false;
            var flashs = [];
            productFlash.map((item) => {
                console.log('productFla12121sh', item);
                fetch(`${api}/flashsales/${item.flashid}?mount=${item.mount}`)
                    .then((response) => response.json())
                    .then((response) => {
                        if (response.message == 'Not enough quantity') {
                            console.log('abasdhgc', response.data);
                            setProductNotQuanlity((prev1) => {
                                return [...prev1, response.data];
                            });
                            setOpen(true);
                        }
                    })
                    .catch((err) => console.log(err));
            });
        }
    }, [productFlash]);

    const addCheckout = async (data, type) => {
        setShowProgress(true);
        await authInstance
            .post(`/orders/insert`, {
                ...data,
                flashsales: productFlash,
            })
            .then((result) => {
                if (result.data.status == 'OK') {
                    const order = result.data.data;
                    let item_order_checkout = [];
                    if (type == 'vnp') {
                        item_order_checkout = localStorage.getItem('item_order_checkout')
                            ? JSON.parse(localStorage.getItem('item_order_checkout'))
                            : [];
                    } else if (type == 'cash') {
                        item_order_checkout = listCheckouts;
                    }
                    const orderItems = item_order_checkout.map((item) => {
                        return {
                            quantity: item.quantity,
                            price: item.product.price * item.quantity,
                            order: result.data.data._id,
                            product: item.product._id,
                        };
                    });
                    if (item_order_checkout.length) {
                        orderItems.forEach((orderItem) => {
                            authInstance
                                .post(`/orderitems/insert`, {
                                    ...orderItem,
                                })
                                .then((result) => {
                                    if (result.data.status == 'OK') {
                                        const carts = localStorage.getItem(namecart)
                                            ? JSON.parse(localStorage.getItem(namecart))
                                            : [];
                                        const newCarts = {
                                            id: state.user._id,
                                            items: carts.items.filter((cart) => cart.id !== orderItem.product),
                                        };
                                        localstorage.set(namecart, newCarts);
                                        setShowProgress(false);
                                        setOrder(order);

                                        authInstance
                                            .put(`/products/update-sold/${orderItem.product}`, {
                                                sold: orderItem.quantity,
                                            })
                                            .catch((err) => {
                                                console.error(err);
                                            });
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        });
                    } else {
                        setShowProgress(false);
                        setOrder(order);
                    }
                    const title = 'Thông báo đơn hàng';
                    const description = `${state.user.fullName} vừa đặt đơn hàng mới. Chuẩn bị hàng thôi!`;
                    const image = orderImages;
                    const url = `${appPath}/admin/orders`;

                    axios
                        .post(
                            `${api}/webpush/send`,
                            {
                                filter: 'admin',
                                notification: {
                                    title,
                                    description,
                                    image,
                                    url,
                                },
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${localstorge.get()}`,
                                },
                            },
                        )
                        .then((result) => {
                            if (result.data.status === 'OK') {
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                } else if (result.data.status == 'Not enough quantity') {
                    setShowProgress(false);
                    localStorage.setItem('dataNotQuanlity', JSON.stringify(result.data.data));
                    navigate(`/order-success/err-E08`);
                } else {
                    setShowProgress(false);
                    navigate(`/order-success/err-E99`);
                }
            })
            .catch((err) => {
                console.log(err);
                setShowProgress(false);
            });
    };

    // Chuyển hướng đến trang khác sau khi thanh toán bên VNpay
    useEffect(() => {
        // Lấy chuỗi truy vấn (query string) sau dấu "?"
        const queryString = window.location.search;
        // Phân tích chuỗi truy vấn để lấy các tham số
        const urlParams = new URLSearchParams(queryString);
        // Lấy giá trị của tham số "name"
        const signed = urlParams.get('signed');
        const status = urlParams.get('status');
        if (JSON.stringify(dataCheckout) !== '{}' && dataCheckout.signed === signed) {
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
    // Get list product to checkout

    useEffect(() => {
        fetch(apiProvinces)
            .then((response) => response.json())
            .then((result) => {
                setListProvinces(result);
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
        console.log('data', data);
        if (data) {
            if (data.payment_method == 'Thanh toán bằng VNPay') {
                localstorage.set('item_order_checkout', listCheckouts);

                fetch(`${api}/orders/create_payment_url?amount=${data.price}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then((response) => response.json())
                    .then((result) => {
                        data.signed = result.signed;
                        localstorage.set(statusVNPayCheckout, data);
                        window.location.href = result.data;
                    });
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
        let province = listProvinces.find((province) => province.name == watch('city'));
        if (province) {
            setListDistrics(province.districts);
        } else {
            setListDistrics([]);
        }
    }, [watch('city')]);

    useEffect(() => {
        let distric = listDistrics.find((distric) => distric.name == watch('districs'));
        if (distric) {
            setListWards(distric.wards);
        } else {
            setListWards([]);
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
            listCheckouts.reduce((total, curr) => total + curr.quantity * curr.product.price, 0) + shippingCost,
        );
        setValue('shippingCost', shippingCost);
    }, [isSubmit]);

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
                myCart.items.filter((phantu) => phantu.id == item.product._id)[0].count = item.num_sale - item.sold_sale;
            });
        }
        else {
            deleteData.map((item) => {
                myCart.items.filter((phantu) => phantu.id == item.product._id)[0].count = item.num_sale - item.sold_sale;
            });
        }
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
                            {item.product.title} <br /> Số lượng:{' '}
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
                            updateLocalCart(productNotQuanlity, 'custom');
                            // setIsLoading(!isLoading);
                            setOpen(false);
                            // load lại trang
                            window.location.reload();
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
                        </div>
                        <p className={cx('form_error')}>{errors.country?.message}</p>
                    </div>

                    <div className={cx('form_group')}>
                        <div className={cx('form_content')}>
                            <p className={cx('label')}>Tỉnh/Thành Phố</p>
                            <select {...cityController.field} className={cx('select')}>
                                <option value="" selected disabled hidden>
                                    Chọn
                                </option>
                                {listProvinces.map((province, index) => (
                                    <option key={index} value={province.name}>
                                        {province.name}
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
                                        Chọn
                                    </option>
                                )}
                                {listDistrics.map((distric, index) => (
                                    <option key={index} value={distric.name}>
                                        {distric.name}
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
                                        Chọn
                                    </option>
                                )}
                                {listWards.map((ward, index) => (
                                    <option key={index} value={ward.name}>
                                        {ward.name}
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
                                    ? numeral(price + shippingCost).format('0,0[.]00 VNĐ')
                                    : numeral(price).format('0,0[.]00 VNĐ')}{' '}
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
