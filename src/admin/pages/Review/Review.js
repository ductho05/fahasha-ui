import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Review.module.scss';
import EnhancedTable from '../../components/Table/EnhancedTable';
import { useNavigate } from 'react-router-dom';
import { Rating } from '@mui/material';
import { api } from '../../../constants';
import LinearProgress from '@mui/material/LinearProgress';
import { useData } from '../../../stores/DataContext';
import { LockOutlined, SendOutlined, FilterOutlined, UnlockOutlined, CloseOutlined } from '@ant-design/icons';
import { Wrapper as PopperWrapper } from '../../../components/Popper';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import {
    Input,
    Form,
    Skeleton,
    DatePicker,
    Popconfirm,
    Modal,
    Alert,
    Image,
    Rate,
    Button,
    message,
    Tooltip,
    Select,
    Checkbox,
} from 'antd';
const cx = classNames.bind(styles);

const sortOptions = [
    {
        label: 'Mặc định',
        value: 'default',
    },
    {
        label: 'Gần đây nhất',
        value: 'oldest',
    },
    {
        label: 'Cũ nhất',
        value: 'newest',
    },
    {
        label: 'Lượt thích thấp nhất',
        value: 'likes',
    },
    {
        label: 'Lượt thích cao nhất',
        value: 'likes-desc',
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

const rateOptions = [1, 2, 3, 4, 5];

function Review() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const { data, setData } = useData();
    const [newList2, setNewList2] = useState([]);
    const [options, setOptions] = useState([]);
    const [price, setPrice] = useState(null);
    const numProduct = 5;
    const [top_products, setTop_products] = useState([]);
    const [rate, setRate] = useState(null);
    const [suggestFlash, setSuggestFlash] = useState([]);
    const [isToggle, setIsToggle] = useState(false); // khi bấm nút tiếp tục thì gọi hàm này để \tắt chọn những sản phẩm đã chọn
    //const [rows, setRows] = useState([]);
    const [temporary_data, setTemporary_data] = useState([]); // lưu lại những sản phẩm đã chọn để gợi ý
    const [selectCategory, setSelectCategory] = useState(null);
    const [status, setStatus] = useState(null);
    const [genderfilter, setGenderFilter] = useState(null);
    const [rolefilter, setRoleFilter] = useState(null);
    const [selectSort, setSelectSort] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [keywords, setKeywords] = useState(null);
    //const [rate, setRate] = useState(null);

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
        // { field: '_id', headerName: 'ID', width: 200 },
        {
            field: 'user',
            headerName: 'Tên tài khoản',
            width: 100,
            sortable: false,
            editable: true,
            renderCell: (params) => (
                <p
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        navigate(`/admin/user/${params.value?._id}`);
                    }}
                    className={params.value ? cx('') : cx('null')}
                >
                    {params.value ? params.value?.fullName : 'Trống'}
                </p>
            ),
        },
        {
            field: 'product',
            headerName: 'Sản phẩm',
            width: 90,
            renderCell: (params) => (
                <img
                    onClick={() => {
                        navigate(`/admin/products/${params.value?._id}`);
                    }}
                    className={cx('image')}
                    src={params.value?.images}
                />
            ),
        },
        {
            field: 'comment',
            headerName: 'Comment',
            width: 250,
            sortable: false,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : 'Trống'}</p>
            ),
        },
        {
            field: 'rate',
            headerName: 'Sao đánh giá',
            width: 100,
            sortable: true,
            renderCell: (params) => <Rating name="read-only" value={params.value} readOnly />,
        },
        {
            field: 'likes',
            headerName: 'Lượt thích',
            width: 90,
            sortable: false,
            renderCell: (params) => (
                <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value.length : 'Trống'}</p>
            ),
        },
        {
            field: 'createdAt',
            headerName: 'Thời gian',
            width: 100,
            sortable: false,
            editable: true,
            // renderCell: (params) => (
            //     <p
            //         style={{ cursor: 'pointer' }}
            //         onClick={() => {
            //             navigate(`/admin/user/${params.value?._id}`);
            //         }}
            //         className={params.value ? cx('') : cx('null')}
            //     >
            //         {params.value ? params.value?.fullName : 'Trống'}
            //     </p>
            // ),
        },
    ];

    const handleChangeCategory = (value, option) => {
        setSelectCategory(option);
    };

    const handleChangeRate = (rateItem) => {
        setRate(rateItem);
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
        setRate(null);
        // setSelectCategory(null);
        console.log('da vo day');
        setGenderFilter(null);
        //setRoleFilter(null);
        //setStatus(null);
        //  setSelectSort(sortOptions[0]);
        const productsToSort = [...newList2];
        const sortedProducts = productsToSort.sort((a, b) => a.user?.fullName.localeCompare(b.user?.fullName));
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
        let newList22 = [...rows].sort((a, b) => {
            if (sort.value == 'oldest') {
                // console.log('newList42222', sort);
                return b.createdAt.localeCompare(a.createdAt);
            } else if (sort.value == 'newest') {
                return a.createdAt.localeCompare(b.createdAt);
            } else if (sort.value == 'likes') {
                return a.likes.length - b.likes.length;
            } else if (sort.value == 'likes-desc') {
                return b.likes.length - a.likes.length;
            } else {
                return a.user?.fullName.localeCompare(b.user?.fullName);
            }
        });
        //  console.log('newList42222', newList);
        //  setIsSort(false);
        setRows(newList22);
    };

    const filterProduct = (keywords, genderfilter, rate) => {
        let newList = [...newList2];
        // console.log('dang filter', newList);
        newList = newList.filter((product) => {
            if (keywords) {
                if (product.user?.fullName && product.comment) {
                    return (
                        product.user?.fullName.toLowerCase().includes(keywords.toLowerCase()) ||
                        product.comment.toLowerCase().includes(keywords.toLowerCase())
                    );
                } else if (product.user?.fullName) {
                    return product.user?.fullName.toLowerCase().includes(keywords.toLowerCase());
                } else if (product.comment) {
                    return product.comment.toLowerCase().includes(keywords.toLowerCase());
                }
            } else {
                return product;
            }
        });

        if (rate) {
            const list2 = newList?.filter((product) => {
                if (rate) {
                    return product.rate == rate;
                } else return product.rate != rate;
            });
            newList = [...list2];
        }

        if (genderfilter) {
            const list2 = newList?.filter((product) => {
                if (genderfilter.value == null) {
                    return product.user?.gender != 'male' && product.user?.gender != 'female';
                } else if (genderfilter.value) {
                    return product.user?.gender == 'male';
                } else return product.user?.gender == 'female';
            });
            newList = [...list2];
        }

        newList !== undefined && setRows(newList); // : setRows(data.products);
    };

    //console.log('dfyhasv', rows);

    useEffect(() => {
        // console.log('dfyhsấasv', keywords, selectCategory, price, rate, rolefilter, status);
        filterProduct(keywords, genderfilter, rate);
        setSelectSort(sortOptions[0]);
        // setSelectSort
    }, [keywords, genderfilter, rate]);

    useEffect(() => {
        if (selectSort) {
            // console.log('dfyhasv1', selectSort);
            sortProduct(selectSort);
            // setIsSort(false);
        }
    }, [selectSort]);

    console.log('dataaa', data?.evaluates);

    useEffect(() => {
        // console.log('newList2111', newList2);
        if (data?.evaluates?.length > 0) {
            let newList = [...data?.evaluates];

            setNewList2(newList);
            handleClearFilter(newList);

            const newList2 = newList.map((product) => {
                return {
                    name: product.product?.title,
                    id: product.product?._id,
                    value: product.rate,
                    avatar: product.product?.images,
                };
            });
            let top = newList2;
            top.sort((a, b) => b.value - a.value);
            top = top.slice(0, numProduct);
            setTop_products(top);
        }
    }, [data]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <h3>Quản lý đánh giá</h3>
            </div>
            <div className="flex items-center justify-between px[20px] py-[10px] shadow-sm border rounded-[6px] my-[10px]">
                <div className="px-[20px] flex items-center">
                    <p className="text-[1.4rem] text-[#333] mr-[10px]">Sắp xếp theo: </p>
                    <Select
                        disabled={data?.evaluates?.length == 0}
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
                        disabled={data?.evaluates?.length == 0}
                        //onSearch={handleSearch}
                        className="w-[400px]"
                        placeholder="Tìm kiếm đánh giá ..."
                        onChange={(e) => handleSearch(e.target.value)}
                        // value={keywords}
                    />
                </div>
                <div className="px-[20px] flex items-center">
                    <Tippy
                        disabled={data?.evaluates?.length == 0}
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
                                        {genderfilter || rate ? (
                                            <div>
                                                {rate && (
                                                    <div className="mb-[10px] w-max px-[10px] py-[4px] rounded-[12px] flex items-center justify-center text-orange-500 border border-orange-500">
                                                        <p className="text-[1.3rem]">Sao: {rate}</p>
                                                        <CloseOutlined
                                                            onClick={() => setRate(null)}
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
                                            <h1 className="text-[1.3rem] text-[#333] uppercase font-[600]">Đánh giá</h1>
                                            {rateOptions.map((rateItem) => (
                                                <div key={rateItem} className="p-[10px]">
                                                    <Checkbox
                                                        onChange={() => handleChangeRate(rateItem)}
                                                        checked={rate === rateItem}
                                                        className="text-[1.4rem] text-[#333] font-[500]"
                                                    >
                                                        <Rate
                                                            style={{
                                                                fontSize: '1.4rem',
                                                            }}
                                                            disabled
                                                            defaultValue={rateItem}
                                                        />
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
            <div className={cx('content')}>
                {rows && (
                    <div className={cx('table')}>
                        <EnhancedTable
                            ischeckboxSelection={false}
                            columns={columns}
                            rows={rows?.map((row, index) => ({
                                ...row,
                                rowNumber: index + 1,
                            }))}
                            type={'review'}
                            height="70vh"
                        />
                    </div>
                )}

                <div className={cx('left')}>
                    <h3 className={cx('title')}>TOP {numProduct} SẢN PHẨM CÓ LƯỢT ĐÁNH GIÁ CAO NHẤT</h3>
                    <div className={cx('content_user')}>
                        {top_products.length == 0 ? (
                            <div
                                style={{
                                    width: '350px',
                                    height: '400px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    margin: 'auto',
                                }}
                            >
                                <Alert message="Không có dữ liệu" type="warning" showIcon />
                            </div>
                        ) : (
                            top_products.map((user, index) => (
                                <div className={cx('user')} key={index}>
                                    <div className={cx('index')}>
                                        <div
                                            className={cx('frame')}
                                            style={{
                                                backgroundColor:
                                                    index == 0
                                                        ? '#f44336'
                                                        : index == 1
                                                        ? '#ff9800'
                                                        : index == 2
                                                        ? '#ffc107'
                                                        : '#4caf50',
                                            }}
                                        >
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div
                                        className={cx('avatar')}
                                        style={{
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                            navigate(`/admin/products/${user.id}`);
                                        }}
                                    >
                                        <div className={cx('img')}>
                                            <Image
                                                src={user.avatar}
                                                preview={false}
                                                style={{
                                                    margin: 'auto',
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className={cx('name')}
                                        style={{
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                            navigate(`/admin/s/${user.id}`);
                                        }}
                                    >
                                        {user.name}
                                    </div>
                                    <div className={cx('value')}>{user.value}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Review;
