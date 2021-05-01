const { default: axios } = require("axios")

const baseUrl = 'https://iust-bshop.herokuapp.com/'

const Api = axios.create({
  baseURL: baseUrl
})

export const createStore = (body) => {
  const config = {
    headers: { Authorization: `Token ${localStorage.getItem("token")}` }
};
  return Api.post('api/v1/shops/create/', body, config)
}

export const createUser = (body) => {
  return Api.post('rest-auth/registration/', {...body})
}

export const loginUser = (body) => {
  return Api.post('rest-auth/login/', {...body})
}
