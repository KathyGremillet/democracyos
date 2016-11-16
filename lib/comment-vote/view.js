import t from 't-component';
import debug from 'debug';
import user from '../user/user';
import View from '../view/view';
import template from './template.jade';
import commentStore from '../comment-store/comment-store';

let log = debug('democracyos:comment-vote');

export default class CommentVote extends View {
  constructor (comment) {
    super(template);

    // Posible values: 'upvote','downvote','unvote';
    this.$_status = '';
    this.$_count = 0;
    this.$_countUp = 0;
    this.$_countDown = 0;

    this.comment = comment;
    this.upvoteButton = this.find('.vote.up .fa');
    this.downvoteButton = this.find('.vote.down .fa');
    this.counterUp = this.find('.counter.up');
    this.counterDown = this.find('.counter.down');

    if (this.comment.author.id === user.id) {
      this.upvoteButton.addClass('disabled');
      this.downvoteButton.addClass('disabled');
    }

    //Calculate the current comment scoring
    this.count(this.comment.upvotes.length - this.comment.downvotes.length);
    this.countUp(this.comment.upvote);
    this.countDown(this.comment.downvote);

    if (this.voted(this.comment.upvotes)) {
      this.status('upvote');
    }

    if (this.voted(this.comment.downvotes)) {
      this.status('downvote');
    }
  }

  /**
   * Turn on event bindings
   * called when inserted to DOM
   */

  switchOn () {
    this.bind('click', '.up', 'onUpVote');
    this.bind('click', '.down', 'onDownVote');
  }

  voted (collection) {
    return !!~ collection.map(v => v.author).indexOf(user.id);
  }

  validate () {
    if (this.comment.author.id === user.id) {
      this.error(t('comments.score.not-allowed'));
      return false;
    } else if (!user.id) {
      this.loginRequired();
      return false;
    }

    //Clean up the error container
    this.emit('message', '');
    return true;
  }

  onUpVote (ev) {
    ev.preventDefault();

    if (this.validate()) {
      if (this.status() !== 'upvote') {
        this.vote('upvote');
        this.countUp(1);
        if (this.status() === 'downvote') {
          this.count(2); // up 2 times
          this.countDown(-1);
        } else {
          this.count(1);
        }
        this.status('upvote');
        this.track('upvote');
      } else {
        this.vote('unvote');
        this.count(-1);
        this.countUp(-1);
        this.status('unvote');
        this.track('unvote');
      }
    }
  }

  onDownVote (ev) {
    ev.preventDefault();

    if (this.validate()) {
      if (this.status() !== 'downvote') {
        this.vote('downvote');
        this.countDown(1);

        if (this.status() === 'upvote') {
          this.count(-2); // down 2 times
          this.countUp(-1);
        } else {
          this.count(-1);
        }
        this.status('downvote');
        this.track('downvote');

      } else {
        this.vote('unvote');
        this.count(1);
        this.countDown(-1);
        this.status('unvote');
        this.track('unvote');
      }
    }
  }

  track (event) {
    analytics.track(`${event} comment`, {
      comment: this.comment.id
    });
  }

  error (error) {
    this.emit('error', error);
  }

  loginRequired() {
    this.emit('loginrequired');
  }

  /**
   * Add or subtract the value on the current count.
   * Update dom element with the current value.
   * @param {Number} value
   */

  count (value) {
    if (arguments.length == 0) {
      return this.$_count;
    }

    this.$_count += value;
    //this.counter.text(this.$_count);
  }

  countUp (value) {
    if (arguments.length == 0) {
      return this.$_countUp;
    }

    this.$_countUp += value;
    if(this.$_countUp !== 0){
      this.counterUp.addClass('selected');
    } else {
      this.counterUp.removeClass('selected');
    }
    this.counterUp.text(this.$_countUp);
  }

  countDown (value) {
    if (arguments.length == 0) {
      return this.$_countDown;
    }

    this.$_countDown += value;
    if(this.$_countDown !== 0){
      this.counterDown.addClass('selected');
    } else {
      this.counterDown.removeClass('selected');
    }
    this.counterDown.text(this.$_countDown);
  }

  status (status) {
    if (arguments.length == 0) {
      return this.$_status;
    }

    this.$_status = status;
    this.upvoteButton.removeClass('selected');
    this.downvoteButton.removeClass('selected');

    if (status === 'upvote') {
      this.upvoteButton.addClass('selected');
    }
    if (status === 'downvote') {
      this.downvoteButton.addClass('selected');
    }
  }

  /**
   * Call the api to update the vote comment .
   */

  vote (voting) {
    commentStore
      .vote(this.comment.id, voting)
      .then(() => {
        log('successfull %s %s', voting, this.comment.id);
      })
      .catch(err => {
        this.error(t(err.message));
      });
  }
}
