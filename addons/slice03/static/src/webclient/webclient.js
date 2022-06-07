/** @odoo-module **/

const { Component, useState } = owl;
import { ActionManager } from '@slice03/action_manager/action_manager'
import { NavBar } from '@slice03/navbar/navbar'
import { Ap1 } from '@slice03/ap1/ap1'
import { C } from '@slice03/c++/c'
import { WebA } from '@slice03/WebApp1/WebApp1'

export class WebClient extends Component {

    render(args){
        super.render(args);
    }

    setup(){
        this.state = useState({ user: { loggedIn: false } });
        this.onLogIn = this.onLogIn.bind(this);
        this.onClickAp1 = this.onClickAp1.bind(this);
        this.onClickC = this.onClickC.bind(this);
        this.onClickWeb = this.onClickWeb.bind(this);
        this.env.bus.addEventListener("LOGIN_BUTTON:CLICKED", this.onLogIn);
        this.env.bus.addEventListener("AP1_BUTTON:CLICKED", this.onClickAp1);
        this.env.bus.addEventListener("C_BUTTON:CLICKED", this.onClickC);
        this.env.bus.addEventListener("WEBA_BUTTON:CLICKED", this.onClickWeb);
    }

    onLogIn(){
        this.state.user = { loggedIn: true };
        this.render();
        this.env.bus.trigger("ACTION_MANAGER:UPDATE", { selectComponent: 'Home' });
    }

    onClickAp1(){
        this.render();
        this.env.bus.trigger("ACTION_MANAGER:UPDATE", { selectComponent: 'Ap1' });
    }
    onClickC(){
        this.render();
        this.env.bus.trigger("ACTION_MANAGER:UPDATE", { selectComponent: 'C' });
    }
    onClickWeb(){
        this.render();
        this.env.bus.trigger("ACTION_MANAGER:UPDATE", { selectComponent: 'WebA' });
    }
}
WebClient.components = {
    ActionManager,
    NavBar,
};
WebClient.template = "web.WebClient";
