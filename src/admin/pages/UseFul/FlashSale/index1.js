import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { api } from '../../../../constants';
import styles from './FlashSale.module.scss';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import EnhancedTable from '../../../components/Table/EnhancedTable';
import StateFlashSale from '../../../components/StateFlashSale';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AddOptionModal from '../../../components/AddOptionModal';
import lottie from 'lottie-web';
import { Divider, Form, Rate, Button, Checkbox, Radio, Skeleton, Space, Switch, Alert, Select, Input } from 'antd';
import BarChartExample from '../../../components/charts/BarChar/BarChar';
import CustomPopconfirm from '../../../components/CustomPopconfirm/CustomPopconfirm';
import Marquee from 'react-fast-marquee';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { CloseOutlined, FilterOutlined, EditOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Wrapper as PopperWrapper } from '../../../../components/Popper';
import { useData } from '../../../../stores/DataContext';
import { getAuthInstance } from '../../../../utils/axiosConfig';
function FlashSale() {
    const container1 = useRef(null);
    const authInstance = getAuthInstance();
    const navigate = useNavigate();
    const cx = classNames.bind(styles);
    const { data, setData } = useData();
    const moment = require('moment-timezone');
    // Đặt múi giờ cho Việt Nam
    const vietnamTimeZone = 'Asia/Ho_Chi_Minh';
    const [keywords, setKeywords] = useState(null);
    // Lấy thời gian hiện tại ở Việt Nam
    const currentTimeInVietnam = moment().tz(vietnamTimeZone);
    const [selectCategory, setSelectCategory] = useState(null);
    const [selectSort, setSelectSort] = useState(null);
    const [price, setPrice] = useState(null);
    const [rate, setRate] = useState(null);
    const [options, setOptions] = useState([]);

    //const [selectCategory, setSelectCategory] = useState(null);
    //const [selectSort, setSelectSort] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    //const [keywords, setKeywords] = useState(null);
    const [status, setStatus] = useState(null);
    const [quantity, setQuantity] = useState(null);

    // Lấy số giờ hiện tại
    const currentHourInVietnam = currentTimeInVietnam.get('hours');

    lottie.loadAnimation({
        container: container1.current, // Thay container2.current bằng document.getElementById nếu bạn không sử dụng useRef.
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: require('../../../../assets/json/customAddFlashSale.json'),
    });

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
    const spaceSizeCol = [30, 150, 80, 80, 70, 60, 80, 30, 80, 160];
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
                    <>
                        <p className={cx('text-container')}>
                            {params?.value?.title ? params.value?.title : '[Không có thông tin]'}
                        </p>
                    </>
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
                const currentDate = new Date();
                let current_point_sale = Math.floor(currentHourInVietnam / 3);
                const year = currentDate.getUTCFullYear();
                const month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');
                const day = currentDate.toString().slice(8, 10);
                const utcTimeString = `${year}-${month}-${day}`;
                let toDay = utcTimeString;

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
                const currentDate = new Date();

                let current_point_sale = Math.floor(currentHourInVietnam / 3);
                const year = currentDate.getUTCFullYear();
                const month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');
                const day = currentDate.toString().slice(8, 10);
                const utcTimeString = `${year}-${month}-${day}`;
                let toDay = utcTimeString;

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

    const [suggestFlash, setSuggestFlash] = useState([]);

    const [isToggle, setIsToggle] = useState(false); // khi bấm nút tiếp tục thì gọi hàm này để \tắt chọn những sản phẩm đã chọn

    const [rows, setRows] = useState([]);
    useEffect(() => {
        if (Object.keys(data).length !== 0) {
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
    }, []);

    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const sortOptions = [
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
        setRows(data?.products);
    };

    const handleSearch = (value) => {
        setKeywords(value);
    };

    const sortProduct = (sort) => {
        const newList = [...data?.products].sort((a, b) => {
            if (sort.value == 'price_asc') {
                return a.price - b.price;
            } else if (sort.value == 'price_desc') {
                return b.price - a.price;
            } else if (sort.value == 'rate_asc') {
                return a.rate - b.rate;
            } else {
                return b.rate - a.rate;
            }
        });

        setRows(newList);
    };

    const filterProduct = (rate, price, category, keywords, quantity, status) => {
        let newList = data?.products?.filter((product) => {
            if (keywords) {
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
        setRows(newList);
    };

    useEffect(() => {
        filterProduct(rate, price, selectCategory, keywords, quantity, status);
    }, [rate, price, selectCategory, keywords, quantity, status]);

    useEffect(() => {
        if (selectSort) {
            sortProduct(selectSort);
        }
    }, [selectSort]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('top')}>
                <p
                    style={{
                        margin: '0 0 0 15px',
                        flex: 1.3,
                    }}
                >
                    FLASH SALE
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
                            width: '80%',
                            margin: '0 4% 0 0',
                            borderRadius: '6px',
                        }}
                    />

                    <AddOptionModal container={container1} />
                </div>
            </div>
            {/* a
            <div className="flex items-center justify-between px[20px] py-[10px] shadow-sm border rounded-[6px] my-[20px]">
                <div className="px-[20px] flex items-center">
                    <p className="text-[1.4rem] text-[#333] mr-[10px]">Sắp xếp theo: </p>
                    <Select
                        className="w-[200px]"
                        placeholder="Chọn..."
                        options={sortOptions}
                        onChange={handleSortChange}
                    />
                </div>
                <div className="px-[20px] flex items-center">
                    <Input.Search onSearch={handleSearch} className="w-[400px]" placeholder="Tìm kiếm sản phẩm..." />
                </div>
                <div className="px-[20px] flex items-center">
                    <Tippy
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
            </div> */}
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
                    />
                </div>
                <div className={cx('state')}>{rows && <BarChartExample data={rows} />}</div>
            </div>
        </div>
    );
}

export default FlashSale;
