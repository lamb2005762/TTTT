import React from 'react'
import ProductDetailComponent from '../../components/ProductDetailComponent/ProductDetailComponent'
import { useNavigate, useParams } from 'react-router-dom'

const ProductDetailsPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    return (
        <div style={{ padding: '0 120px', background: '#f3efef', height: '800px' }}>
            <h4 style={{ margin: '0', padding: '10px 0' }} ><span style={{ cursor: 'pointer' }} onClick={() => { navigate('/') }}>Trang chủ </span> - Chi tiết sản phẩm</h4>
            <ProductDetailComponent idProduct={id} />
        </div>
    )
}

export default ProductDetailsPage