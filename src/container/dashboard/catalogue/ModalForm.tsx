import { Table, Space, Button, Input, Form, Card, Select, Radio, RadioChangeEvent, Row, Col } from 'antd';
import React, { useContext, useState } from 'react';
import { UndoOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router-dom';

import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox';

import {
    addProductCatelogue,
    deleteProductCatelogue,
    updateProductCatelogue,
    getProductCatelogue,
    activateCatelogueItem,
} from '../../../server/catalogue/catalogue.api';
import { categoryType, IProductCatalogue } from '../../../server/catalogue/catalogue.interface';
import { errorShow, success } from '../../../components/ALert';
import { formRequiredRule } from '../../../constants';
import { CategoryContext, createCategoryContext } from './SubCategory1';
import { statusValue } from '../../../server/common.interface';

type LayoutType = Parameters<typeof Form>[0]['layout'];

export interface CategoryProps extends RouteComponentProps {
    setModal: (value: boolean) => void;
    updateFlow: boolean;
    onSelect: (value: any) => void;
    productInfo: Partial<IProductCatalogue>;
    isVisible: boolean;
}

const ModalForm: React.FC<CategoryProps> = ({ productInfo, setModal, updateFlow, isVisible }) => {
    const [form] = Form.useForm<Partial<IProductCatalogue>>();
    const [loader, setLoader] = React.useState<boolean>(false);

    const [parentExist, setParentExist] = React.useState(false);
    const [category, setCategory] = React.useState<IProductCatalogue[]>([]);
    const [showForm, setShowForm] = React.useState(false);

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const createCategoryListInServer = async (data) => {
        setLoader(true);

        try {
            const response = await addProductCatelogue({
                ...data,
            });

            setLoader(false);
            if (response.status == statusValue.success) {
                setModal(true);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    const loadAllCategory = async (data) => {
        try {
            setLoader(true);
            const category = await getProductCatelogue(data);

            setLoader(false);

            setCategory(category.payload.filter((e) => e.path.length === 0));
        } catch (error) {
            errorShow(error.message);
            setLoader(false);
        }
    };

    const updateCategoryListInServer = async (data) => {
        setLoader(true);

        try {
            const response = await updateProductCatelogue({ ...data, _id: productInfo._id });
            setLoader(false);

            if (response.payload) {
                success('Category Updated');
                loadAllCategory({ parent: form.getFieldValue('parent') });

                setModal(true);
            }
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    const onClickUpdateInRow = (data: any) => {
        console.log(data);
        const formValue: Partial<IProductCatalogue> = {};
        formValue.name = data.name;
        formValue.description = data.description;
        formValue.image = data.image;
        formValue.customer_name = data.customer_name;
        formValue.customer_image = data.customer_image;
        formValue.customer_description = data.customer_description;
        formValue.type = data.type;

        form.setFieldsValue(formValue);
    };

    React.useEffect(() => {
        // loadAllCategory({ categoryType: categoryType.Category });
        // loadAllCategory();
        if (isVisible) {
            if (updateFlow) {
                setShowForm(true);
                onClickUpdateInRow(productInfo);
            }
        } else {
            form.resetFields();
            setShowForm(false);
        }
    }, [isVisible]);

    return (
        <div style={{ alignItems: 'center' }}>
            <div className="site-card-border-less-wrapper">
                <Card
                    title={updateFlow ? 'Update Catalogue' : 'Add Catalogue'}
                    loading={loader}
                    bordered={false}
                    style={{}}
                >
                    {updateFlow ? null : (
                        <Row style={{ marginBottom: 20 }}>
                            <Col span={9} style={{ justifyContent: 'flex-end' }}>
                                <h4>{'Parent Exist:'}</h4>
                            </Col>
                            <Col span={13}>
                                <Radio.Group
                                    value={parentExist}
                                    onChange={(e: RadioChangeEvent) => {
                                        setParentExist(e.target.value);
                                        if (e.target.value) {
                                            setShowForm(false);
                                            loadAllCategory({});
                                        } else {
                                            setShowForm(true);
                                        }
                                    }}
                                >
                                    <Radio value>{'Yes'}</Radio>
                                    <Radio value={false}>{'NO'}</Radio>
                                </Radio.Group>
                            </Col>
                        </Row>
                    )}
                    <Form
                        form={form}
                        labelCol={{ span: 9 }}
                        wrapperCol={{ span: 18 }}
                        layout="horizontal"
                        initialValues={{ remember: true }}
                        onFinish={() => {
                            // form.setFieldsValue({ type: form.getFieldValue('name').replace(' ', '_').toLowerCase() });

                            form.validateFields().then((value) => {
                                if (!updateFlow) {
                                    createCategoryListInServer(value);
                                } else {
                                    updateCategoryListInServer(value);
                                }
                            });
                        }}
                        onFinishFailed={onFinishFailed}
                    >
                        {parentExist ? (
                            <Form.Item style={{ flex: 1 }} label="Parent :" name="parent" rules={formRequiredRule}>
                                <Select
                                    allowClear
                                    showSearch
                                    onSelect={() => setShowForm(true)}
                                    optionFilterProp="children"
                                >
                                    {category.map((category) => (
                                        <>
                                            <Option value={category._id}>{category.name}</Option>;
                                            {category.child.map((subCategory) => {
                                                return (
                                                    <Option value={subCategory._id}>
                                                        {subCategory.type.split(' ').join(' ')}
                                                    </Option>
                                                );
                                            })}
                                        </>
                                    ))}
                                </Select>
                            </Form.Item>
                        ) : null}
                        {/* {productInfo.child && productInfo.child.length > 0 && (
                            <Row>
                                <Col span={9}>
                                    <h3>{'Parent'}</h3>
                                </Col>
                                <Col span={13}>
                                    <h5>{productInfo.parent && productInfo.parent}</h5>
                                </Col>
                            </Row>
                        )} */}

                        {showForm && (
                            <>
                                <Form.Item label={'Name'} name={'name'} rules={formRequiredRule}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label={'Description'} name={'description'} rules={formRequiredRule}>
                                    <Input.TextArea showCount maxLength={150} />
                                </Form.Item>
                                <Form.Item label={'Image'} name={'image'} rules={formRequiredRule}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label={'Customer_name'} name={'customer_name'} rules={formRequiredRule}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label={'Customer_image'} name={'customer_image'} rules={formRequiredRule}>
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label={'Customer_description'}
                                    name={'customer_description'}
                                    rules={formRequiredRule}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item label={'Type'} name={'type'} rules={formRequiredRule}>
                                    <Input disabled={updateFlow} />
                                </Form.Item>
                                <Row>
                                    <Col span={9} />
                                    <Col span={13}>
                                        <h5>
                                            {
                                                'This has to be unique for all catalogue also use\nthis format a_b_c so in front end name will show as --> a b c'
                                            }
                                        </h5>
                                    </Col>
                                </Row>
                                <Space size="middle">
                                    {updateFlow && (
                                        <Button
                                            type={'default'}
                                            icon={<UndoOutlined />}
                                            htmlType="submit"
                                            style={{ marginTop: '20px' }}
                                            onClick={() => {
                                                form.resetFields();
                                            }}
                                        >
                                            {'Reset'}
                                        </Button>
                                    )}
                                    <Button type={'primary'} htmlType="submit" style={{ marginTop: '20px' }}>
                                        {updateFlow ? 'Save' : 'Create'}
                                    </Button>
                                </Space>
                            </>
                        )}
                        {/* <Form.Item label={'Type'} name={'type'} rules={formRequiredRule}>
                            <Input />
                        </Form.Item> */}
                    </Form>
                </Card>
            </div>
            {/* <Table
                columns={columns(deleteCategoryListInServer, onClickUpdateInRow, activateCatalogueItemInServer)}
                dataSource={categoryList}
                style={{ marginTop: '10vh' }}
                scroll={{ x: 1300 }}
            /> */}
        </div>
    );
};

export default ModalForm;
