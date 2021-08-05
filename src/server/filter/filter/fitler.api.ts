import axios from 'axios';
import { CommonApiResponse } from '../../common.interface';
import { IFilter, IRGetFilter } from './filter.interface';

export function createFilter(data: Partial<IFilter>): Promise<CommonApiResponse> {
    return axios.post('/filter/create', data);
}

export function updateFilter(data: Partial<IFilter>): Promise<CommonApiResponse> {
    return axios.post('/filter/update', data);
}

export function getCategory(data: Partial<IFilter>): Promise<IRGetFilter> {
    return axios.post('/filter/getAll', data);
}
