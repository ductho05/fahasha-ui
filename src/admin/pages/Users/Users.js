import { useState, useEffect } from "react"
import classNames from "classnames/bind"
import styles from './Users.module.scss'
import EnhancedTable from "../../components/Table/EnhancedTable"
import { api } from '../../../constants'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

const cx = classNames.bind(styles)

const columns = [
    { field: '_id', headerName: 'ID', width: 230 },
    {
        field: 'images',
        headerName: 'Images',
        sortable: false,
        editable: true,
        renderCell: (params) => <img className={cx('image')} src={params.value} />
    },
    { field: 'fullName', headerName: 'Tên đầy đủ', width: 120, sortable: false, },
    {
        field: 'birth',
        headerName: 'Ngày sinh',
        width: 120,
    },
    {
        field: 'email',
        headerName: 'Email',
        sortable: false,
        width: 240,
    }
];

function Users() {
    const [rows, setRows] = useState([])
    useEffect(() => {
        fetch(`${api}/users`)
            .then(response => response.json())
            .then(result => {
                setRows(result.data)
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <h3>Quản lý tài khoản</h3>
                <p className={cx('btn_add_new')}>
                    <AddCircleOutlineOutlinedIcon className={cx('btn_icon')} />
                    <span>Thêm mới</span>
                </p>
            </div>
            <div className={cx('table')}>
                <EnhancedTable columns={columns} rows={rows} />
            </div>
        </div>
    )
}

export default Users
