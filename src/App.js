import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { publicRoutes, privateRoutes, notFoundRoute, adminRoutes, authRoutes } from './routes/index';
import DefaultLayout from './components/Layouts/DefaultLayout';
import ScrollToTop from './components/ScrollToTop';
import localstorge from './stores/localstorge';
import { useStore } from './stores/hooks';
import { Button, notification, Space } from 'antd';
import AdminLayout from './admin/components/layouts/AdminLayout';
import ServiceWorkerNotifi from './service/ServiceWorkerNotifi';

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
    const [api, contextHolder] = notification.useNotification();

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
