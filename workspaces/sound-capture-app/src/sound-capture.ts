import { api } from './sound-capture.preload';

const button = document.createElement('button');
document.body.appendChild(button);
button.addEventListener('click', () => {
	api.sendMessage('test');
});

const messageOutput = document.createElement('div');
document.body.appendChild(messageOutput);
api.readMessage((message) => {
	const text = messageOutput.innerText;
	messageOutput.innerText = `${text}\n${message}`;
});
