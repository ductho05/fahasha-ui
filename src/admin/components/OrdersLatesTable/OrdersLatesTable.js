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

const rows = [
    {
        name: 'Frozen yoghurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0
    },
    {
        name: 'Frozen yoghurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0
    }
];
function OrdersLatesTable() {
    return (
        <>
            <h2 className={cx('title')}>Đơn hàng mới nhất</h2>
            <TableContainer component={Paper} className={cx('table_orders')}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className={cx('tableCell')}>Dessert</TableCell>
                            <TableCell className={cx('tableCell')}>Calories</TableCell>
                            <TableCell className={cx('tableCell')}>Fat(g)</TableCell>
                            <TableCell className={cx('tableCell')}>Carbs(g)</TableCell>
                            <TableCell className={cx('tableCell')}>Protein(g)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.name}>
                                <TableCell className={cx('tableCell')}>{row.name}</TableCell>
                                <TableCell className={cx('tableCell')}>{row.calories}</TableCell>
                                <TableCell className={cx('tableCell')}>{row.fat}</TableCell>
                                <TableCell className={cx('tableCell')}>{row.carbs}</TableCell>
                                <TableCell className={cx('tableCell')}>{row.protein}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default OrdersLatesTable
