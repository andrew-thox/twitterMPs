#!/bin/env python
from app import create_app, socketio
import os

cwd = os.getcwd()

app = create_app(debug=True)
app.template_folder = '/'.join((cwd, 'build'))
app.static_folder = '/'.join((cwd, 'build/static'))



if __name__ == '__main__':
    print(app.template_folder)
    socketio.run(app)
