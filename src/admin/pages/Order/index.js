import React from 'react'
import classNames from "classnames/bind"
import styles from './Order.module.scss'
import EnhancedTable from '../../components/Table/EnhancedTable';
import { api, CHOXACNHAN, DANGGIAO, HOANTHANH } from '../../../constants';
import LinearProgress from '@mui/material/LinearProgress';
import { Backdrop } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import StatusOrder from '../../components/StatusOrder';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Delete, View } from '../../components/Button/Button';
import { Link } from 'react-router-dom';
import numeral from 'numeral';

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

    const [rows, setRows] = React.useState([])
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [loading, setLoading] = React.useState(false)
    const [isUpdate, setIsUpdate] = React.useState(false)
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
            renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value?.fullName : "Trống"}</p>
        },
        {
            field: 'address',
            headerName: 'Địa chỉ',
            width: 160,
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

                const handleUpdate = () => {
                    let updateStatus = null
                    if (params.row.status === CHOXACNHAN) {
                        updateStatus = DANGGIAO
                    } else if (params.row.status === DANGGIAO) {
                        updateStatus = HOANTHANH
                    }
                    if (updateStatus) {
                        fetch(`${api}/orders/update/${params.row._id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "_id": params.row._id,
                                "status": updateStatus
                            })
                        })
                            .then(response => response.json())
                            .then(result => {
                                if (result.status === 'OK') {
                                    setIsUpdate(prev => !prev)
                                    toast.success('Cập nhật thành công!')
                                } else {
                                    toast.error(result.message)
                                }
                            })
                            .catch(err => {
                                toast.error(err.message)
                            })
                    } else {
                        toast.error("Lỗi! Không tìm thấy trạng thái đơn hàng")
                    }
                }

                return <div style={{ display: 'flex' }} onClick={handleOnCLick}>
                    <p onClick={() => {
                        confirmAlert({
                            title: 'Xác nhận cập nhật?',
                            message: 'Đơn hàng sẽ được cập nhật trạng thái!',
                            buttons: [
                                {
                                    label: 'Đồng ý',
                                    onClick: () => {
                                        handleUpdate()
                                    }
                                },
                                {
                                    label: 'Hủy',
                                    onClick: () => { }
                                }
                            ]
                        });
                    }}>
                        <StatusOrder status={params.row.status} />
                    </p>
                </div>
            }
        },
    ];

    const handleTab = (index) => {
        setCurrentIndex(index)
    }

    React.useEffect(() => {
        setLoading(true)
        setRows([])
        let query = `${api}/orders/filter`
        if (tabList[currentIndex].value) {
            query = `${api}/orders/filter?status=${tabList[currentIndex].value}`
        }
        fetch(query, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(result => {
                if (result.status === "OK") {
                    setLoading(false)
                    setRows(result.data)
                } else {
                    setLoading(false)
                    toast.error(result.message)
                }
            })
            .catch(error => {
                setLoading(false)
                toast.error(error.message)
            })
    }, [currentIndex, isUpdate])
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
            />
            <div className={cx('heading')}>
                <h3>Quản lý đơn hàng</h3>
            </div>
            {
                loading &&
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
                rows.length > 0
                    ? <div className={cx('table')}>
                        <EnhancedTable columns={columns} rows={rows} />
                    </div>
                    : <div className={cx('nodata')}>
                        <p className={cx('nodata_label')}>Dữ liệu trống!</p>
                    </div>
            }
        </div>
    )
}

export default Order