## Added by me (m-azzain) for the sake of simplifying slice1
## This whole file has been added to the sake of slice02, it was not part of odoo.

import logging
from lxml import etree

import odoo
from odoo import http
from odoo.http import request
from odoo.tools import config
from odoo.tools import file_open

_logger = logging.getLogger(__name__)


class Visitor(http.Controller):

    @http.route('/slice02', type='http', auth="none")
    def web_client_temp(self, s_action=None, **kw):
        csrf_script = etree.fromstring(f'<script type="text/javascript">var core = core || {{}};'
                                       f'core.csrf_token="{request.csrf_token()}"</script>')
        with file_open('web/static/slice01-temp/index.html') as f:
            index = etree.HTML(f.read())
            index.find('head').append(csrf_script)
            return etree.tostring(index, encoding='utf8', method='html')

    @http.route('/visitor', type='json', auth="none")
    def person(self):
        values = request.params
        ### assuming that we have a database with the name specified in the config['db_name']
        db = odoo.sql_db.db_connect(config['db_name'])
        try:
            with db.cursor() as cr:
                cr.execute("SELECT * FROM visitors limit 0")
        except:
            ### in this case we assume that the table does not exist
            with db.cursor() as cr:
                cr.execute(f'create table  if not exists visitors(pk int primary key generated always as identity,'
					  f'name varchar, email varchar, phone varchar, message text)')

        with db.cursor() as cr:
            result = cr.execute("INSERT INTO visitors (name, email, phone, message) values(%s, %s, %s, %s)",
                       (values['name'], values['email'], values['phone'], values['message']))
        return result


