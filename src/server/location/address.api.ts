import Axios from 'axios';
import { addressType, IAddress, ICheckPincode } from './address.interface';

import { CommonApiResponse } from '../common.interface';

export async function checkPincode(pincode: string): Promise<ICheckPincode> {
    return Axios.post('/address/checkPincode', { name: pincode });
}

export async function getAddress(data: Partial<IAddress>): Promise<CommonApiResponse> {
    return Axios.post('/address/getAll', data);
}

export async function createAddress(data: Partial<IAddress>): Promise<CommonApiResponse> {
    return Axios.post('/address/create', data);
}

export async function updateAddress(data: IAddress): Promise<CommonApiResponse> {
    return Axios.patch('/address/update', data);
}

export async function deleteAddress(data: Partial<IAddress>): Promise<CommonApiResponse> {
    return Axios.delete(`/address/delete?_id=${data._id}`);
}
