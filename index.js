var Twit = require('twit')
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

var T = new Twit({
    consumer_key:         process.env['consumer_key']
  , consumer_secret:      process.env['consumer_secret']
  , access_token:         process.env['access_token']
  , access_token_secret:  process.env['access_token_secret']
})

var baltimore = [ '-76.725714', '39.199620', '-76.526931', '39.380571' ]
var stream = T.stream('statuses/filter', { locations: baltimore })
var url = process.env['MONGOLAB_URI']

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  db.createCollection('tweets', function (err, coll) {
    assert.equal(null, err)
    stream.on('tweet', function (tweet) {
      coll.insertOne(tweet)
    })
  })
});

