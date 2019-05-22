from flask import Flask, render_template, request, jsonify
import app.modules.mothership as mothership

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

# Intialize controller
controller = mothership.Controller()

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/result/", methods=["GET"])
def result_page():
    return render_template('result.html')

@app.route("/api/request/", methods=['POST', 'GET'])
def request_enterance():
    if request.method == 'POST':
        request_id = request.form.get("request_id")
        request_string = request.form.get("request_string")
        controller.add(request_id, request_string)
    else: # Not a post request
        pass

    return jsonify({"result" : ""})

@app.route("/api/fetch/", methods=["GET"])
def check_status():
    if request.method== 'GET':
        request_id = request.args.get("request_id")
        result = controller.status(request_id)
        response = {
            "result" : result
        }
        return jsonify(response)
    else:
        pass
