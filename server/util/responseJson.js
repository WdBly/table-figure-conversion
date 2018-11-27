
function responseJson(code = 200, data = null, message = "") {
    return  {
        code: code,
        data: data,
        message: message
    }
}

export default responseJson











