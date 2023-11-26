import { useEffect, useState, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './FlashSaleForGuest.module.scss';
import Slides from '../../components/Slides';
import axios from 'axios';
import CountDownCustom from '../../admin/components/CountDownCustom';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import Categories from '../../components/Categories';
import ForYou from '../../components/ForYou';
import ProductFrame from '../../components/ProductFrame';
import GridProduct from '../../components/GridProduct';
import ProductSlider from '../../components/ProductSlider';
import { api, listPathHots, listPathCategory, listPathLearn, listJustWatched } from '../../constants';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Skeleton } from '@mui/material';
import FlashSale from '../../components/FlashSale/index';
import lottie from 'lottie-web';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router-dom';
import { Segmented, Pagination, Tabs } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import Item from '../../components/FlashSale/Item';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { set } from 'react-hook-form';
// Fake api
const listPoster = [
    {
        url: 'https://cdn0.fahasa.com/media/wysiwyg/Thang-06-2023/VnPayT6_392%20x%20156.png',
    },
    {
        url: 'https://cdn0.fahasa.com/media/wysiwyg/Thang-06-2023/PNJT6_392x156.png',
    },
];

const listSlogan = [
    {
        url: 'https://cdn0.fahasa.com/media/wysiwyg/Thang-06-2023/SubBannerT6_Coupon_310x210-06.png',
    },
    {
        url: 'https://cdn0.fahasa.com/media/wysiwyg/Thang-06-2023/TrangBalo_Resize_310x210.png',
    },
    {
        url: 'https://cdn0.fahasa.com/media/wysiwyg/Thang-06-2023/Tamlinh_mainbanner_T6_Smallbanner_310x210.png',
    },
    {
        url: 'https://cdn0.fahasa.com/media/wysiwyg/Thang-06-2023/Backtoschool_trangtong_mainbanner_Smallbanner_310x210.png',
    },
];

const listMenu = [
    {
        title: 'Flash Sale',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/icon-menu/Icon_FlashSale_Thuong_120x120.png',
    },
    {
        title: 'Mã Giảm Giá',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/icon-menu/Icon_MaGiamGia_8px_1.png',
    },
    {
        title: 'Xu hướng',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/icon-menu/Icon_XuHuong_Thuong_120x120.png',
    },
    {
        title: 'Sản Phẩm Mới',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/icon-menu/Icon_SanPhamMoi_8px_1.png',
    },
    {
        title: 'Sale Thứ 3',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/Thang-06-2023/F3_HomepageT6.png',
    },
    {
        title: 'Văn Phòng Phẩm',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/icon-menu/Icon_VanPhongPham_Th%C6%B0%C6%A1ng_120x120.png',
    },
    {
        title: 'Manga Week',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/icon-menu/Manga_Week_Hot.png',
    },
    {
        title: 'Phiên Chợ Sách Cũ',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/icon-menu/Icon_PhienChoCu_8px_1.png',
    },
    {
        title: 'Kinh Tế',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/Thang-06-2023/Icon_KinhTe_Thuong.png',
    },
    {
        title: 'Văn Học',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/icon-menu/Icon_VanHoc_8px_1.png',
    },
];

const categories = [
    {
        title: 'VPP DCHS',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/image_195509_1_8906.jpg',
    },
    {
        title: 'Đồ chơi',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/5702017231044.jpg',
    },
    {
        title: 'Ngôn Tình Đam Mỹ',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/Danh-muc-san-pham/_am_m_.jpg',
    },
    {
        title: 'Sách Học Ngoại Ngữ',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/8935246917176.jpg',
    },
    {
        title: 'Manga',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/2023-05_MANGA/lop-hoc-rung-ron_bia_2-card_tap-17.jpg',
    },
    {
        title: 'Tâm Linh Luân Hồi',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/Danh-muc-san-pham/T_m_linh.jpg',
    },
    {
        title: 'Tâm Lý Thao Túng',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/Danh-muc-san-pham/Thao_t_ng.jpg',
    },
    {
        title: 'Đối Mặt Thức Tỉnh',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/Danh-muc-san-pham/Th_c_T_nh.jpg',
    },
    {
        title: 'Tiểu Thuyết',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/Danh-muc-san-pham/Ti_u_Thuy_t.jpg',
    },
    {
        title: 'Light Novel',
        image: 'https://cdn0.fahasa.com/media/wysiwyg/Duy-VHDT/Danh-muc-san-pham/lightnovel.jpg',
    },
];

const slideList = [
    {
        url: 'https://cdn0.fahasa.com/media/magentothem/banner7/Stem_mainbanner_T6_Slide_840x320.jpg',
    },
    {
        url: 'https://cdn0.fahasa.com/media/magentothem/banner7/CTKMThang6__840x320.jpg',
    },
    {
        url: 'https://cdn0.fahasa.com/media/magentothem/banner7/Fahasasalethu3_mainbanner_Bo1_Slider_840x320.jpg',
    },
    {
        url: 'https://cdn0.fahasa.com/media/magentothem/banner7/MangaWeekT623_Banner_Slide_840x320.jpg',
    },
];

function formatDateToString(date) {
    if (date) {
        date = date.$d ? date.$d : date;
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.toString().slice(8, 10);
        const utcTimeString = `${year}-${month}-${day}`;
        return utcTimeString;
        // return date.toISOString().slice(0, 10); // Lấy YYYY-MM-DD
    }
    return ''; // Trả về chuỗi rỗng nếu date là null
}

const cx = classNames.bind(styles);
function FlashSaleForGuest() {
    const moment = require('moment-timezone');

    // Đặt múi giờ cho Việt Nam
    const vietnamTimeZone = 'Asia/Ho_Chi_Minh';

    // Lấy thời gian hiện tại ở Việt Nam
    const currentTimeInVietnam = moment().tz(vietnamTimeZone);

    // Lấy số giờ hiện tại
    const currentHourInVietnam = currentTimeInVietnam.get('hours');
    var category = JSON.parse(localStorage.getItem('mycategory')) || [];
    const [productsHots, setProductsHots] = useState([]);
    const [categoryBooks, setCategoryBooks] = useState([]);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // load lai cục flashsale khi thay đổi thời gian
    const [load_animation, setLoad_animation] = useState(true); // load animation
    const navigate = useNavigate();
    const [perPage, setPerPage] = useState(24);
    const [pageNum, setPageNum] = useState(1);
    const [valueOptionTimePoint, setValueOptionTimePoint] = useState(Math.floor(currentHourInVietnam / 3));
    const [valueOptionCategory, setValueOptionCategory] = useState('');
    const [valueOptionDate, setValueOptionDate] = useState(formatDateToString(new Date()));
    const [isLastPage, setIsLastPage] = useState(false);
    const [isfirstget, setIsFirstGet] = useState(true);
    const valueTop = 530;

    const container = useRef(null);
    const container2 = useRef(null);
    const container3 = useRef(null);
    const container4 = useRef(null);
    const container5 = useRef(null);

    useEffect(() => {
        document.title = 'Trang chủ';
    }, []);

    //hàm load lại cục flashsale
    const reloadFlashSale = () => {
        setIsLoading(!isLoading);
    };

    console.log(isLoading, valueOptionDate, valueOptionTimePoint);

    useEffect(() => {
        fetch(`${api}/categories?filter=simple`)
            .then((response) => response.json())
            .then((categories) => {
                if (isfirstget && data.length > 0) {
                    const newCate = [
                        {
                            _id: '',
                            name: 'Tất cả',
                        },
                    ];
                    data.map((item) => {
                        categories.data.forEach((item2) => {
                            if (item?.product?.categoryId?._id == item2._id && newCate.includes(item2) == false) {
                                newCate.push(item2);
                                setIsFirstGet(false);
                            }
                        });
                    });

                    setCategoryBooks(newCate);
                }
            })
            .catch((err) => console.log(err));
    }, [data]);

    useEffect(() => {
        setLoad_animation(true);

        fetch(`${api}/flashsales?sort=reverse&date=${valueOptionDate}&point=${valueOptionTimePoint}`)
            .then((response) => response.json())
            .then((products) => {
                setIsFirstGet(true);
                setLoad_animation(false);
                setData(products.data);
            })
            .catch((err) => console.log(err));
    }, [valueOptionDate, valueOptionTimePoint, isLoading]);

    const getTimePont = () => {
        const timepoints = [];
        let timepoint = Math.floor(currentHourInVietnam / 3);
        let datesale = formatDateToString(new Date());
        let i = 0;
        while (i < 5) {
            if (timepoint > 7) {
                timepoint = 0;
                datesale = formatDateToString(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
            }
            timepoints.push({
                value: `${timepoint} ${datesale}`,
                // {
                //     timepoint: timepoint,
                //     date: datesale,
                // },
                label: `${timepoint * 3}h - ${timepoint * 3 + 3}h`,
            });
            timepoint++;
            i++;
        }
        return timepoints;
    };

    // const handleLoading = () => {
    //     setIsLoading(true);
    // };

    // const handlLoaded = () => {
    //     setIsLoading(false);
    // };

    useEffect(() => {
        lottie.loadAnimation({
            container: container.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('../../assets/json/sale_tag.json'),
        });
        lottie.loadAnimation({
            container: container2.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('../../assets/json/flashsale_background.json'),
        });
        lottie.loadAnimation({
            container: container3.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('../../assets/json/star_frame.json'),
        });
        lottie.loadAnimation({
            container: container4.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('../../assets/json/star_frame.json'),
        });
        lottie.loadAnimation({
            container: container5.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('../../assets/json/reading_man.json'),
        });
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('visible')}>
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={load_animation}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
            <div className={cx('wrapper_header')}>
                <div style={{ flex: '1' }}></div>
                <span
                    style={{
                        height: '1px',
                        width: '100%',
                        backgroundColor: '#ffe818',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        margin: '0 2rem 0 2rem',
                        flex: '1',
                    }}
                ></span>
                <div
                    className={cx('gift-current__title')}
                    style={{
                        flex: '3.8',
                    }}
                >
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
                                zIndex: '0',
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
                    </div>
                </div>
                <span
                    style={{
                        height: '1px',
                        width: '100%',
                        backgroundColor: '#ffe818',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        margin: '0 2rem 0 2rem',
                        flex: '1',
                    }}
                ></span>
                <div style={{ flex: '1' }}></div>
            </div>
            <div className={cx('wrapper_body')}>
                <div className={cx('wrapper_image')}>
                    <div
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '60vh',
                            top: '-10vh',
                            left: '0',
                        }}
                        ref={container4}
                    ></div>
                    <div
                        height="100%"
                        style={{
                            position: 'absolute',
                            maxWidth: '100%',
                            height: '40vh',
                            zIndex: '0',
                            top: '0',
                            left: '30vw',
                        }}
                        ref={container3}
                    ></div>

                    <div
                        className={cx('wrapper_image__right')}
                        style={{
                            flex: '1',
                        }}
                    >
                        <div className={cx('image')} ref={container5}></div>
                    </div>
                    <div
                        className={cx('wrapper_image__poster')}
                        ref={container2}
                        style={{
                            flex: '1',
                            zIndex: '0',
                        }}
                    ></div>
                    <div
                        className={cx('wrapper_image__left')}
                        style={{
                            flex: '1',
                        }}
                    >
                        {' '}
                        <div className={cx('title1')}>
                            Đọc sách thả ga -<br />- Không lo về giá
                        </div>
                        <div className={cx('title2')}>
                            <div
                                style={{
                                    fontSize: '2rem',
                                    margin: '0 0 2% 0',
                                }}
                            >
                                Chương trình ưu đãi tháng {new Date().getMonth() + 1}{' '}
                            </div>{' '}
                            - Giảm đến 80% - Sách văn học - <br />
                            - Giảm đến 50% - Sách kinh tế - <br />- Giảm đến 40% - Sách thiếu nhi - <br />- Giảm đến 30%
                            - Sách ngoại ngữ -<br /> - Mại dô mại dô... -
                        </div>
                    </div>
                </div>
                <div
                    className={cx('wrapper_menu')}
                    style={{
                        zIndex: '0',
                    }}
                >
                    <div className={cx('wrapper_menu__time')}>
                        {getTimePont().map((item, index) => (
                            <div
                                key={index}
                                className={cx('wrapper_menu__time__item')}
                                onClick={() => {
                                    setValueOptionTimePoint(item.value.slice(0, 1));
                                    setValueOptionDate(item.value.slice(2, 12));
                                }}
                                style={{
                                    backgroundColor:
                                        valueOptionTimePoint == item.value.slice(0, 1) ? '#ffe818' : 'transparent',
                                    color: valueOptionTimePoint == item.value.slice(0, 1) ? '#000' : '#fff',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        height: '4.5vh',
                                    }}
                                >
                                    <span>{item.label}</span>
                                    {item.value.slice(2, 12) != formatDateToString(new Date()) ? (
                                        <span
                                            style={{
                                                fontSize: '2vh',
                                                margin: '1vh 0 0 0',
                                            }}
                                        >
                                            (ngày mai)
                                        </span>
                                    ) : (
                                        <span
                                            style={{
                                                fontSize: '2vh',
                                                margin: '1vh 0 0 0',
                                            }}
                                        >
                                            --
                                        </span>
                                    )}
                                </div>
                                {index == 0 ? (
                                    <span style={{ color: 'red', fontSize: '3vh', marginTop: '2vh' }}>
                                        Đang diễn ra
                                    </span>
                                ) : (
                                    <span style={{ color: 'gray', fontSize: '3vh', marginTop: '2vh' }}>
                                        Sắp diễn ra
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className={cx('dsc')}>
                    <div className={cx('wrapper_menu__list')}>
                        {data.length > 0 ? (
                            <Tabs
                                defaultActiveKey="1"
                                onChange={(e) => {
                                    categoryBooks.map((item, i) => {
                                        if (i == e) {
                                            setValueOptionCategory(item._id);
                                            window.scrollTo({
                                                top: valueTop,

                                                behavior: 'smooth',
                                            });
                                            setPageNum(1);
                                            item._id == '' ? setPerPage(24) : setPerPage(4);
                                        }
                                    });
                                }}
                                tabPosition={'left'}
                                // custom render tab
                                tabBarStyle={{
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    width: '16.5vw',
                                    borderRadius: '0.5%',
                                    //padding: '1% 1% 0 1%',
                                    // di chuyển theo scroll
                                    position: 'sticky',
                                    top: '0',
                                    maxHeight: '55vh',
                                    display: 'flex',
                                    flexDirection: 'column-reverse',
                                }}
                                // sửa lại style của content

                                style={{
                                    height: '100%',
                                    width: '100%',
                                    backgroundColor: '#fff',
                                    borderRadius: '0.5%',
                                    display: 'flex',
                                }}
                                items={categoryBooks.map((item, i) => {
                                    const name = item.name;
                                    return {
                                        label: `${name}`,
                                        key: i,

                                        style: {
                                            height: '100%',
                                            backgroundColor: 'transparent',
                                            width: '100%',
                                        },
                                        disabled: i === 28,
                                        children: (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: '1vh 0 0 0',
                                                    backgroundColor: '#ffe5e4',
                                                    width: '100%',
                                                    height: '100%',
                                                    // xuống dòng nếu item có nhiều hơn 3 sản phẩm
                                                    flexWrap: 'wrap',
                                                }}
                                            >
                                                {data
                                                    .filter(
                                                        (item) =>
                                                            item?.product?.categoryId?._id == valueOptionCategory ||
                                                            valueOptionCategory == '',
                                                    )
                                                    .map((item, index) => {
                                                        return (
                                                            index >= (pageNum - 1) * perPage &&
                                                            index < pageNum * perPage && (
                                                                <Item
                                                                    filter={item.point_sale == Math.floor(currentHourInVietnam / 3) && item.date_sale == formatDateToString(
                                                                        new Date(),
                                                                    ) ? true : false}
                                                                    key={index}
                                                                    item={item}
                                                                    index={index}
                                                                    type={'detail'}
                                                                />
                                                            )
                                                        );
                                                    })}
                                            </div>
                                        ),
                                    };
                                })}
                            />
                        ) : (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '55vh',
                                    backgroundColor: '#ffe5e4',
                                    width: '100%',
                                }}
                            >
                                <h1
                                    style={{
                                        fontSize: '3vh',
                                    }}
                                >
                                    {' '}
                                    Đang cập nhập sản phẩm ...{' '}
                                </h1>
                            </div>
                        )}

                        <div
                            style={{
                                display: 'flex',
                                backgroundColor: '#fff',
                                height: '6vh',
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}
                        >
                            <div style={{ flex: '2', backgroundColor: '#313131', height: '100%' }}></div>

                            <div
                                style={{
                                    flex: '8',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    backgroundColor: '#fff',
                                    height: '70%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {data.length > 0 && (
                                    <>
                                        <span
                                            style={{
                                                width: '1vw',
                                                height: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {pageNum > 1 && (
                                                <LeftOutlined
                                                    style={{
                                                        color: '#0066ff',
                                                    }}
                                                    onClick={() => {
                                                        // window.scrollTo(200, 200);
                                                        // scroll lên 1 đoạn
                                                        window.scrollTo({
                                                            top: valueTop,

                                                            behavior: 'smooth',
                                                        });
                                                        setIsLastPage(false);
                                                        if (pageNum > 1) {
                                                            setPageNum(pageNum - 1);
                                                        }
                                                    }}
                                                />
                                            )}
                                        </span>
                                        <div className={cx('wrapper_pagination__item')}>{pageNum}</div>
                                        <span
                                            style={{
                                                width: '1vw',
                                                height: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {Math.ceil(
                                                data.filter(
                                                    (item) =>
                                                        item?.product?.categoryId?._id == valueOptionCategory ||
                                                        valueOptionCategory == '',
                                                ).length / perPage,
                                            ) != pageNum && (
                                                    <RightOutlined
                                                        style={{
                                                            color: '#0066ff',
                                                        }}
                                                        onClick={() => {
                                                            // tự động scroll lên đầu trang
                                                            window.scrollTo({
                                                                top: valueTop,

                                                                behavior: 'smooth',
                                                            });
                                                            setPageNum(pageNum + 1);
                                                        }}
                                                    />
                                                )}
                                        </span>{' '}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FlashSaleForGuest;
