/** @odoo-module **/

const { Component, useState } = owl;
import { ActionManager } from '@slice03/action_manager/action_manager'
import { NavBar } from '@slice03/navbar/navbar'

export class WebClient extends Component {

    render(args){
        super.render(args);
    }

    setup(){
        this.state = useState({ user: { loggedIn: false } });
        this.onLogIn = this.onLogIn.bind(this);
        this.env.bus.addEventListener("LOGIN_BUTTON:CLICKED", this.onLogIn);
    }

    onLogIn(){
        this.state.user = { loggedIn: true };
        this.render();
        this.env.bus.trigger("ACTION_MANAGER:UPDATE", { selectComponent: 'Course' });
    }
}
WebClient.components = {
    ActionManager,
    NavBar,
};
WebClient.template = "web.WebClient";