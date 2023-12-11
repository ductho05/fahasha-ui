import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import { api } from '../../../../../constants';
import SimpleItem from '../../../../components/SimpleItem';
import styles from './FlashSaleDetail.module.scss';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CountDownCustom from '../../../../components/CountDownCustom';
import EnhancedTable from '../../../../components/Table/EnhancedTable';
import lottie from 'lottie-web';
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
import { useForm, useController, set } from 'react-hook-form';
import 'react-toastify/dist/ReactToastify.css';
import { getAuthInstance } from "../../../../../utils/axiosConfig"

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
        value: '1',
        type: 'desc',
    },
    {
        title: '6 tuần gần nhất',
        value: '2',
        type: 'desc',
    },
    {
        title: '6 tháng gần nhất',
        value: '3',
        type: 'desc',
    },
    {
        title: '6 năm gần nhất',
        value: '4',
        type: 'desc',
    },
];

function FlashSaleDetail() {

    const authInstance = getAuthInstance()

    const cx = classNames.bind(styles);
    const navigate = useNavigate();
    const moment = require('moment-timezone');

    // Đặt múi giờ cho Việt Nam
    const vietnamTimeZone = 'Asia/Ho_Chi_Minh';

    // Lấy thời gian hiện tại ở Việt Nam
    const currentTimeInVietnam = moment().tz(vietnamTimeZone);

    // Lấy số giờ hiện tại
    const currentHourInVietnam = currentTimeInVietnam.get('hours');
    const { flashId } = useParams();
    const [flash, setFlash] = useState({});
    const [showDialog, setShowDialog] = useState(false);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [valueId, setValueId] = useState(null);
    const [height, setHight] = useState('9px');
    const [done, setDone] = useState(false); // Trạng thái tải xong animation 3
    const [show, setShow] = useState(false);
    const [valuepoint, setValuepoint] = useState(null);

    const container1 = useRef();
    const container2 = useRef();
    const container3 = useRef();
    const infoDivRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        if (infoDivRef.current) {
            const height = infoDivRef.current.getBoundingClientRect().height;
            setHight(height + 'px');
            // Bạn có thể sử dụng biến height ở đây cho mục đích khác
        }
    }, [infoDivRef]);

    useEffect(() => {
        const animation1 = lottie.loadAnimation({
            container: container1.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('../../../../../assets/json/loadingchart.json'),
        });
        const animation2 = lottie.loadAnimation({
            container: container2.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('../../../../../assets/json/loading02.json'),
        });

        let animation3 = null;

        // Đợi 10 giây trước khi tải animation 3
        const timeout = setTimeout(() => {
            animation3 = lottie.loadAnimation({
                container: container3.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: require('../../../../../assets/json/notData.json'),
            });

            setDone(true);
        }, 30000); // 10 giây (10000 milliseconds)

        // Trả về một hàm xử lý để huỷ bỏ sự kiện khi component bị unmounted.
        return () => {
            animation1.destroy();
            animation2.destroy();
            if (animation3) {
                animation3.destroy();
            }
            clearTimeout(timeout); // Huỷ bỏ đợi nếu component unmounted trước khi hiển thị animation 3
        };
    }, []);
    console.log('flash123', Math.floor(currentHourInVietnam / 3));
    const colunmsUser = [
        {
            field: 'rowNumber',
            headerName: 'STT',
            width: 20,
        },
        {
            field: 'images',
            headerName: 'Người mua',
            width: 190,
            renderCell: (params) => (
                <div
                    className={cx('user')}
                    onClick={() => {
                        navigate(`/admin/user/${params.row.userid._id}`);
                    }}
                >
                    <img className={cx('avatar')} src={params.value} />
                    <p className={cx('name')}>{params.row.user}</p>
                </div>
            ),
        },
        {
            field: 'buy_time',
            headerName: 'Thời gian mua',
            width: 160,
        },

        {
            field: 'price',
            headerName: 'Giá',
            width: 100,
            renderCell: (params) => (
                <p>
                    {params.value.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    })}
                </p>
            ),
        },
        {
            field: 'mount',
            headerName: 'Số lượng',
            width: 100,
            renderCell: (params) => <p>{params.value}</p>,
        },
        {
            field: 'total',
            headerName: 'Tổng tiền',
            width: 100,
            renderCell: (params) => (
                <p>
                    {params.value.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    })}
                </p>
            ),
        },
    ];
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const dataIncomes = data.map((item) => ({
        id: item._id,
        date: item.buy_time.slice(0, 24),
        value: item.mount,
    }));

    const rowsUser = data.map((item) => ({
        ...item,
        user: item?.userid?.fullName,
        images: item?.userid?.images,
        buy_time: item.buy_time.slice(0, 24),
        price: item?.flashid?.product?.price * item?.flashid?.current_sale * 0.01,
        total: item?.flashid?.product?.price * item?.flashid?.current_sale * 0.01 * item.mount,
    }));

    const handleClickEdit = () => {
        localStorage.setItem('isFlashsaleLoading', true);
        setSelectedDate(new Date(flash.date_sale));
        setShowDialog(true);
    };

    const handleCloseEdit = () => {
        setShowDialog(false);
        handleAutoSetting();
        // load lại form
    };

    const setLocal = (flash) => {
        setIsLoading(!isLoading);
        flash.date_sale ==
            `${new Date().getUTCFullYear()}-${(new Date().getUTCMonth() + 1).toString().padStart(2, '0')}-${new Date()
                .toString()
                .slice(8, 10)}` && flash.point_sale == Math.floor(currentHourInVietnam / 3)
            ? localStorage.setItem(
                'date_flash',
                `${flash.date_sale.slice(5, 7)} ${flash.date_sale.slice(8, 10)}, ${flash.date_sale.slice(0, 4)} ${(flash.point_sale + 1) * 3
                }:00:00`,
            )
            : localStorage.setItem(
                'date_flash',
                `${flash?.date_sale.slice(5, 7)} ${flash?.date_sale.slice(8, 10)}, ${flash?.date_sale.slice(0, 4)} ${flash?.point_sale * 3
                }:00:00`,
            );
    };

    const handleAutoSetting = () => {
        console.log('flash', formRef.current);
        setShow(flash.is_loop);
        setValuepoint(flash.point_sale);
        formRef.current.setFieldsValue({
            num_sale: flash.num_sale,
            is_loop: flash.is_loop,
            current_sale: flash.current_sale,
            date_sale: moment(new Date(flash.date_sale)),
            point_sale: flash.point_sale,
        });
    };

    useEffect(() => {
        fetch(`${api}/flashusers?flashId=${flashId}`)
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 'OK') {
                    setData(result.data);
                }
            })
            .catch((err) => console.error(err.message));
    }, [flashId]);

    // unmount
    useEffect(() => {
        return () => {
            localStorage.removeItem('date_flash');
        };
    }, []);

    useEffect(() => {
        fetch(`${api}/flashsales/${flashId}`)
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 'OK') {
                    setFlash(result.data);
                    setLocal(result.data);
                    handleAutoSetting();
                }
            })
            .catch((err) => console.error('Aádad', err.message));
    }, [showDialog]);

    const formatDateToString = (date) => {
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
        values.is_loop = show;
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            formData.append(key, values[key]);
        });
        // if (Object.keys(avatar).length > 0) {
        //     formData.append('images', avatar);
        // }

        authInstance.post(`/flashsales/update/${flashId}`, values)
            .then((result) => {
                if (result.data.status === 'OK') {
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
                                // load lại form khi đóng
                                ref={formRef}
                                name="validate_other"
                                {...formItemLayout}
                                onFinish={onFinish}
                                initialValues={{
                                    point_sale: flash.point_sale,
                                    date_sale: moment(new Date(flash.date_sale)),
                                    current_sale: flash.current_sale,
                                    num_sale: flash.num_sale,
                                    is_loop: flash.is_loop,
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
                                    <Select
                                        placeholder="Hãy chọn 1 khung giờ"
                                        onChange={(value) => {
                                            setValuepoint(value);
                                        }}
                                    >
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
                                                    ? `Giảm giá từ ${`${valuepoint * 3}h - ${(valuepoint + 1) * 3
                                                    }h`} hàng ngày`
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
                <div className={cx('infomation')} ref={infoDivRef}>
                    <div className={cx('content')}>
                        <Alert
                            type="warning"
                            message={
                                flash.date_sale ==
                                    `${new Date().getUTCFullYear()}-${(new Date().getUTCMonth() + 1)
                                        .toString()
                                        .padStart(2, '0')}-${new Date().toString().slice(8, 10)}` &&
                                    flash.point_sale == Math.floor(currentHourInVietnam / 3) ? (
                                    <CountDownCustom title={'Thời gian còn lại:'} isLoading={isLoading} />
                                ) : (
                                    <CountDownCustom title={'Đếm ngược đến giờ mở bán:'} isLoading={isLoading} />
                                )
                            }
                            style={{
                                backgroundColor: '#f5f5f5',
                                border: '1px solid #e7e7e7',
                                margin: '0 0 0 0',
                                minHeight: '80px',
                                borderRadius: '6px',
                            }}
                        />
                        {flash.product ? (
                            <p
                                style={{
                                    fontSize: '2rem',
                                    color: '#6c757d',
                                    height: '40px',
                                    margin: '2% 0',
                                }}
                                className={cx('btnEdit')}
                                onClick={handleClickEdit}
                            >
                                Chỉnh sửa
                            </p>
                        ) : (
                            <Skeleton.Input
                                style={{
                                    height: '40px',
                                    width: '100%',
                                    margin: '2% 0',
                                }}
                                active={true}
                            />
                        )}
                        {flash.product ? (
                            <div className={cx('top_content')}>
                                <div className={cx('avatar')}>
                                    <Image height={150} src={flash.product?.images} alt="Avatar" />
                                </div>

                                <div className={cx('info')}>
                                    <h3 className={cx('name')}>{flash.product?.title}</h3>
                                    <p className={cx('code_flash')}>ID: {flash._id}</p>
                                </div>
                            </div>
                        ) : (
                            <div className={cx('top_content')}>
                                <div className={cx('avatar')}>
                                    <Skeleton.Image active={true} />
                                </div>

                                <div className={cx('info')}>
                                    <Skeleton active={true} />
                                </div>
                            </div>
                        )}
                        <span className={cx('line')}></span>
                        {flash.product ? (
                            <div className={cx('description')}>
                                <div className={cx('body_description')}>
                                    <p className={cx('info_other')}>
                                        <span style={{ fontSize: '1.5rem' }}>{flash?.product?._id}</span>
                                    </p>
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
                                        Giá giảm trước:{' '}
                                        {flash?.product?.containprice.toLocaleString('vi-VN', {
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
                                        Khung giờ: {`${flash?.point_sale * 3}h - ${(flash?.point_sale + 1) * 3}h`}{' '}
                                        {flash.is_loop && '(hàng ngày)'}
                                    </p>
                                    <p className={cx('info_other')}>Sales Off: {flash?.current_sale}%</p>
                                    <p className={cx('info_other')}>Số lượng: {flash?.num_sale} sản phẩm</p>
                                    <p className={cx('info_other')}>
                                        Giá FlashSale:{' '}
                                        {(
                                            (flash?.product?.old_price * (100 - flash.current_sale)) /
                                            100
                                        ).toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}
                                    </p>
                                    <p className={cx('info_other')}>Đã bán: {flash?.sold_sale} sản phẩm</p>
                                    <p className={cx('info_other')}>
                                        Tổng đã bán: {flash?.sold_sale + flash?.product?.sold} sản phẩm
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div
                                className={cx('description')}
                                style={{
                                    padding: '10px',
                                }}
                            >
                                <div className={cx('body_description')}>
                                    <Skeleton
                                        active={true}
                                        paragraph={{
                                            rows: 7,
                                        }}
                                    />
                                </div>
                                <div className={cx('body_description')}>
                                    <Skeleton
                                        active={true}
                                        paragraph={{
                                            rows: 7,
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={cx('pending')}>
                    <div className={cx('heading')}>
                        <h3 className={cx('title')}>Phân tích số liệu</h3>
                        {/* <p
                            style={{
                                fontSize: '2rem',
                                color: '#6c757d',
                                margin: 'auto',
                            }}
                        >
                            số lượng đã bán được trong quá khứ
                        </p> */}
                        {/* <DropMenu
                            options={options}
                            setOptionSelected={setOptionSelected}
                            optionSelected={optionSelected}
                            size={'small'}
                        /> */}
                    </div>
                    {dataIncomes.length ? (
                        <>
                            <IncomeChart data={dataIncomes} size={3 / 1} setClick={setValueId} />
                            <EnhancedTable
                                ischeckboxSelection={false}
                                rows={rowsUser.map((row, index) => ({
                                    ...row,
                                    rowNumber: index + 1,
                                }))}
                                isRowCurrent={valueId}
                                height={294}
                                columns={colunmsUser}
                                actions={{}}
                                pageSize={6}
                            />
                        </>
                    ) : (
                        <div
                            style={{
                                height: height,
                            }}
                        >
                            <div ref={container1} hidden={done}></div>
                            <div ref={container2} hidden={done}></div>
                            <div
                                style={{
                                    color: '#eca0a0',
                                    margin: '0px 0 4px 15px',
                                    fontSize: '2rem',
                                }}
                                hidden={!done}
                            >
                                Không tìm thấy dữ liệu để phân tích
                            </div>
                            <div
                                ref={container3}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    margin: 'auto',
                                    width: '70%',
                                }}
                            ></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FlashSaleDetail;
