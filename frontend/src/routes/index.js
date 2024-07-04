import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFound/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import TypeProductPage from '../pages/TypeProductPage/TypeProductPage'
import ProfilePage from '../pages/Profile/ProfilePage'
import AdminPage from '../pages/AdminPage/AdminPage'
import PaymentPage from '../pages/PaymentPage/PaymentPage'
import OrderSucess from '../pages/OrderSuccess/OrderSuccess'
import MyOrderPage from '../pages/MyOrder/MyOrder'
import DetailsOrderPage from '../pages/DetailsOrderPage/DetailsOrderPage'

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
    },

    {
        path: '/products',
        page: ProductsPage,
        isShowHeader: true,
    },

    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true,
    },

    {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader: true,
    },

    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false,
    },

    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false,
    },

    {
        path: '/product-detail/:id',
        page: ProductDetailsPage,
        isShowHeader: true,
    },

    {
        path: '/profile-user',
        page: ProfilePage,
        isShowHeader: true,
    },

    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true,
    },

    {
        path: '/orderSuccess',
        page: OrderSucess,
        isShowHeader: true
    },

    {
        path: '/my-order',
        page: MyOrderPage,
        isShowHeader: true
    },

    {
        path: '/details-order/:id',
        page: DetailsOrderPage,
        isShowHeader: true
    },

    {
        path: '/admin',
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true,
    },

    {
        path: '*',
        page: NotFoundPage,
    }
]