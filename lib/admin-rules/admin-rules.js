import page from 'page';
import rules from '../rules/rules';
import View from './view';

page('/admin/rules', rules.middleware, function (ctx) {
  var view = new View(ctx.rules);
  view.replace('#admin-content');
  ctx.sidebar.set('rules');
});
