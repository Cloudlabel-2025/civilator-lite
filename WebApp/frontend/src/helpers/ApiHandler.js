import proxyConfig from '../config/reverseProxy';
import HeaderConfig from '../config/header';

class ApiHandler {

    constructor() {
        this.request = this.request.bind()
    }

    async request({ method, base_url = proxyConfig['serverBaseUrl'], endpoint, params = null, header_type = 'json', has_token = true }) {
        try {
            let options = {
                method,
                headers: HeaderConfig.getHeader({ has_token, header_type })
            };



            if (params && method == 'GET') {
                endpoint += params ? '?' + new URLSearchParams(params).toString() : '';
            }
            else if (params && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
                if (header_type == 'json') options.body = JSON.stringify(params);
                else if (header_type == 'formdata') options.body = params
            }


            const url = base_url + endpoint

            let response = await fetch(url, options);
            response = await response.json();

            return response;
        } catch (err) {
            console.log(err, 'API request error');
            return { success: false, message: err.message };
        }
    }
}

export default ApiHandler;
