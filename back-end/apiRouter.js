const express = require('express');
const usersCtrl = require ('./routes/usersCtrl');

//Mise en place du systeme de router
exports.router = (function(){
    var apiRouter = express.Router();

    // Users routes
apiRouter.route('/users/register/').post(usersCtrl.register);
apiRouter.route('/users/login/').post(usersCtrl.login);

return apiRouter
})();

