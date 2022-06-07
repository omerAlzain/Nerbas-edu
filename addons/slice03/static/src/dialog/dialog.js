/** @odoo-module **/

const { Component, useRef, useState } = owl;

export class Dialog extends Component {
    setup() {
        this.modalRef = useRef("modal");
        this.close = this.close.bind(this);
    }

    close(){
        console.log('Close dialog clicked!');
    }
}
Dialog.template = "web.Dialog";
Dialog.props = {
    close: Function,
    contentClass: { type: String, optional: true },
    fullscreen: { type: Boolean, optional: true },
    footer: { type: Boolean, optional: true },
    header: { type: Boolean, optional: true },
    size: { type: String, optional: true, validate: (s) => ["sm", "md", "lg", "xl"].includes(s) },
    technical: { type: Boolean, optional: true },
    title: { type: String, optional: true },
    slots: {
        type: Object,
        shape: {
            default: Object, // Content is not optional
            footer: { type: Object, optional: true },
        },
    },
};
Dialog.defaultProps = {
    contentClass: "",
    fullscreen: false,
    footer: true,
    header: true,
    size: "lg",
    technical: true,
    title: "Odoo",
};
