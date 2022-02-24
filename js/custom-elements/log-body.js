export class LogBody extends CustomElement {
	
	static tagName = 'log-body';
	static bound = {};
	
	constructor(option) {
		
		super(option),
		
		this.data = [];
		
		if (!Array.isArray(this.__.slotNames)) return;
		
		// 以下は静的プロパティ slotNames に列挙された属性名に getter, setter を機械的に作成する処理。
		// 対象の属性はこの要素の shadowRoot 内に同じ値を属性 name に持つ要素 slot が存在することを前提に、
		// 属性値を setter を通じて変更した時に、自動で対応する slot の assignedNodes を初期化した上で、
		// 指定された文字列の Text を作成し、この要素に追加して対応する要素の唯一の assignedNodes とする。
		// こうした仕様は現在の仕様を設計する前の仕様を前提としたもので、今の仕様において実用することはないと思われるが、
		// 一定の汎用性が認められなくもないため残している。
		// 一方で、slot が想定する状況（不特定多数の assignedNode の許容）に対応しきれておらず、実用には至らないと思われる。
		
		const	property = {},
				get = k => () => this.q('slot[name="${k}"]')?.assignedNodes ?? [],
				set = k =>	v => (this.dismiss(k), this.appendChild(new Text(v)).slot = k);
		let i,k;
		
		i = -1;
		while (k = this.__.slotNames[++i]) property[k] = { enumerable: true, get: get(k), set: set(k) };
		
		Object.defineProperties(this, property);
		
	}
	
	dismiss(slotName) {
		
		const assigned = this.q(`slot[name=${slotName}]`);
		let i;
		
		i = -1;
		while (assigned.assignedNodes[++i]) assigned.assignedNodes[i].remove();
		
		this.data.length = 0;
		
	}
	assign(data) {
		
		const construct = ExtensionNode.construct, constructor = this.__;
		let i, datum, slotName;
		
		i = -1, Array.isArray(data) || (data = [ data ]);
		while (datum = data[++i]) (
				slotName = datum.slotName,
				data[i] = construct(datum.data),
				slotName && !data[i].slot && (data[i].slot = slotName)
			);
		
		this.append(...data),
		
		console[constructor.consoleMethod || 'info']('#' + (constructor.logType || 'info'), ...data);
		
		return data;
		
	}
	
	set(contents, slotName = 'message') {
		
		const l = (Array.isArray(contents) ? contents : (contents = [ contents ])).length, data = [];
		let i;
		
		i = -1;
		while (++i < l) data[i] = {
				data: contents[i] && typeof contents[i] === 'object' ? contents[i] : { contents: contents[i] },
				slotName
			};
		
		return this.assign(data);
		
	}
	
	get() {
		
		const slottedNodes = this.qq('slot[name]'), contents = [];
		let i,i0,i1, assignedNodes, node;
		
		i = i1 = -1;
		while (node = slottedNodes[++i]) {
			i0 = -1, assignedNodes = node.assignedNodes();
			while (node = assignedNodes[++i0]) contents[++i1] = { attr: { slot: node.slot }, contents: node.textContent };
		}
		
		return { type: this.__.logType, contents };
		
	}
	
}