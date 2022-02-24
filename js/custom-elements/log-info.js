import {LogBody} from './log-body.js';

export class LogInfo extends LogBody {
	
	static logType = 'info'
	static tagName = 'log-' + LogInfo.logType;
	static bound = {};
	
	constructor(option) {
		
		super(option);
		
	}
	
}