import debug from 'debug';
import page from 'page';
import { findForumById, findAll, clearForumStore } from '../forum-middlewares/forum-middlewares.js';
import View from './view';
import ForumForm from '../admin-forums-form/form';
const log = debug('democracyos:admin-forums');

page('/admin/forums', clearForumStore, findAll, ctx => {
  var view = new View({
    forums: ctx.forums
  });
  view.replace('#admin-content');
  ctx.sidebar.set('forums');
});

page('/admin/forums/create', ctx => {

  let form = new ForumForm();
  form.replace('#admin-content');
  ctx.sidebar.set('forums');
});

page('/admin/forums/:id', clearForumStore, findForumById, (ctx, next) => {

  log('render /admin/forums/edit');

  if(!ctx.forum) return next();

  let form = new ForumForm(ctx.forum);
  form.replace('#admin-content');
  ctx.sidebar.set('forums');

  // // render topic form for edition
  // let form = new TopicForm(ctx.topic, ctx.forum, ctx.forums, ctx.tags);
  // form.replace('#admin-content');
  // form.on('success', function() {
  //   topicStore.findAll();
  // });
});
