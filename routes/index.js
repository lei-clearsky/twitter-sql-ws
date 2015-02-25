module.exports = function (io) {

var express = require('express');
var router = express.Router();
// could use one line instead: var router = require('express').Router();
//var tweetBank = require('../tweetBank');
var tweetSql = require('../models');
//require('../models');
router.get('/', function (req, res) {
  tweetSql.Tweet.findAll({include: [tweetSql.User]}).then(function(tweets){
    //console.log(tweets);
    console.log(JSON.stringify(tweets));
    //var tweetsJSON = JSON.stringify(tweets);
    res.render('index', {title: 'Twitter.js', tweets: tweets, showForm: true});
  });
  //var tweets = tweetBank.list();
  //res.render( 'index', { title: 'Twitter.js', tweets: tweets, showForm: true } );
});

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
  var name = req.body.name;
  var text = req.body.text;
  // tweetBank.add(name, text);

  // var tweets = tweetBank.list();
  // var newTweet = tweets[tweets.length - 1];
  // io.sockets.emit('new_tweet', {heading: 'New Tweet', id: newTweet.id, name: newTweet.name, text: newTweet.text});

  // res.redirect('/');

  // tweetSql.Tweet
  // .findAll({include: [tweetSql.User]})
  // .build({ tweet: text, name: name })
  // .save()
  // .then(function(newTweet) {
  //   io.sockets.emit('new_tweet', {heading: 'New Tweet', id: newTweet.id, name: newTweet.name, text: newTweet.tweet});
  //   res.redirect('/');
  // }).catch(function(error) {
  //   // Ooops, do some error-handling

  // })
  // var existingUserID = -1;

  // tweetSql.User.findAll({where:{name: name}})
  // .complete(function(err, userName){
  //   if (err) {
  //     tweetSql.User
  //     .create({ name: name, pictureUrl: NULL })
  //     .then(function(newUser){

  //       tweetSql.Tweet
  //       .create({ UserId: newUser.id, tweet: text })
  //       .then(function(newTweet) {
  //         io.sockets.emit('new_tweet', {heading: 'New Tweet', id: newTweet.id, name: name, text: newTweet.tweet});
  //         res.redirect('/');
  //       }).catch(function(error) {
  //       // Ooops, do some error-handling

  //       });        
  //     });

  //   } else {
  //     existingUserID = userName.shift().dataValues.id;
  //     // console.log(existingUserID);
  //     tweetSql.Tweet
  //     .create({ UserId: existingUserID, tweet: text })
  //     .then(function(newTweet) {
  //       // tweetSql.Tweet.findAll({include: [{model: tweetSql.User, where: {id: id}}]}).complete(function(err, tweets){
  //       //   res.render( 'index', { title: 'Twitter.js - Posts by ' + name, name: name, tweets: tweets} );
  //       // });
  //       io.sockets.emit('new_tweet', {heading: 'New Tweet', id: newTweet.id, name: name, text: newTweet.tweet});
  //       res.redirect('/');
  //     }).catch(function(error) {
  //     // Ooops, do some error-handling

  //     });
  //   }

  // });
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
//module.exports = router;
