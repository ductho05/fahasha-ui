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

function FlashSaleForm({ props, hideFunc }) {
    const [showProgress, setShowProgress] = useState(false);

    const { Option } = Select;
    const cx = classNames.bind(styles);
    const formRef = useRef(null);
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
    const addFlashsaleToLocal = (product) => {
        const data = localStorage.getItem('temporary_data');
        const { flashsales } = JSON.parse(data);
        const newFlashsales = [...flashsales, product];
        localStorage.setItem('temporary_data', JSON.stringify({ ...JSON.parse(data), flashsales: newFlashsales }));
    };

    const addFlashSale = (values, products) => {
        setShowProgress(true);
        products.map((item, index) => {
            const data = { ...values, product: item };
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
                        setShowProgress(false);
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
    };
    const onFinish = (values) => {
        //values.date_sale = moment(values.date_sale).format('YYYY-MM-DD');
        console.log('Received values of form: ', selectedDate);
        values.date_sale = formatDateToString(selectedDate);

        addFlashSale(values, products);
    };

    const handleAutoSetting = (values) => {
        var gioHienTai = new Date();
        formRef.current.setFieldsValue({
            num_sale: 100,
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
                // initialValues={{
                //     point_sale: 0,
                //     // date_sale: moment('2023-12-11'),
                //     current_sale: 20,
                //     num_sale: autoInput,
                // }}
                style={{
                    margin: '20px 0 0 0',
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
                    <Select placeholder="Hãy chọn 1 khung giờ">
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

                <Form.Item name="current_sale" label="Giảm giá">
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
                    <span
                        className="ant-form-text"
                        style={{
                            marginLeft: 8,
                        }}
                    >
                        sản phẩm
                    </span>
                </Form.Item>

                {/* <Form.Item name="switch" label="Nhiều ngày" valuePropName="checked">
            <Switch />
        </Form.Item> */}

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
                        <Button
                            // htmlType="reset"
                            onClick={handleAutoSetting}
                        >
                            Tự động
                        </Button>
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
