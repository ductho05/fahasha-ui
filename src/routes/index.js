import Home from '../pages/Home/index';
import ProductDetail from '../pages/ProductDetail/index';
import TableCart from '../pages/Cart/TableCart';
import Account from '../pages/Account';
import SeeMoreProduct from '../pages/SeeMoreProduct';
import CheckOut from '../pages/CheckOut';
import SearchProduct from '../pages/SearchProduct';
import RegisterLogin from '../pages/RegisterLoginPage';
import OrderSuccess from '../pages/OrderSuccess';
import OrderDetail from '../pages/OrderDetail';
import Page404 from '../pages/Page404';
import HomeAdmin from '../admin/pages/HomeAdmin/HomeAdmin';
import Users from '../admin/pages/Users/Users';
import WishList from '../admin/pages/WishList';
import UserDetail from '../admin/pages/UserDetail/UserDetail';
import TermsServices from '../pages/TermsServices';
import Review from '../admin/pages/Review/Review';
import AutoFlashSale from '../admin/pages/UseFul/FlashSale/AutoFlashSale';
import CostumFlashSale from '../admin/pages/UseFul/FlashSale/CostumFlashSale';
import Order from '../admin/pages/Order';
import Product from '../admin/pages/Product';
import AccountInfo from '../pages/Account/components/AccountInfo';
import UpdateProduct from '../admin/pages/UpdateProduct';
import FlashSale from '../admin/pages/UseFul/FlashSale';
import FlashSaleForGuest from '../pages/FlashSaleForGuest';
import Notifications from '../admin/pages/Notifications';
import FlashSaleDetail from '../admin/pages/UseFul/FlashSale/FlashSaleDetail';
import Statistics from '../admin/pages/Statistics';
import Categories from '../admin/pages/Categories/Categories';
import CategoriesDetail from '../admin/pages/CategoriesDetail/CategoriesDetail';
import OrderAdminDetail from '../admin/pages/OrderDetail/OrderAdminDetail';
import Favorite from '../pages/Favorite';

// Public Routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/product-detail/:productId', component: ProductDetail },
    { path: '/product-detail/:productId/comments-detail', component: ProductDetail },
    { path: '/seemore-product/:categoryId', component: SeeMoreProduct },
    { path: '/flashsale', component: FlashSaleForGuest },
    { path: '/search/:title', component: SearchProduct },
    { path: '/terms-of-service', component: TermsServices },
];

// Private Routes
const privateRoutes = [
    { path: '/cart', component: TableCart },
    { path: '/checkout', component: CheckOut },
    { path: '/wishlist', component: Favorite },
    { path: '/account/:index', component: Account },
    { path: '/account/order/detail/:orderId', component: OrderDetail },
    { path: '/order-success/:orderId', component: OrderSuccess },
];

// Admin routes
const adminRoutes = [
    { path: '/admin', component: HomeAdmin },
    { path: '/admin/user', component: Users },
    { path: '/admin/user/:userId', component: UserDetail },
    { path: '/admin/flashsale', component: FlashSale },
    { path: '/admin/flashsale/auto', component: AutoFlashSale },
    { path: '/admin/flashsale/custom', component: CostumFlashSale },
    { path: '/admin/flashsale/:flashId', component: FlashSaleDetail },
    { path: '/admin/reviews', component: Review },
    { path: '/admin/reviews/:reviewId', component: Review },
    { path: '/admin/statistics', component: Statistics },
    { path: '/admin/wishlists', component: WishList },
    { path: '/admin/orders', component: Order },
    { path: '/admin/products', component: Product },
    { path: '/admin/update-product/:pid', component: UpdateProduct },
    { path: '/admin/notifications', component: Notifications },
    { path: '/admin/categories', component: Categories },
    { path: '/admin/categories/:cid', component: CategoriesDetail },
    { path: '/admin/account', component: AccountInfo},
    { path: '/admin/order/detail/:orderId', component: OrderAdminDetail }
];

// Auth routes
const authRoutes = [{ path: '/login-register', component: RegisterLogin }];

const notFoundRoute = { path: '*', component: Page404 };

export { publicRoutes, privateRoutes, notFoundRoute, adminRoutes, authRoutes };
