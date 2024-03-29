import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './EvaluateForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Button from '../../Button';
import { useStore } from '../../../stores/hooks';
import { api, appPath } from '../../../constants';
import { useNavigate } from 'react-router-dom';
import { Backdrop, CircularProgress } from '@mui/material';
import { message } from 'antd';
import { getAuthInstance } from '../../../utils/axiosConfig';

const cx = classNames.bind(styles);
function EvaluateForm({ totalRate, fetch, setShow, product, orderItem }) {
    const authInstance = getAuthInstance();

    const navigate = useNavigate();
    const [rate, setRate] = useState(0);
    const rates = [1, 2, 3, 4, 5];
    const [content, setContent] = useState('');
    const [state, dispatch] = useStore();
    const [showProgress, setShowProgress] = useState(false);

    useEffect(() => {
        const updateRate = (parseInt('0') * totalRate + rate) / (totalRate + 1);

        console.log(updateRate);
    }, []);

    const updateRate = async (productEval) => {
        const updateRate = (parseInt(productEval.rate) * totalRate + rate) / (totalRate + 1);

        await authInstance
            .put(`/products/update/${productEval._id}`, {
                rate: updateRate,
            })
            .then((result) => {})
            .catch((err) => {
                console.error(err);
            });
    };

    const sendNotice = (productEval) => {
        const title = 'Thông báo sản phẩm';
        const description = `${state.user.fullName} vừa đánh giá một sản phẩm. Xem ngay`;
        const image = productEval?.images;
        const url = `${appPath}/product-detail/${productEval?._id}/comments-detail`;

        // authInstance
        //     .post('/webpush/send', {
        //         filter: 'admin',
        //         notification: {
        //             title,
        //             description,
        //             image,
        //             url,
        //         },
        //     })
        //     .then((result) => {
        //         if (result.data.status === 'OK') {
        //             state.socket.emit('send-notification', {
        //                 type: 'admin',
        //                 userId: null,
        //                 notification: {
        //                     title,
        //                     description,
        //                     image,
        //                     url,
        //                     user: null,
        //                 },
        //             });
        //         }
        //     })
        //     .catch((err) => {
        //         console.error(err);
        //     });
    };

    const handleClickRate = (value) => {
        setRate(value);
    };

    const handleChange = (e) => {
        setContent(e.target.value);
    };

    const handleCancle = () => {
        setShow(false);
    };

    const handleSubmit = async () => {
        setShowProgress(true);
        await authInstance
            .post(`/evaluates/insert`, {
                rate: rate,
                comment: content,
                product: product,
                user: state.user._id,
            })
            .then((result) => {
                if (result.data.status == 'OK') {
                    updateRate(result.data.data);
                    sendNotice(result.data.data);
                    if (orderItem) {
                        authInstance
                            .put(`/orderitems/update/${orderItem._id}`, { status: 'DADANHGIA' })
                            .then((result) => {
                                if (result.data.status == 'OK') {
                                    fetch();
                                    setShow(false);
                                    setShowProgress(false);
                                }
                            });
                    } else {
                        setShow(false);
                        setShowProgress(false);
                    }
                    message.success('Đã đánh giá sản phẩm');
                } else {
                    setShow(false);
                    setShowProgress(false);
                    message.error('Lỗi khi đánh giá sản phẩm');
                }
            })
            .catch((err) => {
                console.log(err);
                message.error(`Lỗi ${err.message}`);
            });
    };

    return (
        <div className={cx('wrapper')}>
            <Backdrop sx={{ color: '#fff', zIndex: 10000 }} open={showProgress}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <h3 className={cx('heading')}>Viết đánh giá sản phẩm</h3>
            <div className={cx('rate')}>
                {rates.map((itemRate, index) => (
                    <span
                        onClick={() => handleClickRate(itemRate)}
                        key={index}
                        className={itemRate <= rate ? cx('rate_star', 'star_active') : cx('rate_star')}
                    >
                        <FontAwesomeIcon icon={faStar} />
                    </span>
                ))}
            </div>
            <textarea
                spellCheck={false}
                value={content}
                onChange={(e) => handleChange(e)}
                type="text"
                placeholder="Nhập nhận xét của bạn về sản phẩm"
            />

            <div className={cx('control')}>
                <p onClick={handleCancle} className={cx('btn_cancle')}>
                    Hủy
                </p>
                <p onClick={handleSubmit} className={cx('btn_submit')}>
                    <Button primary disabled={rate <= 0 || content == ''}>
                        Gửi nhận xét
                    </Button>
                </p>
            </div>
        </div>
    );
}

export default EvaluateForm;
