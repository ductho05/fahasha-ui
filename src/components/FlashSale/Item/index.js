import styles from './item.module.scss';
import classname from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { Progress, Skeleton } from 'antd';
const numeral = require('numeral');
const cx = classname.bind(styles);
function Item(props) {
    const navigate = useNavigate();
    const { item, index } = props;
    console.log('item', item);
    const restAPI = 'https://backoffice.nodemy.vn';
    function GetCoupon(price, priceSale) {
        var coupon = 100 - Math.floor((price / priceSale) * 100);
        return coupon < 0 ? `+${Math.abs(coupon)}%` : `-${Math.abs(coupon)}%`;
    }

    return (
        <>
            <div
                key={index}
                onMouseEnter={(e) => {
                    e.currentTarget.childNodes[0].style.transform = 'scale(1.1)';
                    e.currentTarget.childNodes[1].childNodes[0].style.color = '#288ad6';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.childNodes[0].style.transform = 'scale(1.0)';
                    e.currentTarget.childNodes[1].childNodes[0].style.color = '#000';
                }}
                onClick={() => navigate(`/product-detail/${item.product?._id}`)}
                className={cx('item-gift')}
            >
                <LazyLoadImage
                    height="200px"
                    style={{
                        backgroundColor: 'red',
                        width: '98%',
                    }}
                    effect="blur"
                    src={item.product?.images}
                />
                <div className={cx('item-content')}>
                    <div className={cx('item-content__title')}>{item.product?.title}</div>
                    <div className={cx('item-content__price')}>
                        <div className={cx('price__new')}>
                            {numeral(item.product?.old_price * (1 - item.current_sale / 100)).format('0,0')}
                            <span>đ</span>
                        </div>
                        <div className={cx('price__old')}>
                            <div className={cx('price')}>{numeral(item.product?.old_price).format('0,0') + 'đ'}</div>
                            <div className={cx('sale')}>{`-${item.current_sale}%`}</div>
                        </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Progress
                            percent={(Math.floor(item.num_sale - item.sold_sale) * 100) / 20}
                            format={(percent) => `${(percent * item.num_sale) / 100}/${item.num_sale}`}
                            status="active"
                            showInfo={false}
                            strokeWidth={25}
                            style={{
                                marginTop: '5%',
                                width: '200px',
                                opacity: '0.8',
                            }}
                            strokeColor={{
                                '0%': 'yellow',
                                '100%': 'red',
                            }}
                            trailColor="#dddddd"
                        />
                        <div
                            style={{
                                position: 'absolute',
                                top: '55%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'black',
                                fontWeight: '100',
                                fontSize: '0.8rem',
                                width: '100%',
                                textAlign: 'center',
                            }}
                        >
                            {`Đã bán ${item.sold_sale}/${item.num_sale}`}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Item;
