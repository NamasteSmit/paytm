const {JWT_SECRET_KEY} = require('../config');
const jwt = require('jsonwebtoken');

const userMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({error : 'Missing Authorization Header'});
    }

    const token = req.headers.authorization.split(' ')[1];

    const validToken = jwt.verify(token,JWT_SECRET_KEY);
    console.log("vt",validToken);

    if(!validToken){
        return res.status(401).json({error : 'Invalid Token'});
    }
 
    req.userId = validToken.userId;
    next();
}

module.exports = userMiddleware;