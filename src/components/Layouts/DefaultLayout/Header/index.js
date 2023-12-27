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
import { seeNotice } from '../../../../stores/actions';
import WidgetsIcon from '@mui/icons-material/Widgets';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { BellOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { notification } from 'antd';

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
    const [numNoticeNoAccess, setNumNoticeNoAccess] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [toNotice, setToNotice] = useState(false);
    const [apiNotice, contextHolder] = notification.useNotification();
    const [notificationData, setNotificationData] = useState(null);
    const productQuality = 7;

    const authInstance = state.authInstance;

    const showNotification = (notification) => {
        apiNotice.open({
            message: notification.title,
            description: notification.description,
            duration: 3,
            placement: 'bottomRight',
            icon: (
                <img
                    src={notification.image}
                    style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'contain',
                    }}
                />
            ),
            onClick: () => {
                window.open(notification.url);
            },
        });
    };

    useEffect(() => {
        state.socket.on('response-notification', (response) => {
            if (!state.user.sw_id) {
                if (response.type === 'all') {
                    setNotificationData(response.notification);
                } else if (response.type === 'admin') {
                    setNotificationData(response.notification);
                } else {
                    if (state.user._id === response.user_id) {
                        setNotificationData(response.notification);
                    }
                }
            }
            setToNotice((prev) => !prev);
        });
    }, []);

    useEffect(() => {
        if (notificationData) {
            showNotification(notificationData);
        }
    }, [notificationData]);

    useEffect(() => {
        if (state.user) {
            setUser(state.user);
        }
        authInstance
            .post(`/webpush/get`)
            .then((result) => {
                if (result.data.status === 'OK') {
                    setNotice(result.data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [state, toNotice]);

    useEffect(() => {
        const num = notice.reduce((acc, item) => {
            if (item.isAccess === false) {
                return acc + 1;
            }

            return acc;
        }, 0);

        setNumNoticeNoAccess(num);
    }, [notice]);
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

        fetch(`${api}/categories?filter=simple`)
            .then((response) => response.json())
            .then((result) => {
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
                    setProducts(res.data.data.products);
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

    const updateNotification = (id) => {
        fetch(`${api}/webpush/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id }),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 'OK') {
                    dispatch(seeNotice());
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <>
            {contextHolder}
            <div className={isShowForm ? cx('visible') : cx('hidden')}>
                <Modal isShowing={true}>
                    <RegisterLogin
                        setShowForm={setIsShowForm}
                        indexForm={indexForm}
                        setForm={setIndexForm}
                    ></RegisterLogin>
                </Modal>
            </div>
            <div
                style={{
                    backgroundColor: '#fff',
                    borderBottom: `${isHideBanner ? '' : '1px solid #7A7E7F'}`,
                    zIndex: 100,
                }}
                className={cx(
                    'wrapper',
                    `${isHideBanner && 'shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] fixed left-0 top-[-1px]'}`,
                )}
            >
                <div className={isHideBanner ? cx('hide') : cx('hide-on-desktop')}>
                    <Link to={'/'}>
                        <img className={cx('logo-tablet')} src={images.logo} alt="TA Bookstore" />
                    </Link>
                </div>
                <div className={cx('content')}>
                    <Link to={'/'}>
                        <p className={cx('home')}>TA Bookstore</p>
                        <img
                            style={{
                                width: '180px',
                                height: '60px',
                                objectFit: 'cover',
                                marginLeft: '40px',
                            }}
                            className={cx('logo', 'hide-on-tablet-mobile')}
                            src={images.logo}
                            alt="TA BOOK"
                        />
                    </Link>

                    <div className={cx('tools')}>
                        <Tippy
                            interactive={true}
                            placement="bottom"
                            render={(attrs) => (
                                <div className={cx('menu_popper', 'hide-on-tablet-mobile')} tabIndex="-1" {...attrs}>
                                    <PopperWrapper>
                                        <div className={cx('categories')}>
                                            <h2 className="p-[20px] text-[26px] uppercase">Danh mục sản phẩm</h2>
                                            <ul className="grid grid-cols-5">
                                                {listCategories.map((category, index) => (
                                                    <li
                                                        onClick={() => handleOnClickCategory(category._id)}
                                                        key={category._id}
                                                        className={cx('categories_child_item')}
                                                    >
                                                        {category.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </PopperWrapper>
                                </div>
                            )}
                        >
                            <div onClick={handleShowMenuOnTablet} className={cx('menu_dropdown')}>
                                <span className={cx('icon_menu')}>
                                    <WidgetsIcon
                                        style={{
                                            fontSize: '30px',
                                            color: '#7A7E7F',
                                        }}
                                    />
                                </span>
                                <span className={cx('icon_seemore')}>
                                    <ArrowDropDownIcon
                                        style={{
                                            fontSize: '20px',
                                            color: '#7A7E7F',
                                        }}
                                    />
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
                                            <div className={products.length > 0 ? cx('suggestions') : cx('hide')}>
                                                <div className={cx('suggestions_heading')}>
                                                    <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_searchtrending_black.svg" />
                                                    <h3>Gợi ý</h3>
                                                </div>
                                                <ul className={cx('suggestions_list')}>
                                                    {products.map((suggestion, index) => (
                                                        <li
                                                            onClick={() => handleClickItemSuggest(suggestion._id)}
                                                            key={index}
                                                            className={cx('suggestions_item')}
                                                        >
                                                            <img src={suggestion.images} />
                                                            <p className={cx('item_name')}>{suggestion.title}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div
                                                className={
                                                    products.length > 0 || localstorage.get('historys').length <= 0
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
                                            <div className={products.length > 0 ? cx('hide') : cx('keywords_hot')}>
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
                            <div
                                style={{
                                    borderColor: '#7A7E7F',
                                }}
                                className={cx('search')}
                            >
                                <input
                                    className="bg-transparent"
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
                                    className={keyTextSearch !== '' ? cx('clear_icon', 'hide-on-desktop') : cx('hide')}
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
                                                <BellOutlined />
                                                <h3>Thông báo</h3>
                                                <Link
                                                    to="/account/3"
                                                    className={notice.length > 0 ? cx('seeall_notices') : cx('hide')}
                                                >
                                                    Xem tất cả
                                                </Link>
                                            </div>

                                            <div
                                                className={
                                                    Object.keys(user).length > 0 ? cx('hide') : cx('noti_nologin_body')
                                                }
                                            >
                                                <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/customer/ico_login.svg" />
                                                <p>Vui lòng đăng nhập để xem thông báo</p>
                                                <Button onClick={handleLogin} primary>
                                                    Đăng nhập
                                                </Button>
                                                <Button onClick={handleRegister}>Đăng ký</Button>
                                            </div>

                                            <ul
                                                className={
                                                    notice.length <= 0 || Object.keys(state.user) <= 0
                                                        ? cx('hide')
                                                        : cx('notice_list')
                                                }
                                            >
                                                {notice.map((item, index) => (
                                                    <Link
                                                        to={item.notification.url}
                                                        key={index}
                                                        className={cx('notice_item')}
                                                        onClick={() => updateNotification(item._id)}
                                                    >
                                                        <div className={cx('notice_icon')}>
                                                            {item.isAccess === false && (
                                                                <p className={cx('notice_no_read')}></p>
                                                            )}
                                                            <img src={item.notification.image} />
                                                        </div>
                                                        <div className={cx('notice_body')}>
                                                            <h5 className={cx('notice_title')}>
                                                                {item.notification.title}
                                                            </h5>
                                                            <p className={cx('notice_content')}>
                                                                {item.notification.description}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </ul>

                                            <div className={notice.length > 0 ? cx('hide') : cx('notice_empty')}>
                                                <p>Bạn chưa có thông báo nào</p>
                                            </div>
                                        </div>
                                    </PopperWrapper>
                                </div>
                            )}
                        >
                            <div
                                style={{
                                    color: '#7A7E7F',
                                }}
                                className={cx('notification', 'hide-on-tablet-mobile')}
                            >
                                <BellOutlined className="text-[20px]" />
                                <label
                                    style={{
                                        color: '#7A7E7F',
                                        fontSize: '1.4rem',
                                    }}
                                >
                                    Thông báo
                                </label>
                                <p className={Object.keys(user).length > 0 ? cx('num_carts') : cx('hide')}>
                                    {numNoticeNoAccess > 9 ? '9+' : numNoticeNoAccess}
                                </p>
                            </div>
                        </Tippy>

                        <Link to="/cart" className={cx('cart')}>
                            <ShoppingCartOutlined
                                className="text-[20px]"
                                style={{
                                    color: '#7A7E7F',
                                }}
                            />
                            <label
                                style={{
                                    color: '#7A7E7F',
                                    fontSize: '1.4rem',
                                }}
                            >
                                Giỏ hàng
                            </label>
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
                                <UserOutlined
                                    className="text-[20px]"
                                    style={{
                                        color: '#7A7E7F',
                                    }}
                                />
                                <label
                                    style={{
                                        color: '#7A7E7F',
                                        fontSize: '1.4rem',
                                    }}
                                >
                                    {Object.keys(user).length > 0 ? user.fullName : 'Tài khoản'}
                                </label>
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
                                    className={tabMenuTablet === index ? cx('left_item', 'active') : cx('left_item')}
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
                                        <a
                                            onClick={() => handleOnClickCategory(item._id)}
                                            key={item._id}
                                            className={cx('all_product')}
                                            href="#"
                                        >
                                            <p>{item.name}</p>
                                            <a className={cx('all_product_icon')}>
                                                <FontAwesomeIcon icon={faAngleRight} />
                                            </a>
                                        </a>
                                    );
                                })}
                            </ul>
                            <ul className={tabMenuTablet === 1 ? cx('content_menu_list') : cx('hide')}></ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;
