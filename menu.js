var c = document.getElementById("mainmenu");
var ctx = c.getContext("2d");
ctx.fillStyle = "#FF0000";
ctx.fillRect(0, 0, 600, 600);
c.addEventListener('click', ctx.clearRect(0, 0, 600, 600));

