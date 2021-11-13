getCookie = (name = 'paroladepom') => {
    const getCookie = Cookies.get(name)
    let data = []
    getCookie !== undefined ? data = JSON.parse(getCookie) : false
    return data || [{}]
}

setCookie = (value, name = 'paroladepom') => {
    Cookies.set(name, value, { expires: 3500 })
}

updateCookie = (data) => {
    var currentCookies = getCookie()
    currentCookies.push(data)
    setCookie(currentCookies)
    console.log('alo ', currentCookies);
    return true
}

findPlatform = (platform) => {
    const data = getCookie()
    return data.find(d => d.platform == platform) || false
}