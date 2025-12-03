import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductList from '../components/ProductList'
import ProductFilter from '../components/ProductFilter'
import ProductSearch from '../components/ProductSearch'
import { fetchProducts } from '../store/productsSlice'

const ProductsPage = () => {
  const dispatch = useDispatch()
  const { products, loading, categories } = useSelector(state => state.products)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState(1000)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    let filtered = products

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    if (priceRange < 1000) {
      filtered = filtered.filter(product => product.price <= priceRange)
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, priceRange, searchTerm])

  return (
    <div className="products-page">
      <h1>Products</h1>
      
      <div className="products-controls">
        <ProductSearch onSearch={setSearchTerm} />
      </div>

      <div className="products-content">
        <aside className="filters-sidebar">
          <ProductFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
          />
        </aside>

        <main className="products-main">
          <ProductList products={filteredProducts} loading={loading} />
        </main>
      </div>
    </div>
  )
}

export default ProductsPage