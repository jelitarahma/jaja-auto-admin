import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Space, Breadcrumb } from 'antd';

const Order = () => {
    const token = localStorage.getItem("token");
    const [orders, setOrders] = useState([]);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetail, setOrderDetail] = useState(null);

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
                const sortedOrders = data.data.data.sort((a, b) => a.id - b.id);
                setOrders(sortedOrders);
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
                console.error('Failed to fetch order detail');
            }
        } catch (error) {
            console.error('Error fetching order detail:', error);
        }
    };

    const columns = [
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
            title: 'Total Price',
            dataIndex: 'grand_total',
            key: 'grand_total',
        },
        {
            title: 'Added Date',
            dataIndex: 'date_added',
            key: 'date_added',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => fetchOrderDetail(record.id)}>View Detail</Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <h3>Order</h3>
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
            className='mb-4'/>
            <div>
                <Table columns={columns} dataSource={orders} />
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
