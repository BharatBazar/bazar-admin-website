import { UndoOutlined } from '@ant-design/icons';
import { Button, Card, Form, Select, Space, Table } from 'antd';

import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { errorShow } from '../../../components/ALert';
import { formRequiredRule } from '../../../constants';
import { getProductCatelogueWithAncestors } from '../../../server/catalogue/catalogue.api';
import { getProductMeta } from '../../../server/checkProduct/product.api';
import { IProductMeta, IProductMetaData, productStatus } from '../../../server/checkProduct/product.interface';

const { Option } = Select;

const columns = (onEdit) => [
    {
        title: 'Shop' + ' name',
        dataIndex: 'shopName',
        key: '_id',
        render: (text) => <a>{text}</a>,
    },

    {
        title: 'City name',
        dataIndex: 'city',
        key: '_id',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Area' + ' name',
        dataIndex: 'area',
        key: '_id',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Owner name',
        dataIndex: 'owner',
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
                    title={'Check'}
                    onClick={() => {
                        onEdit(record);
                    }}
                >
                    {'Check product'}
                </Button>
            </Space>
        ),
    },
];

interface ProductStatusProps extends RouteComponentProps {}

interface form {
    status: productStatus;
    type: string;
}

interface IProductTable {
    shopName: string;
    area: string;
    city: string;
    owner: string;
}

const ProductStatus: React.FunctionComponent<ProductStatusProps> = (props) => {
    console.log(props);
    const [loading, setLoading] = React.useState(true);
    const [catalogue, setCatalogue] = React.useState([]);
    const [products, setProducts] = React.useState<IProductTable[]>([]);
    const [form] = Form.useForm<form | null>(null);

    const pareseProductData = (data) => {
        const products: IProductTable[] = data.map((item: IProductMetaData) => {
            return {
                shopName: item.shopId.shopName,
                area: item.shopId.area.name,
                city: item.shopId.city.name,
                owner: item.shopId.owner.name,
                _id: item._id,
            };
        });
        setProducts(products);
    };

    // To load all categories from backend which are avaialable in the market
    const loadCatalogueFromServer = async () => {
        try {
            setLoading(true);
            const response = await getProductCatelogueWithAncestors();
            setLoading(false);
            if (response.status === 1) {
                console.log(response);
                setCatalogue(response.payload);
            }
        } catch (error) {
            setLoading(false);
            errorShow(error.message);
        }
    };

    const loadAvailabeProduct = async (data: form) => {
        setLoading(true);

        try {
            const response: IProductMeta = await getProductMeta(data.type, { query: { status: data.status } });
            setLoading(false);
            console.log(response);
            if (response.status === 1) {
                pareseProductData(response.payload.payload);
            }
        } catch (error) {
            setLoading(false);
            errorShow(error.message);
        }
    };

    React.useEffect(() => {
        loadCatalogueFromServer();
        return () => {};
    }, []);

    return (
        <div>
            <Card loading={loading} title={'Filter'}>
                <Form
                    form={form}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    name="basic"
                    layout="horizontal"
                    initialValues={{ remember: true }}
                >
                    <Form.Item style={{ flex: 1 }} label="Classifier type :" name="type" rules={formRequiredRule}>
                        <Select allowClear>
                            {catalogue.map((classifier) => (
                                <Option value={classifier.name}>{classifier.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item style={{ flex: 1 }} label="Product status :" name="status" rules={formRequiredRule}>
                        <Select allowClear>
                            {[0, 1, 2, 3, 4, 5].map((classifier) => (
                                <Option value={classifier}>{productStatus[classifier]}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Space style={{ marginTop: '20px' }}>
                        <Button
                            type={'primary'}
                            htmlType="submit"
                            onClick={() => {
                                form.validateFields().then((value) => {
                                    loadAvailabeProduct(value);
                                });
                            }}
                        >
                            {'Apply Filter'}
                        </Button>
                        <Button
                            type={'default'}
                            icon={<UndoOutlined />}
                            htmlType="submit"
                            onClick={() => {
                                form.resetFields();
                                setProducts([]);
                            }}
                        >
                            {'Reset Filter'}
                        </Button>
                    </Space>
                </Form>
            </Card>
            <Card title={'Products'} style={{ marginTop: '10px' }}>
                <Table
                    columns={columns((data: IProductMetaData) => {
                        props.history.push(`/product/edit?id=${data._id}&divison=${form.getFieldValue('type')}`);
                    })}
                    dataSource={products}
                    style={{ marginTop: '2vh' }}
                />
            </Card>
        </div>
    );
};

export default ProductStatus;
