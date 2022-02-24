export class EmissionButton extends HTMLButtonElement {
	
	static clicked(event) {
		
		const	rect = event.target !== this && event.target.getBoundingClientRect(),
				property = {
					'--client-x': event.clientX + 'px',
					'--client-y': event.clientY + 'px',
					'--page-x': event.pageX + 'px',
					'--page-y': event.pageY + 'px',
					'--offset-x': event.offsetX + (rect ? rect.x : 0) + 'px',
					'--offset-y': event.offsetY + (rect ? rect.y : 0) + 'px',
					'--screen-x': event.screenX + 'px',
					'--screen-x': event.screenX + 'px',
					'--movement-x': event.movementX + 'px',
					'--movement-y': event.movementY + 'px'
				},
				resolved = () => this.appendEmissionNode(property);
		
		this.hasAttribute('promise') ?
			new Promise((resolve, reject) => this.dispatchEvent(new CustomEvent('promised', { detail: { resolve, reject, event } }))).then(resolved) :
			resolved();
		
	};
	
	constructor() {
		
		super(),
		
		(this.emissionNode = document.createElement('emission-node')).
			setAttribute('trigger', 'animationend'),
		
		this.clicked = EmissionButton.clicked.bind(this);
		
	}
	connectedCallback() {
		
		this.addEventListener('click', this.clicked);
		
	}
	disconnectedCallback() {
		
		this.removeEventListener('click', this.clicked);
		
	}
	
	appendEmissionNode(property) {
		
		const emissionNode = this.emissionNode.cloneNode(false);
		
		emissionNode.setCSS(property),
		
		this.appendChild(emissionNode);
		
	}
	
}