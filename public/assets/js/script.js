/**
 * 腳本內容
 * @author Prk
 */

const ws = new WebSocket(`ws://${BACKEND_URL}`);
const { createApp, ref } = Vue;

const type = ref(TYPE.NONE);

const input = ref('');

const content = ref('');

const messages = ref([]);

ws.onmessage = e => {
    const { data } = e;
    messages.value = [data, ...messages.value];
    if (TYPE.RECEIVER === type.value) copy(data);
};

// TODO: WS 狀態
const status = ref('...');

/**
 * 複製內容
 * @author Prk
 * 
 * @param {string} string 慾要複製的內容
 * 
 * @return {void} 管他複製成功與否呢
 */
const copy = function(string) {
    const tempButton = document.createElement('button');
    document.body.appendChild(tempButton);
    const clipboard = new ClipboardJS(tempButton, { text: () => string });
    tempButton.dispatchEvent(new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    }));
    document.body.removeChild(tempButton);
    clipboard.destroy();
};

/**
 * 發送消息函式
 * @author Prk
 * 
 * @return {void} 這個函數只有操作不會返回任何內容
 */
const send = () => {
    if ('' === content.value) {
        alert('請輸入內容');
        return void 0;
    }

    ws.send(content.value);
    clear();

    // 因為是考慮到局域網部署不會太慢，所以如果要改以後再改【TO不DO】
};

/**
 * 清除
 * @author Prk
 * 
 * @return {void} 清除輸入
 */
const clear = () => content.value = '';

const app = createApp({
    setup() {
        return {
            type,
            input,
            content,
            messages,
            status,
            send,
            copy,
            clear
        };
    }
});

app.mount('#app');
