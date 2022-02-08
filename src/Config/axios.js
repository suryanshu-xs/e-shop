import axios from 'axios'
const instance = axios.create({
    baseURL: 'http://localhost:5001/e-shop-1-1-1/us-central1/api'
})

export default instance;