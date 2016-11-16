import marked from 'marked';
import View from '../view/view.js';
import md from './legal.md';
import template from './template.jade';

export default class LegalTermsView extends View {

  /**
   * Creates a Legal Terms view
   */

  constructor () {
    super(template, { md: marked(md) });
  }
}
