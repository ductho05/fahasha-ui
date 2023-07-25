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
            <div className={cx('left')}>
                <img src={images.page404} alt='404' />
            </div>
            <div className={cx('right')}>
                <h3 className={cx('title')}>404</h3>
                <h3 className={cx('message')}>Không tìm thấy trang bạn muốn truy cập</h3>
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
