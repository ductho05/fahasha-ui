import React, { useState, useRef } from 'react';
import classNames from 'classnames/bind';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from './FlashSaleForm.module.scss';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {
    Button,
    Checkbox,
    Col,
    ColorPicker,
    Form,
    InputNumber,
    DatePicker,
    Radio,
    Rate,
    Row,
    Select,
    Slider,
    Space,
    Switch,
    Upload,
} from 'antd';
import { api } from '../../../constants';
import { set } from 'react-hook-form';
import { useData } from '../../../stores/DataContext';

function FlashSaleForm({ props, hideFunc }) {
    const [showProgress, setShowProgress] = useState(false);
    const [title, setTitle] = useState('');
    const { Option } = Select;
    const cx = classNames.bind(styles);
    const [show, setShow] = useState(false);
    const [valuepoint, setValuepoint] = useState(null);
    const formRef = useRef(null);
    const { data, setData } = useData();
    const moment = require('moment-timezone');

    // Đặt múi giờ cho Việt Nam
    const vietnamTimeZone = 'Asia/Ho_Chi_Minh';

    // Lấy thời gian hiện tại ở Việt Nam
    const currentTimeInVietnam = moment().tz(vietnamTimeZone);

    // Lấy số giờ hiện tại
    const currentHourInVietnam = currentTimeInVietnam.get('hours');
    const formItemLayout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 14,
        },
    };
    const { products } = props;

    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
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

    // // ham them product vao flashsale de luu vao localstorage
    // const addFlashsaleToLocal = (product) => {
    //     const data = localStorage.getItem('temporary_data');
    //     const { flashsales } = JSON.parse(data);
    //     const newFlashsales = [...flashsales, product];
    //     localStorage.setItem('temporary_data', JSON.stringify({ ...JSON.parse(data), flashsales: newFlashsales }));
    // };

    const checktooffprogress = (i) => {
        i == true && setShowProgress(false);
    };

    const addFlashSale = (values, products) => {
        let loop = 0,
            small_loop = 0;
        //console.log(values);
        setShowProgress(true);
        // kiểm tra pointsale ở thời điểm hiên tại
        const current_point = Math.floor(currentHourInVietnam / 3);
        // kiểm tra date_sale có phải là ngày hiện tại hay không
        // in ra ngày hiện tại theo định dạng yyyy-mm-dd
        const current_date = formatDateToString(new Date());
        //console.log(current_date);
        const time_points = [0, 1, 2, 3, 4, 5, 6, 7];
        // lấy ra các point sale lớn hơn hoặc bằng point sale hiện tại
        const time_points_filter =
            values.point_sale == -1
                ? time_points.filter(
                      (point) =>
                          (current_date == values.date_sale && point >= current_point) ||
                          current_date < values.date_sale,
                  )
                : [values.point_sale];

        // lấy ra các point sale nhỏ hơn point sale hiện tại
        const small_time_points_filter = time_points.filter((point) => point < current_point);
        //console.log(small_time_points_filter);
        products.map((item) => {
            values.point_sale == -1 &&
                values.is_loop == true &&
                small_time_points_filter.map((point) => {
                    const data = {
                        current_sale: values.current_sale,
                        num_sale: values.num_sale,
                        // ngày + 1
                        date_sale: formatDateToString(new Date(new Date(values.date_sale).getTime() + 86400000)),
                        is_loop: values.is_loop,
                        product: item,
                        point_sale: point,
                    };

                    //console.log('data1', data);
                    fetch(`${api}/flashsales/add`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                    })
                        .then((response) => response.json())
                        .then((result) => {
                            if (result.status == 'OK') {
                                //addFlashsaleToLocal(result.data);
                                localStorage.setItem('isFlashsaleLoading', true);
                                //console.log(result.status);
                                //setShowProgress(false);
                                checktooffprogress(small_time_points_filter.length * products.length - 1 == small_loop);
                                small_time_points_filter.length * products.length - 1 == small_loop++ &&
                                    hideFunc({
                                        status: 'success',
                                        title: 'Thiết đặt thành công',
                                        subTitle:
                                            'Vui lòng nhấn [Tiếp tục] để tiếp tục thiết đặt hoặc nhấn [Quản lý] để đến trang quản lý Sales Off!',
                                    });
                            } else {
                                setShowProgress(false);
                                hideFunc({
                                    status: 'error',
                                    title: 'Thiết đặt không thành công',
                                    subTitle: result.message
                                        ? result.message
                                        : 'Đã có lỗi xãy ra trong quá trình thiết đặt, vui lòng kiểm tra kết nối mạng!',
                                });
                            }
                        })
                        .catch((err) => {
                            setShowProgress(false);
                            console.log(err);
                        });
                });

            time_points_filter.map((point, index) => {
                const data = {
                    current_sale: values.current_sale,
                    num_sale: values.num_sale,
                    date_sale: values.date_sale,
                    is_loop: values.is_loop,
                    product: item,
                    point_sale: point,
                };

                fetch(`${api}/flashsales/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                })
                    .then((response) => response.json())
                    .then((result) => {
                        if (result.status == 'OK') {
                            //addFlashsaleToLocal(result.data);
                            localStorage.setItem('isFlashsaleLoading', true);
                            //console.log(result.status);
                            //setShowProgress(false);
                            checktooffprogress(time_points_filter.length * products.length - 1 == loop);

                            time_points_filter.length * products.length - 1 == loop++ &&
                                hideFunc({
                                    status: 'success',
                                    title: 'Thiết đặt thành công',
                                    subTitle:
                                        result.message == 'Update product quantity successfully'
                                            ? `Hệ thống phát hiện ID này đã tồn tại trong khung giờ này, hệ thống đã tự động cập nhật số lượng và mức giá cho flashsale này
                                            Vui lòng nhấn [Tiếp tục] để tiếp tục thiết đặt hoặc nhấn [Quản lý] để đến trang quản lý Sales Off`
                                            : 'Vui lòng nhấn [Tiếp tục] để tiếp tục thiết đặt hoặc nhấn [Quản lý] để đến trang quản lý Sales Off!',
                                });
                        } else {
                            //checktooffprogress(time_points_filter.length * products.length - 1 == loop++);
                            setShowProgress(false);
                            hideFunc({
                                status: 'error',
                                title: 'Thiết đặt không thành công',
                                subTitle: result.message
                                    ? result.message
                                    : 'Đã có lỗi xãy ra trong quá trình thiết đặt, vui lòng kiểm tra kết nối mạng!',
                            });
                        }
                    })
                    .catch((err) => {
                        setShowProgress(false);
                        console.log(err);
                    });
            });
        });
    };
    const onFinish = (values) => {
        values.date_sale = formatDateToString(selectedDate);
        values.is_loop = show;
        addFlashSale(values, products);
    };

    const handleAutoSetting = (values) => {
        var gioHienTai = new Date();
        setShow(false);
        setValuepoint(Math.floor(currentHourInVietnam / 3));
        formRef.current.setFieldsValue({
            num_sale: 100,
            is_loop: false,
            current_sale: 40,
            date_sale: moment(gioHienTai),
            point_sale: Math.floor(gioHienTai.getHours() / 3),
        });
        setSelectedDate(gioHienTai);
    };

    return (
        <>
            <Backdrop sx={{ color: '#fff', zIndex: 10000 }} open={showProgress}>
                <CircularProgress color="error" />
            </Backdrop>
            <Form
                name="validate_other"
                {...formItemLayout}
                onFinish={onFinish}
                style={{
                    margin: '20px 0 0 10px',
                    maxWidth: 600,
                }}
                ref={formRef}
            >
                <Form.Item
                    name="point_sale"
                    label="Khung giờ"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn một khung giờ!',
                        },
                    ]}
                >
                    <Select
                        placeholder="Hãy chọn 1 khung giờ"
                        onChange={(value) => {
                            setValuepoint(value);
                        }}
                    >
                        <Option key={-1} value={-1}>{`Cả ngày`}</Option>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Option key={i} value={i}>{`${i * 3}h - ${(i + 1) * 3}h`}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="date_sale"
                    label="Ngày"
                    rules={[
                        {
                            type: 'object',
                            required: true,
                            message: 'Chọn ngày giảm giá!',
                        },
                    ]}
                >
                    <DatePicker selected={selectedDate} onChange={handleDateChange} />
                </Form.Item>

                <Form.Item
                    name="is_loop"
                    label="Lặp lại"
                    wrapperCol={{
                        span: 16,
                        offset: 0.5,
                    }}
                >
                    <Space>
                        <Switch
                            style={{
                                backgroundColor: show ? '#1890ff' : '#ccc',
                            }}
                            checked={show}
                            onChange={() => setShow(!show)}
                        />
                        <span style={{ color: show ? '#1890ff' : '#ccc' }}>
                            {show &&
                                (valuepoint > -1
                                    ? `Giảm giá từ ${`${valuepoint * 3}h - ${(valuepoint + 1) * 3}h`} hàng ngày`
                                    : `Giảm giá tất cả khung giờ hàng ngày`)}
                        </span>
                    </Space>
                </Form.Item>

                <Form.Item
                    name="current_sale"
                    label="Giảm giá"
                    rules={[
                        {
                            required: true,
                            message: 'Chọn mức giảm giá!',
                        },
                    ]}
                >
                    <Slider
                        marks={{
                            0: '0%',
                            20: '20%',
                            40: '40%',
                            60: '60%',
                            80: '80%',
                            100: '100%',
                        }}
                    />
                </Form.Item>

                <Form.Item label="Số lượng" required>
                    <Form.Item
                        name="num_sale"
                        noStyle
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số lượng!',
                            },
                            {
                                type: 'number',
                                min: 1,
                                message: 'Số lượng sản phẩm phải là số nguyên dương.',
                            },
                            {
                                type: 'number',
                                max: 200,
                                message: 'Số lượng Flashsale tối đa trong 1 khung giờ là 200.',
                            },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                    <span className="ant-form-text" style={{ marginLeft: 8 }}>
                        sản phẩm
                    </span>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        span: 12,
                        offset: 12,
                    }}
                    style={{
                        margin: '30px 0 0 0',
                    }}
                >
                    <Space>
                        <Button onClick={handleAutoSetting}>Tự động</Button>
                        <Button type="primary" htmlType="submit" disabled={!products.length}>
                            Áp dụng
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </>
    );
}
export default FlashSaleForm;
