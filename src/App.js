import Pusher from 'pusher-js';
import Navbar from './Layouts/Navbar';
import { Route, Routes, Router, RouterProvider, createBrowserRouter, BrowserRouter, Link, json, useNavigate } from 'react-router-dom';
// import HomePage from './Pages/HomePage';
// import LoginPage from './Pages/LoginPage'
// import RegisterPage from './Pages/RegisterPage';
import { Suspense, lazy, useState } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import Page404 from './Layouts/PageError';
import Loading from './Layouts/Loading';
import PageError from './Layouts/PageError';
import Profile from './Pages/Dashboard/Profile';
const HomePage = lazy(() => import('./Pages/HomePage'));
const RegisterPage = lazy(() => import('./Pages/RegisterPage'));
const LoginPage = lazy(() => import('./Pages/LoginPage'));
const DashboardUserPage = lazy(() => import('./Layouts/DashboardUser'));
const VerificationUsers = lazy(() => import('./Pages/Dashboard/Admin/VerificationUsers'))
function App() {
  // const navigate = useNavigate()
  const API = axios.create({
    baseURL: process.env.REACT_APP_URL_API,
  });
  const [ErrorCode, setErrCode] = useState(404);

  const getUserInfo = async () => {
    let data;
    await API.get('user', {
      headers: {
        Authorization: `Bearer ${cookies.get('__token_')}`,
      },
    })
      .then((res) => {
        data = json(res.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          setErrCode(401);
          throw (window.location.href = '/');
          throw new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
        }
        setErrCode(502);
        throw new Response(JSON.stringify({ success: false, message: 'Bad Gateaway' }), { status: 502 });
        data = json({
          success: false,
        });
      });

    return data;
  };

  const cookies = new Cookies();
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Navbar />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
      ],
      errorElement: <PageError errorCode={ErrorCode} />,
    },
    {
      path: '/leline/login',
      element: <LoginPage />,
    },
    {
      path: 'leline/register',
      element: <RegisterPage />,
    },
    {
      path: `/dashboard`,
      element: <DashboardUserPage />,
      loader: () => {
        return getUserInfo();
      },
      children: [
        {
          path: 'profiles/:username',
          loader: () => {
            return getUserInfo();
          },
          element: <Profile />,
          errorElement: <PageError errorCode={ErrorCode} />,
        },
        {
          path: 'admin/verification_users',
          element: <VerificationUsers />,
        },
        {
          path: 'tes',
          element: <h2>Tes</h2>,
        },
      ],
    },
  ]);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>

      {/* <BrowserRouter>
        <RouterProvider>
          <Suspense fallback={<h2>Loading...</h2>}>
            <Routes>
              <Route path='dashboard' element={<DashboardUserPage />}>
                    <Route path='profiles/:username' element={<Profile />} loader={() => {return getUserInfo()}}></Route>
              </Route>
            </Routes>
          </Suspense>
        </RouterProvider>
      </BrowserRouter> */}
    </>
  );
}

export default App;
