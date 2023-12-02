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
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import { set } from 'react-hook-form';
const moment = require('moment-timezone');
const cx = classNames.bind(styles);

// fetch data
const dataWidgets = [
    {
        title: 'Người dùng',
        type: 'users',
        value: 250,
        percent: 0.05,
    },
    {
        title: 'Đơn hàng',
        type: 'orders',
        value: 1000,
        percent: -0.03,
    },
    {
        title: 'Thu nhập',
        type: 'earnings',
        value: 10000000,
        percent: 0.12,
    },
    {
        title: 'Đánh giá',
        type: 'reviews',
        value: 20,
        percent: -0.01,
    },
];

const options = [
    {
        title: '6 giờ gần nhất',
        value: 'createdAt',
        type: 'desc',
    },
    {
        title: '6 ngày gần nhất',
        value: 'createdAt',
        type: 'desc',
    },
    {
        title: '6 tuần gần nhất',
        value: 'createdAt',
        type: 'desc',
    },
    {
        title: '6 tháng gần nhất',
        value: 'createdAt',
        type: 'desc',
    },
    {
        title: '6 năm gần nhất',
        value: 'createdAt',
        type: 'desc',
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
    const [optionSelected, setOptionSelected] = useState(options[0]);
    const { RangePicker } = DatePicker;
    const dateFormat = 'YYYY/MM/DD';
    //const rangeValue = fieldsValue['range-picker'];
    const [doanhthucustom, setDoanhThuCustom] = useState(0);
    const [start, setStart] = useState(formatDateToString(new Date()));
    const [end, setEnd] = useState(formatDateToString(new Date()));
    const num = 5;
    const [dataIncomes, setDataIncomes] = useState([]);
    console.log('totalToday1213', dataIncomes);
    console.log('optionSelected1212', 'a');

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

    useEffect(() => {
        axios.get(`${api}/orders`).then((res) => {
            const today = new Date();
            const orders = res.data.data;
            const ordersToday = orders.filter((order) => {
                return (
                    formatDateToString(new Date(order.date)) <= end && formatDateToString(new Date(order.date)) >= start
                );
            });
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
            <div className={cx('widgits')}>
                {dataWidgets.map((widget, index) => (
                    <Widget key={index} widget={widget} />
                ))}
            </div>
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
                        <LineChart width={700} height={400} data={dataIncomes} animation={{ duration: 1000 }}>
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

                            <XAxis
                                dataKey="date"
                                // tickFormatter={(value, index) => {
                                //     if (optionSelected.title == '6 ngày gần nhất') {
                                //         return value.slice(8, 10) + '/' + value.slice(5, 7);
                                //     }
                                //     else if (optionSelected.title == '6 tuần gần nhất') {
                                //         return  value
                                //     //         value.slice(8, 10) +
                                //     //         '/' +
                                //     //         value.slice(5, 7) +
                                //     //         '-' +
                                //     //         value.slice(20, 22) +
                                //     //         '/' +
                                //     //         value.slice(17, 19)
                                //     //     );
                                //     }
                                //     else if (optionSelected.title == '6 tháng gần nhất') {
                                //         return value;
                                //     } else if (optionSelected.title == '6 năm gần nhất') {
                                //         return value;
                                //     }
                                // }}
                                tick={{ fontSize: 15, fontFamily: 'Arial', textAnchor: 'middle' }}
                            />
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

            <div className={cx('table')}>
                <OrdersLatesTable rows={[]} />
            </div>
        </div>
    );
}

export default Statistics;
