export class DockCtrl extends CustomElement {
	
	static tagName = 'dock-ctrl';
	static once = { once: true };
	static bound = {
		
		clickedImportButton(event) {
			
			const	inputNode = document.createElement('input-node');
			
			this.q('#import').setAttribute('disabled', ''),
			
			inputNode.id = crypto.randomUUID(),
			inputNode.set(this.importNodeData),
			
			inputNode.addEvent(undefined, inputNode.id + '-import-click', this.emittedImport),
			inputNode.addEvent(undefined, inputNode.id + '-cancel-click', this.emittedCancel),
			inputNode.addEvent(this, 'destroyed', () => inputNode.destroy(), DockCtrl.once),
			this.addEvent(inputNode, 'destroyed', this.emittedDestroyed, DockCtrl.once);
			
		},
		clickedRemoveButton(event) {
			
			this.closest('app-dock')?.removeApps();
			
		},
		
		emittedImport(event) {
			
			const data = fromJSON(event.target.value);
			
			if (data === undefined) {
				alert('Input string is not JSON.');
				return;
			}
			
			this.closest('app-dock')?.prependApp(data),
			
			event.target.destroy();
			
		},
		emittedCancel(event) {
			
			event.target.destroy();
			
		},
		emittedDestroyed(event) {
			
			this.q('#import').removeAttribute('disabled');
			
		}
		
	};
	
	constructor(option) {
		
		super(option),
		
		this.importNodeData = {
			title: 'Import an App from JSON',
			placeholder: 'Input an app JSON.',
			buttons: [
				{ id: 'import', data: { contents: 'Import' } },
				{ id: 'cancel', data: { contents: 'Cancel' } }
			],
			width: 0.5, height: 0.5,
			left: 'center', top: 'center',
			parent: document.body
		},
		
		this.addEvent(this.q('#import'), 'click', this.clickedImportButton),
		this.addEvent(this.q('#remove'), 'click', this.clickedRemoveButton);
		
	}
	
}