import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog } from '@mui/material';
import { useStore } from '../../stores/hooks';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import localstorage from '../../localstorage';
import { faCircleCheck, faTimesCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import styles from './OrderSuccess.module.scss';

const cx = classNames.bind(styles);
function OrderSuccess() {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [state, dispatch] = useStore();
    const [option, setOption] = useState('Tất cả đơn hàng');
    const [iconInfo, setIconInfo] = useState({
        type: faInfoCircle,
        color: '#6f88ec',
    });

    const [status_content, setStatus_content] = useState('Đơn hàng không tồn tại hoặc đã được thanh toán trước đó!');
    const statusVNPayCheckout = `statusVNPayCheckout_${state.user._id}`;
    const responseCode = [
        {
            code: 'E07',
            content: 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
        },
        {
            code: 'E09',
            content:
                'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
        },
        {
            code: 'E10',
            content: 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
        },
        {
            code: 'E11',
            content:
                'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
        },
        { code: 'E12', content: 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.' },
        {
            code: 'E13',
            content:
                'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
        },
        { code: 'E24', content: 'Giao dịch không thành công do: Khách hàng hủy giao dịch' },
        {
            code: 'E51',
            content: 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
        },
        {
            code: 'E65',
            content: 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
        },
        { code: 'E75', content: 'Ngân hàng thanh toán đang bảo trì.' },
        {
            code: 'E79',
            content:
                'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
        },
        {
            code: 'E99',
            content:
                'Hệ thống đã xảy ra lỗi trong quá trình lưu đơn hàng, tiền sẽ được hoàn trả lại trong 7 ngày làm việc. Quý khách vui lòng thử thanh toán lại sau!',
        },
    ];
    localStorage.removeItem('item_order_checkout');
    localStorage.removeItem(statusVNPayCheckout);
    const is_order_success_page = localStorage.getItem('is_order_success_page')
        ? JSON.parse(localStorage.getItem('is_order_success_page'))
        : false;
    const curent_checkoutid = localStorage.getItem('curent_checkoutid')
        ? JSON.parse(localStorage.getItem('curent_checkoutid'))
        : {};

        // const addUserFlashSale = (data) => {
        //     setShowProgress(true);
        //     fetch(`${api}/orders/insert`, {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(data),
        //     })
        //         .then((response) => response.json())
        //         .then((result) => {
        //             if (result.status == 'OK') {
        //                 const order = result.data;
        //                 let item_order_checkout = [];
        //                 if (type == 'vnp') {
        //                     item_order_checkout = localStorage.getItem('item_order_checkout')
        //                         ? JSON.parse(localStorage.getItem('item_order_checkout'))
        //                         : [];
        //                 } else if (type == 'cash') {
        //                     item_order_checkout = listCheckouts;
        //                 }
        //                 const orderItems = item_order_checkout.map((item) => {
        //                     return {
        //                         quantity: item.quantity,
        //                         price: item.product.price * item.quantity,
        //                         order: result.data._id,
        //                         product: item.product._id,
        //                     };
        //                 });
        //                 if (item_order_checkout.length) {
        //                     orderItems.forEach((orderItem) => {
        //                         fetch(`${api}/orderitems/insert`, {
        //                             method: 'POST',
        //                             headers: { 'Content-Type': 'application/json' },
        //                             body: JSON.stringify(orderItem),
        //                         })
        //                             .then((response) => response.json())
        //                             .then((result) => {
        //                                 if (result.status == 'OK') {
        //                                     const carts = localStorage.getItem(namecart)
        //                                         ? JSON.parse(localStorage.getItem(namecart))
        //                                         : [];
        //                                     const newCarts = {
        //                                         id: state.user._id,
        //                                         items: carts.items.filter((cart) => cart.id !== orderItem.product),
        //                                     };
        //                                     localstorage.set(namecart, newCarts);
        //                                     setShowProgress(false);
        //                                     setOrder(order);
        //                                 }
        //                             })
        //                             .catch((err) => {
        //                                 console.log(err);
        //                             });
        //                     });
        //                 } else {
        //                     setShowProgress(false);
        //                     setOrder(order);
        //                 }
        //                 const title = "Thông báo đơn hàng"
        //                 const description = `${state.user.fullName} vừa đặt đơn hàng mới. Chuẩn bị hàng thôi!`
        //                 const image = orderImages
        //                 const url = `${appPath}/admin/orders`
    
        //                 SendNotification("admin", {
        //                     title,
        //                     description,
        //                     image,
        //                     url
        //                 })
        //             } else {
        //                 setShowProgress(false);
        //                 navigate(`/order-success/err-E99`);
        //             }
        //         })
        //         .catch((err) => { });
        // };
    

    useEffect(() => {
        if (curent_checkoutid === orderId) {
            //addUserFlashSale();
            setStatus_content('Thanh toán đơn hàng thành công!');
            document.title = 'Thanh toán thành công';
            setOption('Chi tiết đơn hàng');
            setIconInfo({
                type: faCircleCheck,
                color: '#41e1a4',
            });
            localStorage.removeItem('curent_checkoutid');
        } else if (!is_order_success_page) {
            localstorage.set('is_order_success_page', true);
            responseCode.forEach((item) => {
                if (orderId === 'err-' + item.code) {
                    document.title = 'Thanh toán thất bại';
                    setOption('Thanh toán lại');
                    setIconInfo({
                        type: faTimesCircle,
                        color: '#e15b76',
                    });
                    setStatus_content(item.content);
                }
            });
        }
    }, []);

    const handleBackToCart = () => {
        navigate('/cart');
    };

    const handleOption = () => {
        if (option.includes('Chi tiết đơn hàng')) navigate(`/account/order/detail/${orderId}`);
        else if (option.includes('Tất cả đơn hàng')) navigate('/account/1');
        else navigate(`/checkout`);
    };

    return (
        <div>
            <Dialog open={true}>
                <div className={cx('dialog')}>
                    <div className={cx('heading')}>
                        <FontAwesomeIcon
                            icon={iconInfo.type}
                            style={{
                                height: '140px',
                                color: iconInfo.color,
                            }}
                        />
                    </div>
                    <p className={cx('dialog_notice')}>{status_content}</p>
                    <ul className={cx('btns')}>
                        <li className={cx('btn', 'back_to_cart')} onClick={handleBackToCart}>
                            Quay lại giỏ hàng
                        </li>
                        <li className={cx('btn', 'order_detail')} onClick={handleOption}>
                            {option}
                        </li>
                    </ul>
                </div>
            </Dialog>
        </div>
    );
}

export default OrderSuccess;
