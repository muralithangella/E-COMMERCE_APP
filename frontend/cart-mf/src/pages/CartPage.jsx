import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCart } from '../store/cartSlice'
import CartHeader from '../components/CartHeader'
import CartItemList from '../components/CartItemList'
import CartSummary from '../components/CartSummary'
import EmptyCart from '../components/EmptyCart'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const CartPage = () => {
  const dispatch = useDispatch()
  const { items, total, count, loading, error } = useSelector(state => state.cart)

  useEffect(() => {
    dispatch(fetchCart())
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!items.length) return <EmptyCart />

  return (
    <div className="cart-page">
      <CartHeader itemCount={count} />
      <div className="cart-content">
        <CartItemList items={items} />
        <CartSummary total={total} itemCount={count} />
      </div>
    </div>
  )
}

export default CartPage