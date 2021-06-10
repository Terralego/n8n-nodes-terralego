import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import {
	OptionsWithUri,
} from 'request';

import {
	IDataObject,
	NodeApiError,
  NodeOperationError,
  IPollFunctions,
} from 'n8n-workflow';


interface IAttachment {
	url: string;
	filename: string;
	type: string;
}

export interface IRecord {
	fields: {
		[key: string]: string | IAttachment[],
	};
}

/**
 * Make an API request to Baserow
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
export async function apiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions , method: string, endpoint: string, body: object, query?: IDataObject, uri?: string, option: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any
  const credentials = this.getCredentials('baserowApi');
  const host = this.getNodeParameter('host', 0) as string;


	if (credentials === undefined) {
		throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
	}

	query = query || {};

	const options: OptionsWithUri = {
    headers: {
      "authorization": `Token ${credentials.apiToken}`
		},
		method,
		body,
		qs: query,
		uri: uri || `${host}/${endpoint}`,
		useQuerystring: false,
		json: true,
	};

  // Allow to manually extend options
	if (Object.keys(option).length !== 0) {
		Object.assign(options, option);
	}

  // Remove an empty body
	if (Object.keys(body).length === 0) {
		delete options.body;
  }
  
    console.log("options", options);

	try {
		return await this.helpers.request!(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}