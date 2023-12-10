import React from 'react'
import { api } from '../../../../constants';
import EnhancedTable from '../../../components/Table/EnhancedTable';
import { getAuthInstance } from "../../../../utils/axiosConfig"

function NotificationList() {

    const authInstance = getAuthInstance()

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
        authInstance.get(`/webpush/get-all`)
            .then(result => {
                console.log(result)
                if (result.data.status === "OK") {
                    setNotices(result.data.data)
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