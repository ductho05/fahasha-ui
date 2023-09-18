import Header from './Header'
import Footer from './Footer'
import classNames from 'classnames/bind'
import styles from './DefaultLayout.module.scss'
import { isExpired, isLogin } from '../../../stores/account'
import { useEffect, useState } from 'react'
import { Dialog } from "@mui/material"
import RegisterLogin from '../../Forms/RegisterLogin'
import localstorage from '../../../stores/localstorge'
import { useStore } from '../../../stores/hooks'
import Button from '../../Button'
import { logout, noAction } from '../../../stores/actions'
import localstorge from '../../../stores/localstorge'
import { api } from '../../../constants'
import { LOGOUT, LOGIN, REGISTER } from '../../../stores/constants'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(styles)
function DefaultLayout(props) {
    const navigate = useNavigate()
    const [expired, setExpired] = useState(false)
    const [isShowForm, setIsShowForm] = useState(false)
    const [indexForm, setIndexForm] = useState(0)
    const [state, dispatch] = useStore()
    const [isInteractive, setIsInteractive] = useState(false)

    const handleUserInteraction = () => {
        setIsInteractive(true)
    }

    const handleUserInactivity = () => {
        setIsInteractive(false)
    }

    useEffect(() => {

        clearInterval(5000)

        setInterval(() => {
            setIsInteractive(false)
        }, 5000)

        window.addEventListener('mousemove', handleUserInteraction)
        window.addEventListener('scroll', handleUserInteraction)
        window.addEventListener('keydown', handleUserInteraction)

        window.addEventListener('blur', handleUserInactivity)

        return () => {
            window.removeEventListener('mousemove', handleUserInteraction)
            window.removeEventListener('scroll', handleUserInteraction)
            window.removeEventListener('keydown', handleUserInteraction)
            window.removeEventListener('blur', handleUserInactivity)
        }

    }, [])

    useEffect(() => {
        props.setIsLogin(localstorage.get().length > 0)
    }, [state])
    setInterval(() => {
        if (isLogin()) {
            let token = localstorge.get()
            fetch(`${api}/users/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: token })
            })
                .then(response => response.json())
                .then(result => {
                    if (result.message == 'jwt expired') {
                        setExpired(true)
                    } else {
                        setExpired(false)
                    }
                })
                .catch(() => {
                    setExpired(false)
                })
        }
    }, 6000)

    useEffect(() => {
        if (expired && isInteractive === false) {
            dispatch(logout({}))
        }
    }, [expired, isInteractive])

    const handlePass = () => {
        dispatch(logout({}))
        setExpired(false)
    }

    useEffect(() => {
        if (state.action == LOGOUT) {
            navigate('/')
            toast.success('Đăng xuất thành công')
            dispatch(noAction())
            setExpired(false)
        } else if (state.action == LOGIN) {
            navigate('/')
            toast.success('Đăng nhập thành công')
            dispatch(noAction())
            setExpired(false)
        } else if (state.action == REGISTER) {
            navigate('/account/0')
            toast.success('Đăng ký tài khoản thành công')
            dispatch(noAction())
            setExpired(false)
        }
    }, [state])

    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
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
                                <Button >Bỏ qua</Button>
                            </p>
                        </div>
                    </Dialog>
                    {props.children}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default DefaultLayout
