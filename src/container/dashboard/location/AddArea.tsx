import { Table, Space, Button, Input, Form, Card, Select } from 'antd';
import React from 'react';
import { UndoOutlined } from '@ant-design/icons';
import { addressType as at } from '../../../server/location/address.interface';
import { errorShow, success } from '../../../components/ALert';
import { createAddress, getAddress, deleteAddress, updateAddress } from '../../../server/location/address.api';

const addressType = at.area;

const columns = (onDelete, onUpdate) => [
    {
        title: 'Area' + ' name',
        dataIndex: 'parent',
        key: '_id' + 'State',
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

const AddArea = () => {
    const [form] = Form.useForm();
    const [loader, setLoader] = React.useState(0);
    const [update, setUpdate] = React.useState(null);
    const [state, setState] = React.useState([]);
    const [city, setCity] = React.useState([]);

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    async function loadAddress(data) {
        try {
            const address = await getAddress(data);
            console.log(address);
            if (address && address.payload) {
                if (data.addressType === 'State') {
                    setState(address.payload);
                } else if (data.addressType === 'City') {
                    const city = address.payload.map((item) => {
                        item.parent = item.parent.name;
                        return item;
                    });
                    setCity(city);
                }
            } else if (!address) {
                errorShow('Error loading address. Please refresh the page.');
            } else {
                errorShow(address.message);
            }
        } catch (error) {
            errorShow("Error loading state's");
        }
    }

    const createAddressInServer = async (data) => {
        setLoader(1);
        try {
            const response = await createAddress({
                name: data[addressType],
                parent: data.state,
                addressType,
            });

            setLoader(0);
            if (response.payload) {
                success(`${data[addressType]} city` + ` created!!`);
                form.resetFields();
                loadAddress({ addressType: 'City' });
            }
        } catch (error) {
            setLoader(0);
            errorShow(error.message);
        }
    };

    const deleteAddressInServer = async (data) => {
        console.log(data);
        try {
            const response = await deleteAddress({ ...data });
            console.log(response);
            if (response.payload) {
                success(`${data.name} city` + ` deleted!!`);
                loadAddress({ addressType: 'City' });
            }
        } catch (error) {
            errorShow(error.message);
        }
    };

    const updateAddressInServer = async (data) => {
        console.log({ ...update, name: data[addressType], parent: data.state });
        setLoader(1);
        try {
            const response = await updateAddress({
                ...update,
                name: data[addressType],
                parent: data.state,
            });
            setLoader(0);
            if (response.payload) {
                loadAddress({ addressType: 'City' });
                success(`${data[addressType]} city` + ` updated!!`);
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
        formValue.state = data.parent;
        form.setFieldsValue(formValue);
        setUpdate(data);
    };

    React.useEffect(() => {
        loadAddress({ addressType: 'State' });
        loadAddress({ addressType: 'City' });
    }, []);

    return (
        <div style={{ alignItems: 'center' }}>
            <div className="site-card-border-less-wrapper">
                <Card title="Add/Update City" loading={loader === 1} bordered={false} style={{}}>
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
                            label="State:"
                            name={'state'}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select loading={state.length === 0} allowClear>
                                {state.map((address) => (
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
                dataSource={city}
                on
                style={{ marginTop: '10vh' }}
            />
        </div>
    );
};

export default AddArea;
