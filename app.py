from flask import Flask, jsonify, render_template
import random

from data import data_BDeer
app = Flask(__name__)

# fetching data
@app.route("/data/BDeer")
def serve_data():
	data = data_BDeer()
	return data.to_json()

# rendering the main html page
@app.route("/")
def index():
	return render_template("index.html")


if __name__ == "__main__":
	app.run(debug=True)