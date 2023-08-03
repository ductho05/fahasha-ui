import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { publicRoutes, privateRoutes, notFoundRoute } from './routes/index'
import DefaultLayout from './components/Layouts/DefaultLayout'
import ScrollToTop from './components/ScrollToTop';
import localstorge from './stores/localstorge';
import { useStore } from './stores/hooks'

function App() {
  const [isLogin, setIsLogin] = useState(localstorge.get().length > 0)
  const Page404 = notFoundRoute.component
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="App">
        <Routes>
          {
            publicRoutes.map((route, index) => {
              const Page = route.component
              return (
                <Route key={index} path={route.path}
                  element={
                    <DefaultLayout setIsLogin={setIsLogin}>
                      <Page />
                    </DefaultLayout>
                  }
                />
              )
            })
          }

          {
            privateRoutes.map((route, index) => {
              const Page = route.component
              return (
                <Route key={index} path={route.path}
                  element={isLogin ? <DefaultLayout setIsLogin={setIsLogin}>
                    <Page />
                  </DefaultLayout> : <Navigate to='/login-register' />}
                />
              )
            })
          }

          <Route path={notFoundRoute.path} element={<Page404 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
