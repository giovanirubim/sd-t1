$(document).ready(function(){
	$('#clear').on('click', async function() {
		await $.post('/api/clear');
	})
});
