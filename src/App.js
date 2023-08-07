import Pusher from 'pusher-js';
import Navbar from './Layouts/Navbar';
import { Route, Routes, Router, RouterProvider, createBrowserRouter, BrowserRouter, Link, json } from 'react-router-dom';
// import HomePage from './Pages/HomePage';
// import LoginPage from './Pages/LoginPage'
// import RegisterPage from './Pages/RegisterPage';
import { Suspense, lazy, useState } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import Loading from './Layouts/Loading';
import PageError from './Layouts/PageError';
import Profile from './Pages/Dashboard/Profile';
import { getUserInfo, userData, Revalidate } from './Services/Auth';
const HomePage = lazy(() => import('./Pages/HomePage'));
const RegisterPage = lazy(() => import('./Pages/RegisterPage'));
const LoginPage = lazy(() => import('./Pages/LoginPage'));
const Dashboard = lazy(() => import('./Layouts/DashboardUser'));
const VerificationUsers = lazy(() => import('./Pages/Dashboard/Admin/VerificationUsers'))
function App() {
  console.log(localStorage.getItem('isLoggedIn'));
  const router = createBrowserRouter([
    {
      path: '/',
      loader: () => {
        if (localStorage.getItem('isLoggedIn') === 'false') return true

        return getUserInfo()
      },
      element: <Navbar />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
      ],
      errorElement: <PageError  />,
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
        // if (localStorage.getItem('isLoggedIn') === 'false') return (window.location.href = '/');
        return getUserInfo();
      },
      shouldRevalidate: () => {
        if (Revalidate) console.log('revalidate')
        // if (window.location.pathname === '/dashboard/profiles/' + 'admin') console.log('revalidate')
        return Revalidate
      },
      errorElement: <PageError  />,
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
