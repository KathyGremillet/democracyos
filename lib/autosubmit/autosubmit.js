import dom from 'component-dom';
import request from '../request/request.js';
import serialize from 'get-form-data';

export default function(el, fn, postserialize) {
  var form = dom(el);
  var action = form.attr('action');
  var method = form.attr('method').toLowerCase();
  var data = serialize(form[0]);
  if (postserialize) postserialize(data);

  if ('delete' == method) {
    method = 'del';
  }

  var req = request[method](action).send(data);
  req.end((err, res) => fn(err, res));
  return req;
}