import { useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import classNames from "classnames/bind"
import styles from './Page404.module.scss'
import images from "../../assets/images"

const cx = classNames.bind(styles)
function Page404() {

    const navigate = useNavigate()

    useEffect(() => {
        document.title = 'Không tìm thấy trang truy cập'
    }, [])

    const handleBackToHome = () => {
        navigate('/')
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <p className={cx('title_message')}>Lỗi! Không tìm thấy trang</p>
                <h3 className={cx('title')}>404</h3>
                <p className={cx('message')}>Chúng tôi không thể tìm thấy trang bạn muốn truy cập.</p>
                <div onClick={handleBackToHome} className={cx('btn')}>
                    <p className={cx('btn_icon')}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </p>
                    <p className={cx('btn_back_to_home')}>Trang chủ</p>
                </div>
            </div>
        </div>
    )
}

export default Page404
