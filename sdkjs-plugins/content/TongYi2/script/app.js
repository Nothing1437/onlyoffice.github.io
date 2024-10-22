// plugin.js

// 初始化插件
window.Asc.plugin.init = function() {
    let base_url = localStorage.getItem('base_url') || '';
    let api_key = localStorage.getItem('api_key') || '';

    // 检查是否已经设置了 base_url 和 api_key
    if (!base_url || !api_key) {
        alert("请先配置 Base URL 和 API Key！");
        window.Asc.plugin.executeMethod('ShowDialog', ['setting.html']); // 打开配置页面
    }
};

// 发送消息功能
function sendMessage() {
    let message = $('#inputbox').val();
    if (!message) return;

    // 显示用户消息
    $('#chatbox').append('<p>您: ' + message + '</p>');

    // 清空输入框
    $('#inputbox').val('');

    // 发送请求到后端API
    fetch(base_url + '/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + api_key
        },
        body: JSON.stringify({
            model: "qwen-turbo",
            messages: [
                {'role': 'system', 'content': 'You are a helpful assistant.'},
                {'role': 'user', 'content': message}
            ],
            temperature: 0.8,
            top_p: 0.8
        })
    }).then(response => response.json())
       .then(data => {
           let reply = data.choices[0].message.content;
           $('#chatbox').append('<p>通义千问: ' + reply + '</p>');
       })
       .catch(error => {
           $('#chatbox').append('<p>请求失败，请检查您的 Base URL 和 API Key。</p>');
       });
}

// 处理插件按钮事件
window.Asc.plugin.button = function(id) {
    if (id === 'sendBtn') {
        sendMessage();
    }
};

// 设置按钮点击事件
$('#sendBtn').on('click', function() {
    sendMessage();
});
