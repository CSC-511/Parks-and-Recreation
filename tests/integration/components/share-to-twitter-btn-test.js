import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | share-to-twitter-btn', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<ShareToTwitterBtn />`);
    assert.dom('[data-test=share-to-twitter-btn]').exists('ShareToTwitterBtn renders');
  });
});
