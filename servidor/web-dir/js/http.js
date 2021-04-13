// let pageInfo = null;
let time = 0;

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

// async function load(page) {
// 	$('.http-msg').remove();
// 	let pages = $('.pages').html('');
// 	pageInfo = await $.get(`/api/http-messages?page=${page}`);
// 	const { nPages, pageIndex, messages } = pageInfo;
// 	let a = pageIndex - 3;
// 	let b = pageIndex + 3;
// 	if (a < 0) {
// 		a = 0;
// 		b = pageIndex + 6;
// 	}
// 	if (b >= nPages) {
// 		b = nPages - 1;
// 		a = Math.max(0, b - 7)
// 	}
// 	for (let i=a; i<=b; ++i) {
// 		pages.append(`<input type="button" value="${i+1}"${
// 			i == pageIndex? ' disabled="true"': ''
// 		}>\n`);
// 	}
// 	messages.forEach(addMsg);
// }

async function more() {
	let array = await $.get('/api/http-messages?time=' + time);
	array.forEach((msg) => {
		time = Math.max(time, msg.time);
		addMsg(msg);
	});
}

$(document).ready(async function(){
	// await load(0);
	// $('body').on('click', 'input[type="button"]', async function(){
	// 	let button = $(this);
	// 	if (button.attr('disabled')) {
	// 		return;
	// 	}
	// 	let val = button.val().toLowerCase();
	// 	if (val === 'first') {
	// 		await load(0);
	// 	} else if (val === 'last') {
	// 		await load(pageInfo.nPages - 1);
	// 	} else {
	// 		await load(val - 1);
	// 	}
	// });
	$('#clear').on('click', () => $('.http-msg').remove());
	$('#more').on('click', more);
});
