import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Users.module.scss';
import EnhancedTable from '../../components/Table/EnhancedTable';
import { api, appPath, lockImage, superAdmin, unLockImage } from '../../../constants';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Delete, View } from '../../components/Button/Button';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast, ToastContainer } from 'react-toastify';
import { useSuperAdmin } from '../../../stores/hooks';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import { Dialog } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DropMenu from '../../../components/DropMenu';
import axios from 'axios';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { CircularProgress, Backdrop } from '@mui/material';
import {
    Input,
    Form,
    Skeleton,
    DatePicker,
    Popconfirm,
    Modal,
    Rate,
    Button,
    message,
    Tooltip,
    Select,
    Checkbox,
    Col,
    Row,
} from 'antd';
import { getAuthInstance } from '../../../utils/axiosConfig';
import { useData } from '../../../stores/DataContext';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, SendOutlined, FilterOutlined, UnlockOutlined, CloseOutlined } from '@ant-design/icons';
import { Wrapper as PopperWrapper } from '../../../components/Popper';

const cx = classNames.bind(styles);

const sortOptions = [
    {
        label: 'Mặc định',
        value: 'default',
    },
    {
        label: 'Lớn tuổi nhất',
        value: 'oldest',
    },
    {
        label: 'Nhỏ tuổi nhất',
        value: 'newest',
    },
];

const roleOption = [
    {
        title: 'Quản lý',
        value: true,
    },
    {
        title: 'Khách hàng',
        value: false,
    },
];

const statusOptions = [
    {
        label: 'Hoạt động',
        value: false,
    },

    {
        label: 'Tạm khóa',
        value: true,
    },
];

const genderOptions = [
    {
        label: 'Nam',
        value: true,
    },

    {
        label: 'Nữ',
        value: false,
    },

    {
        label: 'Khác',
        value: null,
    },
];

function Users() {
    const authInstance = getAuthInstance();
    // const [isSuperAdmin, setIsSuperAdmin] = useState(localStorage.getItem('spc') || false);
    const navigate = useNavigate();
    // const [rows, setRows] = useState([]);
    const [avatar, setAvatar] = useState();
    const [showDialog, setShowDialog] = useState(false);
    const [birth, setBirth] = useState();
    const [loading, setLoading] = useState(false);
    const [isAction, setIsAction] = useState(false);
    const [open, setOpen] = useState(false);
    const [auto, setAuto] = useState(false);
    const [gender, setGender] = useState();
    const [isInsert, setIsInsert] = useState(false);
    const { data, setData } = useData();
    //const [isSuperAdmin, setIsSuperAdmin] = useState(localStorage.getItem('spc') || false);
    const [superAdminCode, setSuperAdminCode] = useState('');
    const [showFormLockAccount, setShowFormLockAccount] = useState(false);
    const [userLock, setUserLock] = useState({});
    const [show, setShow] = useState(false);
    const [role, setRole] = useState({
        title: '-- Chọn --',
        value: '',
        type: '',
    });
    const [newList2, setNewList2] = useState([]);
    const [options, setOptions] = useState([]);
    const [price, setPrice] = useState(null);
    const [rate, setRate] = useState(null);
    const [suggestFlash, setSuggestFlash] = useState([]);
    const [isToggle, setIsToggle] = useState(false); // khi bấm nút tiếp tục thì gọi hàm này để \tắt chọn những sản phẩm đã chọn
    const [rows, setRows] = useState([]);
    const [temporary_data, setTemporary_data] = useState([]); // lưu lại những sản phẩm đã chọn để gợi ý
    const [selectCategory, setSelectCategory] = useState(null);
    const [status, setStatus] = useState(null);
    const [genderfilter, setGenderFilter] = useState(null);
    const [rolefilter, setRoleFilter] = useState(null);
    const [selectSort, setSelectSort] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [keywords, setKeywords] = useState(null);
    const [showProgress, setShowProgress] = useState(false);
    const [isReload, setIsReload] = useState(false);

    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');

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
            field: 'images',
            headerName: 'Images',
            sortable: false,
            editable: true,
            renderCell: (params) => <img className={cx('image')} src={params.value} />,
        },
        {
            field: 'fullName',
            headerName: 'Tên đầy đủ',
            width: 125,
            sortable: false,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : 'Trống'}</p>
            ),
        },
        {
            field: 'city',
            headerName: 'Thành phố',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : 'Trống'}</p>
            ),
        },
        {
            field: 'gender',
            headerName: 'Giới tính',
            width: 80,
            sortable: false,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>
                    {params.value ? (params.value == 'male' ? 'Nam' : 'Nữ') : 'Trống'}
                </p>
            ),
        },
        {
            field: 'birth',
            headerName: 'Ngày sinh',
            width: 80,
            renderCell: (params) => {
                console.log('21369821ghu', params.value);
                return <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : 'Trống'}</p>;
            },
        },
        {
            field: 'email',
            headerName: 'Email',
            sortable: false,
            width: 190,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : 'Trống'}</p>
            ),
        },

        {
            field: 'phoneNumber',
            headerName: 'SDT',
            sortable: false,
            width: 90,
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
            field: 'isLock',
            headerName: 'Trạng thái',
            width: 110,
            renderCell: (params) => (
                <p
                    className={`${
                        params ? (params.value === true ? 'text-red-500' : 'text-green-500') : 'text-green-500'
                    }`}
                >
                    {params ? (params.value === true ? 'Tạm khóa' : 'Hoạt động') : 'Hoạt động'}
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

                const handleLockUnLock = () => {
                    let isLock = true;
                    if (params.row.hasOwnProperty('isLock') && params.row.isLock === true) {
                        isLock = false;
                    }
                    setShowFormLockAccount(true);
                    setUserLock({
                        id: params.row._id,
                        email: params.row.email,
                        isLock,
                    });
                };

                return (
                    <div style={{ display: 'flex' }} onClick={handleOnCLick}>
                        <Tooltip
                            title={
                                params.row.hasOwnProperty('isLock')
                                    ? params.row.isLock === true
                                        ? 'Mở khóa'
                                        : 'Khóa tài khoản'
                                    : 'Khóa tài khoản'
                            }
                        >
                            <Button
                                onClick={() => {
                                    data?.isSuperAdmin ? handleLockUnLock() : setShow(true);
                                }}
                                className="mr-[20px]"
                                icon={
                                    params.row.hasOwnProperty('isLock') ? (
                                        params.row.isLock === true ? (
                                            <UnlockOutlined />
                                        ) : (
                                            <LockOutlined />
                                        )
                                    ) : (
                                        <LockOutlined />
                                    )
                                }
                                danger
                            />
                        </Tooltip>
                        <Link to={`/admin/user/${params.value}`}>
                            <View />
                        </Link>
                    </div>
                );
            },
        },
    ];

    async function getCurrentLocationDetails(latitude, longitude) {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            );

            if (response.status === 200) {
                const data = response.data;

                console.log('data142', data);

                // Trích xuất thông tin về tỉnh, huyện, xã từ dữ liệu trả về
                const address = data.display_name.split(',');
                console.log('Thông tin chi tiết về vị trí hiện tại:');
                console.log('Xã/Phường:', address);
                // setAddress(address[0]);
                // // setWards(address[1]);
                // // setDistrics(address[2]);
                // setCity(address[3]);

                form.setFieldValue('city', address[3]);
                form.setFieldValue('address', address[0] + ', ' + address[1] + ', ' + address[2]);
                // cityController.field.onChange(address[3]);
                // districsController.field.onChange(address[2]);
                // wardsController.field.onChange(address[1]);
                // addressController.field.onChange(address[0]);

                console.log('address1212', address);
            } else {
                console.error('Failed to fetch data from the API');
            }
            setShowProgress(false);
        } catch (error) {
            console.error('Error:', error.message);
            setShowProgress(false);
        }
    }

    const [form] = Form.useForm();

    // useEffect(() => {
    //     form.setFieldValue('city', city);
    //     form.setFieldValue('address', address);
    // }, [city, address]);

    useEffect(() => {
        if (auto) {
            setShowProgress(true);
            if ('geolocation' in navigator) {
                // Lấy vị trí hiện tại của người dùng
                navigator.geolocation.getCurrentPosition(function (position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    // console.log('Vị trí hiện tại của bạn:');
                    // console.log('Latitude:', latitude);
                    // console.log('Longitude:', longitude);
                    getCurrentLocationDetails(latitude, longitude);

                    // set city cho fiels city
                });
            } else {
                console.log('Trình duyệt không hỗ trợ Geolocation.');
            }
        }
    }, [auto, isReload]);

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

    const handleChangeGender = (gender) => {
        setGender(gender);
    };

    const insertData = (user) => {
        setData({ ...data, users: [...data.users, user] });
    };

    const onFinish = async (data) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });
        if (avatar) {
            formData.append('images', avatar);
        }
        if (role.value !== '') {
            formData.append('isManager', role.value);
        }
        if (birth) {
            formData.append('birth', birth);
        }
        if (gender) {
            formData.append('gender', gender);
        }
        setLoading(true);
        await authInstance
            .post(`/users/insert`, formData)
            .then((result) => {
                if (result.data.status === 'OK') {
                    setIsAction((prev) => !prev);
                    toast.success('Thêm mới tài khoản thành công!');
                    // setData({ ...data, users: [...data.users, result.data.data] });
                    insertData(result.data.data);
                    //fetchUsers();
                } else {
                    toast.error(`${result.data.message}`);
                }
                setShowDialog(false);
                setIsInsert(false);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setShowDialog(false);
                setLoading(false);
                toast.error(`${err?.response?.data?.message}`);
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const changeDate = (date, dateString) => {
        console.log(dateString);
        setBirth(dateString);
    };

    const handleShowDialog = () => {
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
        setGender();
    };

    const handleChangeCode = (e) => {
        setSuperAdminCode(e.target.value);
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

    const handleCancelCheck = () => {
        setShow(false);
    };

    const handleUpdateData = (user) => {
        // console.log(user);
        const newListUser = data.users?.map((u) => {
            if (u._id === user._id) {
                return { ...user };
            } else return u;
        });
        // console.log(newListUser);

        setData({ ...data, users: newListUser });
    };

    const onLock = async (value) => {
        setLoading(true);
        await authInstance
            .put(`/users/update/${userLock.id}`, {
                isLock: userLock.isLock,
            })
            .then(async (result) => {
                if (result.data.status === 'OK') {
                    handleUpdateData(result.data.data);
                    const image = userLock.isLock ? lockImage : unLockImage;
                    // await authInstance
                    //     .post(`/webpush/send`, {
                    //         filter: 'personal',
                    //         notification: {
                    //             ...value,
                    //             user: userLock.id,
                    //             url: `${appPath}/account/0`,
                    //             image,
                    //         },
                    //     })
                    //     .then((result) => { })
                    //     .catch((err) => {
                    //         console.log(err);
                    //     });
                    toast.success('Cập nhật thành công!');
                    setShowFormLockAccount(false);
                }
                setLoading(false);
            })
            .catch((err) => {
                toast.error(err.message);
                setLoading(false);
                console.log(err);
            });
    };

    // const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const handleChangeCategory = (value, option) => {
        setSelectCategory(option);
    };

    const handleSortChange = (value, option) => {
        setSelectSort(option);
    };

    const handleRoleChange = (option) => {
        // console.log('option123', option);
        setRoleFilter(option);
    };

    const handleGenderChange = (rateItem) => {
        setGenderFilter(rateItem);
    };

    const handleStatusChange = (option) => {
        setStatus(option);
    };

    const handleShowFilter = () => {
        setShowFilter((prev) => !prev);
    };

    const handleClearFilter = (newList2) => {
        // setPrice(null);
        // setRate(null);
        // setSelectCategory(null);
        console.log('da vo day');
        setGenderFilter(null);
        setRoleFilter(null);
        setStatus(null);
        //  setSelectSort(sortOptions[0]);
        const productsToSort = [...newList2];
        const sortedProducts = productsToSort.sort((a, b) => a.fullName.localeCompare(b.fullName));
        // console.log('newList2sd', sortedProducts);
        setRows(sortedProducts);
    };

    const handleSearch = (value) => {
        setKeywords(value);
    };

    const chuyenDoiNgay = (ddmmyyyy) => {
        // Tách ngày, tháng, năm từ chuỗi đầu vào
        var parts = ddmmyyyy.split('/');
        // Tạo chuỗi mới với định dạng yyyy/mm/dd
        var newFormat = parts[2] + '/' + parts[1] + '/' + parts[0];
        return newFormat;
    };

    const sortProduct = (sort) => {
        let newList2 = [...rows].sort((a, b) => {
            if (sort.value == 'newest') {
                // console.log('newList42222', sort);
                return b.birth.localeCompare(a.birth);
            } else if (sort.value == 'oldest') {
                return a.birth.localeCompare(b.birth);
            } else {
                return a.fullName.localeCompare(b.fullName);
            }
        });
        //  console.log('newList42222', newList);
        //  setIsSort(false);
        setRows(newList2);
    };

    const filterProduct = (keywords, rolefilter, genderfilter, status) => {
        let newList = [...newList2];
        console.log('dang filter', newList);
        newList = newList.filter((product) => {
            if (keywords) {
                return product.fullName.toLowerCase().includes(keywords.toLowerCase());
            } else {
                return product;
            }
        });

        if (rolefilter) {
            const list2 = newList?.filter((product) => {
                if (rolefilter.value) {
                    return product.isManager;
                } else return !product.isManager;
            });
            newList = [...list2];
        }

        if (status) {
            const list2 = newList?.filter((product) => {
                if (status.value) {
                    return product.isLock;
                } else return !product.isLock;
            });
            newList = [...list2];
        }

        if (genderfilter) {
            const list2 = newList?.filter((product) => {
                if (genderfilter.value == null) {
                    return product.gender != 'male' && product.gender != 'female';
                } else if (genderfilter.value) {
                    return product.gender == 'male';
                } else return product.gender == 'female';
            });
            newList = [...list2];
        }

        newList !== undefined && setRows(newList); // : setRows(data.products);
    };

    //console.log('dfyhasv', rows);

    useEffect(() => {
        // console.log('dfyhsấasv', keywords, selectCategory, price, rate, rolefilter, status);
        filterProduct(keywords, rolefilter, genderfilter, status);
        setSelectSort(sortOptions[0]);
        // setSelectSort
    }, [keywords, rolefilter, genderfilter, status]);

    useEffect(() => {
        if (selectSort) {
            // console.log('dfyhasv1', selectSort);
            sortProduct(selectSort);
            // setIsSort(false);
        }
    }, [selectSort]);

    useEffect(() => {
        // console.log('newList2111', newList2);
        if (data?.users?.length > 0) {
            let newList = [...data?.users];
            newList = newList.map((product) => {
                if (product.birth) {
                    return {
                        ...product,
                        // birth: chuyenDoiNgay(product.birth),
                        birth: product.birth,
                    };
                } else {
                    return product;
                }
            });
            setNewList2(newList);
            handleClearFilter(newList);
        }
    }, [data]);

    // console.log('newList2', data?.users);

    return (
        <div className={cx('wrapper')}>
            <Backdrop sx={{ color: '#fff', zIndex: 10000 }} open={showProgress}>
                <CircularProgress color="error" />
            </Backdrop>
            <Modal
                title="Vui lòng nhập mã SupperAdmin để quản lý người dùng!"
                open={show}
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
            <Dialog open={showDialog}>
                <div className={cx('dialog_add_user')}>
                    <p className={cx('btn_close')} onClick={() => setShowDialog(false)}>
                        <CloseOutlinedIcon className={cx('btn_icon')} />
                    </p>

                    <Form
                        form={form}
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
                            <Input placeholder="Nhập tên tài khoản" />
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
                                },
                            ]}
                        >
                            <Input placeholder="Nhập email" />
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
                            <Input placeholder="Nhập số điện thoại" />
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
                                    message: 'Vui lòng nhập: trên 8 ký tự. Chứa 0-9, a-z, A-Z và 1 ký tự đặc biệt',
                                },
                            ]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu" />
                        </Form.Item>

                        <Form.Item label="Vị trí hiện tại">
                            <Button
                                wrapperCol={{
                                    span: 24,
                                }}
                                onClick={() => {
                                    setAuto(true);
                                    setIsReload(!isReload);
                                }}
                            >
                                Vị trí hiện tại
                            </Button>
                        </Form.Item>

                        <Form.Item
                            label="Địa chỉ"
                            // value={address}
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống',
                                },
                            ]}
                        >
                            <Input placeholder="Nhập địa chỉ" />
                        </Form.Item>

                        <Form.Item
                            label="Tỉnh/Thành phố"
                            // value={city}
                            name="city"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống',
                                },
                            ]}
                        >
                            <Input placeholder="Nhập tỉnh/thành phố" />
                        </Form.Item>
                        <div className="flex items-center mb-[20px]">
                            <p className={cx('label')}>Ngày sinh: </p>
                            <div className="flex flex-[20] justify-start ml-[6px]">
                                <DatePicker onChange={changeDate} />
                            </div>
                        </div>
                        <div className="flex items-center mb-[20px]">
                            <p className={cx('label')}>Giới tính: </p>
                            <div className="flex flex-[20] justify-start ml-[6px]">
                                <div className={cx('form_radio')}>
                                    <div className={cx('radio')}>
                                        <input
                                            id="radio"
                                            type="radio"
                                            checked={gender == 'male'}
                                            onChange={() => handleChangeGender('male')}
                                        />
                                        <label for="radio">Nam</label>
                                    </div>

                                    <div className={cx('radio')}>
                                        <input
                                            id="radio_female"
                                            type="radio"
                                            checked={gender == 'female'}
                                            onChange={() => handleChangeGender('female')}
                                        />
                                        <label for="radio_female">Nữ</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center mb-[20px]">
                            <p className={cx('label')}>Chức vụ: </p>
                            <div className="flex flex-[20] justify-start ml-[6px]">
                                <DropMenu
                                    options={roleOption}
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
                                        <input
                                            type="file"
                                            id="image"
                                            name="image"
                                            onChange={(e) => handleChooseImage(e)}
                                        />
                                    </p>
                                    {avatar && <img src={avatar.preview} />}
                                </div>
                            </div>
                        </div>
                        <Form.Item
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Thêm
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Dialog>
            <Backdrop sx={{ color: '#fff', zIndex: 10000 }} open={loading}>
                {<CircularProgress color="error" />}
            </Backdrop>
            <Dialog open={showFormLockAccount} onClose={() => setShowFormLockAccount(false)}>
                <div className="px-[20px] pt-[30px] w-[35vw]">
                    <Form
                        labelCol={{
                            span: 5,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                        style={{
                            maxWidth: '100%',
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
                            initialValue={'Thông báo tài khoản'}
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
                            initialValue={`${
                                userLock.hasOwnProperty('isLock')
                                    ? userLock.isLock === false
                                        ? 'Tài khoản của bạn đã được mở khóa. Quý khách có thể mua hàng trở lại!'
                                        : 'Hệ thống xác nhận gần đây bạn hủy quá nhiều đơn hàng. Tài khoản của bạn sẽ bị tạm khóa cho đến khi được mở lại'
                                    : 'Hệ thống xác nhận gần đây bạn hủy quá nhiều đơn hàng. Tài khoản của bạn sẽ bị tạm khóa cho đến khi được mở lại'
                            }`}
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

                        <Form.Item>
                            <Button htmlType="submit" icon={<SendOutlined />}>
                                Gửi
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Dialog>
            <div className={cx('heading')}>
                <h3>Quản lý tài khoản</h3>
                <p
                    onClick={() => {
                        data?.isSuperAdmin ? handleShowDialog() : setShow(true);
                    }}
                    className={cx('btn_add_new')}
                >
                    <AddCircleOutlineOutlinedIcon className={cx('btn_icon')} />
                    <span>Thêm mới</span>
                </p>
            </div>
            <div className="flex items-center justify-between px[20px] py-[10px] shadow-sm border rounded-[6px] my-[10px]">
                <div className="px-[20px] flex items-center">
                    <p className="text-[1.4rem] text-[#333] mr-[10px]">Sắp xếp theo: </p>
                    <Select
                        disabled={newList2.length == 0}
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
                        disabled={newList2.length == 0}
                        //onSearch={handleSearch}
                        className="w-[400px]"
                        placeholder="Tìm kiếm người dùng ..."
                        onChange={(e) => handleSearch(e.target.value)}
                        // value={keywords}
                    />
                </div>
                <div className="px-[20px] flex items-center">
                    <Tippy
                        disabled={newList2.length == 0}
                        interactive={true}
                        visible={showFilter}
                        placement="bottom"
                        render={(attrs) => (
                            <div
                                className="tippy-admin max-w-max min-w-[280px] shadow-lg max-h-[64vh] overflow-y-scroll"
                                tabIndex="-1"
                                {...attrs}
                            >
                                <PopperWrapper>
                                    <div className="relative h-max px-[20px] pb-[20px] pt-[30px] rounded-[12px]">
                                        {genderfilter || rolefilter || status ? (
                                            <div>
                                                {status && (
                                                    <div className="mb-[10px] w-max px-[10px] py-[4px] rounded-[12px] flex items-center justify-center text-orange-500 border border-orange-500">
                                                        <p className="text-[1.3rem] flex flex-wrap">
                                                            Trạng thái: {status.label}
                                                        </p>
                                                        <CloseOutlined
                                                            onClick={() => setStatus(null)}
                                                            className="ml-[8px] cursor-pointer"
                                                        />
                                                    </div>
                                                )}
                                                {rolefilter && (
                                                    <div className="mb-[10px] w-max px-[10px] py-[4px] rounded-[12px] flex items-center justify-center text-orange-500 border border-orange-500">
                                                        <p className="text-[1.3rem] flex flex-wrap">
                                                            Chức vụ: {rolefilter.label}
                                                        </p>
                                                        <CloseOutlined
                                                            onClick={() => setRoleFilter(null)}
                                                            className="ml-[8px] cursor-pointer"
                                                        />
                                                    </div>
                                                )}

                                                {genderfilter && (
                                                    <div className="mb-[10px] w-max px-[10px] py-[4px] rounded-[12px] flex items-center justify-center text-orange-500 border border-orange-500">
                                                        <p className="text-[1.3rem] flex flex-wrap">
                                                            Giới tính: {genderfilter.label}
                                                        </p>
                                                        <CloseOutlined
                                                            onClick={() => setGenderFilter(null)}
                                                            className="ml-[8px] cursor-pointer"
                                                        />
                                                    </div>
                                                )}

                                                <div
                                                    onClick={() => {
                                                        handleClearFilter(newList2);
                                                    }}
                                                    className="mb-[10px] cursor-pointer w-max px-[10px] py-[4px] rounded-[12px] flex items-center justify-center text-orange-500 border border-orange-500"
                                                >
                                                    <p className="text-[1.3rem]">Xóa bộ lọc</p>
                                                </div>
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        <div
                                            className="absolute top-[8px] right-[8px] p-[6px] cursor-pointer hover:bg-slate-200 rounded-[50%]"
                                            onClick={() => setShowFilter(false)}
                                        >
                                            <CloseOutlined className="text-[1.4rem]" />
                                        </div>

                                        <div className="border-b pt-[20px]">
                                            <h1 className="text-[1.3rem] text-[#333] uppercase font-[600]">
                                                Trạng thái
                                            </h1>
                                            {statusOptions.map((option) => (
                                                <div key={option.label} className="p-[10px]">
                                                    <Checkbox
                                                        onChange={() => {
                                                            handleStatusChange(option);
                                                            console.log('option12', option.label, status);
                                                        }}
                                                        checked={option.label === status?.label}
                                                        className="text-[1.4rem] text-[#333] font-[500]"
                                                    >
                                                        {option?.label}
                                                    </Checkbox>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-b pt-[20px]">
                                            <h1 className="text-[1.3rem] text-[#333] uppercase font-[600]">
                                                Giới tính
                                            </h1>
                                            {genderOptions.map((option) => (
                                                <div key={option.label} className="p-[10px]">
                                                    <Checkbox
                                                        onChange={() => {
                                                            handleGenderChange(option);
                                                        }}
                                                        checked={option.label === genderfilter?.label}
                                                        className="text-[1.4rem] text-[#333] font-[500]"
                                                    >
                                                        {option.label}
                                                    </Checkbox>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-b pt-[20px]">
                                            <h1 className="text-[1.3rem] text-[#333] uppercase font-[600]">Chức vụ</h1>
                                            {roleOption.map((option) => (
                                                <div key={option.label} className="p-[10px]">
                                                    <Checkbox
                                                        onChange={() => {
                                                            handleRoleChange(option);
                                                        }}
                                                        checked={option.value === rolefilter?.value}
                                                        className="text-[1.4rem] text-[#333] font-[500]"
                                                    >
                                                        {option.label}
                                                    </Checkbox>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </PopperWrapper>
                            </div>
                        )}
                    >
                        <Button
                            icon={<FilterOutlined />}
                            className="w-[200px]"
                            onClick={() => {
                                setShowFilter(!showFilter);
                            }}
                        >
                            Lọc
                        </Button>
                    </Tippy>
                </div>
            </div>
            {rows && (
                <EnhancedTable
                    pageSize={12}
                    columns={columns}
                    ischeckboxSelection={false}
                    type="user"
                    height="70vh"
                    rows={rows?.map((row, index) => ({
                        ...row,
                        rowNumber: index + 1,
                    }))}
                />
            )}
        </div>
    );
}

export default Users;
