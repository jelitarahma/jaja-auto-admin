import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Popconfirm, Space, Badge, Form, Input, Upload, message, Breadcrumb, Select } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined, EyeOutlined, HomeOutlined, PercentageOutlined  } from '@ant-design/icons';
import Widget from '../../components/Widget/Widget';
import { Option } from 'antd/es/mentions';

const Bunga = () => {
    const [data, setData] = useState([]);
    const [dataWilayah, setDataWilayah] = useState([]);
    const [dataBank, setDataBank] = useState([]);
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
        fetchData();
        fetchDataBank();
        fetchDataWilayah();
    }, []);

    useEffect(() => {
        if (modalAddVisible) {
            form.resetFields();
        }
    }, [modalAddVisible, form]);


    const fetchData = () => {
        fetch(`https://staging-api.jaja.id/bunga/get-bunga?page=0&limit=0&keyword=`, {
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

    const fetchDataWilayah = () => {
        fetch(`https://staging-api.jaja.id/alamat/get-wilayah-utama`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => { 
                setDataWilayah(data.data.selectBank);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    const fetchDataBank = () => {
        fetch(`https://staging-api.jaja.id/bank/get-bank?page=0&limit=0&keyword=`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                const sortedData = data.data.data.sort((a, b) => b.id_bank - a.id_bank); 
                setDataBank(sortedData);
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
                id_bank: values.id_bank,
                id_wilayah: values.id_wilayah,
                tenor: values.tenor,
                bunga: values.bunga,
            };

            const response = await fetch("https://staging-api.jaja.id/bunga/create-bunga", {
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
                message.success('bunga created successfully!');
            } else {
                message.error('Failed to create bunga. Please try again later.');
            }
        } catch (error) {
            console.error('Error creating bunga:', error);
            message.error('Failed to create bunga. Please try again later.');
        }
    };

    const handleUpdateBunga = async (values) => {
    try {
        const requestBody = {
            id: values.id,
            id_bank: values.id_bank,
            id_wilayah: values.id_wilayah,
            tenor: values.tenor,
            bunga: parseFloat(values.bunga), // Ensure bunga is parsed as a float if needed
        };

        const response = await fetch("https://staging-api.jaja.id/bunga/update-bunga", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            fetchData(); // Assuming fetchData updates the data list
            setModalEditVisible(false); // Close the modal after successful update
            form.resetFields(); // Reset the form fields
            message.success('Bunga updated successfully!');
        } else {
            message.error('Failed to update Bunga. Please try again later.');
        }
    } catch (error) {
        console.error('Error updating Bunga:', error);
        message.error('Failed to update Bunga. Please try again later.');
    }
};

    const handleDelete = async (values) => {
        try {
            const response = await fetch("https://staging-api.jaja.id/bunga/delete-bunga", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id_bunga: values.id_bunga })
            });
    
            if (response.ok) {
                fetchData();
                message.success('Bunga deleted successfully!');
            } else {
                message.error('Failed to delete Bunga. Please try again later.');
            }
        } catch (error) {
            console.error('Error deleting Bunga:', error);
            message.error('Failed to delete Bunga. Please try again later.');
        }
    };

    const handleDetail = async (record) => {
        try {
            const response = await fetch(`https://staging-api.jaja.id/bunga/get-bunga-detail?id=${record.id_bunga}`, {
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
            title: 'Bank',
            dataIndex: 'bank'
        },
        {
            title: 'Wilayah',
            dataIndex: 'wilayah'
        },
        {
            title: 'Tenor',
            dataIndex: 'tenor'
        },
        {
            title: 'Bunga',
            dataIndex: 'bunga'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => (
                <Space>
                    <Button type="primary" onClick={() => handleEdit(record)} icon={<EditOutlined />} />
                    <Popconfirm
                        title="Are you sure to delete this item?"
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="danger" icon={<DeleteOutlined />}/>
                    </Popconfirm>
                    {/* <Button type="default" icon={<EyeOutlined />} onClick={() => handleDetail(record)} /> */}
                </Space>
            )
        }
    ];

    const handleEdit = (record) => {
        setEditItem(record);
        const fieldsValue = {
        id: record.id_bunga,
        id_bank: record.id_bank,
        bank: record.bank,
        id_wilayah: record.id_wilayah,
        wilayah: record.wilayah,
        tenor: record.tenor,
        bunga: record.bunga,
    };

    console.log('Fields Value:', fieldsValue); // Logging fieldsValue

    form.setFieldsValue(fieldsValue);
        setModalEditVisible(true);
        console.log("Edit", );
    };

    // Fungsi untuk menutup modal detail
    const handleCloseDetailModal = () => {
        setModalDetailVisible(false);
        setDetailItem(null); // Menghapus detail kategori dari state saat modal ditutup
    };

    return (
        <>
            <div style={{display:"flex", alignContent:"center", alignItems:"center"}}>
                <h3 className='mr-3'>Bunga</h3>
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
                            title: 'Bunga',
                        },
                        ]}
                className='mb-2'/>
            </div>
            <Widget>
                <Button type="primary" onClick={() => setModalAddVisible(true)} style={{ marginBottom: 16 }} className="m-3 float-right">
                    <PlusOutlined /> Add new Bunga
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
                title="Create new Bunga"
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
                        name="id_bank"
                        label="Bank"
                        // rules={[{ required: true, message: 'Please select Product Brand!' }]}
                        >
                        <Select placeholder="Select bank">
                            {dataBank.map((bank) => (
                            <Option key={bank.id_bank} value={bank.id_bank}>
                                {bank.name}
                            </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="id_wilayah"
                        label="Wilayah"
                        >
                        <Select placeholder="Select Wilayah">
                            {dataWilayah.map((wilayah) => (
                            <Option key={wilayah.id_wilayah} value={wilayah.id_wilayah}>
                                {wilayah.nama}
                            </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="tenor"
                        label="Tenor"
                        rules={[{ required: true, message: 'Please enter the tenor!' }]}
                    >
                        <Input addonAfter="Bulan"/>
                    </Form.Item>
                    <Form.Item
                        name="bunga"
                        label="Bunga"
                        rules={[{ required: true, message: 'Please enter the bunga!' }]}
                    >
                        <Input addonAfter={<PercentageOutlined />}/>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit Bunga"
                visible={modalEditVisible}
                onCancel={() => setModalEditVisible(false)}
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
                        name="id_bank"
                        label="Bank"
                        rules={[{ required: true, message: 'Please select a bank!' }]}
                    >
                        <Select placeholder="Select bank">
                            {dataBank.map((bank) => (
                                <Option key={bank.id_bank} value={bank.id_bank}>
                                    {bank.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="id_wilayah"
                        label="Wilayah"
                        rules={[{ required: true, message: 'Please select a wilayah!' }]}
                    >
                        <Select placeholder="Select wilayah">
                            {dataWilayah.map((wilayah) => (
                                <Option key={wilayah.id_wilayah} value={wilayah.id_wilayah}>
                                    {wilayah.nama}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="tenor"
                        label="Tenor"
                        rules={[{ required: true, message: 'Please enter the tenor!' }]}
                    >
                        <Input addonAfter="Bulan"/>
                    </Form.Item>
                    <Form.Item
                        name="bunga"
                        label="Bunga"
                        rules={[{ required: true, message: 'Please enter the bunga!' }]}
                    >
                        <Input addonAfter={<PercentageOutlined />}/>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal untuk menampilkan detail kategori */}
            <Modal
                title="Bunga Detail"
                visible={modalDetailVisible}
                onCancel={handleCloseDetailModal}
                footer={null}
            >
                {detailItem && (
                    <div>
                        <p><strong>Nama Bank : </strong> {detailItem.name}</p>
                        <p><strong>Wilayah : </strong> {detailItem.wilayah}</p>
                        <p><strong>Tenor:</strong> {detailItem.tenor}</p>
                        <p><strong>Bunga:</strong> {detailItem.bunga}</p>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default Bunga;
