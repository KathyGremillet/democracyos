import bus from 'bus';
import debug from 'debug';
import ToggleParent from 'democracyos-toggle-parent';
import o from 'component-dom';
import t from 't-component';
import closest from 'component-closest';
import View from '../view/view.js';
import user from '../user/user.js';
import Storage from '../storage/storage.js';
import sorts from './sorts.js';
import template from './template.jade';

import search from 'mout/array/find' ;

let log = debug('democracyos:comments-filter');
let storage = new Storage();

export default class CommentsFilter extends View {
  constructor () {
    super();
    this.refresh();
    super(template, { label: this.get().label, sorts: sorts });
  }

  /**
   * Switch on events
   *
   * @api public
   */

  switchOn () {
    bus.on('page:change', this.bound('switchOff'));
    this.bind('click', '.btn-group button.btn', 'onsortclick');
    this.on('change', this.bound('onsortchange'));
    user.on('load', this.bound('refresh'));

    var sort = this.get() ? this.get() : 'upvote' ;
    var active = this.find('.btn[data-sort=' + sort.key + ']') ;
    this.find('.btn-group button.btn').removeClass('active');
    console.log(active);
    o(active).addClass('active');
  }


  switchOff () {
    bus.off('page:change', this.bound('switchOff'));
    user.off('loaded', this.bound('refresh'));
  }

  /**
   * Click on a comments sort
   *
   * @api public
   */

  onsortclick (ev) {
    ev.preventDefault();

    let target = ev.delegateTarget || closest(ev.target, 'button');
    let sort = target.getAttribute('data-sort');
    this.set(sort);
  }

  /**
   * Change sorting criteria
   *
   * @api public
   */

  onsortchange () {
    var sort = this.get() ? this.get() : 'upvote' ;
    var active = this.find('.btn[data-sort=' + sort.key + ']') ;
    this.find('.btn-group button.btn').removeClass('active');
    console.log(active);
    o(active).addClass('active');
  }

  /**
   * Reset sorting criteria
   *
   * @api public
   */

  reset () {
    this.set(sorts.upvote);
  }

  /**
   * Refresh sorting criteria
   *
   * @api public
   */

  refresh(sort) {
    let self = this;

    if (!user.logged()) {
      this.reset();
    } else {
      var data = storage.get('comments-filter');
      if (!data) log('unable to fetch');
      self.set(data ? data : sorts.upvote);
    }
  }

  /**
   * Get all current `$_filter` or just the
   * one provided by `key` param
   *
   * @param {String} key
   * @return {Array|String} all `$_filter` or just the one by `key`
   * @api public
   */

  get () {
    return this.$_filter;
  }

  /**
   * Set `$_filter` to whatever provided
   *
   * @param {String|Object} key to set `value` or `Object` of `key-value` pairs
   * @param {String} value
   * @return {CommentsFilter} Instance of `CommentsFilter`
   * @api public
   */

  set (sort) {
    let old = this.$_filter;
    this.$_filter = sorts[sort] || sort;

    if (user.logged()) {
      storage.set('comments-filter', this.get(), ((err, ok) => err ? log('unable to save') : log('saved')));
    }

    if (old != this.$_filter) this.emit('change');
    return this;
  }

  /**
   * Get current sort
   *
   * @return {String}
   * @api public
   */

  getSort () {
    return this.get().sort;
  }
}
