import Home from '../pages/Home/index'
import ProductDetail from '../pages/ProductDetail/index'
import Cart from '../pages/Cart/index'
import Account from '../pages/Account'
import SeeMoreProduct from '../pages/SeeMoreProduct'
import CheckOut from '../pages/CheckOut'
import SearchProduct from '../pages/SearchProduct'
import RegisterLogin from '../pages/RegisterLoginPage'
import OrderSuccess from '../pages/OrderSuccess'
import OrderDetail from '../pages/OrderDetail'
import Page404 from '../pages/Page404'

// Public Routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/product-detail/:productId', component: ProductDetail },
    { path: '/product-detail/:productId/comments-detail', component: ProductDetail },
    { path: '/seemore-product/:categoryId', component: SeeMoreProduct },
    { path: '/search/:title', component: SearchProduct },
    { path: '/login-register', component: RegisterLogin },
    { path: '*', component: Page404 }

]

// Private Routes
const privateRoutes = [
    { path: '/cart', component: Cart },
    { path: '/checkout', component: CheckOut },
    { path: '/account/:index', component: Account },
    { path: '/account/order/detail/:orderId', component: OrderDetail },
    { path: '/order-success/:orderId', component: OrderSuccess },
]

export { publicRoutes, privateRoutes }
