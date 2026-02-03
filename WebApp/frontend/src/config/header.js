

const getHeader = ({ header_type = 'json', has_token = true }) => {

    let header = {}

    if (header_type == 'json') {
        header['Content-Type'] = 'application/json'
        header['Accept'] = 'application/json'
    }

    if (has_token) {
        let x_access_token = localStorage.getItem('access_token')

        if (x_access_token == undefined || x_access_token == "") return {}

        header['x-access-token'] = x_access_token
    }

    return header

}

export default { getHeader };