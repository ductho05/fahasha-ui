import Header from './Header';
import Footer from './Footer';
import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import { isExpired, isLogin } from '../../../stores/account';
import { useEffect, useState } from 'react';
import { Dialog } from '@mui/material';
import RegisterLogin from '../../Forms/RegisterLogin';
import localstorage from '../../../stores/localstorge';
import { useStore } from '../../../stores/hooks';
import Button from '../../Button';
import { logout, noAction } from '../../../stores/actions';
import localstorge from '../../../stores/localstorge';
import { api, isDeploy } from '../../../constants';
import { LOGOUT, LOGIN, REGISTER } from '../../../stores/constants';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authInstance } from '../../../utils/axiosConfig';
import axios from 'axios';

const cx = classNames.bind(styles);
function DefaultLayout(props) {
    const navigate = useNavigate();
    const [expired, setExpired] = useState(false);
    const [isShowForm, setIsShowForm] = useState(false);
    const [indexForm, setIndexForm] = useState(0);
    const [state, dispatch] = useStore();
    const [isInteractive, setIsInteractive] = useState(false);

    useEffect(() => {
        props.setIsLogin(localstorage.get().length > 0);
    }, [state]);

    // useEffect(() => {

    //     if (isDeploy) {
    //         var chat_content = document.querySelector(".fb_dialog_content")
    //         if (chat_content) {
    //             chat_content.style.display = 'block';
    //         }
    // }, [])

    setInterval(() => {
        if (isLogin()) {
            axios
                .get(`${api}/users/get/profile`, {
                    headers: {
                        Authorization: `Bearer ${localstorge.get()}`,
                    },
                })
                .then((result) => {
                    if (result.data.message == 'Jwt expired') {
                        setExpired(true);
                    }
                })
                .catch(() => {
                    setExpired(true);
                });
        }
    }, 6000);

    const handlePass = () => {
        dispatch(logout({}));
        setExpired(false);
    };

    useEffect(() => {
        if (state.action == LOGOUT) {
            navigate('/');
            toast.success('Đăng xuất thành công');
            dispatch(noAction());
            setExpired(false);
        } else if (state.action == LOGIN) {
            console.log(state.user)
            if (state.user.isManager) {
                navigate('/admin');
            } else {
                navigate('/');
            }
            toast.success('Đăng nhập thành công');
            dispatch(noAction());
            setExpired(false);
        } else if (state.action == REGISTER) {
            navigate('/account/0');
            toast.success('Đăng ký tài khoản thành công');
            dispatch(noAction());
            setExpired(false);
        }
    }, [state]);

    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
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
                <div className={cx('content')}>
                    <Dialog open={expired && isInteractive === false}>
                        <div className={cx('dialog_end_session_login')}>
                            <h1 className={cx('notice')}>Đã hết phiên đăng nhập. Vui lòng đăng nhập lại</h1>
                            <RegisterLogin
                                setShowForm={setIsShowForm}
                                indexForm={indexForm}
                                setForm={setIndexForm}
                                isAccountPage={true}
                            />
                            <p onClick={handlePass} className={cx('btn_pass')}>
                                <Button>Bỏ qua</Button>
                            </p>
                        </div>
                    </Dialog>
                    {props.children}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
