import React from 'react'
import { useParams } from 'react-router-dom'
import classNames from 'classnames/bind'
import styles from './UpdateProduct.module.scss'
import { TextField } from '@mui/material'
import Dropdown from 'react-multilevel-dropdown';
import Button from "../../../components/Button";
import { api } from '../../../constants'
import { useForm } from "react-hook-form"
import dayjs from 'dayjs';
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress, Backdrop, LinearProgress } from "@mui/material";
import { DatePicker } from 'antd';

import { Skeleton } from 'antd';

const cx = classNames.bind(styles)

function UpdateProduct() {

    const { pid } = useParams()
    const [options, setOptions] = React.useState([])
    const [published, setPublished] = React.useState()
    const [product, setProduct] = React.useState({})
    const [avatar, setAvatar] = React.useState()
    const [loading, setLoading] = React.useState(false)
    const [isAction, setIsAction] = React.useState(false)
    const [categoryName, setCategoryName] = React.useState({
        name: "--Chọn loại sản phẩm--",
        value: ""
    })

    const {
        register,
        handleSubmit,
        reset,
        setValue
    } = useForm()

    React.useEffect(() => {
        fetch(`${api}/categories`)
            .then(response => response.json())
            .then(result => {
                if (result.status == "OK") {
                    setOptions(result.data)
                }
            })
            .catch(err => console.log(err.message))
    }, [])

    React.useEffect(() => {
        setLoading(true)
        fetch(`${api}/products/id/${pid}`)
            .then(response => response.json())
            .then(result => {
                if (result.status == "OK") {
                    setProduct(result.data)
                }
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
            })
    }, [isAction])

    React.useEffect(() => {
        Object.keys(product).forEach(key => {
            setValue(key, product[key])
        })
        setCategoryName({
            name: product.categoryId?.name,
            value: product.categoryId?._id
        })
        setPublished(dayjs(product.published_date))
    }, [product])

    const handleDate = (date, dateString) => {
        setPublished(dateString)
    }

    const handleChangeImage = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0]
            file.preview = URL.createObjectURL(file)

            setAvatar(file)
        }
    }

    React.useEffect(() => {
        return () => {
            avatar && URL.revokeObjectURL(avatar.preview)
        }
    }, [avatar]);

    const onSubmit = (data) => {
        const formData = new FormData()
        Object.keys(data).forEach(key => {
            formData.append(key, data[key])
        })
        if (avatar) {
            formData.set('images', avatar)
        }
        if (published != product.published_date) {
            formData.set('published_date', published)
        }
        if (categoryName.value != product.categoryId?._id) {
            formData.set("categoryId", categoryName.value)
        }
        setLoading(true)
        setIsAction(true)
        fetch(`${api}/products/update/${product._id}`, {
            method: 'PUT',
            body: formData
        })
            .then(response => response.json())
            .then(result => {
                if (result.status === "OK") {
                    toast.success('Cập nhật sản phẩm thành công!')
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

    return (
        <>
            {
                loading &&
                <div>
                    <LinearProgress />
                </div>
            }
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
                <Backdrop
                    sx={{ color: '#fff', zIndex: 10000 }}
                    open={loading}
                >
                    {isAction && <CircularProgress color="error" />}
                </Backdrop>
                <h1 className={cx('heading')}>Chỉnh sửa thông tin sản phẩm</h1>
                {
                    loading ? <div className="mt-[20px]">
                        <Skeleton
                            active
                            avatar
                            paragraph={{
                                rows: 8,
                            }}
                        />
                    </div>
                        : <form onSubmit={handleSubmit(onSubmit)} className={cx('form')}>
                            <div className={cx('content')}>
                                <div className={cx('left')}>
                                    <p className={cx('label')}>Hình ảnh</p>
                                    <div className={cx('images')}>
                                        <img src={avatar ? avatar.preview : product?.images} alt="images" />
                                        <input onChange={(e) => handleChangeImage(e)} type="file" id="images" className={cx('input_images')} />
                                        <label for="images" id="images">Chỉnh sửa ảnh</label>
                                    </div>
                                    <p className={cx('label')}>Mô tả</p>
                                    <TextField
                                        {...register('desciption')}
                                        multiline
                                        fullWidth
                                        placeholder='Mô tả sản phẩm...'
                                        size='small'
                                        className="scroll-custom"
                                        InputProps={{
                                            style: {
                                                color: "#333",
                                                fontSize: "13px",
                                                marginBottom: '16px',
                                                backgroundColor: "#fff"
                                            }
                                        }}
                                    />
                                </div>
                                <div className={cx('right')}>
                                    <p className={cx('label')}>Tên sản phẩm</p>
                                    <TextField
                                        {...register('title')}
                                        fullWidth
                                        placeholder='Nhập tên sản phẩm'
                                        size='small'
                                        InputProps={{
                                            style: {
                                                color: "#333",
                                                fontSize: "13px",
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
                                        size='small'
                                        InputProps={{
                                            style: {
                                                color: "#333",
                                                fontSize: "13px",
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
                                        size='small'
                                        InputProps={{
                                            style: {
                                                color: "#333",
                                                fontSize: "13px",
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
                                        size='small'
                                        InputProps={{
                                            style: {
                                                color: "#333",
                                                fontSize: "13px",
                                                marginBottom: '16px',
                                                backgroundColor: "#fff"
                                            }
                                        }}
                                    />
                                    <p className={cx('label')}>Năm xuất bản</p>
                                    <DatePicker onChange={handleDate} defaultValue={dayjs(product.published_date)} />
                                    <p className={cx('label')}></p>
                                    <p className={cx('label')}>Loại sản phẩm</p>
                                    <Dropdown title={categoryName.name}
                                        menuClassName={cx("dropmenu")}
                                        buttonClassName={cx("category")}
                                        buttonVariant="special-success"
                                        wrapperClassName={cx("submenu")}
                                        position="top-right"
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
                                </div>
                            </div>
                            <div className={cx('buttons')}>
                                <p>
                                    <Button primary>Lưu thay đổi</Button>
                                </p>
                            </div>
                        </form>
                }

            </div>

        </>
    )
}

export default UpdateProduct