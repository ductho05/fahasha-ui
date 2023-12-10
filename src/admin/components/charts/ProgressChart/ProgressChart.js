import classNames from 'classnames/bind';
import styles from './ProgressChart.module.scss';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../../../../constants';
import { Modal, Popover, Button, Form, Statistic, message, Input, Select, Radio, Checkbox, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { set } from 'react-hook-form';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { authInstance, postData } from '../../../../utils/axiosConfig';

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
    const [systemKpi, setSystemKpi] = useState('');
    const [isStatus, setIsStatus] = useState(false);
    const [doanhthukpi, setDoanhthukpi] = useState(0);

    const [load_animation, setLoad_animation] = useState(false);

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

    const content = (
        <div>
            {systemKpi.kpi ? (
                <>
                    <p>Đạt được: {addCommasToNumber(doanhthukpi)} đ</p>
                    <p>Mục tiêu: {addCommasToNumber(parseInt(systemKpi?.kpi))} đ</p>
                    <p>Ngày bắt đầu: {systemKpi.start}</p>
                    <p>Ngày kết thúc: {systemKpi.end}</p>
                </>
            ) : (
                <p>Click vào để khởi động chiến dịch KPI doanh thu</p>
            )}
        </div>
    );

    console.log('isStatus', isStatus);
    useEffect(() => {
        authInstance // lấy kpi có status = true
            .get(`/systems`)
            .then((res) => {
                const systems = res.data.data;
                console.log('systems123', systems);
                if (systems) {
                    // tính doanh thu từ start đến hôm nay
                    const today = new Date();
                    authInstance
                        .get(`/orders`)
                        .then((res) => {
                            const orders = res.data.data;
                            const ordersToday = orders.filter((order) => {
                                return (
                                    formatDateToString(new Date(order.date)) <= formatDateToString(today) &&
                                    formatDateToString(new Date(order.date)) >= systems.start
                                );
                            });
                            const totalToday = ordersToday.reduce((total, order) => {
                                return total + order.price;
                            }, 0);
                            console.log('totalToday1213', totalToday, orders);
                            setDoanhthukpi(totalToday);
                        })
                        .catch((err) => {
                            console.log('sfasd', err);
                        });
                    setIsStatus(true);
                    setSystemKpi(systems);
                    console.log('Có nha');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [isModalOpen]);

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
        setLoad_animation(true);
        values = {
            ...values,
            kpi: values.kpi.replace(/,/g, ''),
            isRun,
        };
        console.log('Success:', values);
        // axios
        //     .post(
        //         `http://127.0.0.1:3000/bookstore/api/v1/systems/insert`,
        //         {
        //             body: JSON.stringify(values),
        //         },
        //         { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}` } },
        //     )
        authInstance
            .post(
                `/systems/insert`,
                values, // Không cần JSON.stringify ở đây
                // {
                //     headers: {
                //         'Content-Type': 'application/json',
                //         Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                //     },
                // },
            )
            .then((res) => {
                console.log('ASSSSSSSSSSSS', res);
                setLoad_animation(false);
                setIsModalOpen(false);
                if (res.data.status === 'OK') {
                    info('success', 'Cài đặt KPI thành công!');
                } else if (res.data.status === 'ERROR') {
                    info('warning', 'Mã kích hoạt không đúng, vui lòng kiểm tra lại!');
                } else {
                    info('error', 'Cài đặt KPI thất bại! Lỗi: ' + res.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
            });
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
                const yesterday = new Date(new Date());
                yesterday.setDate(yesterday.getDate() - 1);
                const lastWeek = new Date(new Date());
                lastWeek.setDate(lastWeek.getDate() - 7);
                const lastMonth = new Date(new Date());
                lastMonth.setDate(lastMonth.getDate() - 30);

                console.log('yesterday13213', yesterday, lastWeek, lastMonth);
                const ordersToday = orders.filter((order) => {
                    return formatDateToString(new Date(order.date)) === formatDateToString(new Date());
                });
                const ordersYesterday = orders.filter((order) => {
                    return formatDateToString(new Date(order.date)) === formatDateToString(yesterday);
                });

                const ordersLastWeek = orders.filter((order) => {
                    // lấy giá trị ngày thứ 2 tuần trước
                    const date = new Date();
                    const day = date.getDay();
                    const diff = date.getDate() - day + (day == 0 ? -6 : 1) - 7;
                    const mondaylast = new Date(new Date().setDate(diff));
                    // giá trị chủ nhật tuần trước
                    const sundaylast = new Date(new Date().setDate(diff + 6));
                    // lấy giá trị thứ 2 tuần sau
                    const mondaynext = new Date(new Date().setDate(diff + 14));
                    console.log('mondaylast123', mondaylast, sundaylast, mondaynext);
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
                    console.log('firstDay2323', formatDateToString(firstDay), formatDateToString(lastDay));
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

    const info = (type, content) => {
        messageApi.open({
            type: type,
            content: content,
        });
    };

    const [messageApi, contextHolder] = message.useMessage();

    return (
        <>
            {contextHolder}
            {/* <h1 className={cx('total_revenue')}>Doanh thu</h1> */}
            <div className={cx('visible')}>
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={load_animation}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>

            <Modal
                title="Cài đặt KPI doanh thu"
                visible={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                }}
                footer={null}
                width={600}
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
                    <Form.Item
                        label="Chọn loại"
                        name="type"
                        rules={[
                            {
                                required: true,
                                message: 'Chọn loại để tiếp tục',
                            },
                        ]}
                    >
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
                    <Form.Item
                        label="KPI"
                        name="kpi"
                        rules={[
                            {
                                required: true,
                                message: 'Nhập Kpi để tiếp tục',
                            },
                        ]}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Input value={kpi} onChange={handleKPIChange} placeholder="Nhập KPI mục tiêu" />
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
                        label="Mã kích hoạt"
                        name="key"
                        rules={[
                            {
                                required: true,
                                message: 'Nhập mã kích hoạt để tiếp tục',
                            },
                        ]}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Input
                                // gợi ý chữ kích hoạt
                                placeholder="Nhập mã kích hoạt"
                            />
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
                    {' '}
                    <Popover
                        content={content}
                        title={systemKpi.kpi ? 'KPI - Đang chạy' : 'KPI - Đã dừng'}
                        trigger="hover"
                        className={cx('kpi')}
                    >
                        <div
                            onClick={() => {
                                isStatus == false && setIsModalOpen(true);
                                isStatus == true &&
                                    info(
                                        'warning',
                                        'Không thể thay đổi KPI khi đã khởi động, vui lòng liên hệ bộ phận IT!',
                                    );
                            }}
                        >
                            <CircularProgressbar
                                value={
                                    doanhthukpi < systemKpi.kpi
                                        ? (doanhthukpi / systemKpi.kpi) * 100
                                        : doanhthukpi == systemKpi.kpi
                                            ? 100
                                            : ((doanhthukpi % systemKpi.kpi) / systemKpi.kpi) * 100
                                }
                                text={
                                    systemKpi.kpi
                                        ? doanhthukpi < systemKpi.kpi
                                            ? ((doanhthukpi / systemKpi.kpi) * 100).toFixed(0) + '%'
                                            : doanhthukpi == systemKpi.kpi
                                                ? '100%'
                                                : '+' + ((doanhthukpi / systemKpi.kpi) * 100 - 100).toFixed(0) + '%'
                                        : 'chưa thiết lập'
                                }
                                strokeWidth={6}
                                styles={{
                                    path: {
                                        stroke: systemKpi.kpi
                                            ? doanhthukpi < systemKpi.kpi
                                                ? '#f88'
                                                : doanhthukpi == systemKpi.kpi
                                                    ? '#4EEE94'
                                                    : '#0000EE'
                                            : 'gray',
                                        transition: 'stroke-dashoffset 0.5s ease 0s',
                                    },
                                    trail: {
                                        stroke: systemKpi.kpi
                                            ? doanhthukpi < systemKpi.kpi
                                                ? '#DDDDDD'
                                                : doanhthukpi == systemKpi.kpi
                                                    ? '#4EEE94'
                                                    : 'green'
                                            : 'gray',
                                    },
                                    text: {
                                        fill: systemKpi.kpi
                                            ? doanhthukpi < systemKpi.kpi
                                                ? '#f88'
                                                : doanhthukpi == systemKpi.kpi
                                                    ? '#4EEE94'
                                                    : '#0000EE'
                                            : 'gray',
                                        fontSize: systemKpi.kpi ? '1.8rem' : '1.2rem',
                                    },
                                    background: {
                                        fill:
                                            doanhthukpi < systemKpi.kpi
                                                ? 'gray'
                                                : doanhthukpi == systemKpi.kpi
                                                    ? '#4EEE94'
                                                    : 'black', //parseInt(doanhthukpi / systemKpi.kpi) < 1 ? '#f88' : '#4EEE94',
                                    },
                                }}
                            />
                        </div>
                    </Popover>
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
                <div className={cx('content_content')}>
                    <p className={cx('total')}>
                        {doanhThuNgay.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        })}
                    </p>
                    <div className={cx('statistic')}>
                        {
                            <Statistic
                                title={doanhThuHomQua <= doanhThuNgay ? 'Tăng' : 'Giảm'}
                                value={
                                    doanhThuHomQua == 0
                                        ? 0
                                        : (Math.abs(doanhThuHomQua - doanhThuNgay) / doanhThuHomQua) * 100
                                }
                                precision={2}
                                valueStyle={{
                                    color: doanhThuHomQua <= doanhThuNgay ? '#3f8600' : '#cf1322',
                                    fontSize: '2rem',
                                }}
                                prefix={doanhThuHomQua <= doanhThuNgay ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                suffix="%"
                            />
                        }
                    </div>
                </div>
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
