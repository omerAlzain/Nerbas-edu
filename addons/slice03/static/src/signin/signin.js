/** @odoo-module **/

const { Component, useState } = owl;
import { ConfirmationDialog } from '@slice03/dialog/dialog_use_example';
import { Dialog } from '@slice03/dialog/dialog'

export class SignIn extends Component {

    setup(){
        this.state = useState({ displayDialog: false });
        this.onLogIn = this.onLogIn.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    onLogIn(event){
        event.stopPropagation();
        event.preventDefault();
        console.log('Log in info: ', { userName: 'John', password: 'pass' });
        this.env.bus.trigger("LOGIN_BUTTON:CLICKED", { userName: 'John', password: 'pass' });
    }
    openDialog(){
        event.stopPropagation();
        event.preventDefault();
        this.state.displayDialog = true;
    }
    closeDialog(){
        this.state.displayDialog = false;
    }
}
SignIn.template = "SignIn"
SignIn.components = { ConfirmationDialog, Dialog }