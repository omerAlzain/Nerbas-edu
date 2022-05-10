# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

""" OpenERP core library."""


#----------------------------------------------------------
# odoo must be a namespace package for odoo.addons to become one too
# https://packaging.python.org/guides/packaging-namespace-packages/
#----------------------------------------------------------
import pkgutil
import os.path
__path__ = [
    os.path.abspath(path)
    for path in pkgutil.extend_path(__path__, __name__)
]

import sys
assert sys.version_info > (3, 7), "Outdated python version detected, Odoo requires Python >= 3.7 to run."

evented = False

# Is the server running in prefork mode (e.g. behind Gunicorn).
# If this is True, the processes have to communicate some events,
# e.g. database update or cache invalidation. Each process has also
# its own copy of the data structure and we don't need to care about
# locks between threads.
multi_process = False

#----------------------------------------------------------
# libc UTC hack
#----------------------------------------------------------
# Make sure the OpenERP server runs in UTC.
import os
os.environ['TZ'] = 'UTC' # Set the timezone
import time
if hasattr(time, 'tzset'):
    time.tzset()

#----------------------------------------------------------
# Shortcuts
#----------------------------------------------------------
# The hard-coded super-user id (a.k.a. administrator, or root user).
SUPERUSER_ID = 1

from . import addons
from . import modules
from . import service
from . import sql_db
from . import tools
from . import exceptions
from . import netsvc

from . import cli
from . import http