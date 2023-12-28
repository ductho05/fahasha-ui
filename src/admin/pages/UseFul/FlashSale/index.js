import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { api } from '../../../../constants';
import styles from './FlashSale.module.scss';
import EnhancedTable from '../../../components/Table/EnhancedTable';
import StateFlashSale from '../../../components/StateFlashSale';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Wrapper as PopperWrapper } from '../../../../components/Popper';
import AddOptionModal from '../../../components/AddOptionModal';
import lottie from 'lottie-web';
import {
    Divider,
    Form,
    Button,
    Rate,
    Checkbox,
    Popover,
    Radio,
    Input,
    Skeleton,
    Space,
    Switch,
    Select,
    Alert,
} from 'antd';
import BarChartExample from '../../../components/charts/BarChar/BarChar';
import CustomPopconfirm from '../../../components/CustomPopconfirm/CustomPopconfirm';
import Marquee from 'react-fast-marquee';
import { useData } from '../../../../stores/DataContext';
import Tippy from '@tippyjs/react/headless';
import { CloseOutlined, FilterOutlined, EditOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import 'tippy.js/dist/tippy.css';
import { getAuthInstance } from '../../../../utils/axiosConfig';

function FlashSale() {
    const container1 = useRef(null);
    const [showFilter, setShowFilter] = useState(false);
    const [selectSort, setSelectSort] = useState(null);
    const [selectCategory, setSelectCategory] = useState(null);
    const [price, setPrice] = useState(null);
    const [rate, setRate] = useState(null);
    const authInstance = getAuthInstance();
    const [options, setOptions] = useState([]);
    const navigate = useNavigate();
    const [status, setStatus] = useState(null);
    const [quantity, setQuantity] = useState(null);
    const cx = classNames.bind(styles);
    const [keywords, setKeywords] = useState(null);
    const [soldOut, setSoldOut] = useState(null);
    const moment = require('moment-timezone');
    // Đặt múi giờ cho Việt Nam
    const vietnamTimeZone = 'Asia/Ho_Chi_Minh';
    // Lấy thời gian hiện tại ở Việt Nam
    const currentTimeInVietnam = moment().tz(vietnamTimeZone);
    // Lấy số giờ hiện tại
    const currentHourInVietnam = currentTimeInVietnam.get('hours');
    const currentDate = new Date();
    const current_point_sale = Math.floor(currentHourInVietnam / 3);
    const year = currentDate.getUTCFullYear();
    const month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.toString().slice(8, 10);
    const utcTimeString = `${year}-${month}-${day}`;
    const toDay = utcTimeString;
    const [isTime, setIsTime] = useState(false);
    //const [temporary_data, setTemporary_data] = useState([]); // lưu lại những sản phẩm đã chọn để gợi ý

    const { data, setData } = useData();

    console.log('dyhjasb', data);

    lottie.loadAnimation({
        container: container1.current, // Thay container2.current bằng document.getElementById nếu bạn không sử dụng useRef.
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: require('../../../../assets/json/customAddFlashSale.json'),
    });

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

    const spaceSizeCol = [30, 170, 80, 90, 60, 60, 60, 30, 80, 160];
    const [isloadingdelete, setIsloadingdetele] = useState(null);
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
            field: 'product',
            headerName: 'Tên sách',
            width: spaceSizeCol[1],
            sortable: false,
            editable: false,

            renderCell: (params) => {
                return (
                    <Popover content={params.value.title ? params.value.title : '[Không có thông tin]'} trigger="hover">
                        <p className={cx('text-container')}>
                            {params.value.title ? params.value.title : '[Không có thông tin]'}
                        </p>
                    </Popover>
                );
            },
        },

        {
            field: 'point_sale',
            headerName: 'Khung giờ',
            sortable: true,
            editable: false,
            width: spaceSizeCol[2],
            renderCell: (params) => {
                return (
                    <p>{`${params.value * 3 < 10 ? `0${params.value * 3}` : params.value * 3}h - ${
                        (params.value + 1) * 3 < 10 ? `0${(params.value + 1) * 3}` : (params.value + 1) * 3
                    }h`}</p>
                );
            },
        },
        {
            field: 'date_sale',
            headerName: 'Ngày sale',
            sortable: true,
            editable: false,
            width: spaceSizeCol[3],
            renderCell: (params) => {
                return <p>{params.value}</p>;
            },
        },
        {
            field: 'num_sale',
            headerName: 'Số lượng',
            sortable: true,
            editable: false,
            width: spaceSizeCol[4],
        },
        {
            field: 'sold_sale',
            headerName: 'Đã bán',
            sortable: true,
            editable: false,
            width: spaceSizeCol[5],
        },

        {
            field: 'current_sale',
            headerName: 'Đang sale',
            editable: false,
            sortable: true,
            width: spaceSizeCol[6],
            renderCell: (params) => {
                return <p>{params.value} %</p>;
            },
        },
        {
            field: 'is_loop',
            headerName: 'Lặp',
            editable: false,
            sortable: true,
            width: spaceSizeCol[7],
            renderCell: (params) => {
                return <p>{params.value === true ? 'Có' : 'Không'}</p>;
            },
        },
        {
            headerName: 'Trạng thái',
            sortable: false,
            editable: false,
            width: spaceSizeCol[8],
            renderCell: (params) => {
                return (
                    <p
                        className={
                            params.row.date_sale == toDay && params.row.point_sale == current_point_sale
                                ? cx('flashSaleText')
                                : params.row.date_sale > toDay ||
                                  (params.row.date_sale == toDay && params.row.point_sale > current_point_sale)
                                ? cx('noflashSaleText')
                                : cx('')
                        }
                    >
                        {params.row.date_sale == toDay && params.row.point_sale == current_point_sale
                            ? 'FlashSale'
                            : params.row.date_sale > toDay ||
                              (params.row.date_sale == toDay && params.row.point_sale > current_point_sale)
                            ? 'Đang đợi'
                            : 'Hết hạn'}
                    </p>
                );
            },
        },
        {
            field: 'action',
            headerName: 'Hành động',
            sortable: true,
            editable: false,
            headerAlign: 'marginLeft',
            width: spaceSizeCol[9],
            renderCell: (params) => {
                return (
                    <>
                        <Button
                            type="primary"
                            ghost
                            style={{
                                margin: '0 10px 0 0',
                            }}
                            onClick={() => {
                                navigate(`/admin/flashsale/${params.row._id}`);
                            }}
                        >
                            Chi tiết
                        </Button>

                        <CustomPopconfirm
                            title="Xóa flashsale?"
                            description="Không hiển thị lại thông báo này"
                            props={{
                                disable:
                                    params.row.date_sale == toDay && params.row.point_sale == current_point_sale
                                        ? true
                                        : params.row.date_sale > toDay ||
                                          (params.row.date_sale == toDay && params.row.point_sale > current_point_sale)
                                        ? false
                                        : false,
                                isloadingdelete: isloadingdelete,
                            }}
                            func={() => {
                                setIsloadingdetele(true);
                                console.log(params.row._id);
                                authInstance(`/flashsales/delete/${params.row._id}`)
                                    .then((result) => {
                                        if (result.data.status == 'OK') {
                                            //localStorage.setItem('isFlashsaleLoading', true);
                                            setData({
                                                data,
                                                flashsales: data.flashsales.filter(
                                                    (item) => item._id != params.row._id,
                                                ),
                                            });
                                            setRows(data.flashsales.filter((item) => item._id != params.row._id));
                                        }
                                        setIsloadingdetele(false);
                                    })
                                    .catch((err) => console.log(err));
                            }}
                        />
                    </>
                );
            },
        },
    ];

    const statusOptions = [
        {
            label: 'Lặp lại',
            value: true,
        },

        {
            label: 'Không lặp lại',
            value: false,
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

    const quantityOptions = [
        {
            label: 'FlashSale',
            value: 0,
        },
        {
            label: 'Hết hạn',
            value: 1,
        },
        {
            label: 'Đang đợi',
            value: 2,
        },
    ];

    const soldOutOptions = [
        {
            label: 'Bán hết',
            value: 0,
        },
        {
            label: 'Còn hàng',
            value: 1,
        },
    ];

    const sortOptions = [
        {
            label: 'Mặc định',
            value: 'default',
        },
        {
            label: 'Mức giảm giá cao nhất',
            value: 'current_sale_desc',
        },
        {
            label: 'Mức giảm giá thấp nhất',
            value: 'current_sale_asc',
        },
        {
            label: 'Số lượng nhiều nhất',
            value: 'num_desc',
        },
        {
            label: 'Số lượng ít nhất',
            value: 'num_asc',
        },
    ];

    const [suggestFlash, setSuggestFlash] = useState([]);

    const [isToggle, setIsToggle] = useState(false); // khi bấm nút tiếp tục thì gọi hàm này để \tắt chọn những sản phẩm đã chọn

    const [rows, setRows] = useState([]);

    console.log('fhicsdnc', rows, data);

    const handleClearFilter = () => {
        setPrice(null);
        setRate(null);
        setSelectCategory(null);
        setQuantity(null);
        setSoldOut(null);
        setStatus(null);
        //setRows(data?.flashsales);

        const productsToSort = [...data?.flashsales];
        const sortedProducts = productsToSort.sort((a, b) => a.product.title.localeCompare(b.product.title));

        setRows(sortedProducts);
    };

    useEffect(() => {
        if (data?.flashsales) {
            console.log('asdfsaf');
            var data1 = data.flashsales;
            setRows(data1);
            if (localStorage.getItem('isFlashsaleLoading')) {
                //localStorage.removeItem('isFlashsaleLoading');
                fetch(`${api}/flashsales?sort=reverse`)
                    .then((response) => response.json())
                    .then((result) => {
                        setRows(result.data);
                        setData({
                            data,
                            flashsales: result.data,
                        });
                        localStorage.removeItem('isFlashsaleLoading');
                    })
                    .catch((err) => console.log(err));
            }
        } else {
            fetch(`${api}/flashsales?sort=reverse`)
                .then((response) => response.json())
                .then((result) => {
                    setRows(result.data);
                })
                .catch((err) => console.log(err));
        }
    }, [data]);

    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    useEffect(() => {
        if (!isTime && data?.flashsales) {
            filterProduct(rate, price, selectCategory, keywords, quantity, soldOut, status);
            setSelectSort(sortOptions[0]);
        }
    }, [rate, price, selectCategory, keywords, quantity, soldOut, status, isTime]);

    // useEffect(() => {
    //     if (!isTime && data?.flashsales) {
    //         handleClearFilter();
    //     }
    // }, [isTime]);

    const filterProduct = (rate, price, category, keywords, quantity, soldOut, status) => {
        let newList = [...data.flashsales];
        newList = newList.filter((product) => {
            if (keywords) {
                if (rate && price && selectCategory) {
                    if (price.valueMax) {
                        return (
                            product.product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                            product.product.rate === rate &&
                            product.product.categoryId._id === category.value &&
                            product.product.price >= price.valueMin &&
                            product.product.price <= price.valueMax
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
                        product.product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                        product.product.rate === rate &&
                        product.product.price >= price.valueMin &&
                        product.product.price <= price.valueMax
                    );
                } else if (rate && category) {
                    return (
                        product.product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                        product.product.rate === rate &&
                        product.product.categoryId._id === category.value
                    );
                } else if (price && category) {
                    return (
                        product.product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                        product.product.price >= price.valueMin &&
                        product.product.price <= price.valueMax &&
                        product.product.categoryId._id === category.value
                    );
                } else if (rate) {
                    return (
                        product.product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                        product.product.rate === rate
                    );
                } else if (price) {
                    return (
                        product.product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                        product.product.price >= price.valueMin &&
                        product.product.price <= price.valueMax
                    );
                } else if (category) {
                    return (
                        product.product.title.toLowerCase().includes(keywords.toLowerCase()) &&
                        product.product.categoryId._id === category.value
                    );
                } else return product.product.title.toLowerCase().includes(keywords.toLowerCase());
            } else {
                if (rate && price && selectCategory) {
                    if (price.valueMax) {
                        return (
                            product.product.rate === rate &&
                            product.product.categoryId._id === category.value &&
                            product.product.price >= price.valueMin &&
                            product.product.price <= price.valueMax
                        );
                    } else {
                        return (
                            product.product.rate === rate &&
                            product.product.categoryId._id === category.value &&
                            product.product.price >= price.valueMin
                        );
                    }
                } else if (rate && price) {
                    return (
                        product.product.rate === rate &&
                        product.product.price >= price.valueMin &&
                        product.product.price <= price.valueMax
                    );
                } else if (rate && category) {
                    return product.product.rate === rate && product.product.categoryId._id === category.value;
                } else if (price && category) {
                    return (
                        product.product.price >= price.valueMin &&
                        product.product.price <= price.valueMax &&
                        product.product.categoryId._id === category.value
                    );
                } else if (rate) {
                    return product.product.rate === rate;
                } else if (price) {
                    return price.valueMax
                        ? product.product.price >= price.valueMin && product.product.price <= price.valueMax
                        : product.product.price >= price.valueMin;
                } else if (category) {
                    return product.product.categoryId._id === category.value;
                } else return product;
            }
        });

        if (quantity) {
            const list2 = newList?.filter((product) => {
                if (quantity.value == 0) {
                    return product.date_sale == toDay && product.point_sale == current_point_sale;
                } else if (quantity.value == 2) {
                    return (
                        product.date_sale > toDay ||
                        (product.date_sale == toDay && product.point_sale > current_point_sale)
                    );
                } else {
                    return (
                        product.date_sale < toDay ||
                        (product.date_sale == toDay && product.point_sale < current_point_sale)
                    );
                }
            });
            newList = [...list2];
            console.log('123', quantity);
        }

        if (status) {
            const list3 = newList.filter((product) => {
                return product.is_loop === status.value;
            });
            newList = [...list3];
        }

        if (soldOut) {
            const list4 = newList.filter((product) => {
                if (soldOut.value) return product.sold_sale !== product.num_sale;
                else return product.sold_sale === product.num_sale;
            });
            newList = [...list4];
        }
        console.log('21sad', newList);
        newList === undefined ? setRows([]) : setRows(newList);
        //newList !== undefined && setRows(newList);
    };

    const handleChangeRate = (rateItem) => {
        setRate(rateItem);
    };

    const rateOptions = [1, 2, 3, 4, 5];

    const handleSearch = (value) => {
        setKeywords(value);
    };

    const handleShowFilter = () => {
        setShowFilter((prev) => !prev);
    };

    useEffect(() => {
        if (selectSort) {
            sortProduct(selectSort);
        }
    }, [selectSort]);

    const handleChangePrice = (option) => {
        setPrice(option);
    };

    const sortProduct = (sort) => {
        console.log('duc212a', rows);
        const newList = [...rows].sort((a, b) => {
            if (sort.value == 'current_sale_asc') {
                return a.current_sale - b.current_sale;
            } else if (sort.value == 'current_sale_desc') {
                return b.current_sale - a.current_sale;
            } else if (sort.value == 'num_asc') {
                return a.num_sale - b.num_sale;
            } else if (sort.value == 'num_desc') {
                return b.num_sale - a.num_sale;
            } else {
                return a.product.title.localeCompare(b.product.title);
            }
        });
        setRows(newList);
        console.log('duca', rows);
    };

    const handleChangeCategory = (value, option) => {
        setSelectCategory(option);
    };

    const handleSortChange = (value, option) => {
        setSelectSort(option);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('top')}>
                <h3
                    style={{
                        margin: '0 0 0 15px',
                        flex: 1,
                    }}
                >
                    FLASH SALE
                </h3>

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
                            width: '80%',
                            margin: '0 2% 0 0',
                            borderRadius: '6px',
                        }}
                    />

                    <AddOptionModal container={container1} />
                </div>
            </div>
            <div className="flex items-center justify-between px[20px] py-[10px] shadow-sm border rounded-[6px] my-[10px]">
                <div className="px-[20px] flex items-center">
                    <p className="text-[1.4rem] text-[#333] mr-[10px]">Sắp xếp theo: </p>
                    <Select
                        disabled={data?.flashsales?.length == 0}
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
                        // onSearch={handleSearch}
                        disabled={data?.flashsales?.length == 0}
                        className="w-[400px]"
                        placeholder="Tìm kiếm sản phẩm..."
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                <div className="px-[20px] flex items-center">
                    <Tippy
                        disabled={data?.flashsales?.length == 0}
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
                                                            Lặp: {status.label}
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
                                                            Trạng thái: {quantity.label}
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
                                            <h1 className="text-[1.3rem] text-[#333] uppercase font-[600]">Lặp</h1>
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
                                                Trạng thái
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
                                            <h1 className="text-[1.3rem] text-[#333] uppercase font-[600]">
                                                Tình trạng
                                            </h1>
                                            {soldOutOptions.map((option) => (
                                                <div key={option.label} className="p-[10px]">
                                                    <Checkbox
                                                        onChange={() => {
                                                            setSoldOut(option);
                                                        }}
                                                        checked={option.value === soldOut?.value}
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
            <div className={cx('content')}>
                <div className={cx('table')}>
                    <EnhancedTable
                        ischeckboxSelection={false}
                        columns={columns}
                        rows={rows.map((row, index) => ({
                            ...row,
                            rowNumber: index + 1,
                        }))}
                        func={setSuggestFlash}
                        isStatus={{
                            isToggle: isToggle,
                        }}
                        pageSize={12}
                        height="69.3vh"
                        type="flashsale"
                    />
                </div>
                <div className={cx('state')}>
                    {rows && <BarChartExample data={rows} func={setRows} setIsTime={[isTime, setIsTime]} />}{' '}
                </div>
            </div>
        </div>
    );
}

export default FlashSale;
