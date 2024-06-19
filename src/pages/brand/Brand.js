import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Popconfirm, Form, Input, Upload, message, Breadcrumb, ColorPicker } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import Widget from '../../components/Widget/Widget';

const Brand = () => {
    const token = localStorage.getItem("token");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [modalAddVisible, setModalAddVisible] = useState(false);
    const [modalEditVisible, setModalEditVisible] = useState(false);
    const [modalDetailVisible, setModalDetailVisible] = useState(false);
    const [form] = Form.useForm();
    const [editItem, setEditItem] = useState(null);
    const [detailItem, setDetailItem] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch(`https://staging-api.jaja.id/merek/get-merek?page=0&limit=0&keyword=`, {
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

    const handleCreateBrand = async (values) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            if (values.images && values.images.file) {
                formData.append("images", values.images.file);
            }
            formData.append("hex_color", values.hex_color);

            const response = await fetch("https://staging-api.jaja.id/merek/create-merek", {
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
                message.success('Brand created successfully!');
            } else {
                message.error('Failed to create Brand. Please try again later.');
            }
        } catch (error) {
            console.error('Error creating Brand:', error);
            message.error('Failed to create Brand. Please try again later.');
        }
    };

    const handleUpdateBrand = async (values) => {
        try {
            console.log("VALUE EDIT", values)
            const formData = new FormData();
            formData.append("id", values.id_merek);
            formData.append("name", values.name);
            if (values.logo && values.logo.file) {
                formData.append("images", values.logo.file);
            }
            formData.append("hex_color", values.hex_color);
            formData.append("status", 0);

            const response = await fetch("https://staging-api.jaja.id/merek/update-merek", {
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
                message.success('Brand updated successfully!');
            } else {
                message.error('Failed to update brand. Please try again later.');
            }
        } catch (error) {
            console.error('Error updating brand:', error);
            message.error('Failed to update brand. Please try again later.');
        }
    };

    const handleDelete = async (values) => {
        try {
            const response = await fetch("https://staging-api.jaja.id/merek/delete-merek", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id: values.id_merek })
            });
    
            if (response.ok) {
                fetchData();
                message.success('Brand deleted successfully!');
            } else {
                message.error('Failed to delete Brand. Please try again later.');
            }
        } catch (error) {
            console.error('Error deleting Brand:', error);
            message.error('Failed to delete Brand. Please try again later.');
        }
    };

    const handleDetail = async (record) => {
        try {
            const response = await fetch(`https://staging-api.jaja.id/merek/get-merek-detail?id=${record.id_merek}`, {
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
            title: 'Logo',
            dataIndex: 'logo',
            render: (text, record) => (
                <img src={record.logo} alt="Brand Logo" style={{ maxWidth: 100, maxHeight: 100 }} />
            )
        },
        {
            title: 'Brand Name',
            dataIndex: 'name'
        },
        {
            title: 'Hex Color',
            dataIndex: 'hex_color'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => (
                <span>
                    <Button type="default" icon={<EyeOutlined />} onClick={() => handleDetail(record)} className='mr-2'/>
                    <Button type="primary" onClick={() => handleEdit(record)} icon={<EditOutlined />} />
                    <Popconfirm
                        title="Are you sure to delete this item?"
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="danger" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </span>
            )
        }
    ];

    const handleEdit = (record) => {
        console.log("ini record edit", record);
        setEditItem(record);
        form.setFieldsValue(record);
        setModalEditVisible(true);
    };

    const openAddModal = () => {
        setModalAddVisible(true);
    };

    return (
        <>
            <div style={{display:"flex", alignContent:"center", alignItems:"center"}}>
                <h3 className='mr-3'>Brand</h3>
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
                            title: 'Brand',
                        },
                        ]}
                className='mb-2'/>
            </div>
            <Widget>
                <Button type="primary" onClick={openAddModal} style={{ marginBottom: 16 }} className="m-3 float-right">
                    <PlusOutlined /> Add Brand
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
                title="Create Brand"
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
                    onFinish={handleCreateBrand}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter the Brand name!' }]}
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
                        name="hex_color"
                        label="Hex Color"
                        rules={[{ required: true, message: 'Please select the Hex color!' }]}
                    >
                        <ColorPicker 
                            defaultValue="#1677ff"
                            showText
                            color="#1677ff"  // Default color
                            onChange={(color) => {
                                form.setFieldsValue({ hex_color: color.toHexString() });
                            }} 
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit Brand"
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
                    onFinish={handleUpdateBrand}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                >
                    <Form.Item
                        name="id_merek"
                        hidden
                    ></Form.Item>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter the Brand name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="logo"
                        label="Images"
                    >
                        <Upload maxCount={1} beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name="hex_color"
                        label="Hex Color"
                        rules={[{ required: true, message: 'Please enter the Hex color!' }]}
                    >
                        <ColorPicker 
                            defaultValue="hex_color"
                            showText
                            color="hex_color"  // Default color
                            onChange={(color) => {
                                form.setFieldsValue({ hex_color: color.toHexString() });
                            }} 
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Brand Detail"
                visible={modalDetailVisible}
                onCancel={() => setModalDetailVisible(false)}
                onOk={() => setModalDetailVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setModalDetailVisible(false)}>Close</Button>
                ]}
            >
                <p><strong>Name:</strong> {detailItem && detailItem.name}</p>
                <p><strong>Hex Color:</strong> {detailItem && detailItem.hex_color}</p>
                <img src={detailItem && detailItem.logo} alt="Brand Logo" style={{ maxWidth: 100, maxHeight: 100 }} />
            </Modal>
        </>
    );
};

export default Brand;
