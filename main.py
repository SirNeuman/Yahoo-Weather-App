import os
from flask import Flask, render_template, json

app = Flask(__name__)

@app.route('/')
def root():
    return render_template('index.html')

@app.route('/get-weather-data', methods=["GET"])
def get_weather_data():
	SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
	json_url = os.path.join(SITE_ROOT, "static/data", "weather.json")
	data = json.load(open(json_url))
	return json.dumps(data)

if __name__ == '__main__':
    app.run(debug=True)