import { DownOutlined } from '@ant-design/icons';
import { Button, Modal, Tree } from 'antd';
import { DataNode } from 'antd/lib/tree';
import { node } from 'prop-types';
import React, { createContext, useContext, useState } from 'react';
import { errorShow } from '../../../components/ALert';
import { getProductCatelogue } from '../../../server/catalogue/catalogue.api';
import { categoryType } from '../../../server/catalogue/catalogue.interface';
import ModalForm from './ModalForm';

// eslint-disable-next-line

const divStyle = {
    width: 40,
    height: 40,
    objectFit: 'cover',
};
export const CategoryContext = createContext<any>(() => {});

const App = () => {
    const [loader, setLoader] = React.useState<boolean>(false);

    const [catalogue, setCatalogue] = React.useState([]);
    const [newCategory, setNewCategory] = React.useState(false);
    const [productKey, setProductKey] = React.useState([]);
    const [productInfo, setProductInfo] = useState([]);
    const [subCategoryProductInfo, setSubCategoryProductInfo] = React.useState([]);
    const [removeParent, setRemoveParent] = React.useState(null);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
        setRemoveParent(false);
    };

    // const loadAllCategory = async (data: { type: categoryType; parent?: string }) => {
    const loadAllCategory = async (data) => {
        try {
            setLoader(true);

            const category = await getProductCatelogue(data);

            setSubCategoryProductInfo(category.payload);
            setCatalogue(category.payload.filter((e) => e.path.length === 0));
            setLoader(false);
        } catch (error) {
            errorShow(error.message);
            setLoader(false);
        }
    };

    React.useEffect(() => {
        loadAllCategory({ parent: { $exists: false } });
    }, []);

    const onSelect = (selectedKeys, info) => {
        setRemoveParent(true);
        const checkCategory = (elem) => {
            elem._id === info.node.key
                ? setProductInfo(elem)
                : elem.child.map((a) => {
                      a._id === info.node.key
                          ? setProductInfo(a)
                          : a.child.map((b) => {
                                b._id === info.node.key ? setProductInfo(b) : console.log('no');
                            });
                  });
        };

        const u = subCategoryProductInfo.filter((elem) => checkCategory(elem));
        setProductKey(info.node.key);
        setIsModalVisible(true);
    };

    const treeData: DataNode[] =
        catalogue &&
        catalogue.map((a) => {
            return {
                title: (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>
                            {' '}
                            <img style={divStyle} alt="..." src={a.image} />{' '}
                            <span style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: 16 }}>{a.name}</span>
                        </span>
                        <span style={{ fontWeight: '300' }}>{a.description}</span>
                    </div>
                ),
                key: a._id,
                children: a.child.map((b) => {
                    //     // console.log('b', b._id);
                    return {
                        title: (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span>
                                    {' '}
                                    <img style={divStyle} alt="..." src={b.image} />{' '}
                                    <span style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: 15 }}>
                                        {b.name}
                                    </span>
                                </span>
                                <span>{b.description}</span>
                            </div>
                        ),
                        key: b._id,
                        children: b.child.map((c) => {
                            return {
                                title: (
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span>
                                            {' '}
                                            <img style={divStyle} alt="..." src={c.image} />{' '}
                                            <span style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: 15 }}>
                                                {c.name}
                                            </span>
                                        </span>
                                        <span>{c.description}</span>
                                    </div>
                                ),
                                key: c._id,
                            };
                        }),
                    };
                }),
            };
        });

    const treeDataLoading: DataNode[] = [
        {
            title: 'parent 1',
            key: '0-0',
            children: [
                {
                    title: 'parent 1-1',
                    key: '0-0-1',
                    children: [
                        {
                            title: 'leaf',
                            key: '0-0-1-0',
                        },
                    ],
                },
            ],
        },
    ];

    console.log('vall', removeParent, isModalVisible);
    return (
        <>
            <CategoryContext.Provider value={{ newCategory, setNewCategory }}>
                <Button onClick={showModal} type="primary" size="small">
                    Create Catalogue
                </Button>
                <div style={{ marginTop: '2vh' }}>
                    <Tree
                        showLine
                        switcherIcon={<DownOutlined />}
                        defaultExpandedKeys={['0-0-0']}
                        onSelect={onSelect}
                        treeData={catalogue.length > 0 ? treeData : treeDataLoading}
                    />
                </div>
                <>
                    <Modal
                        width={'60%'}
                        visible={isModalVisible}
                        okButtonProps={{ hidden: true }}
                        cancelButtonProps={{ hidden: true }}
                        destroyOnClose
                        onCancel={() => {
                            setIsModalVisible(false);
                        }}
                    >
                        <ModalForm
                            isVisible={isModalVisible}
                            setModal={() => {
                                setIsModalVisible(false);
                                loadAllCategory({ parent: { $exists: false } });
                            }}
                            productKey={productKey}
                            onSelect={onSelect}
                            productInfo={productInfo}
                            updateFlow={removeParent}
                        />
                    </Modal>
                </>
            </CategoryContext.Provider>
        </>
    );
};

export default App;
