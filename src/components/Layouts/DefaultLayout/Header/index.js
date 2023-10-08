import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import _debounce from 'lodash/debounce';

import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';

import classNames from 'classnames/bind';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate, faArrowLeft, faAngleRight, faClockRotateLeft, faX } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';

import styles from './Header.module.scss';
import images from '../../../../assets/images';
import { Wrapper as PopperWrapper } from '../../../Popper';
import Button from '../../../Button';
import Modal from '../../../Modal';
import RegisterLogin from '../../../Forms/RegisterLogin';
import useViewport from '../../../../hooks/useViewport';
import { api } from '../../../../constants';
import localstorage from '../../../../localstorage';
import { useStore } from '../../../../stores/hooks';
import { Input } from '@mui/material';
import LoginWithFacebook from '../../../LoginWithFacebook';
import { Skeleton } from '@mui/material';
import 'react-loading-skeleton/dist/skeleton.css';

const cx = classNames.bind(styles);

function Header() {
    const [suggestSearch, setSuggestSearch] = useState(false);
    const [isShowForm, setIsShowForm] = useState(false);
    const [isShowMenuTablet, setIsShowMenuTablet] = useState(false);
    const [indexForm, setIndexForm] = useState(0);
    const widthWindow = useViewport();
    const [tabMenuTablet, setTabMenuTablet] = useState(0);
    const [isHideBanner, setIsHideBanner] = useState(false);
    const [keyTextSearch, setKeyTextSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [listHotKeys, setListHotKeys] = useState([]);
    const [listCategories, setListCategories] = useState([]);
    const [listToggle, setListToggle] = useState(new Array(listCategories.length).fill(false));
    const [tabKey, setTabKey] = useState(0); // foreign
    const navigate = useNavigate();
    const [state, dispatch] = useStore();
    const [user, setUser] = useState({});
    const [notice, setNotice] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const productQuality = 7;

    useEffect(() => {
        if (state.user) {
            setUser(state.user);
        }
    }, [state]);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsHideBanner(true);
            } else {
                setIsHideBanner(false);
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        fetch(`${api}/products/bestseller-limit`)
            .then((response) => response.json())
            .then((result) => {
                setListHotKeys(result.data);
            })
            .catch((err) => console.log(err));

        fetch(`${api}/categories`)
            .then((response) => response.json())
            .then((result) => {
                result.data.sort((a, b) => b.categories.length - a.categories.length);
                setListCategories(result.data);
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        if (keyTextSearch == '') {
            setProducts([]);
        } else {
            axios
                .get(`${api}/products?title=${keyTextSearch}&num=${productQuality}`)
                .then((res) => {
                    setProducts(res.data.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [keyTextSearch]);

    let handleOnFocus = () => {
        setSuggestSearch(true);
    };

    let handleHide = () => {
        setSuggestSearch(false);
    };

    let handleLogin = () => {
        setIndexForm((prev) => {
            prev = 0;
            return prev;
        });
        setIsShowForm(true);
    };

    let handleRegister = () => {
        setIndexForm((prev) => {
            prev = 1;
            return prev;
        });
        setIsShowForm(true);
    };

    let handleShowMenuOnTablet = () => {
        setIsShowMenuTablet(true);
    };

    function handleDebounceFn(inputValue) {
        setKeyTextSearch(inputValue);
    }

    const debounceFn = useCallback(_debounce(handleDebounceFn, 700), []);

    function handleChangeValue(event) {
        const inputValue = event.target?.value;
        debounceFn(inputValue);
    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            navigate(`/search/${keyTextSearch}`);
            let oldHistoty = localstorage.get('historys');
            const findHistory = oldHistoty.find((h) => h === keyTextSearch);
            if (!findHistory) {
                localstorage.set('historys', [...oldHistoty, keyTextSearch]);
            }
            setSuggestSearch(false);
            setKeyTextSearch('');
        }
    };

    const handleSearch = () => {
        navigate(`/search/${keyTextSearch}`);
        let oldHistoty = localstorage.get('historys');
        const findHistory = oldHistoty.find((h) => h === keyTextSearch);
        if (!findHistory) {
            localstorage.set('historys', [...oldHistoty, keyTextSearch]);
        }
        setSuggestSearch(false);
        setKeyTextSearch('');
    };

    const handleClickItemSuggest = (id) => {
        navigate(`/product-detail/${id}`);
        setSuggestSearch(false);
    };

    const handleOnClickCategory = (id) => {
        navigate(`/seemore-product/${id}`);
        setIsShowMenuTablet(false);
    };

    const handleShowAllProduct = () => {
        navigate(`/seemore-product/${0}`);
        setIsShowMenuTablet(false);
    };

    const handleReverse = () => {
        listHotKeys.reverse();
        setListHotKeys((prev) => {
            return [...prev];
        });
    };

    const handleDeleteHistoryItem = (index) => {
        let oldHistoty = localstorage.get('historys');
        oldHistoty.splice(index, 1);
        localstorage.set('historys', oldHistoty);
    };

    const handleDeleteAllHistory = () => {
        localstorage.set('historys', []);
    };

    const handleToggleMenuItem = (index) => {
        setListToggle((prev) => {
            prev[index] = !prev[index];
            return [...prev];
        });
        setTabMenuTablet((prev) => prev);
    };

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
        <>
            {isLoading ? (
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                    height={100}
                    cx={{
                        widht: '100vw',
                        height: '100px',
                    }}
                />
            ) : (
                <>
                    <div className={isShowForm ? cx('visible') : cx('hidden')}>
                        <Modal isShowing={true}>
                            <RegisterLogin
                                setShowForm={setIsShowForm}
                                indexForm={indexForm}
                                setForm={setIndexForm}
                            ></RegisterLogin>
                        </Modal>
                    </div>
                    <div className={cx('wrapper')}>
                        <div className={isLoading ? cx('loading') : cx('banner', 'hide-on-tablet-mobile')}>
                            {isLoading ? (
                                <Skeleton
                                    variant="rectangular"
                                    animation="wave"
                                    cx={{
                                        height: '60px',
                                        width: '100vw',
                                    }}
                                />
                            ) : (
                                <a href="#">
                                    <img src={images.banner} alt="Banner" />
                                </a>
                            )}
                        </div>
                        <div className={isHideBanner ? cx('hide') : cx('hide-on-desktop')}>
                            {isLoading ? (
                                <Skeleton
                                    variant="rectangular"
                                    animation="wave"
                                    cx={{
                                        height: '23px',
                                        width: '130px',
                                    }}
                                />
                            ) : (
                                <Link to={'/'}>
                                    <img
                                        className={cx('logo-tablet')}
                                        src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/fahasa-logo.png"
                                        alt="Fahasa"
                                    />
                                </Link>
                            )}
                        </div>
                        <div className={cx('content')}>
                            <Link to={'/'}>
                                <p className={cx('home')}>FAHASHA</p>
                                <img className={cx('logo', 'hide-on-tablet-mobile')} src={images.logo} alt="Fahasa" />
                            </Link>

                            <div className={cx('tools')}>
                                <Tippy
                                    interactive={true}
                                    placement="bottom"
                                    render={(attrs) => (
                                        <div
                                            className={cx('menu_popper', 'hide-on-tablet-mobile')}
                                            tabIndex="-1"
                                            {...attrs}
                                        >
                                            <PopperWrapper>
                                                <div className={cx('categories')}>
                                                    <ul className={cx('categories_name_list')}>
                                                        <h2>Danh mục sản phẩm</h2>
                                                        {['Sách Trong Nước', 'Sách Ngoài Nước'].map((item, index) => (
                                                            <li
                                                                onClick={() => setTabKey(index)}
                                                                key={index}
                                                                className={
                                                                    tabKey === index
                                                                        ? cx('categories_name_item', 'active_on-pc')
                                                                        : cx('categories_name_item')
                                                                }
                                                            >
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <div
                                                        className={tabKey === 0 ? cx('categories_content') : cx('hide')}
                                                    >
                                                        <div className={cx('category_title')}>
                                                            <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/category/ico_sachtrongnuoc.svg" />
                                                            <h2>Sách Trong Nước</h2>
                                                        </div>

                                                        <ul className={cx('categories_list')}>
                                                            {listCategories.map((category, index) => (
                                                                <li key={index} className={cx('categories_item')}>
                                                                    <h5>{category._id}</h5>
                                                                    <ul className={cx('categories_list_child')}>
                                                                        {category.categories.map((item) => (
                                                                            <li
                                                                                onClick={() =>
                                                                                    handleOnClickCategory(item._id)
                                                                                }
                                                                                key={item._id}
                                                                                className={cx('categories_child_item')}
                                                                            >
                                                                                {item.name}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div
                                                        className={tabKey === 1 ? cx('categories_content') : cx('hide')}
                                                    >
                                                        <div className={cx('category_title')}>
                                                            <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/category/ico_foreignbooks.svg" />
                                                            <h2>Sách Ngoài Nước</h2>
                                                        </div>

                                                        <ul className={cx('categories_list')}></ul>
                                                    </div>
                                                </div>
                                            </PopperWrapper>
                                        </div>
                                    )}
                                >
                                    <div onClick={handleShowMenuOnTablet} className={cx('menu_dropdown')}>
                                        <span className={cx('icon_menu')}>
                                            <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_menu.svg" />
                                        </span>
                                        <span className={cx('icon_seemore')}>
                                            <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/icon_seemore_gray.svg" />
                                        </span>
                                    </div>
                                </Tippy>
                                {/* Suggest Search */}
                                <Tippy
                                    interactive={true}
                                    visible={suggestSearch}
                                    onClickOutside={handleHide}
                                    placement="bottom"
                                    render={(attrs) => (
                                        <div className={cx('search_result')} tabIndex="-1" {...attrs}>
                                            <PopperWrapper>
                                                <div className={cx('search_content')}>
                                                    <div
                                                        className={products.length > 0 ? cx('suggestions') : cx('hide')}
                                                    >
                                                        <div className={cx('suggestions_heading')}>
                                                            <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_searchtrending_black.svg" />
                                                            <h3>Gợi ý</h3>
                                                        </div>
                                                        <ul className={cx('suggestions_list')}>
                                                            {products.map((suggestion, index) => (
                                                                <li
                                                                    onClick={() =>
                                                                        handleClickItemSuggest(suggestion._id)
                                                                    }
                                                                    key={index}
                                                                    className={cx('suggestions_item')}
                                                                >
                                                                    <img src={suggestion.images} />
                                                                    <p className={cx('item_name')}>
                                                                        {suggestion.title}
                                                                    </p>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div
                                                        className={
                                                            products.length > 0 ||
                                                            localstorage.get('historys').length <= 0
                                                                ? cx('hide')
                                                                : cx('keywords_hot')
                                                        }
                                                    >
                                                        <div className={cx('hot_heading')}>
                                                            <p className={cx('history_icon')}>
                                                                <FontAwesomeIcon icon={faClockRotateLeft} />
                                                            </p>
                                                            <h3>Lịch sử tìm kiếm</h3>
                                                            <p
                                                                onClick={handleDeleteAllHistory}
                                                                className={cx('btn_delete_all')}
                                                            >
                                                                Xóa tất cả
                                                            </p>
                                                        </div>
                                                        <ul className={cx('history_list')}>
                                                            {localstorage.get('historys').map((history, index) => (
                                                                <li key={index} className={cx('history_item')}>
                                                                    <p className={cx('history_title')}>{history}</p>
                                                                    <p
                                                                        onClick={() => handleDeleteHistoryItem(index)}
                                                                        className={cx('btn_delete')}
                                                                    >
                                                                        <FontAwesomeIcon icon={faX} />
                                                                    </p>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div
                                                        className={
                                                            products.length > 0 ? cx('hide') : cx('keywords_hot')
                                                        }
                                                    >
                                                        <div className={cx('hot_heading')}>
                                                            <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_searchtrending_black.svg" />
                                                            <h3>Từ khóa hot</h3>
                                                            <p onClick={handleReverse} className={cx('rorate_icon')}>
                                                                <FontAwesomeIcon icon={faRotate} />
                                                            </p>
                                                        </div>
                                                        <ul className={cx('keywords_list')}>
                                                            {listHotKeys.map((key) => (
                                                                <li
                                                                    onClick={() => handleClickItemSuggest(key._id)}
                                                                    key={key._id}
                                                                    className={cx('keywords_item')}
                                                                >
                                                                    <img src={key.images} />
                                                                    <label>{key.title}</label>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </PopperWrapper>
                                        </div>
                                    )}
                                >
                                    <div className={cx('search')}>
                                        <input
                                            onChange={handleChangeValue}
                                            //value={keyTextSearch}
                                            onFocus={handleOnFocus}
                                            placeholder="Tìm kiếm sản phẩm mong muốn..."
                                            spellCheck={false}
                                            onKeyDown={(e) => handleKeyDown(e)}
                                        />
                                        {/* <Input
                                    placeholder="Bạn muốn tìm gì?"
                                    style={{
                                        width: '100%',
                                    }}
                                    onChange={handleChangeValue}
                                /> */}
                                        <p
                                            onClick={() => {
                                                setKeyTextSearch('');
                                            }}
                                            className={
                                                keyTextSearch !== '' ? cx('clear_icon', 'hide-on-desktop') : cx('hide')
                                            }
                                        >
                                            <FontAwesomeIcon icon={faX} />
                                        </p>
                                        <p onClick={handleSearch} className={cx('search_btn', 'hide-on-tablet-mobile')}>
                                            <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_search_white.svg" />
                                        </p>
                                    </div>
                                </Tippy>
                            </div>

                            <div className={cx('tools_right')}>
                                <Tippy
                                    interactive={true}
                                    placement="bottom-end"
                                    render={(attrs) => (
                                        <div className={cx('popper_noti_nologin')} tabIndex="-1" {...attrs}>
                                            <PopperWrapper>
                                                <div className={cx('noti_nologin_content')}>
                                                    <div className={cx('noti_nologin_heading')}>
                                                        <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_noti_black.svg" />
                                                        <h3>Thông báo</h3>
                                                        <p
                                                            className={
                                                                notice.length > 0 ? cx('seeall_notices') : cx('hide')
                                                            }
                                                        >
                                                            Xem tất cả
                                                        </p>
                                                    </div>

                                                    <div
                                                        className={
                                                            Object.keys(user).length > 0
                                                                ? cx('hide')
                                                                : cx('noti_nologin_body')
                                                        }
                                                    >
                                                        <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/customer/ico_login.svg" />
                                                        <p>Vui lòng đăng nhập để xem thông báo</p>
                                                        <Button onClick={handleLogin} primary>
                                                            Đăng nhập
                                                        </Button>
                                                        <Button onClick={handleRegister}>Đăng ký</Button>
                                                    </div>

                                                    <ul className={notice.lenth > 0 ? cx('notice_list') : cx('hide')}>
                                                        <li className={cx('notice_item')}>
                                                            <div className={cx('notice_icon')}>
                                                                <p className={cx('notice_no_read')}></p>
                                                                <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/customer/ico_noti_other.svg" />
                                                            </div>
                                                            <div className={cx('notice_body')}>
                                                                <h5 className={cx('notice_title')}>
                                                                    Hè vui chơi không rơi kiến thức{' '}
                                                                </h5>
                                                                <p className={cx('notice_content')}>
                                                                    Bút chấm đọc - học tiếng anh Tân Việt - Kho sách
                                                                    bách khoa gieo mầm tri thức - và nhiều sản phẩm hấp
                                                                    dẫn khác giảm đến 50%
                                                                </p>
                                                            </div>
                                                        </li>
                                                        <li className={cx('notice_item')}>
                                                            <div className={cx('notice_icon')}>
                                                                <p className={cx('notice_no_read')}></p>
                                                                <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/customer/ico_noti_other.svg" />
                                                            </div>
                                                            <div className={cx('notice_body')}>
                                                                <h5 className={cx('notice_title')}>
                                                                    Hè vui chơi không rơi kiến thức{' '}
                                                                </h5>
                                                                <p className={cx('notice_content')}>
                                                                    Bút chấm đọc - học tiếng anh Tân Việt - Kho sách
                                                                    bách khoa gieo mầm tri thức - và nhiều sản phẩm hấp
                                                                    dẫn khác giảm đến 50%
                                                                </p>
                                                            </div>
                                                        </li>
                                                        <li className={cx('notice_item')}>
                                                            <div className={cx('notice_icon')}>
                                                                <p className={cx('notice_no_read')}></p>
                                                                <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/customer/ico_noti_other.svg" />
                                                            </div>
                                                            <div className={cx('notice_body')}>
                                                                <h5 className={cx('notice_title')}>
                                                                    Hè vui chơi không rơi kiến thức{' '}
                                                                </h5>
                                                                <p className={cx('notice_content')}>
                                                                    Bút chấm đọc - học tiếng anh Tân Việt - Kho sách
                                                                    bách khoa gieo mầm tri thức - và nhiều sản phẩm hấp
                                                                    dẫn khác giảm đến 50%
                                                                </p>
                                                            </div>
                                                        </li>
                                                    </ul>

                                                    <div
                                                        className={
                                                            notice.lenth > 0 || Object.keys(user).length == 0
                                                                ? cx('hide')
                                                                : cx('notice_empty')
                                                        }
                                                    >
                                                        <p>Bạn chưa có thông báo nào</p>
                                                    </div>
                                                </div>
                                            </PopperWrapper>
                                        </div>
                                    )}
                                >
                                    <div className={cx('notification', 'hide-on-tablet-mobile')}>
                                        <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_noti_gray.svg" />
                                        <label>Thông báo</label>
                                        <p className={Object.keys(user).length > 0 ? cx('num_carts') : cx('hide')}>0</p>
                                    </div>
                                </Tippy>

                                <Link to="/cart" className={cx('cart')}>
                                    <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_cart_gray.svg" />
                                    <label>Giỏ hàng</label>
                                    <p className={Object.keys(user).length > 0 ? cx('num_carts') : cx('hide')}>
                                        {Object.keys(localstorage.get(`myCart_${state.user._id}`)).length
                                            ? localstorage.get(`myCart_${state.user._id}`).items.length
                                            : 0}
                                    </p>
                                </Link>
                                <Tippy
                                    interactive={true}
                                    placement="bottom-end"
                                    render={(attrs) => (
                                        <div
                                            className={
                                                Object.keys(user).length > 0
                                                    ? cx('hide')
                                                    : cx('account_nologin', 'hide-on-tablet-mobile')
                                            }
                                            tabIndex="-1"
                                            {...attrs}
                                        >
                                            <PopperWrapper>
                                                <div className={cx('account_nologin_content')}>
                                                    <Button primary onClick={handleLogin}>
                                                        Đăng nhập
                                                    </Button>
                                                    <Button onClick={handleRegister}>Đăng ký</Button>
                                                    <p className={cx('btn_facebook')}>
                                                        <LoginWithFacebook />
                                                    </p>
                                                </div>
                                            </PopperWrapper>
                                        </div>
                                    )}
                                    hideOnClick={true}
                                >
                                    <Link to={`/account/${0}`} className={cx('account')}>
                                        <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_account_gray.svg" />
                                        <label>{Object.keys(user).length > 0 ? user.fullName : 'Tài khoản'}</label>
                                    </Link>
                                </Tippy>
                            </div>
                        </div>
                        <div
                            style={{ width: `${widthWindow}px` }}
                            className={
                                isShowMenuTablet
                                    ? cx('menu_on-tablet_mobile', 'hide-on-desktop')
                                    : cx('menu_on-tablet_mobile', 'hidden')
                            }
                        >
                            <div className={cx('heading')}>
                                <p onClick={() => setIsShowMenuTablet(false)} className={cx('close_menu')}>
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                </p>
                                <h3>Danh mục sản phẩm</h3>
                            </div>
                            <div className={cx('menu_tablet_mobile_content')}>
                                <ul className={cx('menu_tablet_left_content')}>
                                    {[
                                        {
                                            title: 'Sách trong nước',
                                            images: 'https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/category/ico_sachtrongnuoc.svg',
                                        },
                                        {
                                            title: 'Sách ngoài nước',
                                            images: 'https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/category/ico_foreignbooks.svg',
                                        },
                                    ].map((item, index) => (
                                        <li
                                            onClick={() => setTabMenuTablet(index)}
                                            key={index}
                                            className={
                                                tabMenuTablet === index ? cx('left_item', 'active') : cx('left_item')
                                            }
                                        >
                                            <img src={item.images} />
                                            <p>{item.title}</p>
                                        </li>
                                    ))}
                                </ul>
                                <div className={cx('menu_tablet_right_content')}>
                                    <a onClick={handleShowAllProduct} href="#" className={cx('all_product')}>
                                        <p>Tất cả sản phẩm</p>
                                        <a className={cx('all_product_icon')}>
                                            <FontAwesomeIcon icon={faAngleRight} />
                                        </a>
                                    </a>
                                    <ul className={tabMenuTablet === 0 ? cx('content_menu_list') : cx('hide')}>
                                        {listCategories.map((item, index) => {
                                            return (
                                                <li
                                                    key={index}
                                                    className={
                                                        listToggle[index]
                                                            ? cx('content_menu_item', 'more_content')
                                                            : cx('content_menu_item')
                                                    }
                                                >
                                                    <p>{item._id}</p>
                                                    <span
                                                        onClick={() => {
                                                            handleToggleMenuItem(index);
                                                        }}
                                                        className={cx('content_menu_icon')}
                                                    >
                                                        <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_triangle_gray_down.svg" />
                                                    </span>
                                                    <ul className={cx('content_menu_child_list')}>
                                                        {item.categories.map((item_child, index_child) => (
                                                            <li
                                                                onClick={() => handleOnClickCategory(item_child._id)}
                                                                key={index_child}
                                                                className={cx('content_menu_child_item')}
                                                            >
                                                                <a href="#" className={cx('child_item_name')}>
                                                                    {item_child.name}
                                                                </a>
                                                                <a className={cx('all_product_icon')}>
                                                                    <FontAwesomeIcon icon={faAngleRight} />
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    <ul className={tabMenuTablet === 1 ? cx('content_menu_list') : cx('hide')}></ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default Header;
