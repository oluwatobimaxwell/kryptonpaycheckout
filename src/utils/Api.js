import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { getObject, getString } from "./Functions";



const apiBase = "http://localhost:8000";

export class Api {
  constructor(props) {
    this.init();
  }

  init = async () => {
    this.token = getObject("token")
  };

  useToken = async (callback) => {
    let token = getString("token");
    return callback(token);
  };

  getToken = () => {
    return this.token;
  };

  //   saveD

  getHeaders = (token) => {
    let headers = {
      "Content-Type": "application/json",
      Accept: "*/*",
    };
    // if (token) {
    //   headers.Authorization = `Bearer ${token}`;
    // }
    return { headers };
  };

  // GET Request
  get = async (data = {}, endpoint) => {
    if (!endpoint) return;
    return this.useToken((token) => {
      return axios
        .get(
          `${apiBase}${endpoint}?${new URLSearchParams(
            data
          ).toString()}`,
          this.getHeaders(token)
        )
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return { error: true, data: err?.response?.data };
        });
    });
  };

  // POST Request
  post = async (data, endpoint, headers = {}, usetoken=true) => {
    if (!endpoint) return;
    return this.useToken((token) => {
      return axios
        .post(`${apiBase}${endpoint}`, data, { ...this.getHeaders(token), ...headers })
        .then((res) => {
          console.log(res);
          return res.data;
        })
        .catch((err) => {
          // console.log(err);
          // throw err;
          return err?.response?.data;
        });
    });
  };

  // PUT Request
  put = (data, endpoint, headers = {}) => {
    if (!endpoint) return;
    return this.useToken((token) => {
      return axios
        .put(`${apiBase}${endpoint}`, data, { ...this.getHeaders(token), ...headers })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          throw err;
        });
    });
  };

  // DELETE Request
  delete = (data, endpoint) => {
    if (!endpoint) return;
    return this.useToken((token) => {
      return axios
        .delete(`${apiBase}${endpoint}`, this.getHeaders(token))
        .then((res) => {
          console.log(res);
          return res.data;
        })
        .catch((err) => {
          throw err;
        });
    });
  };
}
