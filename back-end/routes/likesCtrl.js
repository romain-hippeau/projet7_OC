//importation
const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');
const asyncLib = require('async')
//routes
module.exports = {
    likePost: function (req, res) {
        var headerAuth = req.headerAuth['authorization'];
        var userId     = jwtUtils.getUserId(headerAuth);
        // parametre
        var messageId = parseInt(req.query.messageId);
        if (messageId <= 0) {
            return res.status(400).json({ 'error': 'invalid parameters '});
        }
        asyncLib.waterfall([
            function(done){
                models.Message.findOne({
                    where: {id: messageId}
                })
                .then(function (messageFound) {
                    done(null, messageFound);
                  })
                  .catch(function (err) {
                      return res.status(500).json({ 'error': 'unable to verify message'});
                    })
            },
            function (messageFound, done) {
                if(messageFound){
                    models.User.findOne({
                        where: {id: userId}
                    }).then(function (userFound) {
                        done(null, messageFound , userFound);
                      })
                      .catch(function (err) {
                          return res.status(500).json({ 'error': 'unable to verify message'});
                        })
                }else{
                    res.status(404).json({'error': 'post already liked'});
                }
              },
              function (messageFound, userFound , done) {
                if(userFound ){
                    models.Like.findOne({
                        where: {
                            id: userId,
                            messageId : messageId
                        }
                    }).then(function (isUserAlreadyLiked) {
                        done(null, messageFound , userFound, isUserAlreadyLike);
                      })
                      .catch(function (err) {
                          return res.status(500).json({ 'error': 'unable to verify is user already liked'});
                        })
                }else{
                    res.status(409).json({'error': 'user not exist'});
                }
              },
              function (messageFound, userFound, done) {
                  messageFound.update({
                      likes: messageFound.likes +1,
                  }).then(function () {
                      done(messageFound);
                    }).catch(function (err) {
                        res.status(500).json({ 'error': 'cannot update message like counter'});
                      });
                },function (messageFound) {
                    if (messageFound) {
                        return res.status(201).json(messageFound);
                    } else {
                        return res.status(500).json({ 'error': 'cannot update message'});
                    }
                  }
        ])
    },
    dislikePost: function(req, res) {
        // Getting auth header
        var headerAuth  = req.headers['authorization'];
        var userId      = jwtUtils.getUserId(headerAuth);
     
        // Params
        var messageId = parseInt(req.params.messageId);
     
        if (messageId <= 0) {
          return res.status(400).json({ 'error': 'invalid parameters' });
        }
     
        asyncLib.waterfall([
         function(done) {
            models.Message.findOne({
              where: { id: messageId }
            })
            .then(function(messageFound) {
              done(null, messageFound);
            })
            .catch(function(err) {
              return res.status(500).json({ 'error': 'unable to verify message' });
            });
          },
          function(messageFound, done) {
            if(messageFound) {
              models.User.findOne({
                where: { id: userId }
              })
              .then(function(userFound) {
                done(null, messageFound, userFound);
              })
              .catch(function(err) {
                return res.status(500).json({ 'error': 'unable to verify user' });
              });
            } else {
              res.status(404).json({ 'error': 'post already liked' });
            }
          },
          function(messageFound, userFound, done) {
            if(userFound) {
              models.Like.findOne({
                where: {
                  userId: userId,
                  messageId: messageId
                }
              })
              .then(function(userAlreadyLikedFound) {
                 done(null, messageFound, userFound, userAlreadyLikedFound);
              })
              .catch(function(err) {
                return res.status(500).json({ 'error': 'unable to verify is user already liked' });
              });
            } else {
              res.status(404).json({ 'error': 'user not exist' });
            }
          },
          function(messageFound, userFound, userAlreadyLikedFound, done) {
           if(!userAlreadyLikedFound) {
             messageFound.addUser(userFound, { isLike: DISLIKED })
             .then(function (alreadyLikeFound) {
               done(null, messageFound, userFound);
             })
             .catch(function(err) {
               return res.status(500).json({ 'error': 'unable to set user reaction' });
             });
           } else {
             if (userAlreadyLikedFound.isLike === LIKED) {
               userAlreadyLikedFound.update({
                 isLike: DISLIKED,
               }).then(function() {
                 done(null, messageFound, userFound);
               }).catch(function(err) {
                 res.status(500).json({ 'error': 'cannot update user reaction' });
               });
             } else {
               res.status(409).json({ 'error': 'message already disliked' });
             }
           }
          },
          function(messageFound, userFound, done) {
            messageFound.update({
              likes: messageFound.likes - 1,
            }).then(function() {
              done(messageFound);
            }).catch(function(err) {
              res.status(500).json({ 'error': 'cannot update message like counter' });
            });
          },
        ], function(messageFound) {
          if (messageFound) {
            return res.status(201).json(messageFound);
          } else {
            return res.status(500).json({ 'error': 'cannot update message' });
          }
        });
       }
     }