
import proxyConfig from '../../config/reverseProxy'
import HeaderConfig from '../../config/header'

class RequestDemo {

    constructor() {

    }


    async createRequestDemoHandler(params) {

        try {

            let response = await fetch(proxyConfig['serverBaseUrl'] + '/request-demo', {
                method: 'POST',
                headers: HeaderConfig.getHeader({ method: 'POST', isToken: false }),
                body: JSON.stringify(params)
            })

            response = await response.json()

            if (response) return response
        } catch {
            return { success: false }
        }


    }


}

export default RequestDemo;