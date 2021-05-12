import Component from '@glimmer/component';
import { action } from '@ember/object';
import { isBlank } from '@ember/utils';
import {tracked} from "@glimmer/tracking";

export default class EmailAddressesComponent extends Component {
  availableEmails = this.args.availableEmails || [];

  get selectedEmails() {
    return this.args.selectedEmails || []
  }

  @tracked
  enteredEmailText = '';

  get triggerClass() {
    if (this.isEmailValid(this.enteredEmailText)) {
      return "email-input-trigger valid";
    } else {
      return "email-input-trigger invalid";
    }
  }

  isEmailValid(email) {
    return this.args.emailValidationMatcher.test(email || '');
  }

  @action
  onBlur(theSelect) {
    this.addAndSelectEmail(theSelect);
  }

  @action
  onKeydown(theSelect, e) {
    this.enteredEmailText = `${theSelect.searchText}${e.key}`;

    if ((e.keyCode === 9 || e.keyCode === 13) && theSelect.isOpen && !theSelect.highlighted && !isBlank(this.enteredEmailText)) {
      this.addAndSelectEmail(theSelect);
    }
  }

  addAndSelectEmail(theSelect) {
    const potentialEmail = theSelect.searchText;
    if (potentialEmail) {
      if (!this.isEmailValid(potentialEmail)) {
        return;
      }

      if (!this.selectedEmails.includes(potentialEmail)) {
        this.availableEmails.push(potentialEmail);
        theSelect.actions.choose(potentialEmail);
      }
    }
  }
}
