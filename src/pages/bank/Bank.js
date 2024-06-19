import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Popconfirm, Space, Badge, Form, Input, Upload, message, Breadcrumb } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined, EyeOutlined  } from '@ant-design/icons';
import Widget from '../../components/Widget/Widget';

const Bank = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [modalAddVisible, setModalAddVisible] = useState(false);
    const [modalEditVisible, setModalEditVisible] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form] = Form.useForm();
    const token = localStorage.getItem("token");
    const [modalDetailVisible, setModalDetailVisible] = useState(false);
    const [detailItem, setDetailItem] = useState(null);

    useEffect(() => {
        console.log("INI TOKEN", token);
        fetchData();
    }, []);

    const fetchData = () => {
        fetch(`https://staging-api.jaja.id/bank/get-bank?page=0&limit=0&keyword=`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                const sortedData = data.data.data.sort((a, b) => b.id_bank - a.id_bank); 
                setData(sortedData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    const handleCreate = async (values) => {
        try {
            const response = await fetch("https://staging-api.jaja.id/bank/create-bank", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name: values.name })
            });
    
            if (response.ok) {
                fetchData();
                setModalAddVisible(false);
                form.resetFields();
                message.success('Bank created successfully!');
            } else {
                message.error('Failed to create Bank. Please try again later.');
            }
        } catch (error) {
            console.error('Error creating Bank:', error);
            message.error('Failed to create Bank. Please try again later.');
        }
    };    

    const handleUpdate = async (values) => {
        try {
            const response = await fetch("https://staging-api.jaja.id/bank/update-bank", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id: values.id_bank, name: values.name })
            });

            if (response.ok) {
                fetchData();
                setModalEditVisible(false);
                form.resetFields();
                message.success('Bank updated successfully!');
            } else {
                message.error('Failed to update Bank. Please try again later.');
            }
        } catch (error) {
            console.error('Error updating Bank:', error);
            message.error('Failed to update Bank. Please try again later.');
        }
    };

    const handleDelete = async (values) => {
        try {
            const response = await fetch("https://staging-api.jaja.id/bank/delete-bank", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id: values.id_bank })
            });
    
            if (response.ok) {
                fetchData();
                message.success('Bank deleted successfully!');
            } else {
                message.error('Failed to delete Bank. Please try again later.');
            }
        } catch (error) {
            console.error('Error deleting Bank:', error);
            message.error('Failed to delete Bank. Please try again later.');
        }
    };

    const handleDetail = async (record) => {
        try {
            const response = await fetch(`https://staging-api.jaja.id/bank/get-bank-detail?id=${record.id_bank}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setDetailItem(data.data); // Menyimpan detail kategori dalam state
                setModalDetailVisible(true); // Menampilkan modal detail
            } else {
                message.error('Failed to fetch Bank detail. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching Bank detail:', error);
            message.error('Failed to fetch Bank detail. Please try again later.');
        }
    };

    const columns = [
        {
            title: 'No',
            dataIndex: 'no',
            render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1
        },
        {
            title: 'Nama Bank',
            dataIndex: 'name'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => (
                <Space>
                    <Button type="default" icon={<EyeOutlined />} onClick={() => handleDetail(record)} />
                    <Button type="primary" onClick={() => handleEdit(record)} icon={<EditOutlined />} />
                    <Popconfirm
                        title="Are you sure to delete this item?"
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="danger" icon={<DeleteOutlined />}/>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const handleEdit = (record) => {
        setEditItem(record);
        form.setFieldsValue(record);
        setModalEditVisible(true);
    };

    // Fungsi untuk menutup modal detail
    const handleCloseDetailModal = () => {
        setModalDetailVisible(false);
        setDetailItem(null); // Menghapus detail kategori dari state saat modal ditutup
    };

    return (
        <>
            <div style={{display:"flex", alignContent:"center", alignItems:"center"}}>
                <h3 className='mr-3'>Bank</h3>
                <Breadcrumb
                    items={[
                        {
                            title: (
                            <>
                                <span>Jaja Auto</span>
                            </>
                            ),
                        },
                        {
                            title: 'Bank',
                        },
                        ]}
                className='mb-2'/>
            </div>
            <Widget>
                <Button type="primary" onClick={() => setModalAddVisible(true)} style={{ marginBottom: 16 }} className="m-3 float-right">
                    <PlusOutlined /> Add Bank
                </Button>
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={pagination}
                    onChange={(pagination) => setPagination(pagination)}
                />
            </Widget>

            <Modal
                title="Create Bank"
                visible={modalAddVisible}
                onCancel={() => setModalAddVisible(false)}
                onOk={() => setModalAddVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setModalAddVisible(false)}>Cancel</Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()}>Create</Button>
                ]}
            >
                <Form
                    form={form}
                    onFinish={handleCreate}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter the bank name!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit Bank"
                visible={modalEditVisible}
                onCancel={() => setModalEditVisible(false)}
                onOk={() => setModalEditVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setModalEditVisible(false)}>Cancel</Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()}>Update</Button>
                ]}
            >
                <Form
                    form={form}
                    onFinish={handleUpdate}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                >
                    <Form.Item
                        name="id_bank"
                        hidden
                    >
                        <Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter the bank name!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal untuk menampilkan detail kategori */}
            <Modal
                title="Bank Detail"
                visible={modalDetailVisible}
                onCancel={handleCloseDetailModal}
                footer={null}
            >
                {detailItem && (
                    <div>
                        <p><strong>Nama Bank:</strong> {detailItem.name}</p>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default Bank;
