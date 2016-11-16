import t from 't-component';
import title from '../title/title.js';
import FormView from '../form-view/form-view.js';
import template from './signup-form.jade';
import config from '../config/config';

export default class SignupForm extends FormView {

  /**
   * Proposal Comments view
   *
   * @return {SignupForm} `SignupForm` instance.
   * @api public
   */

  constructor (options) {
    super(template, options);
    this.options = options;
  }

  switchOn () {
    this.on('success', this.bound('showSuccess'));

    // Locations

    this.locations = this.find('select#location')[0];

    // for (var i = 1; 20 >= i; i+=1) {
    //   var option = document.createElement('option');
    //   option.value = i;
    //   option.innerHTML = t(`settings.location.${i}`);
    //   this.locations.appendChild(option);
    // }

    // Age

    if(config.userAge) {

      this.ages = this.find('select#age')[0];

      for (var i = 1; 14 >= i; i+=1) {
        var option = document.createElement('option');
        option.value = i;
        option.innerHTML = t(`settings.age.${i}`);
        this.ages.appendChild(option);
      }

    }

  }

  /**
   * Show success message
   */

  showSuccess () {
    let form = this.find('#signup-form');
    let success = this.find('#signup-message');
    let welcomeMessage = this.find('#signup-message h1');
    let firstName = this.get('firstName');
    let lastName = this.get('lastName');
    let email = this.get('email');
    let fullname = firstName + ' ' + lastName;
    let message = t('signup.welcome', { name: fullname });

    analytics.track('signup', {
      email,
      firstName,
      lastName
    });

    title(t('signup.complete'));
    welcomeMessage.html(message);
    form.addClass('hide');
    success.removeClass('hide');
  }

  /**
   * Handle http response to show message to the user.
   *
   * @returns {Mixed}
   * @override from {FormView}
   */

  response (err, res) {
    console.log(err);
    console.log(res);
    if (err) {
      return this.errors([err]);
    }

    //Redirect if come from unverified email
    //FIXME: this error detection mechanism is a little weird, we should avoid compare keys.
    var text;
    try {
      text = JSON.parse(res.text);
    } catch (e) {
      text = '';
    }

    if (res.body && res.body.error) {
      return this.errors([t(res.body.error, { email: this.find('[name=email]').val() })]);
    }

    this.emit('success', res);
  }

}
