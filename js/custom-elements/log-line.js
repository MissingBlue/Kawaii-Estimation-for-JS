import {LogBody} from './log-body.js';

export class LogLine extends CustomElement {
	
	static tagName = 'log-line';
	static eventInit = { bubbles: true, cancelable: true, composed: true };
	static bound = {
		
		changedSlot(event) {
			
			const assignedNodes = this.bodySlot.assignedNodes(), typeList = [];
			let i,i0, assignedNode;
			
			i = i0 = -1;
			while (assignedNode = assignedNodes[++i])
				assignedNode instanceof LogBody && (typeList[++i0] = assignedNode.__.logType);
			
			this.className = this.root.className = typeList.join(' ');
			
		},
		emittedRemove(event) {
			
			this.kill();
			
		}
		
	};
	
	constructor(option) {
		
		super(option),
		
		this.time = Date.now(),
		
		this.addEvent(this.bodySlot = this.q('slot[name="body"]'), 'slotchange', this.changedSlot),
		this.addEvent(this.q('#ctrl'), 'remove', this.emittedRemove);
		
	}
	connectedCallback() {
		
		const	ds = this.dataset,
				rootDs = this.root.dataset,
				bodyDs = this.q('#body').dataset,
				diff = ((this.time) - (this.nextSibling?.time ?? this.time)) / 1000,
				mins = parseInt(diff / 60);
		
		ds.i = rootDs.i = bodyDs.elapse = this.closest('#container')?.children.length - 1,
		ds.elapse = rootDs.elapse = bodyDs.elapse = mins ? mins + ':' + (diff - mins * 60) : diff,
		
		this.emit('appended-log', undefined, LogLine.eventInit);
		
	}
	disconnectedCallback() {
		
		this.emit('removed-log', undefined, LogLine.eventInit);
		
	}
	
	kill() {
		
		this.emit('removed-log', undefined, LogLine.eventInit),
		
		this.destroy();
		
	}
	
	get() {
		
		const assignedNodes = this.querySelectorAll('[slot="body"]'), data = [];
		let i;
		
		i = -1;
		while (assignedNodes[++i]) data[i] = assignedNodes[i].get();
		
		return data;
		
	}
	
}