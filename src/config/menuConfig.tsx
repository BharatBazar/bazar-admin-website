import * as React from 'react';
import Icon from '@ant-design/icons';
import { ReactComponent as EditIcon } from '../icons/edit-regular.svg';
import { ReactComponent as LocationIcons } from '../icons/location-arrow-solid.svg';

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
        icon: () => <Icon component={EditIcon} />,
        roles: ['admin', 'editor', 'guest'],
        children: [
            {
                title: 'Category',
                path: '/catalogue/category',
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
                path: '/catalogue/subCategory1',
                icon: () => <Icon component={EditIcon} />,
                roles: ['admin'],
            },
        ],
    },
    {
        title: 'Filter',
        path: '/filter',
        icon: () => <Icon component={EditIcon} />,
        roles: ['admin', 'editor', 'guest'],
        children: [
            {
                title: 'Filter',
                path: '/filter/filter',
                icon: () => <Icon component={EditIcon} />,
                roles: ['admin'],
            },
            {
                title: 'Classifier',
                path: '/filter/classifier',
                icon: () => <Icon component={EditIcon} />,
                roles: ['admin'],
            },
        ],
    },
    // {
    //     title: 'Location',
    //     path: '/location',
    //     icon: () => <Icon component={LocationIcons} />,
    //     children: [
    //         {
    //             title: 'Add/Update State',
    //             path: '/location/addState',
    //             icon: () => <Icon component={EditIcon} />,
    //             roles: ['admin'],
    //         },
    //         {
    //             title: 'Add/Update City',
    //             path: '/location/addCity',
    //             icon: () => <Icon component={EditIcon} />,
    //             roles: ['admin'],
    //         },
    //         {
    //             title: 'Add/Update Area',
    //             path: '/location/addArea',
    //             icon: () => <Icon component={EditIcon} />,
    //             roles: ['admin'],
    //         },
    //     ],
    // },
];
