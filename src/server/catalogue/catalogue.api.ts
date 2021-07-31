import axios from 'axios';
import { CommonApiResponse } from '../common.interface';
import { IProductCatalogue, IRProductCatalogue } from './catalogue.interface';

export function getProductCatelogue(data: IProductCatalogue): Promise<IRProductCatalogue> {
    return axios.post('/productCatalogue/getProduct', data);
}

export function addProductCatelogue(data: IProductCatalogue): Promise<CommonApiResponse> {
    return axios.post('/productCatalogue/addProduct', data);
}

export function updateProductCatelogue(data: IProductCatalogue): Promise<CommonApiResponse> {
    return axios.post('/productCatalogue/updateProduct', data);
}

export function deleteProductCatelogue(data: IProductCatalogue): Promise<CommonApiResponse> {
    return axios.post('/productCatalogue/deleteProduct', data);
}
