const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        if (!req.session || !req.session.staffId) {
            const token = req.headers.authorization.split(" ")[1]
            console.log('token', token)
            const decoded = jwt.verify(token, process.env.JWT_KEY)
            req.userData = decoded
        }
    } catch (error) {
        return res.status(401).json({
            message: 'unauthorized'
        })
    }

    next();
}