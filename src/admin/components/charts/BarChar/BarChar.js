import React, { useState } from 'react';
import { api } from '../../../../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import images from '../../../../assets/images';
import { autocompleteClasses } from '@mui/material';
import SimpleItem from '../../SimpleItem';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import { useEffect } from 'react';
import { Alert, Space, Spin, Tag } from 'antd';

import classNames from 'classnames/bind';
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
function BarChartExample({ data }) {
    const cx = classNames.bind(styles);

    const [isToggle, setIsToggle] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rows, setRows] = useState([]);
    // lấy ngày hôm nay
    const getTimeData = () => {
        const currentDate = new Date();
        const year = currentDate.getUTCFullYear();
        const month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.toString().slice(8, 10);
        const utcTimeString = `${year}-${month}-${day}`;
        let current_point_sale = Math.floor(currentDate.getHours() / 3);
        let toDay = utcTimeString;

        return { current_point_sale, toDay };
    };

    const [date, setDate] = useState(getTimeData().toDay);
    const [pointSale, setPointSale] = useState(getTimeData().current_point_sale);
    useEffect(() => {
        setIsLoading(true);
        fetch(`${api}/flashsales?sort=reverse&date=${date}&point=${pointSale == -1 ? '' : pointSale}`)
            .then((response) => response.json())
            .then((result) => {
                setRows(result.data);
                setIsLoading(false);
                console.log('A', result.data);
            })
            .catch((err) => console.log(err));
    }, [isToggle]);

    const getDatePointSale = (values) => {
        console.log(values);
        setIsToggle(!isToggle);
        setDate(values.date_sale);
        setPointSale(values.point_sale);
    };

    const newData = rows.filter((item) => {
        return item.sold_sale > 0;
    });
    //Phân biệt hibernatw và spring data jpa
    newData > 10 && newData.splice(10, newData.length - 10);
    const dataChart = newData.map((item) => {
        return {
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
                <div style={{ flex: 6 }}></div>
                <p className={cx('btn_loading')}>
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
                    minHeight: '440px',
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
                        />
                    </BarChart>
                )}
            </div>
            <text
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                    margin: '4.5% 0 0 0',
                }}
            >
                Biểu đồ số lượng sản phẩm đã bán
            </text>
        </>
    );
}

export default BarChartExample;
