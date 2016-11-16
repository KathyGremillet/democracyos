/**
 * Module dependencies.
 */


import List from 'democracyos-list.js';
import debug from 'debug';
import template from './template.jade';
import View from '../view/view';

let log = debug('democracyos:admin-rules');

module.exports = AdminRules;

/**
 * Creates `AdminUsers` view for admin
 */

export default class AdminRules extends View {

  constructor(rules) {
    super(template, { rules: rules });
  }

  switchOn() {
    this.list = new List('rules-wrapper', { valueNames: ['rules-title'] });
  }

}
