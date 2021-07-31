import { Table, Tag, Space, Button, Input, Row, Select, Form, Card } from 'antd';

import React, { Component } from 'react';
import { UndoOutlined } from '@ant-design/icons';
import { RouteComponentProps, RouteProps } from 'react-router-dom';
// import { errorShow, success, warning } from '../../../components/ALert';
// import {
//     addProductCatelogue,
//     deleteProductCatelogue,
//     updateProductCatelogue,
//     getProductCatelogue,
// } from '../../../server/catalogue/catalogue.api';

// const { Option } = Select;

// const addressType = '';

const columns = (onDelete, onUpdate) => [
    {
        title: 'Business category' + ' name',
        dataIndex: 'name',
        key: '_id' + 'City',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Business category ' + ' description',
        dataIndex: 'description',
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

export interface CategoryProps extends RouteComponentProps {}

const Category: React.FC<CategoryProps> = ({}) => {
    const [form] = Form.useForm();
    const [loader, setLoader] = React.useState(0);
    const [update, setUpdate] = React.useState(null);
    const [businessCategory, setBusinessCategory] = React.useState([]);

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    // const createBusinessCategoryInServer = async (data) => {
    //     setLoader(1);
    //     try {
    //         const response = await addProductCatelogue({
    //             ...data,
    //             occupationType: 'Business',
    //         });
    //         console.log(response);
    //         setLoader(0);
    //         if (response.payload) {
    //             success('Business Category' + ' created!');
    //             loadAllOccupationCategory();
    //             form.resetFields();
    //         }
    //     } catch (error) {
    //         setLoader(0);
    //         errorShow(error.message);
    //     }
    // };

    // const loadAllOccupationCategory = async () => {
    //     try {
    //         const category = await getOccupationCategory({
    //             occupationType: 'Business',
    //         });
    //         console.log(category);
    //         setBusinessCategory(category.payload);
    //     } catch (error) {
    //         errorShow(error.message);
    //     }
    // };

    // const deleteBusinessCategoryInServer = async (data) => {
    //     try {
    //         const response = await deleteOccupationCategory({ ...data });

    //         if (response.payload) {
    //             success('BusinessCategory deleted!!');
    //             loadAllOccupationCategory();
    //         }
    //     } catch (error) {
    //         errorShow(error.message);
    //     }
    // };

    // const updateBusinessCategoryInServer = async (data) => {
    //     setLoader(1);
    //     try {
    //         const response = await updateOccupationCategory({ ...update, ...data });
    //         setLoader(0);
    //         if (response.payload) {
    //             success('Business Category Updated');
    //             loadAllOccupationCategory();
    //             form.resetFields();
    //             setUpdate(null);
    //         }
    //     } catch (error) {
    //         setLoader(0);
    //         errorShow(error.message);
    //     }
    // };

    const onClickUpdateInRow = (data) => {
        const formValue = {};
        formValue.name = data.name;
        formValue.description = data.description;
        form.setFieldsValue(formValue);
        setUpdate(data);
    };

    React.useEffect(() => {
        // loadAllOccupationCategory();
    }, []);

    return (
        <div style={{ alignItems: 'center' }}>
            <div className="site-card-border-less-wrapper">
                <Card title="Add/Update Business Category" loading={loader === 1} bordered={false} style={{}}>
                    <Form
                        // name="basic"
                        form={form}
                        layout="vertical"
                        initialValues={{ remember: true }}
                        onFinish={() => {
                            // form.validateFields().then((value) => {
                            //     if (!update) {
                            //         createBusinessCategoryInServer(value);
                            //     } else {
                            //         updateBusinessCategoryInServer(value);
                            //     }
                            // });
                        }}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            label={'Name'}
                            name={'name'}
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    min: 3,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={'Description'}
                            name={'description'}
                            rules={[
                                {
                                    min: 3,
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
                columns={columns(() => {}, onClickUpdateInRow)}
                dataSource={businessCategory}
                on
                style={{ marginTop: '10vh' }}
            />
        </div>
    );
};

export default Category;
