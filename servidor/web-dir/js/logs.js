let time = Date.now();

function div() {
	return $(document.createElement('div'));
}

function addMsg(msg) {
	const divMsg = div().addClass('http-msg').html(`
		<span class="endpoint"></span>
		<span class="button req">Requisição</span>
		<span class="button res">Resposta</span>
		<span class="button close">Ocultar</span>
		<div class="content hidden">
			<div class="msg-wrap req hidden">
				<div class="block"></div>
			</div>
			<div class="msg-wrap res hidden">
				<div class="block"></div>
			</div>
		</div>
	`.trim().replace(/\s*\n\s*/g, ' '));
	divMsg.find('.endpoint').text(msg.endpoint);
	const content = divMsg.find('.content');
	$('.message-list').append(divMsg);
	['req', 'res'].forEach((name) => {
		const block = divMsg.find(`.msg-wrap.${name} .block`);
		const data = msg[name];
		let text = data.header;
		if (data.body) {
			text += '\n\n' + data.body;
		}
		text = text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/\t/g, '&nbsp;&nbsp;')
			.replace(/\n/g, '<br>');
		block[0].innerHTML = text;
		divMsg.find(`.button.${name}`).on('click', function(){
			block.parent().toggleClass('hidden');
			let show = divMsg
				.find('.msg-wrap')
				.toArray()
				.map((item) => !$(item).hasClass('hidden'))
				.reduce((a, b) => a || b);
			if (show) {
				content.removeClass('hidden');
			} else {
				content.addClass('hidden');
			}
		});
	});
	divMsg.find('.button.close').on('click', function(){
		divMsg.find('.msg-wrap, .content').addClass('hidden');
	});
}

function clear() {
	$('.http-msg').remove();
}

async function more() {
	let array = await $.get('/api/http-messages?time=' + time);
	array.forEach((msg) => {
		time = Math.max(time, msg.time);
		addMsg(msg);
	});
}

$(document).ready(async function(){
	$('#more').on('click', () => {
		clear();
		more();
	});
});
