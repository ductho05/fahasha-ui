import React from 'react';
import classNames from 'classnames/bind';
import styles from './Order.module.scss';
import EnhancedTable from '../../components/Table/EnhancedTable';
import { api, CHOXACNHAN, DAHUY, DANGGIAO, HOANTHANH } from '../../../constants';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import { Backdrop } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StatusOrder from '../../components/StatusOrder';
import 'react-confirm-alert/src/react-confirm-alert.css';
import numeral from 'numeral';
import { Button, Popconfirm, Skeleton, Select, Input } from 'antd';
import SendNotification from '../../../service/SendNotification';
import { appPath, orderImages } from '../../../constants';
import { getAuthInstance } from '../../../utils/axiosConfig';
import { useStore } from '../../../stores/hooks';
import { useData } from '../../../stores/DataContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
const tabList = [
    {
        title: 'Tất cả',
    },
    {
        title: 'Đang chờ xác nhận',
        value: 'CHOXACNHAN',
    },
    {
        title: 'Đang giao',
        value: 'DANGGIAO',
    },
    {
        title: 'Hoàn thành',
        value: 'HOANTHANH',
    },
    {
        title: 'Đã hủy',
        value: 'DAHUY',
    },
];
const sortOptions = [
    // {
    //     label: 'Mặc định',
    //     value: 'default',
    // },
    {
        label: 'Gần đây nhất',
        value: 'oldest',
    },
    {
        label: 'Cũ nhất',
        value: 'newest',
    },
    {
        label: 'Giá tăng dần',
        value: 'price_asc',
    },
    {
        label: 'Giá giảm dần',
        value: 'price_desc',
    },
    {
        label: 'Số lượng tăng dần',
        value: 'rate_asc',
    },
    {
        label: 'Số lượng giảm dần',
        value: 'rate_desc',
    },
];

const cx = classNames.bind(styles);
function Order() {
    const authInstance = getAuthInstance();
    const [selectSort, setSelectSort] = useState(null);
    const [rows, setRows] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(localStorage.getItem('tabIndex') || 0);
    const [isUpdate, setIsUpdate] = useState(0);
    const { data, setData } = useData();
    const [allOrders, setAllOrders] = useState([]);
    const [keywords, setKeywords] = useState(null);
    const [temData, setTemData] = useState([]);

    const columns = [
        {
            field: 'rowNumber',
            headerName: 'STT',
            width: 30,
            sortable: false,
            editable: false,
            headerAlign: 'center',
            renderCell: (params) => {
                return (
                    <>
                        <p
                            style={{
                                padding: '0 0 0 10px',
                            }}
                        >
                            {params.value}
                        </p>
                    </>
                );
            },
        },
        {
            field: 'user',
            headerName: 'Tài khoản',
            sortable: false,
            editable: true,
            width: 160,
            renderCell: (params) => (
                <p className={params.value?.fullName ? cx('') : cx('null')}>
                    {params.value?.fullName ? params.value?.fullName : 'Trống'}
                </p>
            ),
        },
        {
            field: 'name',
            headerName: 'Người nhận',
            sortable: false,
            editable: true,
            width: 160,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : 'Trống'}</p>
            ),
        },

        {
            field: 'address',
            headerName: 'Địa chỉ',
            width: 160,
            sortable: false,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : 'Trống'}</p>
            ),
        },
        {
            field: 'date',
            headerName: 'Thời gian đặt',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : 'Trống'}</p>
            ),
        },
        {
            field: 'payment_method',
            headerName: 'Phương thức',
            width: 100,
            sortable: true,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>
                    {params.value
                        ? params.value == 'Thanh toán bằng tiền mặt khi nhận hàng'
                            ? 'Tiền mặt'
                            : 'VN-Pay'
                        : 'Trống'}
                </p>
            ),
        },
        {
            field: 'phone',
            headerName: 'Điện thoại',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : 'Trống'}</p>
            ),
        },
        {
            field: 'quantity',
            headerName: 'Số lượng',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <p className={params.value ? cx('text-center') : cx('null')}>{params.value ? params.value : 'Trống'}</p>
            ),
        },
        {
            field: 'price',
            headerName: 'Thành tiền(đ)',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>
                    {params.value ? numeral(params.value).format('0,0[.]00 VNĐ') : 'Trống'}
                </p>
            ),
        },
        {
            field: '_id',
            headerName: 'Hành động',
            disableColumnMenu: true,
            sortable: false,
            width: 110,
            renderCell: (params) => {
                const handleOnCLick = (e) => {
                    e.stopPropagation();
                };

                return (
                    <Link to={`/admin/orders/detail/${params.value}`}>
                        <Button type="primary" ghost>
                            Chi tiết
                        </Button>
                    </Link>
                );
            },
        },
    ];

    useEffect(() => {
        if (localStorage.getItem('tabIndex')) {
            //handleTab(localStorage.getItem('tabIndex'));
            localStorage.removeItem('tabIndex');
        }
    }, []);

    const filterProduct = (keywords) => {
        let newList = [...temData];
        // console.log('dang filter', newList);
        newList = newList.filter((product) => {
            if (keywords) {
                if (product.name && product.user?.fullName && product.address) {
                    return (
                        product.user?.fullName.toLowerCase().includes(keywords.toLowerCase()) ||
                        product?.name.toLowerCase().includes(keywords.toLowerCase()) ||
                        product?.address.toLowerCase().includes(keywords.toLowerCase())
                    );
                } else if (product.name && product.user?.fullName) {
                    return (
                        product.user?.fullName.toLowerCase().includes(keywords.toLowerCase()) ||
                        product?.name.toLowerCase().includes(keywords.toLowerCase())
                    );
                }
                if (product.name && product.address) {
                    return (
                        product?.name.toLowerCase().includes(keywords.toLowerCase()) ||
                        product?.address.toLowerCase().includes(keywords.toLowerCase())
                    );
                }
                if (product.user?.fullName && product.address) {
                    return (
                        product.user?.fullName.toLowerCase().includes(keywords.toLowerCase()) ||
                        product?.address.toLowerCase().includes(keywords.toLowerCase())
                    );
                }
                if (product.address) {
                    return product?.address.toLowerCase().includes(keywords.toLowerCase());
                } else if (product.name) {
                    return product?.name.toLowerCase().includes(keywords.toLowerCase());
                } else if (product.user?.fullName) {
                    return product.user?.fullName.toLowerCase().includes(keywords.toLowerCase());
                } else {
                    return product;
                }
            } else {
                return product;
            }
        });

        newList !== undefined && setRows(newList); // : setRows(data.products);
    };

    useEffect(() => {
        // console.log('dfyhsấasv', keywords, selectCategory, price, rate, rolefilter, status);
        filterProduct(keywords);
        //  setSelectSort(sortOptions[0]);
        // setSelectSort
    }, [keywords]);

    // console.log('rows12344', rows);
    useEffect(() => {
        if (selectSort && rows?.length > 0) {
            sortProduct(selectSort);
            // setIsSort(false);
        }
    }, [selectSort]);

    const sortProduct = (sort) => {
        let newList2 = [...rows].sort((a, b) => {
            if (sort.value == 'newest') {
                return a.date.localeCompare(b.date);
            } else if (sort.value == 'oldest') {
                return b.date.localeCompare(a.date);
            } else if (sort.value == 'price_asc') {
                return a.price - b.price;
            } else if (sort.value == 'price_desc') {
                return b.price - a.price;
            } else if (sort.value == 'rate_asc') {
                return a.quantity - b.quantity;
            } else if (sort.value == 'rate_desc') {
                return b.quantity - a.quantity;
            } else {
                return a?.user?.fullName.localeCompare(b?.user?.fullName);
            }
        });
        //  console.log('newList42222', newList);
        //  setIsSort(false);
        setRows(newList2);
    };

    const handleSearch = (value) => {
        setKeywords(value);
    };

    const handleTab = (index) => {
        setCurrentIndex(index);
    };

    const handleSortChange = (value, option) => {
        setSelectSort(option);
    };

    const fetchOrders = () => {
        authInstance
            .post('/orders/filter')
            .then((result) => {
                if (result.data.status === 'OK') {
                    setData({ ...data, orders: result.data.data });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchOrders();
    }, [isUpdate]);

    useEffect(() => {
        setAllOrders(data.orders);
    }, [data]);

    useEffect(() => {
        if (currentIndex === 0) {
            setRows(data.orders);
            setTemData(data.orders);
        } else {
            const status = tabList[currentIndex].value;
            const newList = data.orders.filter((order) => order.status === status);
            setRows(newList);
            setTemData(newList);
            setSelectSort(null);
        }
    }, [currentIndex, data]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <h3>Quản lý đơn hàng</h3>
            </div>

            <ul className={cx('tab_list')}>
                {tabList.map((tab, index) => (
                    <li
                        onClick={() => handleTab(index)}
                        key={index}
                        className={index == currentIndex ? cx('tab_item', 'tab_active') : cx('tab_item')}
                    >
                        {tab.title}
                    </li>
                ))}
            </ul>

            <div className="flex items-center justify-between px[20px] py-[10px] shadow-sm border rounded-[6px] my-[10px]">
                <div className="px-[20px] flex items-center">
                    <p className="text-[1.4rem] text-[#333] mr-[10px]">Sắp xếp theo: </p>
                    <Select
                        disabled={data?.orders?.length == 0}
                        className="w-[200px]"
                        placeholder="Chọn..."
                        options={sortOptions}
                        onChange={handleSortChange}
                        value={
                            selectSort
                                ? {
                                      label: selectSort.label,
                                      value: selectSort.value,
                                  }
                                : null
                        }
                    />
                </div>
                <div className="px-[20px] flex items-center">
                    <Input.Search
                        disabled={data?.orders?.length == 0}
                        //onSearch={handleSearch}
                        className="w-[400px]"
                        placeholder="Tìm kiếm theo tên người hoặc địa chỉ..."
                        onChange={(e) => handleSearch(e.target.value)}
                        // value={keywords}
                    />
                </div>
            </div>

            <div className={cx('table')}>
                {rows && (
                    <EnhancedTable
                        pageSize={12}
                        columns={columns}
                        ischeckboxSelection={false}
                        type="order"
                        height="60.9vh"
                        rows={rows?.map((row, index) => ({
                            ...row,
                            rowNumber: index + 1,
                        }))}
                    />
                )}
            </div>
        </div>
    );
}

export default Order;
