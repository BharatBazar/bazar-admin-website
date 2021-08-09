import { Table, Space, Button, Input, Form, Card } from 'antd';
import React from 'react';
import { UndoOutlined } from '@ant-design/icons';
import { addressType as at } from '../../../server/location/address.interface';
import { errorShow, success } from '../../../components/ALert';
import { createAddress, getAddress, deleteAddress, updateAddress } from '../../../server/location/address.api';

const addressType = at.state;

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
                        onUpdate(record);
                    }}
                >
                    {'Edit'}
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

const AddState = () => {
    const [form] = Form.useForm();
    const [loader, setLoader] = React.useState(0);
    const [address, setAddress] = React.useState([]);
    const [update, setUpdate] = React.useState(null);

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
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

    const createAddressInServer = async (data) => {
        setLoader(1);
        try {
            const response = await createAddress({
                name: data[addressType],

                addressType,
            });
            setLoader(0);
            if (response.status === 1) {
                success(`State ${data[addressType]} saved!!`);
                form.resetFields();
                loadAddress();
            }
        } catch (error) {
            setLoader(0);
            errorShow(error.message);
        }
    };

    const deleteAddressInServer = async (data) => {
        try {
            const response = await deleteAddress({ ...data });

            if (response.status === 1) {
                success(`State ${data.name} deleted!!`);
                loadAddress();
            }
        } catch (error) {
            errorShow(error.message);
        }
    };

    const updateAddressInServer = async (data) => {
        setLoader(1);
        try {
            const response = await updateAddress({
                ...update,
                name: data[addressType],
            });
            setLoader(0);
            if (response.status === 1) {
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
            <Card title={'State table'} style={{ marginTop: '2vh' }}>
                <Table columns={columns(deleteAddressInServer, onClickUpdateInRow)} dataSource={address} on />
            </Card>
        </div>
    );
};

export default AddState;
