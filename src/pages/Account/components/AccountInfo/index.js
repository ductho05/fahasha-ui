import { useState, useEffect, useReducer } from 'react';
import bcrypt from 'bcryptjs';
import { Dialog } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

import classnames from 'classnames/bind';
import styles from './AccountInfo.module.scss';
import Button from '../../../../components/Button';
import { api } from '../../../../constants';
import { useStore } from '../../../../stores/hooks';
import localstorge from '../../../../stores/localstorge';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DatePicker, Modal, Skeleton } from 'antd';
import { getAuthInstance } from '../../../../utils/axiosConfig';
import { logout, update } from '../../../../stores/actions';
import dayjs from 'dayjs';

const cx = classnames.bind(styles);

function AccountInfo() {
    const authInstance = getAuthInstance();

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user, setUser] = useState({});
    const [toggleName, setToggleName] = useState(false);
    const [state, dispatch] = useStore();
    const [avatar, setAvatar] = useState();
    const [email, setEmail] = useState('');
    const [isShowDiallog, setIsShowDiallog] = useState(false);
    const [otp, setOtp] = useState(null);
    const [inputOTP, setInputOtp] = useState();
    const [showError, setShowError] = useState(false);
    const [showProgressUpdate, setShowProgressUpdate] = useState(false);
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [birthError, setBirthError] = useState(null);

    useEffect(() => {
        setIsChanged(user !== state.user || avatar);
    }, [user, avatar]);

    const handleChangeFullName = (e) => {
        setUser((prev) => {
            return {
                ...prev,
                fullName: e.target.value,
            };
        });
    };

    const handleChangePhone = (e) => {
        setUser((prev) => {
            return {
                ...prev,
                phoneNumber: e.target.value,
            };
        });
    };

    const handleChangeGender = (gender) => {
        setUser((prev) => {
            return {
                ...prev,
                gender: gender,
            };
        });
    };

    // const handleChangeBirth = (value, date) => {
    //     const currentDate = new Date();
    //     const datePublish = new Date(date);

    //     if (currentDate < datePublish) {
    //         setBirthError('Vui lòng không chọn ngày sinh trong tương lai');
    //     } else {
    //         setBirthError(null);
    //         setUser((prev) => {
    //             return {
    //                 ...prev,
    //                 birth: date,
    //             };
    //         });
    //     }
    // };

    const handleChangeBirth = (e) => {
        setUser((prev) => {
            return {
                ...prev,
                birth: e.target.value,
            };
        });
    };

    const handleChangeAddress = (e) => {
        setUser((prev) => {
            return {
                ...prev,
                address: e.target.value,
            };
        });
    };

    const handleChangeCurrentPassword = (e) => {
        let value = e.target.value;
        if (value != '') {
            setCurrentPassword(value);
        } else {
            setCurrentPassword('');
        }
    };

    useEffect(() => {
        setLoading(true);
        setUser(state.user);
        setLoading(false);
    }, [state]);

    const handleIncorectPass = () => {
        setShowError(false);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirm = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleToggle = () => {
        setToggleName(!toggleName);
    };

    useEffect(() => {
        return () => {
            avatar && URL.revokeObjectURL(avatar.preview);
        };
    }, [avatar]);

    const handleChooseImage = (e) => {
        const file = e.target.files[0];
        file.preview = URL.createObjectURL(file);

        setAvatar(file);
    };

    useEffect(() => {
        const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        if (!password.match(pattern) && password != '') {
            setErrors((prev) => {
                return {
                    ...prev,
                    password: {
                        message: 'Vui lòng nhập: trên 8 ký tự. Chứa 0-9, a-z, A-Z và 1 ký tự đặc biệt',
                    },
                };
            });
        } else {
            setErrors((prev) => {
                delete prev.password;
                return {
                    ...prev,
                };
            });
        }
    }, [password]);

    useEffect(() => {
        if (password !== confirmPassword) {
            setErrors((prev) => {
                return {
                    ...prev,
                    confirmPassword: {
                        message: 'Mật khẩu không khớp',
                    },
                };
            });
        } else {
            setErrors((prev) => {
                delete prev.confirmPassword;
                return {
                    ...prev,
                };
            });
        }
    }, [confirmPassword]);

    const handleUpdateUser = async () => {
        if (currentPassword !== '') {
            bcrypt.compare(currentPassword, user.password, (err, result) => {
                if (result == false) {
                    setErrors((prev) => {
                        return {
                            ...prev,
                            incorrectPassword: {
                                message: 'Mật khẩu sai',
                            },
                        };
                    });
                } else {
                    setErrors((prev) => {
                        delete prev.incorrectPassword;
                        return {
                            ...prev,
                        };
                    });
                }
            });
        }

        if (errors.incorrectPassword) {
            setShowError(true);
        } else {
            const formData = new FormData();
            if (password != '') {
                formData.append('password', password);
            }
            if (avatar) {
                formData.append('images', avatar);
            }
            if (user.fullName != '') {
                formData.append('fullName', user.fullName);
            }
            if (user.gender != '') {
                formData.append('gender', user.gender);
            }
            if (user.birth != '') {
                formData.append('birth', user.birth);
            }
            if (user.address != '') {
                formData.append('address', user.address);
            }

            setShowProgressUpdate(true);
            await authInstance
                .put(`/users/update/${user._id}`, formData)
                .then((result) => {
                    if (result.data.status == 'OK') {
                        dispatch(update(result.data));
                        toast.success('Lưu thông tin tài khoản thành công');
                    } else {
                        toast.error('Thất bại! Vui lòng liên hệ Admin');
                    }
                    setChecked(false);
                    setShowProgressUpdate(false);
                })
                .catch((err) => {
                    console.log(err);
                    setShowProgressUpdate(false);
                    toast.error(err.response.data.message);
                    console.log(err);
                });
        }
    };

    const handleChangeEmail = () => {
        setIsShowDiallog(true);
    };

    const handleCancelChange = () => {
        setIsShowDiallog(false);
    };

    const handleSetEmail = (e) => {
        setEmail(e.target.value);
    };

    useEffect(() => {
        const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (email != '' && !email.match(pattern)) {
            setErrors((prev) => {
                return {
                    ...prev,
                    email: {
                        message: 'Email không đúng định dạng',
                    },
                };
            });
        } else {
            setErrors((prev) => {
                delete prev.email;
                return {
                    ...prev,
                };
            });
        }
    }, [email]);

    const handleSendEmail = () => {
        setShowProgressUpdate(true);
        fetch(`${api}/users/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email }),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status == 'OK') {
                    setShowProgressUpdate(false);
                    setOtp(result.data);
                }
            })
            .catch((err) => {
                setShowProgressUpdate(false);
            });
    };

    const handleSetValueOTP = (e) => {
        setInputOtp(e.target.value);
    };

    useEffect(() => {
        if (otp) {
            if (inputOTP != otp) {
                setErrors((prev) => {
                    return {
                        ...prev,
                        otp: {
                            message: 'Mã OTP không đúng',
                        },
                    };
                });
            } else {
                setErrors((prev) => {
                    delete prev.otp;
                    return {
                        ...prev,
                    };
                });
            }
        }
    }, [inputOTP]);

    const handleUpdateEmail = () => {
        setShowProgressUpdate(true);
        authInstance
            .put('/users/email', { email })
            .then((result) => {
                setShowProgressUpdate(false);
                setIsShowDiallog(false);
                if (result.data.status == 'OK') {
                    Modal.success({
                        title: 'Thay đổi email thành công!',
                        content: 'Vui lòng đăng nhập lại tài khoản',
                        onOk: () => {
                            dispatch(logout());
                        },
                    });
                }
            })
            .catch((err) => {
                setShowProgressUpdate(false);
                setErrors((prev) => {
                    return {
                        ...prev,
                        email: {
                            message: err.response.data.message,
                        },
                    };
                });
            });
    };

    useEffect(() => {
        setCurrentPassword('');
        setPassword('');
        setConfirmPassword('');
    }, [checked]);

    const url = window.location.pathname;

    return (
        <div className={cx(`wrapper`)}>
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

            <Dialog open={showError}>
                <div className={cx('dialog')}>
                    <p className={cx('dialog_icon')}>
                        <FontAwesomeIcon icon={faTriangleExclamation} />
                    </p>
                    <p className={cx('dialog_message')}>Mật khẩu hiện tại không đúng</p>
                    <p onClick={handleIncorectPass} className={cx('btn_eenter')}>
                        Nhập lại
                    </p>
                </div>
            </Dialog>

            <Backdrop sx={{ color: '#fff', zIndex: 10000 }} open={showProgressUpdate}>
                <CircularProgress color="error" />
            </Backdrop>

            <Dialog open={isShowDiallog}>
                <div className={cx('dialog')}>
                    <h3 className={cx('heading')}>Thay đổi email</h3>
                    <div className={cx('form_change')}>
                        <div className={cx('form_group', 'change')}>
                            <label className={cx('label')}>Email</label>
                            <div className={cx('form_input')}>
                                <input
                                    value={email}
                                    type="text"
                                    placeholder="Nhập email"
                                    spellCheck={false}
                                    onChange={(e) => handleSetEmail(e)}
                                />
                                <p onClick={handleSendEmail} className={cx('btn')}>
                                    Gửi mã OTP
                                </p>
                            </div>
                            {otp && <p className={cx('form_message')}>Đã gửi mã các thực OTP đến email của bạn</p>}
                            <p className={cx('form_error')}>{errors?.email?.message}</p>
                        </div>

                        <div className={cx('form_group', 'change')}>
                            <label className={cx('label')}>Mã xác nhận OTP</label>
                            <div className={otp ? cx('form_input') : cx('form_input', 'disable')}>
                                <input
                                    value={inputOTP}
                                    type="text"
                                    placeholder="6 kí tự"
                                    spellCheck={false}
                                    onChange={(e) => handleSetValueOTP(e)}
                                />
                            </div>
                            <p className={cx('form_error')}>{errors?.otp?.message}</p>
                        </div>

                        <p onClick={handleUpdateEmail} className={cx('btn_dialog')}>
                            <Button primary disabled={errors.otp || !otp || !inputOTP}>
                                Xác nhận
                            </Button>
                        </p>

                        <p onClick={handleCancelChange} className={cx('btn_dialog')}>
                            <Button>Trở về</Button>
                        </p>
                    </div>
                </div>
            </Dialog>
            {loading ? (
                <>
                    <div className={cx('heading')}>
                        <Skeleton.Input active size={20} />
                        <div className={cx('avatar')}>
                            <Skeleton.Avatar active size={100} shape />
                        </div>
                    </div>
                    <div className={cx('form')}>
                        <Skeleton
                            active
                            paragraph={{
                                rows: 8,
                            }}
                        />
                    </div>
                </>
            ) : (
                <>
                    <div className={cx('heading')}>
                        <h3>Thông tin tài khoản</h3>
                        <div className={cx('avatar')}>
                            <img src={avatar ? avatar.preview : user.images} />
                            <p className={cx('edit_avatar')}>
                                <label for="image">Sửa</label>
                                <input type="file" id="image" name="image" onChange={(e) => handleChooseImage(e)} />
                            </p>
                        </div>
                    </div>
                    <div className={cx('form')}>
                        <div className={cx('form_group')}>
                            <label className={cx('label')}>Họ tên*</label>
                            <div className={cx('form_input')}>
                                <input
                                    value={user.fullName}
                                    type="text"
                                    placeholder="Nhập họ tên"
                                    spellCheck={false}
                                    onChange={(e) => handleChangeFullName(e)}
                                />
                            </div>
                        </div>

                        <div className={cx('form_group')}>
                            <label className={cx('label')}>Số điện thoại</label>
                            <div className={cx('form_input')}>
                                <input
                                    value={user.phoneNumber}
                                    type="text"
                                    placeholder="Chưa có số điện thoại"
                                    spellCheck={false}
                                    onChange={(e) => handleChangePhone(e)}
                                />
                            </div>
                        </div>

                        <div className={cx('form_group')}>
                            <label className={cx('label')}>Email*</label>
                            <div className={cx('form_input')}>
                                <input
                                    value={user.email}
                                    type="text"
                                    placeholder="Chưa có email"
                                    spellCheck={false}
                                    disabled
                                />
                                <p onClick={handleChangeEmail} className={cx('btn')}>
                                    {user.email != '' ? 'Thay đổi' : 'Thêm mới'}
                                </p>
                            </div>
                        </div>

                        <div className={cx('form_group')}>
                            <label className={cx('label')}>Giới tính*</label>
                            <div className={cx('form_radio')}>
                                <div className={cx('radio')}>
                                    <input
                                        id="radio"
                                        type="radio"
                                        checked={user.gender == 'male'}
                                        onChange={() => handleChangeGender('male')}
                                    />
                                    <label for="radio">Nam</label>
                                </div>

                                <div className={cx('radio')}>
                                    <input
                                        id="radio_female"
                                        type="radio"
                                        checked={user.gender == 'female'}
                                        onChange={() => handleChangeGender('female')}
                                    />
                                    <label for="radio_female">Nữ</label>
                                </div>
                            </div>
                        </div>

                        <div className={cx('form_group')}>
                            <label className={cx('label')}>Ngày sinh*</label>{' '}
                            {
                                <div className={cx('form_input')}>
                                    <input
                                        value={user.birth}
                                        type="text"
                                        placeholder="Nhập ngày sinh theo định dạng yyyy-mm-dd"
                                        onChange={(e) => handleChangeBirth(e)}
                                        spellCheck={false}
                                    />
                                    {/* <DatePicker onChange={handleChangeBirth} value={user.birth ? dayjs(user.birth) : ""} /> */}
                                    {/* {birthError && <p className="mt-[10px] text-[13px] text-red-500">{birthError}</p>} */}
                                </div>
                            }
                        </div>

                        <div className={cx('form_group')}>
                            <label className={cx('label')}>Địa chỉ*</label>
                            <div className={cx('form_input')}>
                                <input
                                    value={user.address}
                                    type="text"
                                    placeholder="Nhập địa chỉ"
                                    spellCheck={false}
                                    onChange={(e) => handleChangeAddress(e)}
                                />
                            </div>
                        </div>

                        <div className={cx('form_checkbox')}>
                            <input id="change" type="checkbox" value={checked} onChange={() => setChecked(!checked)} />
                            <label className={cx('label_checkbox')} for="change">
                                Đổi mật khẩu
                            </label>
                            <div className={cx('change_password')}>
                                <div className={cx('form_group')}>
                                    <label className={cx('label')}>Mật khẩu hiện tại*</label>
                                    <div className={cx('form_input')}>
                                        <input
                                            value={currentPassword}
                                            type="text"
                                            placeholder="Mật khẩu hiện tại"
                                            spellCheck={false}
                                            onChange={(e) => handleChangeCurrentPassword(e)}
                                        />
                                    </div>
                                </div>

                                <div className={cx('form_group')}>
                                    <label className={cx('label')}>Mật khẩu mới*</label>
                                    <div className={cx('form_input')}>
                                        <input
                                            value={password}
                                            type={toggleName ? 'text' : 'password'}
                                            placeholder="Mật khẩu mới"
                                            spellCheck={false}
                                            onChange={(e) => handlePassword(e)}
                                        />
                                        <p onClick={handleToggle} className={cx('btn')}>
                                            {toggleName ? 'Ẩn' : 'Hiện'}
                                        </p>
                                    </div>
                                </div>
                                <p className={cx('form_error')}>{errors?.password?.message}</p>

                                <div className={cx('form_group')}>
                                    <label className={cx('label')}>Nhập lại mật khẩu mới*</label>
                                    <div className={cx('form_input')}>
                                        <input
                                            value={confirmPassword}
                                            type={toggleName ? 'text' : 'password'}
                                            placeholder="Nhập lại mật khẩu mới"
                                            spellCheck={false}
                                            onChange={(e) => handleConfirm(e)}
                                        />
                                        <p onClick={handleToggle} className={cx('btn')}>
                                            {toggleName ? 'Ẩn' : 'Hiện'}
                                        </p>
                                    </div>
                                </div>
                                <p className={cx('form_error')}>{errors?.confirmPassword?.message}</p>
                            </div>
                        </div>

                        <p className={cx('btn_edit')}>
                            <p onClick={handleUpdateUser} className={!isChanged && cx('disable')}>
                                <Button primary disabled={!isChanged}>
                                    Lưu thay đổi
                                </Button>
                            </p>
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}

export default AccountInfo;
