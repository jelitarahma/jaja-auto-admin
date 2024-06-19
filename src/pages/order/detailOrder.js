import React, { useState, useEffect } from 'react';
import { Descriptions, Modal, Breadcrumb, Button, Card, Row, Col, Flex } from 'antd';
import { useParams, useHistory } from "react-router-dom";
// import './DetailOrder.css'; // Import custom CSS

const DetailOrder = () => {
    const token = localStorage.getItem("token");
    const [orderDetail, setOrderDetail] = useState(null);
    const { orderId } = useParams();
    const history = useHistory();

    useEffect(() => {
        handleDetail();
    }, []);

    const handleDetail = async () => {
        try {
          const response = await fetch(`https://staging-api.jaja.id/order/get-order-detail?id=${orderId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          if (response.ok) {
            const data = await response.json();
            if (data.data) {
                setOrderDetail(data.data);
            } else {
                throw new Error('Order detail not found');
            }
          } else {
            if (response.status === 500) {
                Modal.error({
                    title: 'Detail',
                    content: 'Data detail tidak ditemukan',
                    onOk: () => history.push('/dashboard/order'),
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

    return (
        <div className="detail-order-container" style={{backgroundColor:" #f5f5f5", padding:"24px"}}>
            <div className="header" style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <h3>Detail Order</h3>
                <Breadcrumb className="breadcrumb" style={{marginBottom:"16px"}}>
                    <Breadcrumb.Item>Jaja Auto</Breadcrumb.Item>
                    <Breadcrumb.Item>Detail Order</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            {orderDetail && (
                <>
                <Row>
                    <Col span={12} style={{padding:"10px"}}>
                        <div style={{backgroundColor:"#ffffff", borderRadius:"10px"}}>
                            <img src={orderDetail.produk.images} style={{width:"100%"}}></img>
                        </div>
                        <div bordered={false} style={{marginBottom:"16px", borderRadius:"8px"}}>
                        <Flex style={{marginTop:"15px"}}>
                            <h4>{orderDetail.produk.name_produk}</h4>
                        </Flex>
                        <Flex>
                            <Flex style={{marginRight:"30px"}}>
                                <i className={'eva eva-globe-2-outline'} style={{fontSize:"28px", marginRight: "5px", marginTop: "5px"}}/>
                                <div>
                                    <p style={{fontSize:"18px", fontWeight:"bold"}}>Brand</p>
                                    <p style={{fontSize:"15px"}}>{orderDetail.produk.name_brand}</p>
                                </div>
                            </Flex>
                            <Flex style={{marginRight:"30px"}}>
                                <i className={'eva eva-car-outline'} style={{fontSize:"28px", marginRight: "5px", marginTop: "5px"}}/>
                                <div>
                                    <p style={{fontSize:"18px", fontWeight:"bold"}}>Jenis</p>
                                    <p style={{fontSize:"15px"}}>{orderDetail.produk.name_jenis}</p>
                                </div>
                            </Flex>
                            <Flex>
                                <i className={'eva eva-settings-outline'} style={{fontSize:"28px", marginRight: "5px", marginTop: "5px"}}/>
                                <div>
                                    <p style={{fontSize:"18px", fontWeight:"bold"}}>Grades</p>
                                    <p style={{fontSize:"15px"}}>{orderDetail.produk.name_produk_grades}</p>
                                </div>
                            </Flex>
                        </Flex>
                        </div>
                        <Card className="detail-card" title="Harga" bordered={false} style={{marginBottom:"16px", borderRadius:"8px"}}>
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="OTR">{orderDetail.harga.otr}</Descriptions.Item>
                            <Descriptions.Item label="Velg">{orderDetail.harga.velg}</Descriptions.Item>
                            <Descriptions.Item label="Interior">{orderDetail.harga.interior}</Descriptions.Item>
                            <Descriptions.Item label="Grand Total">{orderDetail.harga.grand_total}</Descriptions.Item>
                            <Descriptions.Item label="Tenor Tahun">{orderDetail.harga.tenor_tahun}</Descriptions.Item>
                            <Descriptions.Item label="Date Added">{orderDetail.harga.date_added}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                    </Col>
                    <Col span={12} style={{padding:"10px"}}>
                        <Card className="detail-card" title="Order Summary" bordered={false} style={{marginBottom:"16px", borderRadius:"8px"}}>
                            <Descriptions bordered column={1}>
                                <Descriptions.Item label="Angsuran Bulanan">{orderDetail.angsuran_bulanan}</Descriptions.Item>
                                <Descriptions.Item label="Angsuran Bunga">{orderDetail.angsuran_bunga}</Descriptions.Item>
                                <Descriptions.Item label="Angsuran Pokok">{orderDetail.angsuran_pokok}</Descriptions.Item>
                                <Descriptions.Item label="Angsuran Pertama">{orderDetail.angsuran_pertama}</Descriptions.Item>
                                <Descriptions.Item label="Biaya Administrasi">{orderDetail.biaya_administrasi}</Descriptions.Item>
                                <Descriptions.Item label="Bunga">{orderDetail.bunga}</Descriptions.Item>
                                <Descriptions.Item label="Tenor Tahun">{orderDetail.tenor_tahun}</Descriptions.Item>
                            </Descriptions>
                        </Card>

                        <Card className="detail-card" title="Pemesan" bordered={false} style={{marginBottom:"16px", borderRadius:"8px"}}>
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Invoice">{orderDetail.pemesan.invoice}</Descriptions.Item>
                            <Descriptions.Item label="Invoice No">{orderDetail.pemesan.invoice_no}</Descriptions.Item>
                            <Descriptions.Item label="Name">{orderDetail.pemesan.name}</Descriptions.Item>
                            <Descriptions.Item label="Contact Number">{orderDetail.pemesan.contact_number}</Descriptions.Item>
                            <Descriptions.Item label="Email">{orderDetail.pemesan.email}</Descriptions.Item>
                            <Descriptions.Item label="Domisili">{orderDetail.pemesan.domisili}</Descriptions.Item>
                            <Descriptions.Item label="Metode Bayar">{orderDetail.pemesan.metode_bayar}</Descriptions.Item>
                            <Descriptions.Item label="Uang Muka">{orderDetail.pemesan.uang_muka}</Descriptions.Item>
                            <Descriptions.Item label="Uang Muka Percent">{orderDetail.pemesan.uang_muka_percent}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                    </Col>
                </Row>
                    
                    
                    
                    
                </>
            )}
        </div>
    );
};

export default DetailOrder;
