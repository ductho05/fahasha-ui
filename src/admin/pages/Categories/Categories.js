import React from 'react'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import EnhancedTable from '../../components/Table/EnhancedTable';
import { useData } from '../../../stores/DataContext';
import { Button, Form, Input, Modal, Tooltip } from 'antd';

function Categories() {

    const [rows, setRows] = React.useState([])
    const { data, setData } = useData()
    const [displayForm, setDisplayForm] = React.useState(false)

    React.useState(() => {

        const newRows = data.categories.map((category, index) => {
            return {
                ...category,
                rowNumber: index + 1,
            }
        })
        setRows(newRows)
    }, [])

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
            field: 'name',
            headerName: 'Tên',
            sortable: false,
            editable: true,
            width: 300,
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            sortable: false,
            editable: true,
            width: 180,

        },
        {
            field: '_id',
            headerName: 'Hành động',
            sortable: false,
            editable: true,
            width: 240,
            renderCell: (params) => {
                return (
                    <Tooltip
                        title="Xem danh sách sản phẩm"
                        placement='right'
                    >
                        <Button
                            type="primary"
                            ghost
                            style={{
                                margin: '0 10px 0 0',
                            }}

                        >
                            Chi tiết
                        </Button>
                    </Tooltip>
                )
            }

        },
        // {
        //     field: 'published_date',
        //     headerName: 'Ngày xuất bản',
        //     width: 160,
        //     sortable: false,
        //     renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : "Trống"}</p>
        // },
        // {
        //     field: 'price',
        //     headerName: 'Giá hiện tại(đ)',
        //     width: 100,
        //     sortable: false,
        //     renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? numeral(params.value).format('0,0[.]00 VNĐ') : "Trống"}</p>
        // },
        // {
        //     field: 'old_price',
        //     headerName: 'Giá cũ(đ)',
        //     width: 100,
        //     sortable: false,
        //     renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? numeral(params.value).format('0,0[.]00 VNĐ') : "Trống"}</p>
        // },
        // {
        //     field: 'rate',
        //     headerName: 'Đánh giá',
        //     width: 160,
        //     sortable: true,
        //     renderCell: (params) => <Rating name="read-only" value={params.value} readOnly />
        // },
    ]

    const handleDisplayForm = () => {

        setDisplayForm(true)
    }

    const handleOk = (value) => {
        console.log(value)
    };
    const handleCancel = () => {
        setDisplayForm(false)
    };

    return (
        <div className="p-[20px]">
            <Modal
                title="Thêm mới loại sản phẩm"
                open={displayForm}
                onCancel={handleCancel}
            >
                <Form
                    layout='vertical'
                    onFinish={handleOk}
                    autoComplete="off"
                    style={{
                        width: '100%'
                    }}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Thêm
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <div className="flex items-center justify-between p-[20px] shadow-lg rounded-[8px]">
                <h1 className="text-[2rem] uppercase text-[#333] font-[500]">Quản lý loại sản phẩm</h1>
                <p onClick={handleDisplayForm} className="cursor-pointer flex items-center justify-center text-[#00dfa2] w-[120px] h-[35px] rounded-[4px] border border-[#00dfa2] font-[600] mr-[10px]">
                    <AddCircleOutlineOutlinedIcon className="text-[2rem] mr-[8px]" />
                    <span>Thêm mới</span>
                </p>
            </div>

            <div className="mt-[20px]">
                <EnhancedTable
                    ischeckboxSelection={false}
                    columns={columns}
                    rows={rows}
                />
            </div>
        </div>
    )
}

export default Categories