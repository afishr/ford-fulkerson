const R = 30;

var id = 0,
	mouse = false;

const root = document.getElementById('drawing');

function readSingleFile(e) {
	var file = e.target.files[0];
	if (!file) {
		return;
	}
	var reader = new FileReader();
	reader.onload = function (e) {
		var contents = e.target.result;
		displayContents(contents);
	};
	reader.readAsText(file);
}

function displayContents(contents) {
	root.innerHTML = himalaya.stringify(JSON.parse(contents));

	markSource(document.getElementsByClassName('source')[0].id);
	markSink(document.getElementsByClassName('sink')[0].id);

	let nodes = document.querySelectorAll('.node');
  nodes.forEach(function(currentValue) {
		if (id < Number(currentValue.id))
			id = Number(currentValue.id);
	});
	id++;
}

document.getElementById('input-file').addEventListener('change', readSingleFile, false);

function save(filename, text) {
	/*
	* Save a text file locally with a filename by triggering a download
	*/

	var	blob = new Blob([text], { type: 'text/plain' }),
		anchor = document.createElement('a');

	anchor.download = filename;
	anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
	anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
	anchor.click();
}

function double(node) {
	var arrowsto = document.querySelectorAll('[data-to="' + node.id + '"]');
	var arrowsfrom = document.querySelectorAll('[data-from="' + node.id + '"]');

	const nd = document.createElement("div"),
    wrapper = node.parentNode,
    textId = document.createElement("span"),
		textFlow = document.createElement("input");
		
	nd.style.left = 200 + 'px';
	nd.classList.add("node");
	nd.style.width = R * 2 + "px";
	nd.style.height = R * 2 + "px";
	
	nd.id = node.id * 2 + 1;
	node.id = node.id * 2;

	node.childNodes[1].innerText = node.id;
	textId.innerText = nd.id;
  textId.classList.add("node-textId");
            
  textFlow.setAttribute("type", "text");
  textFlow.classList.add("node-flow");
  textFlow.setAttribute("value", 30);

	nd.appendChild(textFlow);
  nd.appendChild(textId);
	wrapper.appendChild(nd);
	
	
}

function createNode(id, posx, posy) {
	const node = document.createElement('div'),
		wrapper = document.createElement('div'),
		textId = document.createElement('span'),
		textFlow = document.createElement('input');

	wrapper.classList.add('wrapper');
	wrapper.style.width = R * 4 + 'px';
	wrapper.style.height = R * 4 + 'px';
	wrapper.style.left = posx + 'px';
	wrapper.style.top = posy + 'px';
	
	node.classList.add('node');
	node.id = id;
	node.style.width = R * 2 + 'px';
	node.style.height = R * 2 + 'px';

	textId.innerText = id;
	textId.classList.add('node-textId');

	textFlow.setAttribute('type', 'text');
	textFlow.classList.add('node-flow');
	textFlow.setAttribute('value', 30);

	node.appendChild(textFlow);
	node.appendChild(textId);
	wrapper.appendChild(node);
	root.appendChild(wrapper);

	return node;
}

function createArrow(from, to) {
	let a = (from.parentNode.offsetLeft - to.parentNode.offsetLeft),
		b = (from.parentNode.offsetTop - to.parentNode.offsetTop),
		angle = Math.atan(b / a) * (180 / Math.PI),
		length = Math.sqrt(a * a + b * b) - R,
		textFlow = document.createElement('input');

	if (a >= 0)
		angle += 180;

	var line = document.createElement('div');

	line.classList.add('arrow');
	line.style.top = from.parentNode.offsetTop + R * 2 + 'px';
	line.style.left = from.parentNode.offsetLeft + R * 2 + 'px';
	line.dataset.from = from.id;
	line.dataset.to = to.id;

	line.style.width = length + 'px';
	line.style.transform = 'rotateZ(' + angle + 'deg)';

	textFlow.setAttribute('type', 'text');
	textFlow.classList.add('node-flow');
	textFlow.setAttribute('value', 20);
	textFlow.style.transform = 'rotateZ(' + -angle + 'deg)';

	line.appendChild(textFlow);
	root.appendChild(line);

	return line;
}

function redrawArrow(arrow) {
	var from = document.getElementById(arrow.dataset.from),
		to = document.getElementById(arrow.dataset.to);

	let a = (from.parentNode.offsetLeft - to.parentNode.offsetLeft),
		b = (from.parentNode.offsetTop - to.parentNode.offsetTop),
		angle = Math.atan(b / a) * (180 / Math.PI),
		length = Math.sqrt(a * a + b * b) - R;

	if (a >= 0)
		angle += 180;

	arrow.style.top = from.parentNode.offsetTop + R * 2 + 'px';
	arrow.style.left = from.parentNode.offsetLeft + R * 2 + 'px';
	arrow.style.width = length + 'px';
	arrow.style.transform = 'rotateZ(' + angle + 'deg)';
	arrow.childNodes[0].style.transform = 'rotateZ(' + -angle + 'deg)';
}

function deleteNode(node) {

	var arrows = document.querySelectorAll('[data-to="' + node.id + '"], [data-from="' + node.id + '"]');
	arrows.forEach(function (currentValue) {
		deleteArrow(currentValue);
	});

	if (node.id < id) {
		for (let i = node.id; i < id; i++) {
			let el = document.getElementById(i);
			el.id--;
			el.childNodes[0].innerText = el.id;
		}
	}
	id--;

	node.remove();
}

function deleteArrow(arrow) {
	arrow.remove();
}

function markSource(id) {
	var el = document.getElementById(id),
		prev = document.getElementsByClassName('source');
	
	if (prev.length > 0) {
		for (let i = 0; i < prev.length; i++) {
			prev[i].classList.remove('source')
		}
	}
	el.classList.remove('sink');
	el.classList.add('source');

	source = Number(id);
}

function markSink(id) {
	var el = document.getElementById(id),
		prev = document.getElementsByClassName('sink');

	if (prev.length > 0) {
		for (let i = 0; i < prev.length; i++) {
			prev[i].classList.remove('sink')
		}
	}

	el.classList.remove('source');
	el.classList.add('sink');

	sink = Number(id);
}

var select = "button-0";
document.getElementById('controls').addEventListener('click', function (e) {
	
		document.querySelectorAll('.button').forEach(function (val) {
			val.classList.remove('active');
		});
		e.target.classList.add('active');
		select = e.target.id;

});

var sel1 = null,
	sel2 = null,
	arrow = false,
	source = null,
	sink = null;

window.addEventListener('click', function(e) {
	switch (select) {
    case "button-0":
      if (e.target.id === "drawing")
        createNode(id++, e.clientX - R * 2, e.clientY - R * 2);
      break;

    case "button-1":
      if (e.target.classList.contains("node")) {
        if (!arrow) {
          sel1 = e.target;
          arrow = true;
        } else {
          sel2 = e.target;
          createArrow(sel1, sel2);
          arrow = false;
        }
      }
      break;

    case "button-2":
      if (e.target.classList.contains("node")) {
        deleteNode(e.target);
      }
      if (e.target.classList.contains("arrow")) {
        deleteArrow(e.target);
      }
      break;

    case "button-3":
      if (e.target.classList.contains("node")) {
        markSource(e.target.id);
      }
      break;

    case "button-4":
      if (e.target.classList.contains("node")) {
        markSink(e.target.id);
      }
      break;

		case "button-5":
			if (root.innerText !== '') {
				let content = JSON.stringify(himalaya.parse(root.innerHTML), null, 2),
					now = new Date(),
					title = now.getFullYear() +
						"" +
						(now.getMonth() + 1 < 10
							? "0" + (now.getMonth() + 1)
							: now.getMonth() + 1) +
						"" +
						(now.getDate() < 10
							? "0" + (now.getDate())
							: now.getDate()) +
						"_" +
						now.getTime()

				save(title + '.json', content);
			} else {
				alert('Graph is empty');
			}
			
      break;

		case "button-6":
			
      break;

    default:
      break;
  }
})

var nodeid;
window.addEventListener('mouseup', function () {
	mouse = false;
	nodeid = null;
	window.removeEventListener('mousemove', move, true);
});

window.addEventListener('mousedown', function (e) {
	if (e.target.classList.contains('node') && e.which === 2) {
		mouse = true;
		nodeid = e.target.id;
		window.addEventListener('mousemove', move, true)
	}
});

function move(e) {
	if (mouse) {
		var arrows = document.querySelectorAll('[data-to="' + e.target.id + '"], [data-from="' + e.target.id + '"]');
		arrows.forEach(function (currentValue) {
			redrawArrow(currentValue);
		});

		document.getElementById(nodeid).parentNode.style.left = e.clientX - R * 2 + 'px';
		document.getElementById(nodeid).parentNode.style.top = e.clientY - R * 2 + 'px';
	}
}

function makeGraph() {
	var matrix = [];
	var length = id;

	for (var i = 0; i < length; i++) {
		var temp = [];

		for (var j = 0; j < length; j++) {
			temp.push(0);
		}
		matrix.push(temp);
	}

	for (var i = 0; i < length; i++) {
		var temp = [];

		var arrows = document.querySelectorAll('[data-from="' + i + '"]');
		arrows.forEach(function (currentValue) {
			matrix[i][currentValue.dataset.to] = Number(currentValue.childNodes[0].value);
		});
		var node = document.getElementById(i);
		matrix[i][i] = Number(node.childNodes[0].value);
	}

	return matrix;
}

function highlightNode(node, flw, gflw) {
	node.classList.add('highlighted');

	node.childNodes[0].value = flw + '/' + gflw;
}

function highlightArrow(arrow, flw, gflw) {
	arrow.classList.add('highlighted');

	arrow.childNodes[0].value = flw + '/' + gflw;
}