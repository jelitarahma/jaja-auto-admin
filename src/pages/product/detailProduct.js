import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Popconfirm,
  Space,
  Badge,
  Form,
  Input,
  Upload,
  message,
  Breadcrumb,
  Select,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Widget from "../../components/Widget/Widget";
import { useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const { Option } = Select;

const DetailProduct = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [variasi, setVariasi] = useState(null);
  const [grades, setGrades] = useState(null);
  const [form] = Form.useForm();
  const token = localStorage.getItem("token");
  const [jenisOptions, setJenisOptions] = useState([]);
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [imagesProduct, setImagesProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [fetchImagesDone, setFetchImagesDone] = useState(false);
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [modalAddGradeVisible, setModalAddGradeVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalEditGradeVisible, setModalEditGradeVisible] = useState(false);
  const [deskripsi, setDeskripsi] = useState('');

  useEffect(() => {
    handleDetail();
    fetchBrandOptions();
    fetchJenisOptions();
    fetchKategoriOptions();
  }, [slug]);

  useEffect(() => {
    if (product && !fetchImagesDone) {
      fetchImagesData();
      setFetchImagesDone(true);
    }
  }, [product, fetchImagesDone]);

  const handleDetail = async () => {
    try {
      const response = await fetch(
        `https://staging-api.jaja.id/product/get-product-detail?slug=${slug}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProduct(data.data); // Menyimpan detail kategori dalam state
        setVariasi(data.data.variasi);
        setGrades(data.data.grades);
        setDeskripsi(data.data.deskripsi);
        console.log();
      } else {
        message.error(
          "Failed to fetch product detail. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error fetching product detail:", error);
      message.error("Failed to fetch product detail. Please try again later.");
    }
  };

  const handleUpdate = async (values) => {
    try {
      const requestBody = {
        code: values.code,
        brand: values.brand,
        name: values.name,
        slug: values.slug,
        merek: values.brand,
        deskripsi: values.deskripsi,
        id_produk_jenis: values.id_produk_jenis,
        id_produk_kategori: values.id_produk_kategori,
        viewed: 0,
        tag: "default-tag",
        status: values.status,
      };
      const response = await fetch(
        `https://staging-api.jaja.id/product/update-product`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        message.success("Product updated successfully");
      } else {
        message.error("Failed to update product. Please try again later.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("Failed to update product. Please try again later.");
    }
  };

  const fetchJenisOptions = () => {
    fetch(
      `https://staging-api.jaja.id/jenis/get-jenis?page=0&limit=0&keyword=`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setJenisOptions(data.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchKategoriOptions = () => {
    fetch(
      `https://staging-api.jaja.id/category/get-category?page=0&limit=0&keyword=`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setKategoriOptions(data.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchBrandOptions = () => {
    fetch(
      `https://staging-api.jaja.id/merek/get-merek?page=0&limit=0&keyword=`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setBrandOptions(data.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchImagesData = async () => {
    try {
      const response = await fetch(
        `https://staging-api.jaja.id/product/get-images-detail?id=${product.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Set imagesProduct to an array containing the fetched data
        setImagesProduct([data.data]);
        setLoading(false);
      } else {
        message.error("Failed to fetch images data. Please try again later.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching images data:", error);
      message.error("Failed to fetch images data. Please try again later.");
    }
  };

  const handleImage = async (values, endpoint) => {
    try {
      const formData = new FormData();
      if (values.id) {
        formData.append("id", values.id);
      }
      formData.append("id_jauto_produk", product.id);
      formData.append("jenis_gambar", values.jenis_gambar);

      // Cek apakah ada file gambar yang diunggah
      if (values.image && values.image.file) {
        formData.append("images", values.image.file);
      }

      formData.append("color_name", values.color_name);
      formData.append("hex_color_code", values.hex_color_code);
      formData.append("price", values.price);

      const response = await fetch(endpoint, {
        method: endpoint.includes("create") ? "POST" : "PUT", // Menyesuaikan metode HTTP sesuai dengan endpoint
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        message.success("Image updated successfully");
        // Reset form and close modal
        form.resetFields();
        setModalAddVisible(false);
        setModalEditVisible(false);
        // Refresh images data
        handleDetail(); // Jika ini digunakan untuk create, gantilah dengan fetchImagesData()
      } else {
        message.error("Failed to update image. Please try again later.");
      }
    } catch (error) {
      console.error("Error updating image:", error);
      message.error("Failed to update image. Please try again later.");
    }
  };

  // Fungsi untuk membuat atau mengedit gambar
  const handleCreateOrEditImage = async (values) => {
    if (values.id) {
      // Jika terdapat ID, itu berarti operasi edit
      await handleImage(
        values,
        "https://staging-api.jaja.id/product/update-images"
      );
    } else {
      // Jika tidak ada ID, itu berarti operasi create
      await handleImage(
        values,
        "https://staging-api.jaja.id/product/create-images"
      );
    }
  };
  

  const handleGrade = async (values, endpoint) => {
    try {
        const requestData = {
            ...(values.id && { id: values.id }),
            id_jauto_produk: product.id,
            type_code: values.type_code,
            type: values.type,
            spesifikasi: values.spesifikasi,
            transmisi: values.transmisi,
            warna: values.warna,
            bbm: values.bbm,
            seat: values.seat,
            year: values.year,
            keterangan: values.keterangan,
            ...(values.is_active && { is_active: values.is_active }), // Menambah is_active jika tersedia
            listrik_non_listrik: values.listrik_non_listrik,
            range_harga: values.range_harga
        };

        const response = await fetch(endpoint, {
            method: endpoint.includes("create") ? "POST" : "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {
            message.success("Grade updated successfully");
            form.resetFields();
            setModalAddGradeVisible(false);
            setModalEditGradeVisible(false);
            handleDetail(); // Jika ini digunakan untuk create, gantilah dengan fetchGradesData()
        } else {
            message.error("Failed to update Grade. Please try again later.");
        }
    } catch (error) {
        console.error("Error updating Grade:", error);
        message.error("Failed to update Grade. Please try again later.");
    }
};


  const handleCreateOrEditGrade = async (values) => {
    if (values.id) {
      // Jika terdapat ID, itu berarti operasi edit
      await handleGrade(
        values,
        "https://staging-api.jaja.id/product/update-grades"
      );
    } else {
      // Jika tidak ada ID, itu berarti operasi create
      await handleGrade(
        values,
        "https://staging-api.jaja.id/product/create-grades"
      );
    }
  };


  const handleDeleteImage = async (values) => {
    try {
      const response = await fetch(
        "https://staging-api.jaja.id/product/delete-images",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: values.id }),
        }
      );

      if (response.ok) {
        handleDetail();
        message.success("Image Product deleted successfully!");
      } else {
        message.error(
          "Failed to delete Image Product. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error deleting Image Product:", error);
      message.error("Failed to delete Image Product. Please try again later.");
    }
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      render: (text, record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Nama",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "image_path",
      render: (text, record) => (
        <img
          src={record.image_path}
          alt="Product"
          style={{ maxWidth: 100, maxHeight: 100 }}
        />
      ),
    },
    {
      title: "Color name",
      dataIndex: "color_name",
    },
    {
      title: "Hex Color",
      dataIndex: "hex_color_code",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <Space>
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => handleDetail(record)}
          />
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditImage(record)}
          />
          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => handleDeleteImage(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const GrandeColumns = [
    {
      title: "No",
      dataIndex: "no",
      render: (text, record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Type Code",
      dataIndex: "type_code",
    },
    {
      title: "Type",
      dataIndex: "type"
    },
    {
      title: "Spesifikasi",
      dataIndex: "spesifikasi",
    },
    {
      title: "Range Harga",
      dataIndex: "range_harga",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <Space>
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => handleDetail(record)}
          />
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditGrade(record)}
          />
          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => handleDeleteImage(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEditImage = (record) => {
    form.setFieldsValue(record);
    setModalEditVisible(true);
  };

  const handleEditGrade = (record) => {
    form.setFieldsValue(record);
    setModalEditGradeVisible(true);
  };


  return (
    <>
      {product && (
        <div>
          <h3 className="p-1">Detail Product</h3>
        <Widget className="p-4">
          <Form
            form={form}
            layout="vertical"
            initialValues={product}
            onFinish={handleUpdate}
          >
          <Form.Item name="slug" hidden>
            <Input type="hidden" />
          </Form.Item>
            <Row>
              <Col span={12} className="p-2">
                <Form.Item label="Code" name="code">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12} className="p-2">
                <Form.Item
                  name="brand"
                  label="Brand"
                  // rules={[{ required: true, message: 'Please select Product Brand!' }]}
                >
                  <Select placeholder="Select Brand">
                    {brandOptions.map((brand) => (
                      <Option key={brand.id_merek} value={brand.id_merek}>
                        {brand.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8} className="p-2">
                <Form.Item label="Name" name="name">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8} className="p-2">
                <Form.Item
                  name="id_produk_jenis"
                  label="Jenis Mobil"
                  // rules={[{ required: true, message: 'Please select jenis mobil!' }]}
                >
                  <Select placeholder="Select jenis mobil">
                    {jenisOptions.map((jenis) => (
                      <Option key={jenis.id} value={jenis.id}>
                        {jenis.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8} className="p-2">
                <Form.Item
                  name="id_produk_kategori"
                  label="Kategori"
                  // rules={[{ required: true, message: 'Please select kategori!' }]}
                >
                  <Select placeholder="Select kategori">
                    {kategoriOptions.map((kategori) => (
                      <Option key={kategori.id} value={kategori.id}>
                        {kategori.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item label="Description" name="deskripsi" className="p-2">
              <CKEditor
                editor={ClassicEditor}
                data={deskripsi} // Set CKEditor data with deskripsi state
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setDeskripsi(data); // Update deskripsi state on change
                }}
              />
            </Form.Item>
            
            <Form.Item name="status" hidden>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update Product
              </Button>
            </Form.Item>
          </Form>
        </Widget>
        </div>
      )}

      <h3 className="p-1">Image Product</h3>
      <Widget>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalAddVisible(true)}
          style={{ marginBottom: 16 }}
          className="m-3 float-right"
        >
          Add Image
        </Button>
        <Table
          columns={columns}
          dataSource={imagesProduct}
          loading={loading}
          pagination={pagination}
          onChange={(pagination) => setPagination(pagination)}
        />
      </Widget>

      <Modal
        title="Create Image"
        visible={modalAddVisible}
        onCancel={() => {
          form.resetFields();
          setModalAddVisible(false);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              form.resetFields();
              setModalAddVisible(false);
            }}
          >
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Create
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleCreateOrEditImage}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            name="jenis_gambar"
            label="Name"
            rules={[
              { required: true, message: "Please enter the image name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image"
            rules={[{ required: true, message: "Please upload an image!" }]}
          >
            <Upload maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="color_name"
            label="Color Name"
            rules={[
              { required: true, message: "Please enter the color name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="hex_color_code"
            label="Color Hex Code"
            rules={[
              { required: true, message: "Please enter the color hex code!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter the price!" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Images */}
      <Modal
        title="Edit Image"
        visible={modalEditVisible}
        onCancel={() => {
          form.resetFields();
          setModalEditVisible(false);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              form.resetFields();
              setModalEditVisible(false);
            }}
          >
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Edit
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleCreateOrEditImage}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item name="id" hidden>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            name="jenis_gambar"
            label="Name"
            rules={[{ required: true, message: "Please enter the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Image">
            <Upload maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="color_name"
            label="Color Name"
            rules={[
              { required: true, message: "Please enter the color name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="hex_color_code"
            label="Color Hex Code"
            rules={[
              { required: true, message: "Please enter the color hex code!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter the price!" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Grades */}
      <h3 className="p-1">Grades Product</h3>
      <Widget>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalAddGradeVisible(true)}
          style={{ marginBottom: 16 }}
          className="m-3 float-right"
        >
          Add Grande
        </Button>
        <Table
          columns={GrandeColumns}
          dataSource={grades}
          loading={loading}
          pagination={pagination}
          onChange={(pagination) => setPagination(pagination)}
        />
      </Widget>

      <Modal
        title="Create Grade"
        visible={modalAddGradeVisible}
        onCancel={() => {
          form.resetFields();
          setModalAddGradeVisible(false);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              form.resetFields();
              setModalAddGradeVisible(false);
            }}
          >
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Create
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleCreateOrEditGrade}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            name="type_code"
            label="Type Code"
            rules={[
              { required: true, message: "Please enter the type code!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[
              { required: true, message: "Please enter the type!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="spesifikasi"
            label="Spesifikasi"
            rules={[{ required: true, message: "Please enter the spesifikasi!" }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="transmisi"
            label="Transmisi"
            rules={[{ required: true, message: "Please enter the transmisi!" }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="warna"
            label="Warna"
            rules={[{ required: true, message: "Please enter the warna!" }]}
          >
            <Input type="number"/>
          </Form.Item>
          <Form.Item
            name="bbm"
            label="Bbm"
            rules={[{ required: true, message: "Please enter the bbm!" }]}
          >
            <Input type="number"/>
          </Form.Item>
          <Form.Item
            name="seat"
            label="Seat"
            rules={[{ required: true, message: "Please enter the seat!" }]}
          >
            <Input type="number"/>
          </Form.Item>
          <Form.Item
            name="year"
            label="Year"
            rules={[{ required: true, message: "Please enter the year!" }]}
          >
            <Input type="number"/>
          </Form.Item>
          <Form.Item
            name="keterangan"
            label="Keterangan"
            rules={[{ required: true, message: "Please enter the keterangan!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="listrik_non_listrik"
            label="Listrik non listrik"
            rules={[{ required: true, message: "Please enter the listrik non listrik!" }]}
          >
            <Input type="number"/>
          </Form.Item>
          <Form.Item
            name="range_harga"
            label="Range Harga"
            rules={[{ required: true, message: "Please enter the range harga!" }]}
          >
            <Input type="number"/>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Create Grade"
        visible={modalAddGradeVisible}
        onCancel={() => {
          form.resetFields();
          setModalAddGradeVisible(false);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              form.resetFields();
              setModalAddGradeVisible(false);
            }}
          >
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Create
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleCreateOrEditGrade}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            name="type_code"
            label="Type Code"
            rules={[
              { required: true, message: "Please enter the type code!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[
              { required: true, message: "Please enter the type!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="spesifikasi"
            label="Spesifikasi"
            rules={[{ required: true, message: "Please enter the spesifikasi!" }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="transmisi"
            label="Transmisi"
            rules={[{ required: true, message: "Please enter the transmisi!" }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="warna"
            label="Warna"
            rules={[{ required: true, message: "Please enter the warna!" }]}
          >
            <Input type="number"/>
          </Form.Item>
          <Form.Item
            name="bbm"
            label="Bbm"
            rules={[{ required: true, message: "Please enter the bbm!" }]}
          >
            <Input type="number"/>
          </Form.Item>
          <Form.Item
            name="seat"
            label="Seat"
            rules={[{ required: true, message: "Please enter the seat!" }]}
          >
            <Input type="number"/>
          </Form.Item>
          <Form.Item
            name="year"
            label="Year"
            rules={[{ required: true, message: "Please enter the year!" }]}
          >
            <Input type="number"/>
          </Form.Item>
          <Form.Item
            name="keterangan"
            label="Keterangan"
            rules={[{ required: true, message: "Please enter the keterangan!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="listrik_non_listrik"
            label="Listrik non listrik"
            rules={[{ required: true, message: "Please enter the listrik non listrik!" }]}
          >
            <Input type="number"/>
          </Form.Item>
          <Form.Item
            name="range_harga"
            label="Range Harga"
            rules={[{ required: true, message: "Please enter the range harga!" }]}
          >
            <Input type="number"/>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Grade"
        visible={modalEditGradeVisible}
        onCancel={() => {
          form.resetFields();
          setModalEditGradeVisible(false);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              form.resetFields();
              setModalEditGradeVisible(false);
            }}
          >
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Update
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleCreateOrEditGrade}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item name="id" hidden>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            name="type_code"
            label="Type Code"
            rules={[
              { required: true, message: "Please enter the type code!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[
              { required: true, message: "Please enter the type!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="spesifikasi"
            label="Spesifikasi"
            rules={[{ required: true, message: "Please enter the spesifikasi!" }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="transmisi"
            label="Transmisi"
            rules={[{ required: true, message: "Please enter the transmisi!" }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="warna"
            label="Warna"
            rules={[{ required: true, message: "Please enter the warna!" }]}
          >
            <Input type="number"/>
          </Form.Item>
          <Form.Item
            name="bbm"
            label="Bbm"
            rules={[{ required: true, message: "Please enter the bbm!" }]}
          >
            <Input type="number"/>
          </Form.Item>
          <Form.Item
            name="seat"
            label="Seat"
            rules={[{ required: true, message: "Please enter the seat!" }]}
          >
            <Input type="number"/>
          </Form.Item>
          <Form.Item
            name="year"
            label="Year"
            rules={[{ required: true, message: "Please enter the year!" }]}
          >
            <Input type="number"/>
          </Form.Item>
          <Form.Item
            name="keterangan"
            label="Keterangan"
            rules={[{ required: true, message: "Please enter the keterangan!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="is_active"
            label="Status"
            rules={[{ required: true, message: "Please enter the status!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="listrik_non_listrik"
            label="Listrik non listrik"
            rules={[{ required: true, message: "Please enter the listrik non listrik!" }]}
          >
            <Input type="number"/>
          </Form.Item>
          <Form.Item
            name="range_harga"
            label="Range Harga"
            rules={[{ required: true, message: "Please enter the range harga!" }]}
          >
            <Input type="number"/>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DetailProduct;
