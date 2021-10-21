import { Button, Card, Col, Input, Row, Space, Typography } from 'antd';
// import Title from 'antd/lib/skeleton/Title';
import React from 'react';
import { LeftDivider } from '../../../../components/Divider';

interface PointsProps {
    title: string;
    points: string[];
    setPoints: (points: string[]) => void;
}

const { Text } = Typography;
const Points: React.FunctionComponent<PointsProps> = ({ title, points, setPoints }) => {
    // const [points, setPoints] = React.useState<string[]>(['']);

    return (
        <Card title={title}>
            <Space>
                <Button
                    type={'primary'}
                    onClick={() => {
                        const point: string[] = [...points];
                        point.push('');
                        setPoints(point);
                    }}
                >
                    {'add point'}
                </Button>
                <Button
                    type={'primary'}
                    onClick={() => {
                        const point: string[] = [...points];
                        if (point.length !== 1) {
                            point.pop();
                            setPoints(point);
                        }
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
        </Card>
    );
};

export default Points;
