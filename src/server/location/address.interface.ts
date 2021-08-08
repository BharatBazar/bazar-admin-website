import { CommonApiResponse } from '../common.interface';

export enum addressType {
    'state' = 'State',
    'city' = 'City',
    'area' = 'Area',
}

export interface IAddress {
    addressType: addressType;
    parent: string;
    name: string;
    _id: string;
}

export interface IRAddress extends CommonApiResponse {
    payload: IAddress[];
}

export interface ICheckPincode extends CommonApiResponse {
    payload: {
        state: Partial<IAddress>;
        city: Partial<IAddress>;
        area: [Partial<IAddress>];
    };
}
