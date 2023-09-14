import classNames from 'classnames/bind'
import styles from './Button.module.scss'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
const cx = classNames.bind(styles)

function Delete() {
    return (
        <div className={cx('btn', 'delete')}>
            <DeleteForeverIcon className={cx('icon', 'delete')} />
            <p className={cx('title')}>Xóa</p>
        </div>
    )
}

function View() {

    return (
        <div className={cx('btn', 'edit')}>
            <RemoveRedEyeOutlinedIcon className={cx('icon', 'edit')} />
            <p className={cx('title')}>Xem</p>
        </div>
    )
}

export { Delete, View }
