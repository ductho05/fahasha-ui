import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Statistics.module.scss';
import Widget from '../../components/Widget/Widget';
import ProgressChart from '../../components/charts/ProgressChart/ProgressChart';
import IncomeChart from '../../components/charts/IncomeChart/IncomeChart';
import DropMenu from '../../../components/DropMenu';
import OrdersLatesTable from '../../components/OrdersLatesTable/OrdersLatesTable';


const cx = classNames.bind(styles);
// fetch data
const dataWidgets = [
    {
        title: 'Người dùng',
        type: 'users',
        value: 250,
        percent: 0.05,
    },
    {
        title: 'Đơn hàng',
        type: 'orders',
        value: 1000,
        percent: -0.03,
    },
    {
        title: 'Thu nhập',
        type: 'earnings',
        value: 10000000,
        percent: 0.12,
    },
    {
        title: 'Đánh giá',
        type: 'reviews',
        value: 20,
        percent: -0.01,
    },
];

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
function HomeAdmin() {


    const [optionSelected, setOptionSelected] = useState(options[0]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('widgits')}>
                {dataWidgets.map((widget, index) => (
                    <Widget key={index} widget={widget} />
                ))}
            </div>
            <div className={cx('chart')}>
                <div className={cx('left')}>
                    <ProgressChart />
                </div>
                <div className={cx('right')}>
                    <div className={cx('heading')}>
                        <h3 className={cx('income_title')}>Thu nhập</h3>
                        <DropMenu
                            options={options}
                            size="small"
                            optionSelected={optionSelected}
                            setOptionSelected={setOptionSelected}
                        />
                    </div>
                    <IncomeChart data={dataIncomes} size={2 / 1} />
                </div>
            </div>

            <div className={cx('table')}>
                <OrdersLatesTable rows={[]} />
            </div>
        </div>
    );
}

export default HomeAdmin;