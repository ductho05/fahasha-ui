import React from "react";
import classNames from "classnames/bind"
import styles from './NavBar.module.scss'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import { useStore } from '../../../../stores/hooks'
import { api } from '../../../../constants'

const cx = classNames.bind(styles)
function NavBar() {

    const [state, dispatch] = useStore()
    const [numNewNotice, setNumNewNotice] = React.useState(0)
    const [notices, setNotices] = React.useState([])

    React.useEffect(() => {
        fetch(`${api}/webpush/get`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: state.user._id })
        })
            .then(response => response.json())
            .then(result => {
                if (result.status == "OK") {
                    setNotices(result.data)
                }
                //console.log(result)
            })
            .catch(err => console.error(err))
    }, [state])

    React.useEffect(() => {
        const num = notices.reduce((acc, item) => {
            return item.isAccess === false ? acc + 1 : acc;
        }, 0)

        setNumNewNotice(num)
    }, [notices])

    return (
        <div className={cx('wrapper')}>
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
                <li className={cx('item')}>
                    <NotificationsOutlinedIcon className={cx('icon')} />
                    <p className={cx('message_text')}>{numNewNotice}</p>
                </li>
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
