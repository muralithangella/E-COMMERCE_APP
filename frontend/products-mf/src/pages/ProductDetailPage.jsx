import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById } from '../store/productsSlice'
import LoadingSpinner from '../components/LoadingSpinner'

const ProductDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentProduct, loading } = useSelector(state => state.products)

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id))
    }
  }, [dispatch, id])

  if (loading) {
    return <LoadingSpinner size="large" />
  }

  if (!currentProduct) {
    return <div className="error">Product not found</div>
  }

  return (
    <div className="product-detail">
      <div className="product-image">
        <img src={currentProduct.image} alt={currentProduct.name} />
      </div>
      
      <div className="product-info">
        <h1>{currentProduct.name}</h1>
        <p className="price">${currentProduct.price}</p>
        <p className="category">Category: {currentProduct.category}</p>
        <p className="description">{currentProduct.description}</p>
        
        <div className="product-actions">
          <button className="add-to-cart-btn">Add to Cart</button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage