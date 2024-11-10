(function (window, undefined) {
    let base_url = localStorage.getItem('base_url') || '';
    let api_key = localStorage.getItem('api_key') || '';

    if (!base_url || !api_key) {
        alert("请先设置Base URL和API Key！");
        window.location.href = 'setting.html';
    }

    window.Asc.plugin.init = function () {
        document.getElementById('generate-content').addEventListener('click', generateContent);
        document.getElementById('translate-text').addEventListener('click', translateText);
        document.getElementById('polish-text').addEventListener('click', polishText);
        document.getElementById('annotate-code').addEventListener('click', annotateCode);
        document.getElementById('chat-with-ai').addEventListener('click', chatWithAI);
    };

    function callTongyiAPI(prompt, callback) {
        fetch(`${base_url}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${api_key}`
            },
            body: JSON.stringify({
                model: "qwen-turbo",
                messages: [
                    {'role': 'system', 'content': 'You are a helpful assistant.'},
                    {'role': 'user', 'content': prompt}
                ],
                temperature: 0.8,
                top_p: 0.8
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                callback("Error: " + data.error);
            } else {
                callback(data.choices[0].message.content);
            }
        })
        .catch(error => {
            console.error("Error calling Tongyi API:", error);
            callback("Error: 无法获取回复");
        });
    }

    function generateContent() {
        const selectedText = document.getElementById('input-area').value;
        if (!selectedText.trim()) {
            alert('请输入关键词！');
            return;
        }
        const prompt = `请根据以下关键词生成相关内容: ${selectedText}`;
        callTongyiAPI(prompt, (response) => {
            document.getElementById('output-area').innerText += '\n\n通义回复：' + response;
        });
    }

    function translateText() {
        const textToTranslate = document.getElementById('input-area').value;
        if (!textToTranslate.trim()) {
            alert('请输入要翻译的内容！');
            return;
        }
        const prompt = `请将以下内容翻译为英文: ${textToTranslate}`;
        callTongyiAPI(prompt, (response) => {
            document.getElementById('output-area').innerText += '\n\n通义回复：' + response;
        });
    }

    function polishText() {
        const textToPolish = document.getElementById('input-area').value;
        if (!textToPolish.trim()) {
            alert('请输入需要润色的内容！');
            return;
        }
        const prompt = `请对以下内容进行润色，使其更加自然和流畅: ${textToPolish}`;
        callTongyiAPI(prompt, (response) => {
            document.getElementById('output-area').innerText += '\n\n通义回复：' + response;
        });
    }

    function annotateCode() {
        const codeToAnnotate = document.getElementById('input-area').value;
        if (!codeToAnnotate.trim()) {
            alert('请输入需要注释的代码！');
            return;
        }
        const prompt = `请对以下代码进行注释，帮助理解每一行代码的作用: ${codeToAnnotate}`;
        callTongyiAPI(prompt, (response) => {
            document.getElementById('output-area').innerText += '\n\n通义回复：' + response;
        });
    }

    function chatWithAI() {
        const userMessage = document.getElementById('input-area').value;
        if (!userMessage.trim()) {
            alert('请输入要发送的消息！');
            return;
        }
        const prompt = `用户: ${userMessage}`;
        callTongyiAPI(prompt, (response) => {
            document.getElementById('output-area').innerText += '\n\n通义回复：' + response;
        });
    }

})(window, undefined);
