import { useState } from "react"
import classNames from "classnames/bind"
import styles from './EvaluateForm.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import Button from "../../Button"
import { useStore } from "../../../stores/hooks"
import { api, appPath } from "../../../constants"
import { useNavigate } from 'react-router-dom'
import { Backdrop, CircularProgress } from "@mui/material"
import SendNotification from "../../../service/SendNotification"
import { message } from 'antd';

const cx = classNames.bind(styles)
function EvaluateForm({ setShow, product, orderItem }) {

    const navigate = useNavigate()
    const [rate, setRate] = useState(0)
    const rates = [1, 2, 3, 4, 5]
    const [content, setContent] = useState('')
    const [state, dispatch] = useStore()
    const [showProgress, setShowProgress] = useState(false)

    const handleClickRate = (value) => {
        setRate(value)
    }

    const handleChange = (e) => {
        setContent(e.target.value)
    }

    const handleCancle = () => {
        setShow(false)
    }

    const handleSubmit = () => {
        setShowProgress(true)
        fetch(`${api}/evaluates/insert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rate: rate,
                comment: content,
                product: product,
                user: state.user._id
            })

        })
            .then(response => response.json())
            .then(result => {
                if (result.status == 'OK') {
                    if (orderItem) {
                        fetch(`${api}/orderitems/update/${orderItem._id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: 'DADANHGIA' })
                        })
                            .then(response => response.json())
                            .then(result => {
                                if (result.status == 'OK') {
                                    setShow(false)
                                    setShowProgress(false)

                                }
                            })
                    } else {
                        setShow(false)
                        setShowProgress(false)

                    }
                    message.success("Đã đánh giá sản phẩm")

                    const title = "Thông báo sản phẩm"
                    const description = `${state.user.fullName} vừa đánh giá một sản phẩm. Xem ngay`
                    const image = result.data.product.images
                    const url = `${appPath}/product-detail/${result.data.product._id}/comments-detail`

                    SendNotification("admin", {
                        title,
                        description,
                        image,
                        url
                    })
                } else {
                    setShow(false)
                    setShowProgress(false)
                    message.error("Lỗi khi đánh giá sản phẩm")
                }
            })
            .catch(err => {
                message.error("Lỗi khi đánh giá sản phẩm")
            })
    }

    return (
        <div className={cx('wrapper')}>
            <Backdrop
                sx={{ color: '#fff', zIndex: 10000 }}
                open={showProgress}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <h3 className={cx('heading')}>Viết đánh giá sản phẩm</h3>
            <div className={cx('rate')}>
                {
                    rates.map((itemRate, index) => (
                        <span onClick={() => handleClickRate(itemRate)} key={index} className={itemRate <= rate ? cx('rate_star', 'star_active') : cx('rate_star')}>
                            <FontAwesomeIcon icon={faStar} />
                        </span>
                    ))
                }
            </div>
            <textarea
                spellCheck={false}
                value={content}
                onChange={(e) => handleChange(e)}
                type='text'
                placeholder='Nhập nhận xét của bạn về sản phẩm'
            />

            <div className={cx('control')}>
                <p onClick={handleCancle} className={cx('btn_cancle')}>Hủy</p>
                <p onClick={handleSubmit} className={cx('btn_submit')}>
                    <Button primary disabled={rate <= 0 || content == ''}>Gửi nhận xét</Button>
                </p>
            </div>
        </div>
    )
}

export default EvaluateForm
