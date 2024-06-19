import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Space, Breadcrumb, Flex } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';


const Order = () => {
    const token = localStorage.getItem("token");
    const [orders, setOrders] = useState([]);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetail, setOrderDetail] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const history = useHistory();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`https://staging-api.jaja.id/order/get-order?page=0&limit=0&keyword=`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data.data.data);
            } else {
                console.error('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchOrderDetail = async (orderId) => {
        try {
            const response = await fetch(`https://staging-api.jaja.id/order/get-order-detail?id=${orderId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setOrderDetail(data.data);
                setDetailModalVisible(true);
            } else {
                if (response.status === 500) {
                    Modal.error({
                        title: 'Detail',
                        content: 'Data detail tidak ditemukan',
                    });
                } else {
                    console.error('Failed to fetch order detail');
                }
            }
        } catch (error) {
            console.error('Error fetching order detail:', error);
            Modal.error({
                title: 'Network Error',
                content: 'Failed to fetch order detail due to network issue. Please check your connection and try again.',
            });
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    const formatToRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
      };

    const handleDetail = (record) => {
        history.push(`/dashboard/order/${record.id}`);
    }

    const columns = [
        {
            title: 'No',
            dataIndex: 'no',
            render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1
        },
        {
            title: 'Invoice',
            dataIndex: 'invoice',
            key: 'invoice',
        },
        {
            title: 'Product Name',
            dataIndex: 'name_produk',
            key: 'name_produk',
        },
        {
            title: 'Payment Method',
            dataIndex: 'metode_bayar',
            key: 'metode_bayar',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Nama Lengkap',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'No Telp',
            dataIndex: 'contact_number',
            key: 'contact_number',
        },
        {
            title: 'Total Price',
            dataIndex: 'grand_total',
            key: 'grand_total',
            render: (text) => formatToRupiah(text),
        },
        {
            title: 'Added Date',
            dataIndex: 'date_added',
            key: 'date_added',
            render: (text) => formatDate(text),
            width: 120
        },
        // {
        //     title: 'Action',
        //     key: 'action',
        //     render: (text, record) => (
        //         <Space size="middle">
        //             <Button type="default" icon={<EyeOutlined />} onClick={() => fetchOrderDetail(record.id)} />
        //         </Space>
        //     ),
        // },
        {
            title: 'Detail',
            key: 'detail',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="default" icon={<EyeOutlined />} onClick={() => handleDetail(record)} />
                </Space>
            ),
        },
    ];

    return (
        <>
            <div style={{display:"flex", alignContent:"center", alignItems:"center"}}>
                <h3 className='mr-3'>Order</h3>
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
                        title: 'Order',
                    },
                    ]}
                className='mb-2'/>
            </div>
            <div>
                <Table columns={columns} dataSource={orders} pagination={pagination} onChange={(pagination) => setPagination(pagination)} scroll={{ x: true }}/>
                <Modal
                    title="Order Detail"
                    visible={detailModalVisible}
                    onCancel={() => setDetailModalVisible(false)}
                    footer={[
                        <Button key="back" onClick={() => setDetailModalVisible(false)}>
                            Close
                        </Button>,
                    ]}
                >
                    {orderDetail ? (
                        <div>
                            <p><strong>Invoice : </strong> {orderDetail.pemesan.invoice}</p>
                            <p><strong>Nama Produk : </strong> {orderDetail.produk.name_produk}</p>
                            <p><strong>Nama Produk Grades : </strong> {orderDetail.produk.name_produk_grades}</p>
                            <p><strong>Nama Brand : </strong> {orderDetail.produk.name_brand}</p>
                            <p><strong>Metode Bayar : </strong> {orderDetail.pemesan.metode_bayar}</p>
                            <p><strong>Uang Muka : </strong> {orderDetail.pemesan.uang_muka}</p>
                            <p><strong>Persen Uang Muka : </strong> {orderDetail.pemesan.uang_muka_percent}</p>
                            <p><strong>Nama : </strong> {orderDetail.pemesan.name}</p>
                            <p><strong>Kontak : </strong> {orderDetail.pemesan.contact_number}</p>
                            <p><strong>Email : </strong> {orderDetail.pemesan.email}</p>
                            <p><strong>Domisili : </strong> {orderDetail.pemesan.domisili}</p>
                            <p><strong>OTR : </strong> {orderDetail.harga.otr}</p>
                            <p><strong>Velg : </strong> {orderDetail.harga.velg}</p>
                            <p><strong>Interior : </strong> {orderDetail.harga.interior}</p>
                            <p><strong>Grand Total : </strong> {orderDetail.harga.grand_total}</p>
                            <p><strong>Tenor Tahun : </strong> {orderDetail.harga.tenor_tahun}</p>
                            <p><strong>Angsuran Bulanan : </strong> {orderDetail.angsuran_bulanan}</p>
                            <p><strong>Angsuran Bunga : </strong> {orderDetail.angsuran_bunga}</p>
                            <p><strong>Angsuran Pokok : </strong> {orderDetail.angsuran_pokok}</p>
                            <p><strong>Angsuran Pertama : </strong> {orderDetail.angsuran_pertama}</p>
                            <p><strong>Biaya Administrasi : </strong> {orderDetail.biaya_administrasi}</p>
                            <p><strong>Bunga : </strong> {orderDetail.bunga}</p>
                            <p><strong>Tenor Tahun : </strong> {orderDetail.tenor_tahun}</p>
                        </div>
                    ) : (
                        <p>Data tidak tersedia</p>
                    )}
                </Modal>
            </div>
        </>
    );
};

export default Order;
