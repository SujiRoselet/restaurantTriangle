import axios from 'axios';
import constants from "../../src/constans.json";

const makeRequest = () => {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    }

    // Creating instance
    let instance = axios.create(defaultOptions)

    // Set the AUTH token for any request
    instance.interceptors.request.use(function(config) {
        config.headers['user-key'] = constants.API_KEY.ZOMATO
        return config
    })
    return instance
}

export default makeRequest()
