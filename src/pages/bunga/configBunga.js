import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Popconfirm, Space, Badge, Form, Input, Upload, message, Breadcrumb } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined, EyeOutlined, HomeOutlined  } from '@ant-design/icons';
import Widget from '../../components/Widget/Widget';

const ConfigBunga = () => {
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
        fetch(`https://staging-api.jaja.id/config/get-config`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setData(data.data.data)
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    const handleCreate = async (values) => {
        try {
            const requestBody = {
                name: values.name,
                type: values.type,
                value: values.value,
                tenor_tahun: values.tenor_tahun,
                keterangan: values.keterangan
            };

            const response = await fetch("https://staging-api.jaja.id/config/create-config", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                fetchData();
                setModalAddVisible(false);
                form.resetFields();
                message.success('config bunga created successfully!');
            } else {
                message.error('Failed to create config bunga. Please try again later.');
            }
        } catch (error) {
            console.error('Error creating config bunga:', error);
            message.error('Failed to create config bunga. Please try again later.');
        }
    };

    const handleUpdateBunga = async (values) => {
        try {
            const requestBody = {
                id: values.id,
                name: values.name,
                type: values.type,
                value: values.value,
                tenor_tahun: values.tenor_tahun,
                keterangan: values.keterangan
            };

            const response = await fetch("https://staging-api.jaja.id/config/update-config", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                fetchData();
                setModalEditVisible(false);
                form.resetFields();
                message.success('Config bunga updated successfully!');
            } else {
                message.error('Failed to update config bunga. Please try again later.');
            }
        } catch (error) {
            console.error('Error updating config bunga:', error);
            message.error('Failed to update config bunga. Please try again later.');
        }
    };

    const handleDeleteCategory = async (values) => {
        try {
            const response = await fetch("https://staging-api.jaja.id/category/delete-category", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id: values.id })
            });
    
            if (response.ok) {
                fetchData();
                message.success('Category deleted successfully!');
            } else {
                message.error('Failed to delete category. Please try again later.');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            message.error('Failed to delete category. Please try again later.');
        }
    };

    const handleDetail = async (record) => {
        try {
            const response = await fetch(`https://staging-api.jaja.id/category/get-category-detail?id=${record.id}`, {
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
                message.error('Failed to fetch category detail. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching category detail:', error);
            message.error('Failed to fetch category detail. Please try again later.');
        }
    };

    const columns = [
        {
            title: 'No',
            dataIndex: 'no',
            render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1
        },
        {
            title: 'Nama',
            dataIndex: 'name'
        },
        {
            title: 'Type',
            dataIndex: 'type'
        },
        {
            title: 'Value',
            dataIndex: 'value'
        },
        {
            title: 'Tenor Tahunan',
            dataIndex: 'tenor_tahun'
        },
        {
            title: 'Keterangan',
            dataIndex: 'keterangan'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => (
                // <Space>
                    <Button type="primary" onClick={() => handleEdit(record)} icon={<EditOutlined />} />
                    // <Popconfirm
                    //     title="Are you sure to delete this item?"
                    //     onConfirm={() => handleDeleteCategory(record)}
                    //     okText="Yes"
                    //     cancelText="No"
                    // >
                    //     <Button type="danger" icon={<DeleteOutlined />}/>
                    // </Popconfirm>
                // </Space>
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
            <h3>Config Bunga</h3>
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
                    title: 'Config Bunga',
                },
                ]}
            className='mb-4'/>
            <Widget>
                <Button type="primary" onClick={() => setModalAddVisible(true)} style={{ marginBottom: 16 }} className="m-3 float-right">
                    <PlusOutlined /> Add new Config Bunga
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
                title="Create new Config Bunga"
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
                        rules={[{ required: true, message: 'Please enter the name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="Type"
                        rules={[{ required: true, message: 'Please enter the type!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="value"
                        label="Value"
                        rules={[{ required: true, message: 'Please enter the value!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="tenor_tahun"
                        label="Tenor Tahun"
                        rules={[{ required: true, message: 'Please enter the tenor tahun!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="keterangan"
                        label="Keterangan"
                        rules={[{ required: true, message: 'Please enter the keterangan!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit Config Bunga"
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
                    onFinish={handleUpdateBunga}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                >
                    <Form.Item
                        name="id"
                        hidden
                    >
                        <Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter the name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="Type"
                        rules={[{ required: true, message: 'Please enter the type!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="value"
                        label="Value"
                        rules={[{ required: true, message: 'Please enter the value!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="tenor_tahun"
                        label="Tenor Tahun"
                        rules={[{ required: true, message: 'Please enter the tenor tahun!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="keterangan"
                        label="Keterangan"
                        rules={[{ required: true, message: 'Please enter the keterangan!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal untuk menampilkan detail kategori */}
            <Modal
                title="Category Detail"
                visible={modalDetailVisible}
                onCancel={handleCloseDetailModal}
                footer={null}
            >
                {detailItem && (
                    <div>
                        <p><strong>Nama Kategori:</strong> {detailItem.name}</p>
                        <img src={detailItem.images} alt="Product" style={{ maxWidth: 100, maxHeight: 100 }} />
                        <p><strong>Status:</strong> {detailItem.status === 1 ? "Aktif" : "Non-Aktif"}</p>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default ConfigBunga;
