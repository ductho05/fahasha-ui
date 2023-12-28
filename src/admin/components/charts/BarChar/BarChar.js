import React, { useState } from 'react';
import { api } from '../../../../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import images from '../../../../assets/images';
import { autocompleteClasses } from '@mui/material';
import SimpleItem from '../../SimpleItem';
import { getAuthInstance } from '../../../../utils/axiosConfig';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { ImportOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { Alert, Space, Spin, Popover, Tag } from 'antd';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import classNames from 'classnames/bind';

import { InfoCircleFilled } from '@ant-design/icons';
import styles from './BarChar.module.scss';
import CustomPopover from '../../CustomPopover/CustomPopover';

import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const moment = require('moment-timezone');

// Đặt múi giờ cho Việt Nam
const vietnamTimeZone = 'Asia/Ho_Chi_Minh';

// Lấy thời gian hiện tại ở Việt Nam
const currentTimeInVietnam = moment().tz(vietnamTimeZone);

// Lấy số giờ hiện tại
const currentHourInVietnam = currentTimeInVietnam.get('hours');
function BarChartExample(func) {
    const cx = classNames.bind(styles);
    console.log('A212122ddd1', func);
    const navigate = useNavigate();

    const authInstance = getAuthInstance();

    const [isToggle, setIsToggle] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rows, setRows] = useState([]);

    //const url = ``

    // lấy ngày hôm nay
    const getTimeData = () => {
        const currentDate = new Date();
        const year = currentDate.getUTCFullYear();
        const month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.toString().slice(8, 10);
        const utcTimeString = `${year}-${month}-${day}`;
        let current_point_sale = Math.floor(currentHourInVietnam / 3);
        let toDay = utcTimeString;

        return { current_point_sale, toDay };
    };

    //const [copyData, setCopyData] = useState(func?.data);
    //   console.log('A21adsda2121', copyData);
    const [date, setDate] = useState(getTimeData().toDay);
    const [pointSale, setPointSale] = useState(getTimeData().current_point_sale);
    useEffect(() => {
        setIsLoading(true);
        // setCopyData(func?.data);
        fetch(`${api}/flashsales?sort=reverse&date=${date}&point=${pointSale == -1 ? '' : pointSale}`)
            .then((res) => res.json())
            .then((res) => {
                //console.log('A212121', res.data);
                setRows(res.data);
                // //setCopyData(res.data);
                // console.log('ngukkk', func?.data, copyData);

                // func.data && !isTime && func.func(copyData);
                setIsLoading(false);
                // console.log('A212121', res.data);
            })
            .catch((err) => console.log('sdasda', err));
    }, [isToggle]);

    useEffect(() => {
        if (func.setIsTime[0]) {
            func.func(rows);
        }
    }, [func.setIsTime[0]]);

    const getDatePointSale = (values) => {
        //console.log(values);
        setIsToggle(!isToggle);
        setDate(values.date_sale);
        setPointSale(values.point_sale);
    };

    const newData = rows.filter((item) => {
        return item.sold_sale > 0;
    });

    newData > 10 && newData.splice(10, newData.length - 10);
    const dataChart = newData.map((item) => {
        return {
            id: item._id,
            name: item?.product.title,
            sold: item?.sold_sale,
            imageURL: item?.product.images,
        };
    });

    const CustomTooltip = ({ active, payload, label }) => {
        if (active) {
            return (
                <div
                    style={{
                        backgroundColor: 'white',
                        padding: '10px',
                        borderRadius: '10px',
                        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                        opacity: '0.8',
                    }}
                >
                    <SimpleItem
                        props={{
                            image: payload[0]?.payload.imageURL,
                            title: label,
                            sold: `${payload[0]?.value}`,
                            isLoading: false,
                        }}
                        type={'Số lượng'}
                    />
                </div>
            );
        }
        return null;
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',

                    margin: '3% 0',
                    width: '95%',
                }}
            >
                <Tag
                    color="processing"
                    style={{
                        margin: '0 2% 0 0',
                        flex: 2,
                        fontSize: '1.5rem',
                        display: 'flex', // Sử dụng flexbox
                        alignItems: 'center', // Căn giữa theo chiều dọc
                        justifyContent: 'center', // Căn giữa theo chiều ngang
                    }}
                >
                    {pointSale >= 0 ? `${pointSale * 3}h - ${(pointSale + 1) * 3}h ` : 'Cả ngày'}
                </Tag>
                <Tag
                    color="cyan"
                    style={{
                        margin: '0 0 0 0',
                        flex: 2,
                        fontSize: '1.5rem',
                        display: 'flex', // Sử dụng flexbox
                        alignItems: 'center', // Căn giữa theo chiều dọc
                        justifyContent: 'center', // Căn giữa theo chiều ngang
                    }}
                >
                    {date}
                </Tag>
                <div style={{ flex: 5 }}></div>
                <p
                    style={{
                        margin: '0 0 0 0',
                        color: func.setIsTime[0] ? '#1890ff' : 'black',
                    }}
                    className={cx('btn_loading')}
                >
                    <Popover content="Áp dụng khung thời gian cho bảng dữ liệu" trigger="hover">
                        <AlarmOnIcon
                            fontSize="large"
                            onClick={() => {
                                func.setIsTime[1](!func.setIsTime[0]);
                            }}
                        />
                    </Popover>
                </p>
                <p
                    className={cx('btn_loading')}
                    style={{
                        margin: '0 0 0 0',
                        color: isLoading ? '#1890ff' : 'black',
                    }}
                >
                    <AutorenewIcon
                        fontSize="large"
                        onClick={() => {
                            setIsToggle(!isToggle);
                        }}
                    />
                </p>
                <CustomPopover isToggle={isToggle} func={getDatePointSale} props={cx('btn_loading')} />
            </div>
            <div
                style={{
                    height: '397px',
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.05)',
                    padding: '11% 12% 0% 0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {isLoading ? (
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'end',
                            alignItems: 'center',
                            margin: '0 73% 0 0',
                        }}
                    >
                        <Spin size="large"></Spin>{' '}
                    </div>
                ) : newData.length == 0 ? (
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'end',
                            alignItems: 'center',
                            margin: '0 33% 0 0',
                        }}
                    >
                        <Alert message="Không có dữ liệu" type="warning" showIcon />
                    </div>
                ) : (
                    <BarChart width={300} height={400} data={dataChart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={null} />
                        <YAxis domain={[0, 'dataMax']} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="sold"
                            fill="#8884d8"
                            style={{
                                cursor: 'pointer',
                            }}
                            onClick={(data) => {
                                navigate(`/admin/flashsale/${data.id}`);
                            }}
                        />
                    </BarChart>
                )}
            </div>
            <text
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    height: '40px',
                }}
            >
                <Popover
                    content={
                        'Dữ liệu được phân tích từ các đơn hàng đã từng đặt mua (không tính những đơn bị hủy)'
                    }
                    trigger="hover"
                    // className={cx('kpi')}
                >
                    <span
                        style={{
                            margin: '1px 5px 0 0',
                            // cursor: 'pointer',
                            fontSize: '1.6rem',
                        }}
                    >
                        <InfoCircleFilled />
                    </span>
                </Popover>{' '}
                Biểu đồ flashsale đã đặt trong khung giờ
            </text>
        </div>
    );
}

export default BarChartExample;
