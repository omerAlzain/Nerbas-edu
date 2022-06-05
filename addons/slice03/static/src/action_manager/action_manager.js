/** @odoo-module **/

const { Component, xml, onWillDestroy } = owl;
import { Service } from '@slice03/service/service'
import { SignIn } from '@slice03/signin/signin'
import { Team } from '@slice03/team/team'
import { About } from '@slice03/about/about'
import { Contact } from '@slice03/contact/contact'
import { Course } from '@slice03/course/course'
import { Home } from '@slice03/home/home'

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

ActionManager.components = { Service, SignIn, Team, About, Contact, Course, Home }