import * as React from 'react';
import Icon from '@ant-design/icons';
import { ReactComponent as EditIcon } from '../icons/edit-regular.svg';

export interface menu {
    title: string;
    path: string;
    icon: () => any;
    roles?: string[];
}

export interface menuItem extends menu {
    children?: menu[];
}

export const menuList: menuItem[] = [
    {
        title: 'Catalogue',
        path: '/catalogue',
        icon: () => {
            return <Icon component={EditIcon} />;
        },
        roles: ['admin', 'editor', 'guest'],
        children: [
            {
                title: 'Category',
                path: '/catalogue/catagory',
                icon: () => <Icon component={EditIcon} />,
                roles: ['admin'],
            },
            {
                title: 'SubCategory',
                path: '/catalogue/subCategory',
                icon: () => <Icon component={EditIcon} />,
                roles: ['admin'],
            },
            {
                title: 'SubCategory1',
                path: '/catalogue/subCatagory1',
                icon: () => <Icon component={EditIcon} />,
                roles: ['admin'],
            },
        ],
    },
];
