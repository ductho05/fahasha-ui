import { useEffect, useState, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Slides from '../../components/Slides';
import axios from 'axios';
import Categories from '../../components/Categories';
import ForYou from '../../components/ForYou';
import ProductFrame from '../../components/ProductFrame';
import GridProduct from '../../components/GridProduct';
import ProductSlider from '../../components/ProductSlider';
import { api, listPathHots, listPathCategory, listPathLearn, listJustWatched } from '../../constants';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Skeleton } from '@mui/material';
import FlashSale from '../../components/FlashSale/index';
import 'react-loading-skeleton/dist/skeleton.css';
import HomeHero from '../../components/HomeHero';

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

const cx = classNames.bind(styles);
function Home() {
    var category = JSON.parse(localStorage.getItem('mycategory')) || [];
    const [productsHots, setProductsHots] = useState([]);
    const [categoryBooks, setCategoryBooks] = useState([]);
    const [learnBooks, setLearnBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = 'Trang chủ';
    }, []);

    useEffect(() => {
        listPathHots.forEach((item) => {
            fetch(`${api}/products${item.path}`)
                .then((response) => response.json())
                .then((products) => {
                    setProductsHots((prev) => {
                        return [
                            ...prev,
                            {
                                title: item.title,
                                products: products.data,
                            },
                        ];
                    });
                })
                .catch((err) => console.log(err));
        });

        listPathCategory.forEach((item) => {
            fetch(`${api}/products/category?${item.path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
                .then((response) => response.json())
                .then((products) => {
                    setCategoryBooks((prev) => {
                        return [
                            ...prev,
                            {
                                title: item.title,
                                products: products.data,
                            },
                        ];
                    });
                })
                .catch((err) => console.log(err));
        });

        listPathLearn.forEach((item) => {
            fetch(`${api}/products/category?${item.path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
                .then((response) => response.json())
                .then((products) => {
                    setLearnBooks((prev) => {
                        return [
                            ...prev,
                            {
                                title: item.title,
                                products: products.data,
                            },
                        ];
                    });
                })
                .catch((err) => console.log(err));
        });
    }, []);

    useEffect(() => {
        if (document.readyState === 'complete') {
            handlLoaded();
        } else {
            handleLoading();
        }
    }, []);

    const handleLoading = () => {
        setIsLoading(true);
    };

    const handlLoaded = () => {
        setIsLoading(false);
    };

    return (
        <div className={cx('wrapper')}>
            {/* <div className={cx('heading')}>
                <div className={cx('slider')}>
                    {isLoading ? (
                        <Skeleton
                            variant="rectangular"
                            animation="wave"
                            height={400}
                            cx={{
                                width: '100%',
                            }}
                        />
                    ) : (
                        <Slides slideList={slideList} />
                    )}
                </div>
                <div className={cx('poster', 'hide-on-tablet-mobile')}>
                    <ul className={cx('poster_list')}>
                        {listPoster.map((poster, index) => (
                            <li key={index} className={cx('poster_item')}>
                                {isLoading ? (
                                    <Skeleton variant="rectangular" animation="wave" width={380} height={156} />
                                ) : (
                                    <a href="#">
                                        <LazyLoadImage src={poster.url} />
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className={cx('heading_bottom', 'hide-on-small-tablet', 'hide-on-mobile')}>
                <ul className={cx('slogan_list')}>
                    {listSlogan.map((slogan, index) =>
                        isLoading ? (
                            <Skeleton variant="rectangular" animation="wave" width={300} height={220} />
                        ) : (
                            <li key={index} className={cx('slogan_item')}>
                                <a href="#">
                                    <LazyLoadImage src={slogan.url} />
                                </a>
                            </li>
                        ),
                    )}
                </ul>
            </div>

            <div className={cx('menu')}>
                <ul className={cx('menu_list')}>
                    {listMenu.map((item, index) => (
                        <li key={index} className={cx('menu_item')}>
                            <a href="#" className={cx('menu_item_link')}>
                                <LazyLoadImage src={item.image} />
                                <p>{item.title}</p>
                            </a>
                        </li>
                    ))}
                </ul>
            </div> */}

            <HomeHero />
            <div className="p-[10px] md:p-[20px] lg:p-[40px]">
                <div
                    className={cx(
                        'hide-on-tablet-mobile',
                        'shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] mb-[20px] rounded-[12px]',
                    )}
                >
                    <Categories categoryList={categories} />
                </div>
                <div className={cx('trending_product')}>
                    <div className={cx('title')}>
                        {isLoading ? (
                            <Skeleton animation="wave" variant="circular" width={24} height={24} />
                        ) : (
                            <LazyLoadImage src="https://cdn0.fahasa.com/skin/frontend/base/default/images/ico_dealhot.png" />
                        )}
                        <h3 className="min-w-[170px]">
                            {isLoading ? (
                                <Skeleton variant="text" sx={{ fontSize: '1.4rem' }} animation="wave" />
                            ) : (
                                'DANH MỤC NỔI BẬT'
                            )}
                        </h3>
                    </div>
                    <FlashSale />

                    <div
                        className={cx(
                            'trending_product',
                            'shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] mb-[20px] rounded-[12px] overflow-hidden',
                        )}
                    >
                        <div className={cx('title')}>
                            {isLoading ? (
                                <Skeleton animation="wave" variant="circular" width={24} height={24} />
                            ) : (
                                <LazyLoadImage src="https://cdn0.fahasa.com/skin/frontend/base/default/images/ico_dealhot.png" />
                            )}
                            <h3 className="min-w-[170px]">
                                {isLoading ? (
                                    <Skeleton variant="text" sx={{ fontSize: '1.4rem' }} animation="wave" />
                                ) : (
                                    'DANH MỤC NỔI BẬT'
                                )}
                            </h3>
                        </div>

                        <ProductFrame isLoading={isLoading} productList={productsHots} isHomePage={true} Component={GridProduct} />
                    </div>

                    <div
                        className={cx(
                            'textboook',
                            'shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] mb-[20px] rounded-[12px] overflow-hidden',
                        )}
                    >
                        <ProductFrame isLoading={isLoading} productList={categoryBooks} Component={ProductSlider} />
                    </div>

                    <div
                        className={cx(
                            'trending_product',
                            'shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] mb-[20px] rounded-[12px] overflow-hidden',
                        )}
                    >
                        <div className={cx('title')}>
                            <LazyLoadImage src="https://cdn0.fahasa.com/skin/frontend/base/default/images/ico_dealhot.png" />
                            <h3>CÓ THỂ BẠN SẼ THÍCH</h3>
                        </div>
                        <ForYou limit={4} />
                    </div>

                    <div
                        className={cx(
                            'trending_product',
                            'shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] mb-[20px] rounded-[12px] overflow-hidden',
                        )}
                    >
                        <div className={cx('title')}>
                            <LazyLoadImage src="https://cdn0.fahasa.com/skin/frontend/base/default/images/ico_dealhot.png" />
                            <h3>DỤNG CỤ HỌC TẬP</h3>
                        </div>

                        <ProductFrame isLoading={isLoading} productList={learnBooks} Component={GridProduct}></ProductFrame>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
