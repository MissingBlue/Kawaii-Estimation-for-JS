/*
	
	Do you want Japanese readme?
	
	Custom Elements:
	
	<app-dock> *Markup is required.
		Serving the comminucation between <dock-ctrl> and <dock-container>.
	<dock-ctrl> *Markup is required.
		Providing the controls for importing and removing app.
		It requires to be included in <app-dock> which also has <dock-container> as child.
	<dock-container> *Markup is required.
		The <app-node> in this element will be handled by <dock-ctrl> included same <app-dock>.
	<app-node> *Markup is required.
		Serving the comminucation between <app-ctrl> and <app-container>.
	<app-ctrl> *Markup is required.
		Providing the controls for copying, importing and removing the nodes.
	<app-container> *Markup is required.
		The <bench-node> in this element will be handled by <app-ctrl> included same <app-node>.
	<bench-node> *Markup is required.
		The main component of this app.
		<bench-ctrl>
			A component for <bench-node>.
			Providing the controls for running, adding, copying, importing and removing <bench-textarea> of all in this.
		<bench-textarea>
			A component for <bench-node> handles your script. Editing, running copying, removing etc...
	
	<log-node>
		Showing the log.
		<log-line>
			A line of <log-node>.
			<log-body>
				A base class for the components of <log-line>.
				This provides the common controls like copying and removing itself.
				<log-info>
					A component for <log-line> inherits <log-body>.
					This expects to be given a common message.
				<log-important>
					A component for <log-line> inherits <log-body>.
					This expects to be given an important message.
				<log-error>
					A component for <log-line> inherits <log-body>.
					This parses an Error object given and shows it as a message.
	
	<input-node>
		Floating window with an input form.
		The specifications are very cheap even more than other custom elements. Needs some modifying.
	
	<button is="emission-button">
		This overrides built-in <button> element.
		When you clicked this button, it automatically appends <emission-node> each times.
		When a "promise" attribute is set with or without value,
		the button clicked emits a "promised" event only.
		The event passes 2 functions in the "detail" property of the event object to the event handler.
		Both functions are for fullfilling or rejecting that promise.
		<emission-node> will be added when that promise is resolved.
		<emission-node>
			A component of <button is="emission-button">.
			Following the attributes, this is removed automatically.
			The "trigger" attribute accepts an event type is a condition for removing,
			and the "length" attribute is the number of listening the "trigger" event.
			When the element was <emission-node trigger="click" length="3"></emission-node>,
			the element will be removed after 3 clicks.
*/

import {EmissionButton} from './custom-elements/emission-button.js';

const importedCustomElements = [
	{ name: 'AppDock', src: './custom-elements/app-dock.js' },
	{ name: 'DockCtrl', src: './custom-elements/dock-ctrl.js' },
	{ name: 'DockContainer', src: './custom-elements/dock-container.js' },
	{ name: 'AppNode', src: './custom-elements/app-node.js' },
	{ name: 'AppCtrl', src: './custom-elements/app-ctrl.js' },
	{ name: 'AppContainer', src: './custom-elements/app-container.js' },
	{ name: 'BenchNode', src: './custom-elements/bench-node.js' },
	{ name: 'BenchTextarea', src: './custom-elements/bench-textarea.js' },
	{ name: 'LogNode', src: './custom-elements/log-node.js' },
	{ name: 'LogCtrl', src: './custom-elements/log-ctrl.js' },
	{ name: 'LogLine', src: './custom-elements/log-line.js' },
	{ name: 'LogInfo', src: './custom-elements/log-info.js' },
	{ name: 'LogImportant', src: './custom-elements/log-important.js' },
	{ name: 'LogError', src: './custom-elements/log-error.js' },
	{ name: 'InputNode', src: './custom-elements/input-node.js' },
	{ name: 'EmissionNode', src: './custom-elements/emission-node.js' }
];

await defineCustomElements(...importedCustomElements),
customElements.define('emission-button', EmissionButton, { extends: 'button' });