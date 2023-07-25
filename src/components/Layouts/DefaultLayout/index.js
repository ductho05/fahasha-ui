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
import { LOGOUT, LOGIN } from '../../../stores/constants'
import { useNavigate } from 'react-router-dom'

const cx = classNames.bind(styles)
function DefaultLayout(props) {
    const navigate = useNavigate()
    const [expired, setExpired] = useState(false)
    const [isShowForm, setIsShowForm] = useState(false)
    const [indexForm, setIndexForm] = useState(0)
    const [state, dispatch] = useStore()

    useEffect(() => {
        props.setIsLogin(localstorage.get().length > 0)
    }, [state])
    setInterval(() => {
        if (isLogin()) {
            console.log('logedin')
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
                        console.log('expried')
                        setExpired(true)
                    } else {
                        console.log('chưa hết hạn')
                        setExpired(false)
                    }
                })
                .catch(() => {
                    console.log('failed')
                    setExpired(false)
                })
        }
    }, 60000)

    useEffect(() => {
        if (expired) {
            dispatch(logout({}))
        }
    }, [expired])

    const handlePass = () => {
        dispatch(logout({}))
        setExpired(false)
    }

    useEffect(() => {
        if (state.action == LOGOUT) {
            navigate('/')
            dispatch(noAction())
        } else if (state.action == LOGIN) {
            navigate('/')
            dispatch(noAction())
        }
    }, [state])

    return (
        <div>
            <Header />
            <div className={cx('container')}>
                <div className={cx('content')}>
                    <Dialog open={expired}>
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
