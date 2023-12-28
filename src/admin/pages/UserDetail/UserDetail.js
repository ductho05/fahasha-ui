import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './UserDetail.module.scss';
import IncomeChart from '../../components/charts/IncomeChart/IncomeChart';
import DropMenu from '../../../components/DropMenu';
import OrdersLatesTable from '../../components/OrdersLatesTable/OrdersLatesTable';
import { Backdrop, CircularProgress, Dialog } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useForm, useController } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { api, superAdmin } from '../../../constants';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuthInstance } from '../../../utils/axiosConfig';
import CustomButton from '../../../components/Button';

// import { api, appPath, lockImage, superAdmin, unLockImage } from '../../../constants';
import { useData } from '../../../stores/DataContext';
import EnhancedTable from '../../components/Table/EnhancedTable';
import numeral from 'numeral';
import { Button, Input, message, Modal } from 'antd';
const moment = require('moment-timezone');

const cx = classNames.bind(styles);

const options = [
    {
        title: '6 giờ gần nhất',
        value: 1,
    },
    {
        title: '6 ngày gần nhất',
        value: 2,
    },

    {
        title: '6 tuần gần nhất',
        value: 3,
    },
    {
        title: '6 tháng gần nhất',
        value: 4,
    },
    {
        title: '6 năm gần nhất',
        value: 5,
    },
];

function chuyenDoiThang(tenVietTat) {
    const thangDict = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12',
    };

    // Chuyển đổi viết tắt thành số tương ứng, mặc định là undefined nếu không tìm thấy
    const soThang = thangDict[tenVietTat];

    return soThang;
}

const formatDateToString = (date) => {
    if (date) {
        date = date.$d ? date.$d : date;
        const year = date.getUTCFullYear();
        const month = chuyenDoiThang(date.toString().slice(4, 7));
        const day = date.toString().slice(8, 10);
        const utcTimeString = `${year}-${month}-${day}`;
        return utcTimeString;
        // return date.toISOString().slice(0, 10); // Lấy YYYY-MM-DD
    }
    return ''; // Trả về chuỗi rỗng nếu date là null
};

function UserDetail() {
    const authInstance = getAuthInstance();
    // const { data, setData } = useData();
    const { userId } = useParams();
    const [user, setUser] = useState({});
    const [optionSelected, setOptionSelected] = useState(options[0]);
    const [showDialog, setShowDialog] = useState(false);
    const [avatar, setAvatar] = useState({});
    const [orders, setOrders] = useState([]);
    const [show, setShow] = useState(false);
    const [ischanged, setIsChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [superAdminCode, setSuperAdminCode] = useState();
    const { data, setData } = useData();
    const [dataIncomes, setDataIncomes] = useState([]);
    const num = 5;

    const handleCancelCheck = () => {
        setShow(false);
    };

    const handleCheckCode = () => {
        if (superAdminCode === superAdmin) {
            //  setIsSuperAdmin(true);
            setData({ ...data, isSuperAdmin: true });
            setShow(false);
            //localStorage.setItem('spc', true);
            message.success('Xác nhận thành công!');
        } else {
            message.error(`Mã super admin sai!`);
        }
    };

    const handleChangeCode = (e) => {
        setSuperAdminCode(e.target.value);
    };

    const columns = [
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
            field: 'user',
            headerName: 'Tài khoản',
            sortable: false,
            editable: true,
            width: 160,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value?.fullName : 'Trống'}</p>
            ),
        },
        {
            field: 'address',
            headerName: 'Địa chỉ',
            width: 300,
            sortable: false,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : 'Trống'}</p>
            ),
        },
        {
            field: 'phone',
            headerName: 'Điện thoại',
            width: 160,
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
            width: 140,
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

    const handleClickEdit = () => {
        setShowDialog(true);
        setValue('fullName', user.fullName);
        setValue('phoneNumber', user.phoneNumber);
        setValue('address', user.address);
    };

    const handleCloseEdit = () => {
        clearErrors();
        setAvatar({});
        setShowDialog(false);
    };

    const fetchUsers = () => {
        authInstance
            .get(`/users`)
            .then((result) => {
                setData({ ...data, users: result.data.data });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        authInstance
            .get(`/users/${userId}`)
            .then((result) => {
                if (result.data.status === 'OK') {
                    setUser(result.data.data);
                }
            })
            .catch((err) => console.error(err.message));
    }, [user]);

    useEffect(() => {
        authInstance
            .post(`/orders/filter?user=${userId}`)
            .then((result) => {
                if (result.data.status === 'OK') {
                    setOrders(result.data.data);
                }
            })
            .catch((err) => console.error(err.message));
    }, []);

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(avatar.preview);
        };
    }, [avatar]);

    const handlePreview = (e) => {
        const file = e.target.files[0];
        file.preview = URL.createObjectURL(file);

        setAvatar(file);
    };
    // Validate
    const {
        clearErrors,
        control,
        formState: { errors },
        handleSubmit,
        setValue,
        watch,
    } = useForm({
        mode: 'onBlur',
    });

    const nameController = useController({
        name: 'fullName',
        control,
        rules: {
            required: 'Thông tin này không được để trống'
        }
    });

    const phoneController = useController({
        name: 'phoneNumber',
        control,
        rules: {
            required: 'Thông tin này không được để trống',
            pattern:
            {
                value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                message: 'Vui lòng nhập đúng định dạng số điện thoại'
            }
        }
    })

    const addressController = useController({
        name: 'address',
        control,
        rules: {
            required: 'Thông tin này không được để trống'
        }
    });

    useEffect(() => {
        if (
            watch('fullName') != user.fullName ||
            watch('phoneNumber') != user.phoneNumber ||
            watch('address') != user.address ||
            Object.keys(avatar).length > 0
        ) {
            setIsChanged(true);
        } else {
            setIsChanged(false);
        }
    }, [watch(), avatar]);

    const handleSave = async (data) => {

        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });
        if (Object.keys(avatar).length > 0) {
            formData.append('images', avatar);
        }

        setLoading(true);
        await authInstance
            .put(`/users/update/${userId}`, formData)
            .then((result) => {
                if (result.data.status === 'OK') {
                    setUser(result.data.data);
                    toast.success('Cập nhật thành công!');
                    fetchUsers();
                } else {
                    toast.error('Thất bại! Có lỗi xảy ra');
                }
                setShowDialog(false);
                setLoading(false);
            })
            .catch((err) => {
                setShowDialog(false);
                setLoading(false);
                toast.error(err.message);
                console.error(err);
            });
    };

    useEffect(() => {
        const today = new Date();
        if (optionSelected.title == '6 ngày gần nhất') {
            const incomeData = [];

            for (let i = num + 1; i >= 0; i--) {
                const customday = new Date();
                customday.setDate(customday.getDate() - i);
                const orderscustom = orders.filter((order) => {
                    return formatDateToString(new Date(order.date)) == formatDateToString(customday);
                });
                const totalToday = orderscustom.reduce((total, order) => {
                    return total + order.price;
                }, 0);
                incomeData.push({
                    date: formatDateToString(customday),
                    value: totalToday,
                });
            }
            setDataIncomes(incomeData);
        } else if (optionSelected.title == '6 giờ gần nhất') {
            const incomeData = [];
            // toi muon lặp 6 lần
            for (let i = num + 1; i >= 0; i--) {
                const customday = new Date();
                // Đặt múi giờ cho Việt Nam
                const vietnamTimeZone = 'Asia/Ho_Chi_Minh';
                // Lấy thời gian hiện tại ở Việt Nam
                let currentTimeInVietnam = moment().tz(vietnamTimeZone).get('hour') - i;
                console.log('currentTimeInVietnam', currentTimeInVietnam);
                //customday.setDate(customday.getDate() - i);
                if (currentTimeInVietnam < 0) {
                    currentTimeInVietnam = currentTimeInVietnam + 24;
                    customday.setDate(customday.getDate() - 1);
                }
                const orderscustom = orders.filter((order) => {
                    //console.log('order.date', order?.date);
                    console.log('order.date2', order?.date?.slice(11, 13));
                    return (
                        order?.date?.slice(11, 13) == currentTimeInVietnam &&
                        formatDateToString(new Date(order.date)) == formatDateToString(customday)
                    );
                });
                const totalToday = orderscustom.reduce((total, order) => {
                    return total + order.price;
                }, 0);
                console.log('totalTod212ay1213', totalToday);
                incomeData.push({
                    date: currentTimeInVietnam + 'h',
                    value: totalToday,
                });
            }
            setDataIncomes(incomeData);
        } else if (optionSelected.title == '6 tuần gần nhất') {
            console.log('optionSelected1212', optionSelected);
            const incomeData = [];
            // toi muon lặp 6 lần
            for (let i = num; i >= 0; i--) {
                // lấy giá trị ngày thứ 2 tuần trước
                const date = new Date();
                const day = date.getDay();
                const diff = date.getDate() - day + (day == 0 ? -6 : 1) - 7;
                const mondaylast = new Date(new Date().setDate(diff - 7 * i));
                const sundaylast = new Date(new Date().setDate(diff - 7 * i + 6));
                console.log('11321', diff, mondaylast, sundaylast);
                const orderscustom = orders.filter((order) => {
                    // lấy giá trị thứ 2 tuần sau
                    // const mondaynext = new Date(date.setDate(diff + 14));
                    // console.log('mondaylast', mondaylast, sundaylast, mondaynext);
                    // in ra những đơn hàng trong tuần trước
                    return (
                        formatDateToString(new Date(order.date)) >= formatDateToString(mondaylast) &&
                        formatDateToString(new Date(order.date)) <= formatDateToString(sundaylast)
                    );
                });
                const totalToday = orderscustom.reduce((total, order) => {
                    return total + order.price;
                }, 0);
                incomeData.push({
                    date: formatDateToString(mondaylast) + '->' + formatDateToString(sundaylast),
                    value: totalToday,
                });
            }
            const date = new Date();
            const day = date.getDay();
            const diff = date.getDate() - day + (day == 0 ? -6 : 1) - 7;
            const mondaylast = new Date(date.setDate(diff + 7));
            const orderscustom = orders.filter((order) => {
                // lấy giá trị thứ 2 tuần sau
                // const mondaynext = new Date(date.setDate(diff + 14));
                // console.log('mondaylast', mondaylast, sundaylast, mondaynext);
                // in ra những đơn hàng trong tuần trước
                return (
                    formatDateToString(new Date(order.date)) >= formatDateToString(mondaylast) &&
                    formatDateToString(new Date(order.date)) <= formatDateToString(today)
                );
            });
            const totalToday = orderscustom.reduce((total, order) => {
                return total + order.price;
            }, 0);
            incomeData.push({
                date: formatDateToString(mondaylast) + '->' + formatDateToString(today),
                value: totalToday,
            });
            console.log('incomeData', incomeData);
            setDataIncomes(incomeData);
        } else if (optionSelected.title == '6 tháng gần nhất') {
            console.log('optionSelected1212', optionSelected);
            const incomeData = [];
            // toi muon lặp 6 lần
            for (let i = num + 1; i >= 1; i--) {
                // lấy giá trị ngày thứ 2 tuần trước
                const date = new Date();
                const firstDay = new Date(date.getFullYear(), date.getMonth() - i, 1);
                const lastDay = new Date(date.getFullYear(), date.getMonth() - i + 1, 0);
                console.log('firstDay232223233', formatDateToString(firstDay), formatDateToString(lastDay));

                const orderscustom = orders.filter((order) => {
                    // lấy giá trị thứ 2 tuần sau
                    // const mondaynext = new Date(date.setDate(diff + 14));
                    // console.log('mondaylast', mondaylast, sundaylast, mondaynext);
                    // in ra những đơn hàng trong tuần trước
                    return (
                        formatDateToString(new Date(order.date)) >= formatDateToString(firstDay) &&
                        formatDateToString(new Date(order.date)) <= formatDateToString(lastDay)
                    );
                });
                const totalToday = orderscustom.reduce((total, order) => {
                    return total + order.price;
                }, 0);
                incomeData.push({
                    date: 'T' + (date.getMonth() - i + 1),
                    value: totalToday,
                });
            }
            const date = new Date();
            const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            console.log('firstDay2322121223233', formatDateToString(firstDay));
            const orderscustom = orders.filter((order) => {
                // lấy giá trị thứ 2 tuần sau
                // const mondaynext = new Date(date.setDate(diff + 14));
                // console.log('mondaylast', mondaylast, sundaylast, mondaynext);
                // in ra những đơn hàng trong tuần trước
                return (
                    formatDateToString(new Date(order.date)) >= formatDateToString(firstDay) &&
                    formatDateToString(new Date(order.date)) <= formatDateToString(today)
                );
            });
            const totalToday = orderscustom.reduce((total, order) => {
                return total + order.price;
            }, 0);
            incomeData.push({
                date: 'T' + (date.getMonth() + 1),
                value: totalToday,
            });
            console.log('incomeData', incomeData);
            setDataIncomes(incomeData);
        } else if (optionSelected.title == '6 năm gần nhất') {
            console.log('optionSelected1212', optionSelected);
            const incomeData = [];
            // toi muon lặp 6 lần
            for (let i = num + 1; i >= 1; i--) {
                const date = new Date();
                // lấy giá trị ngày thứ 2 tuần trước
                const firstDay = new Date(new Date().getFullYear() - i, 0, 1);
                // ngày cuối của năm
                const lastDay = new Date(new Date().getFullYear() - i, 11, 31);
                console.log('first232Day2323', formatDateToString(firstDay), formatDateToString(lastDay));

                const orderscustom = orders.filter((order) => {
                    // lấy giá trị thứ 2 tuần sau
                    // const mondaynext = new Date(date.setDate(diff + 14));
                    // console.log('mondaylast', mondaylast, sundaylast, mondaynext);
                    // in ra những đơn hàng trong tuần trước
                    return (
                        formatDateToString(new Date(order.date)) >= formatDateToString(firstDay) &&
                        formatDateToString(new Date(order.date)) <= formatDateToString(lastDay)
                    );
                });
                const totalToday = orderscustom.reduce((total, order) => {
                    return total + order.price;
                }, 0);
                incomeData.push({
                    date: new Date().getFullYear() - i,
                    value: totalToday,
                });
            }
            const date = new Date();
            const firstDay = new Date(date.getFullYear(), 1, 1);
            const orderscustom = orders.filter((order) => {
                // lấy giá trị thứ 2 tuần sau
                // const mondaynext = new Date(date.setDate(diff + 14));
                // console.log('mondaylast', mondaylast, sundaylast, mondaynext);
                // in ra những đơn hàng trong tuần trước
                return (
                    formatDateToString(new Date(order.date)) >= formatDateToString(firstDay) &&
                    formatDateToString(new Date(order.date)) <= formatDateToString(today)
                );
            });
            const totalToday = orderscustom.reduce((total, order) => {
                return total + order.price;
            }, 0);
            incomeData.push({
                date: new Date().getFullYear(),
                value: totalToday,
            });
            console.log('incomeData', incomeData);
            setDataIncomes(incomeData);
        }
    }, [optionSelected]);

    return (
        <div className={cx('wrapper')}>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Modal
                title="Vui lòng nhập mã SupperAdmin để quản lý người dùng!"
                open={show}
                onOk={handleCheckCode}
                onCancel={handleCancelCheck}
            >
                <Input value={superAdminCode} type="text" onChange={(e) => handleChangeCode(e)} />
            </Modal>
            <Backdrop sx={{ color: '#fff', zIndex: 10000 }} open={loading}>
                <CircularProgress color="error" />
            </Backdrop>
            <Dialog open={showDialog}>
                <div className={cx('dialog')}>
                    <p className={cx('btn_close')} onClick={handleCloseEdit}>
                        <CloseOutlinedIcon className={cx('btn_icon')} />
                    </p>
                    <h3 className={cx('dialog_title', 'font-[500]')}>Chỉnh sửa thông tin tài khoản</h3>
                    <form onSubmit={handleSubmit(handleSave)} className={cx('dialog_content')}>
                        <div className={cx('left')}>
                            <div className={cx('images')}>
                                <img src={avatar.preview ? avatar.preview : user?.images} alt="Avatar" />
                                <div className={cx('btn_channge')}>
                                    <label for="image">Sửa</label>
                                    <input type="file" id="image" onChange={(e) => handlePreview(e)} />
                                </div>
                            </div>
                        </div>
                        <div className={cx('right')}>
                            <div
                                className={
                                    errors.fullName
                                        ? cx('form_group', 'error')
                                        : errors.fullName
                                            ? cx('form_group', 'error')
                                            : cx('form_group')
                                }
                            >
                                <p className={cx('label')}>Tên</p>
                                <input
                                    {...nameController.field}
                                    onBlur={nameController.field.onBlur}
                                    type="text"
                                    placeholder="Nhập tên"
                                />
                                <p className={cx('error_message')}>{errors?.fullName?.message}</p>
                            </div>

                            <div className={errors.phoneNumber ? cx('form_group', 'error') : cx('form_group')}>
                                <p className={cx('label')}>Số điện thoại</p>
                                <input
                                    {...phoneController.field}
                                    onBlur={phoneController.field.onBlur}
                                    type="text"
                                    placeholder="Gồm 10 số"
                                />
                                <p className={cx('error_message')}>{errors?.phoneNumber?.message}</p>
                            </div>

                            <div className={errors.address ? cx('form_group', 'error') : cx('form_group')}>
                                <p className={cx('label')}>Địa chỉ</p>
                                <input
                                    {...addressController.field}
                                    onBlur={addressController.field.onBlur}
                                    type="text"
                                    placeholder="Nhập địa chỉ"
                                />
                                <p className={cx('error_message')}>{errors?.address?.message}</p>
                            </div>

                            <p className={cx('btn_edit')}>
                                <CustomButton primary disabled={!ischanged} type="submit">
                                    Lưu thay đổi
                                </CustomButton>
                            </p>
                        </div>
                    </form>
                </div>
            </Dialog>
            <div className={cx('top')}>
                <div className={cx('infomation')}>
                    <p
                        className={cx('btnEdit')}
                        onClick={() => {
                            data?.isSuperAdmin ? handleClickEdit() : setShow(true);
                        }}
                    >
                        Chỉnh sửa
                    </p>
                    <h3 className={cx('title')}>Thông tin người dùng</h3>
                    <div className={cx('content')}>
                        <img className={cx('avatar')} src={user?.images} alt="Avatar" />
                        <div className={cx('description')}>
                            <h3 className={cx('name')}>{user?.fullName}</h3>
                            <p className={cx('info_other')}>Email: {user?.email}</p>
                            <p className={cx('info_other')}>Số điện thoại: {user?.phoneNumber}</p>
                            <p className={cx('info_other')}>Địa chỉ: {user?.address}</p>
                        </div>
                    </div>
                </div>

                <div className={cx('pending')}>
                    <div className={cx('heading')}>
                        <h3 className={cx('title')}>Chi tiêu</h3>
                        <DropMenu
                            options={options}
                            setOptionSelected={setOptionSelected}
                            optionSelected={optionSelected}
                            size={'small'}
                        />
                    </div>
                    <IncomeChart data={dataIncomes} size={3 / 1} />
                </div>
            </div>
            <div className={cx('bottom')}>
                <EnhancedTable columns={columns} rows={orders} />
            </div>
        </div>
    );
}

export default UserDetail;
