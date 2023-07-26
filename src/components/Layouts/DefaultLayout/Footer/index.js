import className from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import styles from './Footer.module.scss'
import images from '../../../../assets/images'

const cx = className.bind(styles)
function Footer() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading', 'hide-on-mobide', 'hide-on-small-tablet')}>
                <p className={cx('heading_icon')}><FontAwesomeIcon icon={faEnvelope} /></p>
                <h5>ĐĂNG KÝ NHẬN BẢN TIN</h5>
                <div className={cx('heading_input')}>
                    <input placeholder='Nhập địa chỉ email của bạn' />
                    <button>Đăng ký</button>
                </div>
            </div>
            <div className={cx('content')}>
                <div className={cx('content_left')}>
                    <img src={images.logo} />
                    <div className={cx('footer_address')}>
                        <div className={cx('address_detail')}>
                            <p>Lầu 5, 387-389 Hai Bà Trưng Quận 3 TP HCM</p>
                            <p>Công Ty Cổ Phần Phát Hành Sách TP HCM - FAHASA</p>
                            <p>60 - 62 Lê Lợi, Quận 1, TP. HCM, Việt Nam</p>
                        </div>

                        <div className={cx('address_description')}>
                            <p>Fahasa.com nhận đặt hàng trực tuyến và giao hàng tận nơi. KHÔNG hỗ trợ đặt mua và nhận hàng trực tiếp tại văn phòng cũng như tất cả Hệ Thống Fahasa trên toàn quốc.</p>
                        </div>
                        <img className={cx('congthuong_icon')} src='https://cdn0.fahasa.com/media/wysiwyg/Logo-NCC/logo-bo-cong-thuong-da-thong-bao1.png' />
                        <ul className={cx('social_list')}>
                            <li className={cx('social_item')}>
                                <a href="#">
                                    <img title='Facebook' src='https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/footer/Facebook-on.png' />
                                </a>
                            </li>

                            <li className={cx('social_item')}>
                                <a href="#">
                                    <img title='Instagram' src='https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images//footer/Insta-on.png' />
                                </a>
                            </li>

                            <li className={cx('social_item')}>
                                <a href="#">
                                    <img title='Youtube' src='https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images//footer/Youtube-on.png' />
                                </a>
                            </li>

                            <li className={cx('social_item')}>
                                <a href="#">
                                    <img title='Tumblr' src='https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images//footer/tumblr-on.png' />
                                </a>
                            </li>

                            <li className={cx('social_item')}>
                                <a href="#">
                                    <img title='Twitter' src='https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images//footer/twitter-on.png' />
                                </a>
                            </li>

                            <li className={cx('social_item')}>
                                <a href="#">
                                    <img title='Pinterest' src='https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images//footer/pinterest-on.png' />
                                </a>
                            </li>
                        </ul>

                        <div className={cx('footer_download')}>
                            <a href='#' className={cx('gg_play')}>
                                <img src='https://cdn0.fahasa.com/media/wysiwyg/Logo-NCC/android1.png' />
                            </a>
                            <a href='#' className={cx('app_store')}>
                                <img src='https://cdn0.fahasa.com/media/wysiwyg/Logo-NCC/appstore1.png' />
                            </a>
                        </div>
                    </div>
                </div>

                <div className={cx('content_right')}>
                    <div className={cx('grid')}>
                        <ul className={cx('row', 'footer_list')}>
                            <li className={cx('col l-4 m-4 c-12', 'footer_item')}>
                                <h3>DỊCH VỤ</h3>
                                <ul className={cx('footer_list_child')}>
                                    <li className={cx('footer_item_child')}>
                                        Đăng nhập/Tạo mới tài khoản
                                    </li>
                                    <li className={cx('footer_item_child')}>
                                        Điều khoản sử dụng
                                    </li>
                                    <li className={cx('footer_item_child')}>
                                        Chính sách bảo mật thông tin cá nhân
                                    </li>
                                    <li className={cx('footer_item_child')}>
                                        Chính sách bảo mật thanh toán
                                    </li>
                                    <li className={cx('footer_item_child')}>
                                        Giới thiệu Fahasa
                                    </li>
                                </ul>
                            </li>

                            <li className={cx('col l-4 m-4 c-12', 'footer_item')}>
                                <h3>HỖ TRỢ</h3>
                                <ul className={cx('footer_list_child')}>
                                    <li className={cx('footer_item_child')}>
                                        Chính sách đổi - trả - hoàn tiền
                                    </li>
                                    <li className={cx('footer_item_child')}>
                                        Chính sách bảo hành - bồi hoàn
                                    </li>
                                    <li className={cx('footer_item_child')}>
                                        Chính sách vận chuyển
                                    </li>
                                    <li className={cx('footer_item_child')}>
                                        Chính sách khách sỉ
                                    </li>
                                    <li className={cx('footer_item_child')}>
                                        Phương thức thanh toán và xuất HĐ
                                    </li>
                                </ul>
                            </li>

                            <li className={cx('col l-4 m-4 c-12', 'footer_item')}>
                                <h3>TÀI KHOẢN CỦA TÔI</h3>
                                <ul className={cx('footer_list_child')}>
                                    <li className={cx('footer_item_child')}>
                                        Điều khoản sử dụng
                                    </li>
                                    <li className={cx('footer_item_child')}>
                                        Thay đổi địa chỉ khách hàng
                                    </li>
                                    <li className={cx('footer_item_child')}>
                                        Chi tiết tài khoản
                                    </li>
                                    <li className={cx('footer_item_child')}>
                                        Lịch sử mua hàng
                                    </li>

                                </ul>
                            </li>
                        </ul>
                    </div>

                    <div className={cx('grid', 'footer_contact')}>
                        <h3>LIÊN HỆ</h3>
                        <ul className={cx('row', 'contact_list')}>
                            <li className={cx('col l-4 m-4 c-12', 'contact_item')}>
                                <p className={cx('contact_icon')}>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                                </p>
                                60-62 Lê Lợi, Q.1, TP. HCM
                            </li>

                            <li className={cx('col l-4 m-4 c-12', 'contact_item')}>
                                <p className={cx('contact_icon')}>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </p>
                                cskh@fahasa.com.vn
                            </li>

                            <li className={cx('col l-4 m-4 c-12', 'contact_item')}>
                                <p className={cx('contact_icon')}>
                                    <FontAwesomeIcon icon={faPhone} />
                                </p>
                                1900636467
                            </li>

                        </ul>
                    </div>

                    <div className={cx('grid', 'service', 'hide-on-mobide', 'hide-on-small-tablet')}>
                        <ul className={cx('row', 'service_list')}>
                            <li className={cx('col l-2-4', 'service_item')}>
                                <img src='https://cdn0.fahasa.com/media/wysiwyg/Logo-NCC/vnpost1.png' />
                            </li>

                            <li className={cx('col l-2-4', 'service_item')}>
                                <img src='https://cdn0.fahasa.com/media/wysiwyg/Logo-NCC/ahamove_logo3.png' />
                            </li>

                            <li className={cx('col l-2-4', 'service_item')}>
                                <img src='https://cdn0.fahasa.com/media/wysiwyg/Logo-NCC/icon_giao_hang_nhanh1.png' />
                            </li>

                            <li className={cx('col l-2-4', 'service_item')}>
                                <img src='https://cdn0.fahasa.com/media/wysiwyg/Logo-NCC/icon_snappy1.png' />
                            </li>

                            <li className={cx('col l-2-4', 'service_item')}>
                                <img src='https://cdn0.fahasa.com/media/wysiwyg/Logo-NCC/Logo_ninjavan.png' />
                            </li>

                            <li className={cx('col l-2-4', 'service_item')}>
                                <img src='https://cdn0.fahasa.com/media//wysiwyg/Logo-NCC/vnpay_logo.png' />
                            </li>

                            <li className={cx('col l-2-4', 'service_item')}>
                                <img src='https://cdn0.fahasa.com/media//wysiwyg/Logo-NCC/ZaloPay-logo-130x83.png' />
                            </li>

                            <li className={cx('col l-2-4', 'service_item')}>
                                <img src='https://cdn0.fahasa.com/media//wysiwyg/Logo-NCC/momopay.png' />
                            </li>

                            <li className={cx('col l-2-4', 'service_item')}>
                                <img src='https://cdn0.fahasa.com/media//wysiwyg/Logo-NCC/shopeepay_logo.png' />
                            </li>

                            <li className={cx('col l-2-4', 'service_item')}>
                                <img src='https://cdn0.fahasa.com/media//wysiwyg/Logo-NCC/logo_moca_120.jpg' />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className={cx('footer_bot')}>
                <p>Đây là website clone lại từ nguồn </p>
                <a href="https://www.fahasa.com">FAHASHA</a>
                <p> chỉ dùng với mục đích học tập và học hỏi, không dùng với mục đích kinh doanh</p>
            </div>
        </div>
    )
}

export default Footer
