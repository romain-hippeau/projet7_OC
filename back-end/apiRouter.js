const express = require('express');
const usersCtrl = require ('./routes/usersCtrl');
const messagesCtrl = require('./routes/messageCtrl');
const likesCtrl = require('./routes/likesCtrl')
//Mise en place du systeme de router
exports.router = (function(){
    var apiRouter = express.Router();

    // Users routes
apiRouter.route('/users/register/').post(usersCtrl.register);
apiRouter.route('/users/login/').post(usersCtrl.login);
apiRouter.route('/users/me').get(usersCtrl.getUserProfile);
apiRouter.route('/users/me/').put(usersCtrl.updateUserProfile);

   // Messages routes
apiRouter.route('/messages/new/').post(messagesCtrl.createMessage);
apiRouter.route('/messages/').post(messagesCtrl.listMessage);

     // Likes
apiRouter.route('/messages/:messageId/vote/like').post(likesCtrl.likePost);
apiRouter.route('/messages/:messageId/vote/dislike').post(likesCtrl.dislikePost);

return apiRouter
})();
