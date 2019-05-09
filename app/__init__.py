from flask import Flask
from flask import render_template
from app.modules.utils import cal

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.route("/")
def intro():
    return render_template('index.html')
