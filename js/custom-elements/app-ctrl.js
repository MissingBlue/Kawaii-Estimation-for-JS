export class AppCtrl extends CustomElement {
	
	static tagName = 'app-ctrl';
	static once = { once: true };
	static bound = {
		
		emittedImport(event) {
			
			const data = fromJSON(event.target.value);
			
			if (data === undefined) {
				alert('Input string is not JSON.');
				return;
			}
			
			this.closest('app-node')?.addBenchNode(data),
			
			event.target.destroy();
			
		},
		emittedCancel(event) {
			event.target.destroy();
		},
		emittedDestroyed(event) {
			this.q('#import').removeAttribute('disabled'),
			this.removeEvent(event.target, 'destroyed', this.emittedDestroyed);
		},
		clickedAddButton() {
			this.closest('app-node')?.addBenchNode();
		},
		promisedCopyButton(event) {
			
			navigator.clipboard.writeText(JSON.stringify(this.closest('app-node')?.toJSON(), null, '\t')).then(() => event.detail.resolve());
			
		},
		clickedImportButton() {
			
			const	inputNode = document.createElement('input-node');
			
			this.q('#import').setAttribute('disabled', ''),
			
			inputNode.id = crypto.randomUUID(),
			inputNode.set(this.importNodeData),
			
			inputNode.addEvent(undefined, inputNode.id + '-import-click', this.emittedImport),
			inputNode.addEvent(undefined, inputNode.id + '-cancel-click', this.emittedCancel),
			
			inputNode.addEvent(this, 'destroyed', () => inputNode.destroy(), AppCtrl.once),
			this.addEvent(inputNode, 'destroyed', this.emittedDestroyed, AppCtrl.once);
			
		},
		clickedRemoveNodesButton() {
			this.closest('app-node')?.removeAll();
		},
		clickedRemoveButton(event) {
			
			this.closest('app-node')?.kill();
			
		}
		
	};
	
	constructor(option) {
		
		super(option),
		
		this.importNodeData = {
			title: 'Import a Node from JSON',
			placeholder: 'Input a node JSON.',
			buttons: [
				{ id: 'import', data: { contents: 'Import' } },
				{ id: 'cancel', data: { contents: 'Cancel' } }
			],
			width: 0.5, height: 0.5,
			left: 'center', top: 'center',
			parent: document.body
		},
		
		this.addEvent(this.q('#add'), 'click', this.clickedAddButton),
		this.addEvent(this.q('#copy'), 'promised', this.promisedCopyButton),
		this.addEvent(this.q('#import'), 'click', this.clickedImportButton),
		this.addEvent(this.q('#remove-nodes'), 'click', this.clickedRemoveNodesButton),
		this.addEvent(this.q('#remove'), 'click', this.clickedRemoveButton);
		
	}
	
}