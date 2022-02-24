import {LogBody} from './log-body.js';

export class LogError extends LogBody {
	
	static logType = 'error';
	static consoleMethod = 'error';
	static tagName = 'log-' + LogError.logType;
	static bound = {};
	static slotNames = [ 'line', 'col', 'error-type', 'message' ];
	static contentName = {
		columnNumber: 'col',
		lineNumber: 'line',
		name: 'error-type',
		message: 'message'
	};
	
	constructor(option) {
		
		super(option);
		
	}
	
	set(content) {
		
		if (!content || typeof content !== 'object') return;
		
		const contentName = LogError.contentName, data = [];
		let i,k;
		
		i = -1;
		for (k in contentName) k in content && (
				data[++i] = {
					data: { contents: k === 'lineNumber' ? (content[k] - 2) : content[k] },
					slotName: contentName[k]
				}
			);
		
		return this.assign(data);
		
	}
	
	get() {
		
		const contentName = this.__.contentName, contents = {};
		let node;
		
		for (const [ k, v ] of Object.entries(contentName))
			(node = this.q('slot[name="' + v + '"]')?.assignedNodes()?.[0]) && (contents[k] = node.textContent);
		
		return { type: this.__.logType, contents };
		
	}
	
}