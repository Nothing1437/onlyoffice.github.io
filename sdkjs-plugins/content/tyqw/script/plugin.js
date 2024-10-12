(function (window, undefined) {
    window.Asc.plugin.init = function () {
        // 绑定按钮事件
        attachEvent('button', 'generate-content', generateContent);
        attachEvent('button', 'translate-text', translateText);
        attachEvent('button', 'polish-text', polishText);
        attachEvent('button', 'annotate-code', annotateCode);
        attachEvent('button', 'chat-with-ai', chatWithAI);
    };

    // 获取 API Key
    function getApiKey() {
        return fetch('/get_api_key')
            .then(response => response.json())
            .then(data => data.api_key)
            .catch(error => {
                console.error("Error fetching API Key:", error);
                return null;
            });
    }

    // 获取选中的文本
    function getSelectedText() {
        return executeMethod('GetSelectedText', []);
    }

    // 与通义服务的交互函数，通用接口
    function callTongyiAPI(prompt, callback) {
        fetch('/ask_tongyi', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: prompt })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                callback("Error: " + data.error);
            } else {
                callback(data.response);
            }
        })
        .catch(error => {
            console.error("Error calling Tongyi API:", error);
            callback("Error: 无法获取回复");
        });
    }

    // 功能1：根据选中的文本生成内容
    function generateContent() {
        getSelectedText().then(selectedText => {
            if (!selectedText || selectedText.trim() === '') {
                alert('请选择要生成内容的关键词！');
                return;
            }
            const prompt = `请根据以下关键词生成相关内容: ${selectedText}`;
            callTongyiAPI(prompt, (response) => {
                callCommand('InsertText', [response]);
            });
        });
    }

    // 功能2：选中文本进行翻译
    function translateText() {
        getSelectedText().then(selectedText => {
            if (!selectedText || selectedText.trim() === '') {
                alert('请选择要翻译的文本！');
                return;
            }
            const prompt = `请将以下文本翻译成英文: ${selectedText}`;
            callTongyiAPI(prompt, (response) => {
                callCommand('InsertText', [response]);
            });
        });
    }

    // 功能3：选中文本进行优化润色
    function polishText() {
        getSelectedText().then(selectedText => {
            if (!selectedText || selectedText.trim() === '') {
                alert('请选择要润色的文本！');
                return;
            }
            const prompt = `请对以下文本进行优化润色: ${selectedText}`;
            callTongyiAPI(prompt, (response) => {
                callCommand('InsertText', [response]);
            });
        });
    }

    // 功能4：为选中的代码添加注释并生成描述性文字
    function annotateCode() {
        const code = getInputHelper().getValue();
        if (!code || code.trim() === '') {
            alert('请输入要添加注释的代码！');
            return;
        }
        const prompt = `请为以下代码添加注释，并生成描述性文字: ${code}`;
        callTongyiAPI(prompt, (response) => {
            callCommand('InsertText', [response]);
        });
    }

    // 功能5：与通义对话
    function chatWithAI() {
        const userMessage = getInputHelper().getValue();
        if (!userMessage || userMessage.trim() === '') {
            alert('请输入要发送的消息！');
            return;
        }
        const prompt = `用户: ${userMessage}`;
        callTongyiAPI(prompt, (response) => {
            callCommand('InsertText', [response]);
        });
    }

    // 添加事件监听器
    function attachEvent(eventName, id, handler) {
        document.getElementById(id).addEventListener(eventName, handler);
    }

    // 发送命令到编辑器
    function callCommand(command, args) {
        window.Asc.plugin[command](...args);
    }

    // 获取输入助手
    function getInputHelper() {
        return window.Asc.scope.getInputHelper();
    }

    window.Asc.plugin.button = function (id) {
        // 按钮事件处理逻辑
    };
})(window, undefined);