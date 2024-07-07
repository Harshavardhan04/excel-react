from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

def format_data(data):
    with_date = datetime.datetime.strptime(data['runDate'], '%Y-%m-%d').date()
    dates_list = [with_date - datetime.timedelta(days=i) for i in range(1, 6)]
    formatted_dates = [date.strftime('%Y-%m-%d') for date in dates_list]

    formatted_data = {
        "run_date": data['runDate'],
        "valuation_out": data['outputType'],
        "output_dir": data['outputDirectory'],
        "remark_curve": data['curveData'],
        "dates_list": formatted_dates
    }
    return formatted_data

@app.route('/submit_form', methods=['POST'])
def submit_form():
    data = request.json
    formatted_data = format_data(data)
    # Process the data here
    send_message(formatted_data)
    return jsonify({"message": "Form submitted successfully"}), 200

def send_message(data):
    # Your existing function to send a message
    print("Sending message with data:", data)

if __name__ == '__main__':
    app.run(debug=True)
ba
