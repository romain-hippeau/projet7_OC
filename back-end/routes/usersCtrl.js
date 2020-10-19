//imports
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
const models = require('../models');

//routes
module.exports = {
    register: function(req , req){
       var email = req.body.email;
       var username = req.body.username;
       var password = req.body.password;
       var bio     = req.body.bio;
       // verification qu'aucun des parametres n'est nul
       if(email == null || username == null || password == null){
           return res.status(400).json({'error': 'missing parameters'})
       }
       //recherche pour voir si l'utilisateur est deja dans la base de données
       //si l'utilisateur n'est pas trouver on l'inscris et hash son mot de passe avec bcrypt
       models.user.findOne({
           attributes : ['email'],
           where: {email: email}
       })
       .then(function(userFound) {
           if(!userFound){
               bcrypt.hash(password , 5 , function(err, bcryptedPassword) {
                  var newUser = models.User.create({
                      email: email,
                      username: username,
                      password: bcryptedPassword,
                      bio: bio,
                      isAdmin:0
                  })
               }).then(function(newUser){
                   return res.status(201).json({
                       'userId': newUser.id
                   })
               }).catch(function(err){
                return res.status(500).json({ 'error': 'unable to verify user'})
            })
           } else{
               return res.status(409).json({ 'error': 'user already exist'})
           }
       });
    },
    login: function(req , req){
        var email = req.body.email;
        var password = req.body.password;
        if(email == null || password == null){
            return res.status(400).json({'error': 'missing parameters'})
        }
        models.user.findOne({
            where: {email: email}
        })
        .then(function(userFound) {
            if (userFound){

                bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt){
                    if(resBycrypt){
                        return res.status(200).json({
                            'userId': userFound.id,
                            'token': jwtUtils.generateTokenForUser(userFound)
                        });
                    } else{
                        return res.status(403).json({ "error": "invalid password"})
                    }
                })
            }
            
                }).catch(function(err){
                 return res.status(500).json({ 'error': 'unable to verify user'})
             })
    }
}