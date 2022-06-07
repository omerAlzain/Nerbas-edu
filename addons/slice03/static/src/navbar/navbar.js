/** @odoo-module **/

const { Component } = owl;

export class NavBar extends Component {
    setup(){
        this.onClick = this.onClick.bind(this);
    }
    onClick(selectComponent){
        console.log('The clicked item: ', selectComponent);
        this.env.bus.trigger("ACTION_MANAGER:UPDATE", { selectComponent });
    }
}
NavBar.template = "NavBar"