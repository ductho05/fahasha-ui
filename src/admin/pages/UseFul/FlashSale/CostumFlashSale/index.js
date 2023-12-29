import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { api } from '../../../../../constants';
import SimpleItem from '../../../../components/SimpleItem';
import styles from './CostumFlashSale.module.scss';
import { getAuthInstance } from '../../../../../utils/axiosConfig';
import EnhancedTable from '../../../../components/Table/EnhancedTable';
import StateFlashSale from '../../../../components/StateFlashSale';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import FlashSaleModal from '../../../../components/FlashSaleModal';
import { CloseOutlined, FilterOutlined, EditOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { Wrapper as PopperWrapper } from '../../../../../components/Popper';
import {
    Divider,
    Form,
    Radio,
    Space,
    Switch,
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
import { useData } from '../../../../../stores/DataContext';
import { set } from 'react-hook-form';
const cx = classNames.bind(styles);

const sortOptions = [
    {
        label: 'Mặc định',
        value: 'default',
    },
    {
        label: 'Giá cao nhất',
        value: 'price_desc',
    },
    {
        label: 'Giá thấp nhất',
        value: 'price_asc',
    },
    {
        label: 'Đánh giá cao nhất',
        value: 'rate_desc',
    },
    {
        label: 'Đánh giá thấp nhất',
        value: 'rate_asc',
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
    const [success, setSuccess] = useState(0);
    const [errors, setErrors] = useState({});
    const [options, setOptions] = useState([]);
    const [price, setPrice] = useState(null);
    const [rate, setRate] = useState(null);
    const [suggestFlash, setSuggestFlash] = useState([]);
    const [isToggle, setIsToggle] = useState(false); // khi bấm nút tiếp tục thì gọi hàm này để \tắt chọn những sản phẩm đã chọn
    const [rows, setRows] = useState([]);
    const [temporary_data, setTemporary_data] = useState([]); // lưu lại những sản phẩm đã chọn để gợi ý
    const [selectCategory, setSelectCategory] = useState(null);
    const [status, setStatus] = useState(null);
    const [quantity, setQuantity] = useState(null);
    const [selectSort, setSelectSort] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [keywords, setKeywords] = useState(null);
    const [isSort, setIsSort] = useState(false);



    const getCategoryName = (categoryId) => {
        // categoryId là đối tượng danh mục
        // Thực hiện logic để lấy tên danh mục từ categoryId
        // Trả về tên danh mục
        return categoryId ? categoryId.name : '[Khác]'; // Ví dụ: Lấy name từ đối tượng danh mục
    };

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

    const spaceSizeCol = [280, 120, 160, 90, 90, 90, 90, 70, 80, 80];
    const columns = [
        { field: 'title', headerName: 'Tên sách', sortable: false, width: spaceSizeCol[0] },
        {
            field: 'author',
            headerName: 'Tác giả',

            sortable: false,
            editable: false,
            width: spaceSizeCol[1],
            renderCell: (params) => {
                return <p>{params.value ? params.value : '[Không có thông tin]'}</p>;
            },
        },
        {
            field: 'categoryId',
            headerName: 'Thể loại',
            sortable: true,
            editable: false,
            width: spaceSizeCol[2],
            valueGetter: (params) => getCategoryName(params.row.categoryId),
        },
        {
            field: 'old_price',
            headerName: 'Giá gốc',
            sortable: true,
            editable: false,
            width: spaceSizeCol[3],
            valueFormatter: (params) => {
                const price = params.value; // Giá gốc từ dữ liệu
                if (typeof price === 'number') {
                    // Kiểm tra nếu giá gốc là một số
                    return price.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    });
                }
                // Nếu không phải số, trả về giá trị ban đầu
                return params.value;
            },
        },
        {
            field: 'published_date',
            headerName: 'Đang giảm',
            editable: false,
            width: spaceSizeCol[4],
            renderCell: (params) => {
                return <p>{Math.ceil(((params.row.old_price - params.row.price) * 100) / params.row.old_price)} %</p>;
            },
        },
        {
            field: 'price',
            headerName: 'Giá hiện tại',
            sortable: true,
            editable: false,
            width: spaceSizeCol[5],
            valueFormatter: (params) => {
                const price = params.value; // Giá gốc từ dữ liệu
                if (typeof price === 'number') {
                    // Kiểm tra nếu giá gốc là một số
                    return price.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    });
                }
                // Nếu không phải số, trả về giá trị ban đầu
                return params.value;
            },
        },
        {
            field: 'rate',
            headerName: 'Đánh giá',
            sortable: true,
            editable: false,
            width: spaceSizeCol[6],
            renderCell: (params) => {
                return <p>{params.value} sao</p>;
            },
        },
        {
            field: 'sold',
            headerName: 'Đã bán',
            sortable: true,
            editable: false,
            width: spaceSizeCol[7],
        },
        {
            field: 'quantity',
            headerName: 'Có sẵn',
            sortable: true,
            editable: false,
            width: spaceSizeCol[8],
        },

        {
            field: '_id',
            headerName: 'Trạng thái',
            sortable: false,
            editable: false,
            width: spaceSizeCol[9],
            renderCell: (params) => {
                return <StateFlashSale params={params.value} isToggle={isToggle} />;
            },
        },
    ];

    console.log('sfyugasjh', rows, data);

    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const handleChangeCategory = (value, option) => {
        setSelectCategory(option);
    };

    const handleSortChange = (value, option) => {
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
        setQuantity(null);
        setStatus(null);
        //  setSelectSort(sortOptions[0]);
        const productsToSort = [...(data?.products || temporary_data)];
        const sortedProducts = productsToSort.sort((a, b) => a.title.localeCompare(b.title));

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
            if (sort.value == 'price_asc') {
                return a.price - b.price;
            } else if (sort.value == 'price_desc') {
                return b.price - a.price;
            } else if (sort.value == 'rate_asc') {
                return a.rate - b.rate;
            } else if (sort.value == 'rate_desc') {
                return b.rate - a.rate;
            } else {
                return a.title.localeCompare(b.title);
            }
        });
        //  console.log('newList42222', newList);
        //  setIsSort(false);
        setRows(newList2);
    };

    const filterProduct = (rate, price, category, keywords, quantity, status) => {
        let newList = data?.products?.length > 0 ? [...data.products] : [...temporary_data];
        // console.log('dang filter', newList);
        newList = newList.filter((product) => {
            if (keywords) {
                // console.log('dang 123', product.title.toLowerCase().includes(keywords.toLowerCase()));
                if (rate && price && selectCategory) {
                    if (price.valueMax) {
                        return (
                            product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                            product.rate === rate &&
                            product.categoryId._id === category.value &&
                            product.price >= price.valueMin &&
                            product.price <= price.valueMax
                        );
                    } else {
                        return (
                            product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                            product.rate === rate &&
                            product.categoryId._id === category.value &&
                            product.price >= price.valueMin
                        );
                    }
                } else if (rate && price) {
                    return (
                        product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                        product.rate === rate &&
                        product.price >= price.valueMin &&
                        product.price <= price.valueMax
                    );
                } else if (rate && category) {
                    return (
                        product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                        product.rate === rate &&
                        product.categoryId._id === category.value
                    );
                } else if (price && category) {
                    return (
                        product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                        product.price >= price.valueMin &&
                        product.price <= price.valueMax &&
                        product.categoryId._id === category.value
                    );
                } else if (rate) {
                    return product.title.toLowerCase().includes(keywords.toLowerCase()) && product.rate === rate;
                } else if (price) {
                    return (
                        product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                        product.price >= price.valueMin &&
                        product.price <= price.valueMax
                    );
                } else if (category) {
                    return (
                        product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                        product.categoryId._id === category.value
                    );
                } else return product.title.toLowerCase().includes(keywords.toLowerCase());
            } else {
                if (rate && price && selectCategory) {
                    if (price.valueMax) {
                        return (
                            product.rate === rate &&
                            product.categoryId._id === category.value &&
                            product.price >= price.valueMin &&
                            product.price <= price.valueMax
                        );
                    } else {
                        return (
                            product.rate === rate &&
                            product.categoryId._id === category.value &&
                            product.price >= price.valueMin
                        );
                    }
                } else if (rate && price) {
                    return product.rate === rate && product.price >= price.valueMin && product.price <= price.valueMax;
                } else if (rate && category) {
                    return product.rate === rate && product.categoryId._id === category.value;
                } else if (price && category) {
                    return (
                        product.price >= price.valueMin &&
                        product.price <= price.valueMax &&
                        product.categoryId._id === category.value
                    );
                } else if (rate) {
                    return product.rate === rate;
                } else if (price) {
                    return price.valueMax
                        ? product.price >= price.valueMin && product.price <= price.valueMax
                        : product.price >= price.valueMin;
                } else if (category) {
                    return product.categoryId._id === category.value;
                } else return product;
            }
        });

        if (quantity) {
            const list2 = newList?.filter((product) => {
                if (quantity.value) {
                    return product.quantity > 0;
                } else return product.quantity === 0;
            });
            newList = [...list2];
        }

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

    // console.log('dfyhasv', rows);

    useEffect(() => {
        // console.log('dfyhsấasv', keywords, selectCategory, price, rate, quantity, status);
        filterProduct(rate, price, selectCategory, keywords, quantity, status);
        setSelectSort(sortOptions[0]);
        // setSelectSort
    }, [rate, price, selectCategory, keywords, quantity, status]);

    useEffect(() => {
        if (selectSort) {
            sortProduct(selectSort);
            // setIsSort(false);
        }
    }, [selectSort]);

    useEffect(() => {
        if (data?.products?.length > 0) {
            //var data1 = data.products;
            // console.log('kdhas', data1);
            handleClearFilter();
            //setRows(data1.sort((a, b) => a.title.localeCompare(b.title)));
        } else {
            console.log('g321hádfb', data, temporary_data.length);
            if (data.products?.length == 0) {
                // ngăn load lại 2 lần data không cần thiết
                // fetch(`${api}/products?perPage=50`)
                //     .then((response) => response.json())
                //     .then((result) => {
                //         console.log('ghádfb2');
                if (data?.tem_products?.length > 0) {
                    // console.log('ghádfb3234', data.tem_products);
                    setTemporary_data(data.tem_products);
                    setRows([...data.tem_products].sort((a, b) => a.title.localeCompare(b.title)));
                }
            }
        }
    }, [data]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('top')}>
                <p
                    style={{
                        margin: '0 0 0 10px',
                        flex: 2,
                        color: '#f43030',
                    }}
                >
                    THIẾT LẬP TÙY CHỈNH
                </p>

                <div
                    style={{
                        display: 'flex',
                        flex: 7.5,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Alert
                        banner
                        type="info"
                        message={
                            <Marquee pauseOnHover gradient={false}>
                                {`Hướng dẫn: Chọn sản phẩm ở bảng bên dưới. Bạn có thể sử dụng bộ lọc bằng cách nhấn vào icon 3 chấm ở đầu mỗi cột, sau đó nhấn
                                nút mũi tên xanh để tiến hành thiết lập FlashSale.________`}
                            </Marquee>
                        }
                        style={{
                            width: '85%',
                            margin: '0 4% 0 0',
                            borderRadius: '6px',
                        }}
                    />
                    {/* <p className={cx('btn_load')} onClick={handelLoading}>
                        <AutorenewIcon className={cx('btn_icon_load')} />
                    </p> */}
                    <FlashSaleModal
                        props={{ products: suggestFlash }}
                        func={setIsToggle}
                        isStatus={{
                            isToggle: isToggle,
                        }}
                        style={'custom'}
                    />
                </div>
            </div>
            <div className="flex items-center justify-between px[20px] py-[10px] shadow-sm border rounded-[6px] my-[10px]">
                <div className="px-[20px] flex items-center">
                    <p className="text-[1.4rem] text-[#333] mr-[10px]">Sắp xếp theo: </p>
                    <Select
                        disabled={data?.products?.length == 0 && temporary_data.length == 0}
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
                        disabled={data?.products?.length == 0 && temporary_data.length == 0}
                        //onSearch={handleSearch}
                        className="w-[400px]"
                        placeholder="Tìm kiếm sản phẩm..."
                        onChange={(e) => handleSearch(e.target.value)}
                        // value={keywords}                        
                    />
                </div>
                <div className="px-[20px] flex items-center">
                    <Tippy
                        disabled={data?.products?.length == 0 && temporary_data.length == 0}
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
                                        <div className="border-b pt-[20px]">
                                            <h1 className="text-[1.3rem] text-[#333] uppercase font-[600]">
                                                Trạng thái
                                            </h1>
                                            {statusOptions.map((option) => (
                                                <div key={option.label} className="p-[10px]">
                                                    <Checkbox
                                                        onChange={() => {
                                                            setStatus(option);
                                                        }}
                                                        checked={option.value === status?.value}
                                                        className="text-[1.4rem] text-[#333] font-[500]"
                                                    >
                                                        {option?.label}
                                                    </Checkbox>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-b pt-[20px]">
                                            <h1 className="text-[1.3rem] text-[#333] uppercase font-[600]">
                                                Tình trạng
                                            </h1>
                                            {quantityOptions.map((option) => (
                                                <div key={option.label} className="p-[10px]">
                                                    <Checkbox
                                                        onChange={() => {
                                                            setQuantity(option);
                                                        }}
                                                        checked={option.value === quantity?.value}
                                                        className="text-[1.4rem] text-[#333] font-[500]"
                                                    >
                                                        {option.label}
                                                    </Checkbox>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-b pt-[20px]">
                                            <h1 className="text-[1.3rem] text-[#333] uppercase font-[600]">Giá</h1>
                                            {priceOptions.map((option) => (
                                                <div key={option.label} className="p-[10px]">
                                                    <Checkbox
                                                        onChange={() => handleChangePrice(option)}
                                                        checked={option.valueMin === price?.valueMin}
                                                        className="text-[1.4rem] text-[#333] font-[500]"
                                                    >
                                                        {option.label}
                                                    </Checkbox>
                                                </div>
                                            ))}
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
            <div className={cx('table')}>
                <EnhancedTable
                    columns={columns}
                    rows={rows}
                    func={setSuggestFlash}
                    isStatus={{
                        isToggle: isToggle,
                    }}
                    pageSize={12}
                    type="customFlashsale"
                    height="69.3vh"
                />
            </div>
        </div>
    );
}

export default CostumFlashSale;
