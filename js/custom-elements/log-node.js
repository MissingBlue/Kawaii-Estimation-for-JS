export class LogNode extends CustomElement {
	
	static tagName = 'log-node';
	static bound = {
		
		clickedClearButton(event) {
			
			this.clearLines();
			
		}
		
	};
	
	constructor(option) {
		
		super(option),
		
		this.container = this.q('#container'),
		this.addEvent(this.clearButton = this.q('#clear'), 'click', this.clickedClearButton);
		
	}
	
	kill() {
		
		this.clearLines(),
		this.destroy(),
		
		this.emit('removed', this);
		
	}
	clearLines() {
		
		const lines = this.container.querySelectorAll(':scope > log-line');
		let i;
		
		i = -1;
		while (lines[++i]) lines[i].kill();
		
	}
	
	appendLog(type = 'info', contents) {
		
		const	body = document.createElement('log-' + (type || 'info')),
				log = document.createElement('log-line');
		
		body.set(contents),
		
		log.id = crypto.randomUUID(),
		log.appendChild(body).slot = 'body',
		
		this.container.prepend(log);
		
		return log;
		
	}
	
}