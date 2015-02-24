module.exports = function (io) {

var express = require('express');
var router = express.Router();
// could use one line instead: var router = require('express').Router();
//var tweetBank = require('../tweetBank');
var tweetSql = require('../models');
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
  tweetSql.User.findAll({where:{name: name}, include: [tweetSql.Tweet]}).then(function(user){
    console.log(JSON.stringify(user));
   res.render( 'index', { title: 'Twitter.js - Posts by ' + name, name: user[0].name, tweets: user[0].Tweets, showForm: true } );
 
  });
});

router.get('/users/:name/tweets/:id', function(req, res) {
  var name = req.params.name;
  var id = parseInt(req.params.id);
  var list = tweetBank.find( {id: id} );
  res.render( 'index', { title: 'Twitter.js - Posts by ' + name, tweets: list } );
});

router.post('/submit', function(req, res) {
  var name = req.body.name;
  var text = req.body.text;
  tweetBank.add(name, text);

  // test
  var tweets = tweetBank.list();
  var newTweet = tweets[tweets.length - 1];
  io.sockets.emit('new_tweet', {heading: 'New Tweet', id: newTweet.id, name: newTweet.name, text: newTweet.text});
  // io.sockets.emit('new_tweet', {heading: 'New Tweet', name: name, text: text});

  res.redirect('/');
});

return router;

};
//module.exports = router;
