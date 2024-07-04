import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Select, Space } from 'antd'
import { PlusCircleFilled, UploadOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';
import * as ProductService from '../../services/ProductService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent';
import { convertPrice, getBase64, renderOptions } from '../../utils'

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState('');
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const user = useSelector((state) => state?.user)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const searchInput = useRef(null)

  const [stateProduct, setStateProduct] = useState({
    name: '',
    type: '',
    auth: '',
    publisher: '',
    countInStock: '',
    price_input: '',
    price: '',
    description: '',
    discount: '',
    image: ''
  })

  const [stateProductDetails, setStateProductDetails] = useState({
    name: '',
    type: '',
    auth: '',
    publisher: '',
    countInStock: '',
    price_input: '',
    price: '',
    description: '',
    discount: '',
    image: ''
  })

  const [form] = Form.useForm()

  const mutation = useMutationHooks(
    (data) => {
      const {
        name,
        type,
        auth,
        publisher,
        countInStock: countInStock,
        price_input,
        price,
        description,
        discount: discount,
        image } = data
      const res = ProductService.createProduct(
        {
          name,
          type,
          auth,
          publisher,
          countInStock,
          price_input,
          price,
          description,
          discount,
          image
        }
      )
      return res
    }
  )

  const mutationUpdate = useMutationHooks(
    (data) => {
      //console.log('data', data)
      const { id,
        token,
        ...rests } = data
      const res = ProductService.updateProduct(
        id,
        token,
        { ...rests })
      return res
    },
  )

  const mutationDeleted = useMutationHooks(
    (data) => {
      const { id,
        token,
      } = data
      const res = ProductService.deleteProduct(
        id,
        token)
      return res
    },
  )


  const mutationDeletedMany = useMutationHooks(
    (data) => {
      const { token, ...ids
      } = data
      const res = ProductService.deleteManyProduct(
        ids,
        token)
      return res
    },
  )

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct()
    return res
  }

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    return res
  }

  const { data, isSuccess, isError } = mutation
  const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
  const { data: dataDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeletedMany

  const typeProduct = useQuery({ queryKey: ['type-product'], queryFn: fetchAllTypeProduct })
  const querryProdcut = useQuery({ queryKey: ['products'], queryFn: getAllProducts })
  const { data: products } = querryProdcut

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected)
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        type: res?.data?.type,
        auth: res?.data?.auth,
        publisher: res?.data?.publisher,
        countInStock: res?.data?.countInStock,
        price_input: res?.data?.price_input,
        price: res?.data?.price,
        description: res?.data?.description,
        discount: res?.data?.discount,
        image: res?.data?.image
      })
    }
  }
  useEffect(() => {
    form.setFieldsValue({
      name: stateProductDetails.name,
      type: stateProductDetails.type,
      auth: stateProductDetails.auth,
      publisher: stateProductDetails.publisher,
      countInStock: stateProductDetails.countInStock,
      price_input: stateProductDetails.price_input,
      price: stateProductDetails.price,
      description: stateProductDetails.description,
      discount: stateProductDetails.discount,
      image: stateProductDetails.image
    });
  }, [form, stateProductDetails]);

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsProduct(rowSelected)
    }
  }, [rowSelected])

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true)
    // console.log('rowSelected', rowSelected)
  }

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
        <EditOutlined style={{ color: '#FFD700', fontSize: '20px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
      </div>
    )
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: '>= 100.000',
          value: '>=',
        },
        {
          text: '< 100.000',
          value: '<',
        },
      ],
      onFilter: (value, record) => {
        if (value === '>=') {
          return record.price >= 100000
        }
        return record.price < 100000
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'countInStock',
      sorter: (a, b) => a.countInStock - b.countInStock,
      filters: [
        {
          text: '>= 20',
          value: '>=',
        },
        {
          text: '< 20',
          value: '<',
        },
      ],
      onFilter: (value, record) => {
        if (value === '>=') {
          return record.countInStock >= 20
        }
        return record.countInStock < 20
      },
    },
    {
      title: 'Selled',
      dataIndex: 'selled',
      sorter: (a, b) => a.selled - b.selled,
      filters: [
        {
          text: '>= 20',
          value: '>=',
        },
        {
          text: '< 20',
          value: '<',
        },
      ],
      onFilter: (value, record) => {
        if (value === '>=') {
          return record.selled >= 20
        }
        return record.selled < 20
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      sorter: (a, b) => a.type - b.type,
      ...getColumnSearchProps('type')
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction,
    },
  ];
  const dataTable = products?.data?.length && products?.data?.map((product) => {
    return { ...product, key: product._id, price: convertPrice(product?.price) }
  })

  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      message.success()
      handleCancel()
    } else if (isError) {
      message.error()
    }
  }, [isSuccess])

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success()
      handleCloseDrawer()
    } else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated])

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === 'OK') {
      message.success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      message.error()
    }
  }, [isSuccessDeleted])

  useEffect(() => {
    if (isSuccessDelectedMany && dataDeletedMany?.status === 'OK') {
      message.success()
    } else if (isErrorDeletedMany) {
      message.error()
    }
  }, [isSuccessDelectedMany])

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: '',
      type: '',
      auth: '',
      publisher: '',
      countInStock: '',
      price_input: '',
      price: '',
      description: '',
      discount: '',
      image: ''
    })
    form.resetFields()
  };

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails({
      name: '',
      type: '',
      auth: '',
      publisher: '',
      countInStock: '',
      price_input: '',
      price: '',
      description: '',
      discount: '',
      image: ''
    })
    form.resetFields()
  };

  // const onFinish = () => {
  //   mutation.mutate(stateProduct, {
  //     onSettled: () => {
  //       querryProdcut.refetch()
  //     }
  //   })
  // };

  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      auth: stateProduct.auth,
      publisher: stateProduct.publisher,
      countInStock: stateProduct.countInStock,
      price_input: stateProduct.price_input,
      price: stateProduct.price,
      description: stateProduct.description,
      discount: stateProduct.discount,
      image: stateProduct.image,
      type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type
    }
    mutation.mutate(params, {
      onSettled: () => {
        querryProdcut.refetch()
      }
    })
  }

  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value
    })
  }

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value
    })
  }

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview
    })
  }

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview
    })
  }

  const onUpdateProduct = () => {
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetails }, {
      onSettled: () => {
        querryProdcut.refetch()
      }
    })
  }

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }

  const handleDeleteProduct = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => {
        querryProdcut.refetch()
      }
    })
  }

  const handleDelteManyProducts = (ids) => {
    mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
      onSettled: () => {
        querryProdcut.refetch()
      }
    })
  }

  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value
    })
  }

  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
      <Button onClick={() => setIsModalOpen(true)}><PlusCircleFilled /></Button>
      <div style={{ marginTop: '20px' }}>
        <TableComponent handleDelteManyProducts={handleDelteManyProducts} columns={columns} data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: event => {
                setRowSelected(record._id)
              },
            };
          }}
        />

      </div>
      <ModalComponent title="Thêm sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{ remember: false }}
          onFinish={onFinish}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <InputComponent value={stateProduct['name']} onChange={handleOnchange} name="name" />

          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: 'Please input your type!' }]}
          >
            {/* <InputComponent value={stateProduct['type']} onChange={handleOnchange} name="type" /> */}
            <Select
              name="type"
              // defaultValue="lucy"
              // style={{ width: 120 }}
              value={stateProduct.type}
              onChange={handleChangeSelect}
              options={renderOptions(typeProduct?.data?.data)}
            />
          </Form.Item>
          {stateProduct.type === 'add_type' && (
            <Form.Item
              label='New type'
              name="newType"
              rules={[{ required: true, message: 'Please input your type!' }]}
            >
              <InputComponent value={stateProduct.newType} onChange={handleOnchange} name="newType" />
            </Form.Item>
          )}

          <Form.Item
            label="Auth"
            name="auth"
            rules={[{ required: true, message: 'Please input your auth!' }]}
          >
            <InputComponent value={stateProduct['auth']} onChange={handleOnchange} name="auth" />
          </Form.Item>

          <Form.Item
            label="Publisher"
            name="publisher"
            rules={[{ required: true, message: 'Please input your publisher!' }]}
          >
            <InputComponent value={stateProduct['publisher']} onChange={handleOnchange} name="publisher" />
          </Form.Item>

          <Form.Item
            label="CountInStock"
            name="countInStock"
            rules={[{ required: true, message: 'Please input your countInStock!' }]}
          >
            <InputComponent value={stateProduct['countInStock']} onChange={handleOnchange} name="countInStock" />
          </Form.Item>

          <Form.Item
            label="Price_input"
            name="price_input"
            rules={[{ required: true, message: 'Please input your price_input!' }]}
          >
            <InputComponent value={stateProduct['price_input']} onChange={handleOnchange} name="price_input" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Please input your price!' }]}
          >
            <InputComponent value={stateProduct['price']} onChange={handleOnchange} name="price" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input your description!' }]}
          >
            <InputComponent value={stateProduct['description']} onChange={handleOnchange} name="description" />
          </Form.Item>

          <Form.Item
            label="Discount"
            name="discount"
            rules={[{ required: true, message: 'Please input your discount!' }]}
          >
            <InputComponent value={stateProduct['discount']} onChange={handleOnchange} name="discount" />
          </Form.Item>

          <Form.Item
            label="Image"
            name="image"
            rules={[{ required: true, message: 'Please input your image!' }]}
          >
            <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select File</Button>
              {stateProduct?.image && (
                <img src={stateProduct?.image} style={{
                  height: '60px',
                  width: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginLeft: '10px'
                }} alt="avatar" />
              )}
            </WrapperUploadFile>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </ModalComponent>
      < DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="80%">
        <Form
          name="basic"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: false }}
          onFinish={onUpdateProduct}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <InputComponent value={stateProductDetails['name']} onChange={handleOnchangeDetails} name="name" />

          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: 'Please input your type!' }]}
          >
            <InputComponent value={stateProductDetails['type']} onChange={handleOnchangeDetails} name="type" />
          </Form.Item>

          <Form.Item
            label="Auth"
            name="auth"
            rules={[{ required: true, message: 'Please input your auth!' }]}
          >
            <InputComponent value={stateProductDetails['auth']} onChange={handleOnchangeDetails} name="auth" />
          </Form.Item>

          <Form.Item
            label="Publisher"
            name="publisher"
            rules={[{ required: true, message: 'Please input your publisher!' }]}
          >
            <InputComponent value={stateProductDetails['publisher']} onChange={handleOnchangeDetails} name="publisher" />
          </Form.Item>

          <Form.Item
            label="CountInStock"
            name="countInStock"
            rules={[{ required: true, message: 'Please input your countInStock!' }]}
          >
            <InputComponent value={stateProductDetails['countInStock']} onChange={handleOnchangeDetails} name="countInStock" />
          </Form.Item>

          <Form.Item
            label="Price_input"
            name="price_input"
            rules={[{ required: true, message: 'Please input your price_input!' }]}
          >
            <InputComponent value={stateProductDetails['price_input']} onChange={handleOnchangeDetails} name="price_input" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Please input your price!' }]}
          >
            <InputComponent value={stateProductDetails['price']} onChange={handleOnchangeDetails} name="price" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input your description!' }]}
          >
            <InputComponent value={stateProductDetails['description']} onChange={handleOnchangeDetails} name="description" />
          </Form.Item>

          <Form.Item
            label="Discount"
            name="discount"
            rules={[{ required: true, message: 'Please input your discount!' }]}
          >
            <InputComponent value={stateProductDetails['discount']} onChange={handleOnchangeDetails} name="discount" />
          </Form.Item>

          <Form.Item
            label="Image"
            name="image"
            rules={[{ required: true, message: 'Please input your image!' }]}
          >
            <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select File</Button>
              {stateProductDetails?.image && (
                <img src={stateProductDetails?.image} style={{
                  height: '60px',
                  width: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginLeft: '10px'
                }} alt="avatar" />
              )}
            </WrapperUploadFile>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </DrawerComponent>
      <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
        <div>Bạn có chắc xóa sản phẩm này không?</div>
      </ModalComponent>
    </div>
  )
}

export default AdminProduct