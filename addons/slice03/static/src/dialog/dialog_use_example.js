/** @odoo-module */

import { Dialog } from "./dialog";
const { Component } = owl;

export class ConfirmationDialog extends Component {
    _cancel() {
        if (this.props.cancel) {
            this.props.cancel();
        }
        console.log('Dialog has been canceled!')
        this.props.close()
    }

    _confirm() {
        if (this.props.confirm) {
            this.props.confirm();
        }
        console.log('Dialog has been confirmed!')
        this.props.close()
    }
}
ConfirmationDialog.template = "web.ConfirmationDialog";
ConfirmationDialog.components = { Dialog };
ConfirmationDialog.props = {
    close: Function,
    title: {
        validate: (m) => {
            return (
                typeof m === "string" || (typeof m === "object" && typeof m.toString === "function")
            );
        },
        optional: true,
    },
    body: String,
    confirm: { type: Function, optional: true },
    cancel: { type: Function, optional: true },
};
ConfirmationDialog.defaultProps = {
    title: "Confirmation",
};