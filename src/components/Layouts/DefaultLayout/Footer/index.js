import className from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import styles from './Footer.module.scss';
import images from '../../../../assets/images';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';

const cx = className.bind(styles);
function Footer() {
    const navigate = useNavigate();
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')} style={{
                backgroundImage: "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)"
            }}>
                <div className={cx('content_left')}>
                    <LazyLoadImage src={images.logo} />
                    <div className={cx('footer_address')}>
                        <div className={cx('address_description')}>
                            <p className='text-[14px] text-[#333] font-[500]'>
                                TA Bookstore nhận đặt hàng trực tuyến và giao hàng tận nơi. KHÔNG hỗ trợ đặt mua và nhận
                                hàng trực tiếp tại văn phòng cũng như tất cả Hệ Thống TA Bookstore trên toàn quốc.
                            </p>
                        </div>
                    </div>
                </div>

                <div className={cx('content_right')}>
                    <div className={cx('grid')}>
                        <ul className={cx('row', 'footer_list')}>
                            <li className={cx('col l-3 m-4 c-12', 'footer_item')}>
                                <h3 className="font-[800]">DỊCH VỤ</h3>
                                <ul className={cx('footer_list_child')}>
                                    <li className={cx('footer_item_child')}>Đăng nhập/Tạo mới tài khoản</li>
                                    <a href="/terms-of-service" className={cx('footer_item_child')}>
                                        Điều khoản sử dụng
                                    </a>
                                    <li className={cx('footer_item_child')}>Chính sách bảo mật thông tin cá nhân</li>
                                    <li
                                        className={cx('footer_item_child')}
                                        onClick={() => {
                                            navigate('/terms-of-service');
                                        }}
                                    >
                                        Chính sách quyền riêng tư
                                    </li>
                                    <li className={cx('footer_item_child')}>Chính sách bảo mật thanh toán</li>

                                </ul>
                            </li>

                            <li className={cx('col l-4 m-4 c-12', 'footer_item')}>
                                <h3 className="font-[800]">HỖ TRỢ</h3>
                                <ul className={cx('footer_list_child')}>
                                    <li className={cx('footer_item_child')}>Chính sách đổi - trả - hoàn tiền</li>
                                    <li className={cx('footer_item_child')}>Chính sách bảo hành - bồi hoàn</li>
                                    <li className={cx('footer_item_child')}>Chính sách vận chuyển</li>
                                    <li className={cx('footer_item_child')}>Chính sách khách sỉ</li>
                                    <li className={cx('footer_item_child')}>Phương thức thanh toán và xuất HĐ</li>
                                </ul>
                            </li>

                            <li className={cx('col l-4 m-4 c-12', 'footer_item')}>
                                <h3 className="font-[800]">TÀI KHOẢN CỦA TÔI</h3>
                                <ul className={cx('footer_list_child')}>
                                    <li className={cx('footer_item_child')}>Điều khoản sử dụng</li>
                                    <li className={cx('footer_item_child')}>Thay đổi địa chỉ khách hàng</li>
                                    <li className={cx('footer_item_child')}>Chi tiết tài khoản</li>
                                    <li className={cx('footer_item_child')}>Lịch sử mua hàng</li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    <div className={cx('grid', 'footer_contact')}>
                        <h3 className="font-[800]">LIÊN HỆ</h3>
                        <ul className={cx('row', 'contact_list')}>
                            <li className={cx('col l-4 m-4 c-12', 'contact_item')}>
                                <p className={cx('contact_icon')}>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                                </p>
                                Số 1 Võ Văn Ngân, Linh Chiểu, TP. Thủ Đức, TP. HCM
                            </li>

                            <li className={cx('col l-4 m-4 c-12', 'contact_item')}>
                                <p className={cx('contact_icon')}>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </p>
                                bookstore.ta.group@gmail.com
                            </li>

                            <li className={cx('col l-4 m-4 c-12', 'contact_item')}>
                                <p className={cx('contact_icon')}>
                                    <FontAwesomeIcon icon={faPhone} />
                                </p>
                                0877404581
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
