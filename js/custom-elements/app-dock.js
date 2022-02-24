import {AppNode} from './app-node.js';

export class AppDock extends CustomElement {
	
	static tagName = 'app-dock';
	static bound = {};
	
	constructor(option) {
		
		super(option);
		
	}
	appendApp(app) {
		
		return (app = AppNode.from(app), this.querySelector('dock-container')?.appendChild(app));
		
	}
	prependApp(app) {
		
		return (app = AppNode.from(app), this.querySelector('dock-container')?.prepend(app), app);
		
	}
	removeApps() {
		
		const containers = this.querySelectorAll('dock-container');
		let i;
		
		i = -1;
		while (containers[++i]) containers[i].removeApps();
		
	}
	
}