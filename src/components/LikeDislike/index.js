import React, { useState, useEffect } from 'react'

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import classNames from 'classnames/bind';
import styles from './LikeDislike.module.scss';
import { Dialog } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const LikeDislike = ({ user, comment }) => {

    const navigate = useNavigate();
    const [like, setLike] = useState(false)
    const [numLike, setNumLike] = useState(0)
    const [currentComment, setCurrentComments] = useState()
    const [showDialog, setShowDialog] = useState(false)

    useEffect(() => {
        setCurrentComments(comment)
    }, [])

    useEffect(() => {
        const isLike = currentComment?.likes?.find(l => l == user._id)
        setLike(isLike ? true : false)
    }, [currentComment])

    useEffect(() => {
        setNumLike(currentComment?.likes?.length || 0)
    }, [currentComment])

    const handleToLoginPage = () => {
        navigate('/login-register');
    };

    const handleCancelGoToLoginPage = () => {
        setShowDialog(false);
    };

    const hadleToggleLike = () => {
        if (Object.keys(user).length <= 0) {
            setShowDialog(true)
        } else {
            fetch(`http://127.0.0.1:3000/bookstore/api/v1/evaluates/like?commentId=${currentComment._id}&userId=${user._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    commentId: currentComment._id,
                    userId: user._id
                })
            })
                .then(response => response.json())
                .then(result => {
                    setCurrentComments(result.data)
                    setLike(prev => !prev)
                })
                .catch(err => console.error(err));
        }
    }

    return (
        <>
            <Dialog open={showDialog}>
                <div className={cx('dialog_nologin')}>
                    <h3 className={cx('dialog_nologin_message')}>Vui lòng đăng nhập để mua hàng</h3>
                    <div onClick={handleToLoginPage} className={cx('btn_to_login')}>
                        <p>Trang đăng nhập</p>
                        <p>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </p>
                    </div>
                    <p onClick={handleCancelGoToLoginPage} className={cx('btn_cancel_logins')}>
                        Bỏ qua
                    </p>
                </div>
            </Dialog>
            <div className={like ? cx('comments_likes', 'liked') : cx('comments_likes')}>
                <p onClick={hadleToggleLike} className={cx('like_icon')}>
                    <ThumbUpIcon fontSize='medium' />
                </p>
                <p>thích</p>
                <p className={cx('like_total')}>({numLike})</p>
            </div>
        </>
    )
}

export default LikeDislike