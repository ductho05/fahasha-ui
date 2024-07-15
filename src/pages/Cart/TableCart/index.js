import { Button, Input, Table, Typography, Image, message } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import styles from './TableCart.module.scss';
import classname from 'classnames/bind';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../../../stores/hooks';

import { getAuthInstance } from '../../../utils/axiosConfig';
import { api } from '../../../constants';
import { useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Skeleton } from 'antd';
import Item from 'antd/es/list/Item';
import { auth } from '../../../FirebaseConfig';

import { useData, useAdmin } from '../../../stores/DataContext';
function TableCart() {
    const authInstance = getAuthInstance();
    const navigate = useNavigate();
    const numeral = require('numeral');
    const [loading, setLoading] = useState(false);
    const [state, dispatch] = useStore();
    const cx = classname.bind(styles);
    const namecart = `myCart_${state.user._id}`;
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const product = localStorage.getItem(namecart) ? JSON.parse(localStorage.getItem(namecart)).items : [];
    const [dataCart, setDataCart] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState(GetLocalCart);
    const info = (coupon) => {
        message.info({
            content: coupon,
            duration: 1.5,
        });
    };
    const { data, setData } = useData();
    const [coupon, setCoupon] = useState([]);

    console.log('data mãu giảm giá', data);

    // const coupon = [
    //     {
    //         code: '30thang4',
    //         discount: 10,
    //     },
    //     {
    //         code: 'khuyenmaiT4',
    //         discount: 20,
    //     },
    //     {
    //         code: 'DUCANH',
    //         discount: 30,
    //     },
    // ];

    useEffect(() => {
        if (data?.item && code == '' && data.item.status == true && dataCart.length > 0) {
            setDiscount(data.item.discount / 100);
            setCode(data.item.code);
            info(`Hệ thống tự động áp dụng mã giảm giá [${data.item.code}] giảm ${data.item.discount}% cho bạn`);
        }
        // else if (data?.item && code == '' && data.item.status == true && dataCart.length == 0) {
        //     info(`Vui lòng mua hàng trước khi chọn phiếu giảm giá`);
        // }
    }, [data, dataCart.length]);

    useEffect(() => {
        product.forEach((item) => {
            fetch(`${api}/products/id/${item.id}`)
                .then((response) => response.json())
                .then((products) => {
                    setDataCart((prev) => {
                        return [
                            ...prev,
                            {
                                key: item.id,
                                image: products.data.images,
                                name: products.data.title,
                                price: products.data.price,
                                count: item.count,
                                total: item.count * products.data.price,
                                quantity: products.data.quantity,
                            },
                        ];
                    });
                })
                .catch((err) => console.log(err));
        });
    }, []);

    const checkExpried = (expried) => {
        const today = new Date();
        const expriedDate = new Date(expried);
        if (today > expriedDate) {
            return false;
        } else {
            return true;
        }
    };

    // lấy mã giảm giá từ api
    useEffect(() => {
        setLoading(true);
        authInstance
            .get(`/vouchers?user=${state.user._id}&status=true`)
            .then((result) => {
                if (result.data.status == 'OK') {
                    const data = result?.data?.data.filter((item) => checkExpried(item.expried));
                    setCoupon(data);
                    // console.log('resulta', result.data.data, state.user._id);
                }
                setLoading(false);
            })
            .catch((err) => setLoading(false));
    }, []);
    // Lấy trạng thái chọn mua từ local
    function GetLocalCart() {
        var initIscheckout = [];
        product.map((item, index) => {
            if (item.isGetcheckout == 1) {
                initIscheckout.push(item.id);
            }
        });
        return initIscheckout;
    }

    // Update trạng thái chọn mua trong giỏ hàng lên local
    const updateLocalCart = (newSelectedRowKeys) => {
        var myCart = JSON.parse(localStorage.getItem(namecart));
        product.map((item, index) => {
            if (newSelectedRowKeys.includes(item.id)) {
                myCart.items[index].isGetcheckout = 1;
            } else {
                myCart.items[index].isGetcheckout = 0;
            }
        });
        localStorage.setItem(namecart, JSON.stringify(myCart));
    };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
        updateLocalCart(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const handleDelete = (key) => {
        // Xóa trên UI
        const newData = [...dataCart];
        const index = newData.findIndex((item) => key === item.key);
        newData.splice(index, 1);
        setDataCart(newData);

        // Xóa trên localStorage
        const myCart = JSON.parse(localStorage.getItem(namecart));
        const newCart = myCart.items.filter((item) => item.id !== key);
        myCart.items = newCart;
        localStorage.setItem(namecart, JSON.stringify(myCart));

        // Nêu giỏ hàng rỗng thì xóa luôn localStorage
        if (newCart.length === 0) {
            localStorage.removeItem(namecart);
        }
    };

    function TongThanhToan() {
        let tong = 0;
        selectedRowKeys.map((item, index) => {
            dataCart.map((item2, index2) => {
                if (item === item2.key) {
                    tong += item2.total;
                }
            });
        });
        return tong;
    }

    const columns = [
        {
            title: 'Chọn tất cả sản phẩm',
            // chia độ rộng cột
            width: '45%',
            dataIndex: 'name',
            onCell: (record) => ({
                style: { cursor: 'pointer' },
                onClick: () => navigate(`/product-detail/${record.key}`),
            }),
            render: (_, record) => {
                return {
                    children: (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}
                        >
                            <LazyLoadImage
                                src={record.image}
                                effect="blur"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover',
                                }}
                            />

                            <div style={{ marginLeft: '20px' }}>
                                <div
                                    style={{
                                        fontSize: '1.8rem',
                                    }}
                                >
                                    {record.name}
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'start',
                                        flexDirection: 'row',
                                        margin: '5px 0px',
                                    }}
                                >
                                    <Image
                                        preview={false}
                                        width={15}
                                        src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/91167e001db60b62d4f85c3e0ea919b6.png"
                                    />
                                    <div
                                        style={{
                                            fontSize: '1.5rem',
                                            fontStyle: 'italic',
                                            marginLeft: '5px',
                                        }}
                                    >
                                        7 Ngày Miễn Phí Trả Hàng
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                };
            },
        },

        {
            title: 'Giá',
            dataIndex: 'price',
            render: (_) => {
                return {
                    children: (
                        <div
                            style={{
                                fontSize: '1.8rem',
                            }}
                        >
                            {numeral(_).format('0,0')}đ
                        </div>
                    ),
                };
            },
        },
        {
            title: 'Số lượng',
            dataIndex: 'count',
            render: (_, record) => {
                return {
                    children: (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                                padding: '0 20px 0 0',
                            }}
                        >
                            <Button
                                style={{
                                    flex: 1,
                                    height: '30px',
                                    width: '15px',
                                    display: 'flex', // Thêm thuộc tính display: flex
                                    alignItems: 'center', // Căn giữa theo chiều dọc
                                    justifyContent: 'center', // Căn giữa theo chiều ngang
                                }}
                                disabled={record.count === 1 || rowSelection.selectedRowKeys.includes(record.key)}
                                onClick={() => {
                                    const newData = [...dataCart];
                                    newData.map((item, index) => {
                                        if (item.key === record.key) {
                                            item.count -= 1;
                                            item.total = item.count * item.price;
                                        }
                                    });
                                    setDataCart(newData);

                                    const myCart = JSON.parse(localStorage.getItem(namecart));
                                    product.map((item, index) => {
                                        if (item.id === record.key) {
                                            item.count -= 1;
                                        }
                                    });
                                    myCart.items = product;
                                    localStorage.setItem(namecart, JSON.stringify(myCart));
                                }}
                                icon={<MinusOutlined />}
                            />

                            <div
                                style={{
                                    display: 'flex',
                                    flex: 0.8,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '1.8rem',
                                }}
                            >
                                {_}
                            </div>
                            <Button
                                style={{
                                    flex: 1,
                                    height: '30px',
                                    width: '15px',
                                    display: 'flex', // Thêm thuộc tính display: flex
                                    alignItems: 'center', // Căn giữa theo chiều dọc
                                    justifyContent: 'center', // Căn giữa theo chiều ngang
                                }}
                                disabled={rowSelection.selectedRowKeys.includes(record.key)}
                                onClick={() => {
                                    const newData = [...dataCart];
                                    newData.map((item, index) => {
                                        if (item.key === record.key) {
                                            if (item.quantity - item.count == 0) {
                                                message.warning('Vui lòng không đặt quá số lượng trong kho');
                                            } else {
                                                item.count += 1;
                                                item.total = item.count * item.price;
                                            }
                                        }
                                    });
                                    setDataCart(newData);

                                    const myCart = JSON.parse(localStorage.getItem(namecart));
                                    product.map((item, index) => {
                                        if (item.id === record.key) {
                                            item.count += 1;
                                        }
                                    });
                                    myCart.items = product;
                                    localStorage.setItem(namecart, JSON.stringify(myCart));
                                }}
                                icon={<PlusOutlined />}
                            />
                        </div>
                    ),
                };
            },
        },
        {
            title: 'Số tiền',
            dataIndex: 'total',
            render: (_) => {
                return {
                    children: (
                        <div
                            style={{
                                color: '#ff4d4f',
                                fontSize: '1.8rem',
                            }}
                        >
                            {numeral(_).format('0,0')}đ
                        </div>
                    ),
                };
            },
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',

            render: (_, record) => {
                return {
                    children: (
                        <Typography.Link onClick={() => handleDelete(record.key)}>
                            <DeleteOutlined
                                style={{ color: '#333', fontSize: '1.8rem', display: 'flex', padding: '0 0 0 20px' }}
                            />
                        </Typography.Link>
                    ),
                };
            },
        },
    ];
    return (
        <div className={cx('content')}>
            <Table
                style={{
                    flex: 6,
                    fontSize: '2.8rem',
                    margin: '0 0.5% 0 1%',
                }}
                pagination={false}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataCart}
            />
            <div className={cx('right')}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            // marginBottom: '',
                            backgroundColor: '#fff',
                            padding: '1% 5%',
                            borderRadius: '5px',
                        }}
                    >
                        <Input
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value);
                            }}
                            style={{
                                marginRight: '1.5%',
                                flex: 8,
                                fontSize: '1.5rem',
                            }}
                            placeholder="Nhập mã giảm giá"
                        />
                        <Button
                            onClick={() => {
                                let flag = false;
                                if (TongThanhToan() <= 0) {
                                    info(`Vui lòng chọn sản phẩm trước`);
                                    return;
                                } else {
                                    if (code === '') {
                                        info(`Vui lòng nhập mã giảm giá`);
                                        return;
                                    }

                                    coupon.map((item, index) => {
                                        if (item.code === code) {
                                            setDiscount(item.discount / 100);
                                            info(`Áp dụng mã giảm giá ${item.discount}% thành công`);

                                            //setCode('');
                                            setData({ ...data, item });
                                            flag = true;
                                        }
                                    });
                                    if (!flag) {
                                        info(`Mã giảm giá không tồn tại hoặc đã được sử dụng`);
                                    }
                                }
                            }}
                            style={{
                                marginLeft: '1.5%',
                                fontSize: '1.5rem',
                                textAlign: 'center',
                                flex: 2,
                                display: 'flex', // Canh giữa theo chiều ngang và dọc
                                alignItems: 'center', // Canh giữa theo chiều dọc
                            }}
                        >
                            Áp dụng
                        </Button>
                    </div>
                    <p
                        onClick={() => {
                            navigate('/account/5');
                        }}
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginRight: '7%',
                            marginTop: '1%',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: '#1890ff',
                        }}
                    >
                        Xem thêm
                    </p>
                </div>

                <div className={cx('total')}>
                    {data?.item?.status == true && dataCart.length > 0 && (
                        <div className={cx('product_item')}>
                            <div
                                className={cx('thumbnail')}
                                style={{
                                    backgroundColor: '#17a42c',
                                }}
                                onClick={() => {
                                    //navigate(`/product-detail/${product._id}`);
                                }}
                            >
                                <img
                                    src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_coupongreen.svg?q=10402"
                                    alt="Lỗi load ảnh"
                                />
                            </div>
                            <div
                                className={cx('content_voucher')}
                                style={{
                                    backgroundColor: '#e1ffe5',
                                }}
                            >
                                <p className={cx('author')}>Mã: {data?.item?.code}</p>
                                <p className={cx('author')}>Giảm giá: {data?.item?.discount}%</p>
                            </div>
                        </div>
                    )}
                    <div className={cx('total-price')}>
                        <div className={cx('total-price-title')}>Thành tiền</div>
                        <span></span>
                        <div className={cx('total-price-contain')}>
                            <div className={cx('total-price-total')}>
                                <div className={cx('total-price-contain-title')}>Tạm tính</div>
                                <div className={cx('total-price-contain-value')}>
                                    {numeral(TongThanhToan()).format('0,0')}đ
                                </div>
                            </div>
                            <div className={cx('total-price-total')}>
                                <div className={cx('total-price-contain-title')}>Giảm giá</div>
                                <div className={cx('total-price-contain-value')}>
                                    {numeral(TongThanhToan() * discount).format('0,0')}đ
                                </div>
                            </div>
                            <span></span>
                            <div className={cx('total-price-total-final')}>
                                <div className={cx('total-price-contain-title-final')}>Tổng cộng</div>
                                <div className={cx('total-price-contain-value-final')}>
                                    {numeral(TongThanhToan() - TongThanhToan() * discount).format('0,0')}đ
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        disabled={TongThanhToan() <= 0}
                        className={cx('btn-checkout')}
                        style={{
                            transition: 'background-color 0.3s', // Hiệu ứng hover
                        }}
                    >
                        <Link to="/checkout">Thanh toán</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
export default TableCart;
