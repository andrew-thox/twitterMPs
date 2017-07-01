from flask import session, redirect, url_for, render_template
from flask.ext.socketio import emit
from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper

from . import main

def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

@main.route('/chat')
@crossdomain(origin='*')
def chat():
    """Chat room. The user's name and room must be stored in
    the session."""
    name = 'andrew'
    room = '1234'
    return render_template('chat.html', name=name, room=room)

@main.route('/me')
def me():
    return render_template('index.html')



@main.route('/broadcast')
def broadcast():
    emit('message', {'msg': 'broadcast recieved'}, namespace='/', broadcast=True)
    return "OK", 200
