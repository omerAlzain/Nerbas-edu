/** @odoo-module **/
import { ActionManager } from '@slice03/action_manager/action_manager';
import { WebClient } from '@slice03/webclient/webclient';
const { EventBus } = owl;

function makeEnv() {
    return {
        bus: new EventBus()
    };
}


//------------------------------------------------------------------------------
// Application initialization
//------------------------------------------------------------------------------
async function start() {
  const commit = `https://github.com/odoo/owl/commit/${owl.__info__.hash}`;
  console.info(`This application is using Owl built with the following commit:`, commit);

  const [templates] = await Promise.all([
        odoo.loadTemplatesPromise,
        owl.whenReady()
  ]);

  const env = makeEnv();
  const rootApp = new owl.App(WebClient, { env, dev: true });
  rootApp.addTemplates(templates);
  await  rootApp.mount(document.body);
}

start();
