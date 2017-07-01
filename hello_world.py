from flask import Flask
from flask import render_template
from flask import Response

app = Flask(__name__, template_folder='build', static_folder='build/static')


@app.route("/")
def hello():
    return render_template('index.html')

def stream_template(template_name, **context):
    app.update_template_context(context)
    t = app.jinja_env.get_template(template_name)
    rv = t.stream(context)
    rv.enable_buffering(5)
    return rv

@app.route('/my-large-page.html')
def render_large_template():
    rows = xrange(100000)
    return Response(stream_template('test.html', rows=rows))