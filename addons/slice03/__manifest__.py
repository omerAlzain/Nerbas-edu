{
    'name': 'Slice03',
    'category': 'Website',
    'version': '1.0',
    'author': 'm-azzain',
    'description': """
Odoo Web module.
========================

This module is to practice single page application techniques.
""",
    'depends': ['base', 'web'],
    'auto_install': True,
    'data': [
        'views/index_template.xml',
    ],
    'assets': {
        'slice03.assets_qweb': [
            'slice03/static/src/**/*.xml'
        ],
        'slice03.assets_common': [
            'web/static/lib/underscore/underscore.js',
            'web/static/lib/underscore.string/lib/underscore.string.js',
            'web/static/lib/moment/moment.js',
            'web/static/lib/owl/owl.js',
            'web/static/lib/jquery/jquery.js',
            'web/static/src/legacy/js/promise_extension.js',

            'web/static/lib/bootstrap/css/bootstrap.css',

            'web/static/lib/bootstrap/js/index.js',
            'web/static/lib/bootstrap/js/util.js',
            'web/static/lib/bootstrap/js/alert.js',
            'web/static/lib/bootstrap/js/button.js',
            'web/static/lib/bootstrap/js/carousel.js',
            'web/static/lib/bootstrap/js/collapse.js',
            'web/static/lib/bootstrap/js/dropdown.js',
            'web/static/lib/bootstrap/js/modal.js',
            'web/static/lib/bootstrap/js/tooltip.js',
            'web/static/lib/bootstrap/js/popover.js',
            'web/static/lib/bootstrap/js/scrollspy.js',
            'web/static/lib/bootstrap/js/tab.js',
            'web/static/lib/bootstrap/js/toast.js',

            'web/static/src/boot.js'
        ],

        'slice03.assets': [
            'slice03/static/src/**/*.js',
            'slice03/static/src/**/*.css',
        ]
    },
    'application': True,
    'license': 'LGPL-3',
}