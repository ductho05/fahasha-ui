import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Statistics.module.scss';
import Widget from '../../components/Widget/Widget';
import ProgressChart from '../../components/charts/ProgressChart/ProgressChart';
import IncomeChart from '../../components/charts/IncomeChart/IncomeChart';
import { LineChart, Line, Tooltip, CartesianGrid, XAxis, YAxis } from 'recharts';
import DropMenu from '../../../components/DropMenu';
import OrdersLatesTable from '../../components/OrdersLatesTable/OrdersLatesTable';
import { api } from '../../../constants';
import axios from 'axios';
import { DatePicker, Space, Image, Button, Typography, message,  Alert, Spin  } from 'antd';
import { getAuthInstance } from '../../../utils/axiosConfig';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { set } from 'react-hook-form';
import BarChartExample from '../../components/charts/BarCharForStatic/BarCharForStatic';
import EnhancedTable from '../../components/Table/EnhancedTable';

const moment = require('moment-timezone');
const cx = classNames.bind(styles);
const { Text, Link } = Typography;

// fetch data

const options = [
    {
        title: '6 giờ gần nhất',
        value: 1,
    },
    {
        title: '6 ngày gần nhất',
        value: 2,
    },

    {
        title: '6 tuần gần nhất',
        value: 3,
    },
    {
        title: '6 tháng gần nhất',
        value: 4,
    },
    {
        title: '6 năm gần nhất',
        value: 5,
    },
];

// phần thưởng
const dataWidgets = [
    {
        top: '1',
        phanthuong: 'mã giảm giá 500K cho đơn hàng bất kỳ',
    },
    {
        top: '2',
        phanthuong: 'mã giảm giá 300K cho đơn hàng bất kỳ',
    },
    {
        top: '3',
        phanthuong: 'mã giảm giá 200K cho đơn hàng bất kỳ',
    },
    {
        top: '4 - 10',
        phanthuong: 'mã giảm giá 100K cho đơn hàng bất kỳ',
    },
];

// const dataIncomes = [
//     {
//         date: '31/7/2023',
//         value: 340,
//     },
//     {
//         date: '1/8/2023',
//         value: 500,
//     },
//     {
//         date: '2/8/2023',
//         value: 400,
//     },
//     {
//         date: '3/8/2023',
//         value: 900,
//     },
//     {
//         date: '4/8/2023',
//         value: 700,
//     },
//     {
//         date: '5/8/2023',
//         value: 990,
//     },
// ];
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

const formatDateToString = (date) => {
    if (date) {
        date = date.$d ? date.$d : date;
        const year = date.getUTCFullYear();
        const month = chuyenDoiThang(date.toString().slice(4, 7));
        const day = date.toString().slice(8, 10);
        const utcTimeString = `${year}-${month}-${day}`;
        return utcTimeString;
        // return date.toISOString().slice(0, 10); // Lấy YYYY-MM-DD
    }
    return ''; // Trả về chuỗi rỗng nếu date là null
};
function Statistics() {

    const authInstance = getAuthInstance();

    const [optionSelected, setOptionSelected] = useState(options[0]);
    const { RangePicker } = DatePicker;
    const dateFormat = 'YYYY/MM/DD';
    const [spin, setSpin] = useState(false);
    //const rangeValue = fieldsValue['range-picker'];
    const [doanhthucustom, setDoanhThuCustom] = useState(0);
    const [start, setStart] = useState(formatDateToString(new Date()));
    const [end, setEnd] = useState(formatDateToString(new Date()));
    const [numProduct, setNumProduct] = useState(5);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [maxProduct, setMaxProduct] = useState(0); // số lượng sản phẩm trong tháng
    const num = 5;
    const [rows, setRows] = useState([]);
    const moment = require('moment-timezone');
    // Đặt múi giờ cho Việt Nam
    const vietnamTimeZone = 'Asia/Ho_Chi_Minh';
    // Lấy thời gian hiện tại ở Việt Nam
    const currentTimeInVietnam = moment().tz(vietnamTimeZone);
    // Lấy số giờ hiện tại
    const currentHourInVietnam = currentTimeInVietnam.get('hours');
    const [dataIncomes, setDataIncomes] = useState([]);
    const [top_usert, setTopUser] = useState([]);
    const [top_products, setTopProducts] = useState([]);
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    const spaceSizeCol = [30, 150, 80, 80, 70, 60, 80, 30, 80, 160];
    const navigate = useNavigate();
    console.log('top_products212', top_products);
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
            field: 'user',
            headerName: 'Tên khách hàng',
            width: spaceSizeCol[1],
            sortable: false,
            editable: false,

            // renderCell: (params) => {
            //     return (
            //         <>
            //             <p className={cx('text-container')}>
            //                 {params.value.title ? params.value.title : '[Không có thông tin]'}
            //             </p>
            //         </>
            //     );
            // },
        },

        // {
        //     field: 'point_sale',
        //     headerName: 'Khung giờ',
        //     sortable: true,
        //     editable: false,
        //     width: spaceSizeCol[2],
        //     renderCell: (params) => {
        //         return (
        //             <p>{`${params.value * 3 < 10 ? `0${params.value * 3}` : params.value * 3}h - ${
        //                 (params.value + 1) * 3 < 10 ? `0${(params.value + 1) * 3}` : (params.value + 1) * 3
        //             }h`}</p>
        //         );
        //     },
        // },
        // {
        //     field: 'date_sale',
        //     headerName: 'Ngày sale',
        //     sortable: true,
        //     editable: false,
        //     width: spaceSizeCol[3],
        //     renderCell: (params) => {
        //         return <p>{params.value}</p>;
        //     },
        // },
        // {
        //     field: 'num_sale',
        //     headerName: 'Số lượng',
        //     sortable: true,
        //     editable: false,
        //     width: spaceSizeCol[4],
        // },
        // {
        //     field: 'sold_sale',
        //     headerName: 'Đã bán',
        //     sortable: true,
        //     editable: false,
        //     width: spaceSizeCol[5],
        // },

        // {
        //     field: 'current_sale',
        //     headerName: 'Đang sale',
        //     editable: false,
        //     sortable: true,
        //     width: spaceSizeCol[6],
        //     renderCell: (params) => {
        //         return <p>{params.value} %</p>;
        //     },
        // },
        // {
        //     field: 'is_loop',
        //     headerName: 'Lặp',
        //     editable: false,
        //     sortable: true,
        //     width: spaceSizeCol[7],
        //     renderCell: (params) => {
        //         return <p>{params.value === true ? 'Có' : 'Không'}</p>;
        //     },
        // },
        // {
        //     headerName: 'Trạng thái',
        //     sortable: false,
        //     editable: false,
        //     width: spaceSizeCol[8],
        //     renderCell: (params) => {
        //         const currentDate = new Date();
        //         let current_point_sale = Math.floor(currentHourInVietnam / 3);
        //         const year = currentDate.getUTCFullYear();
        //         const month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');
        //         const day = currentDate.toString().slice(8, 10);
        //         const utcTimeString = `${year}-${month}-${day}`;
        //         let toDay = utcTimeString;

        //         return (
        //             <p
        //                 className={
        //                     params.row.date_sale == toDay && params.row.point_sale == current_point_sale
        //                         ? cx('flashSaleText')
        //                         : params.row.date_sale > toDay ||
        //                           (params.row.date_sale == toDay && params.row.point_sale > current_point_sale)
        //                         ? cx('noflashSaleText')
        //                         : cx('')
        //                 }
        //             >
        //                 {params.row.date_sale == toDay && params.row.point_sale == current_point_sale
        //                     ? 'FlashSale'
        //                     : params.row.date_sale > toDay ||
        //                       (params.row.date_sale == toDay && params.row.point_sale > current_point_sale)
        //                     ? 'Đang đợi'
        //                     : 'Hết hạn'}
        //             </p>
        //         );
        //     },
        // },
        // {
        //     field: 'action',
        //     headerName: 'Hành động',
        //     sortable: true,
        //     editable: false,
        //     headerAlign: 'marginLeft',
        //     width: spaceSizeCol[9],
        //     // renderCell: (params) => {
        //     //     const currentDate = new Date();

        //     //     let current_point_sale = Math.floor(currentHourInVietnam / 3);
        //     //     const year = currentDate.getUTCFullYear();
        //     //     const month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');
        //     //     const day = currentDate.toString().slice(8, 10);
        //     //     const utcTimeString = `${year}-${month}-${day}`;
        //     //     let toDay = utcTimeString;

        //     //     return (
        //     //         <>
        //     //             <Button
        //     //                 type="primary"
        //     //                 ghost
        //     //                 style={{
        //     //                     margin: '0 10px 0 0',
        //     //                 }}
        //     //                 onClick={() => {
        //     //                     navigate(`/admin/flashsale/${params.row._id}`);
        //     //                 }}
        //     //             >
        //     //                 Chi tiết
        //     //             </Button>

        //     //             <CustomPopconfirm
        //     //                 title="Xóa flashsale?"
        //     //                 description="Không hiển thị lại thông báo này"
        //     //                 props={{
        //     //                     disable:
        //     //                         params.row.date_sale == toDay && params.row.point_sale == current_point_sale
        //     //                             ? true
        //     //                             : params.row.date_sale > toDay ||
        //     //                               (params.row.date_sale == toDay && params.row.point_sale > current_point_sale)
        //     //                             ? false
        //     //                             : false,
        //     //                     isloadingdelete: isloadingdelete,
        //     //                 }}
        //     //                 func={() => {
        //     //                     setIsloadingdetele(true);
        //     //                     fetch(`${api}/flashsales/delete/${params.row._id}`, {
        //     //                         method: 'GET',
        //     //                     })
        //     //                         .then((response) => response.json())
        //     //                         .then((result) => {
        //     //                             if (result.status == 'OK') {
        //     //                                 //localStorage.setItem('isFlashsaleLoading', true);
        //     //                                 setData({
        //     //                                     ...JSON.parse(data),
        //     //                                     flashsales: JSON.parse(data).flashsales.filter(
        //     //                                         (item) => item._id != params.row._id,
        //     //                                     ),
        //     //                                 });
        //     //                                 setRows(
        //     //                                     JSON.parse(data).flashsales.filter(
        //     //                                         (item) => item._id != params.row._id,
        //     //                                     ),
        //     //                                 );
        //     //                             }
        //     //                             setIsloadingdetele(false);
        //     //                         })
        //     //                         .catch((err) => console.log(err));
        //     //                 }}
        //     //             />
        //     //         </>
        //     //     );
        //     // },
        // },
    ];
    const addCommasToNumber = (number) => {
        // Chuyển đổi số thành chuỗi
        const numberString = number.toString();

        // Tìm vị trí của dấu chấm (nếu có)
        const dotIndex = numberString.indexOf('.');

        // Nếu không có dấu chấm, thì chia chuỗi thành mảng các chữ số
        const integerPart = dotIndex === -1 ? numberString : numberString.slice(0, dotIndex);

        // Thêm dấu phẩy sau mỗi ba chữ số từ cuối mảng về đầu
        const formattedIntegerPart = integerPart
            .split('')
            .reverse()
            .map((digit, index) => (index > 0 && index % 3 === 0 ? digit + ',' : digit))
            .reverse()
            .join('');

        // Nếu có dấu chấm, thì kết hợp phần nguyên và phần thập phân
        const formattedNumber =
            dotIndex === -1 ? formattedIntegerPart : formattedIntegerPart + numberString.slice(dotIndex);

        return formattedNumber;
    };

    const info = (type, content) => {
        messageApi.open({
            type: type,
            content: content,
        });
    };

    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        setSpin(true);
        authInstance.get(`/orderitems`).then((res) => {
            const today = new Date();
            // lấy tất cả những đơn hàng trong tháng này
            const orderitems = res.data.data;

            const ordersThisMonth = orderitems.filter((order) => {
                if (order.order != null) {
                    return (
                        formatDateToString(new Date(order.order.date)) <=
                            formatDateToString(
                                new Date(today.getFullYear(), month ? month + 1 : today.getMonth() + 1, 0),
                            ) &&
                        formatDateToString(new Date(order.order.date)) >=
                            formatDateToString(new Date(today.getFullYear(), month ? month : today.getMonth(), 1))
                    );
                }
            });
            console.log('ordersThis12Mon21th', ordersThisMonth);
            // lấy ra doanh thu của từng sản phẩm trong tháng
            const productOrdersThisMonth = [];
            const product = [];
            // {
            //     avatar: 'A',
            //     name: 'phan van duc anh',
            //     value: 250,
            // },
            ordersThisMonth.forEach((element) => {
                if (productOrdersThisMonth.includes(element.product._id)) {
                    product[productOrdersThisMonth.indexOf(element.product._id)].value += element.price;
                    product[productOrdersThisMonth.indexOf(element.product._id)].orders.push(element.order);
                } else {
                    productOrdersThisMonth.push(element.product._id);
                    product.push({
                        id: element.product._id,
                        avatar: element.product.images,
                        name: element.product.title,
                        value: element.price,
                        orders: [element.order],
                    });
                }
            });

            // sắp xếp theo thứ tự giảm dần
            product.sort((a, b) => {
                return b.value - a.value;
            });
            setMaxProduct(product.length);
            // lấy 5 sản phẩm đầu tiên
            product.splice(numProduct, product.length - numProduct);

            setTopProducts(product);
            setSpin(false);
        });
    }, [isLoadingProduct]);

    useEffect(() => {
        authInstance.get(`/orders`).then((res) => {
            const today = new Date();
            const orders = res.data.data;
            console.log('ord1212ers', orders);
            console.log('star2121t', start, end);

            // lấy ra những đơn hàng trong tháng này
            const ordersThisMonth = orders.filter((order) => {
                return (
                    formatDateToString(new Date(order.date)) <= formatDateToString(today) &&
                    formatDateToString(new Date(order.date)) >=
                    formatDateToString(new Date(today.getFullYear(), today.getMonth(), 1))
                );
            });

            console.log('ordersThisMonth', ordersThisMonth);
            // lấy ra doanh thu của từng người trong tháng
            const userOrdersThisMonth = [];
            const user = [];
            // {
            //     avatar: 'A',
            //     name: 'phan van duc anh',
            //     value: 250,
            // },
            ordersThisMonth.forEach((element) => {
                if (userOrdersThisMonth.includes(element.user.id)) {
                    user[userOrdersThisMonth.indexOf(element.user.id)].value += element.price;
                } else {
                    userOrdersThisMonth.push(element.user.id);
                    user.push({
                        avatar: element.user.images,
                        name: element.user.fullName,
                        value: element.price,
                    });
                }
            });
            // sắp xếp theo thứ tự giảm dần
            user.sort((a, b) => {
                return b.value - a.value;
            });

            // lấy 10 người đầu tiên
            user.splice(10, user.length - 10);
            setTopUser(user);

            const ordersToday = orders.filter((order) => {
                return (
                    formatDateToString(new Date(order.date)) <= end && formatDateToString(new Date(order.date)) >= start
                );
            });

            console.log('ordersToda1212y', ordersToday);
            const totalToday = ordersToday.reduce((total, order) => {
                return total + order.price;
            }, 0);
            setDoanhThuCustom(totalToday);

            if (optionSelected.title == '6 ngày gần nhất') {
                const incomeData = [];
                // toi muon lặp 6 lần
                for (let i = num + 1; i >= 0; i--) {
                    const customday = new Date();
                    customday.setDate(customday.getDate() - i);
                    const orderscustom = orders.filter((order) => {
                        return formatDateToString(new Date(order.date)) == formatDateToString(customday);
                    });
                    const totalToday = orderscustom.reduce((total, order) => {
                        return total + order.price;
                    }, 0);
                    incomeData.push({
                        date: formatDateToString(customday),
                        value: totalToday,
                    });
                }
                setDataIncomes(incomeData);
            } else if (optionSelected.title == '6 giờ gần nhất') {
                const incomeData = [];
                // toi muon lặp 6 lần
                for (let i = num + 1; i >= 0; i--) {
                    const customday = new Date();
                    // Đặt múi giờ cho Việt Nam
                    const vietnamTimeZone = 'Asia/Ho_Chi_Minh';
                    // Lấy thời gian hiện tại ở Việt Nam
                    const currentTimeInVietnam = moment().tz(vietnamTimeZone).get('hour') - i;
                    console.log('currentTimeInVietnam', currentTimeInVietnam);
                    //customday.setDate(customday.getDate() - i);
                    if (currentTimeInVietnam < 0) {
                        currentTimeInVietnam = currentTimeInVietnam + 24;
                        customday.setDate(customday.getDate() - 1);
                    }
                    const orderscustom = orders.filter((order) => {
                        //console.log('order.date', order?.date);
                        console.log('order.date2', order?.date?.slice(11, 13));
                        return (
                            order?.date?.slice(11, 13) == currentTimeInVietnam &&
                            formatDateToString(new Date(order.date)) == formatDateToString(customday)
                        );
                    });
                    const totalToday = orderscustom.reduce((total, order) => {
                        return total + order.price;
                    }, 0);
                    console.log('totalTod212ay1213', totalToday);
                    incomeData.push({
                        date: currentTimeInVietnam + 'h',
                        value: totalToday,
                    });
                }
                setDataIncomes(incomeData);
            } else if (optionSelected.title == '6 tuần gần nhất') {
                console.log('optionSelected1212', optionSelected);
                const incomeData = [];
                // toi muon lặp 6 lần
                for (let i = num; i >= 0; i--) {
                    // lấy giá trị ngày thứ 2 tuần trước
                    const date = new Date();
                    const day = date.getDay();
                    const diff = date.getDate() - day + (day == 0 ? -6 : 1) - 7;
                    const mondaylast = new Date(new Date().setDate(diff - 7 * i));
                    const sundaylast = new Date(new Date().setDate(diff - 7 * i + 6));
                    console.log('11321', diff, mondaylast, sundaylast);
                    const orderscustom = orders.filter((order) => {
                        // lấy giá trị thứ 2 tuần sau
                        // const mondaynext = new Date(date.setDate(diff + 14));
                        // console.log('mondaylast', mondaylast, sundaylast, mondaynext);
                        // in ra những đơn hàng trong tuần trước
                        return (
                            formatDateToString(new Date(order.date)) >= formatDateToString(mondaylast) &&
                            formatDateToString(new Date(order.date)) <= formatDateToString(sundaylast)
                        );
                    });
                    const totalToday = orderscustom.reduce((total, order) => {
                        return total + order.price;
                    }, 0);
                    incomeData.push({
                        date: formatDateToString(mondaylast) + '->' + formatDateToString(sundaylast),
                        value: totalToday,
                    });
                }
                const date = new Date();
                const day = date.getDay();
                const diff = date.getDate() - day + (day == 0 ? -6 : 1) - 7;
                const mondaylast = new Date(date.setDate(diff + 7));
                const orderscustom = orders.filter((order) => {
                    // lấy giá trị thứ 2 tuần sau
                    // const mondaynext = new Date(date.setDate(diff + 14));
                    // console.log('mondaylast', mondaylast, sundaylast, mondaynext);
                    // in ra những đơn hàng trong tuần trước
                    return (
                        formatDateToString(new Date(order.date)) >= formatDateToString(mondaylast) &&
                        formatDateToString(new Date(order.date)) <= formatDateToString(today)
                    );
                });
                const totalToday = orderscustom.reduce((total, order) => {
                    return total + order.price;
                }, 0);
                incomeData.push({
                    date: formatDateToString(mondaylast) + '->' + formatDateToString(today),
                    value: totalToday,
                });
                console.log('incomeData', incomeData);
                setDataIncomes(incomeData);
            } else if (optionSelected.title == '6 tháng gần nhất') {
                console.log('optionSelected1212', optionSelected);
                const incomeData = [];
                // toi muon lặp 6 lần
                for (let i = num + 1; i >= 1; i--) {
                    // lấy giá trị ngày thứ 2 tuần trước
                    const date = new Date();
                    const firstDay = new Date(date.getFullYear(), date.getMonth() - i, 1);
                    const lastDay = new Date(date.getFullYear(), date.getMonth() - i + 1, 0);
                    console.log('firstDay232223233', formatDateToString(firstDay), formatDateToString(lastDay));

                    const orderscustom = orders.filter((order) => {
                        // lấy giá trị thứ 2 tuần sau
                        // const mondaynext = new Date(date.setDate(diff + 14));
                        // console.log('mondaylast', mondaylast, sundaylast, mondaynext);
                        // in ra những đơn hàng trong tuần trước
                        return (
                            formatDateToString(new Date(order.date)) >= formatDateToString(firstDay) &&
                            formatDateToString(new Date(order.date)) <= formatDateToString(lastDay)
                        );
                    });
                    const totalToday = orderscustom.reduce((total, order) => {
                        return total + order.price;
                    }, 0);
                    incomeData.push({
                        date: 'T' + (date.getMonth() - i + 1),
                        value: totalToday,
                    });
                }
                const date = new Date();
                const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                console.log('firstDay2322121223233', formatDateToString(firstDay));
                const orderscustom = orders.filter((order) => {
                    // lấy giá trị thứ 2 tuần sau
                    // const mondaynext = new Date(date.setDate(diff + 14));
                    // console.log('mondaylast', mondaylast, sundaylast, mondaynext);
                    // in ra những đơn hàng trong tuần trước
                    return (
                        formatDateToString(new Date(order.date)) >= formatDateToString(firstDay) &&
                        formatDateToString(new Date(order.date)) <= formatDateToString(today)
                    );
                });
                const totalToday = orderscustom.reduce((total, order) => {
                    return total + order.price;
                }, 0);
                incomeData.push({
                    date: 'T' + (date.getMonth() + 1),
                    value: totalToday,
                });
                console.log('incomeData', incomeData);
                setDataIncomes(incomeData);
            } else if (optionSelected.title == '6 năm gần nhất') {
                console.log('optionSelected1212', optionSelected);
                const incomeData = [];
                // toi muon lặp 6 lần
                for (let i = num + 1; i >= 1; i--) {
                    const date = new Date();
                    // lấy giá trị ngày thứ 2 tuần trước
                    const firstDay = new Date(new Date().getFullYear() - i, 0, 1);
                    // ngày cuối của năm
                    const lastDay = new Date(new Date().getFullYear() - i, 11, 31);
                    console.log('first232Day2323', formatDateToString(firstDay), formatDateToString(lastDay));

                    const orderscustom = orders.filter((order) => {
                        // lấy giá trị thứ 2 tuần sau
                        // const mondaynext = new Date(date.setDate(diff + 14));
                        // console.log('mondaylast', mondaylast, sundaylast, mondaynext);
                        // in ra những đơn hàng trong tuần trước
                        return (
                            formatDateToString(new Date(order.date)) >= formatDateToString(firstDay) &&
                            formatDateToString(new Date(order.date)) <= formatDateToString(lastDay)
                        );
                    });
                    const totalToday = orderscustom.reduce((total, order) => {
                        return total + order.price;
                    }, 0);
                    incomeData.push({
                        date: new Date().getFullYear() - i,
                        value: totalToday,
                    });
                }
                const date = new Date();
                const firstDay = new Date(date.getFullYear(), 1, 1);
                const orderscustom = orders.filter((order) => {
                    // lấy giá trị thứ 2 tuần sau
                    // const mondaynext = new Date(date.setDate(diff + 14));
                    // console.log('mondaylast', mondaylast, sundaylast, mondaynext);
                    // in ra những đơn hàng trong tuần trước
                    return (
                        formatDateToString(new Date(order.date)) >= formatDateToString(firstDay) &&
                        formatDateToString(new Date(order.date)) <= formatDateToString(today)
                    );
                });
                const totalToday = orderscustom.reduce((total, order) => {
                    return total + order.price;
                }, 0);
                incomeData.push({
                    date: new Date().getFullYear(),
                    value: totalToday,
                });
                console.log('incomeData', incomeData);
                setDataIncomes(incomeData);
            }
        });
    }, [end, start, optionSelected.title]);
    return (
        <div className={cx('wrapper')}>
            {contextHolder}
            {/* <div className={cx('widgits')}>
                {dataWidgets.map((widget, index) => (
                    <Widget key={index} widget={widget} />
                ))}
            </div> */}
            <div className={cx('chart')}>
                <div className={cx('left')}>
                    <ProgressChart />
                    <div className={cx('filter')}>
                        <p className={cx('content')}>Doanh thu trong khoảng</p>
                        <RangePicker
                            style={{
                                width: '58%',
                            }}
                            defaultValue={[
                                dayjs(formatDateToString(new Date()), dateFormat),
                                dayjs(formatDateToString(new Date()), dateFormat),
                            ]}
                            format={dateFormat}
                            onChange={(e) => {
                                setStart(formatDateToString(e[0]));
                                setEnd(formatDateToString(e[1]));
                            }}
                        />
                        <div className={cx('total_custom')}>
                            {doanhthucustom.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            })}{' '}
                        </div>
                    </div>
                </div>
                <div className={cx('right')}>
                    <div className={cx('heading')}>
                        <h3 className={cx('income_title')}>Biểu đồ doanh thu gần đây</h3>
                        <DropMenu
                            options={options}
                            size="small"
                            optionSelected={optionSelected}
                            setOptionSelected={(e) => {
                                setOptionSelected(e);
                            }}
                        />
                    </div>
                    <div className={cx('income')}>
                        <LineChart width={700} height={350} data={dataIncomes} animation={{ duration: 1000 }}>
                            <Line type="monotone" dataKey="value" stroke="#8884d8" />
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            <Tooltip // sửa lại nội dung tooltip
                                formatter={(value) => {
                                    return value.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    });
                                }}
                            />

                            <XAxis dataKey="date" tick={{ fontSize: 15, fontFamily: 'Arial', textAnchor: 'middle' }} />
                            <YAxis
                                tick={{
                                    fontSize: 15,
                                    fontFamily: 'Arial',
                                }}
                                tickFormatter={(value) => addCommasToNumber(value / 1000) + 'k'}
                            />
                        </LineChart>
                        {/* <IncomeChart data={dataIncomes} size={2 / 1} customValueDisplay={(value) => `$${value}`} /> */}
                    </div>
                </div>
            </div>

            <div className={cx('bottom')}>
                <div className={cx('user_static')}>
                    <div className={cx('left')}>
                        <h3 className={cx('title')}>KHÁCH HÀNG THÂN THIẾT THÁNG {new Date().getMonth() + 1}</h3>
                        <div className={cx('content_user')}>
                            {top_usert.map((user, index) => (
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
                                    <div className={cx('avatar')}>
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
                                    <div className={cx('name')}>{user.name}</div>
                                    <div className={cx('value')}>
                                        {addCommasToNumber(Math.ceil(user.value / 1000))}K
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={cx('right')}>
                        <h3 className={cx('title')}>TRI ÂN KHÁCH HÀNG</h3>
                        <div className={cx('content_user')}>
                            <div className={cx('header')}>
                                Trao quà cho top người dùng trên hệ thống vào cuối tháng {new Date().getMonth() + 1}
                            </div>
                            <div className={cx('body')}>
                                {dataWidgets.map((widget, index) => (
                                    <div className={cx('phanthuong')} key={index}>
                                        <div className={cx('index')}>
                                            <li
                                                style={{
                                                    color:
                                                        index == 0
                                                            ? '#f44336'
                                                            : index == 1
                                                            ? '#ff9800'
                                                            : index == 2
                                                            ? '#ffc107'
                                                            : '#4caf50',
                                                }}
                                            >
                                                Top {widget.top}: {widget.phanthuong}
                                            </li>
                                        </div>
                                        <div
                                            className={cx('btn_trao')}
                                            onClick={() => {
                                                const today = new Date();
                                                // giá trị ngày cuối tháng
                                                const newDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

                                                if (formatDateToString(today) != formatDateToString(newDate)) {
                                                    info(
                                                        'warning',
                                                        `Chỉ được trao quà vào ngày ${formatDateToString(newDate)}`,
                                                    );
                                                }
                                                // const user = top_usert[index];
                                                else info('success', 'Trao quà thành công');
                                            }}
                                        >
                                            <div className={cx('btn')}>Trao quà</div>
                                        </div>{' '}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* <span className={cx('line')}></span> */}
                <div className={cx('product_static')}>
                    {' '}
                    <div className={cx('right')}>
                        <div className={cx('state')}>
                            {
                                <BarChartExample
                                    spin={spin}
                                    setTimeMonth={setMonth}
                                    setTimeYear={setYear}
                                    maxProduct={maxProduct}
                                    setNumProduct={setNumProduct}
                                    data={top_products.map((item) => {
                                        return {
                                            id: item?.id,
                                            name: item?.name,
                                            sold: item?.value,
                                            imageURL: item?.avatar,
                                        };
                                    })}
                                    isLoadingProduct={isLoadingProduct}
                                    setIsLoadingProduct={setIsLoadingProduct}
                                />
                            }
                        </div>
                    </div>
                    <div className={cx('left')}>
                        <h3 className={cx('title')}>
                            TOP {numProduct} SẢN PHẨM CÓ DOANH THU CAO TRONG THÁNG {month}/{year}
                        </h3>
                        <div className={cx('content_user')}>
                            {spin ? (
                                <div
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        margin: 'auto',
                                    }}
                                >
                                    <Spin size="large"></Spin>{' '}
                                </div>
                            ) : top_products.length == 0 ? (
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
                                        <div className={cx('avatar')}>
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
                                        <div className={cx('name')}>{user.name}</div>
                                        <div className={cx('value')}>
                                            {addCommasToNumber(Math.ceil(user.value / 1000))}K
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                <div className={cx('table')}>
                    <EnhancedTable
                        ischeckboxSelection={false}
                        columns={columns}
                        rows={rows.map((row, index) => ({
                            ...row,
                            rowNumber: index + 1,
                        }))}
                        // func={setSuggestFlash}
                        // isStatus={{
                        //     isToggle: isToggle,
                        // }}
                        pageSize={12}
                    />
                </div>
            </div>
        </div>
    );
}

export default Statistics;
