import o from 'component-dom';
import template from './error.jade';
import { dom } from '../render/render.js';
import page from 'page';

page('/admin/*', (ctx, next) => {
  let view = dom(template);
  o('#admin-content').empty().append(view);
});
