import axios from 'axios';
import { CommonApiResponse } from '../../common.interface';
import { IClassfier, IRGetAllClassifier } from './category.interface';

export function createCategory(data: Partial<IClassfier>): Promise<CommonApiResponse> {
    return axios.post('/filtervalues/create', data);
}

export function updateCategory(data: Partial<IClassfier>): Promise<CommonApiResponse> {
    return axios.patch('/filtervalues/update', data);
}

export function getCategory(data: Partial<IClassfier>): Promise<IRGetAllClassifier> {
    return axios.post('/filtervalues/getAll', data);
}

export function deleteCategory(data: Partial<IClassfier>): Promise<CommonApiResponse> {
    return axios.delete(`/filtervalues/delete?_id=${data._id}`);
}

export function activateClassfier(data: Partial<IClassfier>): Promise<CommonApiResponse> {
    return axios.patch('/filtervalues/activate', data);
}
