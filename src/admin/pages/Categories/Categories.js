import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import EnhancedTable from '../../components/Table/EnhancedTable';
import { useData } from '../../../stores/DataContext';
import { Backdrop, CircularProgress, Dialog } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getAuthInstance } from '../../../utils/axiosConfig';
import React from 'react';
import { useState, useEffect } from 'react';
import { api, appPath, lockImage, superAdmin, unLockImage } from '../../../constants';
import { Delete, View } from '../../components/Button/Button';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useSuperAdmin } from '../../../stores/hooks';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DropMenu from '../../../components/DropMenu';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import PieChart from '../../components/charts/PieChar/index';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
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
import { LockOutlined, SendOutlined, FilterOutlined, UnlockOutlined, CloseOutlined } from '@ant-design/icons';
import { Wrapper as PopperWrapper } from '../../../components/Popper';

function Categories() {
    const [rows, setRows] = React.useState([]);
    const { data, setData } = useData();
    const [displayForm, setDisplayForm] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(0);
    const navigate = useNavigate();
    const authInstance = getAuthInstance();

    // const [newList2, setNewList2] = useState([]);
    const [options, setOptions] = useState([]);
    const [price, setPrice] = useState(null);
    const [rate, setRate] = useState(null);
    const [suggestFlash, setSuggestFlash] = useState([]);
    const [isToggle, setIsToggle] = useState(false); // khi bấm nút tiếp tục thì gọi hàm này để \tắt chọn những sản phẩm đã chọn
    const [temporary_data, setTemporary_data] = useState([]); // lưu lại những sản phẩm đã chọn để gợi ý
    const [selectCategory, setSelectCategory] = useState(null);
    const [status, setStatus] = useState(null);
    const [genderfilter, setGenderFilter] = useState(null);
    const [rolefilter, setRoleFilter] = useState(null);
    const [selectSort, setSelectSort] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [keywords, setKeywords] = useState(null);
    const [pieData, setPieData] = useState(null);
    const statusOptions = [
        {
            label: 'Hoạt động',
            value: true,
        },

        {
            label: 'Ngưng bán',
            value: false,
        },
    ];

    const handleSearch = (value) => {
        setKeywords(value);
    };

    const handleGenderChange = (rateItem) => {
        setGenderFilter(rateItem);
    };

    const handleStatusChange = (option) => {
        setStatus(option);
    };

    const handleRoleChange = (option) => {
        // console.log('option123', option);
        setRoleFilter(option);
    };

    const handleShowFilter = () => {
        setShowFilter((prev) => !prev);
    };
    const handleClearFilter = () => {
        // setPrice(null);
        // setRate(null);
        // setSelectCategory(null);
        //  console.log('da vo day');
        // setGenderFilter(null);
        //  setRoleFilter(null);
        setStatus(null);
        //  setSelectSort(sortOptions[0]);
        const productsToSort = [...data?.categories];
        const sortedProducts = productsToSort.sort((a, b) => a.name.localeCompare(b.name));
        // console.log('newList2sd', sortedProducts);
        setRows(sortedProducts);
    };

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
            field: 'name',
            headerName: 'Tên',
            sortable: false,
            editable: true,
            width: 400,
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            sortable: false,
            editable: true,
            width: 200,
            renderCell: (params) => {
                return (
                    <p className={`font-[600] ${params.value == 'Hoạt động' ? 'text-green-600' : 'text-red-600'}`}>
                        {params.value}
                    </p>
                );
            },
        },
        {
            field: '_id',
            headerName: 'Hành động',
            sortable: false,
            editable: true,
            width: 200,

            renderCell: (params) => {
                return (
                    <Tooltip title="Xem danh sách sản phẩm" placement="right">
                        <Button
                            type="primary"
                            ghost
                            style={{
                                margin: '0 10px 0 0',
                            }}
                            onClick={() => navigate(`/admin/categories/${params.value}`)}
                        >
                            Chi tiết
                        </Button>
                    </Tooltip>
                );
            },
        },
    ];

    const handleDisplayForm = () => {
        setDisplayForm(true);
    };

    const fetchCategory = async () => {
        await fetch(`${api}/categories?filter=simple`)
            .then((response) => response.json())
            .then((result) => {
                if (result.status == 'OK') {
                    setData({ ...data, categories: result.data });
                }
            })
            .catch((err) => console.log(err.message));
    };

    useEffect(() => {
        if (success != 0) {
            fetchCategory();
        }
    }, [success]);

    useEffect(() => {
        //  console.log('data', data?.categories);
        if (data?.categories?.length > 0) {
            //  console.log('data?.categories', data?.categories);
            const newRows = data?.categories?.map((category, index) => {
                return {
                    ...category,
                    rowNumber: index + 1,
                };
            });
            setRows(newRows);

            const newnew = newRows.reduce(
                (acc, item) => {
                    if (item.status == 'Hoạt động') {
                        acc[0].value += 1;
                    } else {
                        acc[1].value += 1;
                    }
                    return acc;
                },
                [
                    { name: 'Hoạt động', value: 0 },
                    { name: 'Ngưng bán', value: 0 },
                ],
            );
            console.log('newnew', newnew);
            setPieData(newnew);
        }
    }, [data]);

    useEffect(() => {
        // console.log('dfyhsấasv', keywords, selectCategory, price, rate, quantity, status);
        filterProduct(keywords, status);
        // setSelectSort(sortOptions[0]);
        // setSelectSort
    }, [keywords, status]);

    const filterProduct = (keywords, status) => {
        let newList = data?.categories || [];
        console.log('dang filter', data?.categories, newList);
        newList = newList.filter((product) => {
            if (keywords) {
                // console.log('dang 123', product.title.toLowerCase().includes(keywords.toLowerCase()));
                return product.name.toLowerCase().includes(keywords.toLowerCase());
            } else {
                return product;
            }
        });

        if (status) {
            const list3 = newList.filter((product) => {
                if (product.hasOwnProperty('status_sell')) {
                    return product.status_sell === status.value;
                } else {
                    if (status.value) {
                        return product;
                    } else {
                        return null;
                    }
                }
            });
            newList = [...list3];
        }

        newList !== undefined && setRows(newList); // : setRows(data.products);
    };

    // console.log('data11', data);

    const handleOk = (value) => {
        setLoading(true);
        authInstance
            .post('/categories', { ...value })
            .then(async (response) => {
                if (response.data.status == 'OK') {
                    setDisplayForm(false);
                    toast.success('Thêm thành công!');
                    setSuccess((prev) => (prev += 1));
                } else {
                    toast.error(response.data.message);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error(err.response.data.message);
                setLoading(false);
            });
    };
    const handleCancel = () => {
        setDisplayForm(false);
    };

    const handleSortChange = (value, option) => {
        setSelectSort(option);
    };

    return (
        <div
            style={{
                padding: ' 10px 20px',
            }}
        >
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
            <Backdrop sx={{ color: '#fff', zIndex: 10000 }} open={loading}>
                <CircularProgress color="error" />
            </Backdrop>
            <Dialog open={displayForm} onClose={handleCancel}>
                <div className="p-[20px] w-[50rem]">
                    <h1 className="py-[20px] text-[2rem] text-[#333] font-[600]">Thêm mới danh mục sản phẩm</h1>
                    <Form
                        layout="vertical"
                        onFinish={handleOk}
                        autoComplete="off"
                        style={{
                            width: '100%',
                        }}
                    >
                        <Form.Item
                            label="Tên"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng không để trống thông tin này',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

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

            <div className="flex items-center justify-between p-[20px] shadow-lg rounded-[8px]">
                <h1
                    className="text-[2rem] uppercase text-[#333] font-[500]"
                    style={{
                        color: '#c92127',
                    }}
                >
                    Quản lý danh mục sản phẩm
                </h1>
                <p
                    onClick={handleDisplayForm}
                    className="cursor-pointer flex items-center justify-center text-[#00dfa2] w-[120px] h-[35px] rounded-[4px] border border-[#00dfa2] font-[600] mr-[10px]"
                >
                    <AddCircleOutlineOutlinedIcon className="text-[2rem] mr-[8px]" />
                    <span>Thêm mới</span>
                </p>
            </div>

            <div className="flex items-center justify-between px[20px] py-[10px] shadow-sm border rounded-[6px] my-[10px]">
                <div className="px-[20px] flex items-center">
                    <Input.Search
                        disabled={data?.categories?.length == 0}
                        //onSearch={handleSearch}
                        className="w-[400px]"
                        placeholder="Tìm kiếm danh mục ..."
                        onChange={(e) => handleSearch(e.target.value)}
                        // value={keywords}
                    />
                </div>
                <div className="px-[20px] flex items-center">
                    <Tippy
                        disabled={data?.categories?.length == 0}
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
                                        {status ? (
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
                                                        handleClearFilter();
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

            <div
                className="mt-[10px]"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    // margin: '0 20px',
                }}
            >
                <div
                    style={{
                        flex: 3,
                    }}
                >
                    {rows && (
                        <EnhancedTable
                            ischeckboxSelection={false}
                            pageSize={12}
                            columns={columns}
                            type="category"
                            height="70vh"
                            rows={rows?.map((row, index) => ({
                                ...row,
                                rowNumber: index + 1,
                            }))}
                        />
                    )}
                </div>
                <div
                    style={{
                        flex: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        border: '1px solid #e0e0e0',
                        borderRadius: '3px',
                        height: '70vh',
                        marginLeft: '10px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            borderBottom: '1px solid #e0e0e0',
                            borderRadius: '3px',
                            width: '100%',
                            flex: 2,
                            padding: '20px',
                            // marginBottom: '10px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                margin: '0 0 20px 0',
                            }}
                        >
                            <p
                                style={{
                                    fontSize: '1.8rem',
                                    fontWeight: '600',
                                    marginBottom: '10px',
                                    color: '#1E90FF',
                                }}
                            >
                                Tổng số danh mục sản phẩm
                            </p>
                            <p
                                style={{
                                    fontSize: '2.5rem',
                                    fontWeight: '600',
                                    color: '#696969',
                                }}
                            >
                                {rows?.length}
                            </p>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',

                                    margin: '0 30px 0 0',
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: '1.6rem',
                                        fontWeight: '600',
                                        color: '#00CC00',
                                        marginBottom: '10px',
                                    }}
                                >
                                    Hoạt động
                                </p>
                                <p
                                    style={{
                                        fontSize: '2.3rem',
                                        fontWeight: '600',
                                        color: '#696969',
                                    }}
                                >
                                    {pieData && pieData[0].value}
                                </p>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    margin: '0 0 0 30px',
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: '1.6rem',
                                        fontWeight: '600',
                                        color: '#FF0033',
                                        marginBottom: '10px',
                                    }}
                                >
                                    Ngưng bán
                                </p>
                                <p
                                    style={{
                                        fontSize: '2.3rem',
                                        fontWeight: '600',
                                        color: '#696969',
                                    }}
                                >
                                    {pieData && pieData[1].value}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            flex: 5,
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            // padding: '20px',
                            // marginBottom: '10px',
                        }}
                    >
                        <PieChart
                            data={
                                pieData || [
                                    { name: 'Hoạt động', value: 0 },
                                    { name: 'Ngưng bán', value: 0 },
                                ]
                            }
                        />
                    </div>
                    <div style={{ flex: 0.5 }}>
                        <strong>Biểu đồ trạng thái danh mục sản phẩm</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Categories;
