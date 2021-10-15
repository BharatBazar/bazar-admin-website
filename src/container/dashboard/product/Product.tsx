import { Card, Form } from 'antd';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import queryString from 'query-string';
import { getProduct } from '../../../server/checkProduct/product.api';

interface ProductProps extends RouteComponentProps {}

const ProductDetails: React.FunctionComponent<ProductProps> = (props) => {
    const params: { id: string; divison: string } = queryString.parse(props.location.search);

    const fetchProduct = async () => {
        const a = await getProduct(params.divison, params.id);
        console.log(a);
    };

    React.useEffect(() => {
        fetchProduct();
    }, []);
    const [form] = Form.useForm();
    return (
        <Card title={'Product Details'}>
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                name="basic"
                layout="horizontal"
                initialValues={{ remember: true }}
            />
        </Card>
    );
};

export default ProductDetails;
