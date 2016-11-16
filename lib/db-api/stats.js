/**
 * Extend module's NODE_PATH
 * HACK: temporary solution
 */

require('node-path')(module);


var models = require('lib/models');
var mongoose = require('mongoose');
var Log = require('debug');
var pluck = require('lib/utils').pluck;
var log = new Log('democracyos:db-api:stats');
var merge = require('mout/object/merge');
var Forum = models.Forum;
var Topic = models.Topic;
var Comment = models.Comment;

exports.forumStatus = function forumStatus(id, fn) {

  log('fetching stats for forum %s',id?id:'all');

  var data = {
    count: {
      topic: 0,
      people: 0,
      message: 0,
      vote: 0,
      like: 0
    },
    status: 'empty',
    timestamp: -1,
    schedule: {
      last: -1,
      next: -1
    }
  };

  var query = {
    publishedAt: { $exists: true }
  };

  if( id && mongoose.Types.ObjectId.isValid(id) ){
    query = merge(query,{ forum: id });
  }

  // TOPIC LOOP

  Topic
  .where(query)
  .exec((err, topics) => {

    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    if ( topics && (topics.length > 0) ) {

      data.status = 'new' ;

      data.count.topic = topics.length ;

      for (var i = 0; i < topics.length; i++) {
        var topic = topics[i] ;

        // Updating timestamp
        if ( topic.createdAt > data.timestamp ) data.timestamp = topic.createdAt ;
        if ( topic.updatedAt > data.timestamp ) data.timestamp = topic.updatedAt ;
        if ( topic.publishedAt > data.timestamp ) data.timestamp = topic.publishedAt ;

        // Check for user contribution
        if( topic.participants || topic.votes ) {
            data.status = 'active' ;
            data.count.people += topic.participants ? topic.participants.length : 0 ;
            data.count.vote += topic.votes ? topic.votes.length : 0 ;
        }

        // Voting schedule
        if( topic.votable  ) {

          if ( topic.closingAt ) {

            if ( topic.closingAt > data.schedule.last ) data.schedule.last = topic.closingAt ;

            if ( topic.closingAt > new Date() )  {
              data.status = 'votable' ;
              if ( topic.closingAt > data.schedule.next ) data.schedule.next = topic.closingAt ;
            }

          } else {
            data.status = 'votable' ;
          }

        }


        // // COMMENTS LOOP
        //
        // Comment
        // .where({
        //   topicId: topic.id
        // })
        // .exec((err, comments) => {
        //
        //   if (err){
        //     log('Error found: %s', err);
        //     return ;
        //   }
        //
        //   if (comments){
        //     data.status = 'active' ;
        //     data.count.message += comments.length ;
        //     for (var i = 0; i < comments.length; i++) {
        //       var comment = comments[i] ;
        //       data.count.message += comment.replies ? comment.replies.length : 0 ;
        //       data.count.like += comment.votes ? comment.votes.length : 0 ;
        //
        //       // Updating timestamp
        //       if ( comment.createdAt > data.timestamp ) data.timestamp = comment.createdAt ;
        //       if ( comment.editedAt > data.timestamp ) data.timestamp = comment.editedAt ;
        //
        //       for (var i = 0; i < comment.replies.length; i++) {
        //         var reply = comment.replies[i] ;
        //         // Updating timestamp
        //         if ( reply.createdAt > data.timestamp ) data.timestamp = reply.createdAt ;
        //         if ( reply.editedAt > data.timestamp ) data.timestamp = reply.editedAt ;
        //       }
        //
        //     }
        //   }
        //
        // });

      }

    }

  })
  .then(() => {
    fn(null,data);
  });


  return this ;
}
