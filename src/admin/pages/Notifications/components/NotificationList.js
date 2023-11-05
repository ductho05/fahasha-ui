import React from 'react'
import { api } from '../../../../constants';
import EnhancedTable from '../../../components/Table/EnhancedTable';

function NotificationList() {

    const [notices, setNotices] = React.useState([])

    const columns = [
        {
            field: 'image',
            headerName: 'Image',
            sortable: false,
            editable: true,
            renderCell: (params) => <img className="w-[40px] h-[40px] object-cover" src={params.value} />
        },
        {
            field: 'title',
            headerName: 'Tên',
            sortable: false,
            editable: true,
            width: 240,
            renderCell: (params) => <p className="">{params.value ? params.value : "Trống"}</p>
        },
        {
            field: 'description',
            headerName: 'Mô tả',
            width: 600,
            sortable: false,
            editable: true,
            renderCell: (params) => <p className="">{params.value ? params.value : "Trống"}</p>
        }

    ];

    React.useEffect(() => {
        fetch(`${api}/webpush/get-all`)
            .then(response => response.json())
            .then(result => {
                if (result.status === "OK") {
                    setNotices(result.data)
                }
            })
            .catch(err => {
                console.error(err)
            })
    }, [])

    return (
        <EnhancedTable columns={columns} rows={notices} />
    )
}

export default NotificationList