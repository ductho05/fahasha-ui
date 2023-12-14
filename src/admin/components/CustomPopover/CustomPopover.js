import React, { useState, useRef } from 'react';

import TuneIcon from '@mui/icons-material/Tune';
import {
    Button,
    Checkbox,
    Col,
    Popover,
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
const App = ({ maxProduct, func, props, type }) => {
    const [clicked, setClicked] = useState(false);

    const [selectedDate, setSelectedDate] = useState(null);

    const handleClickChange = (open) => {
        setClicked(open);
    };
    const formItemLayout = {
        labelCol: {
            span: 7,
        },

        wrapperCol: {
            span: 13,
        },
    };
    const { Option } = Select;

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const formatDateToString = (date) => {
        if (date) {
            const currentDate = date.$d;
            const year = currentDate.getUTCFullYear();
            const month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');
            const day = currentDate.toString().slice(8, 10);
            const utcTimeString = `${year}-${month}-${day}`;
            return utcTimeString;
            //return date.toISOString().slice(0, 10); // Lấy YYYY-MM-DD
        }
        return ''; // Trả về chuỗi rỗng nếu date là null
    };
    const onFinish = (values) => {
        values.date_sale = formatDateToString(selectedDate);
        values.time = values.time ? values.time.format('YYYY-MM') : null;
        func(values);
        setClicked(false);
        console.log('Received values of form: ', values);
    };
    const hoverContent = (
        <>
            <Form
                onFinish={onFinish}
                name="validate_other"
                {...formItemLayout}
                style={{
                    margin: '20px 0 0 0',
                    minWidth: 300,
                }}
            >
                {' '}
                {type == 'static' ? (
                    <>
                        <Form.Item
                            name="num"
                            label="Số lượng"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn số sản phẩm!',
                                },
                                {
                                    type: 'number',
                                    min: 2,
                                    max: maxProduct < 2 ? 5 : maxProduct,
                                    message: 'Nhập số lượng từ 2 - ' + `${maxProduct < 2 ? 5 : maxProduct}`,
                                },
                            ]}
                        >
                            <InputNumber placeholder="Chọn số lượng" />
                        </Form.Item>
                        <Form.Item
                            name="time"
                            label="Thời gian"
                            rules={[
                                {
                                    type: 'object',
                                    required: true,

                                    message: 'Chọn thời gian',
                                },
                            ]}
                        >
                            <DatePicker
                                picker="month"
                                placeholder="Chọn tháng"
                                showToday={false}
                                selected={selectedDate}
                                onChange={handleDateChange}
                            />
                        </Form.Item>{' '}
                    </>
                ) : (
                    <>
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
                            <Select placeholder="Chọn giờ">
                                <Option key={0} value={-1}>
                                    Cả ngày
                                </Option>
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <Option key={i + 1} value={i}>{`${i * 3}h - ${(i + 1) * 3}h`}</Option>
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
                            <DatePicker
                                placeholder="Chọn ngày"
                                showToday={false}
                                selected={selectedDate}
                                onChange={handleDateChange}
                            />
                        </Form.Item>{' '}
                    </>
                )}
                <Form.Item
                    wrapperCol={{
                        span: 10,
                        offset: 14,
                    }}
                >
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Áp dụng
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </>
    );
    return (
        <Popover
            content={<div>{hoverContent}</div>}
            title="Bộ lọc"
            placement="bottomRight"
            trigger="click"
            open={clicked}
            onOpenChange={handleClickChange}
        >
            <p className={props}>
                <TuneIcon fontSize="large" />
            </p>
        </Popover>
    );
};
export default App;
