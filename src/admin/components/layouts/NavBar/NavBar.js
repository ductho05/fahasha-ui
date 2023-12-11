import React from "react";
import classNames from "classnames/bind"
import styles from './NavBar.module.scss'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import { useStore } from '../../../../stores/hooks'
import { api } from '../../../../constants'
import { Link } from "react-router-dom";
import { Dialog } from '@mui/material';
import RegisterLogin from '../../../../components/Forms/RegisterLogin';
import { logout } from '../../../../stores/actions';
import Button from "../../../../components/Button";
import axios from "axios";

const cx = classNames.bind(styles)
function NavBar() {

    const [state, dispatch] = useStore()
    const [numNewNotice, setNumNewNotice] = React.useState(0)
    const [notices, setNotices] = React.useState([])
    const [expired, setExpired] = React.useState(false);
    const [indexForm, setIndexForm] = React.useState(0);
    const [isShowForm, setIsShowForm] = React.useState(false);

    const authInstance = state.authInstance

    React.useEffect(() => {
        authInstance.post(`/webpush/get`)
            .then(result => {
                if (result.data.status == "OK") {
                    setNotices(result.data.data)
                }
                //console.log(result)
            })
            .catch(err => console.error(err))
    }, [state])

    setInterval(() => {

        if (state.isLoggedIn) {

            authInstance.get(`/users/get/profile`).then(result => {

                if (result.data.message == "Jwt expired") {
                    setExpired(true)
                }
            }).catch(() => {
                setExpired(true)
            })

        }
    }, 6000);

    const handlePass = () => {
        dispatch(logout({}));
        setExpired(false);
    };

    React.useEffect(() => {
        const num = notices.reduce((acc, item) => {
            return item.isAccess === false ? acc + 1 : acc;
        }, 0)

        setNumNewNotice(num)
    }, [notices])

    return (
        <div className={cx('wrapper')}>
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
                        <Button>Bỏ qua</Button>
                    </p>
                </div>
            </Dialog>
            <div className={cx('search')}>
                <input type="text" placeholder="Tìm kiếm..." spellCheck={false} />
                <p className={cx('search_btn')}>
                    <SearchOutlinedIcon className={cx('search_icon')} />
                </p>
            </div>
            <ul className={cx('features')}>
                <li className={cx('item')}>
                    <DarkModeOutlinedIcon className={cx('icon')} />
                </li>
                <Link to="/admin/notifications" className={cx('item')}>
                    <NotificationsOutlinedIcon className={cx('icon')} />
                    <p className={cx('message_text')}>{numNewNotice}</p>
                </Link>
                <li className={cx('item')}>
                    <MessageOutlinedIcon className={cx('icon')} />
                    <p className={cx('message_text')}>2</p>
                </li>
                <li className={cx('item')}>
                    <img className={cx('account_img')} src={state?.user?.images} />
                </li>
            </ul>
        </div>
    )
}

export default NavBar
