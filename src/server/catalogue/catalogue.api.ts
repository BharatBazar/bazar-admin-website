import axios from 'axios';
import { CommonApiResponse } from '../common.interface';
import { IProductCatalogue, IRProductCatalogue } from './catalogue.interface';

export function getProductCatelogue(data: Partial<IProductCatalogue>): Promise<IRProductCatalogue> {
    return axios.post('/catalogue/get', data);
}
export function getProductCatelogueWithAncestors(): Promise<IRProductCatalogue> {
    return axios.get('/catalogue/getAll');
}

export function addProductCatelogue(data: Partial<IProductCatalogue>): Promise<CommonApiResponse> {
    console.log("ALLLL",data)
    return axios.post('/catalogue/add', data);
}

export function updateProductCatelogue(data: Partial<IProductCatalogue>): Promise<CommonApiResponse> {
    return axios.patch('/catalogue/update', data);
}

export function deleteProductCatelogue(data: Partial<IProductCatalogue>): Promise<CommonApiResponse> {
    return axios.delete(`/catalogue/delete?_id=${data._id}`);
}

export function activateCatelogueItem(data: Partial<IProductCatalogue>): Promise<CommonApiResponse> {
    return axios.patch('/catalogue/activateItem', data);
}
