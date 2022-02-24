import {LogBody} from './log-body.js';

export class LogImportant extends LogBody {
	
	static logType = 'important';
	static tagName = 'log-' + LogImportant.logType;
	static bound = {};
	
	constructor(option) {
		super(option);
	}
}