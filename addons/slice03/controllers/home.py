
import logging

from odoo import http
from odoo.addons.web.controllers.home import Home
from odoo.http import request

_logger = logging.getLogger(__name__)


class HomeSlice03(Home):

    @http.route('/', type='http', auth="none")
    def index(self):
        response = request.render('slice03.index', qcontext={})
        return response
