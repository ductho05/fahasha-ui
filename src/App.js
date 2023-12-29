import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { publicRoutes, privateRoutes, notFoundRoute, adminRoutes, authRoutes } from './routes/index';
import DefaultLayout from './components/Layouts/DefaultLayout';
import ScrollToTop from './components/ScrollToTop';
import localstorge from './stores/localstorge';
import { useStore } from './stores/hooks';
import { Button, Modal, notification, Space } from 'antd';
import AdminLayout from './admin/components/layouts/AdminLayout';
import ServiceWorkerNotifi from './service/ServiceWorkerNotifi';
import { logout } from './stores/actions';
import axios from 'axios';
import { api } from './constants';

function DeniedPermission({ type }) {
    type == 'admin'
        ? localStorage.setItem(
            'denied-permission-notify',

            `Bạn không có quyền truy cập vào trang này.
    Vui lòng đăng nhập với quyền Admin`,
        )
        : localStorage.setItem('denied-permission-notify', `Vui lòng đăng nhập để sử dụng tính năng này`);
    return <Navigate to="/login-register" />;
}

function App() {
    const [isLogin, setIsLogin] = useState(localstorge.get().length > 0);
    const [state, dispatch] = useStore();
    const Page404 = notFoundRoute.component;
    // const navigate = useNavigate()

    setTimeout(async () => {
        if (Object.keys(state.token).length > 0) {

            await axios.get(`${api}/users/get/profile`, {
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            }).then(result => {

            }).catch((err) => {
                if (err.response.data.message == "Jwt expired") {
                    Modal.error({
                        title: "Lỗi",
                        content: "Đã hết phiên đăng nhập. Vui lòng đăng nhập lại!",
                        onOk: () => {
                            dispatch(logout())

                        }
                    })
                }
            })
        }
    }, 1000)

    return (
        <BrowserRouter>

            <ScrollToTop />
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <DefaultLayout setIsLogin={setIsLogin}>
                                        <Page />
                                    </DefaultLayout>
                                }
                            />
                        );
                    })}

                    {privateRoutes.map((route, index) => {
                        const Page = route.component;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    isLogin ? (
                                        <DefaultLayout setIsLogin={setIsLogin}>
                                            <Page />
                                        </DefaultLayout>
                                    ) : (
                                        <DeniedPermission type={'user'} />
                                    )
                                }
                            />
                        );
                    })}

                    {adminRoutes.map((route, index) => {
                        const Page = route.component;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    state.user.isManager ? (
                                        <AdminLayout>
                                            <Page />
                                        </AdminLayout>
                                    ) : (
                                        <DeniedPermission type={'admin'} />
                                    )
                                }
                            />
                        );
                    })}

                    {authRoutes.map((route, index) => {
                        const Page = route.component;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={<Page />}
                            />
                        );
                    })
                    }

                    <Route path={notFoundRoute.path} element={<Page404 />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
