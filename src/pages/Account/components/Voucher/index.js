import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import numeral from 'numeral';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './Voucher.module.scss';
import { api, appPath, cancelOrderImage, CHOXACNHAN, DAHUY } from '../../../../constants';
import { Button, Popconfirm, message } from 'antd';
import { faMinus, faPlus, faShareNodes, faStar, faCartShopping, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import SendNotification from '../../../../service/SendNotification';
import { useStore } from '../../../../stores/hooks';
import Skeleton from '@mui/material/Skeleton';
import { Backdrop, CircularProgress } from '@mui/material';

import { toast, ToastContainer } from 'react-toastify';
import { getAuthInstance } from '../../../../utils/axiosConfig';
import axios from 'axios';
import ClearIcon from '@mui/icons-material/Clear';
import localstorge from '../../../../stores/localstorge';
import { useData } from '../../../../stores/DataContext';

const cx = classNames.bind(styles);
function Voucher() {
    const authInstance = getAuthInstance();

    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const [state, dispach] = useStore();
    const [loading, setLoading] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const { data, setData } = useData();
    const [favoriteList, setFavoriteList] = useState([]);

    // console.log('da vao day');
    useEffect(() => {
        document.title = 'Ví voucher';
    }, []);

    useEffect(() => {
        setLoading(true);
        authInstance
            .get(`/vouchers?user=${state.user._id}`)
            .then((result) => {
                if (result.data.status == 'OK') {
                    setFavoriteList(result.data.data);
                    console.log('resulta', result.data.data, state.user._id);
                }
                setLoading(false);
            })
            .catch((err) => setLoading(false));
    }, []);

    // console.log('favoriteList', favoriteList);

    const checkCart = (pops) => {
        const { cart, item } = pops;

        for (const element of cart.items) {
            if (element.id === item.id) {
                return true;
            }
        }
        return false;
    };

    const addCart = (num, productId) => {
        //const user = JSON.parse(localStorage.getItem('user'));
        const namecart = `myCart_${state.user._id}`;
        var myCart = JSON.parse(localStorage.getItem(namecart));

        const cart = {
            id: state.user._id,
            items: myCart ? myCart.items : [],
        };

        var item = {
            id: productId,
            count: num,
            isGetcheckout: 0,
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
    };

    // const handleAddToCart = (id) => {
    //     //if (Object.keys(state.user).length > 0) {
    //     addCart(1, id);
    //     toast.success('Đã thêm sản phẩm vào giỏ hàng');
    //     //setIsShowDialog(!isShowDialog);
    //     //} else {
    //     // setShowNolginDialog(true);
    //     // }
    // };

    // // them/ xoa yeu thích
    // const deleteFavorite = (productId) => {
    //     setLoading(true);
    //     authInstance
    //         .post(`/favorites/delete`, {
    //             userid: state.user._id,
    //             productid: productId,
    //         })
    //         .then((result) => {
    //             console.log('result', result);
    //             if (result.data.status == 'OK') {
    //                 console.log('da xoa');
    //                 setFavoriteList(favoriteList.filter((item) => item.productid._id != productId));
    //                 toast.success('Đã xóa sản phẩm khỏi danh sách yêu thích');
    //                 setLoading(false);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('11113', err);
    //             // setIsClick(false);
    //             // setIsFavorite(false);
    //             //  setShowNolginDialog(true);
    //         });
    // };

    const checkExpried = (expried) => {
        const today = new Date();
        const expriedDate = new Date(expried);
        if (today > expriedDate) {
            return false;
        } else {
            return true;
        }
    };

    const FameFavorite = ({ item }) => {
        const product = item;

        return (
            <div className={cx('product_item')}>
                <div
                    className={cx('thumbnail')}
                    style={{
                        backgroundColor: !product?.status || !checkExpried(product.expried) ? '#646464' : '#17a42c',
                    }}
                    onClick={() => {
                        //navigate(`/product-detail/${product._id}`);
                    }}
                >
                    <img
                        src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_coupongreen.svg?q=10402"
                        alt="Lỗi load ảnh"
                    />
                </div>
                <div
                    className={cx('content_voucher')}
                    style={{
                        backgroundColor: !product?.status || !checkExpried(product.expried) ? '#d0d0d0' : '#e1ffe5',
                    }}
                >
                    <div className={cx('product_body')}>
                        <p className={cx('product_name')}>Mã giảm giá: {product?.code}</p>
                        <p className={cx('author')}>
                            Trạng thái:{' '}
                            {!product?.status
                                ? 'Đã sử dụng'
                                : !checkExpried(product.expried)
                                ? 'Hết hạn'
                                : 'Chưa sử dụng'}
                        </p>
                        <p className={cx('author')}>
                            Ưu đãi giảm: {product?.discount ? product?.discount + '%' : '[Không có thông tin]'} cho đơn
                            hàng bất kỳ
                        </p>
                        <p className={cx('author')}>
                            Điều kiện: {product?.condition ? product?.condition : '[Không có thông tin]'}
                        </p>
                        <p className={cx('quantity')}>HSD đến hết ngày: {product?.expried}</p>
                    </div>
                    {product?.status && checkExpried(product.expried) && (
                        <div className={cx('get_voucher')}>
                            <div
                                className={cx('btn_get_voucher')}
                                onClick={() => {
                                    //handleAddToCart(product._id);
                                    // copy mã giảm giá
                                    navigator.clipboard.writeText(product?.code);
                                    //toast.success('Đã copy mã giảm giá');
                                    setData({
                                        ...data,
                                        item: product,
                                    });
                                    navigate(`/cart`);
                                }}
                            >
                                Sử dụng ngay
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // console.log('favoriteList1111', data);

    return (
        <div className="p-[10px] md:p-[20px] lg:p-[40px]">
            <Backdrop sx={{ color: '#fff', zIndex: 10000 }} open={loadingUpdate}>
                <CircularProgress color="error" />
            </Backdrop>
            {loading ? (
                <Loading num={favoriteList.length} />
            ) : (
                <div className={cx('wrapper')}>
                    <div className={cx('heading')}>Ví Voucher</div>
                    <div className={cx('body')}>
                        {favoriteList.map((item) => {
                            return <FameFavorite item={item} />;
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

const Loading = ({ num }) => {
    console.log('num', num);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>Ví voucher</div>
            <div className={cx('body')}>
                {[...Array(num > 0 ? num - 1 : 0)].map((item) => {
                    return (
                        <div className={cx('product_item')}>
                            <div className={cx('thumbnail')}>
                                <Skeleton variant="rectangular" width={150} height={150} />
                            </div>
                            <div className={cx('product_body')}>
                                <Skeleton variant="text" width={200} height={30} />
                                <Skeleton variant="text" width={200} height={30} />
                                <Skeleton variant="text" width={200} height={30} />
                            </div>
                            <div className={cx('price')}>
                                <Skeleton variant="text" width={200} height={30} />
                                <Skeleton variant="text" width={200} height={30} />
                                <Skeleton variant="text" width={200} height={30} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Voucher;
