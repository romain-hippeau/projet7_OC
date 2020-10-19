const jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = '$2y$10$JnEAABNPblrlnfwmd86w6OcvwLxS2ybUlUHATiMdm8v21mVrBQ1k6';
//implémentation du token utilisateur
// signe du token grace a notre cont
module.exports = {
    generateTokenForUser: function(userData){
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin
        },
        JWT_SIGN_SECRET,
        {
            expiresIn:'7h'
        })
    }}