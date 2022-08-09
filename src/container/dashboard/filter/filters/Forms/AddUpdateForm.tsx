/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { UndoOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Form, Input, Radio, Select, Space } from 'antd';
import React from 'react';
import { errorShow, success } from '../../../../../components/ALert';
import { formRequiredRule } from '../../../../../constants';
import {
    activateFilter,
    createFilter,
    deleteFilter,
    updateFilter,
} from '../../../../../server/filter/filter/fitler.api';
import ProductView from '../ProductView/ProductView';

const AddAndUpdateForm = ({
    form,
    filterList,
    loadAllFilter,
    selectedCategory,
    setFilterList,
    loadAllFilterChild,
    setShowForm,
    showForm,
}) => {
    const [loader, setLoader] = React.useState(false);
    const [update, setUpdate] = React.useState(null);
    const [defaultSelectAll, setDefaultSelectAll] = React.useState(false);
    const [showSearch, setShowSearch] = React.useState(false);

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onClickUpdateInRow = (data: IFilter) => {
        const formValue: Partial<IFilter> = {};
        formValue.name = data.name;
        formValue.description = data.description;
        formValue.type = data.type;
        formValue.filterLevel = data.filterLevel;
        formValue.image = data.image;
        formValue.multiple = data.multiple;
        formValue.mandatory = data.mandatory;
        formValue.customerHeading = data.customerHeading;
        formValue.customerDescription = data.customerDescription;
        formValue.customerImage = data.customerImage;
        formValue.showSearch = data.showSearch;
        formValue.defaultSelectAll = data.defaultSelectAll;
        formValue.key = data.key;
        form.setFieldsValue(formValue);
        delete data.activate;
        setUpdate(data);
    };

    const createFilterInServer = async (data) => {
        setLoader(true);
        const dataToSend = {
            ...data.value,
            parent: data.selectedCategory,
            defaultSelectAll,
            showSearch,
        };

        try {
            const response = await createFilter(dataToSend);

            setLoader(false);
            if (response.status === 1) {
                success('Filter' + ' created!');
                loadAllFilter({ parent: data.selectedCategory });
                setDefaultSelectAll(undefined);
                setShowSearch(undefined);
                form.resetFields();
                setDefaultSelectAll(false);
            }
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    const updateFilterInServer = async ({ value, selectedCategory }) => {
        setLoader(true);
        console.log('UPT', value);

        try {
            const data = {
                ...value,
                // parent: data.selectedCategory,
                defaultSelectAll,
                showSearch,
            };
            const response = await updateFilter({ ...update, ...data });
            setLoader(false);

            if (response.status === 1) {
                success('Filter updated');
                loadAllFilter({ parent: selectedCategory });
                setDefaultSelectAll(undefined);
                setShowSearch(undefined);
                form.resetFields();
                setUpdate(null);
            }
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    const activateFilterInServer = async (data: { _id: string; active: boolean }) => {
        console.log('ACTIVE', data);
        setLoader(true);
        try {
            const response = await activateFilter(data);
            setLoader(false);

            if (response.status === 1) {
                console.log('RESPONSE', response);
                success(response.payload);
                loadAllFilterChild({ _id: data._id });
            }
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    const deleteCategoryListInServer = async (data) => {
        console.log('DATa', data);
        try {
            const response = await deleteFilter({ ...data });
            if (response.status === 1) {
                success('Filter deleted!!');
                loadAllFilter({ parent: data.parent });
            }
        } catch (error) {
            errorShow(error.message);
        }
    };

    return (
        <>
            <>
                <Card title="Add/Update Filter" loading={loader} bordered={false} style={{ marginTop: '2vh' }}>
                    <Form
                        form={form}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 15 }}
                        name="basic"
                        layout="horizontal"
                        initialValues={{ remember: true }}
                        onFinish={() => {
                            form.validateFields().then(() => {
                                form.validateFields().then((value) => {
                                    console.log('values', value);
                                    if (!update) {
                                        createFilterInServer({ value, selectedCategory });
                                    } else {
                                        updateFilterInServer({ value, selectedCategory });
                                    }
                                });
                            });
                        }}
                        onFinishFailed={onFinishFailed}
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
                        <Form.Item label={'Customer Heading'} name={'customerHeading'} rules={formRequiredRule}>
                            <Input />
                        </Form.Item>
                        <Form.Item label={'Customer Description'} name={'customerDescription'} rules={formRequiredRule}>
                            <Input.TextArea showCount maxLength={100} />
                        </Form.Item>
                        <Form.Item label={'Customer Image'} name={'customerImage'} rules={formRequiredRule}>
                            <Input />
                        </Form.Item>
                        {!update ? (
                            <Form.Item label={'Filter Type (unique)'} name={'key'} rules={formRequiredRule}>
                                <Input />
                            </Form.Item>
                        ) : (
                            <Form.Item label={'Filter Type (unique)'} name={'key'} rules={formRequiredRule}>
                                <Input disabled />
                            </Form.Item>
                        )}

                        <Form.Item label="Mandatory" name="mandatory" rules={formRequiredRule}>
                            <Radio.Group>
                                <Radio value>{'Need to provide when launching product to market.'}</Radio>
                                <Radio value={false}>{'No need to provide when launching to market.'}</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="Multiple selection" name="multiple" rules={formRequiredRule}>
                            <Radio.Group>
                                <Radio value={false}>{'No multiple values of filter cannot be selected.'}</Radio>
                                <Radio value>{'Yes multiple value of filter can be selected.'}</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="Filter level" name="filterLevel" rules={formRequiredRule}>
                            <Radio.Group>
                                <Radio value={0}>{'0 for a basic filter'}</Radio>
                                <Radio value={1}>
                                    {
                                        '1 is for higher filter which is main categorical distribution like color for a jeans.'
                                    }
                                </Radio>
                                <Radio value={2}>{'2 is for category under higher filter like size in color.'}</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item name="showSearch" wrapperCol={{ offset: 4 }}>
                            <Checkbox
                                checked={showSearch}
                                onChange={(showSearch) => {
                                    setShowSearch(showSearch.target.checked);
                                    console.log(showSearch.target.checked);
                                }}
                            >
                                Show Search
                            </Checkbox>
                        </Form.Item>

                        <Form.Item name="defaultSelectAll" wrapperCol={{ offset: 4 }}>
                            <Checkbox
                                checked={defaultSelectAll}
                                onChange={(defaultSelectAll) => {
                                    setDefaultSelectAll(defaultSelectAll.target.checked);
                                }}
                            >
                                Default Select All
                            </Checkbox>
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
            </>

            <div>
                {showForm === true ? (
                    <ProductView
                        filterList={filterList}
                        form={form}
                        setUpdate={setUpdate}
                        setLoader={setLoader}
                        onClickUpdateInRow={onClickUpdateInRow}
                        activateFilterInServer={activateFilterInServer}
                        deleteCategoryListInServer={deleteCategoryListInServer}
                        showForm={showForm}
                        setShowForm={setShowForm}
                    />
                ) : null}
            </div>
        </>
    );
};

export default AddAndUpdateForm;
