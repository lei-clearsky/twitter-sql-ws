var express = require('express');
var tweetSql = require('../models');
// var models = require('../models'),
//     Tweet = models.Tweet,
//     User = models.User;


module.exports = function (io) {
  var router = express.Router();
  // could use one line instead: var router = require('express').Router();
  // review
  // router.get('/', function(req, res){
  //   Tweet
  //   .findAll()
  //   .success(function (tweets) {
  //     console.log('tweets', tweets.map(function (tweet) {
  //       var vals = tweet.get();
  //       vals.User = tweet.User.get();
  //       return vals;
  //     }));
  //     res.render('index', {
  //       tweets: tweets,
  //       showForm: true
  //     });
  //   });
  // });
  router.get('/', function (req, res) {
    tweetSql.Tweet.findAll({include: [tweetSql.User]}).then(function(tweets){
      console.log(JSON.stringify(tweets));
      //var tweetsJSON = JSON.stringify(tweets);
      res.render('index', {title: 'Twitter.js', tweets: tweets, showForm: true});
    });
    //var tweets = tweetBank.list();
    //res.render( 'index', { title: 'Twitter.js', tweets: tweets, showForm: true } );
  });

  router.get('/users/:name', function(req, res) {
    var name = req.params.name;

  //   User
  //   .find({where: {name: req.params.name}})
  //   .success(function (user) {
  //     user
  //     .getTweets()
  //     .success(function (tweets) {
  //       var tweetVals = tweets.map(function (tweet) {
  //         var vals = tweet.get();
  //         vals.User = user;
  //         return vals;
  //       });
  //       console.log('tweets', tweetVals);
  //       res.render( 'index', { 
  //         title: 'Twitter.js - Posts by ' + req.params.name, 
  //         name: req.params.name, 
  //         tweets: tweetVals, 
  //         showForm: true 
  //       } );
  //     });

  //   });

  // });  

  router.get('/users/:name', function(req, res) {
    var name = req.params.name;
    //var list = tweetBank.find( {name: name} );
    // tweetSql.User.findAll({where:{name: name}, include: [tweetSql.Tweet]}).then(function(user){
    //   console.log(JSON.stringify(user));
    //  res.render( 'index', { title: 'Twitter.js - Posts by ' + name, name: user[0].name, tweets: user[0].Tweets, showForm: true } );
   
    // });
    tweetSql.Tweet.findAll({include: [{model: tweetSql.User, where:{name:name}}]}).complete(function(err, tweets){
      res.render( 'index', { title: 'Twitter.js - Posts by ' + name, name: name, tweets: tweets, showForm: true } );
    });
  });

  // router.get('/users/:name/tweets/:id', function(req, res) {
  //   req.params.id = parseInt(req.params.id);
  //   Tweet
  //   .findAll({include: [User], 
  //             where: {id: req.params.id}})
  //   .success(function(tweets) {
  //     res.render('index', {
  //       tweets: tweets
  //     })
  //   });
  // }); 

  router.get('/users/:name/tweets/:id', function(req, res) {
    var name = req.params.name;
    var id = parseInt(req.params.id);
    // var list = tweetBank.find( {id: id} );
    // res.render( 'index', { title: 'Twitter.js - Posts by ' + name, tweets: list } );

    tweetSql.Tweet.findAll({include: [{model: tweetSql.User, where: {id: id}}]}).complete(function(err, tweets){
      res.render( 'index', { title: 'Twitter.js - Posts by ' + name, name: name, tweets: tweets} );
    });
  });

  router.post('/submit', function(req, res) {
    User
    .find({where: {name: req.params.name}})
    .success(function (user) {
      if (user === null) {
        User
        .create({name: req.body.name})
        .success(function (tweet) {

          Tweet
          .create({tweet: req.body.tweet, UserId: c})
        });

      } else {

      }
    });
  });


  router.post('/submit', function(req, res) {
    var name = req.body.name;
    var text = req.body.text;
   
    var existingUserID = -1;

    tweetSql.User.findAll({where:{name: name}})
    .complete(function(err, userName){
      if (!userName[0]){
        tweetSql.User
        .create({ name: name, pictureUrl: 'NULL' })
        .then(function(newUser){

          tweetSql.Tweet
          .create({ UserId: newUser.id, tweet: text })
          .then(function(newTweet) {
            io.sockets.emit('new_tweet', {heading: 'New Tweet', id: newTweet.id, name: name, text: newTweet.tweet});
            res.redirect('/');
          }).catch(function(error) {
          // Ooops, do some error-handling

          });        
        });
      } else{
        existingUserID = userName[0].dataValues.id;
        // console.log(existingUserID);
        tweetSql.Tweet
        .create({ UserId: existingUserID, tweet: text })
        .then(function(newTweet) {
          // tweetSql.Tweet.findAll({include: [{model: tweetSql.User, where: {id: id}}]}).complete(function(err, tweets){
          //   res.render( 'index', { title: 'Twitter.js - Posts by ' + name, name: name, tweets: tweets} );
          // });
          io.sockets.emit('new_tweet', {heading: 'New Tweet', id: newTweet.id, name: name, text: newTweet.tweet});
          res.redirect('/');
        }).catch(function(error) {
        // Ooops, do some error-handling

        });
      }
    });

  });

return router;

};
