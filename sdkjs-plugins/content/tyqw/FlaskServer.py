from flask import Flask, jsonify, request
import os
import requests

app = Flask(__name__)


# API Key 获取接口
@app.route('/get_api_key')
def get_api_key():
    api_key = os.getenv("OPENAI_API_KEY")  # 在环境变量中设置 API Key
    return jsonify(api_key=api_key)


# 与通义 API 交互的接口
@app.route('/ask_tongyi', methods=['POST'])
def ask_tongyi():
    user_message = request.json.get('message')  # 获取用户问题
    api_key = os.getenv("OPENAI_API_KEY")  # 获取 API Key
    if not api_key:
        return jsonify({"error": "API Key not found"}), 500

    api_url = "https://dashscope.aliyuncs.com/compatible-mode/v1"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    body = {
        "model": "qwen-turbo",
        "messages": [
            {'role': 'system', 'content': 'You are a helpful assistant.'},
            {'role': 'user', 'content': user_message}
        ],
        "temperature": 0.8,
        "top_p": 0.8
    }

    response = requests.post(api_url, headers=headers, json=body)

    if response.status_code == 200:
        data = response.json()
        answer = data['choices'][0]['message']['content']
        return jsonify({"response": answer})
    else:
        return jsonify({"error": "Error calling Tongyi API"}), response.status_code


if __name__ == '__main__':
    app.run()
