class AppDock extends CustomElement {
	
	static tagName = 'app-dock';
	static bound = {};
	
	constructor(option) {
		
		super(option);
		
	}
	appendApp(app) {
		
		return (app = AppNode.from(app), this.querySelector('dock-container')?.appendChild(app));
		
	}
	prependApp(app) {
		
		return (app = AppNode.from(app), this.querySelector('dock-container')?.prepend(app), app);
		
	}
	removeApps() {
		
		const containers = this.querySelectorAll('dock-container');
		let i;
		
		i = -1;
		while (containers[++i]) containers[i].removeApps();
		
	}
	
}
class DockCtrl extends CustomElement {
	
	static tagName = 'dock-ctrl';
	static once = { once: true };
	static bound = {
		
		clickedImportButton(event) {
			
			const	inputNode = document.createElement('input-node');
			
			this.q('#import').setAttribute('disabled', ''),
			
			inputNode.id = crypto.randomUUID(),
			inputNode.set(this.importNodeData),
			
			inputNode.addEvent(undefined, inputNode.id + '-import-click', this.emittedImport),
			inputNode.addEvent(undefined, inputNode.id + '-cancel-click', this.emittedCancel),
			inputNode.addEvent(this, 'destroyed', () => inputNode.destroy(), DockCtrl.once),
			this.addEvent(inputNode, 'destroyed', this.emittedDestroyed, DockCtrl.once);
			
		},
		clickedRemoveButton(event) {
			
			this.closest('app-dock')?.removeApps();
			
		},
		
		emittedImport(event) {
			
			const data = fromJSON(event.target.value);
			
			if (data === undefined) {
				alert('Input string is not JSON.');
				return;
			}
			
			this.closest('app-dock')?.prependApp(data),
			
			event.target.destroy();
			
		},
		emittedCancel(event) {
			
			event.target.destroy();
			
		},
		emittedDestroyed(event) {
			
			this.q('#import').removeAttribute('disabled');
			
		}
		
	};
	
	constructor(option) {
		
		super(option),
		
		this.importNodeData = {
			title: 'Import an App from JSON',
			placeholder: 'Input an app JSON.',
			buttons: [
				{ id: 'import', data: { contents: 'Import' } },
				{ id: 'cancel', data: { contents: 'Cancel' } }
			],
			width: '50%', height: '50%',
			left: 'center', top: 'center',
			parent: document.body
		},
		
		this.addEvent(this.q('#import'), 'click', this.clickedImportButton),
		this.addEvent(this.q('#remove'), 'click', this.clickedRemoveButton);
		
	}
	
}
class DockContainer extends CustomElement {
	
	static tagName = 'dock-container';
	static bound = {};
	
	constructor(option) {
		
		super(option);
		
	}
	removeApps() {
		
		const apps = this.querySelectorAll(':scope > app-node');
		let i;
		
		i = -1;
		while (apps[++i]) apps[i].kill();
		
	}
	
}

class AppNode extends CustomElement {
	
	static tagName = 'app-node';
	static from(data) {
		
		if (data instanceof AppNode) return data;
		
		const	node = document.createElement('app-node');
		let i;
		
		node.append(document.createElement('app-ctrl'), document.createElement('app-container'));
		
		if (
			data &&
			typeof data === 'object' &&
			!Array.isArray(data) &&
			data.type === 'app' &&
			data.nodes &&
			typeof data.nodes === 'object'
		) {
			hi();
			i = -1, Array.isArray(data.nodes) || (data.nodes = [ data.nodes ]);
			while (data.nodes[++i]) node.addBenchNode(data.nodes[i]);
			
		}
		
		return node;
		
	}
	
	constructor(option) {
		
		super(option);
		
	}
	kill() {
		
		const	ctrls = this.querySelectorAll('app-ctrl'),
				containers = this.querySelectorAll('app-container');
		let i;
		
		i = -1;
		while (ctrls[++i]) ctrls[i].destroy();
		i = -1;
		while (containers[++i]) containers[i].kill();
		
		this.destroy();
		
	}
	addBenchNode(data) {
		
		return this.querySelector('app-container')?.appendChild(BenchNode.from(data));
		
	}
	removeAll() {
		
		const benches = this.querySelector('app-container')?.getBenchNodes();
		let i;
		
		if (!benches) return;
		
		i = -1;
		while (benches[++i]) benches[i]?.kill?.();
		
	}
	toJSON() {
		
		const	benches = this.querySelector('app-container')?.getBenchNodes(),
				data = { type: 'app', date: { exported: new Date() }, nodes: [] };
		let i;
		
		if (benches) {
			i = -1;
			while (benches[++i]) data.nodes[i] = benches[i].toJSON();
		}
		
		
		return data;
		
	}
	
}
class AppCtrl extends CustomElement {
	
	static tagName = 'app-ctrl';
	static once = { once: true };
	static bound = {
		
		emittedImport(event) {
			
			const data = fromJSON(event.target.value);
			
			if (data === undefined) {
				alert('Input string is not JSON.');
				return;
			}
			
			this.closest('app-node')?.addBenchNode(data),
			
			event.target.destroy();
			
		},
		emittedCancel(event) {
			event.target.destroy();
		},
		emittedDestroyed(event) {
			this.q('#import').removeAttribute('disabled'),
			this.removeEvent(event.target, 'destroyed', this.emittedDestroyed);
		},
		clickedAddButton() {
			this.closest('app-node')?.addBenchNode();
		},
		promisedCopyButton(event) {
			
			navigator.clipboard.writeText(JSON.stringify(this.closest('app-node')?.toJSON(), null, '\t')).then(() => event.detail.resolve());
			
		},
		clickedImportButton() {
			
			const	inputNode = document.createElement('input-node');
			
			this.q('#import').setAttribute('disabled', ''),
			
			inputNode.id = crypto.randomUUID(),
			inputNode.set(this.importNodeData),
			
			inputNode.addEvent(undefined, inputNode.id + '-import-click', this.emittedImport),
			inputNode.addEvent(undefined, inputNode.id + '-cancel-click', this.emittedCancel),
			
			inputNode.addEvent(this, 'destroyed', () => inputNode.destroy(), AppCtrl.once),
			this.addEvent(inputNode, 'destroyed', this.emittedDestroyed, AppCtrl.once);
			
		},
		clickedRemoveNodesButton() {
			this.closest('app-node')?.removeAll();
		},
		clickedRemoveButton(event) {
			
			this.closest('app-node')?.kill();
			
		}
		
	};
	
	constructor(option) {
		
		super(option),
		
		this.importNodeData = {
			title: 'Import a Node from JSON',
			placeholder: 'Input a node JSON.',
			buttons: [
				{ id: 'import', data: { contents: 'Import' } },
				{ id: 'cancel', data: { contents: 'Cancel' } }
			],
			width: '50%', height: '50%',
			left: 'center', top: 'center',
			parent: document.body
		},
		
		this.addEvent(this.q('#add'), 'click', this.clickedAddButton),
		this.q('#copy').setAttribute('promise', ''),
		this.addEvent(this.q('#copy'), 'promised', this.promisedCopyButton),
		this.addEvent(this.q('#import'), 'click', this.clickedImportButton),
		this.addEvent(this.q('#remove-nodes'), 'click', this.clickedRemoveNodesButton),
		this.addEvent(this.q('#remove'), 'click', this.clickedRemoveButton);
		
	}
	
}
class AppContainer extends CustomElement {
	
	static tagName = 'app-container';
	static bound = {
	};
	
	constructor(option) {
		
		super(option);
		
	}
	getBenchNodes() {
		return this.querySelectorAll('bench-node');
	}
	kill() {
		
		const benches = this.querySelectorAll('bench-node');
		let i;
		
		while (benches[++i]) benches[i].kill();
		
	}
	
}

class BenchNode extends CustomElement {
	
	static tagName = 'bench-node';
	static README =	'You can use the following arguments in your script.\n' +
							'i - current loop increment\n' +
							'l - loop length for the script\n\n' +
							'The properties of the object returned from your script would be passed as arguments to all backward scripts. The object will be merged backward. Note that the order of your arguments cannot be specified. Using the property name as a variable is recommended.\n\n' +
							'There are a lot of the global variables in this app unfortunately. If something goes into wrong in your script, try to rename your variable.\n\n' +
							'No fail safe. Be careful to edit and execute.';
	static once = { once: true };
	static from(data) {
		
		const node = document.createElement('bench-node');
		let i;
		
		if (data && typeof data === 'object' && !Array.isArray(data) && data.type === 'node') {
			
			node.label &&= data?.label;
			
			const scriptNodes = node.qq('#codes > bench-textarea');
			
			i = -1;
			while (scriptNodes[++i]) scriptNodes[i].remove();
			
			if (data.scripts && typeof data.scripts === 'object') {
				
				i = -1, Array.isArray(data.scripts) || (data.scripts = [ data.scripts ]);
				while (data.scripts[++i]) node.addScript(data.scripts[i], node.q('#add'));
				
			}
			
		}
		
		return node;
		
	}
	static bound = {
		
		clickedAddButton(event) {
			
			this.addScript(null, event.target);
			
		},
		promisedCopyButton(event) {
			
			navigator.clipboard.writeText(JSON.stringify(this.toJSON(), null, '\t')).then(() => event.detail.resolve());
			
		},
		clickedImportButton() {
			
			const	inputNode = document.createElement('input-node');
			
			this.q('#import').setAttribute('disabled', ''),
			
			inputNode.id = crypto.randomUUID(),
			inputNode.set(this.importNodeData),
			
			inputNode.addEvent(undefined, inputNode.id + '-import-click', this.emittedImport),
			inputNode.addEvent(undefined, inputNode.id + '-cancel-click', this.emittedCancel),
			
			inputNode.addEvent(this, 'destroyed', () => inputNode.destroy(), BenchNode.once),
			this.addEvent(inputNode, 'destroyed', this.emittedDestroyed, BenchNode.once);
			
		},
		clickedRemoveButton() {
			
			this.kill();
			
		},
		clickedRunButton() {
			
			this.run();
			
		},
		
		emittedImport(event) {
			
			const data = fromJSON(event.target.value);
			
			if (data === undefined) {
				alert('Input string is not JSON.');
				return;
			}
			
			this.addScript(data, this.q('#add')),
			
			event.target.destroy();
			
		},
		emittedCancel(event) {
			event.target.destroy();
		},
		emittedDestroyed(event) {
			this.q('#import').removeAttribute('disabled'),
			this.removeEvent(event.target, 'destroyed', this.emittedDestroyed);
		},
		
	};
	
	get label() { return this.querySelector('[slot="caption"]')?.textContent; }
	set label(v) {
		
		let captionNode;
		
		(captionNode = this.querySelector('[slot="caption"]')) || (
				captionNode = document.createElement('span'),
				captionNode.slot = 'caption',
				this.appendChild(captionNode)
			),
		
		captionNode.textContent = v;
		
	}
	
	constructor(option) {
		
		super(option);
		
		this.importNodeData = {
			title: 'Import a Script from JSON',
			placeholder: 'Input a script JSON.',
			buttons: [
				{ id: 'import', data: { contents: 'Import' } },
				{ id: 'cancel', data: { contents: 'Cancel' } }
			],
			width: '50%', height: '50%',
			left: 'center', top: 'center',
			parent: document.body
		},
		
		this.addEvent(this.q('#add'), 'click', this.clickedAddButton),
		this.q('#copy').setAttribute('promise', ''),
		this.addEvent(this.q('#copy'), 'promised', this.promisedCopyButton),
		this.addEvent(this.q('#import'), 'click', this.clickedImportButton),
		this.addEvent(this.q('#remove'), 'click', this.clickedRemoveButton),
		this.addEvent(this.q('#run'), 'click', this.clickedRunButton),
		
		this.q('#codes').dataset.readme = BenchNode.README;
		
	}
	connectedCallback() {
		
		this.querySelector('[slot="caption"]') ||
			(this.label = this.closest('app-container')?.children.length);
		
	}
	addScript(data, insert) {
		
		const container = this.q('#codes');
		
		if (!container) return;
		
		const	node = BenchTextarea.from(data);
		
		return insert ? container.insertBefore(node, insert) : container.appendChild(node);
		
	}
	run(arg = {}) {
		
		const codes = this.qq('#codes > bench-textarea'), report = { data: [], time: 0 };
		let i;
		
		i = -1;
		while (codes[++i])
			report.time += (report.data[i] = codes[i].run(arg)).time,
			isObj(report.data[i].returnValue) && (arg = { ...arg, ...report.data[i].returnValue });
		
		this.q('#result').textContent =
			report.time < 1000 ? `${report.time}ms` : `${report.time / 1000}s`;
		
		return report;
		
	}
	kill() {
		
		const textareas = this.qq('bench-textarea');
		let i;
		
		i = -1;
		while (textareas[++i]) textareas[i].destroy();
		
		this.destroy();
		
	}
	toJSON() {
		
		const	codes = this.qq('#codes > bench-textarea'),
				data = { type: 'node', date: { exported: new Date() }, label: this.label, scripts: [] };
		let i;
		
		i = -1;
		while (codes[++i]) data.scripts[i] = codes[i].toJSON();
		
		return data;
		
	}
	
}
class BenchTextarea extends CustomElement {
	
	static tagName = 'bench-textarea';
	static from(data) {
		
		const node = document.createElement('bench-textarea');
		
		(data && typeof data === 'object' && !Array.isArray(data) && data.type === 'script') &&
			(node.length = data.length, node.value = data.script);
		
		return node;
		
	};
	static bound = {
		pressedKey(event) {
			switch (event.key) {
				case 'Tab':
				event.preventDefault(),
				document.execCommand('insertText', false, '  ');
				break;
			}
		},
		clickedRunButton() {
			this.run();
		},
		promisedCopyButton(event) {
			
			navigator.clipboard.writeText(JSON.stringify(this.toJSON(), null, '\t')).then(() => event.detail.resolve());
			
		},
		clickedClearButton() {
			this.q('#value').value = '';
		},
		clickedRemoveButton() {
			this.destroy();
		}
	};
	get value() { return this.q('#value').value; }
	set value(v) { this.q('#value').value = v; }
	get length() {
		const l = this.q('#length').value;
		let l0;
		return l === '' ? 1 : Number.isNaN(l0 = +l) ? l : l0;
	}
	set length(v) { this.q('#length').value = v; }
	get readme() { return this.q('#value').getAttribute('placeholder'); }
	set readme(v) { this.q('#value').setAttribute('placeholder', v); }
	
	constructor(option) {
		
		super(option);
		
		this.readme = this.dataset.readme,
		
		this.q('#length').placeholder = 'Length',
		
		this.addEvent(this.q('#value'), 'keydown', this.pressedKey),
		this.addEvent(this.q('#run'), 'click', this.clickedRunButton),
		this.q('#copy').setAttribute('promise', ''),
		this.addEvent(this.q('#copy'), 'promised', this.promisedCopyButton),
		this.addEvent(this.q('#clear'), 'click', this.clickedClearButton),
		this.addEvent(this.q('#remove'), 'click', this.clickedRemoveButton);
		
	}
	connectedCallback() {
		
		const container = this.closest('#codes');
		
		this.readme = container?.dataset.readme ?? '';
		
	}
	
	run(arg) {
		
		const func = new Function('i','l', ...Object.keys(arg ?? (arg = {})), this.value), report = {};
		let i,l, returnValue;
		
		i = -1, l = this.length, report.time = performance.now();
		while (++i < l) returnValue = func(i,l, ...Object.values(arg));
		report.time = performance.now() - report.time;
		
		this.q('#result').textContent =
			report.time < 1000 ? `${report.time}ms` : `${report.time / 1000}s`,
		report.returnValue = returnValue;
		
		return report;
		
	}
	
	toJSON() {
		
		return { type: 'script', date: { exported: new Date() }, length: this.length, script: this.value };
		
	}
	
}

class InputNode extends CustomElement {
	
	static tagName = 'input-node';
	static bound = {
		clickedButton(event) {
			
			this.emit(`${this.id}-${(event.target.assignedSlot ? event.target.assignedSlot : event.target).closest('button').id}-${event.type}`, event);
			
		},
		clickedPositiveButton(event) {
			this.emit('positive', event);
		},
		clickedNegativeButton(event) {
			this.emit('negative', event);
		},
		pressedHeader(event) {
			
			//event.preventDefault(),
			
			this.classList.add('moving'),
			this.addEvent(window, 'mousemove', this.moved),
			this.addEvent(window, 'mouseup', this.releasedHeader);
			
		},
		moved(event) {
			
			let mx,my;
			
			Number.isNaN(mx = parseInt(this.style.getPropertyValue('--movement-x'))) && (mx = 0),
			Number.isNaN(my = parseInt(this.style.getPropertyValue('--movement-y'))) && (my = 0),
			
			this.style.setProperty('--movement-x', mx + event.movementX + 'px'),
			this.style.setProperty('--movement-y', my + event.movementY + 'px');
			
		},
		releasedHeader(event) {
			
			this.classList.remove('moving'),
			this.removeEvent(window, 'mouseup', this.releasedHeader),
			this.removeEvent(window, 'mousemove', this.moved);
			
		}
	};
	get placeholder() { return this.q('#value').placeholder; }
	set placeholder(v) { this.q('#value').placeholder = v; }
	get value() { return this.q('#value').value; }
	set value(v) { this.q('#value').value = v; }
	
	constructor(option) {
		
		super(option);
		
		this.addEvent(this.q('#header'), 'mousedown', this.pressedHeader),
		this.addEvent(this.q('#positive'), 'click', this.clickedPositiveButton),
		this.addEvent(this.q('#negative'), 'click', this.clickedNegativeButton);
		
	}
	
	set(data) {
		
		data && typeof data === 'object' && (
				this.setTitle(data.title),
				this.placeholder = data.placeholder,
				this.setButtons(...data.buttons),
				this.setSize(data.width || '0', data.height || '0'),
				data.parent instanceof HTMLElement && data.parent.appendChild(this),
				this.setPosition(data.left ?? 'center', data?.top ?? 'center')
			);
		
		return this;
		
	}
	setButtons(...data) {
		
		const buttons = [];
		let i,button;
		
		i = -1;
		while (data[++i]) (button = this.setButton(data[i])) && (
				Array.isArray(button) ?
					(buttons = [ ...buttons, ...button ]) : (buttons[buttons.length] = button)
			);
		
		return buttons;
		
	}
	setButton(datum) {
		
		if (!datum || typeof datum !== 'object') return;
		
		if (Array.isArray(datum)) return this.setButtons(...datum);
		
		const	button = document.createElement('button', { is: 'emission-button' }),
				slot = document.createElement('slot');
		
		button.type = 'button',
		button.id = slot.name = datum.id,
		this.addEvent(button, 'click', this.clickedButton),
		
		this.appendSlottedNode(button.id, datum.data),
		
		button.appendChild(slot),
		this.q('#buttons').appendChild(button);
		
		return button;
		
	}
	setPosition(left, top) {
		
		if (left === 'center' || 'right' === 'center') {
			
			const rect = this.getBoundingClientRect();
			
			left === 'center' && (left = `calc((100% - ${rect.width}px) / 2)`),
			top === 'center' && (top = `calc((100% - ${rect.height}px) / 2)`);
			
		}
		
		typeof left === 'number' && (left += 'px'),
		typeof top === 'number' && (top += 'px'),
		
		this.style.setProperty('--movement-x', '0px'),
		this.style.setProperty('--movement-y', '0px'),
		this.style.setProperty('--left', left),
		this.style.setProperty('--top', top);
		
	}
	setSize(width, height, responsible) {
		
		let w,h, handler;
		
		typeof width === 'number' &&
			(width = document.documentElement.clientWidth * (w = width) + 'px'),
		typeof height === 'number' &&
			(height = document.documentElement.clientHeight * (h = height) + 'px'),
		
		(w === undefined && h === undefined) || !responsible || (
			this.addEvent(
					window,
					'resize',
					handler = event => (
						this.removeEvent(event.target, event.type, handler),
						this.setSize(w || width, h || height)
					)
				)),
		
		this.style.setProperty('--width', width),
		this.style.setProperty('--height', height);
		
	}
	setTitle(title) {
		
		return this.appendSlottedNode('title', { contents: title });
		
	}
	setSlottedContent(name, value, data) {
		
		return this.appendSlottedNode(name, data).textContent = value;
		
	}
	appendSlottedNode(name, data) {
		
		const node =	this.querySelector(`[slot="${name}"]`) ||
								ExtensionNode.construct(isObj(data) ? data : { contents: name });
		
		node.hasAttribute('slot') || (node.slot = name);
		
		return node.parentElement === this ? node : this.appendChild(node);
		
	}
	
}

class EmissionButton extends HTMLButtonElement {
	
	static clicked(event) {
		
		const	property = {
					'--client-x': event.clientX + 'px',
					'--client-y': event.clientY + 'px',
					'--page-x': event.pageX + 'px',
					'--page-y': event.pageY + 'px',
					'--offset-x': event.offsetX + 'px',
					'--offset-y': event.offsetY + 'px',
					'--screen-x': event.screenX + 'px',
					'--screen-x': event.screenX + 'px',
					'--movement-x': event.movementX + 'px',
					'--movement-y': event.movementY + 'px'
				},
				resolved = () => this.appendEmissionNode(property);
		
		this.hasAttribute('promise') ?
			new Promise((resolve, reject) => this.dispatchEvent(new CustomEvent('promised', { detail: { resolve, reject } }))).then(resolved) :
			resolved();
		
	};
	
	constructor() {
		
		super(),
		
		(this.emissionNode = document.createElement('emission-node')).
			setAttribute('trigger', 'animationend'),
		
		this.clicked = EmissionButton.clicked.bind(this);
		
	}
	connectedCallback() {
		
		this.addEventListener('click', this.clicked);
		
	}
	disconnectedCallback() {
		
		this.removeEventListener('click', this.clicked);
		
	}
	
	appendEmissionNode(property) {
		
		const emissionNode = this.emissionNode.cloneNode(false);
		
		emissionNode.setCSS(property),
		
		this.appendChild(emissionNode);
		
	}
	
}
class EmissionNode extends CustomElement {
	
	static tagName = 'emission-node';
	static bound = {
		
		callback(event) {
			
			++this.i >= parseInt(this.getAttribute('length') ?? 1) && this.destroy();
			
		}
		
	};
	static get observedAttributes() { return [ 'trigger' ]; }
	
	constructor(option) {
		
		super(option),
		
		this.i = 0,
		this.eventOption = { signal: (this.ac = new AbortController()).signal };
		
	}
	connectedCallback() {
		
		this.hasAttribute('trigger') &&
			this.addEvent(this, this.trigger, this.callback, this.eventOption);
		
	}
	disconnectedCallback() {
		
		this.destroy();
		
	}
	attributeChangedCallback(name, oldValue, value) {
		
		switch (name) {
			case 'trigger':
			this.removeEvent(this, oldValue, this.callback, this.eventOption),
			this.addEvent(this, value, this.callback, this.eventOption);
			break;
		}
		
	}
	setCSS(property) {
		
		let k;
		
		if (property && typeof property == 'object')
			for (k in property) this.style.setProperty(k, property[k]);
		
	}
	
}

defineCustomElements(AppNode, AppCtrl, AppContainer, BenchNode, BenchTextarea, InputNode, AppDock, DockCtrl, DockContainer, EmissionNode),
customElements.define('emission-button', EmissionButton, { extends: 'button' })