import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { publicRoutes, privateRoutes } from './routes/index'
import DefaultLayout from './components/Layouts/DefaultLayout'
import ScrollToTop from './components/ScrollToTop';
import localstorge from './stores/localstorge';

function App() {
  const [isLogin, setIsLogin] = useState(localstorge.get().length > 0)
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
