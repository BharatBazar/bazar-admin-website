import { Card, Form, Typography, Select, Input, Row, Avatar, Col, Space, Button, Alert } from 'antd';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import queryString from 'query-string';
import { AntDesignOutlined, UserAddOutlined } from '@ant-design/icons';
import { getProduct, updateProduct } from '../../../server/checkProduct/product.api';
import { errorShow, success } from '../../../components/ALert';
import { IColor, IProduct, productStatus } from '../../../server/checkProduct/product.interface';
import { formRequiredRule } from '../../../constants';
import { IClassfier } from '../../../server/filter/category/category.interface';
import { LeftDivider } from '../../../components/Divider';
import Points from './component/PointsComponent';

const { Paragraph, Text, Title } = Typography;
const { Option } = Select;

interface ProductProps extends RouteComponentProps {
    location: { search: string };
}

const ProductDetails: React.FunctionComponent<ProductProps> = (props) => {
    const [productDetails, setProductDetails] = React.useState<IProduct>('');
    const [loader, setLoader] = React.useState(false);
    const [points, setPoints] = React.useState(['']);

    const params: queryString.ParsedQuery<{ _id: string; divison: string }> = queryString.parse(props.location.search);
    const [form] = Form.useForm<Partial<IProduct>>();

    const fetchProduct = async () => {
        setLoader(true);
        try {
            const a = await getProduct(params.divison, params.id);

            setLoader(false);
            if (a.status === 1) {
                form.setFieldsValue({
                    titleGenerated: a.payload.title,

                    descriptionShownToCustomer: a.payload.descriptionCustomer,

                    status: a.payload.status,
                });
                setPoints(a.payload.note);
                setProductDetails(a.payload);
            }
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    const updateProductC = async (value: Partial<IProduct>) => {
        setLoader(true);
        try {
            const data = {
                ...value,
                note: points.filter((item) => item && item.length > 0),
                _id: productDetails._id,
                alreadyRejected: value.status && value.status === 2,
            };
            console.log('data =>', data);
            const a = await updateProduct(params.divison, data);
            if (a.status == 1) {
                success('Product details updated');
            }
            setLoader(false);
            //  setProductDetails(a.payload);
        } catch (error) {
            setLoader(false);
            errorShow(error.message);
        }
    };

    const renderColor = (colors: any) => {
        if (colors) {
            //    const colors: IColor[] = Object.entries(colorss);
            //   console.log('colors =>', colors, typeof colors);
            // const colors: IColor[] = Array(colorss);
            const a: number = Object.keys(colors).length;
            const s = [];
            for (let i = 0; i < a; i++) {
                // console.log(colors[i], colors[i].color);
                s.push(
                    <div>
                        {LeftDivider(colors[i].color.name)}
                        <Row style={{ alignItems: 'center' }}>
                            <div
                                style={{
                                    backgroundColor: colors[i].color.description,
                                    width: '30px',
                                    height: '30px',
                                    marginRight: '10px',
                                }}
                            />
                            {colors[i].sizes.map((item) => (
                                <Text code>{item.size.name}</Text>
                            ))}
                        </Row>
                    </div>,
                );
            }
            return s;
            // }
            // return <Title level={5}>{'Not provided'}</Title>;
        }
    };

    React.useEffect(() => {
        fetchProduct();
        return () => {};
    }, []);

    const renderFilter = (details: IClassfier | IClassfier[] | undefined, title?: string) => {
        console.log('details =>', details);
        const renderDetails = (details) => (
            <Row style={{ alignItems: 'center' }}>
                <Avatar
                    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                    src={details.image || <UserAddOutlined />}
                />
                <Col>
                    <Text style={{ marginLeft: '10px', fontSize: '10px', marginTop: 0 }}>{details.name || ''}</Text>
                    <Text>{' - '}</Text>
                    <Text style={{ fontSize: '10px', marginTop: 0 }}>{details.description || ''}</Text>
                </Col>
            </Row>
        );

        // const renderColor = () => {};

        if (details) {
            return (
                <Col>
                    {LeftDivider(title)}
                    {Array.isArray(details) ? (
                        details.length > 0 ? (
                            details.map((item) => renderDetails(item))
                        ) : (
                            <Title level={5}>{'Not provided'}</Title>
                        )
                    ) : typeof details === 'object' ? (
                        renderDetails(details)
                    ) : (
                        <div />
                    )}
                </Col>
            );
        }
        return (
            <Col>
                {LeftDivider(title)}
                <Title level={5}>{'Not provided'}</Title>
            </Col>
        );
    };

    return (
        <Card title={'Product Details'} loading={loader}>
            {productDetails.alreadyRejected ? (
                <Alert
                    message={
                        'The product is rejected once and is sent for approval again. Please reject only if very much necessary.'
                    }
                    type={'error'}
                />
            ) : (
                <div />
            )}
            {LeftDivider('Product Description By Seller')}
            <Paragraph style={{ marginTop: 0 }} code title={`${productDetails.description}--William Shakespeare`}>
                {productDetails.description}
            </Paragraph>

            <Form
                form={form}
                // labelCol={{ span: 4 }}
                // wrapperCol={{ span: 14 }}
                name="basic"
                layout="vertical"
                initialValues={{ remember: true }}
            >
                <Form.Item
                    label={'Provide description that customer going to see'}
                    name={'descriptionShownToCustomer'}
                    rules={formRequiredRule}
                >
                    <Input.TextArea rows={10} />
                </Form.Item>
                <Form.Item label={'Product Title'} name={'titleGenerated'} rules={formRequiredRule}>
                    <Input.TextArea />
                </Form.Item>
                {/* <Form.Item label={'Product Subtitle'} name={'subTitle'} rules={formRequiredRule}>
                    <Input.TextArea />
                </Form.Item> */}
                {/* {renderFilter(productDetails?.brand, 'Brand')}
                {renderFilter(productDetails?.fit, 'Fit')}
                {renderFilter(productDetails?.pattern, 'Pattern')} */}
                {LeftDivider('Colors')}
                {renderColor(productDetails?.colors)}
                <Form.Item
                    style={{ flex: 1, marginTop: '20px' }}
                    label="Provide product status:"
                    name="status"
                    // rules={formRequiredRule}
                >
                    <Select allowClear>
                        {[2, 5].map((classifier) => (
                            <Option value={classifier}>{productStatus[classifier]}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Points title={'Provide points to make the product better'} points={points} setPoints={setPoints} />

                <Space style={{ marginTop: '10px' }}>
                    <Button
                        type={'primary'}
                        htmlType="submit"
                        onClick={() => {
                            form.validateFields().then((value) => {
                                updateProductC(value);
                            });
                        }}
                    >
                        {'Save'}
                    </Button>
                </Space>
            </Form>
        </Card>
    );
};

export default ProductDetails;
