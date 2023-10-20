import React, { useState, useEffect } from 'react'
import classNames from "classnames/bind"
import styles from './Product.module.scss'
import EnhancedTable from '../../components/Table/EnhancedTable';
import { api } from '../../../constants';
import { Rating } from "@mui/material"
import LinearProgress from '@mui/material/LinearProgress';
import numeral from 'numeral';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { Delete, Update } from '../../components/Button/Button';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { Dialog, TextField } from "@mui/material"
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { CircularProgress, Backdrop } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from "../../../components/Button";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Dropdown from 'react-multilevel-dropdown';

const cx = classNames.bind(styles)
function Product() {

    const [showDialog, setShowDialog] = useState(false)
    const [published, setPublished] = useState()
    const [rows, setRows] = React.useState([])
    const [avatar, setAvatar] = useState()
    const [loading, setLoading] = useState(false)
    const [isAction, setIsAction] = useState(false)
    const [options, setOptions] = useState([])
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
                    fetch(`${api}/products/delete/${params.value}`, {
                        method: 'GET'
                    })
                        .then(response => response.json())
                        .then(result => {
                            if (result.status === 'OK') {
                                toast.success('Xóa thành công!')
                            } else {
                                toast.error(result.message)
                            }
                            setLoading(false)
                            setIsAction(false)
                        })
                        .catch(err => {
                            setLoading(false)
                            setIsAction(false)
                            toast.error(err.message)
                        })
                }

                return <div style={{ display: 'flex' }} onClick={handleOnCLick}>
                    <p onClick={() => {
                        confirmAlert({
                            title: 'Xác nhận xóa?',
                            message: 'Sản phẩm này sẽ bị xóa khỏi hệ thống!',
                            buttons: [
                                {
                                    label: 'Đồng ý',
                                    onClick: () => {
                                        handleDelete()
                                    }
                                },
                                {
                                    label: 'Hủy',
                                    onClick: () => { }
                                }
                            ]
                        });
                    }}>
                        <Delete />
                    </p>
                    <Link to={`/admin/update-product/${params.row._id}`}>
                        <Update />
                    </Link>
                </div>
            }
        },
    ];

    const {
        register,
        handleSubmit,
        reset
    } = useForm()

    React.useEffect(() => {
        setLoading(true)
        fetch(`${api}/products`)
            .then(response => response.json())
            .then(result => {
                if (result.status === "OK") {
                    setLoading(false)
                    setRows(result.data)
                } else {
                    setLoading(false)
                }
            })
            .catch(error => {
                setLoading(false)
                console.log(error.message)
            })
    }, [isAction])

    useEffect(() => {
        fetch(`${api}/categories`)
            .then(response => response.json())
            .then(result => {
                if (result.status == "OK") {
                    setOptions(result.data)
                }
            })
            .catch(err => console.log(err.message))
    }, [])

    const onSubmit = (data) => {
        const formData = new FormData()
        Object.keys(data).forEach(key => {
            formData.append(key, data[key])
        })
        if (categoryName.value !== "") {
            formData.append("categoryId", categoryName.value)
        }
        if (avatar) {
            formData.append("images", avatar)
        }
        if (published) {
            formData.append("published_date", published)
        }
        setLoading(true)
        setIsAction(true)
        fetch(`${api}/products/add`, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(result => {

                if (result.status === "OK") {
                    toast.success("Thêm mới sản phẩm thành công")
                } else {
                    toast.error(result.message)
                }
                setIsAction(false)
                setLoading(false)
                setShowDialog(false)
            })
            .catch(err => {
                setIsAction(false)
                setLoading(false)
                setShowDialog(false)
                toast.error(err.message)
            })

    }

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

    const handleShowDialog = () => {
        reset()
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
                <form onSubmit={handleSubmit(onSubmit)} className={cx("dialog_add_user")}>
                    <p className={cx('btn_close')} onClick={() => setShowDialog(false)}>
                        <CloseOutlinedIcon className={cx('btn_icon')} />
                    </p>
                    <h1 className={cx("dialog_title")}>Thêm mới sản phẩm</h1>
                    <p className={cx('label')}>Tên sản phẩm</p>
                    <TextField
                        {...register('title')}
                        fullWidth
                        placeholder='Nhập tên sản phẩm'
                        size='medium'
                        style={{
                            outline: 'none',
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                border: '1px solid #1363DF',
                                borderRadius: "4px",
                                padding: "0",
                                height: "40px",
                            },
                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                border: "none"
                            },
                            "& .MuiInputBase-input": {
                                backgroundColor: 'transparent'
                            }
                        }}
                        InputProps={{
                            style: {
                                color: "#333",
                                fontSize: "14px",
                                marginBottom: '16px',
                                backgroundColor: "#fff"
                            }
                        }}
                    />
                    <p className={cx('label')}>Tác giả</p>
                    <TextField
                        {...register('author')}
                        fullWidth
                        placeholder='Nhập tên tác giả'
                        size='medium'
                        style={{
                            outline: 'none',
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                border: '1px solid #1363DF',
                                borderRadius: "4px",
                                padding: "0",
                                height: "40px",
                            },
                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                border: "none"
                            },
                            "& .MuiInputBase-input": {
                                backgroundColor: 'transparent'
                            }
                        }}
                        InputProps={{
                            style: {
                                color: "#333",
                                fontSize: "14px",
                                marginBottom: '16px',
                                backgroundColor: "#fff"
                            }
                        }}
                    />
                    <p className={cx('label')}>Giá hiện tại</p>
                    <TextField
                        {...register('price')}
                        fullWidth
                        placeholder='Nhập giá hiện tại'
                        size='medium'
                        style={{
                            outline: 'none',
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                border: '1px solid #1363DF',
                                borderRadius: "4px",
                                padding: "0",
                                height: "40px",
                            },
                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                border: "none"
                            },
                            "& .MuiInputBase-input": {
                                backgroundColor: 'transparent'
                            }
                        }}
                        InputProps={{
                            style: {
                                color: "#333",
                                fontSize: "14px",
                                marginBottom: '16px',
                                backgroundColor: "#fff"
                            }
                        }}
                    />
                    <p className={cx('label')}>Giá cũ</p>
                    <TextField
                        {...register('old_price')}
                        fullWidth
                        placeholder='Nhập giá cũ'
                        size='medium'
                        style={{
                            outline: 'none',
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                border: '1px solid #1363DF',
                                borderRadius: "4px",
                                padding: "0",
                                height: "40px",
                            },
                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                border: "none"
                            },
                            "& .MuiInputBase-input": {
                                backgroundColor: 'transparent'
                            }
                        }}
                        InputProps={{
                            style: {
                                color: "#333",
                                fontSize: "14px",
                                marginBottom: '16px',
                                backgroundColor: "#fff"
                            }
                        }}
                    />
                    <p className={cx('label')}>Năm xuất bản</p>
                    <LocalizationProvider fullWidth dateAdapter={AdapterDayjs}>
                        <DemoItem>
                            <DatePicker
                                value={published}
                                onChange={(e) => setPublished(e.format("YYYY-MM-DD"))}
                                fullWidth
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        border: '1px solid #1363DF',
                                        borderRadius: "4px",
                                        padding: "0 20px 0 0",
                                        height: "40px",
                                        fontSize: "1.4rem"
                                    },
                                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                        border: "none"
                                    },
                                    "& .MuiInputBase-input": {
                                        backgroundColor: 'transparent'
                                    }
                                }}
                                InputProps={{
                                    style: {
                                        color: "#333",
                                        fontSize: "14px",
                                        marginBottom: '16px',
                                        backgroundColor: "#fff"
                                    }
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </DemoItem>
                    </LocalizationProvider>
                    <p className={cx('label')}></p>
                    <p className={cx('label')}>Loại sản phẩm</p>
                    <Dropdown
                        position="top-right"
                        title={categoryName.name}
                        menuClassName={cx("dropmenu")}
                        buttonClassName={cx("category")}
                        buttonVariant="special-success"
                        wrapperClassName={cx("submenu")}
                    >
                        {
                            options.map((option, index) => (
                                <Dropdown.Item key={index}>
                                    {option._id}
                                    <Dropdown.Submenu
                                        position="right-top"
                                        className={cx("submenu")}
                                    >
                                        {
                                            option.categories.map((category, index) => (
                                                <Dropdown.Item key={index} onClick={() => setCategoryName({ name: category.name, value: category._id })}>
                                                    {category.name}
                                                </Dropdown.Item>
                                            ))
                                        }
                                    </Dropdown.Submenu>
                                </Dropdown.Item>
                            ))
                        }
                    </Dropdown>
                    <p className={cx('label')}></p>
                    <p className={cx('label')}>Mô tả</p>
                    <TextField
                        {...register('description')}
                        multiline
                        maxRows={5}
                        fullWidth
                        placeholder='Mô tả sản phẩm...'
                        size='medium'
                        style={{
                            outline: 'none',
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                border: '1px solid #1363DF',
                                borderRadius: "4px",
                                padding: "5px 5px 5px 10px",
                                minHeight: "120px",
                                maxHeight: "100vh"
                            },
                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                border: "none"
                            },
                            "& .MuiInputBase-input": {
                                backgroundColor: 'transparent'
                            }
                        }}
                        InputProps={{
                            style: {
                                color: "#333",
                                fontSize: "14px",
                                marginBottom: '16px',
                                backgroundColor: "#fff"
                            }
                        }}
                    />
                    <p className={cx('label')}></p>
                    <p className={cx('label')}>Hình ảnh</p>
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

                    <div className={cx('buttons')}>
                        <p>
                            <Button primary>Thêm</Button>
                        </p>
                    </div>
                </form>
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
                loading &&
                <div>
                    <LinearProgress />
                </div>
            }
            {
                rows.length > 0 ? <div className={cx('table')}>
                    <EnhancedTable columns={columns} rows={rows} />
                </div>
                    : <div className={cx('nodata')}>
                        <p className={cx('nodata_label')}>Dữ liệu trống!</p>
                    </div>
            }
        </div>
    )
}

export default Product