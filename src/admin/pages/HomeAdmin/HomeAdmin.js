import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './HomeAdmin.module.scss';
import Widget from '../../components/Widget/Widget';
import ProgressChart from '../../components/charts/ProgressChart/ProgressChart';
import IncomeChart from '../../components/charts/IncomeChart/IncomeChart';
import DropMenu from '../../../components/DropMenu';
import OrdersLatesTable from '../../components/OrdersLatesTable/OrdersLatesTable';
import { useData } from '../../../stores/DataContext'
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


const cx = classNames.bind(styles)

function chuyenDoiThang(tenVietTat) {
    const thangDict = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12',
    };

    const soThang = thangDict[tenVietTat];

    return soThang;
}

const formatDateToString = (date) => {
    if (date) {
        date = date.$d ? date.$d : date;
        const year = date.getUTCFullYear();
        const month = chuyenDoiThang(date.toString().slice(4, 7));
        const day = date.toString().slice(8, 10);
        const utcTimeString = `${year}-${month}-${day}`;
        return utcTimeString;
    }
    return '';
}

function HomeAdmin() {

    const [dataWidgets, setDataWidgets] = useState([])
    const { data, setData } = useData()
    const [rows, setRows] = useState([])
    const [dataIncomes, setDataIncomes] = useState([])
    const navigate = useNavigate()

    const num = 5

    useEffect(() => {
        const countUsers = data?.users?.length
        const countOrders = data?.orders?.filter(order => order.status !== "DAHUY")?.length
        const listOrderComplete = data?.orders?.filter(order => order.status == "HOANTHANH")
        let incomes = 0
        if (listOrderComplete) {
            incomes = listOrderComplete?.reduce((acc, order) => acc + order.price, 0)
        }
        const countEvaluate = data?.evaluates?.length
        const listNewOrderComplete = data?.orders?.filter((order) => order.status == "HOANTHANH")?.slice(0, 10)

        const incomeData = []


        for (let i = num + 1; i >= 0; i--) {
            const customday = new Date();
            customday.setDate(customday.getDate() - i);
            const orderscustom = data?.orders?.filter((order) => {
                return formatDateToString(new Date(order.date)) == formatDateToString(customday);
            });
            let totalToday = 0
            if (orderscustom) {
                totalToday = orderscustom.reduce((total, order) => {
                    return total + order.price;
                }, 0);
            }
            incomeData.push({
                date: formatDateToString(customday),
                value: totalToday,
            });
        }
        setDataIncomes(incomeData);

        setDataWidgets([
            {
                title: 'Người dùng',
                type: 'users',
                value: countUsers,
                url: '/admin/user'
            },
            {
                title: 'Đơn hàng',
                type: 'orders',
                value: countOrders,
                url: '/admin/orders'
            },
            {
                title: 'Thu nhập',
                type: 'earnings',
                value: incomes,
                url: '/admin/statistics'
            },
            {
                title: 'Đánh giá',
                type: 'reviews',
                value: countEvaluate,
                url: '/admin/reviews'
            },
        ])

        setRows(listNewOrderComplete)

    }, [data])

    const handleToStatistic = () => {

        navigate("/admin/statistics")
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('widgits')}>
                {dataWidgets.map((widget, index) => (
                    <Widget key={index} widget={widget} />
                ))}
            </div>
            <div className={cx('chart')}>
                <div className={cx('right')}>
                    <div className={cx('heading p-[20px]')}>
                        <Button onClick={handleToStatistic} icon={<ArrowRightOutlined />} danger>Xem tất cả</Button>
                    </div>
                    <div>
                        <h3 className="mb-[20px] text-[2rem] uppercase text-[#333] font-[600] text-center">
                            Thu nhập 6 ngày gần nhất
                        </h3>
                        <IncomeChart data={dataIncomes} size={3 / 1} />
                    </div>
                </div>
            </div>

            <div className={cx('table')}>
                <OrdersLatesTable rows={rows} />
            </div>
        </div>
    );
}

export default HomeAdmin;