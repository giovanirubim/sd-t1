let index = 0;

const addMessage = (message) => {
	const msg = $(document.createElement('div'));
	msg.text(message);
	msg.addClass('msg');
	$('#messages').append(msg);
};

const reload = async () => {
	const messages = await $.get('/api/messages?skip=' + index);
	messages.forEach(addMessage);
	index += messages.length;
};

$(document).ready(async function(){
	const inputMessage = $('input[type="text"]');
	$('input[type="button"]').on('click', async function(){
		const message = inputMessage.val().trim();
		if (!message) {
			return;
		}
		await $.ajax({
			method: 'POST',
			url: '/api/messages',
			data: message,
			contentType: 'text/plain; charset=utf-8',
		});
		inputMessage.val('');
		await reload();
	});
	await reload();
});
