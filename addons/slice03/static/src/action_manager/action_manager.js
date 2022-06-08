/** @odoo-module **/

import { Service } from '@slice03/service/service'
import { SignIn } from '@slice03/signin/signin'
import { Team } from '@slice03/team/team'
import { About } from '@slice03/about/about'
import { Contact } from '@slice03/contact/contact'
import { Home } from '@slice03/home/home'
import { Event } from '@slice03/event/event'
import { Ap1 } from '@slice03/ap1/ap1'
import { WebApp1 } from '@slice03/WebApp1/WebApp1'
import { C } from '@slice03/c++/c'
import { Info } from '@slice03/info/info'
import { Portfolio } from '@slice03/portfolio/portfolio'

const { Component, xml, onWillDestroy } = owl;

export class ActionManager extends Component {
    setup() {
        this.info = { Component: Home };
        this.onActionManagerUpdate = ({ detail }) => {
            this.info = { Component: ActionManager.components[detail.selectComponent] };
            this.render();
        };
        this.env.bus.addEventListener("ACTION_MANAGER:UPDATE", this.onActionManagerUpdate);
        onWillDestroy(() => {
            this.env.bus.removeEventListener("ACTION_MANAGER:UPDATE", this.onActionManagerUpdate);
        });
    }
}
ActionManager.template = xml`
    <t t-name="ActionManager">
        <div>
            <t t-if="info.Component" t-component="info.Component" t-props="info.componentProps"/>
        </div>
    </t>`;

ActionManager.components = { SignIn,C, WebApp1, Ap1, Team, About, Contact, Event, Home, Portfolio }