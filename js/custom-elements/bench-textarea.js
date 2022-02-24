export class BenchTextarea extends CustomElement {
	
	static tagName = 'bench-textarea';
	static runningEcentInit = { bubbles: true, cancels: true, composed: true };
	static from(data) {
		
		const node = document.createElement('bench-textarea');
		
		(data && typeof data === 'object' && !Array.isArray(data) && data.type === 'script') &&
			(node.length = data.length, node.value = data.script);
		
		return node;
		
	};
	static bound = {
		
		pressedKey(event) {
			switch (event.key) {
				case 's':
				event.ctrlKey && (event.stopPropagation(), event.preventDefault(), this.run());
				return false;
				case 'Tab':
				event.preventDefault(),
				document.execCommand('insertText', false, '  ');
				break;
			}
		},
		
		clickedRunButton() {
			this.run();
		},
		running() {
			this.q('#run').disabled = true;
		},
		finished() {
			this.q('#run').disabled = false;
		},
		
		promisedCopyButton(event) {
			
			navigator.clipboard.writeText(JSON.stringify(this.toJSON(), null, '\t')).then(() => event.detail.resolve());
			
		},
		
		clickedClearButton() {
			this.q('#value').value = '';
		},
		
		clickedRemoveButton() {
			this.kill();
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
		
		this.logNode = this.q('#logs'),
		
		this.addEvent(undefined, 'running', this.running),
		this.addEvent(undefined, 'finished', this.finished),
		this.addEvent(this.q('#value'), 'keydown', this.pressedKey),
		this.addEvent(this.q('#run'), 'click', this.clickedRunButton),
		this.addEvent(this.q('#copy'), 'promised', this.promisedCopyButton),
		this.addEvent(this.q('#clear'), 'click', this.clickedClearButton),
		this.addEvent(this.q('#remove'), 'click', this.clickedRemoveButton);
		
	}
	connectedCallback() {
		
		const container = this.closest('#codes');
		
		this.readme = container?.dataset.readme ?? '';
		
	}
	
	kill() {
		this.q('#logs').kill(),
		this.destroy();
	}
	/*
	appendLog(type = 'log', ...contents) {
		
		const	node = document.createElement('div'),
				logNode = this.logNode,
				numNode = document.createElement('span');
		
		type === 'error' && (contents = this.createErrorLog(contents[0])),
		
		numNode.className = 'log-num',
		numNode.textContent = logNode.children.length;
		
		node.className = type,
		node.append(numNode, ...contents);
		
		return logNode.prepend(node);
		
	}
	createErrorLog(error) {
		
		const	line = document.createElement('span'),
				column = document.createElement('span'),
				name = document.createElement('span'),
				message = document.createElement('span');
		
		line.className = 'error-line',
		line.textContent = typeof error?.lineNumber === 'number' ? error.lineNumber - 2 : '',
		column.className = 'error-column',
		column.textContent = error?.columnNumber ?? '',
		name.className = 'error-name',
		name.textContent = error.name,
		message.className = 'error-message',
		message.textContent = error.message,
		
		console.error(error);
		
		return [ '[', line, ':', column, ']', name, ':', message ];
		
	}
	*/
	run(arg) {
		
		this.emit('running', undefined, BenchTextarea.runningEventInit);
		
		const	func = new Function('I','L','log', ...Object.keys(arg ?? (arg = {})), this.value),
				report = {},
				log = (...args) => this.logNode.appendLog('info', ...args);
		let i,l, returnValue, errored;
		
		i = -1, l = this.length;
		
		try {
			
			report.time = performance.now();
			while (++i < l) returnValue = func(i,l,log, ...Object.values(arg));
			
		} catch (error) {
			
			errored = error;
			
		}
		
		report.time = performance.now() - report.time,
		report.returnValue = returnValue,
		this.logNode.appendLog(
				'important',
				'Estimated Time: ' + (report.time < 1000 ? report.time + 'msec.' : report.time / 1000 + 'sec.')
			),
		
		errored && this.logNode.appendLog('error', errored),
		
		this.emit('finished', report, BenchTextarea.runningEventInit);
		
		return report;
		
	}
	
	toJSON() {
		
		return { type: 'script', date: { exported: new Date() }, length: this.length, script: this.value };
		
	}
	
}