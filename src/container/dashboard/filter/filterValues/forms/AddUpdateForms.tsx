/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { UndoOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Form, Input, Select, Space } from 'antd';
import React from 'react';
import { errorShow, success } from '../../../../../components/ALert';
import { formRequiredRule } from '../../../../../constants';
import { IProductCatalogue } from '../../../../../server/catalogue/catalogue.interface';
import {
    activateClassfier,
    createCategory,
    deleteCategory,
    updateCategory,
} from '../../../../../server/filter/category/category.api';
import { IFilter } from '../../../../../server/filter/filter/filter.interface';
import ProductCardView from '../productCardView/ProductCardView';

const AddUpdateForms = ({
    form,
    form1,
    setLoader,
    loader,
    selectedCategory,
    setFilterList,
    filterList,
    loadAllFilterItem,
    classifier,
    loadAllFilter,
    loadAllFilterSubItem,
    loadClassifiersFromServer,
}) => {
    const [update, setUpdate] = React.useState(false);
    const [active, setActive] = React.useState(false);

    const deleteCategoryListInServer = async (data) => {
        console.log('DELETE DATA', data);
        try {
            const response = await deleteCategory({ ...data });

            if (response.status === 1) {
                success('Classifier deleted!!');
                // loadAllFilterItem({
                //     type: classifier.length > 0 && selectedCategory ? classifier[selectedCategory].type : undefined,
                // });
                loadAllFilterItem({ parent: data.parent });
            }
        } catch (error) {
            errorShow(error.message);
        }
    };

    const onClickUpdateInRow = (data: IFilter) => {
        const formValue: Partial<IFilter> = {};
        formValue.name = data.name;
        formValue.description = data.description;
        formValue.customerImage = data.customerImage;
        formValue.customerName = data.customerName;
        formValue.customerDescription = data.customerDescription;
        formValue.active = data.active;
        formValue.image = data.image;
        form.setFieldsValue(formValue);
        delete data.activate;
        // setSubCategoryExist(data.subCategoryExist);

        setUpdate(data);
    };

    const createFilterInServer = async (data) => {
        setLoader(true);
        try {
            const filterItem = {
                ...data.value,
                parent: data.selectedCategory,
                // type: classifier[selectedCategory].type,
                // parent: classifier[selectedCategory]._id,
            };
            const response = await createCategory(filterItem);

            setLoader(false);
            if (response.status === 1) {
                success('Classifier' + ' created!');
                loadAllFilterItem({
                    // type: classifier.length > 0 && selectedCategory ? classifier[selectedCategory].type : undefined,
                    // type: classifier.length > 0 && selectedCategory ? classifier.type : undefined,

                    parent: selectedCategory || undefined,
                });

                form.resetFields();
                // form1.resetFields();
                setActive(false);
            }
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    const updateFilterInServer = async ({ value, selectedCategory }) => {
        setLoader(true);
        console.log('UPFDATE', value);
        try {
            const response = await updateCategory({ ...update, ...value });
            setLoader(false);

            if (response.status === 1) {
                success('Classfier updated');
                // success(response.payload.active === true ? 'Classifier activated' : 'Classifier dactivated');
                // loadAllFilterItem({
                //     type: classifier.length > 0 && selectedCategory ? classifier[selectedCategory].type : undefined,
                // });
                // loadAllFilterItem({ parent: data.parent });
                loadAllFilterItem({ parent: selectedCategory });
                form.resetFields();
                setUpdate(null);
            }
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    const activateClassfierInServer = async (data: { _id: string; active: boolean }) => {
        console.log('ACTIVE', data._id);
        setLoader(true);
        try {
            const response = await activateClassfier(data);
            setLoader(false);

            if (response.status === 1) {
                console.log('RESPONSE', response);
                success(response.payload);
                loadAllFilterItem({ parent: selectedCategory });
            }
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    return (
        <>
            <Card title="Add/Update Filter Item" loading={loader} bordered={false} style={{ marginTop: '2vh' }}>
                <Form
                    form={form}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    name="basic"
                    layout="horizontal"
                    initialValues={{ remember: true }}
                    onFinish={() => {
                        form1.validateFields().then(() => {
                            form.validateFields().then((value) => {
                                if (!update) {
                                    createFilterInServer({ value, selectedCategory });
                                } else {
                                    updateFilterInServer({ value, selectedCategory });
                                }
                            });
                        });
                    }}
                    // onFinishFailed={onFinishFailed}
                >
                    <Form.Item label={'Name'} name={'name'} rules={formRequiredRule}>
                        <Input />
                    </Form.Item>
                    <Form.Item label={'Description'} name={'description'} rules={formRequiredRule}>
                        <Input.TextArea showCount maxLength={100} />
                    </Form.Item>
                    <Form.Item label={'Image'} name={'image'} rules={formRequiredRule}>
                        <Input />
                    </Form.Item>
                    <Form.Item label={'CustomerName'} name={'customerName'} rules={formRequiredRule}>
                        <Input />
                    </Form.Item>
                    <Form.Item label={'CustomerDescription'} name={'customerDescription'} rules={formRequiredRule}>
                        <Input.TextArea showCount maxLength={100} />
                    </Form.Item>
                    <Form.Item label={'Customer Image'} name={'customerImage'} rules={formRequiredRule}>
                        <Input />
                    </Form.Item>
                    {/* <Form.Item style={{ flex: 1 }} label="Filter Value Type :" name="type" rules={formRequiredRule}>
                    <Select allowClear disabled={update}>
                        {classifier.map((classifier) => (
                            <Option value={classifier}>{classifier}</Option>
                        ))}
                    </Select>
                </Form.Item> */}

                    {/* <Form.Item name="active" valuePropName="active" wrapperCol={{ offset: 4 }}>
                        <Checkbox
                            checked={active}
                            onChange={(active) => {
                                setActive(active.target.checked);
                            }}
                        >
                            Active
                        </Checkbox>
                    </Form.Item> */}
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
            <div>
                <ProductCardView
                    setFilterList={setFilterList}
                    filterList={filterList}
                    deleteCategoryListInServer={deleteCategoryListInServer}
                    onClickUpdateInRow={onClickUpdateInRow}
                    updateFilterInServer={updateFilterInServer}
                    activateClassfierInServer={activateClassfierInServer}
                />
            </div>
        </>
    );
};

export default AddUpdateForms;
