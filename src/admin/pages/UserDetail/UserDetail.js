import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './UserDetail.module.scss';
import IncomeChart from '../../components/charts/IncomeChart/IncomeChart';
import DropMenu from '../../../components/DropMenu';
import OrdersLatesTable from '../../components/OrdersLatesTable/OrdersLatesTable';
import { Backdrop, CircularProgress, Dialog } from '@mui/material';
import Button from '../../../components/Button';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useForm, useController } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { api } from '../../../constants';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuthInstance } from '../../../utils/axiosConfig';
import { useData } from '../../../stores/DataContext';

const cx = classNames.bind(styles);
const dataIncomes = [
    {
        date: '31/7/2023',
        value: 340,
    },
    {
        date: '1/8/2023',
        value: 500,
    },
    {
        date: '2/8/2023',
        value: 400,
    },
    {
        date: '3/8/2023',
        value: 900,
    },
    {
        date: '4/8/2023',
        value: 700,
    },
    {
        date: '5/8/2023',
        value: 990,
    },
];

const options = [
    {
        title: '6 ngày gần nhất',
        value: 'createdAt',
        type: 'desc',
    },
    {
        title: '6 tuần gần nhất',
        value: 'createdAt',
        type: 'desc',
    },
    {
        title: '6 tháng gần nhất',
        value: 'createdAt',
        type: 'desc',
    },
    {
        title: '6 năm gần nhất',
        value: 'createdAt',
        type: 'desc',
    },
];

function UserDetail() {

    const authInstance = getAuthInstance()

    const { userId } = useParams();
    const [user, setUser] = useState({});
    const [optionSelected, setOptionSelected] = useState(options[0]);
    const [showDialog, setShowDialog] = useState(false);
    const [avatar, setAvatar] = useState({});
    const [orders, setOrders] = useState([]);
    const [ischanged, setIsChanged] = useState(false)
    const [loading, setLoading] = useState(false)
    const { data, setData } = useData()

    const handleClickEdit = () => {
        setShowDialog(true);
        setValue('fullName', user.fullName);
        setValue('email', user.email);
        setValue('phoneNumber', user.phoneNumber);
        setValue('address', user.address);
    }

    const handleCloseEdit = () => {
        clearErrors();
        setAvatar({});
        setShowDialog(false);
    }

    const fetchUsers = () => {

        authInstance.get(`/users`)
            .then(result => {
                setData({ ...data, users: result.data.data })
            })
            .catch(err => {

                console.log(err)
            })
    }

    useEffect(() => {
        authInstance.get(`/users/${userId}`)
            .then((result) => {
                if (result.data.status === 'OK') {
                    setUser(result.data.data);
                }
            })
            .catch((err) => console.error(err.message));
    }, [user]);

    useEffect(() => {
        authInstance.post(`/orders/filter?page=1&limit=5&status=HOANTHANH&user=${userId}`)
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
    });

    const emailController = useController({
        name: 'email',
        control,
        rules: {
            pattern: {
                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Email không đúng định dạng',
            },
        },
    });

    const phoneController = useController({
        name: 'phoneNumber',
        control,
    });

    const addressController = useController({
        name: 'address',
        control,
    });


    useEffect(() => {

        if (watch("fullName") != user.fullName || watch("email") != user.email ||
            watch("phoneNumber") != user.phoneNumber || watch("address") != user.address || Object.keys(avatar).length > 0) {
            setIsChanged(true)
        } else {
            setIsChanged(false)
        }

    }, [watch(), avatar])

    const handleSave = async (data) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });
        if (Object.keys(avatar).length > 0) {
            formData.append('images', avatar);
        }

        setLoading(true)
        await authInstance.put(`/users/update/${userId}`, formData)
            .then((result) => {
                if (result.data.status === 'OK') {
                    setUser(result.data.data)
                    toast.success('Cập nhật thành công!');
                    fetchUsers()
                } else {
                    toast.error('Thất bại! Có lỗi xảy ra');
                }
                setShowDialog(false);
                setLoading(false)
            })
            .catch((err) => {
                setShowDialog(false);
                setLoading(false)
                toast.error(err.message);
                console.error(err)
            });
    };

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
                sx={{ color: '#fff', zIndex: 10000 }}
                open={loading}
            >
                <CircularProgress color="error" />
            </Backdrop>
            <Dialog open={showDialog}>
                <div className={cx('dialog')}>
                    <p className={cx('btn_close')} onClick={handleCloseEdit}>
                        <CloseOutlinedIcon className={cx('btn_icon')} />
                    </p>
                    <h3 className={cx('dialog_title', "font-[500]")}>Chỉnh sửa thông tin tài khoản</h3>
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

                            <div className={errors.email ? cx('form_group', 'error') : cx('form_group')}>
                                <p className={cx('label')}>Email</p>
                                <input
                                    {...emailController.field}
                                    onBlur={emailController.field.onBlur}
                                    type="text"
                                    placeholder="Nhập email"
                                />
                                <p className={cx('error_message')}>{errors?.email?.message}</p>
                            </div>

                            <div className={errors.phone ? cx('form_group', 'error') : cx('form_group')}>
                                <p className={cx('label')}>Số điện thoại</p>
                                <input
                                    {...phoneController.field}
                                    onBlur={phoneController.field.onBlur}
                                    type="text"
                                    placeholder="Gồm 10 số"
                                />
                                <p className={cx('error_message')}>{errors?.phone?.message}</p>
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
                                <Button disabled={!ischanged} primary>Lưu thay đổi</Button>
                            </p>
                        </div>
                    </form>
                </div>
            </Dialog>
            <div className={cx('top')}>
                <div className={cx('infomation')}>
                    <p className={cx('btnEdit')} onClick={handleClickEdit}>
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
                <OrdersLatesTable rows={orders} />
            </div>
        </div>
    );
}

export default UserDetail;
