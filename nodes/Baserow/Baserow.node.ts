import { truncate } from 'fs';
import { IExecuteFunctions } from 'n8n-core';
import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	apiRequest,
} from './GenericFunctions';

export class Baserow implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Baserow',
		name: 'baserow',
		icon: 'file:baserow.svg',
		group: ['output'],
		version: 1,
		description: 'Create, update, and delete row in Baserow',
		defaults: {
			name: 'Baserow',
			color: '#00a2ce',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: "baserowApi",
				required: true
			}
		],
		properties: [
			{
				displayName: 'Host',
				name: 'host',
				type: 'string',
				default: 'https://api.baserow.io',
				placeholder: 'Baserow endpoint',
				description: 'Specify your baserow host url here.',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					/*{
						name: 'List',
						value: 'list',
						description: 'List rows of a table',
					},*/
					{
						name: 'Get',
						value: 'get',
						description: 'Get a row',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new row',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a row',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a row',
					},
				],
				default: 'get',
				description: 'The operation to perform.',
			},
			{
				displayName: 'Table ID',
				name: 'table',
				type: 'string',
				default: '',
				required: true,
				description: 'The ID of the table to access.',
			},
			// ----------------------------------
			//         get
			// ----------------------------------
			{
				displayName: 'Row ID',
				name: 'rowId',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'get',
						],
					},
				},
				default: '',
				required: true,
				description: 'Id of the row to return.',
			},

			// ----------------------------------
			//         update
			// ----------------------------------
			{
				displayName: 'Row ID',
				name: 'rowId',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'update',
						],
					},
				},
				default: '',
				required: true,
				description: 'Id of the row to update.',
			},

			// ----------------------------------
			//         delete
			// ----------------------------------
			{
				displayName: 'Row ID',
				name: 'rowId',
				type: 'string',
				displayOptions: {
					show: {
						operation: [
							'delete',
						],
					},
				},
				default: '',
				required: true,
				description: 'Id of the row to delete.',
			},

		]
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		let responseData;
		let endpoint = '';
		let requestMethod = '';

		const body: IDataObject = {};
		const qs: IDataObject = {};

		const operation = this.getNodeParameter('operation', 0) as string;

		const table = encodeURI(this.getNodeParameter('table', 0) as string);

		if (operation === "get") {
			requestMethod = "GET";
			let rowId: string;
			for (let i = 0; i < items.length; i++) {
				rowId = this.getNodeParameter('rowId', i) as string;
				endpoint = `/api/database/rows/table/${table}/${rowId}/`;
				responseData = await apiRequest.call(this, requestMethod, endpoint, body, qs);
				returnData.push(responseData);
			}
		}

		if (operation === "create") {
			requestMethod = "POST";
			endpoint = `/api/database/rows/table/${table}/`;
			for (let i = 0; i < items.length; i++) {
				Object.assign(body, items[i].json);
				responseData = await apiRequest.call(this, requestMethod, endpoint, body, qs);
				returnData.push(responseData);
			}
		}


		if (operation === "update") {
			requestMethod = "PATCH";
			let rowId: string;
			for (let i = 0; i < items.length; i++) {
				rowId = this.getNodeParameter('rowId', i) as string;
				endpoint = `/api/database/rows/table/${table}/${rowId}/`;
				Object.assign(body, items[i].json);
				responseData = await apiRequest.call(this, requestMethod, endpoint, body, qs);
				returnData.push(responseData);
			}
		}

		if (operation === "delete") {
			requestMethod = "DELETE";
			let rowId: string;
			for (let i = 0; i < items.length; i++) {
				rowId = this.getNodeParameter('rowId', i) as string;
				endpoint = `/api/database/rows/table/${table}/${rowId}/`;
				responseData = await apiRequest.call(this, requestMethod, endpoint, body, qs);
				returnData.push(responseData);
			}
		}
    return [this.helpers.returnJsonArray(returnData)];
	}
}
