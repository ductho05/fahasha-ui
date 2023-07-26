import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import classNames from "classnames/bind"
import numeral from 'numeral'
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import styles from './ProductDetail.module.scss'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus, faPlus, faShareNodes, faStar, faCartShopping, faPen, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons"
import Button from '../../components/Button'
import ProductFrame from "../../components/ProductFrame"
import ProductSlider from "../../components/ProductSlider"
import Modal from '../../components/Modal'
import RegisterLogin from '../../components/Forms/RegisterLogin'
import { api } from "../../constants"
import ReadMore from "../../components/ReadMore"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Dialog } from "@mui/material"
import localstorage from "../../localstorage"
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useStore } from "../../stores/hooks"
import EvaluateForm from "../../components/Forms/EvaluateForm"

const cx = classNames.bind(styles)

function ProductDetail() {
    const navigate = useNavigate()
    const location = useLocation()
    const { productId } = useParams()
    const [product, setProduct] = useState({})
    const [currentQuantity, setCurrentQuantity] = useState(1)
    const [isShowForm, setIsShowForm] = useState(false)
    const [isShowDialog, setIsShowDialog] = useState(false)
    const [indexForm, setIndexForm] = useState(0)
    const [productNews, setProductNews] = useState([])
    const [productRelated, setProductRelated] = useState([])
    const [evaluate, setEvaluate] = useState({})
    const [comments, setComments] = useState([])
    const rates = [1, 2, 3, 4, 5]
    const [state, dispatch] = useStore()
    const [showEvalDialog, setShowEvalDialog] = useState(false)
    const commentRef = useRef()
    const [resultEval, setResultEval] = useState()
    const [showNolginDialog, setShowNolginDialog] = useState(false)

    useEffect(() => {
        console.log(resultEval)
        if (resultEval == true) {
            toast.success('Đánh giá sản phẩm thành công !')
        } else if (resultEval == false) {
            toast.error('Đánh giá sản phẩm thất bại !')
        }
    }, [resultEval])

    useEffect(() => {
        document.title = 'Chi tiết sản phẩm'
    }, [])

    const fetchComments = (productId) => {
        fetch(`${api}/evaluates/product?_id=${productId}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => response.json())
            .then(result => {
                setComments(result.data)
            })
    }

    const fetchEvaluate = (productId) => {
        fetch(`${api}/evaluates/count?_id=${productId}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => response.json())
            .then(result => {
                setEvaluate(result.data)
            })
    }

    const fetchProductRelated = (p) => {
        fetch(`${api}/products/category?category=${p.categoryId._id}&limit=10`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => response.json())
            .then(result => {
                setProductRelated(prev => {
                    return [
                        {
                            title: p.categoryId.name || '',
                            products: result.data
                        }
                    ]
                })
            })
    }

    const fetchProduct = () => {
        fetch(`${api}/products/id/${productId}`)
            .then(response => response.json())
            .then(result => {
                setProduct(result.data)
                fetchProductRelated(result.data)
            })
    }

    const fetchProductNew = () => {
        fetch(`${api}/products/new/10`)
            .then(response => response.json())
            .then(result => {
                setProductNews(prev => {
                    return [
                        {
                            title: 'Sách mới nhất',
                            products: result.data
                        }
                    ]
                })
            })
    }

    useEffect(() => {
        setProduct({})
        fetchProduct()
        fetchProductNew()
        fetchEvaluate(productId)
    }, [productId])

    useEffect(() => {
        fetchComments(productId)
    }, [productId, resultEval])

    var lengthComments = comments.length
    var tempArray = Array(lengthComments).fill(1)
    const handleMinus = () => {
        setCurrentQuantity(prev => {
            return prev > 1 ? prev - 1 : 1
        })
    }
    const handlePlus = () => {
        setCurrentQuantity(prev => {
            return prev + 1
        })
    }

    let handleLogin = () => {
        setIndexForm(prev => {
            prev = 0
            return prev
        })
        setIsShowForm(true)
    }

    let handleRegister = () => {
        setIndexForm(prev => {
            prev = 1
            return prev
        })
        setIsShowForm(true)
    }

    const handleAddToCart = () => {
        if (Object.keys(state.user).length > 0) {
            let oldCats = localstorage.get('carts')
            let findIndex = oldCats.findIndex(p => p.product._id == product._id)
            console.log('index', findIndex)
            if (findIndex !== -1) {
                oldCats[findIndex].quantity += 1
                localstorage.set('carts', [
                    ...oldCats,
                ])
            } else {
                localstorage.set('carts', [
                    ...oldCats,
                    {
                        quantity: currentQuantity,
                        product: product
                    }
                ])
            }

            setIsShowDialog(!isShowDialog)
        } else {
            setShowNolginDialog(true)
        }
    }

    const handleBuyNow = () => {
        if (Object.keys(state.user).length > 0) {
            let oldCats = localstorage.get('carts')
            let findIndex = oldCats.findIndex(p => p.product._id == product._id)
            console.log('index', findIndex)
            if (findIndex !== -1) {
                oldCats[findIndex].quantity += 1
                localstorage.set('carts', [
                    ...oldCats,
                ])
            } else {
                localstorage.set('carts', [
                    ...oldCats,
                    {
                        quantity: currentQuantity,
                        product: product
                    }
                ])
            }

            navigate('/cart')
        } else {
            setShowNolginDialog(true)
        }
    }

    const handleCloseDialog = () => {
        setIsShowDialog(!isShowDialog)
    }

    const handleEval = () => {
        setShowEvalDialog(true)
    }

    useEffect(() => {
        if (location.pathname == `/product-detail/${productId}/comments-detail`) {
            commentRef?.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    })

    const handleToLoginPage = () => {
        navigate('/login-register')
    }

    const handleCancelGoToLoginPage = () => {
        setShowNolginDialog(false)
    }

    return (
        <>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <Dialog open={showNolginDialog}>
                <div className={cx('dialog_nologin')}>
                    <h3 className={cx('dialog_nologin_message')}>Vui lòng đăng nhập trước khi mua hàng</h3>
                    <div onClick={handleToLoginPage} className={cx('btn_to_login')}>
                        <p>Trang đăng nhập</p>
                        <p><FontAwesomeIcon icon={faArrowRight} /></p>
                    </div>
                    <p onClick={handleCancelGoToLoginPage} className={cx('btn_cancel_logins')}>Bỏ qua</p>
                </div>
            </Dialog>

            <Dialog open={isShowDialog}>
                <div className={cx('dialog_add_to_cart')}>
                    <p className={cx('dialog_success')}>
                        Sản phẩm đã được thêm thành công vào giỏ hàng của bạn
                    </p>
                    <img src={product.images} />
                    <div className={cx('option_btn')}>
                        <p onClick={handleCloseDialog} className={cx('btn')}>Chọn Thêm</p>
                        <Link to='/cart' className={cx('btn')}>Thanh Toán</Link>
                    </div>
                </div>
            </Dialog>

            <Dialog open={showEvalDialog}>
                <EvaluateForm setShow={setShowEvalDialog} product={productId} setResult={setResultEval} />
            </Dialog>
            <div className={cx('wrapper')}>
                <div className={isShowForm ? cx('visible') : cx('hidden')}>
                    <Modal isShowing={true}>
                        <RegisterLogin
                            setShowForm={setIsShowForm}
                            indexForm={indexForm}
                            setForm={setIndexForm}>
                        </RegisterLogin>
                    </Modal>
                </div>
                <div className={Object.keys(product).length > 0 ? cx('hidden') : cx('visible')}>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </div>
                <div className={cx('product_detail')}>
                    <div className={cx('product_left')}>
                        <div className={cx('product_thumnail')}>
                            <img src={product.images} />
                        </div>
                        <div className={cx('product_btn', 'hide_on_tablet_mobile')}>
                            <Button onClick={handleAddToCart} leftIcon={<FontAwesomeIcon icon={faCartShopping} />}>
                                Thêm vào giỏ hàng
                            </Button >
                            <Button onClick={handleBuyNow} primary>Mua ngay</Button>
                        </div>
                    </div>

                    <div className={cx('product_right')}>
                        <p className={cx('product_name')}>{product.title}</p>
                        {/* <div className={cx('manu_brand', 'hide_on_mobile')}>
                            <p className={cx('manufacturer_name')}>
                                Nhà cung cấp:
                                <a href="#">Kokuyo</a>
                            </p>

                            <p className={cx('brand')}>
                                Thương hiệu:
                                <span>Campus</span>
                            </p>
                        </div>
                        <p className={cx('origin', 'hide_on_mobile')}>
                            Xuất xứ:
                            <span>Thương Hiệu Nhật</span>
                        </p> */}
                        <div className={cx('rate')}>
                            {
                                rates.map((rate, index) => (
                                    <span key={index} className={rate <= product.rate ? cx('star_active', 'rate_star') : cx('rate_star')}>
                                        <FontAwesomeIcon icon={faStar} />
                                    </span>
                                ))
                            }
                            <p className={cx('rate_number')}>({evaluate.total} đánh giá)</p>
                            <p className={cx('btn_share', 'hide_on_pc')}>
                                <FontAwesomeIcon icon={faShareNodes} />
                            </p>
                        </div>

                        <div className={cx('mid_content')}>
                            <div className={cx('price')}>
                                <p className={cx('current_price')}>
                                    {

                                        numeral(product.price).format('0,0[.]00 VNĐ')
                                    } đ
                                </p>
                                <p className={product.price === product.old_price ? cx('hidden') : cx('old_price')}>
                                    {
                                        numeral(product.old_price).format('0,0[.]00 VNĐ')
                                    } đ
                                </p>
                                <p className={product.price === product.old_price ? cx('hidden') : cx('discount')}>
                                    -{(100 - ((product.price / product.old_price) * 100)).toFixed(1)}%
                                </p>
                            </div>
                            <p className={cx('btn_share', 'hide_on_tablet_mobile')}>
                                <FontAwesomeIcon icon={faShareNodes} />
                            </p>
                        </div>
                        <div className={cx('shipping')}>
                            <p className={cx('hide_on_tablet_mobile')}>Thời gian giao hàng</p>
                            <p>Giao hàng đến</p>
                            <a href="#">Thay đổi</a>
                        </div>
                        <div className={cx('policy_lie')}>
                            <p className={cx('hide_on_tablet_mobile')}>Chính sách đổi trả</p>
                            <p>Đổi trả sản phẩm trong 30 ngày</p>
                            <a href="#">Xem thêm</a>
                        </div>
                        <div className={cx('quantity', 'hide_on_tablet_mobile')}>
                            <p className={cx('label')}>Số lượng:</p>
                            <div className={cx('quantity_btn')}>
                                <p onClick={handleMinus} className={cx('btn_minus')}>
                                    <FontAwesomeIcon icon={faMinus} />
                                </p>
                                <input type="number" value={currentQuantity} className={cx('quantity_num')} />
                                <p onClick={handlePlus} className={cx('btn_plus')}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cx('introduction')}>
                    <h3>Fahasa giới thiệu</h3>
                    <ProductFrame
                        productList={productNews}
                        Component={ProductSlider}
                    >

                    </ProductFrame>
                </div>

                <div className={cx('introduction')}>
                    <h3>Sách liên quan</h3>
                    <ProductFrame
                        productList={productRelated}
                        Component={ProductSlider}
                    >

                    </ProductFrame>
                </div>

                <div className={cx('infomation')}>
                    <h3>Thông tin sản phẩm</h3>
                    <div className={cx('product_info')}>
                        <table className={cx('table_info')}>
                            <colgroup>
                                <col></col>
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th>Mã hàng</th>
                                    <td>{product._id}</td>
                                </tr>

                                <tr>
                                    <th>Tác giả</th>
                                    <td>{product.author || 'Chưa rõ'}</td>
                                </tr>

                                <tr>
                                    <th>Ngày xuất bản</th>
                                    <td>{product.published_date}</td>
                                </tr>

                                <tr>
                                    <th>Đã bán</th>
                                    <td>{product.sold}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p>Giá sản phẩm trên Fahasa.com đã bao gồm thuế theo luật hiện hành. Bên cạnh đó, tuỳ vào loại sản phẩm, hình thức và địa chỉ giao hàng mà có thể phát sinh thêm chi phí khác như Phụ phí đóng gói, phí vận chuyển, phụ phí hàng cồng kềnh,...</p>
                        <span>Chính sách khuyến mãi trên Fahasa.com không áp dụng cho Hệ thống Nhà sách Fahasa trên toàn quốc</span>
                    </div>

                    <div className={cx('description')}>
                        <h5>{product.title}</h5>

                        <ReadMore>{product.desciption}</ReadMore>
                    </div>
                </div>

                <div className={cx('rating_product')}>
                    <h3>Đánh giá sản phẩm</h3>
                    <div className={cx('rating_body')}>
                        <div className={cx('list_rate')}>
                            <h3 className={cx('current_rate')}>
                                {product.rate}
                                <p>/5</p>
                            </h3>
                            <div className={cx('rate')}>
                                {
                                    rates.map((item, index) => (
                                        <span key={index} className={item <= product.rate ? cx('star_active', 'rate_star') : cx('rate_star')}>
                                            <FontAwesomeIcon icon={faStar} />
                                        </span>
                                    ))
                                }
                            </div>
                            <p className={cx('rate_number')}>({evaluate.total} đánh giá)</p>
                        </div>

                        <div className={cx('rate_percent')}>
                            {
                                rates.map((rate, index) => (
                                    <div key={index} className={cx('rate_percent_item')}>
                                        <p>{index + 1} Sao</p>
                                        <div className={cx('review_rating')}>
                                            <div style={evaluate.total ? { width: `${(evaluate.rate[index] / evaluate.total) * 100}%` } : { width: `0%` }}></div>
                                        </div>
                                        <p>{evaluate.total ? ((evaluate.rate[index] / evaluate.total) * 100) : 0} %</p>
                                    </div>
                                ))
                            }
                        </div>

                        <p className={Object.keys(state.user).length <= 0 ? cx('nologin', 'hide_on_tablet_mobile') : cx('hide')}>
                            Chỉ có thành viên mới có thể viết nhận xét.Vui lòng
                            <a onClick={handleLogin}>Đăng nhập</a> hoặc
                            <a onClick={handleRegister}>Đăng ký.</a>
                        </p>
                        <p onClick={handleEval} className={cx('btn_evaluate', 'hide_on_tablet_mobile')}>
                            <Button leftIcon={<FontAwesomeIcon icon={faPen} />}>Viết đánh giá</Button>
                        </p>
                    </div>
                    <p className={Object.keys(state.user).length <= 0 ? cx('nologin', 'hide_on_pc') : cx('hide')}>
                        Chỉ có thành viên mới có thể viết nhận xét.Vui lòng
                        <a onClick={handleLogin}>Đăng nhập</a> hoặc
                        <a onClick={handleRegister}>Đăng ký.</a>
                    </p>
                    <p onClick={handleEval} className={cx('btn_evaluate_tl-mb', 'hide_on_pc')}>
                        <Button leftIcon={<FontAwesomeIcon icon={faPen} />}>Viết đánh giá</Button>
                    </p>

                    <div className={lengthComments > 0 ? cx('comments') : cx('hidden')}>
                        <ul className={cx('comments_tab')}>
                            <li className={cx('comments_tab_item', 'comments_tab_active')}>Mới nhất</li>
                            <li className={cx('comments_tab_item')}>Yêu thích nhất</li>
                        </ul>


                        {
                            tempArray.map((item, index) =>
                                <div ref={commentRef} className={cx('comments_inner')}>
                                    <div className={cx('comments_left')}>
                                        <p className={cx('comments_user')}>{comments[index].user.fullName ? comments[index].user.fullName : comments[index].user.username}</p>
                                        <p className={cx('comments_day')}>
                                            {
                                                new Date(comments[index].createdAt).toLocaleDateString()
                                            }
                                        </p>
                                    </div>
                                    <div className={cx('comments_right')}>
                                        <div className={cx('rate')}>
                                            {
                                                rates.map((item, indexRate) => (
                                                    <span key={indexRate} className={item <= comments[index].rate ? cx('star_active', 'rate_star') : cx('rate_star')}>
                                                        <FontAwesomeIcon icon={faStar} />
                                                    </span>
                                                ))
                                            }
                                        </div>
                                        <ReadMore>
                                            {comments[index].comment}
                                        </ReadMore>
                                        <div className={cx('comments_likes')}>
                                            <p className={cx('like_icon')}>
                                                <FontAwesomeIcon icon={faThumbsUp} />
                                            </p>
                                            thích
                                            <p className={cx('like_total')}>(2)</p>
                                        </div>
                                    </div>

                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <ul className={cx('btn_on_mobile', 'hide_on_pc')}>
                <li>
                    <div className={cx('quantity_btn')}>
                        <p onClick={handleMinus} className={cx('btn_minus')}>
                            <FontAwesomeIcon icon={faMinus} />
                        </p>
                        <input type="number" value={currentQuantity} className={cx('quantity_num')} />
                        <p onClick={handlePlus} className={cx('btn_plus')}>
                            <FontAwesomeIcon icon={faPlus} />
                        </p>
                    </div>
                </li>
                <li>
                    <p onClick={handleAddToCart} className={cx('add_to_cart')}>
                        <span>Thêm vào</span>
                        <span> giỏ hàng</span>
                    </p>
                </li>
                <li>
                    <p onClick={handleBuyNow} className={cx('buy_now')}>Mua ngay</p>
                </li>
            </ul>
        </>
    )
}

export default ProductDetail
