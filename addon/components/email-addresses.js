import Component from '@glimmer/component';
import { action } from '@ember/object';
import { isBlank } from '@ember/utils';
import { tracked } from '@glimmer/tracking';

/**
 * Email Addresses - Component that allows you to select multiple email addresses much like outlook
 *
 * @onChange - callback when an email is added or removed
 * @argument selectedEmails - An array of objects that have property of emails.
 *                              This is the list of emails that have been selected
 *
 */

export default class EmailAddressesComponent extends Component {
  get availableEmails() {
    return this.args.availableEmails || [];
  }

  get selectedEmails() {
    return this.args.selectedEmails || [];
  }

  @tracked
  enteredEmailText = '';

  get triggerClass() {
    return 'email-input-trigger ' + this.isEmailValid(this.enteredEmailText)
      ? 'valid'
      : 'invalid';
  }

  isEmailValid(email) {
    return true;
    // return this.args.emailValidationMatcher?.test(email || '');
  }

  @action
  onBlur(theSelect) {
    this.addAndSelectEmail(theSelect);
  }

  @action
  showCreateWhen() {
    return true;
  }

  @action
  onCreate(email) {
    this.addAndSelectEmail({ email: email });
  }

  @action
  onKeydown(theSelect, e) {
    this.enteredEmailText = `${theSelect.searchText}${e.key}`;

    if (
      (e.keyCode === 9 || e.keyCode === 13) &&
      theSelect.isOpen &&
      !theSelect.highlighted &&
      !isBlank(this.enteredEmailText)
    ) {
      this.addAndSelectEmail(theSelect);
    }
  }

  addAndSelectEmail(potentialEmail) {
    let existingOption = this.selectedEmails.find(
      ({ option }) => option.email === potentialEmail
    );
    if (!existingOption) {
      this.availableEmails.push(potentialEmail);
      this.args.onChangeSelected();
    }
  }
}
