/** @odoo-module **/

const { Component, useState, useRef } = owl;

export class VisitorList extends Component {}
VisitorList.template = 'VisitorList'


export class VisitorForm extends Component {
    setup(){
        this.state = useState({ valid: true, error: '', submitted: false });
        this.onSubmit = this.onSubmit.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
        this.onFailure = this.onFailure.bind(this);
        this.nameRef = useRef("name");
        this.emailRef = useRef("email");
        this.phoneRef = useRef("phone");
        this.messageRef = useRef("message");
    }
    onSubmit(event){
        event.stopPropagation();
        event.preventDefault();
        if (!this.nameRef.el.value || !this.emailRef.el.value ||!this.phoneRef.el.value||!this.messageRef.el.value){
            this.state.valid = false
            return
        }else{
            this.state.valid = true
        }
        console.log(this.nameRef.el.value,this.emailRef.el.value,this.phoneRef.el.value,this.messageRef.el.value);
//        ajax.rpc(url, params, settings)
        let params = {name: this.nameRef.el.value,
        email: this.emailRef.el.value,
        phone: this.phoneRef.el.value,
        message: this.messageRef.el.value};
        let url = `${location.origin}/visitor`;
        ajax.rpc(url, params, {}).then(this.onSuccess, this.onFailure);
    }
    onSuccess(){
        console.log("successfully registered!!");
        this.state.submitted = true;
        this.props.onAddedNewForm();
    }
    onFailure(reason){
        error = `${reason.message}`
        this.state.error = error;
    }
}
VisitorForm.template = 'VisitorForm'

export class Visitor extends Component {
    setup(){
        this.state = useState({ visitors: [] });
        this.onFetch = this.onFetch.bind(this);
        this.fetch = this.fetch.bind(this);
        this.onAddedNewForm = this.onAddedNewForm.bind(this);
        this.fetch();
    }
    fetch(){
        let url = `${location.origin}/read_visitor`;
        //ajax.rpc(url, params, settings)
        ajax.rpc(url, {}, {}).then(this.onFetch, this.onFailure);
    }
    onFetch(result){
        console.log("successfully fetched!!");
        this.state.visitors = result;
    }
    onFailure(reason){
        error = `${reason.message}`
        this.state.error = error;
    }
    onAddedNewForm(){
        this.fetch();
    }
}
Visitor.template = 'Visitor'
Visitor.components = { VisitorList, VisitorForm }
