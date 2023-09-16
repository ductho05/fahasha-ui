import { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './UserDetail.module.scss'
import IncomeChart from '../../components/charts/IncomeChart/IncomeChart'
import DropMenu from '../../../components/DropMenu'
import OrdersLatesTable from '../../components/OrdersLatesTable/OrdersLatesTable'
import { Dialog } from '@mui/material'
import Button from '../../../components/Button'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useForm, useController } from 'react-hook-form'

const cx = classNames.bind(styles)
const dataIncomes = [
    {
        date: '31/7/2023',
        value: 340
    },
    {
        date: '1/8/2023',
        value: 500
    },
    {
        date: '2/8/2023',
        value: 400
    },
    {
        date: '3/8/2023',
        value: 900
    },
    {
        date: '4/8/2023',
        value: 700
    },
    {
        date: '5/8/2023',
        value: 990
    }
]

const options = [
    {
        title: '6 ngày gần nhất',
        value: 'createdAt',
        type: 'desc'
    },
    {
        title: '6 tuần gần nhất',
        value: 'createdAt',
        type: 'desc'
    },
    {
        title: '6 tháng gần nhất',
        value: 'createdAt',
        type: 'desc'
    },
    {
        title: '6 năm gần nhất',
        value: 'createdAt',
        type: 'desc'
    },
]

function UserDetail() {

    const [optionSelected, setOptionSelected] = useState(options[0])
    const [showDialog, setShowDialog] = useState(false)
    const [avatar, setAvatar] = useState({})

    const handleClickEdit = () => {
        setShowDialog(true)
    }

    const handleCloseEdit = () => {
        clearErrors()
        setAvatar({})
        setShowDialog(false)
    }

    useEffect(() => {

        return () => {
            URL.revokeObjectURL(avatar.preview)
        }
    }, [avatar])

    const handlePreview = (e) => {
        const file = e.target.files[0]
        file.preview = URL.createObjectURL(file)

        setAvatar(file)
    }

    // Validate
    const {
        clearErrors,
        control,
        formState: { errors },
        handleSubmit
    } = useForm({
        mode: 'onBlur'
    })

    const nameController = useController({
        name: 'fullName',
        control,
        rules: {
            required: 'Thông tin này không được để trống'
        }
    })

    const emailController = useController({
        name: 'email',
        control,
        rules: {
            required: 'Thông tin này không được để trống',
            pattern: {
                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Email không đúng định dạng'
            }
        }
    })

    const phoneController = useController({
        name: 'phone',
        control,
        rules: {
            required: 'Thông tin này không được để trống'
        }
    })

    const addressController = useController({
        name: 'address',
        control,
        rules: {
            required: 'Thông tin này không được để trống'
        }
    })

    const handleSave = (data) => {
        const formData = new FormData()
        Object.keys(data).forEach((key, value) => {
            formData.append(key, value)
        })
        if (Object.keys(avatar).length > 0) {
            formData.append('images', avatar)
        }

    }

    return (
        <div className={cx('wrapper')}>
            <Dialog open={showDialog}>
                <div className={cx('dialog')}>
                    <p className={cx('btn_close')} onClick={handleCloseEdit}>
                        <CloseOutlinedIcon className={cx('btn_icon')} />
                    </p>
                    <h3 className={cx('dialog_title')}>Chỉnh sửa thông tin tài khoản</h3>
                    <form onSubmit={handleSubmit(handleSave)} className={cx('dialog_content')}>
                        <div className={cx('left')}>
                            <div className={cx('images')}>
                                <img src={avatar.preview ? avatar.preview : 'https://res.cloudinary.com/dgntuytuu/image/upload/v1690363555/book-store/gmldbxptgqxbhsxocowd.jpg'} alt='Avatar' />
                                <div className={cx('btn_channge')}>
                                    <label for="image">Sửa</label>
                                    <input type='file' id='image' onChange={(e) => handlePreview(e)} />
                                </div>
                            </div>
                        </div>
                        <div className={cx('right')}>
                            <div className={errors.fullName ? cx('form_group', 'error') : errors.fullName ? cx('form_group', 'error') : cx('form_group')}>
                                <p className={cx('label')}>Tên</p>
                                <input
                                    {...nameController.field}
                                    onBlur={nameController.field.onBlur}
                                    type='text'
                                    placeholder='Nhập tên'
                                />
                                <p className={cx('error_message')}>{errors?.fullName?.message}</p>
                            </div>

                            <div className={errors.email ? cx('form_group', 'error') : cx('form_group')}>
                                <p className={cx('label')}>Email</p>
                                <input
                                    {...emailController.field}
                                    onBlur={emailController.field.onBlur}
                                    type='text'
                                    placeholder='Nhập email'
                                />
                                <p className={cx('error_message')}>{errors?.email?.message}</p>
                            </div>

                            <div className={errors.phone ? cx('form_group', 'error') : cx('form_group')}>
                                <p className={cx('label')}>Số điện thoại</p>
                                <input
                                    {...phoneController.field}
                                    onBlur={phoneController.field.onBlur}
                                    type='text'
                                    placeholder='Gồm 10 số'
                                />
                                <p className={cx('error_message')}>{errors?.phone?.message}</p>
                            </div>

                            <div className={errors.address ? cx('form_group', 'error') : cx('form_group')}>
                                <p className={cx('label')}>Địa chỉ</p>
                                <input
                                    {...addressController.field}
                                    onBlur={addressController.field.onBlur}
                                    type='text'
                                    placeholder='Nhập địa chỉ'
                                />
                                <p className={cx('error_message')}>{errors?.address?.message}</p>
                            </div>

                            <p className={cx('btn_edit')}>
                                <Button primary >Lưu thay đổi</Button>
                            </p>
                        </div>
                    </form>
                </div>
            </Dialog>
            <div className={cx('top')}>
                <div className={cx('infomation')}>
                    <p className={cx('btnEdit')} onClick={handleClickEdit}>Chỉnh sửa</p>
                    <h3 className={cx('title')}>Thông tin người dùng</h3>
                    <div className={cx('content')}>
                        <img className={cx('avatar')} src='https://res.cloudinary.com/dgntuytuu/image/upload/v1690363555/book-store/gmldbxptgqxbhsxocowd.jpg' alt='Avatar' />
                        <div className={cx('description')}>
                            <h3 className={cx('name')}>Ninh Đức Thọ</h3>
                            <p className={cx('info_other')}>Email: 20110730@student.hcmute.edu.vn</p>
                            <p className={cx('info_other')}>Số điện thoại: 0877404581</p>
                            <p className={cx('info_other')}>Địa chỉ: 28/11 đường số 1 Phước Long B, Tp.Thủ Đức, Thành Phố Hồ Chí Minh</p>
                            <p className={cx('info_other')}>Quốc gia: Việt Nam</p>
                        </div>
                    </div>
                </div>

                <div className={cx('pending')}>
                    <div className={cx('heading')}>
                        <h3 className={cx('title')}>Chi tiêu</h3>
                        <DropMenu
                            options={options}
                            setOptionSelected={setOptionSelected}
                            optionSelected={optionSelected}
                            size={'small'}
                        />
                    </div>
                    <IncomeChart data={dataIncomes} size={3 / 1} />
                </div>
            </div>
            <div className={cx('bottom')}>
                <OrdersLatesTable />
            </div>
        </div>
    )
}

export default UserDetail
