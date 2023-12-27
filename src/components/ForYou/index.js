import styles from './foryou.module.scss';
import classname from 'classnames/bind';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Carousel, Image, Progress } from 'antd';
import 'animate.css';
import { Skeleton } from 'antd';
import { api } from '../../constants';
const numeral = require('numeral');
const cx = classname.bind(styles);
function ForYou({ limit }) {
    var category = JSON.parse(localStorage.getItem('mycategory')) || [];
    var [foryous, setforyous] = useState([]);
    const navigate = useNavigate();
    const newArr = [];
    useEffect(() => {
        category.forEach((item) => {
            axios
                .post(`${api}/products/category?category=${item}&limit=${limit}`)
                .then((res) => {
                    newArr.push(...res.data.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        });
        setforyous(newArr);
    }, []);
    function GetCoupon(price, priceSale) {
        var coupon = 100 - Math.floor((price / priceSale) * 100);
        return coupon < 0 ? `+${Math.abs(coupon)}%` : `-${Math.abs(coupon)}%`;
    }

    function Itemforyou(props) {
        const { item, index } = props;
        return item.length === 0 ? (
            <div className={cx('item-foryou')}>
                <Skeleton.Image style={{ width: '100' }} active={true} />
                <Skeleton style={{ width: '100%', margin: '20% 0 0 0' }} size="2rem" active={true} />
            </div>
        ) : (
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
                onClick={() => navigate(`/product-detail/${item._id}`)}
                className={cx('item-foryou')}
            >
                {/* <LazyLoadImage
                height="200px"
                style={{
                  backgroundColor: "red",
                  width: "98%",
                }}
                effect="blur"
                src={restAPI + item.image?.item[0].attributes.url}
              /> */}
                <img
                    style={{
                        width: '200px',
                        height: '200px',
                        objectFit: 'contain',
                    }}
                    src={item.images}
                />

                <div className={cx('item-content')}>
                    <div className={cx('item-content__title')}>{item.title}</div>
                    <div className={cx('item-content__price')}>
                        <div className={cx('price__new')}>
                            {numeral(item.price).format('0,0')}
                            <span>đ</span>
                        </div>
                        <div className={cx('price__old')}>
                            <div
                                style={{
                                    fontSize: '1.2rem',
                                    fontWeight: '400',
                                }}
                                className={cx('price')}
                            >
                                {numeral(item.old_price).format('0,0') + 'đ'}
                            </div>
                            <div
                                style={{
                                    fontSize: '1.2rem',
                                    fontWeight: '400',
                                }}
                                className={cx('sale')}
                            >
                                {GetCoupon(item.price, item.old_price)}
                            </div>
                        </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Progress
                            percent={Math.floor((item.sold / item.quantity) * 100)}
                            status="active"
                            showInfo={false}
                            strokeWidth={25}
                            style={{
                                marginTop: '5%',
                                width: '200px',
                                opacity: '0.8',
                            }}
                            strokeColor={{
                                '0%': '#f6d365',
                                '100%': '#fda085',
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
                                fontWeight: '400',
                                fontSize: '1.2rem',
                                width: '100%',
                                textAlign: 'center',
                            }}
                        >
                            {`Đã bán ${item.sold}/${item.quantity}`}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function getRandomElementsFromArray(arr, numElements) {
        if (numElements >= arr.length) {
            return arr; // Trả về mảng gốc nếu bạn muốn lấy tất cả các phần tử hoặc nhiều hơn.
        }

        const shuffled = arr.slice(); // Sao chép mảng gốc để không thay đổi nó.
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Đảo vị trí ngẫu nhiên các phần tử.
        }

        return shuffled.slice(0, numElements);
    }

    function GetListforyou() {
        //const { foryous } = props;

        var listforyou = [];
        var listforyouTemp = [];
        getRandomElementsFromArray(foryous, 10).map((item, index) => {
            if (index % 5 === 0 && index !== 0) {
                listforyou.push(listforyouTemp);
                listforyouTemp = [];
            }
            listforyouTemp.push(item);
        });
        listforyou.push(listforyouTemp);
        return listforyou;
    }

    return (
        <>
            <div className={cx('foryou-current')}>
                {/* <div className={cx('foryou-current__title')}>
                    <h2 className={cx('foryou-current__text_1')}>GỢI Ý HÔM NAY</h2>
                    <h2 className={cx('foryou-current__text_2')}>DÀNH CHO BẠN</h2>
                </div> */}
                <div className={cx('foryou-current__content')}>
                    {GetListforyou().map((item, index) => {
                        return (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
                                {item.map((item, index) => {
                                    return <Itemforyou key={index} item={item} />;
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
export default ForYou;
