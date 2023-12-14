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
import { Popconfirm, Skeleton } from 'antd';
import SendNotification from '../../../service/SendNotification'
import { appPath, orderImages } from '../../../constants';
import { getAuthInstance } from '../../../utils/axiosConfig';
import { useStore } from '../../../stores/hooks';
import { useData } from '../../../stores/DataContext';

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
    const [loading, setLoading] = React.useState(false)
    const [loadingOrder, setLoadingOrder] = React.useState(false)
    const [isUpdate, setIsUpdate] = React.useState(0)
    const [state, dispatch] = useStore()
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
            field: 'wards',
            headerName: 'Phường/ Xã',
            width: 180,
            sortable: false,
            renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : "Trống"}</p>
        },
        {
            field: 'districs',
            headerName: 'Quận/ Huyện',
            width: 160,
            sortable: false,
            renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : "Trống"}</p>
        },
        {
            field: 'city',
            headerName: 'Tỉnh/ Thành phố',
            width: 160,
            sortable: false,
            renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : "Trống"}</p>
        },
        {
            field: 'phone',
            headerName: 'Điện thoại',
            width: 100,
            sortable: false,
            renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : "Trống"}</p>
        },
        {
            field: 'quantity',
            headerName: 'Số lượng',
            width: 80,
            sortable: false,
            renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : "Trống"}</p>
        },
        {
            field: 'price',
            headerName: 'Thành tiền(đ)',
            width: 100,
            sortable: false,
            renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? numeral(params.value).format('0,0[.]00 VNĐ') : "Trống"}</p>
        },
        {
            field: '_idAndStatus',
            headerName: 'Hành động',
            disableColumnMenu: true,
            sortable: false,
            width: 200,
            renderCell: (params) => {
                const handleOnCLick = (e) => {
                    e.stopPropagation();
                }

                const handleUpdate = async () => {
                    let updateStatus = null
                    if (params.row.status === CHOXACNHAN) {
                        updateStatus = DANGGIAO
                    } else if (params.row.status === DANGGIAO) {
                        updateStatus = HOANTHANH
                    }
                    if (updateStatus) {
                        setLoading(true)
                        await authInstance.put(`/orders/update/${params.row._id}`,
                            { "status": updateStatus }
                        )
                            .then(async result => {

                                if (result.data.status === 'OK') {
                                    setIsUpdate(prev => prev + 1)
                                    let description = "Đơn hàng của bạn đang trên đường giao. Hãy để ý điện thoại nhé!"
                                    if (result.data.status === DANGGIAO) {
                                        description = "Đơn hàng của bạn đã được giao thành công!"
                                    }
                                    const url = `${appPath}/account/order/detail/${result.data._id}`
                                    const title = "Thông báo đơn hàng"
                                    const user = result.data.data.user

                                    await authInstance.post(`/webpush/send`, {
                                        filter: "personal",
                                        notification: {
                                            title,
                                            description,
                                            image: orderImages,
                                            url,
                                            user
                                        }
                                    })
                                        .then(result => {
                                            if (result.data.status == "OK") {
                                                state.socket.emit("send-notification", {
                                                    type: "personal",
                                                    userId: null,
                                                    notification: {
                                                        title,
                                                        description,
                                                        image: orderImages,
                                                        url,
                                                        user
                                                    }
                                                })
                                                toast.success('Cập nhật thành công!')
                                            }
                                        })
                                        .catch((err) => {
                                            console.error(err)
                                        })

                                } else {
                                    toast.error(result.data.message)
                                }
                                setLoading(false)
                            })
                            .catch(err => {
                                toast.error(err?.response?.data?.message)
                                setLoading(false)
                            })
                    } else {
                        toast.error("Không tìm thấy trạng thái đơn hàng")
                    }
                }

                return <div style={{ display: 'flex' }} onClick={handleOnCLick}>
                    {
                        params.row.status === HOANTHANH || params.row.status === DAHUY
                            ? <StatusOrder status={params.row.status} />
                            : <Popconfirm
                                title="Xác nhận?"
                                description="Đơn hàng sẽ được cập nhật trạng thái"
                                onConfirm={handleUpdate}
                                onCancel={() => { }}
                                okText="Đồng ý"
                                cancelText="Hủy"
                            >
                                <p>
                                    <StatusOrder status={params.row.status} />
                                </p>
                            </Popconfirm>
                    }

                </div>
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
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Backdrop
                open={loading}
                sx={{ color: '#fff', zIndex: 10000 }}
            >
                <CircularProgress color="error" />
            </Backdrop>
            <div className={cx('heading')}>
                <h3>Quản lý đơn hàng</h3>
            </div>
            {
                loadingOrder &&
                <div>
                    <LinearProgress />
                </div>
            }
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
            {
                loadingOrder === false
                    ? <div className={cx('table')}>
                        <EnhancedTable columns={columns} rows={rows} />
                    </div>
                    : <div className="mt-[20px]">
                        <Skeleton
                            active
                            paragraph={{
                                rows: 8,
                            }}
                        />
                    </div>
            }
        </div>
    )
}

export default Order