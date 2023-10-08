import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { publicRoutes, privateRoutes, notFoundRoute, adminRoutes } from './routes/index';
import DefaultLayout from './components/Layouts/DefaultLayout';
import ScrollToTop from './components/ScrollToTop';
import localstorge from './stores/localstorge';
import { useStore } from './stores/hooks';
import { Button, notification, Space } from 'antd';
import AdminLayout from './admin/components/layouts/AdminLayout';

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
                                        <Navigate to="/login-register" />
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
                                    isLogin && state.user.isManager ? (
                                        <AdminLayout>
                                            <Page />
                                        </AdminLayout>
                                    ) : (
                                        <Navigate to="/login-register" />
                                    )
                                }
                            />
                        );
                    })}

                    <Route path={notFoundRoute.path} element={<Page404 />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
