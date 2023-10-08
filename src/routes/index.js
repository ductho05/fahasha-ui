import Home from '../pages/Home/index'
import ProductDetail from '../pages/ProductDetail/index'
import TableCart from '../pages/Cart/TableCart'
import Account from '../pages/Account'
import SeeMoreProduct from '../pages/SeeMoreProduct'
import CheckOut from '../pages/CheckOut'
import SearchProduct from '../pages/SearchProduct'
import RegisterLogin from '../pages/RegisterLoginPage'
import OrderSuccess from '../pages/OrderSuccess'
import OrderDetail from '../pages/OrderDetail'
import Page404 from '../pages/Page404'
import HomeAdmin from '../admin/pages/HomeAdmin/HomeAdmin'
import Users from '../admin/pages/Users/Users'
import UserDetail from '../admin/pages/UserDetail/UserDetail'
import TermsServices from '../pages/TermsServices'
import Review from '../admin/pages/Review/Review'

// Public Routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/product-detail/:productId', component: ProductDetail },
    { path: '/product-detail/:productId/comments-detail', component: ProductDetail },
    { path: '/seemore-product/:categoryId', component: SeeMoreProduct },
    { path: '/search/:title', component: SearchProduct },
    { path: '/login-register', component: RegisterLogin },
    { path: '/terms-of-service', component: TermsServices },
]


// Private Routes
const privateRoutes = [
    { path: '/cart', component: TableCart },
    { path: '/checkout', component: CheckOut },
    { path: '/account/:index', component: Account },
    { path: '/account/order/detail/:orderId', component: OrderDetail },
    { path: '/order-success/:orderId', component: OrderSuccess },
];

// Admin routes
const adminRoutes = [
    { path: '/admin', component: HomeAdmin },
    { path: '/admin/user', component: Users },
    { path: '/admin/user/:userId', component: UserDetail },
    { path: '/admin/reviews', component: Review },
];

const notFoundRoute = { path: '*', component: Page404 };

export { publicRoutes, privateRoutes, notFoundRoute, adminRoutes };
