import {BenchNode} from "./bench-node.js"

export class AppNode extends CustomElement {
	
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