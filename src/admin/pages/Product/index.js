import React, { useState, useEffect } from 'react'
import classNames from "classnames/bind"
import styles from './Product.module.scss'
import EnhancedTable from '../../components/Table/EnhancedTable';
import { api, appPath } from '../../../constants';
import { Rating } from "@mui/material"
import LinearProgress from '@mui/material/LinearProgress';
import numeral from 'numeral';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { Delete, Update } from '../../components/Button/Button';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { Dialog } from "@mui/material"
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { CircularProgress, Backdrop } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Dropdown from 'react-multilevel-dropdown';
import { Input, DatePicker, Form, Button, Skeleton, Popconfirm, Select } from 'antd';
import SendNotification from '../../../service/SendNotification';
import { getAuthInstance } from '../../../utils/axiosConfig';
import { useData } from '../../../stores/DataContext';

const cx = classNames.bind(styles)
function Product() {

    const authInstance = getAuthInstance()

    const [showDialog, setShowDialog] = useState(false)
    const [published, setPublished] = useState()
    const [rows, setRows] = React.useState([])
    const [avatar, setAvatar] = useState()
    const [loading, setLoading] = useState(false)
    const [loadingProduct, setLoadingProduct] = useState(false)
    const [isAction, setIsAction] = useState(false)
    const [options, setOptions] = useState([])
    const [success, setSuccess] = useState(0)
    const { data, setData } = useData()
    const [categoryName, setCategoryName] = useState({
        name: "--Chọn loại sản phẩm--",
        value: ""
    })

    const columns = [
        {
            field: 'title',
            headerName: 'Sản phẩm',
            sortable: false,
            editable: true,
            width: 240,
            renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : "Trống"}</p>
        },
        {
            field: 'images',
            headerName: 'Images',
            sortable: false,
            editable: true,
            renderCell: (params) => <img className={cx('image')} src={params.value} />
        },
        {
            field: 'author',
            headerName: 'Tác giả',
            sortable: false,
            editable: true,
            width: 180,
            renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : "Trống"}</p>
        },
        {
            field: 'published_date',
            headerName: 'Ngày xuất bản',
            width: 160,
            sortable: false,
            renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? params.value : "Trống"}</p>
        },
        {
            field: 'price',
            headerName: 'Giá hiện tại(đ)',
            width: 100,
            sortable: false,
            renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? numeral(params.value).format('0,0[.]00 VNĐ') : "Trống"}</p>
        },
        {
            field: 'old_price',
            headerName: 'Giá cũ(đ)',
            width: 100,
            sortable: false,
            renderCell: (params) => <p className={params.value ? cx('') : cx('null')}>{params.value ? numeral(params.value).format('0,0[.]00 VNĐ') : "Trống"}</p>
        },
        {
            field: 'rate',
            headerName: 'Đánh giá',
            width: 160,
            sortable: true,
            renderCell: (params) => <Rating name="read-only" value={params.value} readOnly />
        },

        {
            field: '_id',
            headerName: 'Hành động',
            disableColumnMenu: true,
            sortable: false,
            width: 160,
            renderCell: (params) => {
                const handleOnCLick = (e) => {
                    e.stopPropagation();
                }
                const handleDelete = () => {
                    setLoading(true)
                    setIsAction(true)
                    authInstance.get(`${api}/products/delete/${params.value}`)
                        .then(result => {
                            if (result.data.status === 'OK') {
                                toast.success('Xóa thành công!')
                                setSuccess(prev => prev + 1)
                            } else {
                                toast.error(result.data.message)
                            }
                            setLoading(false)
                            setIsAction(false)
                        })
                        .catch(err => {
                            setLoading(false)
                            setIsAction(false)
                            toast.error(err?.response?.data?.message)
                        })
                }

                return <div style={{ display: 'flex' }} onClick={handleOnCLick}>
                    <Popconfirm
                        title="Xác nhận?"
                        description="Sản phẩm sẽ bị xóa khỏi hệ thống"
                        onConfirm={handleDelete}
                        onCancel={() => { }}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <p>
                            <Delete />
                        </p>
                    </Popconfirm>
                    <Link to={`/admin/update-product/${params.row._id}`}>
                        <Update />
                    </Link>
                </div>
            }
        },
    ];

    const fetchProduct = () => {

        fetch(`${api}/products`)
            .then(response => response.json())
            .then(result => {
                if (result.status === "OK") {

                    console.log("fetch lai")
                    setData({ ...data, products: result.data.products })
                }
            })
            .catch(error => {

                console.log(error.message)
            })
    }

    console.log(data.products)

    React.useEffect(() => {

        setRows(data.products)
    }, [data])

    React.useEffect(() => {

        if (success !== 0) {
            fetchProduct()
        }
    }, [success])

    useEffect(() => {
        fetch(`${api}/categories?filter=simple`)
            .then(response => response.json())
            .then(result => {
                if (result.status == "OK") {
                    const newList = result.data.map(category => {
                        return {
                            label: category.name,
                            value: category._id
                        }
                    })
                    setOptions(newList)
                }
            })
            .catch(err => console.log(err.message))
    }, [])

    const onFinish = async (data) => {
        const formData = new FormData()
        Object.keys(data).forEach(key => {
            formData.append(key, data[key])
        })
        if (avatar) {
            formData.append("images", avatar)
        }
        if (published) {
            formData.append("published_date", published)
        }
        setLoading(true)
        setIsAction(true)
        await authInstance.post(`/products/add`, formData)
            .then(async result => {

                if (result.data.status === "OK") {
                    setSuccess(prev => prev + 1)
                    toast.success("Thêm mới sản phẩm thành công")
                    const title = "Thông báo sản phẩm"
                    const description = "TA Book Store vừa ra mắt sản phẩm mới. Xem ngay"
                    const url = `${appPath}/product-detail/${result.data.data._id}`
                    const image = result.data.data.images
                    await authInstance.post("/webpush/send", {
                        filter: "all",
                        notification: {
                            title,
                            description,
                            image: image,
                            url
                        }
                    })
                        .catch((err) => {
                            console.error(err)
                        })
                } else {
                    toast.error(result.data.message)
                }
                setIsAction(false)
                setLoading(false)
                setShowDialog(false)
            })
            .catch(err => {
                setIsAction(false)
                setLoading(false)
                setShowDialog(false)
                toast.error(err?.response?.data?.message)
            })

    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        return () => {
            avatar && URL.revokeObjectURL(avatar.preview)
        }
    }, [avatar]);

    const handleChooseImage = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0]
            file.preview = URL.createObjectURL(file)

            setAvatar(file)
        }
    }

    const changeDate = (date, dateString) => {
        setPublished(dateString)
    }

    const handleShowDialog = () => {
        if (avatar) {
            URL.revokeObjectURL(avatar.preview)
            setAvatar()
        }
        setCategoryName({
            name: "--Chọn loại sản phẩm--",
            value: ""
        })
        setPublished()
        setShowDialog(true)
    }

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <div className={cx('wrapper')}>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Dialog
                open={showDialog}
            >
                <div className={cx("dialog_add_user")}>
                    <p className={cx('btn_close')} onClick={() => setShowDialog(false)}>
                        <CloseOutlinedIcon className={cx('btn_icon')} />
                    </p>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 18,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Tên"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống',
                                },
                            ]}
                        >
                            <Input placeholder='Nhập tên sản phẩm' />
                        </Form.Item>

                        <Form.Item
                            label="Tác giả"
                            name="author"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống',
                                },
                            ]}
                        >
                            <Input placeholder='Nhập tên tác giả' />
                        </Form.Item>

                        <Form.Item
                            label="Giá hiện tại"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống',
                                },
                            ]}
                        >
                            <Input placeholder='Nhập giá hiện tại' />
                        </Form.Item>

                        <Form.Item
                            label="Giá cũ"
                            name="old_price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống',
                                },
                            ]}
                        >
                            <Input placeholder='Nhập giá cũ' />
                        </Form.Item>

                        <Form.Item
                            label="Loại sản phẩm"
                            name="categoryId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống!',
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn loại sản phẩm"
                                optionFilterProp="children"
                                filterOption={filterOption}
                                options={options}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Số lượng nhập"
                            name="quantity"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống!',
                                },
                            ]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <p className={cx('label')}></p>
                        <div className="flex items-center">
                            <p className='text-red-600 text-right'>*</p>
                            <p className={cx('label')}>Năm xuất bản:</p>
                            <div className="flex flex-[18] justify-start">
                                <DatePicker
                                    onChange={changeDate}
                                />
                            </div>
                        </div>
                        <p className={cx('label')}></p>
                        <Form.Item
                            label="Mô tả"
                            name="desciption"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nội dung này không được để trống',
                                },
                            ]}
                        >
                            <Input.TextArea
                                placeholder='Mô tả sản phẩm...'
                                rows={5}
                            />
                        </Form.Item>
                        <div className='flex items-center mb-[20px]'>
                            <p className='text-red-600 text-right'>*</p>
                            <p className={cx('label')}>Hình ảnh:</p>
                            <div className={cx('avatar')}>
                                <p className={cx('edit_avatar')}>
                                    <label for="image">
                                        <AccountCircleIcon className={cx('icon')} />
                                        Chọn
                                    </label>
                                    <input type="file" id='image' name='image' onChange={(e) => handleChooseImage(e)} />
                                </p>
                                {
                                    avatar && <img src={avatar.preview} />
                                }
                            </div>
                        </div>
                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Thêm
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Dialog>
            <Backdrop
                sx={{ color: '#fff', zIndex: 10000 }}
                open={loading}
            >
                {isAction && <CircularProgress color="error" />}
            </Backdrop>
            <div className={cx('heading')}>
                <h3>Quản lý sản phẩm</h3>
                <p onClick={handleShowDialog} className={cx('btn_add_new')}>
                    <AddCircleOutlineOutlinedIcon className={cx('btn_icon')} />
                    <span>Thêm mới</span>
                </p>
            </div>
            {
                loadingProduct &&
                <div>
                    <LinearProgress />
                </div>
            }
            {
                loadingProduct === false ? <div className={cx('table')}>
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
    )
}

export default Product