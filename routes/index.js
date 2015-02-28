var express = require('express');
var tweetSql = require('../models');

module.exports = function (io) {
  var router = express.Router();

  router.get('/', function (req, res) {
    tweetSql.Tweet.findAll({include: [tweetSql.User]}).then(function(tweets){
      console.log(JSON.stringify(tweets));
      //var tweetsJSON = JSON.stringify(tweets);
      res.render('index', {title: 'Twitter.js', tweets: tweets, showForm: true});
    });
  });

  router.get('/users/:name', function(req, res) {
    var name = req.params.name;

  router.get('/users/:name', function(req, res) {
    var name = req.params.name;

    tweetSql.Tweet.findAll({include: [{model: tweetSql.User, where:{name:name}}]}).complete(function(err, tweets){
      res.render( 'index', { title: 'Twitter.js - Posts by ' + name, name: name, tweets: tweets, showForm: true } );
    });
  });

  router.get('/users/:name/tweets/:id', function(req, res) {
    var name = req.params.name;
    var id = parseInt(req.params.id);

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

// reviews
// var express = require('express')
// var tweetBank = require('../tweetBank');
// var models = require('../models'),
//   Tweet = models.Tweet,
//   User = models.User;

// module.exports = function(io) {
//   var router = express.Router()

//   router.get('/', function(req, res) {
//     // find all tweets
//     // render them
//     Tweet
//     .findAll({include: [User]})
//     .success(function (tweets) {
//       console.log('tweets', tweets.map(function (tweet) {
//         var vals = tweet.get();
//         vals.User = tweet.User.get();
//         return vals;
//       }));
//       res.render('index', {
//         tweets: tweets,
//         showForm: true
//       });
//     });

//   })

//   router.get('/users/:name', function(req, res) {
//     User
//     .find({where: {name: req.params.name}})
//     .success(function (user) {
//       user
//       .getTweets()
//       .success(function (tweets) {
//         var tweetVals = tweets.map(function (tweet) {
//           var vals = tweet.get();
//           vals.User = user;
//           return vals;
//         });
//         console.log('tweets', tweetVals);
//         res.render('index', {
//           tweets: tweetVals,
//           formName: req.params.name,
//           showForm: true
//         })
//       });
//     });
//   })

//   router.get('/users/:name/tweets/:id', function(req, res){
//     req.params.id = parseInt(req.params.id);
//     Tweet
//     .find({include: [User]}, req.params.id)
//     .success(function (tweet) {
//       res.render('index', {
//         tweets: [tweet]
//       })
//     });
//   })

//   router.post('/submit', function(req, res) {
//     // see if user exists
//     // if it does
//     //  create the new tweet
//     //  with that user's id
//     // otherwise
//     //  create a new user
//     //  THEN create the new tweet
//     //  with that user's id
//     // // --- NAIVE APPROACH ---
//     // User
//     // .find({where: {name: req.body.name}})
//     // .success(function (foundUser) {
//     //  if (foundUser === null) {
//     //    User
//     //    .create({name: req.body.name})
//     //    .success(function (createdUser) {
//     //      Tweet
//     //      .create({tweet: req.body.text, UserId: createdUser.id})
//     //      .success(function (tweet) {
//     //        tweet.User = createdUser;
//     //        io.sockets.emit('new_tweet', tweet);
//     //        res.redirect(req.body.redirectUrl);
//     //      });
//     //    });
//     //  } else {
//     //    Tweet
//     //    .create({tweet: req.body.text, UserId: foundUser.id})
//     //    .success(function (tweet) {
//     //      tweet.User = foundUser;
//     //      io.sockets.emit('new_tweet', tweet);
//     //      res.redirect(req.body.redirectUrl);
//     //    });
//     //  }
//     // });
//     // --- FIND OR CREATE APPROACH
//     User
//     .findOrCreate({
//       where: {name: req.body.name},
//       defaults: {name: req.body.name}
//     })
//     .success(function (arr) {
//       var user = arr[0];
//       Tweet
//       .create({tweet: req.body.text, UserId: user.id})
//       .success(function (tweet) {
//         // also fixed sockets
//         io.sockets.emit('new_tweet', {
//           tweet: tweet.tweet,
//           User: {
//             name: user.name
//           }
//         });
//         res.redirect(req.body.redirectUrl);
//       });
//     });
//   })

//   return router
// }
