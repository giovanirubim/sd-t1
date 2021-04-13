function div() {
	return $(document.createElement('div'));
}

function addMsg(msg) {
	const divMsg = div().addClass('http-msg').html(`
		<span class="endpoint"></span>
		<span class="button req">Requisição</span>
		<span class="button res">Resposta</span>
		<div class="req hidden"></div>
		<div class="res hidden"></div>
	`.trim().replace(/\s*\n\s*/g, ' '));
	divMsg.find('.endpoint').text(msg.endpoint);
	$('body').append(divMsg);
}

$(document).ready(async function(){
	const messages = await $.get('/api/http-messages');
	messages.forEach(addMsg);
});
