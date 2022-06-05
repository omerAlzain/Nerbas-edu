/** @odoo-module **/

const { Component } = owl;

export class SignIn extends Component {

    setup(){
        this.onLogIn = this.onLogIn.bind(this);
    }

    onLogIn(event){
        event.stopPropagation();
        event.preventDefault();
        console.log('Log in info: ', { userName: 'John', password: 'pass' });
        this.env.bus.trigger("LOGIN_BUTTON:CLICKED", { userName: 'John', password: 'pass' });
    }
}
SignIn.template = "SignIn"