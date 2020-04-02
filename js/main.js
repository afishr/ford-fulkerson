'use strict'

var graph = null;
var rmgraph = null;
var mxflw = 0;
var i = 0,
	j = 1;

window.addEventListener('keypress', function (e) {
	if (e.keyCode === 32) {
		i = 0;
		j = 1;

		if (source !== null && sink !== null) {
			let els = document.querySelectorAll('.node, .arrow');
			els.forEach(element => {
				var str = element.childNodes[0].value;
				element.childNodes[0].value = Number(str.match(/[^\/]\d*$/ig)[0]);
			})

			graph = makeGraph();
			rmgraph = remakeGraph(graph);
			mxflw = fordFulkerson(rmgraph, (source * 2), (sink * 2) + 1);
			
			animate();
		}
	}
})

function right(e) {
	//right 39
	if (e.keyCode === 39 && i < waves.length) {
		nextStep();
	}

	if (i === waves.length) {
		window.removeEventListener('keydown', right);

		i = 0;
		j = 1;

		alert('Maximum flow is ' + mxflw);
	}
}

function animate() {
	window.addEventListener('keydown', right);
}

function nextStep() {
	const el = waves[i];
	if (j < el.length)
	{
		/* console.log(el[j][0], el[j][1]);
		console.log(el[j][2] + '/' + el[j][3]); */
		console.log('+' + el[j][4]);

		if (el[j][0] === el[j][1]) {
			highlightNode(document.getElementById(el[j][0]), el[j][2], el[j][3]);
		} else if (el[j][0] !== el[j][1]) {
			highlightArrow(document.querySelector('[data-from="' + el[j][0] + '"][data-to="' + el[j][1] + '"]'), el[j][2], el[j][3]);
		}
	}

	j++;

	if (j === el.length + 1) {
		j = 1;
		i++;

		let els = document.getElementsByClassName('highlighted');
		for (let i = 0; i < els.length; i++) {
			const element = els[i];
			setTimeout(() => {
				element.classList.remove('highlighted');
			}, 100);
		}
	}
}