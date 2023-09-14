import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DataGrid, viVN } from '@mui/x-data-grid';
import CustomToolbar from './Components/CustomToolBar.js';
import CustomPagination from './Components/CustomPagonation';
import classNames from "classnames/bind";
import styles from '././EnhancedTable.module.scss'
import { Delete, View } from '../Button/Button';

const cx = classNames.bind(styles)
const actions = {
    field: 'action',
    headerName: 'Hành động',
    disableColumnMenu: true,
    sortable: false,
    width: 160,
    renderCell: (params) => {
        const handleOnCLick = (e) => {
            e.stopPropagation();
        }

        return <div className={cx('actions')} onClick={handleOnCLick}>
            <p><Delete /></p>
            <Link to={`/admin/user/${params.row._id}`}><View /></Link>
        </div>
    }
}

export default function EnhancedTable({ columns, rows }) {

    const [loading, setLoading] = useState(false)

    const handleOnCLickButton = (setShowForm) => {
        setShowForm(true)
    }
    useEffect(() => {
        if (!rows) {
            setLoading(true)
        } else {
            setLoading(false)
        }
    }, [rows])

    return (
        <div style={{ minHeight: 400, width: '100%' }}>
            <DataGrid
                getRowId={(row) => row._id}
                style={{
                    fontSize: '1.3rem',
                    '.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                        outline: 'none'
                    }
                }}
                localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                rows={rows}
                columns={columns.concat(actions)}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[10, 20]}
                checkboxSelection
                slots={{
                    toolbar: CustomToolbar,
                    pagination: CustomPagination
                }}
                loading={loading}
            />
        </div>
    )
}