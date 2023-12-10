import classNames from 'classnames/bind';
import styles from './ProgressChart.module.scss';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../../../../constants';
import { Modal, Button, Form, Input, Select, Radio, Checkbox, Typography } from 'antd';
import { getAuthInstance } from "../../../../utils/axiosConfig"

const { Option } = Select;
const { Text } = Typography;
const cx = classNames.bind(styles);

function ProgressChart() {

    const authInstance = getAuthInstance()

    const [doanhThu, setDoanhThu] = useState(0);
    const [doanhThuHomQua, setDoanhThuHomQua] = useState(0);
    const [doanhThuNgay, setDoanhThuNgay] = useState(0);
    const [doanhThuTuan, setDoanhThuTuan] = useState(0);
    const [doanhThuThang, setDoanhThuThang] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRun, setIsRun] = useState(false);
    const [kpi, setKPI] = useState('');

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

    const handleKPIChange = (e) => {
        // Loại bỏ dấu phẩy hiện tại (nếu có) và chỉ giữ lại số
        const inputValue = e.target.value.replace(/,/g, '');
        // Định dạng số với dấu phẩy sau mỗi ba chữ số
        const formattedValue = addCommasToNumber(inputValue);
        setKPI(formattedValue);
    };
    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 10,
        },
    };
    const tailLayout = {
        wrapperCol: {
            offset: 10,
            span: 20,
        },
    };
    const [form] = Form.useForm();

    const onFinish = (values) => {
        values = {
            ...values,
            kpi: values.kpi.replace(/,/g, ''),
            isRun,
        };
        console.log('Success:', values);
    };
    const onReset = () => {
        form.resetFields();
        setIsRun(false);
        setKPI('');
    };
    const formatDateToString = (date) => {
        if (date) {
            date = date.$d ? date.$d : date;
            const year = date.getUTCFullYear();
            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const day = date.toString().slice(8, 10);
            const utcTimeString = `${year}-${month}-${day}`;
            return utcTimeString;
            // return date.toISOString().slice(0, 10); // Lấy YYYY-MM-DD
        }
        return ''; // Trả về chuỗi rỗng nếu date là null
    };
    useEffect(() => {
        authInstance
            .get(`/orders`)
            .then((res) => {
                const orders = res.data.data;
                //console.log('orders', orders[7].createdAt);
                // chuyển sang giờ đông dương
                orders.forEach((order) => {
                    console.log('order123', order.date, formatDateToString(new Date(order.date)));
                    // ngày hôm qua
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    // in ra
                    console.log('yesterday', formatDateToString(yesterday));
                });

                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                const lastWeek = new Date(today);
                lastWeek.setDate(lastWeek.getDate() - 7);
                const lastMonth = new Date(today);
                lastMonth.setDate(lastMonth.getDate() - 30);
                const ordersToday = orders.filter((order) => {
                    return formatDateToString(new Date(order.date)) === formatDateToString(today);
                });
                const ordersYesterday = orders.filter((order) => {
                    return formatDateToString(new Date(order.date)) === formatDateToString(yesterday);
                });

                const ordersLastWeek = orders.filter((order) => {
                    // lấy giá trị ngày thứ 2 tuần trước
                    const date = new Date();
                    const day = date.getDay();
                    const diff = date.getDate() - day + (day == 0 ? -6 : 1) - 7;
                    const mondaylast = new Date(date.setDate(diff));
                    const sundaylast = new Date(date.setDate(diff + 6));
                    console.log('mondaylast', mondaylast, sundaylast);
                    // in ra những đơn hàng trong tuần trước
                    return (
                        formatDateToString(new Date(order.date)) >= formatDateToString(mondaylast) &&
                        formatDateToString(new Date(order.date)) <= formatDateToString(sundaylast)
                    );
                });
                const ordersLastMonth = orders.filter((order) => {
                    // lấy giá trị ngày đầu tháng trước
                    const date = new Date();
                    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                    const lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
                    console.log('firstDay', formatDateToString(firstDay), formatDateToString(lastDay));
                    // in ra những đơn hàng trong tháng trước
                    return (
                        formatDateToString(new Date(order.date)) >= formatDateToString(firstDay) &&
                        formatDateToString(new Date(order.date)) <= formatDateToString(lastDay)
                    );
                });
                // console.log('ordersToday', ordersToday);
                console.log('ordersYesterday', ordersYesterday);
                // console.log('ordersLastWeek', ordersLastWeek);
                // console.log('ordersLastMonth', ordersLastMonth);
                const totalToday = ordersToday.reduce((total, order) => {
                    return total + order.price;
                }, 0);
                console.log('totalToday', totalToday);
                setDoanhThuNgay(totalToday);
                // console.log('totalToday', totalToday);
                const totalYesterday = ordersYesterday.reduce((total, order) => {
                    return total + order.price;
                }, 0);
                console.log('totalYesterday', totalYesterday);
                setDoanhThuHomQua(totalYesterday);
                const totalLastWeek = ordersLastWeek.reduce((total, order) => {
                    return total + order.price;
                }, 0);
                console.log('totalLastWeek', totalLastWeek);
                setDoanhThuTuan(totalLastWeek);

                const totalLastMonth = ordersLastMonth.reduce((total, order) => {
                    return total + order.price;
                }, 0);
                console.log('totalLastMonth', totalLastMonth);
                setDoanhThuThang(totalLastMonth);

                const total = orders.reduce((total, order) => {
                    return total + order.price;
                }, 0);
                console.log('total', total);
                setDoanhThu(total);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <>
            {/* <h1 className={cx('total_revenue')}>Doanh thu</h1> */}
            <Modal
                onCancel={() => {
                    setIsModalOpen(false);
                }}
                title="Cài đặt KPI"
                open={isModalOpen} // ẩn  nút ok và cancel
                footer={null}
            >
                <Form
                    {...layout}
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                    style={{
                        maxWidth: 600,
                    }}
                >
                    <Form.Item label="Chọn loại" name="type">
                        <Radio.Group>
                            <Radio.Button value="week">Tuần</Radio.Button>
                            <Radio.Button value="month">Tháng</Radio.Button>
                            <Radio.Button value="year">Năm</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Áp dụng ngay" name="isRun">
                        <Checkbox
                            checked={isRun}
                            defaultChecked={false}
                            onChange={() => {
                                setIsRun(!isRun);
                            }}
                        />
                    </Form.Item>
                    <Form.Item label="KPI" name="kpi">
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Input value={kpi} onChange={handleKPIChange} />
                            <Text
                                type="secondary"
                                style={{
                                    marginLeft: '10px',
                                }}
                            >
                                đ
                            </Text>
                        </div>
                    </Form.Item>

                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
                    >
                        {({ getFieldValue }) =>
                            getFieldValue('gender') === 'other' ? (
                                <Form.Item
                                    name="customizeGender"
                                    label="Customize Gender"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            ) : null
                        }
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Áp dụng
                        </Button>
                        <Button
                            htmlType="button"
                            onClick={onReset}
                            style={{
                                marginLeft: '10px',
                            }}
                        >
                            Xóa
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <div className={cx('body')}>
                <div className={cx('top')}>
                    <div
                        className={cx('kpi')}
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                    >
                        <CircularProgressbar
                            value={66}
                            text="66 %"
                            strokeWidth={6}
                            styles={{
                                path: {
                                    stroke: `#f88`,
                                    transition: 'stroke-dashoffset 0.5s ease 0s',
                                },
                                trail: {
                                    stroke: '#d6d6d6',
                                },
                                text: {
                                    fill: '#f88',
                                    fontSize: '1.8rem',
                                },
                                background: {
                                    fill: '#3e98c7',
                                },
                            }}
                        />
                    </div>
                    <div className={cx('total_')}>
                        <p className={cx('total_title')}>Tổng doanh thu</p>
                        <p className={cx('total_value')}>
                            {doanhThu.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            })}
                        </p>
                    </div>
                </div>
                <p className={cx('content')}>Doanh thu bán được trong hôm nay</p>
                <p className={cx('total')}>
                    {doanhThuNgay.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    })}
                </p>
                <p className={cx('content')}>Doanh thu so với thời điểm trước</p>
                <div className={cx('last_revenue')}>
                    <div className={cx('last_item')}>
                        <p className={cx('last_title')}>Hôm trước</p>
                        <p className={cx('last_value', 'yesterday')}>
                            {doanhThuHomQua.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            })}
                        </p>
                    </div>
                    <div className={cx('last_item')}>
                        <p className={cx('last_title')}>Tuần trước</p>
                        <p className={cx('last_value', 'last_week')}>
                            {doanhThuTuan.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            })}
                        </p>
                    </div>
                    <div className={cx('last_item')}>
                        <p className={cx('last_title')}>Tháng trước</p>
                        <p className={cx('last_value', 'last_month')}>
                            {doanhThuThang.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProgressChart;
