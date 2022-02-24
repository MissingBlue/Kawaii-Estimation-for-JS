export class EmissionNode extends CustomElement {
	
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
		
		if (property && typeof property === 'object')
			for (k in property) this.style.setProperty(k, property[k]);
		
	}
	
}