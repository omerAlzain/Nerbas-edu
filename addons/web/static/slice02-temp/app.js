
const { useState, useRef } = owl;

class VisitorList extends owl.Component {}
VisitorList.template = 'VisitorList'

class SignIn extends owl.Component {}
SignIn.template = "SignIn"

class Course extends owl.Component {}
Course.template = "Course"

class Team extends owl.Component {}
Team.template = "Team"

class Contact extends owl.Component {}
Contact.template = "Contact"

class Service extends owl.Component {}
Service.template = "Service"

class About extends owl.Component {}
About.template = "About"


class ActionManager extends owl.Component {}
ActionManager.template = "ActionManager"
ActionManager.components = { Service, SignIn, Team, About, Contact, Course }


class VisitorForm extends owl.Component {
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

class Visitor extends owl.Component {
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
//------------------------------------------------------------------------------
// Application initialization
//------------------------------------------------------------------------------
async function start() {
  const commit = `https://github.com/odoo/owl/commit/${owl.__info__.hash}`;
  console.info(`This application is using Owl built with the following commit:`, commit);
  const [templates] = await Promise.all([
    owl.loadFile("web/static/slice02-temp/templates.xml"),
    owl.whenReady()
  ]);
  const rootApp = new owl.App(ActionManager);
  rootApp.addTemplates(templates);

  await  rootApp.mount(document.getElementById('action_manager'));
}

start();
