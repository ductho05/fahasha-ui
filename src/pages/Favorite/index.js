import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import numeral from 'numeral';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './Favorite.module.scss';
import { api, appPath, cancelOrderImage, CHOXACNHAN, DAHUY } from '../../constants';
import { Button, Popconfirm, message } from 'antd';
import { faMinus, faPlus, faShareNodes, faStar, faCartShopping, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import SendNotification from '../../service/SendNotification';
import { useStore } from '../../stores/hooks';
import Skeleton from '@mui/material/Skeleton';
import { Backdrop, CircularProgress } from '@mui/material';

import { toast, ToastContainer } from 'react-toastify';
import { getAuthInstance } from '../../utils/axiosConfig';
import axios from 'axios';
import ClearIcon from '@mui/icons-material/Clear';
import localstorge from '../../stores/localstorge';

const cx = classNames.bind(styles);
function Favorite() {
    const authInstance = getAuthInstance();

    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const [state, dispach] = useStore();
    const [loading, setLoading] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const [favoriteList, setFavoriteList] = useState([]);

    useEffect(() => {
        document.title = 'Sản phẩm yêu thích';
    }, []);

    useEffect(() => {
        setLoading(true);
        authInstance
            .get(`/favorites?userid=${state.user._id}`)
            .then((result) => {
                if (result.data.status == 'OK') {
                    setFavoriteList(result.data.data);
                    //console.log('result.data.data', result.data.data);
                }
                setLoading(false);
            })
            .catch((err) => setLoading(false));
    }, []);

    console.log('favoriteList', favoriteList);

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

    const handleAddToCart = (id) => {
        //if (Object.keys(state.user).length > 0) {
        addCart(1, id);
        toast.success('Đã thêm sản phẩm vào giỏ hàng');
        //setIsShowDialog(!isShowDialog);
        //} else {
        // setShowNolginDialog(true);
        // }
    };

    // them/ xoa yeu thích
    const deleteFavorite = (productId) => {
        setLoading(true);
        authInstance
            .post(`/favorites/delete`, {
                userid: state.user._id,
                productid: productId,
            })
            .then((result) => {
                console.log('result', result);
                if (result.data.status == 'OK') {
                    console.log('da xoa');
                    setFavoriteList(favoriteList.filter((item) => item.productid._id != productId));
                    toast.success('Đã xóa sản phẩm khỏi danh sách yêu thích');
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log('11113', err);
                // setIsClick(false);
                // setIsFavorite(false);
                //  setShowNolginDialog(true);
            });
    };

    const FameFavorite = ({ item }) => {
        const product = item.productid;
        console.log('product21', product);
        return (
            <div className={cx('product_item')}>
                <div
                    className={cx('thumbnail')}
                    onClick={() => {
                        navigate(`/product-detail/${product._id}`);
                    }}
                >
                    <img src={product?.images} alt="Lỗi load ảnh" />
                </div>
                <div className={cx('product_body')}>
                    <p className={cx('product_name')}>{product?.title}</p>
                    <p className={cx('author')}>
                        Tác giả: {product?.author ? product?.author : '[Không có thông tin]'}
                    </p>
                    <p className={cx('quantity')}>Số lượng: {product?.quantity}</p>
                </div>
                <div className={cx('price')}>
                    <div
                        style={{}}
                        onClick={() => {
                            deleteFavorite(product?._id);
                        }}
                    >
                        <ClearIcon
                            // lớn hơn
                            style={{
                                fontSize: '2.5rem',
                                color: '#ff9f00',
                                cursor: 'pointer',
                            }}
                        />
                    </div>
                    <p classNames={cx('old_price')}>{numeral(product?.old_price).format('0,0')}đ</p>
                    <p classNames={cx('discount')}>
                        {product?.old_price > product?.price ? '-' : '+'}
                        {Math.ceil(((product?.old_price - product?.price) * 100) / product?.old_price)}%
                    </p>
                    <p
                        classNames={cx('new_price')}
                        style={{
                            color: product?.old_price > product?.price ? 'red' : 'green',
                            fontSize: '1.6rem',
                            fontWeight: 'bold',
                        }}
                    >
                        {numeral(product?.price).format('0,0')}đ
                    </p>
                    <div
                        style={{
                            backgroundColor: '#ff9f00',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                        }}
                        // disabled={product?.quantity == 0}
                        onClick={() => {
                            handleAddToCart(product?._id);
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faCartShopping}
                            style={{
                                marginRight: '5px',
                            }}
                        />
                        Thêm vào giỏ
                    </div>
                </div>
            </div>
        );
    };

    // useEffect(() => {
    //     setLoading(true);
    //     authInstance
    //         .get(`/orderitems/order?id=${orderId}`)
    //         .then((result) => {
    //             if (result.data.status == 'OK') {
    //                 setOrderItems(result.data.data);
    //             }
    //             setLoading(false);
    //         })
    //         .catch((err) => setLoading(false));
    // }, [updateSuccess]);

    // const handleBack = () => {
    //     navigate(`/account/${1}`);
    // };

    // const handleUpdate = () => {
    //     setLoadingUpdate(true);
    //     authInstance
    //         .put(`/orders/update/${order._id}`, {
    //             status: DAHUY,
    //         })
    //         .then((result) => {
    //             if (result.data.status === 'OK') {
    //                 orderItems.forEach(async (item) => {
    //                     await authInstance
    //                         .put(`/products/update/${item.product._id}`, {
    //                             quantity: item.quantity + item.product.quantity,
    //                             sold: item.product.sold - item.quantity,
    //                         })
    //                         .catch((error) => {
    //                             console.error(error);
    //                         });
    //                 });

    //                 const title = 'Thông báo đơn hàng';
    //                 const description = `${state.user.fullName} vừa hủy đơn hàng`;
    //                 const image = cancelOrderImage;
    //                 const url = `${appPath}/admin/orders`;
    //                 message.success('Đã hủy đơn hàng');

    //                 axios
    //                     .post(
    //                         `${api}/webpush/send`,
    //                         {
    //                             filter: 'admin',
    //                             notification: {
    //                                 title,
    //                                 description,
    //                                 image,
    //                                 url,
    //                             },
    //                         },
    //                         {
    //                             headers: {
    //                                 Authorization: `Bearer ${localstorge.get()}`,
    //                             },
    //                         },
    //                     )
    //                     .then((result) => {
    //                         if (result.data.status === 'OK') {
    //                             state.socket.emit('send-notification', {
    //                                 type: 'admin',
    //                                 userId: null,
    //                                 notification: {
    //                                     title,
    //                                     description,
    //                                     image: cancelOrderImage,
    //                                     url,
    //                                     user: null,
    //                                 },
    //                             });
    //                         }
    //                     })
    //                     .catch((err) => {
    //                         console.error(err);
    //                     });
    //                 setUpdateSuccess((prev) => !prev);
    //             } else {
    //                 message.error('Lỗi hủy đơn hàng');
    //             }
    //             setLoadingUpdate(false);
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //             message.error('Lỗi hủy đơn hàng');
    //             setLoadingUpdate(false);
    //         });
    // };

    return (
        <div className="p-[10px] md:p-[20px] lg:p-[40px]">
            <Backdrop sx={{ color: '#fff', zIndex: 10000 }} open={loadingUpdate}>
                <CircularProgress color="error" />
            </Backdrop>
            {loading ? (
                <Loading num={favoriteList.length} />
            ) : (
                <div className={cx('wrapper')}>
                    <div className={cx('heading')}>Sản phẩm yêu thích</div>
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
            <div className={cx('heading')}>Sản phẩm yêu thích</div>
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

export default Favorite;
