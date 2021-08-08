import { createAddress, getAddress, deleteAddress, updateAddress } from '@/api/address';

import { errorShow, success } from '@/components/ALert';
import { Table, Tag, Space, Button, Input, Row, Form, Card } from 'antd';

import React, { Component } from 'react';
import { UndoOutlined } from '@ant-design/icons';

const addressType = 'State';
const columns = (onDelete, onUpdate) => [
    {
        title: `${addressType} name`,
        dataIndex: 'name',
        key: '_id',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                <Button
                    type={'primary'}
                    title={'Update'}
                    onClick={() => {
                        console.log(record);
                        onUpdate(record);
                    }}
                >
                    {'Edit'}
                </Button>
                <Button
                    type={'primary'}
                    title={'Delete'}
                    onClick={() => {
                        console.log(record);
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

const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
];

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const AddState = () => {
    const [form] = Form.useForm();
    const [loader, setLoader] = React.useState(0);
    const [address, setAddress] = React.useState([]);
    const [update, setUpdate] = React.useState(null);

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const createAddressInServer = async (data) => {
        console.log(data[addressType], data);
        setLoader(1);
        try {
            const response = await createAddress({
                name: data[addressType],
                parent: '',
                addressType,
            });
            console.log(response);
            setLoader(0);
            if (response.payload) {
                success(`State ${data[addressType]} saved!!`);
                form.resetFields();
                loadAddress();
            }
        } catch (error) {
            setLoader(0);
            errorShow(error.message);
        }
    };

    const loadAddress = async () => {
        try {
            const response = await getAddress({ addressType });
            if (response.status === 1) {
                setAddress(response.payload);
            }
        } catch (error) {
            errorShow(error.message);
        }
    };

    const deleteAddressInServer = async (data) => {
        console.log(data);
        try {
            const response = await deleteAddress({ ...data });
            console.log(response);
            if (response.payload) {
                success(`State ${data.name} deleted!!`);
                loadAddress();
            }
        } catch (error) {
            errorShow(error.message);
        }
    };

    const updateAddressInServer = async (data) => {
        console.log({ ...update, name: data[addressType] });
        setLoader(1);
        try {
            const response = await updateAddress({
                ...update,
                name: data[addressType],
            });
            setLoader(0);
            if (response.payload) {
                success(`State ${data[addressType]} updated!!`);
                loadAddress();
                form.resetFields();
                setUpdate(null);
            }
        } catch (error) {
            setLoader(0);
            errorShow(error.message);
        }
    };

    const onClickUpdateInRow = (data) => {
        const formValue = {};
        formValue[addressType] = data.name;
        form.setFieldsValue(formValue);
        setUpdate(data);
    };

    React.useEffect(() => {
        loadAddress();
    }, []);

    return (
        <div style={{ alignItems: 'center' }}>
            <div className="site-card-border-less-wrapper">
                <Card title="Add/Update State" loading={loader === 1} bordered={false} style={{}}>
                    <Form
                        // name="basic"
                        form={form}
                        layout="vertical"
                        initialValues={{ remember: true }}
                        onFinish={() => {
                            form.validateFields().then((value) => {
                                if (!update) {
                                    createAddressInServer(value);
                                } else {
                                    updateAddressInServer(value);
                                }
                            });
                        }}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            label={addressType}
                            name={addressType}
                            rules={[
                                {
                                    required: true,
                                    message: `Please input ${addressType}!`,
                                },
                                {
                                    min: 3,
                                    message: `${addressType} name must have atleast 3 character.`,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Space size="middle">
                            {update && (
                                <Button
                                    type={'default'}
                                    icon={<UndoOutlined />}
                                    htmlType="submit"
                                    style={{ marginTop: '20px' }}
                                    onClick={() => {
                                        setUpdate(null);
                                        form.resetFields();
                                    }}
                                >
                                    {'Reset'}
                                </Button>
                            )}
                            <Button type={'primary'} htmlType="submit" style={{ marginTop: '20px' }}>
                                {update ? 'Save' : 'Create'}
                            </Button>
                        </Space>
                    </Form>
                </Card>
            </div>
            <Table
                columns={columns(deleteAddressInServer, onClickUpdateInRow)}
                dataSource={address}
                on
                style={{ marginTop: '10vh' }}
            />
        </div>
    );
};

export default AddState;
