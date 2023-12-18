import styles from './item.module.scss';
import classname from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
//import { Image } from 'antd';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { faMinus, faPlus, faShareNodes, faStar, faCartShopping, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Progress, Button, Image, message } from 'antd';
import { useStore } from '../../../stores/hooks';
import { toast, ToastContainer } from 'react-toastify';
import { Dialog } from '@mui/material';
import { useState } from 'react';

import images from '../../../assets/images';
const numeral = require('numeral');

const cx = classname.bind(styles);

function Item({ item, index, type, filter }) {
    const navigate = useNavigate();
    const [state, dispatch] = useStore();
    const [showNolginDialog, setShowNolginDialog] = useState(false);

    const changeNumSale = (num) => {
        let hiddenPriceString = '';
        hiddenPriceString += num.toString()[0];
        hiddenPriceString += 'X';
        return hiddenPriceString;
    };

    function checkCart(pops) {
        const { cart, item } = pops;

        for (const element of cart.items) {
            if (element.id === item.id) {
                return true;
            }
        }
        return false;
    }

    function addCart(num, productId) {
        const user = JSON.parse(localStorage.getItem('user'));
        const namecart = `myCart_${state.user._id}`;
        var myCart = JSON.parse(localStorage.getItem(namecart));

        const cart = {
            id: state.user._id,
            items: myCart ? myCart.items : [],
        };

        var item = {
            id: productId,
            count: num,
            isGetcheckout: 1,
        };

        if (checkCart({ cart, item })) {
            for (const element of cart.items) {
                if (element.id === item.id) {
                    element.count += num;
                }
            }
        } else {
            cart.items.push(item);
        }
        myCart = cart;
        localStorage.setItem(namecart, JSON.stringify(myCart));
    }
    const handleCancelGoToLoginPage = () => {
        setShowNolginDialog(false);
    };

    const handleToLoginPage = () => {
        navigate('/login-register');
    };

    const handleAddToCart = (product) => {

        if (Object.keys(state.user).length > 0) {

            if (product.quantity == 0) {

                message.warning("Sản phẩm tạm thời hết hàng")
            } else {
                addCart(1, product._id)
                toast.success('Đã thêm sản phẩm vào giỏ hàng!')
            }

        } else {
            console.log('AAN');
            setShowNolginDialog(true);
        }
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                //pauseOnFocusLoss
                draggable
                //pauseOnHover
                theme="light"
            />

            <Dialog open={showNolginDialog}>
                <div className={cx('dialog_nologin')}>
                    <h3 className={cx('dialog_nologin_message')}>Vui lòng đăng nhập để thêm vào giỏ hàng</h3>
                    <div onClick={handleToLoginPage} className={cx('btn_to_login')}>
                        <p>Trang đăng nhập</p>
                        <p>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </p>
                    </div>
                    <p onClick={handleCancelGoToLoginPage} className={cx('btn_cancel_logins')}>
                        Khi khác nhé
                    </p>
                </div>
            </Dialog>
            <div
                style={{
                    position: 'relative',
                    //maxWidth: '300px', // Đặt chiều rộng tối đa cho khung ảnh
                    width: type ? '24%' : '19.5%',
                    maxHeight: type ? '53vh' : '400px', // Đặt chiều cao tối đa cho khung ảnh
                    overflow: 'hidden', // Ẩn bất kỳ phần nào bị tràn ra ngoài
                    margin: type ? '0 0.5vh 1vh 0.5vh' : '0 0.2%',
                    //cursor: 'pointer',
                }}
                key={index}
                onTouchMove={(e) => {
                    console.log(e);
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.childNodes[0].childNodes[0].style.transform = 'scale(1.05)';
                    e.currentTarget.childNodes[0].childNodes[0].style.transition = 'all 0.5s';
                    e.currentTarget.childNodes[0].childNodes[1].childNodes[0].style.color = '#288ad6';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.childNodes[0].childNodes[0].style.transform = 'scale(1.0)';
                    e.currentTarget.childNodes[0].childNodes[0].style.transition = 'all 0.5s';
                    e.currentTarget.childNodes[0].childNodes[1].childNodes[0].style.color = '#000';
                }}
            >
                <div className={cx('item-gift')}>
                    <div className={cx('item-image')} onClick={() => navigate(`/product-detail/${item.product?._id}`)}>
                        <LazyLoadImage
                            effect="blur"
                            src={item.product?.images}
                            style={{
                                maxHeight: '200px', // Đặt chiều cao tối đa cho hình ảnh
                                width: 'auto', // Cho phép chiều rộng tự động theo tỷ lệ
                            }}
                        />
                    </div>

                    <div className={cx('item-content')}>
                        <div
                            className={cx('item-content__title')}
                            onClick={() => navigate(`/product-detail/${item.product?._id}`)}
                        >
                            {item.product?.title}
                        </div>
                        <div className={cx('item-content__info')}>
                            <div className={cx('item-content__price')}>
                                <div className={cx('price__new')}>
                                    {filter !== undefined && filter == false
                                        ? item.hide_price
                                        : numeral(item.product?.old_price * (1 - item.current_sale / 100)).format(
                                            '0,0',
                                        )}
                                    <span>đ</span>
                                </div>
                                <div className={cx('price__old')}>
                                    <div className={cx('price')}>
                                        {numeral(item.product?.old_price).format('0,0') + 'đ'}
                                    </div>
                                    <div className={cx('sale')}>
                                        {filter !== undefined && filter == false
                                            ? `-${changeNumSale(item.current_sale)}%`
                                            : `-${item.current_sale}%`}
                                    </div>
                                </div>
                            </div>
                            {filter !== undefined && filter == true && item.sold_sale !== item.num_sale && (
                                <div
                                    className={cx(`item-content__gettocart`)}
                                    onClick={() => {
                                        handleAddToCart(item.product);
                                    }}
                                >
                                    <ShoppingCartOutlined style={{ fontSize: '2rem', color: 'green' }} />
                                </div>
                            )}
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Progress
                                percent={(Math.floor(item.sold_sale) * 100) / item.num_sale}
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
                                    fontSize: '1.5rem',
                                    width: '100%',
                                    textAlign: 'center',
                                }}
                            >
                                {`Đã bán ${item.sold_sale}/${item.num_sale}`}
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        position: 'absolute',
                        top: '0px', // Điều chỉnh vị trí top theo ý muốn
                        right: '0px', // Điều chỉnh vị trí right theo ý muốn
                    }}
                >
                    <StarRoundedIcon sx={{ fontSize: 70, color: '#ffe818' }}></StarRoundedIcon>
                    <span
                        style={{
                            color: 'black',
                            position: 'absolute',
                            fontSize: '1.5rem',
                            top: '20px', // Điều chỉnh vị trí top theo ý muốn
                            right: '21px', // Điều chỉnh vị trí right theo ý muốn
                            fontWeight: 'bold',
                            textShadow: '0px 0px 5px #fff',
                            textAlign: 'center',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {item.product?.rate}
                    </span>
                </div>
                {item.sold_sale > 0 && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '320px', // Điều chỉnh vị trí top theo ý muốn
                            right: '190px', // Điều chỉnh vị trí right theo ý muốn
                        }}
                    >
                        <Image
                            // Ẩn preview của ảnh
                            preview={false}
                            height={70}
                            src={images.fire_sale}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export default Item;
