
from odoo.models import AbstractModel
from odoo.addons.web.controllers.utils import HomeStaticTemplateHelpers
from odoo.http import request

class Http(AbstractModel):
    _inherit = "ir.http"

    def get_frontend_session_info(self):
        qweb_checksum = HomeStaticTemplateHelpers.get_qweb_templates_checksum(debug=request.session.debug, bundle="web.assets_qweb")
        return {'cache_hashes': {'qweb': qweb_checksum}}


