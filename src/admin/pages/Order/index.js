import React from 'react'
import classNames from "classnames/bind"
import styles from './Order.module.scss'
import EnhancedTable from '../../components/Table/EnhancedTable';
import { api, CHOXACNHAN, DAHUY, DANGGIAO, HOANTHANH } from '../../../constants';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import { Backdrop } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import StatusOrder from '../../components/StatusOrder';
import 'react-confirm-alert/src/react-confirm-alert.css';
import numeral from 'numeral';
import { Button, Popconfirm, Skeleton } from 'antd';
import SendNotification from '../../../service/SendNotification'
import { appPath, orderImages } from '../../../constants';
import { getAuthInstance } from '../../../utils/axiosConfig';
import { useStore } from '../../../stores/hooks';
import { useData } from '../../../stores/DataContext';
import { Link } from 'react-router-dom';

const tabList = [
    {
        title: 'Tất cả',
    },
    {
        title: 'Đang chờ xác nhận',
        value: 'CHOXACNHAN'
    },
    {
        title: 'Đang giao',
        value: 'DANGGIAO'
    },
    {
        title: 'Hoàn thành',
        value: 'HOANTHANH'
    },
    {
        title: 'Đã hủy',
        value: 'DAHUY'
    }
]

const cx = classNames.bind(styles)
function Order() {

    const authInstance = getAuthInstance()

    const [rows, setRows] = React.useState([])
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [isUpdate, setIsUpdate] = React.useState(0)
    const { data, setData } = useData()
    const [allOrders, setAllOrders] = React.useState([])
    const columns = [
        {
            field: 'name',
            headerName: 'Người nhận',
            sortable: false,
            editable: true,
            width: 160,
            renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : "Trống"}</p>
        },
        {
            field: 'user',
            headerName: 'Tài khoản',
            sortable: false,
            editable: true,
            width: 160,
            renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value?.fullName : "Trống"}</p>
        },
        {
            field: 'address',
            headerName: 'Địa chỉ',
            width: 300,
            sortable: false,
            renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : "Trống"}</p>
        },
        {
            field: 'phone',
            headerName: 'Điện thoại',
            width: 160,
            sortable: false,
            renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : "Trống"}</p>
        },
        {
            field: 'quantity',
            headerName: 'Số lượng',
            width: 100,
            sortable: false,
            renderCell: (params) => <p className={params.value ? cx('text-center') : cx('null')}>{params.value ? params.value : "Trống"}</p>
        },
        {
            field: 'price',
            headerName: 'Thành tiền(đ)',
            width: 120,
            sortable: false,
            renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? numeral(params.value).format('0,0[.]00 VNĐ') : "Trống"}</p>
        },
        {
            field: '_id',
            headerName: 'Hành động',
            disableColumnMenu: true,
            sortable: false,
            width: 160,
            renderCell: (params) => {
                const handleOnCLick = (e) => {
                    e.stopPropagation();
                }

                return <Link to={`/admin/order/detail/${params.value}`}>
                    <Button type='primary' ghost>Chi tiết</Button>
                </Link>

            }
        },
    ];

    const handleTab = (index) => {
        setCurrentIndex(index)
    }

    const fetchOrders = () => {
        authInstance.post("/orders/filter")
            .then(result => {
                if (result.data.status === "OK") {

                    setData({ ...data, orders: result.data.data })
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    React.useEffect(() => {

        fetchOrders()
    }, [isUpdate])

    React.useEffect(() => {

        setAllOrders(data.orders)
    }, [data])

    React.useEffect(() => {

        if (currentIndex === 0) {

            setRows(data.orders)
        } else {
            const status = tabList[currentIndex].value

            const newList = data.orders.filter(order => order.status === status)
            setRows(newList)
        }

    }, [currentIndex, data])
    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <h3>Quản lý đơn hàng</h3>
            </div>

            <ul className={cx('tab_list')}>
                {
                    tabList.map((tab, index) => (
                        <li
                            onClick={() => handleTab(index)}
                            key={index}
                            className={index === currentIndex ? cx('tab_item', 'tab_active') : cx('tab_item')}
                        >
                            {tab.title}
                        </li>
                    ))
                }
            </ul>
            <div className={cx('table')}>
                {rows && <EnhancedTable columns={columns} rows={rows} />}
            </div>
        </div>
    )
}

export default Order