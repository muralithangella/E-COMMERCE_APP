import React, { useState, useEffect } from 'react';

const addToCart = async (productId) => {
  try {
    console.log('Adding product to cart:', productId);
    const response = await fetch('http://localhost:5000/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity: 1 })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Added to cart successfully:', data);
      alert('Product added to cart!');
    } else {
      console.error('Failed to add to cart');
      alert('Failed to add to cart');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert('Error adding to cart');
  }
};

const HomePage = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const banners = [
    {
      id: 1,
      image: 'https://via.placeholder.com/1200x400/e74c3c/FFFFFF?text=Holiday+Deals+-+Up+to+70%25+OFF',
      title: 'Holiday Deals',
      subtitle: 'Up to 70% off on electronics',
      cta: 'Shop Now',
      link: '/products'
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/1200x400/27ae60/FFFFFF?text=FREE+SHIPPING+on+orders+over+$35',
      title: 'Free Shipping',
      subtitle: 'On orders over $35',
      cta: 'Learn More',
      link: '/products'
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/1200x400/3498db/FFFFFF?text=NEW+ARRIVALS+-+Latest+Products',
      title: 'New Arrivals',
      subtitle: 'Latest products just for you',
      cta: 'Explore',
      link: '/products'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from API...');
        const [categoriesRes, productsRes] = await Promise.all([
          fetch('http://localhost:5000/api/categories'),
          fetch('http://localhost:5000/api/products')
        ]);
        
        console.log('Categories response:', categoriesRes.status);
        console.log('Products response:', productsRes.status);
        
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          console.log('Categories data:', categoriesData);
          setCategories(categoriesData.data || []);
        } else {
          console.error('Categories fetch failed:', categoriesRes.status);
        }
        
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          console.log('Products data:', productsData);
          setProducts(productsData.data || productsData.products || []);
        } else {
          console.error('Products fetch failed:', productsRes.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const deals = products.filter(p => p.discount > 0 || p.originalPrice).slice(0, 4);
  const recommendations = products.slice(0, 6);
  
  console.log('Products loaded:', products.length);
  console.log('Deals found:', deals.length);
  console.log('Categories loaded:', categories.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div style={{ backgroundColor: '#f3f3f3', minHeight: '100vh' }}>
      {/* Hero Banner Carousel */}
      <div style={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${banner.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: index === currentBanner ? 1 : 0,
              transition: 'opacity 1s ease-in-out'
            }}
          >
            <div style={{ textAlign: 'center', color: 'white' }}>
              <h1 style={{ fontSize: '48px', margin: '0 0 16px 0', fontWeight: 'bold' }}>
                {banner.title}
              </h1>
              <p style={{ fontSize: '24px', margin: '0 0 32px 0' }}>
                {banner.subtitle}
              </p>
              <a
                href={banner.link}
                style={{
                  display: 'inline-block',
                  padding: '12px 32px',
                  backgroundColor: '#ff9f00',
                  color: '#000',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s'
                }}
              >
                {banner.cta}
              </a>
            </div>
          </div>
        ))}
        
        {/* Banner Indicators */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px'
        }}>
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: index === currentBanner ? '#ff9f00' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        
        {/* Categories Section */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '500' }}>
              Shop by Category
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px'
            }}>
              {loading ? (
                <div>Loading categories...</div>
              ) : (
                categories.map((category) => (
                  <a
                    key={category._id}
                    href={`/products?category=${category.name}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      textAlign: 'center',
                      padding: '16px',
                      borderRadius: '8px',
                      transition: 'transform 0.2s',
                      display: 'block'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <img
                      src={category.image || `https://via.placeholder.com/200x150/3498db/FFFFFF?text=${encodeURIComponent(category.name)}`}
                      alt={category.name}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '12px'
                      }}
                    />
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>
                      {category.name}
                    </h3>
                  </a>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Lightning Deals */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '500' }}>
                ⚡ Lightning Deals
              </h2>
              <span style={{ marginLeft: '16px', color: '#B12704', fontSize: '14px' }}>
                Limited time offers
              </span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px'
            }}>
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ position: 'relative', marginBottom: '12px' }}>
                    <img
                      src={deal.image}
                      alt={deal.name}
                      loading="lazy"
                      onError={(e) => {
                        console.log('Deal image failed to load:', deal.image);
                        e.target.src = `https://via.placeholder.com/250x150/ff4757/FFFFFF?text=${encodeURIComponent(deal.name.substring(0, 15))}`;
                      }}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#ff4757',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      -{deal.discount}%
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{deal.name}</h3>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#B12704' }}>
                      ${deal.price}
                    </span>
                    {deal.originalPrice && (
                      <span style={{
                        marginLeft: '8px',
                        fontSize: '14px',
                        color: '#666',
                        textDecoration: 'line-through'
                      }}>
                        ${deal.originalPrice}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#ff4757', fontWeight: 'bold', marginBottom: '10px' }}>
                    {deal.discount}% OFF
                  </div>
                  <button
                    onClick={() => {
                      console.log('Clicking add to cart for deal:', deal);
                      addToCart(deal.id);
                    }}
                    style={{
                      backgroundColor: '#ff9f00',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    Add to Cart (ID: {deal.id})
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recommendations */}
        <section>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '500' }}>
              Recommended for You
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {loading ? (
                <div>Loading products...</div>
              ) : (
                recommendations.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '16px',
                      textAlign: 'center',
                      transition: 'transform 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => {
                        console.log('Image failed to load:', item.image);
                        e.target.src = `https://via.placeholder.com/200x150/2c3e50/FFFFFF?text=${encodeURIComponent(item.name.substring(0, 20))}`;
                      }}
                      style={{
                        width: '100%',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        marginBottom: '12px'
                      }}
                    />
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{item.name}</h3>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#B12704' }}>
                        ${item.price}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                      {'★'.repeat(Math.floor(item.rating || 4))}
                      <span style={{ marginLeft: '4px', fontSize: '12px', color: '#666' }}>
                        {item.rating || 4.0}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        console.log('Clicking add to cart for item:', item);
                        addToCart(item.id);
                      }}
                      style={{
                        backgroundColor: '#ff9f00',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      Add to Cart (ID: {item.id})
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;