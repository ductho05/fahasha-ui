import styles from './flashsale.module.scss';
import classname from 'classnames/bind';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { api } from '../../constants';
import 'animate.css';
import Item from './Item';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import { Carousel, Progress, Skeleton } from 'antd';
import { LeftSquareFilled, RightSquareFilled } from '@ant-design/icons';
import CountDownCustom from '../../components/CountDownCustom';
import lottie from 'lottie-web';
const cx = classname.bind(styles);

function GetListGift(gifts) {
    var listGift = [];
    var listGiftTemp = [];
    gifts.map((item, index) => {
        if (index % 5 === 0 && index !== 0) {
            listGift.push(listGiftTemp);
            listGiftTemp = [];
        }
        listGiftTemp.push(item);
    });
    listGift.push(listGiftTemp);
    return listGift;
}

function FlashSale() {
    var [gifts, setGifts] = useState([]);
    const navigate = useNavigate();
    const container = useRef(null);
    const numFlash = 25;
    const [isLoading, setIsLoading] = useState(false);
    const [isShow, setIsShow] = useState(false); // show khi chờ 10s không có data
    // hàm load lại cục flashsale
    const reloadFlashSale = () => {
        setIsLoading(!isLoading);
    };

    useEffect(() => {
        lottie.loadAnimation({
            container: container.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('../../assets/json/sale_tag.json'),
        });
    }, []);

    useEffect(() => {
        axios
            .get(`${api}/flashsales?sort=reverse&filter=expired&num=${numFlash}`)
            .then((res) => {
                setInterval(() => {
                    res.data.data.length === 0 && setIsShow(true);
                }, 15000);
                setGifts(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [isLoading]);

    const settings = {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        dots: false,
        speed: 1000,
        autoplaySpeed: 6000,
    };
    const carouselRef = useRef();

    const handleNextSlide = () => {
        carouselRef.current.next();
    };

    const handlePrevSlide = () => {
        carouselRef.current.prev();
    };

    // sau 10 giây nếu không có sản phẩm nào thì hiện thông báo
    // useEffect(() => {
    //     setInterval((togle) => {
    //         console.log('togle', togle);
    //         togle == false && setIsShow(true);
    //     }, 15000);
    // }, []);

    return (
        <>
            <div className={cx('gift-current')}>
                <div className={cx('gift-current__title')}>
                    <h2
                        className={cx('gift-current__text')}
                        style={{
                            flex: '2',
                        }}
                    >
                        <OfflineBoltIcon fontSize="large" />
                        <span className={cx('text-3d')}> FLASH </span>
                        <OfflineBoltIcon
                            fontSize="large"
                            style={{
                                zIndex: '1000',
                                marginRight: '0.5rem',
                            }}
                        />
                        <div className={cx('gift-current__tag')} ref={container}></div>
                    </h2>

                    <span
                        style={{
                            height: '100%',
                            width: '1.5px',
                            backgroundColor: '#ffe818',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            margin: '0 2rem 0 2rem',
                            // flex: '1',
                        }}
                    ></span>

                    <div
                        className={cx('gift-current__time')}
                        style={{
                            flex: '3',
                        }}
                    >
                        {!isShow ? (
                            <CountDownCustom
                                title={'Kết thúc sau'}
                                reload={reloadFlashSale}
                                isLoading={isLoading}
                                props={{
                                    fontSize: '3rem',
                                    color: '#ffe818',
                                    justifyContent: 'left',
                                    margin: '0 1rem 0 0',
                                }}
                            />
                        ) : (
                            <CountDownCustom
                                title={'Chờ cập nhật'}
                                reload={reloadFlashSale}
                                isLoading={isLoading}
                                props={{
                                    fontSize: '3rem',
                                    color: '#ffe818',
                                    justifyContent: 'left',
                                    margin: '0 1rem 0 0',
                                }}
                            />
                        )}
                    </div>

                    <div
                        className={cx('gift-current__progress')}
                        style={{
                            flex: '3',
                        }}
                    >
                        {/* <Progress
                            strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }}
                            percent={100}
                            status="active"
                            style={{ width: '80%' }}
                        /> */}
                    </div>
                    <div
                        className={cx('gift-current__extra-info')}
                        style={{
                            flex: '2',
                        }}
                        onClick={() => {
                            navigate('/flashsale');
                        }}
                    >
                        Xem thêm
                    </div>
                </div>
                <span
                    style={{
                        height: '1.5px',
                        width: '100%',
                        backgroundColor: '#ffe818',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        margin: '2rem 0 0 0',
                    }}
                ></span>
                <div className={cx('gift-current__content')}>
                    {' '}
                    {gifts.length !== 0 ? (
                        <>
                            {
                                <button
                                    className="custom-prev-button"
                                    onClick={handlePrevSlide}
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '-0.2%',
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: '1000',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        color: 'white',

                                        fontWeight: 'bold',
                                    }}
                                >
                                    <LeftSquareFilled style={{ fontSize: '30px', color: '#fff' }} />
                                </button>
                            }
                            {
                                <button
                                    className="custom-next-button"
                                    onClick={handleNextSlide}
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: '-0.2%',
                                        transform: 'translate(50%, -50%)',
                                        zIndex: '1000',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        color: 'white',

                                        fontWeight: 'bold',
                                    }}
                                >
                                    <RightSquareFilled style={{ fontSize: '30px', color: '#fff' }} />
                                </button>
                            }
                        </>
                    ) : null}
                    {gifts.length === 0 ? (
                        !isShow ? (
                            <div className={cx('content')}>
                                {[1, 2, 3, 4, 5].map((item, index) => {
                                    return (
                                        <div
                                            style={{
                                                height: '400px',
                                                width: '100%',
                                                backgroundColor: '#fff',
                                                borderRadius: '3px',
                                                padding: '1%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                margin: '0 0.2%',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Skeleton.Image style={{ width: '200px', height: '200px' }} active={true} />

                                            <Skeleton
                                                style={{ width: '100%', margin: '10% 0 0 0' }}
                                                size="1rem"
                                                // 5 dòng chữ
                                                line={5}
                                                active={true}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#fff',
                                    height: '400px',
                                    margin: '0.5% 1%',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    fontSize: '2.5rem',
                                }}
                            >
                                Chương trình FlashSale đang được cập nhật, vui lòng đợi trong giây lát...
                            </div>
                        )
                    ) : (
                        <div>
                            <Carousel
                                {...settings}
                                ref={carouselRef} //beforeChange={handleCarouselChange}
                            >
                                {GetListGift(gifts).map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <div className={cx('content')}>
                                                {item.map((item, index) => {
                                                    return <Item key={index} item={item} index={index} />;
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </Carousel>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
export default FlashSale;
