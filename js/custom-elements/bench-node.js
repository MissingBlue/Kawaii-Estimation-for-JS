import {BenchTextarea} from './bench-textarea.js';

export class BenchNode extends CustomElement {
	
	static tagName = 'bench-node';
	static runningEventInit = { bubbles: true, cancels: true, composed: true };
	static README =	'You can use the following arguments in your script.\n' +
							'I - current loop increment\n' +
							'L - loop length for the script\n' +
							'log - A function shows the values passed very simply. *experimental\n\n' +
							'The properties of the object returned from your script would be passed as arguments to all backward scripts. The object will be merged backward. Note that the order of your arguments cannot be specified. Using the property name as a variable is recommended.\n\n' +
							'There are a lot of the global variables in this app unfortunately. If something got wrong in your script, try renaming your variable.\n\n' +
							'Use Ctrl+S in textarea, you can execute the script without pressing "Run" button.\n\n' +
							'No fail safe. Be careful to edit and execute.';
	static once = { once: true };
	static importNodeData = {
		title: 'Import a Script from JSON',
		placeholder: 'Input a script JSON.',
		buttons: [
			{ id: 'import', data: { contents: 'Import' } },
			{ id: 'cancel', data: { contents: 'Cancel' } }
		],
		width: 0.5, height: 0.5,
		left: 'center', top: 'center',
		parent: document.body
	};
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
			inputNode.set(BenchNode.importNodeData),
			
			inputNode.addEvent(undefined, inputNode.id + '-import-click', this.emittedImport),
			inputNode.addEvent(undefined, inputNode.id + '-cancel-click', this.emittedCancel),
			
			inputNode.addEvent(this, 'destroyed', () => inputNode.destroy(), BenchNode.once),
			this.addEvent(inputNode, 'destroyed', this.emittedDestroyed, BenchNode.once);
			
		},
		clickedRemoveButton() {
			
			this.kill();
			
		},
		clickedRunButton(event) {
			this.run();
		},
		running() {
			this.q('#run').disabled = true;
		},
		finished() {
			this.q('#run').disabled = false;
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
		
		appendedScriptLog(event) {
			
			const composedPath = event.composedPath();
			
			if (composedPath.indexOf(this.logNode) !== -1) return;
			
			const logData = composedPath[0].get(), id = composedPath[0].id;
			
			let i, datum;
			
			i = -1;
			while (datum = logData[++i]) this.logNode.appendLog(datum.type, datum.contents).dataset.constraint = id;
			
		},
		removedScriptLog(event) {
			
			const composedPath = event.composedPath();
			
			if (composedPath.indexOf(this.logNode) !== -1) return;
			
			this.logNode.q('[data-constraint="' + composedPath[0].id + '"]')?.kill();
			
		}
		
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
		
		super(option),
		
		this.logNode = this.q('#logs'),
		
		this.addEvent(undefined, 'running', this.running),
		this.addEvent(undefined, 'finished', this.finished),
		this.addEvent(this.q('#add'), 'click', this.clickedAddButton),
		this.addEvent(this.q('#copy'), 'promised', this.promisedCopyButton),
		this.addEvent(this.q('#import'), 'click', this.clickedImportButton),
		this.addEvent(this.q('#remove'), 'click', this.clickedRemoveButton),
		this.addEvent(this.q('#run'), 'click', this.clickedRunButton),
		
		this.addEvent(this, 'appended-log', this.appendedScriptLog),
		this.addEvent(this, 'removed-log', this.removedScriptLog),
		
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
		
		this.emit('running', undefined, BenchNode.runningEventInit);
		
		const scripts = this.qq('#codes > bench-textarea'), report = { data: [], time: 0, results: [], fixedResults: [] };
		let i, time;
		
		i = -1;
		while (scripts[++i])
			report.results[i] = (time = (report.data[i] = scripts[i].run(arg)).time) < 1000 ? time : time / 1000,
			isObj(report.data[i].returnValue) && (arg = { ...arg, ...report.data[i].returnValue });
		
		i = -1;
		while (scripts[++i]) {
			report.fixedResults[i] = report.results[i] + (report.results[i] < 1 ? 'mesc.' : 'sec.'),
			report.time += report.results[i]
		}
		
		this.logNode.appendLog(
				'important',
				'[Estimation] ' +
				'Total: ' + (report.time < 1 ? report.time + 'msec.' : report.time + 'sec.') + ' ' +
				'Indivisual: ' + report.results.join(', ')
			),
		
		this.emit('finished', report, BenchNode.runningEventInit);
		
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