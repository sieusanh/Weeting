const jwt = require('jsonwebtoken')

const userAuthentication = async (req, res, next) => {
    const cookie_str = req.headers.cookie
    let accessToken
    if (cookie_str.includes(';')){
        const name = 'accessToken='
        const startIndex = cookie_str.indexOf(name) + name.length
        let endIndex = cookie_str.indexOf(';')
        if (endIndex < startIndex)
            endIndex = cookie_str.indexOf(';', startIndex)
        accessToken = cookie_str.substring(startIndex, endIndex)
    } else {
        accessToken = cookie_str.split('=')[1]
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, function(err, decodedToken) {
        if (err) {
            console.log('Err name: ', err.message)
            return res.status(403).json({ 
                user: null, message: 'Access Token is not valid!' 
            })
        }
        const { id, username } = decodedToken
        req.user = { id, username }
        next()
    })
}

module.exports = {userAuthentication}