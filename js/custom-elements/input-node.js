export class InputNode extends CustomElement {
	
	static tagName = 'input-node';
	static bound = {
		clickedButton(event) {
			
			this.emit(`${this.id}-${(event.target.assignedSlot ? event.target.assignedSlot : event.target).closest('button').id}-${event.type}`, event);
			
		},
		clickedPositiveButton(event) {
			this.emit('positive', event);
		},
		clickedNegativeButton(event) {
			this.emit('negative', event);
		},
		pressedHeader(event) {
			
			//event.preventDefault(),
			
			this.classList.add('moving'),
			this.addEvent(window, 'mousemove', this.moved),
			this.addEvent(window, 'mouseup', this.releasedHeader);
			
		},
		moved(event) {
			
			let mx,my;
			
			Number.isNaN(mx = parseInt(this.style.getPropertyValue('--movement-x'))) && (mx = 0),
			Number.isNaN(my = parseInt(this.style.getPropertyValue('--movement-y'))) && (my = 0),
			
			this.style.setProperty('--movement-x', mx + event.movementX + 'px'),
			this.style.setProperty('--movement-y', my + event.movementY + 'px');
			
		},
		releasedHeader(event) {
			
			this.classList.remove('moving'),
			this.removeEvent(window, 'mouseup', this.releasedHeader),
			this.removeEvent(window, 'mousemove', this.moved);
			
		}
	};
	get placeholder() { return this.q('#value').placeholder; }
	set placeholder(v) { this.q('#value').placeholder = v; }
	get value() { return this.q('#value').value; }
	set value(v) { this.q('#value').value = v; }
	
	constructor(option) {
		
		super(option);
		
		this.addEvent(this.q('#header'), 'mousedown', this.pressedHeader),
		this.addEvent(this.q('#positive'), 'click', this.clickedPositiveButton),
		this.addEvent(this.q('#negative'), 'click', this.clickedNegativeButton);
		
	}
	
	set(data) {
		
		data && typeof data === 'object' && (
				this.setTitle(data.title),
				this.placeholder = data.placeholder,
				this.setButtons(...data.buttons),
				this.setSize(data.width || '0', data.height || '0'),
				data.parent instanceof HTMLElement && data.parent.appendChild(this),
				this.setPosition(data.left ?? 'center', data?.top ?? 'center')
			);
		
		return this;
		
	}
	setButtons(...data) {
		
		const buttons = [];
		let i,button;
		
		i = -1;
		while (data[++i]) (button = this.setButton(data[i])) && (
				Array.isArray(button) ?
					(buttons = [ ...buttons, ...button ]) : (buttons[buttons.length] = button)
			);
		
		return buttons;
		
	}
	setButton(datum) {
		
		if (!datum || typeof datum !== 'object') return;
		
		if (Array.isArray(datum)) return this.setButtons(...datum);
		
		const	button = document.createElement('button', { is: 'emission-button' }),
				slot = document.createElement('slot');
		
		button.type = 'button',
		button.id = slot.name = datum.id,
		this.addEvent(button, 'click', this.clickedButton),
		
		this.appendSlottedNode(button.id, datum.data),
		
		button.appendChild(slot),
		this.q('#buttons').appendChild(button);
		
		return button;
		
	}
	setPosition(left, top) {
		
		if (left === 'center' || 'right' === 'center') {
			
			const rect = this.getBoundingClientRect();
			
			left === 'center' &&
				(left = `calc((${document.documentElement.clientWidth}px - ${rect.width}px) / 2 + ${scrollX}px)`),
			top === 'center' &&
				(top = `calc((${document.documentElement.clientHeight}px - ${rect.height}px) / 2 + ${scrollY}px)`);
			
		}
		if (left === 'centering' || 'right' === 'centering') {
			
			const rect = this.getBoundingClientRect();
			
			left === 'centering' && (left = `calc((100% - ${rect.width}px) / 2 + ${scrollX + 'px'})`),
			top === 'centering' && (top = `calc((100% - ${rect.height}px) / 2 + ${scrollY + 'px'})`);
			
		}
		
		typeof left === 'number' && (left += 'px'),
		typeof top === 'number' && (top += 'px'),
		
		this.style.setProperty('--movement-x', '0px'),
		this.style.setProperty('--movement-y', '0px'),
		this.style.setProperty('--left', left),
		this.style.setProperty('--top', top);
		
	}
	setSize(width, height, responsible) {
		
		let w,h, handler;
		
		typeof width === 'number' &&
			(width = document.documentElement.clientWidth * (w = width) + 'px'),
		typeof height === 'number' &&
			(height = document.documentElement.clientHeight * (h = height) + 'px'),
		
		(w === undefined && h === undefined) || !responsible || (
			this.addEvent(
					window,
					'resize',
					handler = event => (
						this.removeEvent(event.target, event.type, handler),
						this.setSize(w || width, h || height)
					)
				)),
		
		this.style.setProperty('--width', width),
		this.style.setProperty('--height', height);
		
	}
	setTitle(title) {
		
		return this.appendSlottedNode('title', { contents: title });
		
	}
	setSlottedContent(name, value, data) {
		
		return this.appendSlottedNode(name, data).textContent = value;
		
	}
	appendSlottedNode(name, data) {
		
		const node =	this.querySelector(`[slot="${name}"]`) ||
								ExtensionNode.construct(isObj(data) ? data : { contents: name });
		
		node.hasAttribute('slot') || (node.slot = name);
		
		return node.parentElement === this ? node : this.appendChild(node);
		
	}
	
}