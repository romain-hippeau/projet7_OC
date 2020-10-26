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
    },
    parseAutorization: function(autorization) {
        return(autorization != null) ? autorization.replace('bearer','') : null
    },
    getUserId: function(autorization){
        // on met l'userId a -1 pour s'assurer que l'on ne fais pas de requete sur quelques chose qui 
        //n'existe pas
        var userId = -1;
        var token = module.exports.parseAutorization(autorization);
        if(token != null){
            try {
                var jwtToken = jwt.verify(token , JWT_SIGN_SECRET);
                if(jwtToken != null)
                userId = jwtToken.userId;
            } catch (err) {}
           
        }
        return userId
    }
}