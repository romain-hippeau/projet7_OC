//import
const models = require('../models');
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils')
//const parametre
const TITLE_LIMIT = 2;
const CONTENT_LIMIT = 4;
//routes
module.exports ={
   createMessage: function (req, res) {
    var headerAuth = req.headerAuth['authorization'];
    var userId     = jwtUtils.getUserId(headerAuth);

    // Parametre
    var title = req.body.title;
    var content = req.body.content;

    if (title == null || content == null) {
        return res.status(400).json({ 'error': 'missing parameters'});
    }
    if (title.length <= TITLE_LIMIT || content <= CONTENT_LIMIT) {
        return res.status(400).json({ 'error': 'invalid parameters'});
    }
    asyncLib.waterfall([
        function(done){
            models.User.findOne({
                where:{ id: userId }
            }).then(function(userFound){
                done(null, userFound);
            })
            .catch(function(err){
                return res.status(500).json ({'error': 'unable to verify user'});
            });
        },
        function (userFound , done) {
            if (userFound) {
                models.Message.create({
                    title : title,
                    content : content , 
                    likes : 0,
                    UserId : userFound.id
                })
                .then(function (newMessage) {
                    done(newMessage);
                  });
            } else {
                res.status(404).json({ 'error': 'user not found'});
            }
          }
    ],function(newMessage){
        if(newMessage){
            return res.status(201).json(newMessage);
        }else{
            return res.status(500).json ({ 'error': 'cannot post message'});
        }
    })
     },
     listMessage: function (req, res) {
         // fields vas nous permetre de selectionner les colonnes qu'on veut afficher
         //limit et offset de récuperer les messages par segmentation
         // order de sortir les messages par un ordre particulier
         var fields = req.query.fields;
         var limit = parseInt(req.query.limit);
         var offset = parseInt(req.query.offset);
         var order = req.query.order;

         models.Message.findAll({
             order: [(order != null) ? order.split(':') : ['title' , 'ASC']],
             attributes: (fields !== '*' && fields != null) ? fields.split(','): null,
             limit : (!isNaN(limit)) ? limit : null,
             offset : (!isNaN(offset)) ? limit : null,
             include: [{
                 model: models.User,
                 attributes: ['username']
             }]
         }).then(function (messages) {
             if (messages) {
                 res.status(200).json(messages);
               }else{
                   res.status(400).json({'error': 'no messages found'})
               }
         }).catch(function (err) {
            console.log(err);
            res.status(500).json({'error': "invalid fields"})
           });
     }
     
} 