/**
 * Module dependencies.
 */

import debug from 'debug';
import t from 't-component';
import template from './template.jade';
import topicStore from '../topic-store/topic-store';
import List from 'democracyos-list.js';
import moment from 'moment';
import confirm from 'democracyos-confirmation';
import View from '../view/view';
import page from 'page';

const log = debug('democracyos:admin-topics');

/**
 * Creates a list view of topics
 */

export default class TopicsListView extends View {
  constructor(topics, forum = null, forums = null) {
    super(template, { topics, moment, forum, forums });
    this.topics = topics;
    this.forum = forum;
  }

  switchOn() {
    this.bind('click', '.btn.topic-link', this.bound('onViewTopic'));
    //this.bind('click', '.btn.delete-topic', this.bound('ondeletetopicclick'));
    this.list = new List('topics-wrapper', { valueNames: ['topic-title', 'topic-id', 'topic-date', 'topic-forum', 'topic-tag'] });

    this.searchForm = this.find('input.search');

    this.bind('click', '.filter', this.bound('filterBy'));
  }


  filter(value){
    this.list.search(value);
    this.searchForm.val(value);
    this.searchForm.focus();
  }

  filterBy(ev){
    this.filter(ev.delegateTarget.getAttribute('data-filter'));
  }

  ondeletetopicclick(ev) {
    ev.preventDefault();
    const el = ev.target.parentElement.parentElement;
    const topicId = el.getAttribute('data-topicid');

    const _t = s => t(`admin-topics-form.delete-topic.confirmation.${s}`);

    const onconfirmdelete = (ok) => {
      if (!ok) return;

      topicStore.destroy(topicId)
        .catch(err => { log('Found error %o', err); });
    };

    confirm(_t('title'), _t('body'))
      .cancel(_t('cancel'))
      .ok(_t('ok'))
      .modal()
      .closable()
      .effect('slide')
      .show(onconfirmdelete);
  }

  onViewTopic(ev){
    ev.preventDefault();
    const el = ev.target.parentElement.parentElement;
    const topicId = el.getAttribute('data-topicid');
    const topic = this.topics.find(i => i.id === topicId);
    page(topic.url);
  }

}
