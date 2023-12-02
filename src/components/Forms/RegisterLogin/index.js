import { useState, useEffect } from 'react';
import { useForm, useController } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

import styles from './RegisterLogin.module.scss';
import Button from '../../Button';
import { useStore } from '../../../stores/hooks';
import { api, appPath, registerImages } from '../../../constants';
import { register, login, noAction } from '../../../stores/actions';
import { LOGIN, REGISTER } from '../../../stores/constants';
import { Dialog, Backdrop, CircularProgress } from '@mui/material';

// Firebase
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../../FirebaseConfig';
import LoginWithFacebook from '../../LoginWithFacebook';

import { WarningOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import ServiceWorkerNotifi from '../../../service/ServiceWorkerNotifi';
import SendNotification from '../../../service/SendNotification'
import { socket } from '../../../service/SocketIo';

const cx = classNames.bind(styles);
function RegisterLogin(props) {
    const navigate = useNavigate();
    const [state, dispatch] = useStore();

    const tabNames = ['Đăng nhập', 'Đăng ký'];
    const indexActive = props.indexForm;
    const [typeInput, setTypeInput] = useState('password');
    const [toggleName, setToggleName] = useState('Hiện');
    const [showDialog, setShowDialog] = useState(false);
    const [showDialogRegister, setShowDialogRegister] = useState(false);
    const [otpServer, setOtpServer] = useState({
        message: '',
        otp: '',
    });
    const [otp, setOtp] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showProgress, setShowProgress] = useState(false);
    const [noti_api, contextHolder] = notification.useNotification();
    const openNotification = (noti) => {
        noti_api.open({
            style: {
                // màu background của cảnh báo
                backgroundColor: '#fff',
            },
            // tự đóng sau 1.5s
            duration: 2.5,
            message: 'Thông báo',
            description: noti,
            icon: (
                <WarningOutlined
                    style={{
                        //màu vàng cảnh báo
                        color: '#faad14',
                    }}
                />
            ),
        });
    };

    useEffect(() => {
        if (localStorage.getItem('denied-permission-notify')) {
            openNotification(localStorage.getItem('denied-permission-notify'));
            localStorage.removeItem('denied-permission-notify');
        }
    }, []);

    const handleTab = (index) => {
        props.setForm(index);
        setValue('email', '');
        setValue('password', '');
        clearErrors('email');
        clearErrors('password');
        clearErrors('confirmPassword');
        setOtpServer({
            message: '',
            otp: '',
        });
        setConfirmPassword((prev) => {
            return '';
        });
        setOtp('');
    };

    const handleForgotPassword = () => {
        props.setForm(2);
    };

    const toggleInput = () => {
        setTypeInput((prev) => {
            return prev === 'password' ? 'text' : 'password';
        });
        setToggleName((prev) => {
            return prev === 'Hiện' ? 'Ẩn' : 'Hiện';
        });
    };

    // Validate Form
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        setError,
        clearErrors,
    } = useForm({
        mode: 'onBlur',
    });

    const emailController = useController({
        name: 'email',
        control,
        rules: {
            required: 'Thông tin này không được để trống',
            pattern: {
                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Email không đúng định dạng. Vui lòng nhập lại',
            },
        },
    });

    const passwordController = useController({
        name: 'password',
        control,
        rules: {
            required: 'Thông tin này không được để trống',
            pattern:
                indexActive === 1
                    ? {
                        value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                        message: 'Vui lòng nhập: trên 8 ký tự. Chứa 0-9, a-z, A-Z và 1 ký tự đặc biệt',
                    }
                    : {},
        },
    });

    useEffect(() => {
        if (confirmPassword != passwordController.field.value) {
            setError('confirmPassword', { type: 'manual', message: 'Mật khẩu không khớp' });
        } else {
            clearErrors('confirmPassword');
        }
    }, [confirmPassword]);

    useEffect(() => {
        if (otp != otpServer.otp) {
            setError('otp', { type: 'manual', message: 'Mã OTP không đúng' });
        } else {
            clearErrors('otp');
        }
    }, [otp]);

    // Login
    const handleLogin = () => {
        const dataLogin = watch();
        setShowProgress(true);
        fetch(`${api}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataLogin),
        })
            .then((response) => response.json())
            .then((result) => {

                if (result.status == 'OK') {
                    setShowProgress(false);
                    props.setShowForm(false);
                    if (result.message == 'Password incorrect') {
                        setShowDialog(true);
                    } else if (result.message == 'Login successfully') {
                        dispatch(login(result))
                        ServiceWorkerNotifi()
                        state.socket.emit('save-socket', (result.data._id))
                    }
                }
            })
            .catch((error) => console.log(error));
    };

    // Handle Send OTP
    const handleSendOTP = (email) => {
        setShowProgress(true);
        fetch(`${api}/users/sendotp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
        })
            .then((response) => response.json())
            .then((result) => {
                setShowProgress(false);
                if (result.status == 'OK') {
                    setOtpServer({
                        message: 'Đã gửi mã OTP đến email của bạn',
                        otp: result.data,
                    });
                } else {
                    setOtpServer({
                        message: 'Gửi mã OTP thất bại. Vui lòng kiểm tra lại địa chỉ email',
                        otp: '',
                    });
                }
            });
    };

    // Register
    const handleRegister = async (data) => {
        setShowProgress(true);
        await fetch(`${api}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status == 'OK') {
                    setShowProgress(false);
                    props.setShowForm(false);
                    dispatch(register(result));

                    const title = "Thông báo tài khoản"
                    const description = "Khách hàng vừa đăng ký tài khoản mới"
                    const image = registerImages
                    const url = `${appPath}/admin/user`

                    SendNotification("admin", {
                        title,
                        description,
                        image,
                        url
                    })
                    ServiceWorkerNotifi()
                    state.socket.emit('save-socket', (result.data._id))
                } else if (result.status == 'Falure' && result.message == 'User is already') {
                    setShowProgress(false);
                    setShowDialogRegister(true);
                } else {
                    console.log(result.message);
                }
            })
            .catch(() => {
                setShowProgress(false);
                setShowDialogRegister(true);
            });
    };

    useEffect(() => {
        if (state.action == REGISTER) {
            navigate(`/account/${0}`);
            dispatch(noAction());
        } else if (state.action == LOGIN) {
            navigate('/');
            dispatch(noAction());
        }
    }, [state]);

    const handleCancel = () => {
        setValue('email', '');
        clearErrors('password');
        clearErrors('confirmPassword');
        props.setForm(0);
    };

    const handleChangePassword = async () => {
        const email = watch('email');
        const password = watch('password');
        setShowProgress(true);
        await fetch(`${api}/users?email=${email}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status == 'OK') {
                    fetch(`${api}/users/update/${result.data._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ password: password }),
                    })
                        .then((response) => response.json())
                        .then((result) => {
                            if (result.status == 'OK') {
                                fetch(`${api}/users/login`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ email: email, password: password }),
                                })
                                    .then((response) => response.json())
                                    .then((result) => {
                                        if (result.status == 'OK') {
                                            setShowProgress(false);
                                            props.setShowForm(false);
                                            dispatch(login(result));
                                        }
                                    })
                                    .catch((error) => console.log(error));
                            }
                        })
                        .catch((err) => console.log(err));
                }
            })
            .catch((err) => console.log(err));
    };

    const handleLoginFacebook = (event) => {
        event.preventDefault();
        signInWithPopup(auth, provider)
            .then((result) => { })
            .catch((err) => { });
    };

    return (
        <div className={cx('wrapper')}>
            {contextHolder}
            <Backdrop sx={{ color: '#fff', zIndex: 10000 }} open={showProgress}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className={cx('dialog-notice')}>
                <Dialog
                    open={showDialog}
                    style={{
                        zIndex: 10000000,
                    }}
                >
                    <div className={cx('dialog')}>
                        <p className={cx('dialog_icon')}>
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                        </p>
                        <p className={cx('dialog_message')}>Mật khẩu hoặc email không đúng</p>
                        <p onClick={() => setShowDialog(false)} className={cx('dialog_btn')}>
                            Đăng nhập lại
                        </p>
                    </div>
                </Dialog>
            </div>
            <div className={cx('dialog-notice')}>
                <Dialog
                    open={showDialogRegister}
                    style={{
                        zIndex: 10000000,
                    }}
                >
                    <div className={cx('dialog')}>
                        <p className={cx('dialog_icon')}>
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                        </p>
                        <p className={cx('dialog_message')}>Tài khoản đã tồn tại, email đã được sử dụng</p>
                        <p onClick={() => setShowDialogRegister(false)} className={cx('dialog_btn')}>
                            Đăng ký lại
                        </p>
                    </div>
                </Dialog>
            </div>
            <div className={props.isAccountPage ? cx('form', 'form-account') : cx('form')}>
                <ul className={indexActive === 2 ? cx('form_headings', 'hide') : cx('form_headings')}>
                    {tabNames.map((tabName, index) => {
                        return (
                            <li
                                onClick={() => handleTab(index)}
                                key={index}
                                className={indexActive === index ? cx('tab_item', 'tab_active') : cx('tab_item')}
                            >
                                {tabName}
                            </li>
                        );
                    })}
                </ul>
                <form
                    onSubmit={handleSubmit(handleLogin)}
                    className={indexActive === 0 ? cx('form_body', 'content_active') : cx('form_body')}
                >
                    <label>Email</label>
                    <div className={errors.email ? cx('form_input', 'form_error') : cx('form_input')}>
                        <input
                            {...emailController.field}
                            onBlur={emailController.field.onBlur}
                            className={cx('input_content')}
                            spellCheck={false}
                            placeholder="Nhập email"
                        />
                    </div>
                    <p className={cx('error_message')}>{errors.email?.message}</p>

                    <label>Mật khẩu</label>
                    <div className={errors.password ? cx('form_input', 'form_error') : cx('form_input')}>
                        <input
                            {...passwordController.field}
                            onBlur={passwordController.field.onBlur}
                            className={cx('input_content')}
                            type={typeInput}
                            placeholder="Nhập mật khẩu"
                        />
                        <p className={cx('input_end')} onClick={toggleInput}>
                            {toggleName}
                        </p>
                    </div>
                    <p className={cx('error_message')}>{errors.password?.message}</p>

                    <p className={cx('forgot_pass')} onClick={handleForgotPassword}>
                        Quên mật khẩu?
                    </p>

                    <div className={cx('form_btn')}>
                        <p onClick={handleLogin}>
                            <Button primary disabled={!(watch('email') && watch('password'))}>
                                Đăng nhập
                            </Button>
                        </p>
                        <p className={props.isAccountPage ? cx('hide') : cx('visible')}>
                            <Button onClick={() => props.setShowForm(false)}>Bỏ qua</Button>
                        </p>
                        {/* <p onClick={handleLoginFacebook}>
                            <Button leftIcon={<FontAwesomeIcon icon={faFacebookF} />} facebook > Đăng nhập bằng facebook</Button>
                        </p> */}
                        <LoginWithFacebook />
                    </div>
                </form>

                <form
                    onSubmit={handleSubmit(handleRegister)}
                    className={indexActive === 1 ? cx('form_body', 'content_active') : cx('form_body')}
                >
                    <label>Email</label>
                    <div className={errors.email ? cx('form_input', 'form_error') : cx('form_input')}>
                        <input
                            {...emailController.field}
                            onBlur={emailController.field.onBlur}
                            className={cx('input_content')}
                            spellCheck={false}
                            placeholder="Nhập email"
                        />
                        <p onClick={() => handleSendOTP(watch('email'))} className={cx('input_end')}>
                            Gửi mã OTP
                        </p>
                    </div>
                    <p className={cx('error_message')}>{errors.email?.message}</p>
                    <p className={cx('form_message')}>{otpServer?.message}</p>

                    <label>Mã xác nhận OTP</label>
                    <div className={otpServer.otp == '' ? cx('form_input', 'disable') : cx('form_input')}>
                        <input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className={cx('input_content')}
                            spellCheck={false}
                            placeholder="6 ký tự"
                        />
                    </div>
                    <p className={cx('error_message')}>{errors.otp?.message}</p>

                    <label>Mật khẩu</label>
                    <div className={otp == '' || errors.otp ? cx('form_input', 'disable') : cx('form_input')}>
                        <input
                            {...passwordController.field}
                            onBlur={passwordController.field.onBlur}
                            className={cx('input_content')}
                            type={typeInput}
                            placeholder="Nhập mật khẩu"
                        />
                        <p className={cx('input_end')} onClick={toggleInput}>
                            {toggleName}
                        </p>
                    </div>
                    <p className={cx('error_message')}>{errors.password?.message}</p>

                    <label>Nhập lại mật khẩu</label>
                    <div className={otp == '' || errors.otp ? cx('form_input', 'disable') : cx('form_input')}>
                        <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={() => {
                                if (confirmPassword == '')
                                    setError('confirmPassword', {
                                        type: 'manual',
                                        message: 'Thông tin này không được để trống',
                                    });
                            }}
                            className={cx('input_content')}
                            type={typeInput}
                            placeholder="Nhập lại mật khẩu"
                        />
                        <p className={cx('input_end')} onClick={toggleInput}>
                            {toggleName}
                        </p>
                    </div>
                    <p className={cx('error_message')}>{errors.confirmPassword?.message}</p>

                    <div className={cx('form_btn')}>
                        <Button primary disabled={!(watch('email') && watch('password') && !errors.confirmPassword)}>
                            Đăng ký
                        </Button>
                        <p className={props.isAccountPage ? cx('hide') : cx('visible')}>
                            <Button onClick={() => props.setShowForm(false)}>Bỏ qua</Button>
                        </p>
                    </div>
                </form>
                <h3 className={indexActive === 2 ? cx('forgot_pass_heading') : cx('forgot_pass_heading', 'hide')}>
                    KHÔI PHỤC MẬT KHẨU
                </h3>
                <form
                    onSubmit={handleSubmit(handleChangePassword)}
                    className={indexActive === 2 ? cx('form_body', 'content_active') : cx('form_body')}
                >
                    <label>Email</label>
                    <div className={errors.email ? cx('form_input', 'form_error') : cx('form_input')}>
                        <input
                            {...emailController.field}
                            onBlur={emailController.field.onBlur}
                            className={cx('input_content')}
                            spellCheck={false}
                            placeholder="Nhập email"
                        />
                        <p onClick={() => handleSendOTP(watch('email'))} className={cx('input_end')}>
                            Gửi mã OTP
                        </p>
                    </div>
                    <p className={cx('error_message')}>{errors.email?.message}</p>
                    <p className={cx('form_message')}>{otpServer?.message}</p>

                    <label>Mã xác nhận OTP</label>
                    <div className={otpServer.otp == '' ? cx('form_input', 'disable') : cx('form_input')}>
                        <input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className={cx('input_content')}
                            spellCheck={false}
                            placeholder="6 ký tự"
                        />
                    </div>
                    <p className={cx('error_message')}>{errors.otp?.message}</p>

                    <label>Mật khẩu</label>
                    <div className={otp == '' || errors.otp ? cx('form_input', 'disable') : cx('form_input')}>
                        <input
                            {...passwordController.field}
                            onBlur={passwordController.field.onBlur}
                            className={cx('input_content')}
                            type={typeInput}
                            placeholder="Nhập mật khẩu"
                        />
                        <p className={cx('input_end')} onClick={toggleInput}>
                            {toggleName}
                        </p>
                    </div>
                    <p className={cx('error_message')}>{errors.password?.message}</p>

                    <label>Nhập lại mật khẩu</label>
                    <div className={otp == '' || errors.otp ? cx('form_input', 'disable') : cx('form_input')}>
                        <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={() => {
                                if (confirmPassword == '')
                                    setError('confirmPassword', {
                                        type: 'manual',
                                        message: 'Thông tin này không được để trống',
                                    });
                            }}
                            className={cx('input_content')}
                            type={typeInput}
                            placeholder="Nhập lại mật khẩu"
                        />
                        <p className={cx('input_end')} onClick={toggleInput}>
                            {toggleName}
                        </p>
                    </div>
                    <p className={cx('error_message')}>{errors.confirmPassword?.message}</p>
                    <div className={cx('form_btn')}>
                        <p onClick={handleChangePassword}>
                            <Button disabled={errors.confirmPassword || watch('password') == ''} primary>
                                Xác nhận
                            </Button>
                        </p>
                        <p className={cx('visible')}>
                            <Button onClick={handleCancel}>Bỏ qua</Button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterLogin;
