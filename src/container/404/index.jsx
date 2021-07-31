import React from 'react';
import { Button, Row, Col } from 'antd';
import errImg from '../../icons/404.png';
import './index.less';

const NotFound = (props) => {
    const { history } = props;
    const goHome = () => history.replace('/');
    return (
        <Row className="not-found">
            <Col span={12}>
                <img src={errImg} alt="404" />
            </Col>
            <Col span={12} className="right">
                <h1>404</h1>
                <h2>The page is yet to come....</h2>
                <div>
                    <Button type="primary" onClick={goHome}>
                        Go to dashboard
                    </Button>
                </div>
            </Col>
        </Row>
    );
};

export default NotFound;
