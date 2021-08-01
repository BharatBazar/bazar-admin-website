import { Table, Space, Button, Input, Form, Card } from 'antd';
import React from 'react';
import { UndoOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router-dom';

import Checkbox from 'antd/lib/checkbox/Checkbox';

type LayoutType = Parameters<typeof Form>[0]['layout'];

import {
    addProductCatelogue,
    deleteProductCatelogue,
    updateProductCatelogue,
    getProductCatelogue,
} from '../../../server/catalogue/catalogue.api';
import { categoryType, IProductCatalogue } from '../../../server/catalogue/catalogue.interface';
import { errorShow, success } from '../../../components/ALert';
import { formRequiredRule } from '../../../constants';

const columns = (onDelete, onUpdate) => [
    {
        title: 'Category' + ' name',
        dataIndex: 'name',
        key: '_id' + 'City',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Category ' + ' description',
        dataIndex: 'description',
        key: '_id',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Subcategory exist ',
        dataIndex: 'subCategoryExist',
        key: '_id',

        render: (text) => (text ? <CheckCircleOutlined /> : <CloseCircleOutlined />),
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

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export interface CategoryProps extends RouteComponentProps {}

const Category: React.FC<CategoryProps> = ({}) => {
    const [form] = Form.useForm<Partial<IProductCatalogue>>();
    const [loader, setLoader] = React.useState<boolean>(false);
    const [update, setUpdate] = React.useState(null);
    const [subCategoryExist, setSubCategoryExist] = React.useState(true);
    const [categoryList, setCategoryList] = React.useState([]);

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const createCategoryListInServer = async (data) => {
        setLoader(true);
        try {
            const response = await addProductCatelogue({
                ...data,
                categoryType: categoryType.Category,
                subCategoryExist,
            });

            setLoader(false);
            if (response.payload) {
                success('Category' + ' created!');
                loadAllCategory();

                form.resetFields();
            }
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    const loadAllCategory = async () => {
        try {
            setLoader(true);
            const category = await getProductCatelogue({ categoryType: categoryType.Category });
            setLoader(false);

            setCategoryList(category.payload);
        } catch (error) {
            errorShow(error.message);
            setLoader(false);
        }
    };

    const deleteCategoryListInServer = async (data) => {
        try {
            const response = await deleteProductCatelogue({ ...data });

            if (response.payload) {
                success('CategoryList deleted!!');
                loadAllCategory();
            }
        } catch (error) {
            errorShow(error.message);
        }
    };

    const updateCategoryListInServer = async (data) => {
        setLoader(true);

        try {
            const response = await updateProductCatelogue({ ...update, ...data, subCategoryExist });
            setLoader(false);

            if (response.payload) {
                success('Category Updated');
                loadAllCategory();
                form.resetFields();
                setUpdate(null);
            }
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    const onClickUpdateInRow = (data: IProductCatalogue) => {
        const formValue = {};
        formValue.name = data.name;
        formValue.description = data.description;
        formValue.subCategoryExist = data.subCategoryExist;
        form.setFieldsValue(formValue);
        delete data['activate'];
        setSubCategoryExist(data.subCategoryExist);

        setUpdate(data);
    };

    React.useEffect(() => {
        loadAllCategory();
    }, []);
    console.log(form.getFieldValue('subCategoryExist'));
    return (
        <div style={{ alignItems: 'center' }}>
            <div className="site-card-border-less-wrapper">
                <Card title="Add/Update Category" loading={loader} bordered={false} style={{}}>
                    <Form
                        form={form}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        name="basic"
                        layout="horizontal"
                        initialValues={{ remember: true }}
                        onFinish={() => {
                            form.validateFields().then((value) => {
                                if (!update) {
                                    createCategoryListInServer(value);
                                } else {
                                    updateCategoryListInServer(value);
                                }
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
                        <Form.Item name="subCategoryExist" valuePropName="subCategoryExist" wrapperCol={{ offset: 4 }}>
                            <Checkbox
                                checked={subCategoryExist}
                                onChange={(subCategoryExist) => {
                                    setSubCategoryExist(subCategoryExist.target.checked);
                                }}
                            >
                                Sub Category Exist
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
            </div>
            <Table
                columns={columns(deleteCategoryListInServer, onClickUpdateInRow)}
                dataSource={categoryList}
                style={{ marginTop: '10vh' }}
            />
        </div>
    );
};

export default Category;
