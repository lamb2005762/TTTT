import React, { useMemo, useRef, useState } from 'react';
import { Button, Space } from 'antd';
import { WrapperHeader } from './style';
import TableComponent from '../TableComponent/TableComponent';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import { convertPrice } from '../../utils';
import * as OrderService from '../../services/OrderService';
import { useQuery } from '@tanstack/react-query';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { orderContant } from '../../contant';
import InputComponent from '../InputComponent/InputComponent';
import { WrapperStyleContent, WrapperProduct, WrapperNameProduct, WrapperItem, WrapperItemLabel, WrapperAllPrice } from '../../pages/DetailsOrderPage/style';

const AdminOrder = () => {
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };

  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder });
  const { data: orders } = queryOrder;

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
      title: 'User name',
      dataIndex: 'userName',
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps('userName')
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone.length - b.phone.length,
      ...getColumnSearchProps('phone')
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps('address')
    },
    {
      title: 'IsPaid',
      dataIndex: 'isPaid',
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
      ...getColumnSearchProps('isPaid')
    },
    {
      title: 'Shipped',
      dataIndex: 'isDelivered',
      sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
      ...getColumnSearchProps('isDelivered')
    },
    {
      title: 'Payment method',
      dataIndex: 'paymentMethod',
      sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
      ...getColumnSearchProps('paymentMethod')
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <Button type="link" onClick={() => handleGetDetails(record.key)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  const dataTable = orders?.data?.length && orders?.data?.map((order) => {
    return { ...order, key: order._id, userName: order?.shippingAddress?.fullName, phone: order?.shippingAddress?.phone, address: order?.shippingAddress?.address, paymentMethod: orderContant.payment[order?.paymentMethod], isPaid: order?.isPaid ? 'TRUE' : 'FALSE', isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE' }
  });

  const handleGetDetails = async (orderId) => {
    const orderDetails = await OrderService.getDetailsOrder(orderId, user.access_token);
    setIsOpenDrawer(true);
    setOrderDetails(orderDetails);
  };

  const priceMemo = useMemo(() => {
    const result = orderDetails?.data?.orderItems?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    }, 0)
    return result
  }, [orderDetails])

  const discountMemo = useMemo(() => {
    const result = orderDetails?.data?.orderItems?.reduce((total, cur) => {
      return total + (cur?.amount * cur?.price * cur?.discount * 0.01)
    }, 0)
    return result
  }, [orderDetails])

  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
      <div style={{ marginTop: '20px' }}>
        <TableComponent columns={columns} data={dataTable} />
        <DrawerComponent title='Chi tiết đơn hàng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="80%">
          <WrapperStyleContent>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '670px' }}>Sản phẩm</div>
              <WrapperItemLabel>Giá</WrapperItemLabel>
              <WrapperItemLabel>Số lượng</WrapperItemLabel>
              <WrapperItemLabel>Giảm giá</WrapperItemLabel>
            </div>
            {orderDetails?.data?.orderItems?.map((order) => {
              return (
                <WrapperProduct>
                  <WrapperNameProduct>
                    <img src={order?.image}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        border: '1px solid rgb(238, 238, 238)',
                        padding: '2px'
                      }}
                    />
                    <div style={{
                      width: 260,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginLeft: '10px',
                      height: '70px',
                    }}>{order?.name}</div>
                  </WrapperNameProduct>
                  <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                  <WrapperItem>{order?.amount}</WrapperItem>
                  <WrapperItem>{order?.discount ? convertPrice(order?.amount * order?.price * order?.discount * 0.01) : '0 VND'}</WrapperItem>
                </WrapperProduct>
              )
            })}
            <WrapperAllPrice>
              <WrapperItemLabel>Tổng sản phẩm</WrapperItemLabel>
              <WrapperItem>{convertPrice(priceMemo)}</WrapperItem>
            </WrapperAllPrice>
            <WrapperAllPrice>
              <WrapperItemLabel>Tổng giảm giá</WrapperItemLabel>
              <WrapperItem>{convertPrice(discountMemo)}</WrapperItem>
            </WrapperAllPrice>
            <WrapperAllPrice>
              <WrapperItemLabel>Phí vận chuyển</WrapperItemLabel>
              <WrapperItem>{convertPrice(orderDetails?.data?.shippingPrice)}</WrapperItem>
            </WrapperAllPrice>
            <WrapperAllPrice>
              <WrapperItemLabel>Tổng đơn hàng</WrapperItemLabel>
              <WrapperItem><WrapperItem>{convertPrice(orderDetails?.data?.totalPrice)}</WrapperItem></WrapperItem>
            </WrapperAllPrice>
          </WrapperStyleContent>
        </DrawerComponent>
      </div>
    </div>
  );
};

export default AdminOrder;