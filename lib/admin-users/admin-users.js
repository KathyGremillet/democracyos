import page from 'page';
import contains from 'mout/array/contains' ;
import filter from 'mout/array/filter' ;
import config from '../config/config';
import { findAllUsers, clearUserStore } from '../user-middlewares/user-middlewares.js';
import rules from '../rules/rules';
import View from './view';

page('/admin/users', clearUserStore, findAllUsers, rules.middleware, ctx => {
  var view = new View({
    users: ctx.users,
    roles: contains(config.rules,'role') ? ctx.roles : [],
    locations: contains(config.rules,'location') ? ctx.locations : [],
    activities: contains(config.rules,'activity') ? ctx.activities : [],
    filter: filter
  });
  view.replace('#admin-content');
  ctx.sidebar.set('users');
});
