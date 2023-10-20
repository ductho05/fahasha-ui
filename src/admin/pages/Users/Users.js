import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Users.module.scss';
import EnhancedTable from '../../components/Table/EnhancedTable';
import { api } from '../../../constants';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Delete, View } from '../../components/Button/Button';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import { Dialog, TextField, InputAdornment } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DropMenu from '../../../components/DropMenu';
import Button from '../../../components/Button';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useForm } from 'react-hook-form';

const cx = classNames.bind(styles);

const columns = [
    {
        field: 'images',
        headerName: 'Images',
        sortable: false,
        editable: true,
        renderCell: (params) => <img className={cx('image')} src={params.value} />,
    },
    {
        field: 'fullName',
        headerName: 'Tên đầy đủ',
        width: 160,
        sortable: false,
        renderCell: (params) => (
            <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : 'Trống'}</p>
        ),
    },
    {
        field: 'birth',
        headerName: 'Ngày sinh',
        width: 160,
        renderCell: (params) => (
            <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : 'Trống'}</p>
        ),
    },
    {
        field: 'email',
        headerName: 'Email',
        sortable: false,
        width: 280,
        renderCell: (params) => (
            <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : 'Trống'}</p>
        ),
    },
    {
        field: 'isManager',
        headerName: 'Chức vụ',
        width: 120,
        renderCell: (params) => (
            <p className={params.value ? cx('ismanager', 'manager') : cx('ismanager', 'customer')}>
                {params.value ? 'Quản lý' : 'Khách hàng'}
            </p>
        ),
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
            };

            const handleDelete = () => {
                fetch(`${api}/users/delete/${params.value}`, {
                    method: 'DELETE',
                })
                    .then((response) => response.json())
                    .then((result) => {
                        if (result.status === 'OK') {
                            toast.success('Xóa thành công!');
                        } else {
                            toast.error(result.message);
                        }
                    })
                    .catch((err) => {
                        toast.error(err.message);
                    });
            };

            return (
                <div style={{ display: 'flex' }} onClick={handleOnCLick}>
                    <p
                        onClick={() => {
                            confirmAlert({
                                title: 'Xác nhận xóa?',
                                message: 'Nội dung này sẽ bị xóa khỏi hệ thống!',
                                buttons: [
                                    {
                                        label: 'Đồng ý',
                                        onClick: () => {
                                            handleDelete();
                                        },
                                    },
                                    {
                                        label: 'Hủy',
                                        onClick: () => {},
                                    },
                                ],
                            });
                        }}
                    >
                        <Delete />
                    </p>
                    <Link to={`/admin/user/${params.row._id}`}>
                        <View />
                    </Link>
                </div>
            );
        },
    },
];

const options = [
    {
        title: 'Quản lý',
        value: true,
        type: '',
    },
    {
        title: 'Khách hàng',
        value: false,
        type: '',
    },
];

function Users() {
    const [rows, setRows] = useState([]);
    const [avatar, setAvatar] = useState();
    const [showDialog, setShowDialog] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState({
        title: '-- Chọn --',
        value: '',
        type: '',
    });

    const { register, handleSubmit, watch, reset } = useForm();

    useEffect(() => {
        fetch(`${api}/users`)
            .then((response) => response.json())
            .then((result) => {
                setRows(result.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [rows]);

    useEffect(() => {
        return () => {
            avatar && URL.revokeObjectURL(avatar.preview);
        };
    }, [avatar]);

    const handleChooseImage = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            file.preview = URL.createObjectURL(file);

            setAvatar(file);
        }
    };

    const onSubmit = (data) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });
        if (Object.keys(avatar).length > 0) {
            formData.append('images', avatar);
        }
        if (role.value !== '') {
            formData.append('isManager', role.value);
        }
        fetch(`${api}/users/insert`, {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 'OK') {
                    setShowDialog(false);
                    toast.success('Thêm mới tài khoản thành công!');
                } else {
                    setShowDialog(false);
                    toast.success(`Error! ${result.message}`);
                }
            })
            .catch((err) => {
                setShowDialog(false);
                toast.success(`Error! ${err.message}`);
            });
    };

    const handleShowDialog = () => {
        reset();
        if (avatar) {
            URL.revokeObjectURL(avatar.preview);
            setAvatar();
        }
        setRole({
            title: '-- Chọn --',
            value: '',
            type: '',
        });
        setShowDialog(true);
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
            <Dialog open={showDialog}>
                <form onSubmit={handleSubmit(onSubmit)} className={cx('dialog_add_user')}>
                    <p className={cx('btn_close')} onClick={() => setShowDialog(false)}>
                        <CloseOutlinedIcon className={cx('btn_icon')} />
                    </p>
                    <h1 className={cx('dialog_title')}>Thêm mới tài khoản</h1>
                    <p className={cx('label')}>Tên tài khoản</p>
                    <TextField
                        {...register('fullName')}
                        fullWidth
                        placeholder="Nhập tên tài khoản"
                        size="medium"
                        style={{
                            outline: 'none',
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                border: '1px solid #1363DF',
                                borderRadius: '4px',
                                padding: '0',
                                height: '40px',
                            },
                            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                            '& .MuiInputBase-input': {
                                backgroundColor: 'transparent',
                            },
                        }}
                        InputProps={{
                            style: {
                                color: '#333',
                                fontSize: '14px',
                                marginBottom: '16px',
                                backgroundColor: '#fff',
                            },
                        }}
                    />
                    <p className={cx('label')}>Email</p>
                    <TextField
                        {...register('email')}
                        fullWidth
                        placeholder="Nhập email"
                        size="medium"
                        style={{
                            outline: 'none',
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                border: '1px solid #1363DF',
                                borderRadius: '4px',
                                padding: '0',
                                height: '40px',
                            },
                            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                            '& .MuiInputBase-input': {
                                backgroundColor: 'transparent',
                            },
                        }}
                        InputProps={{
                            style: {
                                color: '#333',
                                fontSize: '14px',
                                marginBottom: '16px',
                                backgroundColor: '#fff',
                            },
                        }}
                    />
                    <p className={cx('label')}>Số điện thoại</p>
                    <TextField
                        {...register('phoneNumber')}
                        fullWidth
                        placeholder="Nhập số điện thoại"
                        size="medium"
                        style={{
                            outline: 'none',
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                border: '1px solid #1363DF',
                                borderRadius: '4px',
                                padding: '0',
                                height: '40px',
                            },
                            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                            '& .MuiInputBase-input': {
                                backgroundColor: 'transparent',
                            },
                        }}
                        InputProps={{
                            style: {
                                color: '#333',
                                fontSize: '14px',
                                marginBottom: '16px',
                                backgroundColor: '#fff',
                            },
                        }}
                    />
                    <p className={cx('label')}>Mật khẩu</p>
                    <TextField
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        placeholder="Nhập mật khẩu"
                        size="medium"
                        style={{
                            outline: 'none',
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                border: '1px solid #1363DF',
                                borderRadius: '4px',
                                padding: '0',
                                height: '40px',
                            },
                            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                        }}
                        InputProps={{
                            style: {
                                color: '#333',
                                fontSize: '14px',
                                marginBottom: '16px',
                                backgroundColor: '#fff',
                            },
                            endAdornment: (
                                <InputAdornment
                                    position="end"
                                    className={
                                        watch('password') === '' || !watch('password') ? cx('hidden') : cx('visible')
                                    }
                                >
                                    {showPassword ? (
                                        <VisibilityOutlinedIcon
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className={cx('icon_password')}
                                        />
                                    ) : (
                                        <VisibilityOffOutlinedIcon
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className={cx('icon_password')}
                                        />
                                    )}
                                </InputAdornment>
                            ),
                        }}
                    />
                    <p className={cx('label')}>Địa chỉ</p>
                    <TextField
                        {...register('address')}
                        fullWidth
                        placeholder="Nhập địa chỉ"
                        size="medium"
                        style={{
                            outline: 'none',
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                border: '1px solid #1363DF',
                                borderRadius: '4px',
                                padding: '0',
                                height: '40px',
                            },
                            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                            '& .MuiInputBase-input': {
                                backgroundColor: 'transparent',
                            },
                        }}
                        InputProps={{
                            style: {
                                color: '#333',
                                fontSize: '14px',
                                marginBottom: '16px',
                                backgroundColor: '#fff',
                            },
                        }}
                    />
                    <p className={cx('label')}>Giới tính</p>
                    <div className={cx('form_radio')}>
                        <div className={cx('radio')}>
                            <input
                                id="radio"
                                type="radio"
                                // checked={user.gender == 'male'}
                                // onChange={() => handleChangeGender('male')}
                            />
                            <label for="radio">Nam</label>
                        </div>

                        <div className={cx('radio')}>
                            <input
                                id="radio_female"
                                type="radio"
                                // checked={user.gender == 'female'}
                                // onChange={() => handleChangeGender('female')}
                            />
                            <label for="radio_female">Nữ</label>
                        </div>
                    </div>
                    <p className={cx('label')}>Chức vụ</p>
                    <DropMenu options={options} size="big" optionSelected={role} setOptionSelected={setRole} />
                    <p className={cx('label')}></p>
                    <p className={cx('label')}>Ảnh đại diện</p>
                    <div className={cx('avatar')}>
                        <p className={cx('edit_avatar')}>
                            <label for="image">
                                <AccountCircleIcon className={cx('icon')} />
                                Chọn
                            </label>
                            <input type="file" id="image" name="image" onChange={(e) => handleChooseImage(e)} />
                        </p>
                        {avatar && <img src={avatar.preview} />}
                    </div>

                    <div className={cx('buttons')}>
                        <p>
                            <Button primary>Thêm</Button>
                        </p>
                    </div>
                </form>
            </Dialog>
            <div className={cx('heading')}>
                <h3>Quản lý tài khoản</h3>
                <p onClick={handleShowDialog} className={cx('btn_add_new')}>
                    <AddCircleOutlineOutlinedIcon className={cx('btn_icon')} />
                    <span>Thêm mới</span>
                </p>
            </div>
            {rows.length <= 0 && (
                <div>
                    <LinearProgress />
                </div>
            )}
            <div className={cx('table')}>
                <EnhancedTable columns={columns} rows={rows} />
            </div>
        </div>
    );
}

export default Users;
