export class AppContainer extends CustomElement {
	
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