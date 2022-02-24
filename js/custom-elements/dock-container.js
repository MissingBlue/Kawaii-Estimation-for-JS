export class DockContainer extends CustomElement {
	
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