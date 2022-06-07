/** @odoo-module **/

const { Component} = owl;

export class Portfolio extends Component {
    setup(){
        this.onClickAp1 = this.onClickAp1.bind(this);
        this.onClickC = this.onClickC.bind(this);
        this.onClickWeb = this.onClickWeb.bind(this);
    }

    onClickAp1(event){
        event.stopPropagation();
        event.preventDefault();
        this.env.bus.trigger("AP1_BUTTON:CLICKED");
    }
    onClickC(event){
        event.stopPropagation();
        event.preventDefault();
        this.env.bus.trigger("C_BUTTON:CLICKED");
    }
    onClickWeb(event){
        event.stopPropagation();
        event.preventDefault();
        this.env.bus.trigger("WEBA_BUTTON:CLICKED");
    }
}
Portfolio.template = "Portfolio"