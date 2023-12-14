import React, { useState } from 'react';
import { api } from '../../../../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import images from '../../../../assets/images';
import { autocompleteClasses } from '@mui/material';
import SimpleItem from '../../SimpleItem';
import { authInstance } from '../../../../utils/axiosConfig';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import { useEffect } from 'react';
import { Alert, Space, Spin, Tag } from 'antd';

import classNames from 'classnames/bind';
import styles from './BarCharForStatic.module.scss';
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
function BarChartExample({
    spin,
    data,
    setNumProduct,
    setTimeYear,
    setTimeMonth,
    isLoadingProduct,
    setIsLoadingProduct,
    maxProduct,
}) {
    const cx = classNames.bind(styles);
    const navigate = useNavigate();
    const [time, setTime1] = useState(`${currentTimeInVietnam.get('year')}-${currentTimeInVietnam.get('month') + 1}`);
    const [isToggle, setIsToggle] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    //  const [rows, setRows] = useState([]);
    const [num, setNum] = useState(5);
    //
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

    const [date, setDate] = useState(getTimeData().toDay);
    const [pointSale, setPointSale] = useState(getTimeData().current_point_sale);
    //const [num, setNum] = useState(5);
    // useEffect(() => {
    //     setIsLoading(true);
    //     authInstance.get(`${api}/flashsales?sort=reverse&date=${date}&point=${pointSale == -1 ? '' : pointSale}`).then((result) => {
    //             setRows(result.data.data);
    //             setIsLoading(false);
    //             //console.log('A', result.data);
    //         })
    //         .catch((err) => console.log(err));
    // }, [isToggle]);

    const getDatePointSale = (values) => {
        //console.log(values);
        setIsLoadingProduct(!isLoadingProduct);
        setDate(values.date_sale);
        setPointSale(values.point_sale);
        setTimeMonth(parseInt(values?.time.slice(5, 7)));
        setTimeYear(parseInt(values?.time.slice(0, 4)));
        setTime1(values.time);
        console.log('values', values);
        setNumProduct(values.num);
        setNum(values.num);
    };

    // const newData = rows.filter((item) => {
    //     return item.sold_sale > 0;
    // });
    //Phân biệt hibernatw và spring data jpa
    // newData > 10 && newData.splice(10, newData.length - 10);
    const dataChart = data.map((item, index) => {
        return {
            top: index + 1,
            backgroundColor: index == 0 ? '#f44336' : index == 1 ? '#ff9800' : index == 2 ? '#ffc107' : '#4caf50',
            id: item.id,
            name: item.name,
            sold: item.sold,
            imageURL: item?.imageURL,
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
                            title: payload[0]?.payload.name,
                            sold: `${addCommasToNumber(Math.ceil(payload[0]?.value / 1000))}K`,
                            isLoading: false,
                        }}
                        type="Doanh thu"
                    />
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    margin: '0 0 3% 0',
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
                    {'Số sản phẩm: ' + num}
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
                    {time
                        ? time // thang nay
                        : moment(date).format('YYYY-MM')}
                </Tag>
                <div style={{ flex: 6 }}></div>
                {/* <p className={cx('btn_loading')}>
                    <AutorenewIcon
                        fontSize="large"
                        onClick={() => {
                            setIsToggle(!isToggle);
                        }}
                    />
                </p> */}

                <CustomPopover
                    maxProduct={maxProduct}
                    setNumProduct={setNumProduct}
                    func={getDatePointSale}
                    props={cx('btn_loading')}
                    type={'static'}
                />
            </div>
            <div
                style={{
                    minHeight: '440px',
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.05)',
                    padding: '10% 10% 0% 0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {spin ? (
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
                ) : dataChart.length == 0 ? (
                    <div
                        style={{
                            width: '350px',
                            height: '400px',
                            display: 'flex',
                            justifyContent: 'end',
                            alignItems: 'center',
                            margin: '0 38% 0 0',
                        }}
                    >
                        <Alert message="Không có dữ liệu" type="warning" showIcon />
                    </div>
                ) : (
                    <BarChart width={350} height={400} data={dataChart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="top"
                            tick={{
                                fontSize: 15,
                                fontFamily: 'Arial',
                                // height: 50,
                                // width: 50,
                                //fill: 'backgroundColor'
                            }}
                            // thêm background cho x
                        />

                        <YAxis
                            domain={[0, 'dataMax']}
                            tick={{
                                fontSize: 15,
                                fontFamily: 'Arial',
                            }}
                            tickFormatter={(value) => {
                                return value > 999999999
                                    ? addCommasToNumber((value / 1000000000).toFixed(2)) + 'B'
                                    : value > 999999
                                    ? addCommasToNumber((value / 1000000).toFixed(2)) + 'M'
                                    : value > 999
                                    ? addCommasToNumber(Math.ceil(value / 1000)) + 'K'
                                    : value;
                            }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="sold"
                            fill="#f44336"
                            style={{
                                cursor: 'pointer',
                                
                            }}
                            onClick={(data) => {
                                console.log('sdrguawejbf', data);
                            }}
                        />
                    </BarChart>
                )}
            </div>
            <text
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                    margin: '7% 0 0 0',
                    fontSize: '2rem',
                }}
            >
                Biểu đồ doanh thu tháng {parseInt(time?.slice(5, 7))}/{parseInt(time?.slice(0, 4))}
            </text>
        </>
    );
}

export default BarChartExample;
