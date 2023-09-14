import { useState } from "react";
import classNames from "classnames/bind"
import styles from './Widget.module.scss'
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import VignetteOutlinedIcon from '@mui/icons-material/VignetteOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';

const cx = classNames.bind(styles)
function Widget({ widget }) {
    let TitleIcon = ''
    switch (widget.type) {
        case 'users':
            TitleIcon = PersonOutlineOutlinedIcon
            break;
        case 'orders':
            TitleIcon = VignetteOutlinedIcon
            break;
        case 'earnings':
            TitleIcon = MonetizationOnOutlinedIcon
            break;
        case 'reviews':
            TitleIcon = RateReviewOutlinedIcon
            break;
        default:
            throw new Error(`Unknown type ${widget.type}`)
    }

    const formatPrice = (price) => {
        return price >= 1000000 ? `${(price / 1000000).toFixed(2)}M VNĐ` : `${(price / 1000).toFixed(2)}K VNĐ`
    }

    return (
        <div className={cx('widget')}>
            <div className={cx('right')}>
                <h3 className={cx('title')}>{widget.title}</h3>
                <p className={cx('value')}>{widget.type == 'earnings' ? formatPrice(widget.value) : widget.value}</p>
                <p className={cx('see_all')}>Xem tất cả</p>
            </div>
            <div className={cx('left')}>
                <div className={widget.percent >= 0 ? cx('result') : cx('result', 'reduce')}>
                    {widget.percent >= 0 ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />}
                    <p className={cx('result_percent')}>{widget.percent * 100}%</p>
                </div>
                <div className={cx('title_icon', `${widget.type}`)}>
                    <TitleIcon />
                </div>
            </div>
        </div>
    )
}

export default Widget
