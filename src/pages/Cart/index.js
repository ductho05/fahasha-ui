import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import Button from '../../components/Button';
import localstorage from '../../localstorage';
import { useStore } from '../../stores/hooks';
import numeral from 'numeral';

const cx = classNames.bind(styles);
function Cart() {
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [state, dispatch] = useStore();
    const namecart = `myCart_${state.user._id}`;
    const [listCarts, setListCarts] = useState(localstorage.get(namecart));
    const [listCheck, setListCheck] = useState(() => new Array(localstorage.get(namecart).length).fill(false));
    const [listCheckouts, setListCheckouts] = useState([]);

    const toggleCheck = () => {
        setIsCheckAll(!isCheckAll);
    };

    useEffect(() => {
        document.title = 'Giỏ hàng';
    }, []);

    useEffect(() => {
        if (isCheckAll) {
            let total = listCarts.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
            let newListCheck = listCheck.map(() => true);
            setListCheck(newListCheck);
            setTotalPrice(total);
            setListCheckouts(listCarts);
        } else {
            let newListCheck = listCheck.map(() => false);
            setListCheck(newListCheck);
            setTotalPrice(0);
            setListCheckouts([]);
        }
    }, [isCheckAll]);

    const handleMinus = (cart, index) => {
        if (cart.quantity > 1) {
            cart.quantity -= 1;
        } else {
            cart.quantity = 1;
        }
        setListCarts((prev) => {
            prev[index].quantity = cart.quantity;
            localstorage.set('carts', prev);
            return [...prev];
        });
        setTotalPrice((prev) => {
            let newTotalPrice = prev;
            if (listCheck[index]) {
                newTotalPrice -= cart.product.price;
            }

            return newTotalPrice;
        });
    };

    const handlePlus = (cart, index) => {
        cart.quantity += 1;
        setListCarts((prev) => {
            prev[index].quantity = cart.quantity;
            localstorage.set('carts', prev);
            return [...prev];
        });
        setTotalPrice((prev) => {
            let newTotalPrice = prev;
            if (listCheck[index]) {
                newTotalPrice += cart.product.price;
            }

            return newTotalPrice;
        });
    };

    const handleCheckItem = (e, cart, index) => {
        let newListCheck = [...listCheck];
        newListCheck[index] = !newListCheck[index];
        let total_price = 0;
        newListCheck.forEach((curr, index) => {
            total_price += curr ? listCarts[index].quantity * listCarts[index].product.price : 0;
        });
        setTotalPrice(total_price);
        setListCheck(newListCheck);
        if (newListCheck[index]) {
            listCheckouts.push(listCarts[index]);
        } else {
            listCheckouts.splice(index, 1);
        }
        setListCheckouts((prev) => {
            return [...prev];
        });
    };

    const handleDeleteItem = (index) => {
        listCarts.splice(index, 1);
        setListCarts((prev) => {
            localstorage.set('carts', prev);
            return [...prev];
        });
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('top')}>
                    Giỏ hàng
                    <p>({listCarts.length} sản phẩm)</p>
                </div>
                <div className={listCarts.length > 0 ? cx('cart_content') : cx('hidden')}>
                    <div className={cx('left')}>
                        <div className={cx('heading')}>
                            <div className={cx('choose_all')}>
                                <input type="checkbox" checked={isCheckAll} onChange={toggleCheck} />
                                <p>Chọn tất cả ({localstorage.get('carts').length} sản phẩm) </p>
                            </div>
                            <p className={cx('hide-on-mobile-tablet')}>Số lượng</p>
                            <p className={cx('hide-on-mobile-tablet')}>Thành tiền</p>
                            <p></p>
                        </div>

                        <ul className={cx('product_list')}>
                            {localstorage.get('carts').map((cart, index) => (
                                <li key={index} className={cx('product_item')}>
                                    <p className={cx('check')}>
                                        <input
                                            type="checkbox"
                                            checked={listCheck[index]}
                                            onChange={(e) => handleCheckItem(e, cart, index)}
                                        />
                                    </p>
                                    <img src={cart.product.images} />
                                    <a href="#" className={cx('product_info')}>
                                        <p className={cx('name')}>{cart.product.title}</p>
                                        <div className={cx('product_price')}>
                                            <p className={cx('price')}>
                                                {numeral(cart.product.price).format('0,00[.]00 VNĐ')} đ
                                            </p>
                                            <p
                                                className={
                                                    cart.product.price === cart.product.old_price
                                                        ? cx('hidden')
                                                        : cx('old_price')
                                                }
                                            >
                                                {numeral(cart.product.old_price).format('0,0[.]00 VNĐ')} đ
                                            </p>
                                        </div>
                                    </a>
                                    <div className={cx('quantity')}>
                                        <div className={cx('quantity_btn')}>
                                            <p
                                                onClick={() => handleMinus(cart, index)}
                                                className={cx('btn_minus')}
                                                disabled
                                            >
                                                <FontAwesomeIcon icon={faMinus} />
                                            </p>
                                            <input
                                                type="number"
                                                value={cart.quantity}
                                                className={cx('quantity_num')}
                                                disabled
                                            />
                                            <p
                                                onClick={() => handlePlus(cart, index)}
                                                className={cx('btn_plus')}
                                                disabled
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </p>
                                        </div>
                                    </div>
                                    <p className={cx('total_price_item', 'hide-on-mobile-tablet')}>
                                        {numeral(cart.quantity * cart.product.price).format('0,0[.]00 VNĐ')} đ
                                    </p>
                                    <p className={cx('btn_delete')} onClick={() => handleDeleteItem(index)}>
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={cx('right', 'hide-on-mobile-tablet')}>
                        <div className={cx('total')}>
                            <p>Thành tiền</p>
                            <p className={cx('value_price')}>{numeral(totalPrice).format('0,0[.]00 VNĐ')} đ</p>
                        </div>

                        <div className={cx('total_vat')}>
                            <p>Tổng Số Tiền (gồm VAT)</p>
                            <p className={cx('value_vat_price')}>{numeral(totalPrice).format('0,0[.]00 VNĐ')} đ</p>
                        </div>
                        <Link to="/checkout" state={{ listCheckouts: listCheckouts }} className={cx('btn_check_out')}>
                            <Button primary disabled={totalPrice <= 0}>
                                THANH TOÁN
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className={cx('payment_info_on_mobile_tablet', 'hide-on-pc')}>
                    <div className={cx('total_payment_info_on_mobile_tablet')}>
                        <p>Tổng cộng</p>
                        <p className={cx('total_price')}>{numeral(totalPrice).format('0,0[.]00 VNĐ')} đ</p>
                    </div>
                    <Link
                        to="/checkout"
                        state={{ listCheckouts: listCheckouts }}
                        className={
                            totalPrice > 0
                                ? cx('btn_checkout_on_mobile_tablet')
                                : cx('btn_checkout_on_mobile_tablet', 'disable')
                        }
                    >
                        Thanh toán
                        <p className={cx('btn_icon')}>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </p>
                    </Link>
                </div>
                <div className={listCarts.length === 0 ? cx('no_product_in_cart') : cx('hidden')}>
                    <img
                        src="https://cdn0.fahasa.com/skin//frontend/ma_vanese/fahasa/images/checkout_cart/ico_emptycart.svg"
                        alt="không có hình"
                    />
                    <p>Chưa có sản phẩm trong giỏ hàng của bạn</p>
                    <Link to="/" className={cx('btn_shopping_now')}>
                        <Button primary>MUA SẮM NGAY</Button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Cart;
