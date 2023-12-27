import React from 'react';
import { api } from '../../../../constants';
import EnhancedTable from '../../../components/Table/EnhancedTable';
import { getAuthInstance } from '../../../../utils/axiosConfig';
import { useData } from '../../../../stores/DataContext';
function NotificationList() {
    const authInstance = getAuthInstance();
    const { data, setData } = useData();
    const [notices, setNotices] = React.useState([]);

    const columns = [
        {
            field: 'rowNumber',
            headerName: 'STT',
            width: 30,
            sortable: false,
            editable: false,
            headerAlign: 'center',
            renderCell: (params) => {
                return (
                    <>
                        <p
                            style={{
                                padding: '0 0 0 10px',
                            }}
                        >
                            {params.value}
                        </p>
                    </>
                );
            },
        },
        {
            field: 'image',
            headerName: 'Image',
            sortable: false,
            editable: true,
            renderCell: (params) => <img className="w-[40px] h-[40px] object-cover" src={params.value} />,
        },
        {
            field: 'title',
            headerName: 'Tên',
            sortable: false,
            editable: true,
            width: 240,
            renderCell: (params) => <p className="">{params.value ? params.value : 'Trống'}</p>,
        },
        {
            field: 'description',
            headerName: 'Mô tả',
            width: 600,
            sortable: false,
            editable: true,
            renderCell: (params) => <p className="">{params.value ? params.value : 'Trống'}</p>,
        },
    ];

    React.useEffect(() => {
        if (data?.noties?.length > 0) {
            setNotices(data?.noties);
        }
    }, [data]);

    return (
        <EnhancedTable
            columns={columns}
            ischeckboxSelection={false}
            type="notification"
            pageSize={12}
            height="72.5vh"
            rows={notices?.map((row, index) => ({
                ...row,
                rowNumber: index + 1,
            }))}
        />
    );
}

export default NotificationList;
