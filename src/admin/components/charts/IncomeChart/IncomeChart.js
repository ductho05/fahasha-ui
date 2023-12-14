import React, { PureComponent, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import classNames from 'classnames/bind';
import styles from './IncomeChart.module.scss';
import { Point } from 'victory';

const cx = classNames.bind(styles)

const formatPrice = (price) => {
    return price >= 1000000 ? `${(price / 1000000).toFixed(2)}M` : `${(price / 1000).toFixed(2)}K`
}

function IncomeChart({ data, size, setClick }) {
    const handleMouseMove = (e) => {
        const xPos = e.activePayload[0]?.payload?.id;
        // Xác định dữ liệu tại vị trí đó
        const dataPoint = data.find((item) => item.id === xPos); // Giả sử bạn có dữ liệu có trường 'x'
        setClick !== undefined && setClick(dataPoint.id);
    };
    return (
        <div className='py-[20px]'>
            <ResponsiveContainer width="100%" aspect={size}>
                <AreaChart
                    fontSize={'1.3rem'}
                    width={730}
                    height={220}
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    onClick={handleMouseMove}
                >
                    <defs>
                        <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={formatPrice} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip formatter={formatPrice} />
                    <Area
                        style={{
                            cursor: 'pointer',
                        }}
                        type="monotone"
                        dataKey="value"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#income)"
                    />

                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export default IncomeChart;
