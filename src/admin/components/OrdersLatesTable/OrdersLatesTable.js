import classNames from 'classnames/bind'
import styles from './OrdersLatesTable.module.scss'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const cx = classNames.bind(styles)

function OrdersLatesTable({ rows }) {
    return (
        <>
            <h2 className={cx('title')}>Đơn hàng mới nhất</h2>
            <TableContainer component={Paper} className={cx('table_orders')}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className={cx('tableCell')}>Người nhận</TableCell>
                            <TableCell className={cx('tableCell')}>Địa Chỉ</TableCell>
                            <TableCell className={cx('tableCell')}>Số điện thoại</TableCell>
                            <TableCell className={cx('tableCell')}>Số lượng</TableCell>
                            <TableCell className={cx('tableCell')}>Thành tiền</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows?.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell className={cx('tableCell')}>{row.name}</TableCell>
                                <TableCell className={cx('tableCell')}>{`${row.address}, ${row.wards}, ${row.districs}, ${row.city}, ${row.country}`}</TableCell>
                                <TableCell className={cx('tableCell')}>{row.phone}</TableCell>
                                <TableCell className={cx('tableCell')}>{row.quantity}</TableCell>
                                <TableCell className={cx('tableCell')}>
                                    {row.price.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default OrdersLatesTable
