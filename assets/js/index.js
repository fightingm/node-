window.onload = function() {
	var $time = document.querySelector('.ui-time');
	$time.innerHTML = getTime();
	var timer = setInterval(function () {
		$time.innerHTML = getTime();
	}, 1000);
}

function getTime() {
	var date = new Date();
	var hh = dubble(date.getHours());
	var mm = dubble(date.getMinutes());
	var ss = dubble(date.getSeconds());
	return `${hh}:${mm}:${ss}`;
}
function dubble(n) {
	return n < 10 ? `0${n}` : n;
}