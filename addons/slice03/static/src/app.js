/** @odoo-module **/

const { EventBus } = owl;
import { WebClient } from '@slice03/webclient/webclient'

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
  const rootApp = new owl.App(WebClient, { env });
  rootApp.addTemplates(templates);
  await  rootApp.mount(document.body);
}

start();
