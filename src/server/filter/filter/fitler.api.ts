/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import { CommonApiResponse } from '../../common.interface';
import { IFilter, IRGetFilter } from './filter.interface';

export function createFilter(data: Partial<IFilter>): Promise<CommonApiResponse> {
    return axios.post('/filter/create', data);
}

export function updateFilter(data: Partial<IFilter>): Promise<CommonApiResponse> {
    return axios.post('/filter/update', data);
}

export function getFilter(data: Partial<IFilter>): Promise<IRGetFilter> {
    return axios.post('/filter/getAll', data);
}

export function deleteFilter(data: Partial<IFilter>): Promise<CommonApiResponse> {
    return axios.delete(`/filter/delete?_id=${data._id}`);
}
