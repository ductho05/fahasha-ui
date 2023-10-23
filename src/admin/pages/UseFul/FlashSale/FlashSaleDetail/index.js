import { useState, useEffect, flashef } from 'react';
import classNames from 'classnames/bind';
import { api } from '../../../../../constants';
import SimpleItem from '../../../../components/SimpleItem';
import styles from './FlashSaleDetail.module.scss';
import { useParams, useNavigate } from 'react-router-dom';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import moment from 'moment';
import {
    Divider,
    Radio,
    Skeleton,
    Checkbox,
    Col,
    ColorPicker,
    Form,
    InputNumber,
    DatePicker,
    Rate,
    Row,
    Select,
    Slider,
    Space,
    Switch,
    Upload,
    Modal,
    Image,
    Alert,
    Descriptions,
    Button,
} from 'antd';
import Marquee from 'react-fast-marquee';
import FlashSaleModal from '../../../../components/FlashSaleModal';
import { toast, ToastContainer } from 'react-toastify';
import { Dialog } from '@mui/material';
import IncomeChart from '../../../../components/charts/IncomeChart/IncomeChart';
import DropMenu from '../../../../../components/DropMenu/index';
//import OrdersLatesTable from '../../components/OrdersLatesTable/OrdersLatesTable';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useForm, useController } from 'react-hook-form';
import 'react-toastify/dist/ReactToastify.css';

function getRandomElementsWithBias(arr, num) {
    const originalIndices = Array.from(arr.keys());
    const shuffledIndices = shuffleArray(originalIndices);
    const selectedIndices = shuffledIndices.slice(0, num);
    const selectedElements = selectedIndices.map((index) => arr[index]);
    return selectedElements;
}
const { Option } = Select;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const options = [
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

const dataIncomes = [
    {
        date: '31/7/2023',
        value: 340,
    },
    {
        date: '1/8/2023',
        value: 500,
    },
    {
        date: '2/8/2023',
        value: 400,
    },
    {
        date: '3/8/2023',
        value: 900,
    },
    {
        date: '4/8/2023',
        value: 700,
    },
    {
        date: '5/8/2023',
        value: 990,
    },
];

function FlashSaleDetail() {
    const cx = classNames.bind(styles);
    const navigate = useNavigate();
    const { flashId } = useParams();
    const [flash, setFlash] = useState({});
    const [optionSelected, setOptionSelected] = useState(options[0]);
    const [showDialog, setShowDialog] = useState(false);

    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleClickEdit = () => {
        setSelectedDate(new Date(flash.date_sale));
        setShowDialog(true);
    };

    const handleCloseEdit = () => {
        setShowDialog(false);
    };

    useEffect(() => {
        fetch(`${api}/flashsales/${flashId}`)
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 'OK') {
                    setFlash(result.data);
                }
            })
            .catch((err) => console.error(err.message));
    }, [showDialog]);

    const formatDateToString = (date) => {
        console.log('date', date);
        if (date) {
            date = date.$d ? date.$d : date._d ? date._d : date;
            const year = date.getUTCFullYear();
            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const day = date.toString().slice(8, 10);
            const utcTimeString = `${year}-${month}-${day}`;
            return utcTimeString;
            // return date.toISOString().slice(0, 10); // Lấy YYYY-MM-DD
        }
        return ''; // Trả về chuỗi rỗng nếu date là null
    };

    const onFinish = (values) => {
        //values.date_sale = moment(values.date_sale).format('YYYY-MM-DD');
        values.date_sale = formatDateToString(selectedDate);
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            formData.append(key, values[key]);
        });
        // if (Object.keys(avatar).length > 0) {
        //     formData.append('images', avatar);
        // }
        console.log('Data', values);
        console.log('formData', formData.get('date_sale'));
        console.log('flashId', flashId);
        fetch(`${api}/flashsales/update/${flashId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 'OK') {
                    setShowDialog(false);
                    toast.success('Thay đổi thông tin Flash Sale thành công!');
                } else {
                    setShowDialog(false);
                    toast.error('Thất bại! Có lỗi xảy ra');
                }
            })
            .catch((err) => {
                setShowDialog(false);
                toast.error(err.message);
            });
        //addFlashSale(values, products);
    };

    const formItemLayout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 14,
        },
    };

    const handleSave = (data) => {
        console.log('â d', data);
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });
        // if (Object.keys(avatar).length > 0) {
        //     formData.append('images', avatar);
        // }
        fetch(`${api}/flashsales/update/${flashId}`, {
            method: 'PUT',
            body: formData,
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 'OK') {
                    setShowDialog(false);
                    toast.success('Thay đổi thông tin Flash Sale thành công!');
                } else {
                    setShowDialog(false);
                    toast.error('Thất bại! Có lỗi xảy ra');
                }
            })
            .catch((err) => {
                setShowDialog(false);
                toast.error(err.message);
            });
    };

    return (
        <div className={cx('wrapper')}>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Modal width={'40%'} open={showDialog} footer={null} maskClosable={false} onCancel={handleCloseEdit}>
                <div className={cx('dialog')}>
                    <h3 className={cx('dialog_title')}>Chỉnh sửa thông tin FlashSale</h3>
                    <div className={cx('dialog_content')}>
                        <div className={cx('left')}>
                            <Alert
                                message={`Nhấn vào "Sửa" để di chuyển đến trang chỉnh sửa thông tin sản phẩm!`}
                                type="info"
                            />
                            <div className={cx('images')}>
                                <img src={flash?.product?.images} alt="Avatar" />
                                <div className={cx('btn_channge')}>
                                    <label
                                        onClick={() => {
                                            navigate(`/admin/update-product/${flash?.product?._id}`);
                                        }}
                                    >
                                        Sửa
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className={cx('right')}>
                            <Form
                                name="validate_other"
                                {...formItemLayout}
                                onFinish={onFinish}
                                initialValues={{
                                    point_sale: flash.point_sale,
                                    date_sale: moment(new Date(flash.date_sale)),
                                    current_sale: flash.current_sale,
                                    num_sale: flash.num_sale,
                                }}
                                style={{
                                    margin: '20px 0 0 0',
                                    maxWidth: 600,
                                }}
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
                                        <Button type="primary" htmlType="submit">
                                            Chỉnh sửa
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </Modal>
            <div className={cx('top')}>
                <div className={cx('infomation')}>
                    <p className={cx('btnEdit')} onClick={handleClickEdit}>
                        Chỉnh sửa
                    </p>
                    <h3 className={cx('title')}>Thông tin sản phẩm Flashsale</h3>
                    <div className={cx('content')}>
                        <div className={cx('top_content')}>
                            <div className={cx('avatar')}>
                                <Image src={flash.product?.images} alt="Avatar" />
                            </div>
                            <div className={cx('info')}>
                                <h3 className={cx('name')}>{flash.product?.title}</h3>
                                <p className={cx('code_flash')}>ID: {flash._id}</p>
                            </div>
                        </div>
                        <div className={cx('description')}>
                            <div className={cx('body_description')}>
                                <p className={cx('info_other')}>Tác giả: {flash.product?.author}</p>
                                <p className={cx('info_other')}>Thể loại: {flash?.product?.categoryId?.name}</p>
                                <p className={cx('info_other')}>
                                    Giá gốc:{' '}
                                    {flash?.product?.old_price.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </p>
                                <p className={cx('info_other')}>
                                    Giá trước khi sale:{' '}
                                    {flash?.product?.price.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </p>
                                <p className={cx('info_other')}>Đánh giá: {flash?.product?.rate} sao</p>
                                <p className={cx('info_other')}>Trạng thái: {flash?.product?.status}</p>{' '}
                            </div>
                            <div className={cx('body_description')}>
                                <p className={cx('info_other')}>Ngày Sale: {flash.date_sale}</p>
                                <p className={cx('info_other')}>
                                    Khung giờ: {`${flash?.point_sale * 3}h - ${(flash?.point_sale + 1) * 3}h`}
                                </p>
                                <p className={cx('info_other')}>Sales Off: {flash?.current_sale}%</p>
                                <p className={cx('info_other')}>Số lượng: {flash?.num_sale} sản phẩm</p>
                                <p className={cx('info_other')}>
                                    Giá hiện tại:{' '}
                                    {((flash?.product?.old_price * (100 - flash.current_sale)) / 100).toLocaleString(
                                        'vi-VN',
                                        {
                                            style: 'currency',
                                            currency: 'VND',
                                        },
                                    )}
                                </p>
                                <p className={cx('info_other')}>Đã bán: {flash?.sold_sale} sản phẩm</p>
                                <p className={cx('info_other')}>
                                    Tổng đã bán: {flash?.sold_sale + flash?.product?.sold} sản phẩm
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cx('pending')}>
                    <div className={cx('heading')}>
                        <h3 className={cx('title')}>Chi tiêu</h3>
                        <DropMenu
                            options={options}
                            setOptionSelected={setOptionSelected}
                            optionSelected={optionSelected}
                            size={'small'}
                        />
                    </div>
                    <IncomeChart data={dataIncomes} size={3 / 1} />
                </div>
            </div>
            {/* <div className={cx('bottom')}>
                <OrdersLatesTable rows={orders} />
            </div> */}
        </div>
    );
}

export default FlashSaleDetail;
