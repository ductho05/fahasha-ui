import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import EnhancedTable from '../../components/Table/EnhancedTable';
import { useData } from '../../../stores/DataContext';
import { Button, Form, Input, Modal, Tooltip } from 'antd';
import { Backdrop, CircularProgress, Dialog } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { api, appPath, lockImage, unLockImage } from '../../../constants';
import { useNavigate } from "react-router-dom"
import { getAuthInstance } from "../../../utils/axiosConfig"
import React from 'react';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';

function Categories() {

    const [rows, setRows] = React.useState([])
    const { data, setData } = useData()
    const [displayForm, setDisplayForm] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [success, setSuccess] = React.useState(0)
    const navigate = useNavigate()
    const authInstance = getAuthInstance()

    const updateData = (category, products) => {
        const newListCategories = data.categories?.map((c) => {
            if (c._id === category._id) {
                return { ...category };
            } else return c;
        })

        const newProduct = data.products.map(product => {
            const replacement = products.find(p => p._id === product._id);
            if (replacement) {
                return { ...replacement }
            }
            return { ...product }
        })

        setData({ ...data, categories: newListCategories, products: newProduct })
    }

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
            renderCell: (params) => {
                return (
                    <p className={`font-[600] ${params.value ? "text-green-600" : "text-red-600"}`}>
                        {params.value ? "Hoạt động" : "Ngưng"}
                    </p>
                )
            }
        },
        {
            field: '_id',
            headerName: 'Hành động',
            sortable: false,
            editable: true,
            width: 240,
            renderCell: (params) => {

                const handleLockCategory = async (category) => {

                    const statusUpdate = category.status ? false : true
                    const response = await authInstance.put(`/categories/${category._id}`, {
                        status: statusUpdate
                    })

                    if (response.status === 200) {

                        const responseProduct = await authInstance.put("/products/many", {
                            status: response.data.data.status,
                            id: response.data.data._id
                        })

                        if (responseProduct.status === 200) {

                            updateData(response.data.data, responseProduct.data.data)
                            const image = response.data.data.status ? unLockImage : lockImage
                            await authInstance.post(`/webpush/send`, {
                                filter: "admin",
                                notification: {
                                    title: "Thông báo",
                                    description: `${response.data.data.status ? `Danh mục ${response.data.data.name} vừa được hoạt động trở lại` : `Danh mục ${response.data.data.name} tạm thời bị khóa`}`,
                                    url: `${appPath}/admin/categories`,
                                    image
                                }
                            })
                            toast.success("Cập nhật thành công!")
                        }
                    }
                }

                return (
                    <div>
                        <Tooltip
                            title={
                                params.row.status === false
                                    ? 'Mở lại trạng thái hoạt động'
                                    : 'Ngưng hoạt động'
                            }
                        >
                            <Button
                                className="mr-[20px]"
                                onClick={() => {
                                    Modal.confirm({
                                        title: "Lưu ý!",
                                        content: params.row.status ?
                                            `Khi danh mục ${params.row.name} bị khóa, tất cả sản phẩm thuộc danh mục này sẽ ngưng bán`
                                            : `Khi danh mục ${params.row.name} được mở khóa, tất cả sản phẩm thuộc danh mục này sẽ được mở bán trở lại`,
                                        onOk: () => handleLockCategory(params.row)
                                    })
                                }}
                                icon={
                                    params.row.status === false ? (
                                        <UnlockOutlined />
                                    ) : (
                                        <LockOutlined />
                                    )
                                }
                                danger
                            />
                        </Tooltip>
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
                                onClick={() => navigate(`/admin/categories/${params.value}`)}

                            >
                                Chi tiết
                            </Button>
                        </Tooltip>
                    </div>
                )
            }

        }
    ]

    const handleDisplayForm = () => {

        setDisplayForm(true)
    }

    const fetchCategory = async () => {

        await fetch(`${api}/categories?filter=simple`)
            .then(response => response.json())
            .then(result => {
                if (result.status == "OK") {
                    setData({ ...data, categories: result.data })
                }
            })
            .catch(err => console.log(err.message))
    }

    React.useEffect(() => {

        if (success != 0) {

            fetchCategory()
        }
    }, [success])

    React.useEffect(() => {

        console.log(data.categories)
        if (data.categories) {
            const newRows = data?.categories?.map((category, index) => {
                return {
                    ...category,
                    rowNumber: index + 1,
                }
            })
            setRows(newRows)
        }
    }, [data.categories])

    const handleOk = (value) => {

        setLoading(true)
        authInstance.post("/categories", { ...value })
            .then(async response => {
                if (response.data.status == "OK") {
                    setDisplayForm(false)
                    toast.success("Thêm thành công!")
                    setSuccess(prev => prev += 1)
                } else {
                    toast.error(response.data.message)
                }
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                toast.error(err.response.data.message)
                setLoading(false)
            })
    };
    const handleCancel = () => {
        setDisplayForm(false)
    }

    return (
        <div className="p-[20px]">
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Backdrop
                sx={{ color: '#fff', zIndex: 10000 }}
                open={loading}
            >
                <CircularProgress color="error" />
            </Backdrop>
            <Dialog
                open={displayForm}
                onClose={handleCancel}
            >
                <div className="p-[20px] w-[50rem]">
                    <h1 className="py-[20px] text-[2rem] text-[#333] font-[600]">
                        Thêm mới loại sản phẩm
                    </h1>
                    <Form
                        layout='vertical'
                        onFinish={handleOk}
                        autoComplete="off"
                        style={{
                            width: '100%'
                        }}
                    >
                        <Form.Item
                            label="Tên"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng không để trống thông tin này',
                                },
                            ]}
                        >
                            <Input />
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
                </div>
            </Dialog>

            <div className="flex items-center justify-between p-[20px] shadow-lg rounded-[8px]">
                <h1 className="text-[2rem] uppercase text-[#333] font-[500]">Quản lý loại sản phẩm</h1>
                <p onClick={handleDisplayForm} className="cursor-pointer flex items-center justify-center text-[#00dfa2] w-[120px] h-[35px] rounded-[4px] border border-[#00dfa2] font-[600] mr-[10px]">
                    <AddCircleOutlineOutlinedIcon className="text-[2rem] mr-[8px]" />
                    <span>Thêm mới</span>
                </p>
            </div>

            <div className="mt-[20px]">
                {
                    rows && <EnhancedTable
                        ischeckboxSelection={false}
                        columns={columns}
                        rows={rows}
                    />
                }
            </div>
        </div>
    )
}

export default Categories