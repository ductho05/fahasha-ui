import { useState, useEffect } from "react"
import classNames from "classnames/bind"
import styles from './Users.module.scss'
import EnhancedTable from "../../components/Table/EnhancedTable"
import { api, appPath, lockImage, superAdmin, unLockImage } from '../../../constants'
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
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { CircularProgress, Backdrop } from "@mui/material"
import { Input, Form, Skeleton, DatePicker, Popconfirm, Modal, message, Tooltip, Button } from 'antd';
import { getAuthInstance } from "../../../utils/axiosConfig"
import { useData } from "../../../stores/DataContext"
import { useNavigate } from "react-router-dom"
import { LockOutlined, SendOutlined, UnlockOutlined } from "@ant-design/icons"

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

    const navigate = useNavigate()
    const [rows, setRows] = useState([])
    const [avatar, setAvatar] = useState()
    const [showDialog, setShowDialog] = useState(false)
    const [birth, setBirth] = useState()
    const [loading, setLoading] = useState(false)
    const [isAction, setIsAction] = useState(false)
    const [gender, setGender] = useState()
    const [isInsert, setIsInsert] = useState(false)
    const { data, setData } = useData()
    const [isSuperAdmin, setIsSuperAdmin] = useState(false)
    const [superAdminCode, setSuperAdminCode] = useState("superadmin1811")
    const [showFormLockAccount, setShowFormLockAccount] = useState(false)
    const [userLock, setUserLock] = useState({})
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
            field: 'isLock',
            headerName: 'Trạng thái',
            width: 120,
            renderCell: (params) => <p className={`${params ? params.value === true ? "text-red-500" : "text-green-500" : "text-green-500"}`}>{params ? params.value === true ? "Tạm khóa" : "Hoạt động" : "Hoạt động"}</p>
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

                const handleLockUnLock = () => {

                    let isLock = true;
                    if (params.row.hasOwnProperty('isLock') && params.row.isLock === true) {
                        isLock = false;
                    }
                    setShowFormLockAccount(true)
                    setUserLock({
                        id: params.row._id,
                        email: params.row.email,
                        isLock
                    })
                }

                return <div style={{ display: 'flex' }} onClick={handleOnCLick}>
                    <Tooltip title={
                        params.row.hasOwnProperty('isLock') ? params.row.isLock === true
                            ? "Mở khóa"
                            : "Khóa tài khoản"
                            : "Khóa tài khoản"
                    }>
                        <Button onClick={handleLockUnLock} className="mr-[20px]" icon={
                            params.row.hasOwnProperty('isLock') ? params.row.isLock === true
                                ? <UnlockOutlined />
                                : <LockOutlined />
                                : <LockOutlined />

                        } danger
                        />
                    </Tooltip>
                    <Link to={`/admin/user/${params.value}`}>
                        <View />
                    </Link>
                </div>
            }
        },
    ]

    useEffect(() => {

        setRows(data.users)
    }, [data])

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

    const onFinish = async (data) => {
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
        await authInstance.post(`/users/insert`, formData)
            .then(result => {
                if (result.data.status === 'OK') {
                    setIsAction(prev => !prev)
                    toast.success("Thêm mới tài khoản thành công!")
                    fetchUsers()
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

    const handleChangeCode = (e) => {

        setSuperAdminCode(e.target.value)
    }

    const handleCheckCode = () => {

        if (superAdminCode === superAdmin) {

            setIsSuperAdmin(true)
            localStorage.setItem("spc", true)
            message.success("Xác nhận thành công!")
        } else {

            message.error(`Mã super admin sai!`)
        }
    }

    const handleCancelCheck = () => {

        navigate("/admin")
    }

    const handleUpdateData = (user) => {

        console.log(user)
        const newListUser = data.users?.map(u => {
            if (u._id === user._id) {
                return { ...user }
            } else return u
        })
        console.log(newListUser)

        setData({ ...data, users: newListUser })
    }

    const onLock = async (value) => {

        setLoading(true)
        await authInstance.put(`/users/update/${userLock.id}`, {
            isLock: userLock.isLock
        })
            .then(async (result) => {
                if (result.data.status === 'OK') {

                    handleUpdateData(result.data.data)
                    const image = userLock.isLock ? lockImage : unLockImage
                    await authInstance.post(`/webpush/send`, {
                        filter: "personal",
                        notification: {
                            ...value,
                            user: userLock.id,
                            url: `${appPath}/account/0`,
                            image
                        }
                    })
                        .then(result => {

                        })
                        .catch((err) => {
                            console.log(err)
                        })
                    toast.success('Cập nhật thành công!')
                    setShowFormLockAccount(false)
                }
                setLoading(false)
            })
            .catch((err) => {
                toast.error(err.message);
                setLoading(false)
                console.log(err)
            });
    }

    return (
        <div className={cx('wrapper')}>
            <Modal
                title="Vui lòng nhập mã SupperAdmin để quản lý người dùng!"
                open={!isSuperAdmin}
                onOk={handleCheckCode}
                onCancel={handleCancelCheck}
            >
                <Input value={superAdminCode} type="text" onChange={(e) => handleChangeCode(e)} />
            </Modal>
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
                open={loading}
            >
                {<CircularProgress color="error" />}
            </Backdrop>
            <Dialog
                open={showFormLockAccount}
                onClose={() => setShowFormLockAccount(false)}
            >
                <div className="px-[20px] pt-[30px] w-[35vw]">
                    <Form
                        labelCol={{
                            span: 5,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                        style={{
                            maxWidth: "100%",
                        }}
                        onFinish={onLock}
                        autoComplete="off"
                    >
                        {
                            <Form.Item
                                initialValue={userLock.email}
                                label="Gửi đến"
                                name="user"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Nội dung này không được để trống!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        }
                        <Form.Item
                            initialValue={"Thông báo tài khoản"}
                            label="Tiêu đề"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            initialValue={`${userLock.hasOwnProperty("isLock") ? userLock.isLock === false ? "Tài khoản của bạn đã được mở khóa. Quý khách có thể mua hàng trở lại!" : "Hệ thống xác nhận gần đây bạn hủy quá nhiều đơn hàng. Tài khoản của bạn sẽ bị tạm khóa cho đến khi được mở lại" : "Hệ thống xác nhận gần đây bạn hủy quá nhiều đơn hàng. Tài khoản của bạn sẽ bị tạm khóa cho đến khi được mở lại"}`}
                            label="Mô tả"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống!',
                                },
                            ]}
                        >
                            <Input.TextArea rows={5} />
                        </Form.Item>

                        <Form.Item
                        >
                            <Button htmlType="submit" icon={<SendOutlined />}>
                                Gửi
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Dialog>

            <div className={cx('heading')}>
                <h3>Quản lý tài khoản</h3>
                <p onClick={handleShowDialog} className={cx('btn_add_new')}>
                    <AddCircleOutlineOutlinedIcon className={cx('btn_icon')} />
                    <span>Thêm mới</span>
                </p>
            </div>
            {
                isSuperAdmin &&
                <EnhancedTable columns={columns} rows={rows} />
            }
        </div>
    )
}

export default Users
