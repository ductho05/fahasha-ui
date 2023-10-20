import React, { useState } from 'react';
import { api } from '../../../../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import images from '../../../../assets/images';
import { autocompleteClasses } from '@mui/material';
import SimpleItem from '../../SimpleItem';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import TuneIcon from '@mui/icons-material/Tune';
import { useEffect } from 'react';
import { Alert, Space, Spin } from 'antd';
function BarChartExample({ data }) {
    const [isToggle, setIsToggle] = useState(false);
    const [rows, setRows] = useState(data);
    useEffect(() => {
        fetch(`${api}/flashsales`)
            .then((response) => response.json())
            .then((result) => {
                setRows(result.data);
            })
            .catch((err) => console.log(err));
    }, [isToggle]);

    const newData = rows.filter((item) => {
        const currentDate = new Date();
        let current_point_sale = Math.floor(currentDate.getHours() / 3);
        let toDay = currentDate.toISOString().slice(0, 10);
        return item.point_sale == current_point_sale && item.date_sale == toDay && item.sold_sale > 0;
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
                    width: '95%',
                }}
            >
                <div style={{ flex: 8 }}></div>
                <AutorenewIcon
                    style={{ flex: 1 }}
                    fontSize="large"
                    onClick={() => {
                        setIsToggle(!isToggle);
                    }}
                />
                <TuneIcon style={{ flex: 1 }} fontSize="large" />
            </div>
            <div
                style={{
                    minHeight: '420px',
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.05)',
                    margin: '20px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {newData.length > 0 ? (
                    <BarChart
                        width={300}
                        height={400}
                        data={dataChart}
                        style={{
                            margin: '10px 0',
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={null} />
                        <YAxis domain={[0, 'dataMax']} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="sold" name="Đã bán" fill="#8884d8" />
                    </BarChart>
                ) : (
                    <Spin size="large"></Spin>
                )}{' '}
            </div>
            <text textAnchor="middle" dominantBaseline="middle">
                Biểu đồ số lượng sản phẩm đã bán
            </text>
        </>
    );
}

export default BarChartExample;
