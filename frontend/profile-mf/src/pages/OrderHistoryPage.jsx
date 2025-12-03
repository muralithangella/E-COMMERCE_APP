import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchOrderHistory } from '../store/profileSlice'
import OrderList from '../components/OrderList'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const OrderHistoryPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { orders, loading, error } = useSelector((state) => state.profile)

  useEffect(() => {
    dispatch(fetchOrderHistory())
  }, [dispatch])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="order-history-page">
      <div className="page-header">
        <h1>Order History</h1>
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          Back to Profile
        </button>
      </div>
      <OrderList orders={orders} />
    </div>
  )
}

export default OrderHistoryPage