export class LogCtrl extends CustomElement {
	
	static tagName = 'log-ctrl';
	static bound = {
		
		clickedRemoveButton(event) {
			
			this.emit('remove', event);
			
		}
		
	};
	
	constructor(option) {
		
		super(option),
		
		this.addEvent(this.removeButton = this.q('#remove'), 'click', this.clickedRemoveButton);
		
	}
	
}