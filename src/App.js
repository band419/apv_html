import React, { useState, useCallback, useEffect } from 'react';
import { Layout, Divider, Table, Row, Col } from 'antd';
import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";
import GridLayout from 'react-grid-layout';
import bank_data from './data.json';
import './App.css'; 

// Column definitions for bank and field tables
const bank_columns = [
    { title: "Name", dataIndex: "name", key: "name", width: "30%" },
    { title: "Start_addr", dataIndex: "start_addr", key: "start_addr", width: "15%" },
    { title: "End_addr", dataIndex: "end_addr", key: "end_addr", width: "15%" },
    { title: "Size", dataIndex: "size", key: "size", width: "15%" },
    { title: "Description", dataIndex: "description", key: "description", width: "25%" },
];

const field_columns = [
    { title: "Name", dataIndex: "name", key: "name", width: "20%" },
    { title: "Position", dataIndex: "Position", key: "Position", width: "20%" },
    { title: "External", dataIndex: "External", key: "External", width: "10%" },
    { title: "Software Access", dataIndex: "Software Access", key: "Software Access", width: "15%" },
    { title: "Hardware Access", dataIndex: "Hardware Access", key: "Hardware Access", width: "15%" },
    { title: "Description", dataIndex: "description", key: "description", width: "20%" },
];

// Fake data for initial state
const fakeData = [
    {
        key: 0,
        name: 'null',
        fields: [
            { key: 1, name: 'null', description: 'null' },
        ],
    },
];

// Custom hook to get window size
function useWinSize() {
    const [size, setSize] = useState({
        width: document.documentElement.clientWidth - 20,
        height: (document.documentElement.clientHeight - 50),
    });

    const onResize = useCallback(() => {
        setSize({
            width: document.documentElement.clientWidth - 20,
            height: (document.documentElement.clientHeight - 50),
        });
    }, []);

    useEffect(() => {
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [onResize]);
    return size;
}

// Custom hook to get table heights
function useTableHeight() {
    const [tableHeight, setTableHeight] = useState({
        bank_height: 60,
        reg_height: 60,
    });

    const onResize = useCallback(() => {
        const bank_grid = document.getElementById("bank_grid");
        const reg_grid = document.getElementById("reg_grid");
        if (bank_grid && reg_grid) {
            setTableHeight({
                bank_height: bank_grid.offsetHeight - 112.8,
                reg_height: reg_grid.offsetHeight - 112.8,
            });
        }
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', onResize);
        onResize();
        return () => window.removeEventListener('mousemove', onResize);
    }, [onResize]);

    return tableHeight;
}

export default function App() {
    const [newData, setNewData] = useState(fakeData);
    const [regName, setRegName] = useState("null");
    const size = useWinSize();
    const tableHeight = useTableHeight();

    const rowClassName = (record) => {
        switch (record.type) {
            case 'reg':
                return 'reg-row';
            case 'sys':
                return 'sys-row';
            default:
                return '';
        }
    };

    const selectObj = (obj) => {
        if (obj.type === 'reg') {
            setNewData(obj.fields);
            setRegName(obj.name);
        }
    };

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <GridLayout className="layout" cols={12} rowHeight={size.height} width={size.width} isResizable={false} isDraggable={false}>
                <div id="bank_grid" key="c" data-grid={{ x: 0, y: 0, w: 6, h: 1 }} style={{ height: '100%', zIndex: 1, pointerEvents: 'auto' }}>
                    <Row>
                        <Col span={24}>
                            <Layout>
                                <Divider orientation="left">Bank info</Divider>
                                <Table
                                    columns={bank_columns}
                                    dataSource={bank_data}
                                    pagination={false}
                                    scroll={{ x: '100%', y: tableHeight.bank_height }}
                                    onRow={(record) => ({
                                        onClick: () => {
                                            selectObj(record);
                                        },
                                    })}
                                    rowClassName={rowClassName}
                                />
                            </Layout>
                        </Col>
                    </Row>
                </div>
                <div id="reg_grid" key="d" data-grid={{ x: 6, y: 0, w: 6, h: 1 }} style={{ height: '100%', zIndex: 1, pointerEvents: 'auto' }}>
                    <Row>
                        <Col span={24}>
                            <Layout>
                                <Divider orientation="left">Reg info: {regName}</Divider>
                                <Table
                                    columns={field_columns}
                                    dataSource={newData}
                                    pagination={false}
                                    scroll={{ x: '100%', y: tableHeight.reg_height }}
                                    rowClassName={rowClassName}
                                />
                            </Layout>
                        </Col>
                    </Row>
                </div>
            </GridLayout>
        </div>
    );
}
