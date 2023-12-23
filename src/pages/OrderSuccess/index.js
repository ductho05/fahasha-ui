import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog } from '@mui/material';
import { useStore } from '../../stores/hooks';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import localstorage from '../../localstorage';
import { faCircleCheck, faTimesCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { api, appPath, orderImages } from '../../constants';
import styles from './OrderSuccess.module.scss';

const cx = classNames.bind(styles);
function OrderSuccess() {
    const navigate = useNavigate();
    const [productNotEnough, setProductNotEnough] = useState([]);
    const { orderId } = useParams();
    const [state, dispatch] = useStore();
    const [option, setOption] = useState('Tất cả đơn hàng');
    const [iconInfo, setIconInfo] = useState({
        type: faInfoCircle,
        color: '#6f88ec',
    });
    const namecart = `myCart_${state.user._id}`;
    console.log('productNotEnough', productNotEnough);

    const [status_content, setStatus_content] = useState('Đơn hàng không tồn tại hoặc đã được thanh toán trước đó!');
    const statusVNPayCheckout = `statusVNPayCheckout_${state.user._id}`;
    const responseCode = [
        {
            code: 'E07',
            content: 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
        },
        {
            code: 'E08',
            content: `Chúng tôi xin lỗi vì đơn hàng của bạn tồn tại sản phẩm có số lượng vượt quá kho hàng. Có lẽ 1 người nào đó đã nhanh tay hơn, xin quý khách vui lòng thực hiện lại giao dịch sau khi chúng tôi nhập hàng.`,
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
        {
            code: 'E14',
            content: `Chúng tôi xin lỗi vì đơn hàng của bạn tồn tại sản phẩm có số lượng vượt quá giới hạn của chương trình FlashSale. Có lẽ 1 người nào đó đã nhanh tay hơn bạn, xin quý khách vui lòng thanh toán lại.`,
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
    localStorage.removeItem('listFlash');
    localStorage.removeItem('listCkeckOut');
    localStorage.removeItem(statusVNPayCheckout);
    const is_order_success_page = localStorage.getItem('is_order_success_page')
        ? JSON.parse(localStorage.getItem('is_order_success_page'))
        : false;
    const curent_checkoutid = localStorage.getItem('curent_checkoutid')
        ? JSON.parse(localStorage.getItem('curent_checkoutid'))
        : {};

    const productNot = localStorage.getItem('dataNotQuanlity')
        ? JSON.parse(localStorage.getItem('dataNotQuanlity'))
        : [];
    console.log('productNot', productNot);
    useEffect(() => {
        if (productNot.length) {
            productNot.map((item) => {
                console.log('2121asa', item);
                fetch(`${api}/${orderId === 'err-E08' ? `products/id` : `flashsales`}/${item}`)
                    .then((response) => response.json())
                    .then((result) => {
                        if (result.status == 'OK') {
                            const product = result.data;
                            console.log('afhadbsfsh', product);
                            setProductNotEnough((productNotEnough) => [...productNotEnough, product]);
                            localStorage.removeItem('dataNotQuanlity');
                        }
                    })
                    .catch((err) => console.log(err));
            });
        }
    }, []);

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

    // Update số lượng của sản phẩm không đủ trong giỏ hàng lên local
    const updateCheckout = () => {
        // console.log('deleteData', deleteData);
        var myCart = JSON.parse(localStorage.getItem(namecart));
        if (orderId === 'err-E08') {
            productNotEnough.map((item) => {
                myCart.items.map((item2) => {
                    if (item._id === item2.id) {
                        item2.count = item.quantity;
                    }
                });
            });
        } else if (orderId === 'err-E14') {
            productNotEnough.map((item) => {
                myCart.items.map((item2) => {
                    if (item.product._id === item2.id) {
                        item2.count = item.num_sale - item.sold_sale;
                    }
                });
            });
        }

        console.log('1212dsa', myCart);

        localStorage.setItem(namecart, JSON.stringify(myCart));
    };

    const handleOption = () => {
        if (orderId === 'err-E08') {
            console.log('productNotEno2121ugh', productNotEnough);
            updateCheckout();
            navigate(`/checkout`);
        } else if (orderId === 'err-E14') {
            console.log('productNotEno2121ugh', productNotEnough);
            updateCheckout();
            navigate(`/checkout`);
        } else if (option.includes('Chi tiết đơn hàng')) navigate(`/account/order/detail/${orderId}`);
        else if (option.includes('Tất cả đơn hàng')) navigate('/account/1');
        else navigate(`/checkout`);
    };

    return (
        <div className="p-[10px] md:p-[20px] lg:p-[40px]">
            <div
                className={cx(
                    'dialog',
                    'shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] mb-[20px] rounded-[12px] overflow-hidden',
                )}
            >
                <div className={cx('heading')}>
                    <FontAwesomeIcon
                        icon={iconInfo.type}
                        style={{
                            height: '140px',
                            color: iconInfo.color,
                            margin: '0 0 3% 0',
                        }}
                    />
                </div>
                <p className={cx('dialog_notice')}>
                    {status_content}
                    {(orderId === 'err-E14' || orderId === 'err-E08') && (
                        <>
                            <p style={{ textAlign: 'left' }}>Sản phẩm không đủ số lượng:</p>{' '}
                            {productNotEnough.map((item, index) => (
                                <li
                                    style={{
                                        color: 'red',
                                        textAlign: 'left',
                                    }}
                                >
                                    {orderId === 'err-E08' ? item.title : item.product.title} -{' '}
                                    {orderId === 'err-E08'
                                        ? `Có sẵn: ` + item.quantity
                                        : `Còn lại: ` + (item.num_sale - item.sold_sale)}
                                </li>
                            ))}
                            <p style={{ textAlign: 'left' }}>
                                Nhấn <strong>[Thanh toán lại]</strong> để thanh toán lại với số lượng{' '}
                                {orderId === 'err-E08' ? `có sẵn` : `còn lại của chương trình`}{' '}
                            </p>{' '}
                        </>
                    )}
                </p>
                <ul className={cx('btns')}>
                    <li className={cx('btn', 'back_to_cart')} onClick={handleBackToCart}>
                        Quay lại giỏ hàng
                    </li>
                    <li className={cx('btn', 'order_detail')} onClick={handleOption}>
                        {option}
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default OrderSuccess;
