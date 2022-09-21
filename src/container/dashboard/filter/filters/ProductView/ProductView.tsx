/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Space, Table } from 'antd';

const ProductView = ({
    filterList,

    onClickUpdateInRow,
    activateFilterInServer,

    deleteCategoryListInServer,
}) => {
    const columns = (onDelete, onUpdate, activate) => [
        {
            title: 'Filter' + ' name',
            dataIndex: 'name',
            key: '_id' + 'City',
            width: 100,
            fixed: 'left',
            render: (text) => <a>{text}</a>,
        },
        {
            title: ' description',
            dataIndex: 'description',
            key: '_id',
            width: 250,

            render: (text) => <a>{text}</a>,
        },
        {
            title: ' image',
            dataIndex: 'image',
            key: '_id',
            width: 100,
            render: (text) => <img src={text || 'https://source.unsplash.com/user/c_v_r'} height={70} width={70} />,
        },
        {
            title: ' customer heading',
            dataIndex: 'customerHeading',
            key: '_id',
            width: 110,
            render: (text) => <a>{text}</a>,
        },
        {
            title: ' customer description',
            dataIndex: 'customerDescription',
            key: '_id',
            width: 250,
            render: (text) => <a>{text}</a>,
        },
        {
            title: ' customer image',
            dataIndex: 'customerImage',
            key: '_id',
            width: 100,
            render: (text) => <img src={text || 'https://source.unsplash.com/user/c_v_r'} height={70} width={70} />,
        },

        {
            title: 'Filter ' + ' type',
            dataIndex: 'key',
            key: '_id',
            width: 200,
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Filter ' + ' level',
            dataIndex: 'filterLevel',
            key: '_id',
            width: 100,
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Mandatory filter',
            dataIndex: 'mandatory',
            key: '_id',
            width: 100,
            render: (text) => (text ? <CheckCircleOutlined /> : <CloseCircleOutlined />),
        },
        {
            title: 'Multiple value select',
            dataIndex: 'multiple',
            key: '_id',
            width: 100,
            render: (text) => (text ? <CheckCircleOutlined /> : <CloseCircleOutlined />),
        },
        {
            title: 'Default Select All',
            dataIndex: 'defaultSelectAll',
            width: 150,
            key: '_id',
            render: (value) => (
                <div style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Checkbox value={value} checked={value} style={{ alignSelf: 'center' }} />
                </div>
            ),
        },
        {
            title: 'Show Search',
            dataIndex: 'showSearch',
            width: 150,
            key: '_id',
            render: (value) => (
                <div style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Checkbox value={value} checked={value} style={{ alignSelf: 'center' }} />
                </div>
            ),
        },

        {
            title: 'Action',
            key: 'action',
            width: 300,
            fixed: 'right',
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
                            activate({ _id: record._id, active: !text.active, parentId: record.parent });
                        }}
                    >
                        {text.active ? 'Deactivate' : 'Activate'}
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
            columns={columns(deleteCategoryListInServer, onClickUpdateInRow, activateFilterInServer)}
            dataSource={filterList}
            scroll={{ x: 1300 }}
            style={{ marginTop: 30 }}
        />
    );
};

export default ProductView;
