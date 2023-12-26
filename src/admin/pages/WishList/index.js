import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { api } from '../../../constants';
import styles from './WishList.module.scss';
import { useNavigate } from 'react-router-dom';
import { getAuthInstance } from '../../../utils/axiosConfig';
import EnhancedTable from '../../components/Table/EnhancedTable';
import StateFlashSale from '../../components/StateFlashSale';
import FlashSaleModal from '../../components/FlashSaleModal';
import moment from 'moment';
import { InfoCircleFilled } from '@ant-design/icons';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { CloseOutlined, FilterOutlined, EditOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { Wrapper as PopperWrapper } from '../../../components/Popper';
import {
    Divider,
    Form,
    Radio,
    Space,
    Switch,
    Popover,
    Spin,
    Image,
    Alert,
    Input,
    DatePicker,
    Button,
    Skeleton,
    Popconfirm,
    Select,
    Rate,
    Checkbox,
    Tooltip,
} from 'antd';
import Marquee from 'react-fast-marquee';
import { useData } from '../../../stores/DataContext';
import { set } from 'react-hook-form';
const cx = classNames.bind(styles);

const sortOptions = [
    {
        label: 'Mặc định',
        value: 'default',
    },
    {
        label: 'Gần đây nhất',
        value: 'lastest',
    },
    {
        label: 'Cũ nhất',
        value: 'oldest',
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

const rateOptions = [1, 2, 3, 4, 5];

const quantityOptions = [
    {
        label: 'Còn hàng',
        value: true,
    },
    {
        label: 'Hết hàng',
        value: false,
    },
];

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
function CostumFlashSale() {
    const { data, setData } = useData();
    const authInstance = getAuthInstance();
    const [showDialog, setShowDialog] = useState(false);
    const [published, setPublished] = useState();
    const [avatar, setAvatar] = useState();
    const [loading, setLoading] = useState(false);
    const [isAction, setIsAction] = useState(false);
    const [options, setOptions] = useState([]);
    const [success, setSuccess] = useState(0);
    const [errors, setErrors] = useState({});
    const [price, setPrice] = useState(null);
    const [rate, setRate] = useState(null);
    const [suggestFlash, setSuggestFlash] = useState([]);
    const [isToggle, setIsToggle] = useState(false); // khi bấm nút tiếp tục thì gọi hàm này để \tắt chọn những sản phẩm đã chọn
    const numProduct = 5;
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [temporary_data, setTemporary_data] = useState([]); // lưu lại những sản phẩm đã chọn để gợi ý

    const [selectCategory, setSelectCategory] = useState(null);
    const [selectSort, setSelectSort] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [keywords, setKeywords] = useState(null);
    const [status, setStatus] = useState(null);
    const [quantity, setQuantity] = useState(null);
    const [newList, setNewList] = useState([]); // danh sách sản phẩm sau khi lọc
    const [isSort, setIsSort] = useState(false);
    // const [spin, setSpin] = useState(false);
    const [top_products, setTop_products] = useState([]);
    const getCategoryName = (categoryId) => {
        // categoryId là đối tượng danh mục
        // Thực hiện logic để lấy tên danh mục từ categoryId
        // Trả về tên danh mục
        return categoryId ? categoryId.name : '[Khác]'; // Ví dụ: Lấy name từ đối tượng danh mục
    };

    // Lấy top sản phẩm yeu thich
    useEffect(() => {
        if (newList.length > 0) {
            // gom nhóm theo id sản phẩm
            const groupBy = (array, key) => {
                return array.reduce((result, currentValue) => {
                    (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
                    return result;
                }, {});
            };
            const groupById = groupBy(newList, 'idProduct');
            // tìm 5 sản phẩm có lượt yêu thích cao nhất
            let top = [];
            for (let key in groupById) {
                top.push({
                    id: key,
                    name: groupById[key][0].title,
                    avatar: groupById[key][0].imgProduct,
                    value: groupById[key].length,
                });
            }
            top.sort((a, b) => b.value - a.value);
            top = top.slice(0, numProduct);
            setTop_products(top);
        }
    }, [newList]);

    // xử lý data
    useEffect(() => {
        if (data?.favorites?.length > 0) {
            const productsToSort = [...data?.favorites];
            const newList = productsToSort.map((product) => {
                return {
                    _id: product._id,
                    idProduct: product.productid._id,
                    idUser: product.userid._id,
                    imgProduct: product.productid.images,
                    imgUser: product.userid.images,
                    name: product.userid.fullName,
                    title: product.productid.title,
                    category: {
                        _id: product.productid.categoryId._id,
                        name: product.productid.categoryId.name,
                    },
                    createDate: moment(product.createdAt).utcOffset(7).format('YYYY/MM/DD HH:mm'),
                };
            });
            setNewList(newList);

            //const sortedProducts = productsToSort.sort((a, b) => a.userid.fullName.localeCompare(b.userid.fullName));
        }
    }, [data]);

    console.log('dang render', newList, data?.favorites);
    useEffect(() => {
        fetch(`${api}/categories?filter=simple`)
            .then((response) => response.json())
            .then((result) => {
                if (result.status == 'OK') {
                    const newList = result.data.map((category) => {
                        return {
                            label: category.name,
                            value: category._id,
                        };
                    });
                    setOptions(newList);
                }
            })
            .catch((err) => console.log(err.message));
    }, []);

    const spaceSizeCol = [30, 200, 250, 130, 130];
    const columns = [
        {
            field: 'rowNumber',
            headerName: 'STT',
            width: spaceSizeCol[0],
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
            headerName: 'Người dùng',
            sortable: false,
            width: spaceSizeCol[1],
            renderCell: (params) => {
                return (
                    <div
                        onClick={() => {
                            navigate(`/admin/user/${params?.row?.idUser}`);
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            flexDirection: 'row',
                        }}
                    >
                        <img
                            style={{
                                height: '40px',
                                width: '40px',
                                borderRadius: '50%',
                                marginRight: '10px',
                            }}
                            src={params?.row?.imgUser ? params?.row?.imgUser : '/images/user.png'}
                            alt=""
                        />
                        <p>{params?.row?.name ? params?.row?.name : '[Không có thông tin]'}</p>
                    </div>
                );
            },
        },
        {
            field: 'title',
            headerName: 'Sản phẩm',
            sortable: false,
            editable: false,
            width: spaceSizeCol[2],
            renderCell: (params) => {
                return (
                    <div
                        onClick={() => {
                            navigate(`/admin/update-product/${params?.row?.idProduct}`);
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            cursor: 'pointer',
                            flexDirection: 'row',
                        }}
                    >
                        <img
                            style={{
                                height: '50px',
                                width: '50px',
                                // borderRadius: '50%',
                                marginRight: '10px',
                                marginBottom: '10px',
                            }}
                            src={params?.row?.imgProduct ? params?.row?.imgProduct : '/images/user.png'}
                            alt=""
                        />
                        <p>{params?.value ? params?.value : '[Không có thông tin]'}</p>
                    </div>
                );
            },
        },
        {
            field: 'category',
            headerName: 'Thể loại',
            sortable: true,
            editable: false,
            width: spaceSizeCol[3],
            renderCell: (params) => {
                return (
                    <p
                        style={{
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            navigate(`/admin/categories/${params?.row?.category?._id}`);
                        }}
                    >
                        {params?.row?.category?.name ? params?.row?.category?.name : '[Không có thông tin]'}
                    </p>
                );
            },
            //valueGetter: (params) => getCategoryName(params.row.categoryId),
        },
        {
            field: 'createDate',
            headerName: 'Thời gian',
            sortable: true,
            editable: false,
            width: spaceSizeCol[4],
            // renderCell: (params) => {
            //     return (
            //         <p
            //             style={{
            //                 cursor: 'pointer',
            //             }}
            //             onClick={() => {
            //                 navigate(`/admin/categories/${params?.row?.category?._id}`);
            //             }}
            //         >
            //             {params?.row?.category?.name ? params?.row?.category?.name : '[Không có thông tin]'}
            //         </p>
            //     );
            // },
            //valueGetter: (params) => getCategoryName(params.row.categoryId),
        },
    ];

    console.log('sfyugasjh', rows, data);

    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const handleChangeCategory = (value, option) => {
        setSelectCategory(option);
    };

    const handleSortChange = (value, option) => {
        console.log('dang sort', option);
        setSelectSort(option);
    };

    const handleChangePrice = (option) => {
        setPrice(option);
    };

    const handleChangeRate = (rateItem) => {
        setRate(rateItem);
    };

    const handleShowFilter = () => {
        setShowFilter((prev) => !prev);
    };

    const handleClearFilter = () => {
        setPrice(null);
        setRate(null);
        setSelectCategory(null);
        setKeywords('');
        setQuantity(null);
        setStatus(null);
        //  setSelectSort(sortOptions[0]);
        console.log('dang clear');
        const productsToSort = [...newList];
        const sortedProducts = productsToSort.sort((a, b) => a.name.localeCompare(b.name));
        setRows(sortedProducts);

        // setRows(
        //     (data?.products).sort((a, b) => a.title.localeCompare(b.title)) ||
        //         temporary_data.sort((a, b) => a.title.localeCompare(b.title)),
        // );
    };

    const handleSearch = (value) => {
        setKeywords(value);
    };

    const sortProduct = (sort) => {
        let newList2 = [...rows].sort((a, b) => {
            if (sort.value == 'oldest') {
                console.log('dang sort12');
                // so sánh 2 ngày tạo
                return a.createDate.localeCompare(b.createDate);
            } else if (sort.value == 'lastest') {
                return b.createDate.localeCompare(a.createDate);
            } else {
                return a.name.localeCompare(b.name);
            }
        });
        //console.log('dang sort1111', newList2);
        setRows(newList2);
    };

    const filterProduct = (category, keywords) => {
        let newList1 = newList?.length > 0 ? [...newList] : [];
        console.log('dangfilter121', newList1);
        newList1 = newList1.filter((product) => {
            if (keywords) {
                // console.log('dang 123', product.title.toLowerCase().includes(keywords.toLowerCase()));
                if (category) {
                    return (
                        (product.title.toLowerCase().includes(keywords.toLowerCase()) ||
                            product.name.toLowerCase().includes(keywords.toLowerCase())) &&
                        product.category._id === category.value
                    );
                } else
                    return (
                        product.title.toLowerCase().includes(keywords.toLowerCase()) ||
                        product.name.toLowerCase().includes(keywords.toLowerCase())
                    );
            } else {
                if (category) {
                    return product.category._id === category.value;
                } else return product;
            }
        });

        newList1 !== undefined && setRows(newList1); // : setRows(data.products);
    };

    // console.log('dfyhasv', rows);

    useEffect(() => {
        // console.log('dfyhsấasv', keywords, selectCategory, price, rate, quantity, status);
        filterProduct(selectCategory, keywords);
        setSelectSort(sortOptions[0]);
        // setSelectSort
    }, [selectCategory, keywords]);

    useEffect(() => {
        if (selectSort) {
            console.log('dang sort');
            sortProduct(selectSort);
            // setIsSort(false);
        }
    }, [selectSort]);

    useEffect(() => {
        if (newList.length > 0) {
            //var data1 = data.products;
            // console.log('du lieu la', data?.favorites);
            handleClearFilter();
            //setRows(data1.sort((a, b) => a.title.localeCompare(b.title)));
        }
    }, [newList]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('top')}>
                <p
                    style={{
                        margin: '0 0 0 10px',
                        flex: 2,
                    }}
                >
                    SẢN PHẨM YÊU THÍCH
                </p>
            </div>
            <div className="flex items-center justify-between px[20px] py-[10px] shadow-sm border rounded-[6px] my-[10px]">
                <div className="px-[20px] flex items-center">
                    <p className="text-[1.4rem] text-[#333] mr-[10px]">Sắp xếp theo: </p>
                    <Select
                        disabled={data?.favorites?.length == 0}
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
                        disabled={data?.favorites?.length == 0}
                        //onSearch={handleSearch}
                        className="w-[400px]"
                        placeholder="Tìm kiếm theo tên sản phẩm hoặc tên người dùng ..."
                        // value={keywords == null && ''}
                        onChange={(e) => {
                            setKeywords(e.target.value);
                        }}
                    />
                </div>
                <div className="px-[20px] flex items-center">
                    <Tippy
                        disabled={data?.favorites?.length == 0}
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
                                        {rate || price || selectCategory || quantity || status ? (
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
                                                {quantity && (
                                                    <div className="mb-[10px] w-max px-[10px] py-[4px] rounded-[12px] flex items-center justify-center text-orange-500 border border-orange-500">
                                                        <p className="text-[1.3rem] flex flex-wrap">
                                                            Tình trạng: {quantity.label}
                                                        </p>
                                                        <CloseOutlined
                                                            onClick={() => setQuantity(null)}
                                                            className="ml-[8px] cursor-pointer"
                                                        />
                                                    </div>
                                                )}
                                                {selectCategory && (
                                                    <div className="mb-[10px] w-max px-[10px] py-[4px] rounded-[12px] flex items-center justify-center text-orange-500 border border-orange-500">
                                                        <p className="text-[1.3rem] flex flex-wrap">
                                                            Nhóm: {selectCategory.label}
                                                        </p>
                                                        <CloseOutlined
                                                            onClick={() => setSelectCategory(null)}
                                                            className="ml-[8px] cursor-pointer"
                                                        />
                                                    </div>
                                                )}
                                                {rate && (
                                                    <div className="mb-[10px] w-max px-[10px] py-[4px] rounded-[12px] flex items-center justify-center text-orange-500 border border-orange-500">
                                                        <p className="text-[1.3rem]">Sao: {rate}</p>
                                                        <CloseOutlined
                                                            onClick={() => setRate(null)}
                                                            className="ml-[8px] cursor-pointer"
                                                        />
                                                    </div>
                                                )}
                                                {price && (
                                                    <div className="mb-[10px] w-max px-[10px] py-[4px] rounded-[12px] flex items-center justify-center text-orange-500 border border-orange-500">
                                                        <p className="text-[1.3rem]">Giá: {price.label}</p>
                                                        <CloseOutlined
                                                            onClick={() => setPrice(null)}
                                                            className="ml-[8px] cursor-pointer"
                                                        />
                                                    </div>
                                                )}
                                                <div
                                                    onClick={handleClearFilter}
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
                                        <div className="border-b">
                                            <h1 className="text-[1.4rem] text-[#333] uppercase font-[600]">
                                                Nhóm sản phẩm
                                            </h1>
                                            <Select
                                                onChange={handleChangeCategory}
                                                showSearch
                                                placeholder="Chọn danh mục"
                                                optionFilterProp="children"
                                                filterOption={filterOption}
                                                options={options}
                                                className="my-[20px] w-full"
                                            />
                                        </div>
                                    </div>
                                </PopperWrapper>
                            </div>
                        )}
                    >
                        <Button icon={<FilterOutlined />} className="w-[200px]" onClick={handleShowFilter}>
                            Lọc
                        </Button>
                    </Tippy>
                </div>
            </div>
            <div className={cx('content')}>
                <div className={cx('table')}>
                    <EnhancedTable
                        columns={columns}
                        rows={rows.map((row, index) => ({
                            ...row,
                            rowNumber: index + 1,
                        }))}
                        ischeckboxSelection={false}
                        func={setSuggestFlash}
                        isStatus={{
                            isToggle: isToggle,
                        }}
                        pageSize={12}
                        type="customFlashsale"
                        height="66vh"
                    />
                </div>
                <div className={cx('left')}>
                    <h3 className={cx('title')}>TOP {numProduct} SẢN PHẨM CÓ LƯỢT YÊU THÍCH CAO NHẤT</h3>
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
                                            navigate(`/admin/update-product/${user.id}`);
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
                                            navigate(`/admin/update-product/${user.id}`);
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

export default CostumFlashSale;
