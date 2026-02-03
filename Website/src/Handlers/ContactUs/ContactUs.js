
import proxyConfig from '../../config/reverseProxy'
import HeaderConfig from '../../config/header'

class ContactUs {

    constructor() {

    }

    async createContactUsHandler(params) {

        try {

            let response = await fetch(proxyConfig['serverBaseUrl'] + '/contact-us', {
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

export default ContactUs;