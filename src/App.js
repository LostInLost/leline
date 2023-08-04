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
import { API } from './Services/Api';
const HomePage = lazy(() => import('./Pages/HomePage'));
const RegisterPage = lazy(() => import('./Pages/RegisterPage'));
const LoginPage = lazy(() => import('./Pages/LoginPage'));
const Dashboard = lazy(() => import('./Layouts/DashboardUser'));
const VerificationUsers = lazy(() => import('./Pages/Dashboard/Admin/VerificationUsers'))
function App() {
  const userData = JSON.parse(localStorage.getItem('__user'))
  const [ErrorCode, setErrCode] = useState(404);

  const getUserInfo = async () => {
    let data;
    await API.get('user')
      .then((res) => {
        const user = new Object();
        user.username = res.data.user?.username;
        user.avatar = res.data.user?.photo;
        localStorage.setItem('__user', JSON.stringify(user));
        data = json(res.data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 401) {
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
      loader: () => {
        if (!localStorage.getItem('__token_')) return true

        return getUserInfo()
      },
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
      element: <Dashboard />,
      id: 'dashboard',
      loader: () => {
        return getUserInfo();
      },
      shouldRevalidate: () => {
        console.log(window.location.pathname === '/dashboard/profiles/' + userData?.username);
        return window.location.pathname === '/dashboard/profiles/' + userData?.username || localStorage.getItem('revalidate')
      },
      errorElement: <PageError errorCode={ErrorCode} />,
      children: [
        {
          path: 'profiles/:username',
          element: <Profile />,
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
    {
      path: '*',
      element: <PageError errorCode={404} />
    }
  ]);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>

    </>
  );
}

export default App;
