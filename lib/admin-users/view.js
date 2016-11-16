/**
 * Module dependencies.
 */

import List from 'democracyos-list.js';
import template from './template.jade';
import View from '../view/view.js';
import t from 't-component';
import o from 'component-dom';
import request from '../request/request.js';
import config from '../config/config.js';
import closest from 'component-closest';
import removeAll from 'mout/array/removeAll';
import find from 'mout/array/find' ;

/**
 * Creates a list view of users
 */

export default class UsersListView extends View {
  constructor(options = {}) {
    super(template, options);
    this.options = options;
  }

  switchOn() {
    let searchKeys = ['lastName', 'fullName', 'createdAt', 'email', 'staff', 'id'] ;

    if( this.options.roles ){
      this.options.roles.forEach((role) => {
        searchKeys.push(role.name);
      });
    }

    if( this.options.locations ){
      this.options.locations.forEach((location) => {
        searchKeys.push(location.name);
      });
    }

    if( this.options.activities ){
      this.options.activities.forEach((activity) => {
        searchKeys.push(activity.name);
      });
    }

    this.list = new List('users-wrapper', { valueNames: searchKeys });

    this.searchForm = this.find('input.search');

    this.bind('click', '.filter', this.bound('filterBy'));
    this.bind('click', '.f-toggle', this.bound('toggle'));

  }

  filter(value){
    this.list.search(value);
    this.searchForm.val(value);
    this.searchForm.focus();
  }

  filterBy(ev){
    this.filter(ev.delegateTarget.getAttribute('data-filter'));
  }

  toggle(ev){
    let target = ev.delegateTarget || closest(ev.target, 'a');
    let toggleType = target.getAttribute('data-toggle') ;
    let id = target.getAttribute('data-id');
    let options = this.options ;
    target = o(target);

    let user = this.options.users.find(i => i.id === id);

    if( 'status' === toggleType ){
       user.status = 'active' === user.status ? 'disabled' : 'active';
    } else if ( options.filter(options.roles,{name:toggleType}).length ) {
      if(0 <= user.roles.indexOf(toggleType)){
        removeAll(user.roles, toggleType);
      } else {
        user.roles.push(toggleType);
      }
    }

    var data = {
      status: user.status,
      roles: user.roles
    };

    let list = this.list;

    target.toggleClass('off').toggleClass('on');

    if( !target.find('.ok').hasClass('hide') ){
      target.find('.ok').addClass('hide');
    }
    if( !target.find('.ko').hasClass('hide') ){
      target.find('.ko').addClass('hide');
    }
    target.find('.refresh').removeClass('hide');

    request
    .post(config.subPath + '/settings/roles/' + user.id)
    .send(data)
    .end(function(err, res) {

      target.find('.refresh').addClass('hide');

      if (err || !res.ok) {
        target.toggleClass('off').toggleClass('on');
        target.find('.ko').removeClass('hide');
        return console.error(err);
      }
      target.find('.ok').removeClass('hide');

      // Refresh list
      var item = list.get('id', user.id)[0];
      item.values({
        status: user.status,
        roles: user.roles
      });
      list.update();

      // Refresh roles badges
      o(item.elm).find('.role').each( (e)=>{ e.remove(); } );
      for (var i = 0; i < user.roles.length; i++) {
        let role = find(options.roles,{name: user.roles[i]});
        let badge = o('<span></span>');
        badge.addClass('badge');
        badge.addClass('role');
        badge.attr('style','background-color:' + role.value.color.background + ';')
        badge.html(role.label);
        o(item.elm).find('h4').append(badge);
        let hidden = o('<span></span>');
        hidden.addClass('role');
        hidden.addClass('hide');
        hidden.addClass(role.name);
        hidden.html(role.label);
        o(item.elm).find('h4').append(hidden);
      }

    });
  }

}
