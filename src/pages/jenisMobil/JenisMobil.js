import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Popconfirm, Space, Badge, Form, Input, Upload, message, Breadcrumb, Select } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined, EyeOutlined  } from '@ant-design/icons';
import Widget from '../../components/Widget/Widget';

const JenisMobil = () => {
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
    const { Option } = Select;

    useEffect(() => {
        console.log("INI TOKEN", token);
        fetchData();
    }, []);

    const fetchData = () => {
        fetch(`https://staging-api.jaja.id/jenis/get-jenis?page=0&limit=0&keyword=`, {
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
            const formData = new FormData();
            formData.append("name", values.name);
            if (values.image && values.image.file) {
                formData.append("images", values.image.file);
            }
            formData.append("status", values.status);

            const response = await fetch("https://staging-api.jaja.id/jenis/create-jenis", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                fetchData();
                setModalAddVisible(false);
                form.resetFields();
                message.success('jenis mobil created successfully!');
            } else {
                message.error('Failed to create jenis mobil. Please try again later.');
            }
        } catch (error) {
            console.error('Error creating jenis mobil:', error);
            message.error('Failed to create jenis mobil. Please try again later.');
        }
    };

    const handleUpdate = async (values) => {
        try {
            const formData = new FormData();
            formData.append("id", values.id);
            formData.append("name", values.name);
            if (values.images && values.images.file) {
                formData.append("images", values.images.file);
            }
            formData.append("status", values.status);

            const response = await fetch("https://staging-api.jaja.id/jenis/update-jenis", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                fetchData();
                setModalEditVisible(false);
                form.resetFields();
                message.success('jenis mobil updated successfully!');
            } else {
                message.error('Failed to update jenis mobil. Please try again later.');
            }
        } catch (error) {
            console.error('Error updating jenis mobil:', error);
            message.error('Failed to update jenis mobil. Please try again later.');
        }
    };

    const handleDelete = async (values) => {
        try {
            const response = await fetch("https://staging-api.jaja.id/jenis/delete-jenis", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id: values.id })
            });
    
            if (response.ok) {
                fetchData();
                message.success('jenis mobil deleted successfully!');
            } else {
                message.error('Failed to delete jenis mobil. Please try again later.');
            }
        } catch (error) {
            console.error('Error deleting jenis mobil:', error);
            message.error('Failed to delete jenis mobil. Please try again later.');
        }
    };

    const handleDetail = async (record) => {
        try {
            const response = await fetch(`https://staging-api.jaja.id/jenis/get-jenis-detail?id=${record.id}`, {
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
                message.error('Failed to fetch jenis mobil detail. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching jenis mobil detail:', error);
            message.error('Failed to fetch jenis mobil detail. Please try again later.');
        }
    };

    const columns = [
        {
            title: 'No',
            dataIndex: 'no',
            render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1
        },
        {
            title: 'Image',
            dataIndex: 'image',
            render: (text, record) => (
                <img src={record.image} alt="Product" style={{ maxWidth: 100, maxHeight: 100 }} />
            )
        },
        {
            title: 'Jenis Mobil',
            dataIndex: 'name'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (text, record) => (
                <Space>
                    <Badge status={record.status === 1 ? "success" : "error"} text={record.status === 1 ? "Aktif" : "Non-Aktif"}></Badge>
                </Space>
            )
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
                <h3 className='mr-3'>Jenis Mobil</h3>
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
                            title: 'Jenis Mobil',
                        },
                        ]}
                className='mb-2'/>
            </div>
            <Widget>
                <Button type="primary" onClick={() => setModalAddVisible(true)} style={{ marginBottom: 16 }} className="m-3 float-right">
                    <PlusOutlined /> Add Jenis Mobil
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
                title="Create Jenis Mobil"
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
                        rules={[{ required: true, message: 'Please enter the jenis mobil name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="Image"
                    >
                        <Upload maxCount={1} beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: 'Please enter the status!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit Jenis Mobil"
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
                        name="id"
                        hidden
                    >
                        <Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter the jenis mobil name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="images"
                        label="Images"
                    >
                        <Upload maxCount={1} beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: 'Please select the status!' }]}
                    >
                        <Select placeholder="Select status">
                            <Option value={1}>Aktif</Option>
                            <Option value={0}>Non-Aktif</Option>
                        </Select>
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

export default JenisMobil;
