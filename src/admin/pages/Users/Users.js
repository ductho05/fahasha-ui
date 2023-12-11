import { useState, useEffect } from "react"
import classNames from "classnames/bind"
import styles from './Users.module.scss'
import EnhancedTable from "../../components/Table/EnhancedTable"
import { api } from '../../../constants'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Delete, View } from '../../components/Button/Button';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import { Dialog } from "@mui/material"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DropMenu from "../../../components/DropMenu"
import Button from "../../../components/Button"
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { CircularProgress, Backdrop } from "@mui/material"
import { Input, Form, Skeleton, DatePicker, Popconfirm } from 'antd';
import { getAuthInstance } from "../../../utils/axiosConfig"

const cx = classNames.bind(styles)

const options = [
    {
        title: 'Quản lý',
        value: true,
        type: ''
    },
    {
        title: 'Khách hàng',
        value: false,
        type: ''
    }
]

function Users() {

    const authInstance = getAuthInstance()

    const [rows, setRows] = useState([])
    const [avatar, setAvatar] = useState()
    const [showDialog, setShowDialog] = useState(false)
    const [birth, setBirth] = useState()
    const [loadingUsers, setLoadingUsers] = useState(false)
    const [isAction, setIsAction] = useState(false)
    const [gender, setGender] = useState()
    const [isInsert, setIsInsert] = useState(false)
    const [role, setRole] = useState({
        title: '-- Chọn --',
        value: '',
        type: ''
    })

    const columns = [
        {
            field: 'images',
            headerName: 'Images',
            sortable: false,
            editable: true,
            renderCell: (params) => <img className={cx('image')} src={params.value} />
        },
        {
            field: 'fullName',
            headerName: 'Tên đầy đủ',
            width: 160,
            sortable: false,
            renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : "Trống"}</p>
        },
        {
            field: 'birth',
            headerName: 'Ngày sinh',
            width: 160,
            renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : "Trống"}</p>
        },
        {
            field: 'email',
            headerName: 'Email',
            sortable: false,
            width: 280,
            renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : "Trống"}</p>
        },
        {
            field: 'isManager',
            headerName: 'Chức vụ',
            width: 120,
            renderCell: (params) => <p className={params.value ? cx('ismanager', 'manager') : cx('ismanager', 'customer')}>{params.value ? "Quản lý" : "Khách hàng"}</p>
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

                const handleDelete = () => {
                    setIsInsert(true)
                    authInstance.delete(`/users/delete/${params.value}`)
                        .then(result => {
                            if (result.data.status === 'OK') {
                                setIsAction(prev => !prev)
                                toast.success('Xóa thành công!')
                            } else {
                                toast.error(result.message)
                            }
                            setIsInsert(false)
                        })
                        .catch(err => {
                            toast.error(err.message)
                            setIsInsert(false)
                        })
                }

                return <div style={{ display: 'flex' }} onClick={handleOnCLick}>
                    <Popconfirm
                        title="Xác nhận?"
                        description="Tài khoản sẽ bị xóa khỏi hệ thống"
                        onConfirm={handleDelete}
                        onCancel={() => { }}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <p>
                            <Delete />
                        </p>
                    </Popconfirm>
                    <Link to={`/admin/user/${params.value}`}>
                        <View />
                    </Link>
                </div>
            }
        },
    ];

    useEffect(() => {
        setLoadingUsers(true)
        authInstance.get(`/users`)
            .then(result => {
                setLoadingUsers(false)
                setRows(result.data.data)
            })
            .catch(err => {
                setLoadingUsers(false)
                console.log(err)
            })
    }, [isAction])

    useEffect(() => {
        return () => {
            avatar && URL.revokeObjectURL(avatar.preview)
        }
    }, [avatar]);

    const handleChooseImage = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0]
            file.preview = URL.createObjectURL(file)

            setAvatar(file)
        }
    }

    const handleChangeGender = (gender) => {
        setGender(gender)
    }

    const onFinish = (data) => {
        const formData = new FormData()
        Object.keys(data).forEach(key => {
            formData.append(key, data[key])
        })
        if (avatar) {
            formData.append('images', avatar)
        }
        if (role.value !== '') {
            formData.append('isManager', role.value)
        }
        if (birth) {
            formData.append('birth', birth)
        }
        if (gender) {
            formData.append('gender', gender)
        }
        setIsInsert(true)
        authInstance.post(`/users/insert`, formData)
            .then(result => {
                if (result.data.status === 'OK') {
                    setIsAction(prev => !prev)
                    toast.success("Thêm mới tài khoản thành công!")
                } else {
                    toast.error(`${result.data.message}`)
                }
                setShowDialog(false)
                setIsInsert(false)
            })
            .catch(err => {
                setShowDialog(false)
                setIsInsert(false)
                toast.error(`${err?.response?.data?.message}`)
            })
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const changeDate = (date, dateString) => {
        setBirth(dateString)
    }

    const handleShowDialog = () => {
        if (avatar) {
            URL.revokeObjectURL(avatar.preview)
            setAvatar()
        }
        setRole({
            title: '-- Chọn --',
            value: '',
            type: ''
        })
        setShowDialog(true)
        setGender()
    }

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
            <Dialog
                open={showDialog}
            >
                <div className={cx("dialog_add_user")}>
                    <p className={cx('btn_close')} onClick={() => setShowDialog(false)}>
                        <CloseOutlinedIcon className={cx('btn_icon')} />
                    </p>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 5,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Tên"
                            name="fullName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống',
                                },
                            ]}
                        >
                            <Input placeholder='Nhập tên tài khoản' />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống',
                                },
                                {
                                    pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                    message: 'Email không đúng định dạng. Vui lòng nhập lại',
                                }
                            ]}
                        >
                            <Input placeholder='Nhập email' />
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name="phoneNumber"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống',
                                },
                            ]}
                        >
                            <Input placeholder='Nhập số điện thoại' />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống',
                                },
                                {
                                    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                                    message: "Vui lòng nhập: trên 8 ký tự. Chứa 0-9, a-z, A-Z và 1 ký tự đặc biệt"
                                }
                            ]}
                        >
                            <Input.Password placeholder='Nhập mật khẩu' />
                        </Form.Item>

                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống',
                                },
                            ]}
                        >
                            <Input placeholder='Nhập địa chỉ' />
                        </Form.Item>

                        <Form.Item
                            label="Tỉnh/Thành phố"
                            name="city"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống',
                                },
                            ]}
                        >
                            <Input placeholder='Nhập tỉnh/thành phố' />
                        </Form.Item>
                        <div className="flex items-center mb-[20px]">
                            <p className={cx('label')}>Ngày sinh: </p>
                            <div className="flex flex-[20] justify-start ml-[6px]">
                                <DatePicker
                                    onChange={changeDate}
                                />
                            </div>
                        </div>
                        <div className="flex items-center mb-[20px]">
                            <p className={cx('label')}>Giới tính: </p>
                            <div className="flex flex-[20] justify-start ml-[6px]">
                                <div className={cx('form_radio')}>
                                    <div className={cx('radio')}>
                                        <input
                                            id='radio'
                                            type="radio"
                                            checked={gender == 'male'}
                                            onChange={() => handleChangeGender('male')}
                                        />
                                        <label for='radio'>Nam</label>
                                    </div>

                                    <div className={cx('radio')}>
                                        <input
                                            id='radio_female'
                                            type="radio"
                                            checked={gender == 'female'}
                                            onChange={() => handleChangeGender('female')}
                                        />
                                        <label for='radio_female'>Nữ</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center mb-[20px]">
                            <p className={cx('label')}>Chức vụ: </p>
                            <div className="flex flex-[20] justify-start ml-[6px]">
                                <DropMenu
                                    options={options}
                                    size="big"
                                    optionSelected={role}
                                    setOptionSelected={setRole}
                                />
                            </div>
                        </div>
                        <div className="flex items-center mb-[20px]">
                            <p className={cx('label')}>Ảnh đại diện: </p>
                            <div className="flex flex-[20] justify-start ml-[6px]">
                                <div className={cx('avatar')}>
                                    <p className={cx('edit_avatar')}>
                                        <label for="image">
                                            <AccountCircleIcon className={cx('icon')} />
                                            Chọn
                                        </label>
                                        <input type="file" id='image' name='image' onChange={(e) => handleChooseImage(e)} />
                                    </p>
                                    {
                                        avatar && <img src={avatar.preview} />
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={cx('buttons')}>
                            <p htmlType="submit">
                                <Button primary>Thêm</Button>
                            </p>
                        </div>
                    </Form>
                </div>
            </Dialog>
            <Backdrop
                sx={{ color: '#fff', zIndex: 10000 }}
                open={isInsert}
            >
                {isInsert && <CircularProgress color="error" />}
            </Backdrop>
            <div className={cx('heading')}>
                <h3>Quản lý tài khoản</h3>
                <p onClick={handleShowDialog} className={cx('btn_add_new')}>
                    <AddCircleOutlineOutlinedIcon className={cx('btn_icon')} />
                    <span>Thêm mới</span>
                </p>
            </div>
            {
                loadingUsers &&
                <div>
                    <LinearProgress />
                </div>
            }
            {
                loadingUsers === false ? <div className={cx('table')}>
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

export default Users
