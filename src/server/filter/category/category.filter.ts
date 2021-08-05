import axios from 'axios';
import { CommonApiResponse } from '../../common.interface';
import { IClassfier, IRGetAllClassifier } from './category.interface';

export function createCategory(data: Partial<IClassfier>): Promise<CommonApiResponse> {
    return axios.post('/classifiers/create', data);
}

export function updateCategory(data: Partial<IClassfier>): Promise<CommonApiResponse> {
    return axios.post('/classifiers/update', data);
}

export function getCategory(data: Partial<IClassfier>): Promise<IRGetAllClassifier> {
    return axios.post('/classifiers/getAll', data);
}
