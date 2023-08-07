import axios from "axios";
import { Cookies } from "react-cookie";

 export const cookies = new Cookies()
 export const API = axios.create({
    baseURL: process.env.REACT_APP_URL_API,
    withCredentials: true,
    headers: {
        // Authorization: `Bearer ${cookies.get('__token_')}`,
        Accept: 'application/json',
    }
  });

