/**
 * Module dependencies.
 */

import FormView from '../form-view/form-view.js';
import page from 'page';
import request from '../request/request.js';
import t from 't-component';
import template from './template.jade';
import rules from '../rules/rules.js';
import bus from 'bus';
import locker from '../browser-lock/locker';

let created = false;

export default class RulesForm extends FormView {

  constructor(rule) {
    super();
    this.rule = rule;
    this.setOptions();
    FormView.call(this, template, this.options);

    if(created){
      this.messages([t('admin-rules-form.message.onsuccess')]);
      created = false;
    }

  }

  setOptions() {
    this.action = '/api/rules/';
    if (this.rule) {
      this.action += this.rule.id;
      this.title = 'admin-rules-form.title.edit';
    } else {
      this.action += 'create';
      this.title = 'admin-rules-form.title.create';
    }

    this.options = {
      form: { title: this.title, action: this.action },
      rule: this.rule || { new: true }
    };
  }

  switchOn() {
    this.on('success', this.bound('onsuccess'));
    this.bind('click', '.btn-delete', this.bound('ondelete'));
  };

  /**
   * Handle `success` event
   *
   * @api private
   */

  onsuccess(res) {
    rules.fetch();
    created = true;
    rules.ready( () =>  page('/admin/rules/' + res.body.id) );
  }

  ondelete() {
    this.loading();
    request
    .del( config.subPath + '/api/rules/:id'.replace(':id', this.rule.id))
    .end(function (err, res) {
      if (err || !res.ok) {
        this.errors([err || res.text]);
      }
      rules.fetch();
      rules.ready(() =>{
        page('/admin/rules');
      });
    });
  }

}
