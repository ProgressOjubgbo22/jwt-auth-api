const jwt = require('jsonwebtoken');
const User = require('../model/user');

const secretkey = "secretKey";

async function auth (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({message: 'access denied;'});
    }

        try{

            const decoded = jwt.verify(token, secretkey);

            const foundUser =  await User.findById(decoded.id);
            if(!foundUser) {
                return res.status(404).json({message: "user not found"});
            }
            req.user = foundUser;
            next();
        }
        catch(err) {
            console.error(err);
            return res.status(500).json({message: "server error"});
            
        }
    

}

function generateToken(id) {
    return jwt.sign({ id }, secretkey, { expiresIn: '1h' });
}

function authAdmin(req, res, next) {
    if(req.user.role !== 'admin') {
        return res.status(403).json({message: "access denied"});
    }
    next();
}

module.exports = {auth, generateToken, authAdmin};
