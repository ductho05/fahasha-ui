import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Review.module.scss';
import EnhancedTable from '../../components/Table/EnhancedTable';
import { Rating } from '@mui/material';
import { api } from '../../../constants';
import LinearProgress from '@mui/material/LinearProgress';
import { Skeleton } from 'antd';

const cx = classNames.bind(styles);

const columns = [
    { field: '_id', headerName: 'ID', width: 200 },
    {
        field: 'user',
        headerName: 'Tên tài khoản',
        width: 130,
        sortable: false,
        editable: true,
        renderCell: (params) => (
            <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value?.fullName : 'Trống'}</p>
        ),
    },
    {
        field: 'comment',
        headerName: 'Comment',
        width: 450,
        sortable: false,
        renderCell: (params) => (
            <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : 'Trống'}</p>
        ),
    },
    {
        field: 'rate',
        headerName: 'Sao đánh giá',
        width: 120,
        sortable: true,
        renderCell: (params) => <Rating name="read-only" value={params.value} readOnly />,
    },
    {
        field: 'product',
        headerName: 'Sản phẩm',
        width: 100,
        renderCell: (params) => <img className={cx('image')} src={params.value?.images} />,
    },
];

function Review() {

    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        fetch(`${api}/evaluates/get`)
            .then(response => response.json())
            .then(result => {
                setLoading(false)
                setRows(result.data)
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
    }, [])

    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <h3>Quản lý đánh giá</h3>
            </div>

            {
                loading &&
                <div>
                    <LinearProgress />
                </div>
            }

            {
                loading === false
                    ? <div className={cx('table')}>
                        <EnhancedTable columns={columns} rows={rows} />
                    </div>
                    : <div className="mt-[20px]">
                        <Skeleton
                            active
                            paragraph={{
                                rows: 8,
                            }}
                        />
                    </div>
            }
        </div>
    );
}

export default Review;
