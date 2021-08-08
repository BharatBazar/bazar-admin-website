import { createAddress, getAddress, deleteAddress, updateAddress } from '@/api/address';

import { Table, Tag, Space, Button, Input, Row, Select, Form, Card } from 'antd';

import React, { Component } from 'react';
import { UndoOutlined } from '@ant-design/icons';
import { errorShow, success, warning } from '../../../components/ALert';

const { Option } = Select;

const addressType = 'Area';
const columns = (onDelete, onUpdate) => [
    {
        title: 'City' + ' name',
        dataIndex: 'parent',
        key: '_id' + 'City',
        render: (text) => <a>{text}</a>,
    },
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
                    title={'Edit'}
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
    const [update, setUpdate] = React.useState(null);

    const [city, setCity] = React.useState([]);
    const [area, setArea] = React.useState([]);

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const createAddressInServer = async (data) => {
        console.log({
            name: data[addressType],
            parent: data.city,
            addressType,
        });
        setLoader(1);
        try {
            const response = await createAddress({
                name: data[addressType],
                parent: data.city,
                addressType,
            });

            setLoader(0);
            if (response.payload) {
                success(`${data[addressType]} area` + ` created!`);
                form.resetFields();
                loadAddress({ addressType: 'Area' });
            }
        } catch (error) {
            setLoader(0);
            errorShow(error.message);
        }
    };

    async function loadAddress(data) {
        try {
            const address = await getAddress(data);

            if (address && address.payload) {
                if (data.addressType === 'City') {
                    setCity(address.payload);
                } else if (data.addressType === 'Area') {
                    const area = address.payload.map((item) => {
                        item.parent = item.parent.name;
                        return item;
                    });
                    setArea(area);
                }
            } else if (!address) {
                errorShow('Error loading address. Please refresh the page.');
            } else {
                errorShow(address.message);
            }
        } catch (error) {
            errorShow("Error loading city's");
        }
    }

    const deleteAddressInServer = async (data) => {
        console.log(data);
        try {
            const response = await deleteAddress({ ...data });
            console.log(response);
            if (response.payload) {
                success(`${data[addressType]} area deleted!!`);
                loadAddress({ addressType: 'Area' });
            }
        } catch (error) {
            errorShow(error.message);
        }
    };

    const updateAddressInServer = async (data) => {
        console.log({ ...update, name: data[addressType], parent: data.city });
        setLoader(1);
        try {
            const response = await updateAddress({
                ...update,
                name: data[addressType],
                parent: data.city,
            });
            console.log(response);
            setLoader(0);
            if (response.payload) {
                success(`${data[addressType]} area` + ` Updated`);
                loadAddress({ addressType: 'Area' });
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
        formValue.city = data.parent;
        form.setFieldsValue(formValue);
        setUpdate(data);
    };

    React.useEffect(() => {
        loadAddress({ addressType: 'Area' });
        loadAddress({ addressType: 'City' });
    }, []);

    return (
        <div style={{ alignItems: 'center' }}>
            <div className="site-card-border-less-wrapper">
                <Card title="Add/Update Area" loading={loader === 1} bordered={false} style={{}}>
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
                            label="City:"
                            name={'city'}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select loading={city.length === 0} allowClear onChange={(value) => {}}>
                                {city.map((address) => (
                                    <Option value={address._id}>{address.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>

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
                dataSource={area}
                on
                style={{ marginTop: '10vh' }}
            />
        </div>
    );
};

export default AddState;
