import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Voucher.module.scss';
import EnhancedTable from '../../components/Table/EnhancedTable';
import { api, appPath, lockImage, superAdmin, unLockImage, voucherImage } from '../../../constants';
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
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import SendNotice from '../Notifications/components/SendNotice';
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
} from 'antd';
import { getAuthInstance } from '../../../utils/axiosConfig';
import { useData } from '../../../stores/DataContext';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, SendOutlined, FilterOutlined, UnlockOutlined, CloseOutlined } from '@ant-design/icons';
import { Wrapper as PopperWrapper } from '../../../components/Popper';
import { set } from 'react-hook-form';
// import { formatDateToString } from '../../../utils';
// impo
const cx = classNames.bind(styles);

// ẩn 1 vài kí tự trong chuỗi
const hideString = (str, start, end) => {
    let newStr = '';
    for (let i = 0; i < str.length; i++) {
        if (i >= start && i < str.length - end) {
            newStr += '*';
        } else {
            newStr += str[i];
        }
    }
    return newStr;
};

const sortOptions = [
    {
        label: 'Mặc định',
        value: 'default',
    },
    {
        label: 'Thời hạn gần nhất',
        value: 'oldest',
    },
    {
        label: 'Thời hạn xa nhất',
        value: 'newest',
    },
    {
        label: 'Mức giảm giá tăng dần',
        value: 'discountAZ',
    },
    {
        label: 'Mức giảm giá giảm dần',
        value: 'discountZA',
    },
];

const priceOptions = [
    {
        label: '0đ - 150,000 đ',
        valueMin: 0,
        valueMax: 150000,
    },
    {
        label: '150000 đ - 300,000 đ',
        valueMin: 150000,
        valueMax: 300000,
    },
    {
        label: '300,000 đ - 500,000 đ',
        valueMin: 300000,
        valueMax: 500000,
    },
    {
        label: '500,000 đ - 700,000 đ',
        valueMin: 500000,
        valueMax: 700000,
    },
    {
        label: '700.000 đ - Trở lên',
        valueMin: 700000,
    },
];

// const rateOptions = [1, 2, 3, 4, 5];

const roleOption = [
    {
        label: 'Quản lý',
        value: true,
    },
    {
        label: 'Khách hàng',
        value: false,
    },
];

const statusOptions = [
    {
        label: 'Đã sử dụng',
        value: false,
    },

    {
        label: 'Chưa sử dụng',
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

function Voucher() {
    const authInstance = getAuthInstance();
    // const [isSuperAdmin, setIsSuperAdmin] = useState(localStorage.getItem('spc') || false);
    const navigate = useNavigate();
    // const [rows, setRows] = useState([]);
    const [avatar, setAvatar] = useState();
    // const [showDialog, setShowDialog] = useState(false);
    const [birth, setBirth] = useState();
    const [loading, setLoading] = useState(false);
    const [isAction, setIsAction] = useState(false);
    const [gender, setGender] = useState();
    const [isInsert, setIsInsert] = useState(false);
    const { data, setData } = useData();
    //const [isSuperAdmin, setIsSuperAdmin] = useState(localStorage.getItem('spc') || false);
    const [superAdminCode, setSuperAdminCode] = useState('superadmin1811');
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
    console.log('newLis2t21', newList2);
    const [openDialog, setOpenDialog] = useState(false);
    const [optionUser, setOptionUser] = useState([]);
    // const [isse]
    const handleDisplayDialog = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    useEffect(() => {
        authInstance.get(`/users`).then((result) => {
            if (result.data.status == 'OK') {
                const newList = result.data.data.map((user) => {
                    return {
                        label: user.email,
                        value: user._id,
                    };
                });
                setOptionUser(newList);
            }
        });
    }, []);

    const info = (type, content) => {
        messageApi.open({
            type: type,
            content: content,
        });
    };

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
            field: 'code',
            headerName: 'Mã giảm giá',
            sortable: false,
            width: 250,
            editable: true,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>
                    {params.value ? (data?.isSuperAdmin ? params.value : hideString(params.value, 1, 3)) : 'Trống'}
                </p>
            ),
        },
        {
            field: 'discount',
            headerName: 'Giảm giá',
            width: 125,
            sortable: false,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value + '%' : 'Trống'}</p>
            ),
        },
        {
            field: 'user',
            headerName: 'Chủ sở hữu',
            width: 220,
            sortable: false,
            renderCell: (params) => (
                <p className={params.value?.fullName ? cx('') : cx('null')}>
                    {params.value?.fullName ? params.value?.fullName : 'Trống'}
                </p>
            ),
        },
        {
            field: 'expried',
            headerName: 'Thời hạn',
            width: 200,
            sortable: false,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : 'Trống'}</p>
            ),
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 200,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>
                    {params.value ? (!params.value ? 'Đã sử dụng' : 'Chưa sử dụng') : 'Trống'}
                </p>
            ),
        },
    ];

    useEffect(() => {
        return () => {
            avatar && URL.revokeObjectURL(avatar.preview);
        };
    }, [avatar]);

    function generateRandomString() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const randomArray = Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]);
        const randomString = randomArray.join('');
        return randomString;
    }

    const sendVoucher = async (id, value, today) => {
        const startCode = generateRandomString();

        const user = id;
        const voucherCode = `${startCode}${generateRandomString()}`;
        var nextMonthDay = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

        var expried = nextMonthDay.toISOString().split('T')[0];

        const response = await authInstance.post('/vouchers/add', {
            user: user,
            code: voucherCode,
            expried: expried,
            discount: parseInt(value),
        });

        if (response.status === 200) {
            setData({ ...data, vouchers: [...data?.vouchers, response.data.data] });
            await authInstance.post(`/webpush/send`, {
                filter: 'personal',
                notification: {
                    title: 'Thông báo voucher giảm giá',
                    description: `Bạn được tặng voucher giảm giá ${value}% cho bất kì đơn hàng nào. Xem ngay!`,
                    user: user,
                    url: `${appPath}/account/5`,
                    image: voucherImage,
                },
            });
            handleClose();
            info('success', 'Trao quà thành công');
        } else {
            info('error', response.data.message);
        }
        // }
    };

    const [messageApi, contextHolder] = message.useMessage();

    const handleSendVoucher = async (value) => {
        const today = new Date();

        const newDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        await sendVoucher(value.id, value.discount, today);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
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
            handleDisplayDialog();
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

    const handleSortChange = (value, option) => {
        setSelectSort(option);
    };

    const handleStatusChange = (option) => {
        setStatus(option);
    };

    const handleClearFilter = (newList2) => {
        setStatus(null);

        const productsToSort = [...newList2];
        const sortedProducts = productsToSort.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

        setRows(sortedProducts);
    };

    const handleSearch = (value) => {
        setKeywords(value);
    };

    const sortProduct = (sort) => {
        let newList2 = [...rows].sort((a, b) => {
            if (sort.value == 'newest') {
                return b.expried.localeCompare(a.expried);
            } else if (sort.value == 'oldest') {
                return a.expried.localeCompare(b.expried);
            } else if (sort.value == 'discountZA') {
                return b.discount - a.discount;
            } else if (sort.value == 'discountAZ') {
                return a.discount - b.discount;
            } else {
                return b.createdAt.localeCompare(a.createdAt);
            }
        });
        //  console.log('newList42222', newList);
        //  setIsSort(false);
        setRows(newList2);
    };

    const filterProduct = (keywords, status) => {
        let newList = [...newList2];
        // console.log('dang filter', newList);
        newList = newList.filter((product) => {
            if (keywords) {
                return product.user?.fullName.toLowerCase().includes(keywords.toLowerCase());
            } else {
                return product;
            }
        });

        if (status) {
            const list2 = newList?.filter((product) => {
                if (status.value) {
                    return product.status;
                } else return !product.status;
            });
            newList = [...list2];
        }

        newList !== undefined && setRows(newList); // : setRows(data.products);
    };

    //console.log('dfyhasv', rows);

    useEffect(() => {
        // console.log('dfyhsấasv', keywords, selectCategory, price, rate, rolefilter, status);
        filterProduct(keywords, status);
        setSelectSort(sortOptions[0]);
        // setSelectSort
    }, [keywords, status]);

    useEffect(() => {
        if (selectSort) {
            // console.log('dfyhasv1', selectSort);
            sortProduct(selectSort);
            // setIsSort(false);
        }
    }, [selectSort]);

    useEffect(() => {
        // console.log('newList2111', newList2);
        if (data?.vouchers?.length > 0) {
            let newList = [...data?.vouchers];
            // newList = newList.map((product) => {
            //     if (product.birth) {
            //         return {
            //             ...product,
            //             birth: chuyenDoiNgay(product.birth),
            //         };
            //     } else {
            //         return product;
            //     }
            // });
            setNewList2(newList);
            handleClearFilter(newList);
        }
    }, [data]);

    return (
        <div className={cx('wrapper')}>
            {contextHolder}
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

            <Backdrop sx={{ color: '#fff', zIndex: 10000 }} open={loading}>
                {<CircularProgress color="error" />}
            </Backdrop>

            <Dialog
                open={openDialog}
                fullWidth // Thiết lập fullWidth để sử dụng 100% chiều rộng
                maxWidth="md" // Chọn maxWidth theo nhu cầu của bạn (xs, sm, md, lg, xl)
                PaperProps={{
                    style: {
                        width: '25%', // Chiều rộng của Paper (nếu không sử dụng fullWidth)
                        height: '200px', // Chiều cao của Paper (auto hoặc giá trị cụ thể)
                    },
                }}
            >
                {/* <div className="relative">
                    <p
                        onClick={handleClose}
                        className="absolute top-1 right-1 cursor-pointer hover:bg-[#f2f4f5] p-[4px] rounded-[50%]"
                    >
                        <CloseOutlined />
                    </p> */}
                <p
                    onClick={handleClose}
                    className="absolute top-1 right-1 cursor-pointer hover:bg-[#f2f4f5] p-[4px] rounded-[50%]"
                >
                    <CloseOutlined />
                </p>
                <div className="px-[20px] pt-[30px] w-[35vw]">
                    <Form
                        name="basic"
                        labelCol={{
                            span: 5,
                        }}
                        wrapperCol={{
                            span: 10,
                        }}
                        style={{
                            maxWidth: '100%',
                        }}
                        onFinish={handleSendVoucher}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        {
                            <Form.Item
                                label="Người nhận"
                                name="id"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Nội dung này không được để trống!',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Chọn người nhận"
                                    optionFilterProp="children"
                                    filterOption={filterOption}
                                    options={optionUser}
                                />
                            </Form.Item>
                        }
                        <Form.Item
                            label="Mức giảm giá"
                            name="discount"
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
                            wrapperCol={{
                                offset: 7,
                                span: 25,
                            }}
                        >
                            <Button htmlType="submit" icon={<SendOutlined />}>
                                Gửi
                            </Button>
                        </Form.Item>
                    </Form>
                </div>{' '}
            </Dialog>
            <div className={cx('heading')}>
                <h3>Quản lý mã giảm giá</h3>
                <p
                    onClick={() => {
                        data?.isSuperAdmin ? handleDisplayDialog() : setShow(true);
                    }}
                    className="flex items-center cursor-pointer text-[#00dfa2] border border-solid border-[#00dfa2] rounded-[6px] p-[6px] mr-[20px]"
                >
                    <SendOutlined />
                    <span className="ml-[6px]">Tạo mã mới</span>
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

export default Voucher;
