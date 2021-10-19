import { Card, Form, Typography, Slider, Divider, Select, Input, Row, Avatar, Col, Space, Button } from 'antd';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import queryString from 'query-string';
import { AntDesignOutlined, UserAddOutlined } from '@ant-design/icons';
import { render } from 'react-dom';
import { getProduct } from '../../../server/checkProduct/product.api';
import { errorShow } from '../../../components/ALert';
import { IColor, IProduct, productStatus } from '../../../server/checkProduct/product.interface';
import { formRequiredRule } from '../../../constants';
import { IClassfier } from '../../../server/filter/category/category.interface';
import { LeftDivider } from '../../../components/Divider';

const { Paragraph, Text, Title } = Typography;
const { Option } = Select;

interface ProductProps extends RouteComponentProps {}

const ProductDetails: React.FunctionComponent<ProductProps> = (props) => {
    const [rows, setRows] = React.useState(1);
    const [productDetails, setProductDetails] = React.useState<IProduct>('');
    const [loader, setLoader] = React.useState(false);
    const [productStatuss, setProductStatus] = React.useState(undefined);
    const params: { id: string; divison: string } = queryString.parse(props.location.search);

    const fetchProduct = async () => {
        setLoader(true);
        try {
            const a = await getProduct(params.divison, params.id);
            console.log(a);
            setLoader(false);
            setProductDetails(a.payload);
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

    const [form] = Form.useForm();
    return (
        <Card title={'Product Details'} loading={loader}>
            {LeftDivider('Product Description')}
            <Paragraph title={`${productDetails.description}--William Shakespeare`}>
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
                <Form.Item label={''} name={'name'} rules={formRequiredRule}>
                    <Input.TextArea rows={10} />
                </Form.Item>
                <Form.Item label={'Product Title'} name={'title'} rules={formRequiredRule}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item label={'Product Subtitle'} name={'subTitle'} rules={formRequiredRule}>
                    <Input.TextArea />
                </Form.Item>
                {renderFilter(productDetails?.brand, 'Brand')}
                {renderFilter(productDetails?.fit, 'Fit')}
                {renderFilter(productDetails?.pattern, 'Pattern')}
                {LeftDivider('Colors')}
                {renderColor(productDetails?.colors)}
                <Form.Item
                    style={{ flex: 1, marginTop: '20px' }}
                    label="Provide product status:"
                    name="status"
                    rules={formRequiredRule}
                >
                    <Select
                        allowClear
                        onChange={(item) => {
                            setProductStatus(item);
                        }}
                    >
                        {[2, 5].map((classifier) => (
                            <Option value={classifier}>{productStatus[classifier]}</Option>
                        ))}
                    </Select>
                </Form.Item>
                {productStatuss && productStatuss === productStatus.REJECTED && (
                    <Form.Item
                        label={'Please provide reason for rejection'}
                        name={'rejected reason'}
                        rules={formRequiredRule}
                    >
                        <Input.TextArea rows={5} />
                    </Form.Item>
                )}
                <Space>
                    <Button
                        type={'primary'}
                        htmlType="submit"
                        onClick={() => {
                            form.validateFields().then((value) => {});
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
