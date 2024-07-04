import { Divider, Dropdown, Radio, Space, Table } from 'antd';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';

import React, { useState } from 'react'

const TableComponent = (props) => {
  const { selectionType = 'checkbox', data = [], columns = [], handleDelteManyProducts } = props
  const [rowSelectedKeys, setRowSelectedKeys] = useState([])
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys)
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === 'Disabled User',
    //   name: record.name,
    // }),
  };

  const handleDeleteAll = () => {
    handleDelteManyProducts(rowSelectedKeys)
  }

  return (
    <div>
      {rowSelectedKeys.length > 0 && (
        <div style={{
          background: 'red',
          color: '#fff',
          fontWeight: 'bold',
          padding: '10px',
          width: 'fit-content',
          cursor: 'pointer',
          borderRadius: '4px',
          marginBottom: '10px'
        }}
          onClick={handleDeleteAll}>
          <span style={{ fontSize: '13px', marginRight: '5px' }}>Xóa tất cả</span>
        </div>
      )}

      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        {...props}
      />
    </div>
  )
}

export default TableComponent
