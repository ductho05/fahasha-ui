import classNames from "classnames/bind"
import styles from './NavBar.module.scss'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';

const cx = classNames.bind(styles)
function NavBar() {
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
                    <p className={cx('message_text')}>1</p>
                </li>
                <li className={cx('item')}>
                    <MessageOutlinedIcon className={cx('icon')} />
                    <p className={cx('message_text')}>2</p>
                </li>
                <li className={cx('item')}>
                    <img className={cx('account_img')} src='https://thuthuatnhanh.com/wp-content/uploads/2022/08/hinh-anh-avatar-nam-chibi.jpg' />
                </li>
            </ul>
        </div>
    )
}

export default NavBar
