import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCart } from '../store/slices/secureCartSlice';

export const useCart = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);
};

export default useCart;