import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import {
  collection,
  create,
  isVisible,
  triggerable,
} from 'ember-cli-page-object';
import {
  clickTrigger,
  selectChoose as powerSelectChoose,
} from 'ember-power-select/test-support/helpers';

const page = create({
  selectEmails: {
    scope: '[data-test-email-select]',
    isVisible: isVisible(),
    input: {
      scope: '.ember-power-select-trigger-multiple-input',
      enter: triggerable('keydown', '', { eventProperties: { keyCode: 13 } }),
    },
    selected: collection('.ember-power-select-multiple-options li', {
      removeBtn: { scope: '.ember-power-select-multiple-remove-btn' },
    }),
  },
  options: collection('.ember-power-select-options li'),
});

module('Integration | Component | select-multiple-emails', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.availableEmails = ['foo@bar.com', 'bar@foo2.com'];
    this.emailValidationMatcher = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  });

  test('Component excepts a list of emails for options', async function (assert) {
    await render(hbs`<EmberEmailAddresses@EmailAddresses
                          @availableEmails={{this.availableEmails}}
                          @emailValidationMatcher={{this.emailValidationMatcher}}
                          @onChangeSelected={{noop}}
                        />`);

    await clickTrigger(page.selectEmails.scope);

    assert.equal(page.options.length, 2, 'Two existing emails in options');
  });

  test('Component excepts a list of pre-selected emails', async function (assert) {
    this.selectedEmails = ['foo@bar.com'];

    await render(hbs`<EmberEmailAddresses@EmailAddresses
                        @availableEmails={{this.availableEmails}}
                        @selectedEmails={{this.selectedEmails}}
                        @emailValidationMatcher={{this.emailValidationMatcher}}
                        @onChangeSelected={{noop}}
                      />`);
    await clickTrigger(page.selectEmails.scope);

    assert.equal(
      page.selectEmails.selected.length,
      1,
      'One pre-selected email'
    );
  });

  test('Sends onChange to parent', async function (assert) {
    assert.expect(1);

    this.set('onChangeSelectedSpy', (selected) => {
      assert.equal(
        selected[0],
        'bar@foo2.com',
        'Called onChange with selected email option'
      );
    });

    await render(hbs`<EmberEmailAddresses@EmailAddresses
                        @availableEmails={{this.availableEmails}}
                        @onChangeSelected={{this.onChangeSelectedSpy}}
                        @emailValidationMatcher={{this.emailValidationMatcher}}
                      />`);
    await clickTrigger(page.selectEmails.scope);
    await powerSelectChoose(
      page.selectEmails.scope,
      '.ember-power-select-option',
      1
    );
  });
});
