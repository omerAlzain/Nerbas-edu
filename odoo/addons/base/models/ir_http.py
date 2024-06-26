# Part of Odoo. See LICENSE file for full copyright and licensing details.
#----------------------------------------------------------
# ir_http modular http routing
#----------------------------------------------------------
import base64
import hashlib
import logging
import mimetypes
import os
import re
import sys
import traceback

import werkzeug
import werkzeug.exceptions
import werkzeug.routing
import werkzeug.utils

import odoo
from odoo import api, http, models, tools, SUPERUSER_ID
from odoo.exceptions import AccessDenied, AccessError, MissingError
from odoo.http import request, Response, ROUTING_KEYS, Stream
from odoo.service import security
from odoo.tools import consteq, submap
from odoo.modules.module import get_resource_path, get_module_path

_logger = logging.getLogger(__name__)


class RequestUID(object):
    def __init__(self, **kw):
        self.__dict__.update(kw)


class ModelConverter(werkzeug.routing.BaseConverter):

    def __init__(self, url_map, model=False):
        super(ModelConverter, self).__init__(url_map)
        self.model = model
        self.regex = r'([0-9]+)'

    def to_python(self, value):
        _uid = RequestUID(value=value, converter=self)
        env = api.Environment(request.cr, _uid, request.context)
        return env[self.model].browse(int(value))

    def to_url(self, value):
        return value.id


class ModelsConverter(werkzeug.routing.BaseConverter):

    def __init__(self, url_map, model=False):
        super(ModelsConverter, self).__init__(url_map)
        self.model = model
        # TODO add support for slug in the form [A-Za-z0-9-] bla-bla-89 -> id 89
        self.regex = r'([0-9,]+)'

    def to_python(self, value):
        _uid = RequestUID(value=value, converter=self)
        env = api.Environment(request.cr, _uid, request.context)
        return env[self.model].browse(int(v) for v in value.split(','))

    def to_url(self, value):
        return ",".join(value.ids)


class SignedIntConverter(werkzeug.routing.NumberConverter):
    regex = r'-?\d+'
    num_convert = int


class IrHttp(models.AbstractModel):
    _name = 'ir.http'
    _description = "HTTP Routing"

    #------------------------------------------------------
    # Routing map
    #------------------------------------------------------

    @classmethod
    def _get_converters(cls):
        return {'model': ModelConverter, 'models': ModelsConverter, 'int': SignedIntConverter}

    @classmethod
    def _match(cls, path_info, key=None):
        rule, args = cls.routing_map().bind_to_environ(request.httprequest.environ).match(path_info=path_info, return_rule=True)
        return rule, args

    @classmethod
    def _auth_method_user(cls):
        if request.env.uid is None:
            raise http.SessionExpiredException("Session expired")

    @classmethod
    def _auth_method_none(cls):
        request.env = api.Environment(request.env.cr, None, request.env.context)

    @classmethod
    def _auth_method_public(cls):
        if request.env.uid is None:
            public_user = request.env.ref('base.public_user')
            request.update_env(user=public_user.id)

    @classmethod
    def _authenticate(cls, endpoint):
        auth = 'none' if http.is_cors_preflight(request, endpoint) else endpoint.routing['auth']

        try:
            if request.session.uid is not None:
                if not security.check_session(request.session, request.env):
                    request.session.logout(keep_db=True)
                    request.env = api.Environment(request.env.cr, None, request.session.context)
            getattr(cls, f'_auth_method_{auth}')()
        except (AccessDenied, http.SessionExpiredException, werkzeug.exceptions.HTTPException):
            raise
        except Exception:
            _logger.info("Exception during request Authentication.", exc_info=True)
            raise AccessDenied()

    @classmethod
    def _geoip_resolve(cls):
        return request._geoip_resolve()

    @classmethod
    def _pre_dispatch(cls, rule, args):
        request.dispatcher.pre_dispatch(rule, args)

        # Replace uid placeholder by the current request.env.uid
        for key, val in list(args.items()):
            if isinstance(val, models.BaseModel) and isinstance(val._uid, RequestUID):
                args[key] = val.with_user(request.env.uid)

    @classmethod
    def _dispatch(cls, endpoint):
        result = endpoint(**request.params)
        if isinstance(result, Response) and result.is_qweb:
            result.flatten()
        return result

    @classmethod
    def _post_dispatch(cls, response):
        request.dispatcher.post_dispatch(response)

    @classmethod
    def _handle_error(cls, exception):
        return request.dispatcher.handle_error(exception)

    @classmethod
    def _serve_fallback(cls):
        model = request.env['ir.attachment']
        attach = model.sudo()._get_serve_attachment(request.httprequest.path)
        if attach:
            return Stream.from_attachment(attach).get_response()

    @classmethod
    def _redirect(cls, location, code=303):
        return werkzeug.utils.redirect(location, code=code, Response=Response)

    @classmethod
    def _generate_routing_rules(cls, modules, converters):
        return http._generate_routing_rules(modules, False, converters)

    @classmethod
    def routing_map(cls, key=None):

        if not hasattr(cls, '_routing_map'):
            cls._routing_map = {}
            cls._rewrite_len = {}

        if key not in cls._routing_map:
            _logger.info("Generating routing map for key %s" % str(key))
            installed = request.env.registry._init_modules.union(odoo.conf.server_wide_modules)
            if tools.config['test_enable'] and odoo.modules.module.current_test:
                installed.add(odoo.modules.module.current_test)
            mods = sorted(installed)
            # Note : when routing map is generated, we put it on the class `cls`
            # to make it available for all instance. Since `env` create an new instance
            # of the model, each instance will regenared its own routing map and thus
            # regenerate its EndPoint. The routing map should be static.
            routing_map = werkzeug.routing.Map(strict_slashes=False, converters=cls._get_converters())
            for url, endpoint in cls._generate_routing_rules(mods, converters=cls._get_converters()):
                routing = submap(endpoint.routing, ROUTING_KEYS)
                if routing['methods'] is not None and 'OPTIONS' not in routing['methods']:
                    routing['methods'] = routing['methods'] + ['OPTIONS']
                rule = werkzeug.routing.Rule(url, endpoint=endpoint, **routing)
                rule.merge_slashes = False
                routing_map.add(rule)
            cls._routing_map[key] = routing_map
        return cls._routing_map[key]

    @classmethod
    def _clear_routing_map(cls):
        if hasattr(cls, '_routing_map'):
            cls._routing_map = {}
            _logger.debug("Clear routing map")

    @api.autovacuum
    def _gc_sessions(self):
        http.root.session_store.vacuum()
