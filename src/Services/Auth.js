import { API, cookies } from './Api';
import { json } from 'react-router-dom';


export const setAuthenticated = (value) => {
    localStorage.setItem('isLoggedIn', value)
}

export const setRevalidate = (value) => {
    Revalidate = value
}

export let userProfiles;

export const userData = JSON.parse(localStorage.getItem('__user'));
export let ErrorCode = 404
export let Revalidate = false
export const getUserInfo = async () => {
  let data
  await API.get('user')
    .then((res) => {
      const user = new Object();
      user.username = res.data.user?.username;
      user.avatar = res.data.user?.photo;
      localStorage.setItem('__user', JSON.stringify(user));
      setAuthenticated(true)
      data = json(res.data);
      userProfiles = json(res.data);
    })
    .catch((err) => {
      if (err.response?.status === 401) {
        localStorage.clear('__user');
        ErrorCode = 401
        setAuthenticated(false)
        return window.location.href = '/'
      }
      if (err.response?.status === 419) throw (window.location.href = '/');
      ErrorCode = 502
      throw new Response(JSON.stringify({ success: false, message: 'Bad Gateaway' }), { status: 502 });
    });

  return data;
};

export const logoutUser = async(homepage = false) => {
    await API.post('logout').then((res) => {
      if (res.status !== 200) return

        localStorage.removeItem('__user');
        setAuthenticated(false)

    if (homepage) return window.location.href = '/'
      return window.location.reload()

    }).catch((err) => {
      console.log(err)
    })
}