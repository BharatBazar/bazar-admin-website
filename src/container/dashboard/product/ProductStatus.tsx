import { Card, Form, Select } from 'antd';
import * as React from 'react';

import { errorShow } from '../../../components/ALert';
import { formRequiredRule } from '../../../constants';
import { getProductCatelogue } from '../../../server/catalogue/catalogue.api';

const { Option } = Select;

interface ProductStatusProps {}

const ProductStatus: React.FunctionComponent<ProductStatusProps> = () => {
    const [loading, setLoading] = React.useState(false);
    const [catalogue, setCatalogue] = React.useState([]);

    // To load all categories from backend which are avaialable in the market
    const loadCatalogueFromServer = async () => {
        try {
            const response = await getProductCatelogue({ subCategoryExist: false });
            setLoading(false);
            if (response.status === 1) {
                //  setCategory(response.payload);
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
                <Form.Item style={{ flex: 1 }} label="Classifier type :" name="type" rules={formRequiredRule}>
                    <Select allowClear>
                        {catalogue.map((classifier) => (
                            <Option value={classifier}>{classifier}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Card>
        </div>
    );
};

export default ProductStatus;
