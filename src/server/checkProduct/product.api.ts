import axios from 'axios';
import { IProductMeta, productStatus } from './product.interface';

export function getProductMeta(divison: string, data: Object): Promise<IProductMeta> {
    return axios.post(`/catalogue/${divison}/get/productMeta`, data);
}
