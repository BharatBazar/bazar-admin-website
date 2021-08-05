import { CommonApiResponse } from '../../common.interface';
import { classifierTypes } from '../category/category.interface';

export interface IFilter {
    _id: string;
    name: string; // Filter name Like waist size
    description: string; // Filter details descipbing about filter
    image: string; // Image url
    type: classifierTypes; // It will refer to the type to which the filter belongs
    multiple: boolean; // Multiple values can be selected or not
    distributionLevel: number; // 0 means filter only and 1 means It is top level distribution like color 2 means inside distibution that is size or etc.
    active: boolean; // It is used to active a filter and show it publically so that filter can through a verifying flow and all good then they are release to public
}

export interface IRGetFilter extends CommonApiResponse {
    payload: IFilter[];
}
