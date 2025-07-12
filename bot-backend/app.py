from flask import Flask, request, jsonify
from utils.db import get_database
from intents.analytics import handle_analytics_query 
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/bot-api/webhook', methods=['POST'])
def bot_webhook():
    try:
        payload = request.get_json()
        print("Request received from frontend:", payload)

        if 'action' not in payload:
            raise KeyError("'action' field is missing in the payload.")

        action = payload['action']
        message = payload.get('message', '')
        user_id = payload.get('userId', 'Unknown User')

        if action == "processMessage":
            response = handle_analytics_query(message)
            return jsonify({"reply": response})

        elif action == "getBotDetails":
            bot_details = {
                "_id": "bot",
                "name": "Admin Bot",
                "role": "bot"
            }
            return jsonify(bot_details)

        return jsonify({"error": f"Unsupported action: {action}"}), 400

    except KeyError as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print("Unexpected Error:", str(e))
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == "__main__":
    app.run(debug=True)
