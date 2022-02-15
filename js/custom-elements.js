class AppNode extends CustomElement {
	
	static tagName = 'app-node';
	
	constructor(option) {
		
		super(option);
		
	}
	
	addBenchNode() {
		
		this.querySelector('app-container')?.appendChild(document.createElement('bench-node'));
		
	}
	removeAll() {
		
		const benches = this.querySelector('app-container')?.getBenchNodes();
		let i;
		
		if (!benches) return;
		
		i = -1;
		while (benches[++i]) benches[i]?.release?.();
		
	}
	toJSON() {
		
		const	benches = this.querySelector('app-container')?.getBenchNodes(),
				data = [];
		let i;
		
		if (benches) {
			i = -1;
			while (benches[++i]) data[i] = { label: benches[i].label, scripts: benches[i].toJSON() };
		}
		
		
		return data;
		
	}
	
}
class AppCtrl extends CustomElement {
	
	static tagName = 'app-ctrl';
	static bound = {
		clickedAddButton() {
			this.closest('app-node')?.addBenchNode();
		},
		clickedCopyButton() {
			
			navigator.clipboard.writeText
				(JSON.stringify(this.closest('app-node')?.toJSON(), null, '\t')).
					then(() => alert('Copied!'));
			
		},
		clickedRemoveButton() {
			this.closest('app-node')?.removeAll();
		}
	};
	
	constructor(option) {
		
		super(option),
		
		this.addEvent(this.q('#add'), 'click', this.clickedAddButton),
		this.addEvent(this.q('#copy'), 'click', this.clickedCopyButton),
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
		return this.querySelectorAll(':scope > bench-node');
	}
	
}

class BenchNode extends CustomElement {
	
	static tagName = 'bench-node';
	static README =	'i: current loop increment\n' +
							'l: loop length\n' +
							'$: An exactly empty object. To share the value between the codes, use this.\n' +
							'_: this instance';
	static bound = {
		
		clickedAddButton(event) {
			this.q('#codes')?.insertBefore(document.createElement('bench-textarea'), event.target);
		},
		clickedCopyButton(event) {
			
			navigator.clipboard.writeText(JSON.stringify(this.toJSON(), null, '\t')).
				then(() => alert('Copied!'));
			
		},
		clickedRemoveButton() {
			
			this.release();
			
		},
		clickedRunButton() {
			
			const report = this.run({ k: '$', v: Object.create(null) }, { k: '_', v: this });
			
		}
		
	};
	
	get label() { return this.querySelector('[slot="caption"]')?.textContent; }
	
	constructor(option) {
		
		super(option);
		
		this.addEvent(this.q('#add'), 'click', this.clickedAddButton),
		this.addEvent(this.q('#copy'), 'click', this.clickedCopyButton),
		this.addEvent(this.q('#remove'), 'click', this.clickedRemoveButton),
		this.addEvent(this.q('#run'), 'click', this.clickedRunButton),
		
		this.q('#codes').dataset.readme = BenchNode.README;
		
	}
	connectedCallback() {
		
		const container = this.closest('app-container');
		
		if (!this.querySelector('[slot="caption"]')) {
			const caption = document.createElement('span');
			caption.slot = 'caption',
			caption.textContent = container.children.length,
			this.appendChild(caption);
		}
		
	}
	run(...args) {
		
		const codes = this.qq('#codes > bench-textarea'), report = { data: [], time: 0 };
		let i;
		
		i = -1;
		while (codes[++i]) report.time += (report.data[i] = codes[i].run(...args)).time;
		
		this.q('#result').textContent =
			report.time < 1000 ? `${report.time}ms` : `${report.time / 1000}s`;
		
		return report;
		
	}
	release() {
		
		const textareas = this.qq('bench-textarea');
		let i;
		
		i = -1;
		while (textareas[++i]) textareas[i].destroy();
		
		this.destroy();
		
	}
	toJSON() {
		
		const codes = this.qq('#codes > bench-textarea'), data = [];
		let i;
		
		i = -1;
		while (codes[++i]) data[i] = codes[i].toJSON();
		
		return data;
		
	}
	
}
class BenchTextarea extends CustomElement {
	
	static tagName = 'bench-textarea';
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
		clickedCopyButton() {
			
			navigator.clipboard.writeText(JSON.stringify(this.toJSON(), null, '\t')).
				then(() => alert('Copied!'));
			
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
	get length() { return this.q('#length').value; }
	set length(v) { this.q('#length').value = v; }
	get readme() { return this.q('#value').getAttribute('placeholder'); }
	set readme(v) { this.q('#value').setAttribute('placeholder', v); }
	
	constructor(option) {
		
		super(option);
		
		this.readme = this.dataset.readme,
		
		this.q('#length').placeholder = 'Length',
		
		this.addEvent(this.q('#value'), 'keydown', this.pressedKey),
		this.addEvent(this.q('#run'), 'click', this.clickedRunButton),
		this.addEvent(this.q('#copy'), 'click', this.clickedCopyButton),
		this.addEvent(this.q('#clear'), 'click', this.clickedClearButton),
		this.addEvent(this.q('#remove'), 'click', this.clickedRemoveButton);
		
	}
	connectedCallback() {
		
		const container = this.closest('#codes');
		
		this.readme = container?.dataset.readme ?? '';
		
	}
	
	run(...args) {
		
		const keys = [], values = [], report = { $: this };
		let i,l,i0;
		
		i = i0 = -1;
		while (args[++i])
			isObj(args[i]) && args[i].k && (keys[++i0] = args[i].k, values[i0] = args[i].v);
		
		const func = new Function('i', 'l', ...keys, this.value);
		
		i = -1, Number.isNaN(l = Math.abs(parseInt(l = this.length))) && (l = 1),
		report.time = performance.now();
		while (++i < l) func(i,l,...values);
		report.time = performance.now() - report.time;
		
		this.q('#result').textContent =
			report.time < 1000 ? `${report.time}ms` : `${report.time / 1000}s`;
		
		return report;
		
	}
	
	toJSON() {
		
		return { length: this.length, script: this.value };
		
	}
	
}

defineCustomElements(AppNode, AppCtrl, AppContainer, BenchNode, BenchTextarea);