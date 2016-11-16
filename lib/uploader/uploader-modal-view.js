import o from 'component-dom';
import nanoModal from 'nanomodal';
import FormView from '../form-view/form-view';
import template from './uploader-modal.jade';
import Holder from 'holderjs';

export default class UploaderModal extends FormView {

  /**
   * Creates a profile edit view
   */

  constructor (type, id, value) {
    super(template, {});
    this.type = type;
    this.topic = id;
    this.value = value;
    this.input = this.find('input[name="url"]');
    this.preview = this.find('.preview');
    this.button = this.find('button.ok');
    var that = this;
    this.modal = nanoModal('', {
      classes: 'uploader-modal',
      overlayClose: false,
      buttons: [{
        text: 'Insert',
        handler: function(){
          that.do();
        },
        classes: 'btn btn-primary btn-action'
      }, {
        text: 'Cancel',
        handler: function(){
          that.destroy();
        },
        classes: 'btn btn-default'
      }]
    });
    this.modal.setContent(this.el[0]);
  }

  switchOn () {
    var that = this;
    jQuery('.btn-action').click(() => {
      that.do();
    });
    jQuery('.fileinput').on('change.bs.fileinput', () => {
      that.onchange();
    });
    jQuery('.fileinput').on(['clear.bs.fileinput', 'reset.bs.fileinput'], () => {
      that.reset();
    });
    this.on('error', this.bound('error'));
    this.on('valid', this.bound('do'));
  }

  switchOff () {
    this.unbind();
    this.off('cancel');
  }

  destroy () {
    this.modal.hide();
    this.modal.remove();
  }

  show () {
    this.reset();
    this.modal.show();
  }

  onchange () {

  }

  reset () {

    this.preview.empty();
    if(this.value) {
      this.input.value(this.value);
      var image = o('<img src="' + this.value + '"/>');
      this.preview.append(image);
    } else {
      this.input.value('');
      var placeholder = o('<img/>');
      placeholder.attr('data-src', 'holder.js/500x200?text=preview&auto=yes');
      placeholder.addClass('preview-placeholder');
      placeholder.addClass('img-responsive');
      this.preview.append(placeholder);
      Holder.run({images: 'img.preview-placeholder'});
    }

  }

  error () {
    this.find('.form-messages').removeClass('hide');
  }

  do() {
    this.modal.hide();
    // this.loading();

    // forumStore.destroy(this.forum.name)
    //   .then(() => {
    //     this.hide();
    //     this.unloading();
    //     analytics.track('delete forum', { forum: this.forum.id })
    //   })
    //   .catch(() => {
    //     this.unloading();
    //   });
  }
}
