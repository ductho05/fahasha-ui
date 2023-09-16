import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import classNames from 'classnames/bind'
import styles from './IncomeChart.module.scss'

const cx = classNames.bind(styles)

function IncomeChart({ data, size }) {
    return (
        <ResponsiveContainer width="100%" aspect={size}>
            <AreaChart
                fontSize={'1.4rem'}
                width={730}
                height={250}
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
                <defs>
                    <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#82ca9d" fillOpacity={1} fill="url(#income)" />
            </AreaChart>
        </ResponsiveContainer>
    )
}

export default IncomeChart
