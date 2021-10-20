import { Button, Col, Input, Row, Space, Typography } from 'antd';
// import Title from 'antd/lib/skeleton/Title';
import React from 'react';
import { LeftDivider } from '../../../../components/Divider';

interface PointsProps {
    title: string;
}

const { Text } = Typography;
const Points: React.FunctionComponent<PointsProps> = ({ title }) => {
    const [points, setPoints] = React.useState<string[]>(['']);

    return (
        <div>
            {LeftDivider(title)}
            <Space>
                <Button
                    type={'primary'}
                    onClick={() => {
                        const point: string[] = [...points];
                        point.push('');
                        console.log('point => ', point);
                        setPoints(point);
                    }}
                >
                    {'add point'}
                </Button>
                <Button
                    type={'primary'}
                    onClick={() => {
                        const point: string[] = [...points];
                        point.pop();
                        setPoints(point);
                    }}
                >
                    {'delete last point'}
                </Button>
            </Space>
            {points.map((item, index) => (
                <Row style={{ marginTop: '15px' }}>
                    <Text code>{(index + 1).toString()}</Text>
                    <Input
                        style={{ marginTop: '10px' }}
                        value={item}
                        onChange={(value) => {
                            const point: string[] = [...points];
                            point[index] = value.currentTarget.value;
                            setPoints(point);
                        }}
                    />
                </Row>
            ))}
        </div>
    );
};

export default Points;
