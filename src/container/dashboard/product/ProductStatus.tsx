import { Card, Form, Select } from 'antd';
import * as React from 'react';

import { errorShow } from '../../../components/ALert';
import { formRequiredRule } from '../../../constants';
import { getProductCatelogue, getProductCatelogueWithAncestors } from '../../../server/catalogue/catalogue.api';

const { Option } = Select;

interface ProductStatusProps {}

const ProductStatus: React.FunctionComponent<ProductStatusProps> = () => {
    const [loading, setLoading] = React.useState(true);
    const [catalogue, setCatalogue] = React.useState([]);
    const [form] = Form.useForm();

    // To load all categories from backend which are avaialable in the market
    const loadCatalogueFromServer = async () => {
        try {
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
                </Form>
            </Card>
        </div>
    );
};

export default ProductStatus;
