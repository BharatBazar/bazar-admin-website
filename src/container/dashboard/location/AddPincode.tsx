import { Table, Space, Button, Input, Form, Card, Select } from 'antd';
import React from 'react';
import { UndoOutlined } from '@ant-design/icons';
import { addressType as at } from '../../../server/location/address.interface';
import { errorShow, success } from '../../../components/ALert';
import { createAddress, getAddress, deleteAddress, updateAddress } from '../../../server/location/address.api';

const addressType = at.pincode;

const columns = (onDelete, onUpdate) => [
    {
        title: 'City' + ' name',
        dataIndex: 'parent',
        key: '_id' + 'Pincode',
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

const AddCity = () => {
    const [form] = Form.useForm();
    const [loader, setLoader] = React.useState(0);
    const [update, setUpdate] = React.useState(null);
    const [city, setCity] = React.useState([]);
    const [pincode, setPincode] = React.useState([]);

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    async function loadAddress(data) {
        try {
            const address = await getAddress(data);
            console.log(address);
            if (address && address.payload) {
                if (data.addressType === 'Pincode') {
                    const pincode = address.payload.map((item) => {
                        item.parent = item.parent.name;
                        return item;
                    });
                    setPincode(pincode);
                } else if (data.addressType === 'City') {
                    setCity(address.payload);
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

    const createAddressInServer = async (data) => {
        setLoader(1);
        try {
            const response = await createAddress({
                name: data[addressType],
                parent: data.parent,
                addressType,
            });

            setLoader(0);
            if (response.payload) {
                success(`${data[addressType]} pincode` + ` created!!`);
                form.resetFields();
                loadAddress({ addressType });
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
                success(`${data.name} pincode` + ` deleted!!`);
                loadAddress({ addressType });
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
            });
            setLoader(0);
            if (response.payload) {
                loadAddress({ addressType });
                success(`${data[addressType]} pincode` + ` updated!!`);
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
        formValue.parent = data.parent;
        form.setFieldsValue(formValue);

        setUpdate(data);
    };

    React.useEffect(() => {
        loadAddress({ addressType: 'Pincode' });
        loadAddress({ addressType: 'City' });
    }, []);

    return (
        <div style={{ alignItems: 'center' }}>
            <div className="site-card-border-less-wrapper">
                <Card title="Add/Update Pincode" loading={loader === 1} bordered={false} style={{}}>
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
                            label="Select city:"
                            name={'parent'}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select loading={city.length === 0} allowClear disabled={update}>
                                {city.map((address) => (
                                    <Option value={address._id}>{address.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={`Provide ${addressType.toLowerCase()}`}
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
            <Card title={'Pincode table'} style={{ marginTop: '2vh' }}>
                <Table columns={columns(deleteAddressInServer, onClickUpdateInRow)} dataSource={pincode} on />
            </Card>
        </div>
    );
};

export default AddCity;
