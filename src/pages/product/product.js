import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Popconfirm, Space, Badge, Form, Input, Upload, message, Select, Breadcrumb} from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined, EyeOutlined  } from '@ant-design/icons';
import Widget from '../../components/Widget/Widget';
import { useHistory } from 'react-router-dom';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Product = () => {
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
    const [jenisOptions, setJenisOptions] = useState([]);
    const [kategoriOptions, setKategoriOptions] = useState([]);
    const [brandOptions, setBrandOptions] = useState([]);
    const { Option } = Select;
    const history = useHistory();

    useEffect(() => {
        console.log("INI TOKEN", token);
        fetchData();
        fetchJenisOptions();
        fetchKategoriOptions();
        fetchBrandOptions();
    }, []);

    const fetchData = () => {
        fetch(`https://staging-api.jaja.id/product/get-product?keyword=`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setData(data.data)
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    const fetchJenisOptions = () => {
        fetch(`https://staging-api.jaja.id/jenis/get-jenis?page=0&limit=0&keyword=`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setJenisOptions(data.data.data)
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    const fetchKategoriOptions = () => {
        fetch(`https://staging-api.jaja.id/category/get-category?page=0&limit=0&keyword=`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setKategoriOptions(data.data.data)
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    const fetchBrandOptions = () => {
        fetch(`https://staging-api.jaja.id/merek/get-merek?page=0&limit=0&keyword=`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setBrandOptions(data.data.data)
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
                code: values.code,
                brand: values.brand,
                name: values.name,
                merek: values.brand,
                deskripsi: values.deskripsi,
                id_produk_jenis: values.id_produk_jenis,
                id_produk_kategori: values.id_produk_kategori,
                viewed: 0,
                tag: "default-tag"
            };
    
            const response = await fetch("https://staging-api.jaja.id/product/create-product", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json" // Set content type to JSON
                },
                body: JSON.stringify(requestBody) // Convert object to JSON string
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
            const response = await fetch("https://staging-api.jaja.id/product/delete-product", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ slug: values.slug })
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
        history.push(`/dashboard/product/${record.slug}`);
        // try {
        //     const response = await fetch(`https://staging-api.jaja.id/product/get-product-detail?slug=${record.slug}`, {
        //         method: "GET",
        //         headers: {
        //             "Authorization": `Bearer ${token}`
        //         }
        //     });

        //     if (response.ok) {
        //         const data = await response.json();
        //         setDetailItem(data.data); // Menyimpan detail kategori dalam state
        //         setModalDetailVisible(true); // Menampilkan modal detail
        //     } else {
        //         message.error('Failed to fetch jenis mobil detail. Please try again later.');
        //     }
        // } catch (error) {
        //     console.error('Error fetching jenis mobil detail:', error);
        //     message.error('Failed to fetch jenis mobil detail. Please try again later.');
        // }
    };

    const columns = [
        {
            title: 'No',
            dataIndex: 'no',
            render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1
        },
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Code',
            dataIndex: 'code'
        },
        {
            title: 'Brand',
            dataIndex: 'brand'
        },
        {
            title: 'Merk',
            dataIndex: 'merek'
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
                    {/* <Button type="primary" onClick={() => handleEdit(record)} icon={<EditOutlined />} /> */}
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
                <h3 className='mr-3'>Product</h3>
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
                            title: 'Product',
                        },
                        ]}
                className='mb-2'/>
            </div>
            <Widget>
                <Button type="primary" onClick={() => setModalAddVisible(true)} style={{ marginBottom: 16 }} className="m-3 float-right">
                    <PlusOutlined /> Add Product
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
                title="Create Product"
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
                        name="code"
                        label="Code"
                        rules={[{ required: true, message: 'Please enter the Product Code!' }]}
                    >
                         <Input />
                    </Form.Item>
                    <Form.Item
                        name="brand"
                        label="Brand"
                        rules={[{ required: true, message: 'Please select Product Brand!' }]}
                    >
                        <Select placeholder="Select Brand">
                            {brandOptions.map(brand => (
                                <Option key={brand.id_merek} value={brand.id_merek}>{brand.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter the Product name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="deskripsi"
                        label="Deskripsi"
                        rules={[{ required: true, message: 'Please enter the Product Deskripsi!' }]}
                    >
                        <CKEditor
                            editor={ClassicEditor}
                            data="<p>Enter the product description here...</p>"
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                form.setFieldsValue({ deskripsi: data });
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="id_produk_jenis"
                        label="Jenis Mobil"
                        rules={[{ required: true, message: 'Please select jenis mobil!' }]}
                    >
                        <Select placeholder="Select jenis mobil">
                            {jenisOptions.map(jenis => (
                                <Option key={jenis.id} value={jenis.id}>{jenis.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="id_produk_kategori"
                        label="Kategori"
                        rules={[{ required: true, message: 'Please select kategori!' }]}
                    >
                        <Select placeholder="Select kategori">
                            {kategoriOptions.map(kategori => (
                                <Option key={kategori.id} value={kategori.id}>{kategori.name}</Option>
                            ))}
                        </Select>
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
                        rules={[{ required: true, message: 'Please enter the status!' }]}
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
                        <p><strong>Nama Product:</strong> {detailItem.name}</p>
                        <p><strong>Status:</strong> {detailItem.status === 1 ? "Aktif" : "Non-Aktif"}</p>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default Product;
