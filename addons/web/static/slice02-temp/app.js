
const { useState, useRef } = owl;

class VisitorForum extends owl.Component {
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
    }
    onFailure(reason){
        error = `type: ${reason['type']}, error: ${reason['error']}, textStatus: ${reason['textStatus']}, errorThrown: ${reason['errorThrown']}`;
        this.state.error = error;
    }

}
VisitorForum.template = 'VisitorForum'
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
  const rootApp = new owl.App(VisitorForum);
  rootApp.addTemplates(templates);

  await  rootApp.mount(document.getElementById('slice02'));
}

start();
