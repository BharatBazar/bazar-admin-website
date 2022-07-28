import { Button, Checkbox, Space, Table } from 'antd';
import React from 'react';

const ProductCardView = ({
    setFilterList,
    filterList,
    deleteCategoryListInServer,
    onClickUpdateInRow,
    updateFilterInServer,
    activateClassfierInServer,
}) => {
    const columns = (onDelete, onUpdate, activate) => [
        {
            title: 'Filter Value' + ' name',
            dataIndex: 'name',
            key: '_id' + 'City',
            fixed: 'left',
            width: 150,
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Filter Value ' + ' description',
            dataIndex: 'description',
            key: '_id',
            fixed: 'left',
            width: 150,
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Filter Value ' + ' image',
            dataIndex: 'image',
            key: '_id',
            render: (text) => <img src={text || 'https://source.unsplash.com/user/c_v_r'} height={100} width={100} />,
        },
        {
            title: ' Customer name',
            dataIndex: 'customerName',
            key: '_id',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Customer description',
            dataIndex: 'customerDescription',
            key: '_id',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Customer image',
            dataIndex: 'customerImage',
            key: '_id',
            render: (text) => <img src={text || 'https://source.unsplash.com/user/c_v_r'} height={100} width={100} />,
        },

        // {
        //     title: 'Active',
        //     dataIndex: 'active',
        //     width: 150,
        //     key: '_id',
        //     render: (value) => (
        //         <div style={{ alignItems: 'center', justifyContent: 'center' }}>
        //             <Checkbox value={value} checked={value} style={{ alignSelf: 'center' }} />
        //         </div>
        //     ),
        // },
        // {
        //     title: 'Child',
        //     key: 'child',
        //     dataIndex: 'child',
        //     render: (child) => (
        //         <span>
        //             {child.map(({ name }) => {
        //                 // let color = name.length <= 5 ? 'geekblue' : name.length <= 7 ? 'volcano' : 'green';

        //                 return (
        //                     <Tag color={'blue'} key={name}>
        //                         {name.toUpperCase()}
        //                     </Tag>
        //                 );
        //             })}
        //         </span>
        //     ),
        // },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            width: 300,
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        type={'primary'}
                        title={'Edit'}
                        onClick={() => {
                            onUpdate(record);
                        }}
                    >
                        {'Edit'}
                    </Button>
                    <Button
                        type={'primary'}
                        title={'Active'}
                        onClick={() => {
                            activate({ active: !text.active, _id: record._id });
                        }}
                    >
                        {text.active ? 'Deactive' : 'Active'}
                    </Button>
                    <Button
                        type={'primary'}
                        title={'Delete'}
                        onClick={() => {
                            onDelete(record);
                        }}
                        danger
                    >
                        {'Delete'}
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns(deleteCategoryListInServer, onClickUpdateInRow, activateClassfierInServer)}
            dataSource={filterList}
            style={{ marginTop: '2vh' }}
            scroll={{ x: 1300 }}
        />
    );
};

export default ProductCardView;
