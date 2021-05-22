import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class IndexController extends Controller {
  @tracked
  selectedEmails = [];

  @tracked
  availableEmails = [];

  @action
  onChange(selectedEmails) {
    this.selectedEmails = selectedEmails;
  }

  @action
  onCreate(email) {
    let option = { email: email };
    this.selectedEmails = [...this.selectedEmails, option];
  }
}
