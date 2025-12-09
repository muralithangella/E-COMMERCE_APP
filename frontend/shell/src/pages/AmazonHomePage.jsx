import React, { useState, useEffect } from 'react';
import './AmazonHomePage.css';
import { 
  useGetProductsQuery, 
  useGetDealsQuery, 
  useGetCategoriesQuery,
  useGetRecommendationsQuery,
  useGetRecentlyViewedQuery
} from '../store/api/apiSlice';

const AmazonHomePage = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  const { data: productsData } = useGetProductsQuery({ limit: 8 });
  const { data: dealsData } = useGetDealsQuery();
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: recommendationsData } = useGetRecommendationsQuery();
  const { data: recentlyViewedData } = useGetRecentlyViewedQuery();

  const products = productsData || [];
  const deals = dealsData || [];
  const categories = categoriesData || [];

  // Static banner data
  const banners = [
    {
      id: 1,
      image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devjyoti/GW/Uber/Nov/D103625178_DesktopTallHero_3000x1200.jpg',
      title: 'Great Indian Festival',
      subtitle: 'Up to 80% off on everything'
    },
    {
      id: 2,
      image: 'https://images-eu.ssl-images-amazon.com/images/G/31/prime/PrimeDay/2023/GW/PD23_GW_PC_Hero_NTA_2x._CB595001705_.jpg',
      title: 'Prime Day Special',
      subtitle: 'Exclusive deals for Prime members'
    },
    {
      id: 3,
      image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/Electronics/GW/Desktop/Desktop_Hero_1500x600.jpg',
      title: 'Electronics Carnival',
      subtitle: 'Best prices on gadgets'
    }
  ];

  const homeCategories = [
    {
      title: 'Revamp your home in style',
      items: [
        { name: 'Cushion covers, bedsheets & more', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/Irfan/GATEWAY/MSO/Appliances-QC-PC-372x232._SY232_CB667322346_.jpg', link: '/home-decor' },
        { name: 'Figurines, vases & more', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/Irfan/GATEWAY/MSO/B08345R1ZW---372x232._SY232_CB667322346_.jpg', link: '/home-decor' },
        { name: 'Home storage', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/Irfan/GATEWAY/MSO/Appliances-QC-PC-186x116--B08RDL6H79._SY232_CB667322346_.jpg', link: '/storage' },
        { name: 'Lighting solutions', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/Irfan/GATEWAY/MSO/Appliances-QC-PC-186x116--B08345R1ZW._SY232_CB667322346_.jpg', link: '/lighting' }
      ]
    },
    {
      title: 'Appliances for your home | Up to 55% off',
      items: [
        { name: 'Air conditioners', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/Irfan/GATEWAY/MSO/Appliances-QC-PC-186x116--B08RDL6H79._SY232_CB667322346_.jpg', link: '/ac' },
        { name: 'Refrigerators', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/Irfan/GATEWAY/MSO/Appliances-QC-PC-186x116--B08345R1ZW._SY232_CB667322346_.jpg', link: '/refrigerators' },
        { name: 'Microwaves', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/Irfan/GATEWAY/MSO/Appliances-QC-PC-372x232._SY232_CB667322346_.jpg', link: '/microwaves' },
        { name: 'Washing machines', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/Irfan/GATEWAY/MSO/B08345R1ZW---372x232._SY232_CB667322346_.jpg', link: '/washing-machines' }
      ]
    },
    {
      title: 'Starting ₹149 | Headphones',
      items: [
        { name: 'Starting ₹149 | Wired headphones', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img23/PB/March/Lakme._SY232_CB595001705_.jpg', link: '/headphones' },
        { name: 'Starting ₹249 | Bluetooth headphones', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img23/PB/March/Philips._SY232_CB595001705_.jpg', link: '/bluetooth-headphones' },
        { name: 'Starting ₹799 | True wireless', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/march/brands/GW/Under_199_Cleaning_supplies_1._SY232_CB667322346_.jpg', link: '/true-wireless' },
        { name: 'Starting ₹1,499 | Premium headphones', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/march/brands/GW/Under_199_Bathroom_accessories_1._SY232_CB667322346_.jpg', link: '/premium-headphones' }
      ]
    },
    {
      title: 'Up to 70% off | Clearance store',
      items: [
        { name: 'Clothing', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Fashion/GW/Desktop_Hero_1500x600.jpg', link: '/clearance-clothing' },
        { name: 'Footwear', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Sports/GW/Desktop_Hero_1500x600.jpg', link: '/clearance-footwear' },
        { name: 'Watches', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/toys/GW/Desktop_Hero_1500x600.jpg', link: '/clearance-watches' },
        { name: 'Bags & luggage', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/grocery/GW/Desktop_Hero_1500x600.jpg', link: '/clearance-bags' }
      ]
    }
  ];

  // Use deals and recommendations from API
  const todaysDeals = deals.length > 0 ? deals : [];
  const recommended = recommendationsData || [];
  const recentlyViewed = recentlyViewedData || [];

  const topBrands = [
    { name: 'Samsung', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img17/Mobile/Jupiter/MSO/B08N5WRWNW-edit._SY232_CB667322346_.jpg' },
    { name: 'Apple', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/Electronics/GW/Desktop/Desktop_Hero_1500x600.jpg' },
    { name: 'OnePlus', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Fashion/GW/Desktop_Hero_1500x600.jpg' },
    { name: 'Xiaomi', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/march/brands/GW/Under_199_Cleaning_supplies_1._SY232_CB667322346_.jpg' },
    { name: 'Realme', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Beauty/GW/Desktop_Hero_1500x600.jpg' },
    { name: 'Vivo', image: 'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Books/GW/Desktop_Hero_1500x600.jpg' }
  ];

  // Auto-rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }
    
    return stars;
  };

  return (
    <div className="amazon-homepage">
      {/* Hero Banner Section */}
      <section className="hero-section">
        <div className="banner-container">
          <div className="banner-slider">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`banner-slide ${index === currentBanner ? 'active' : ''}`}
                style={{ backgroundImage: `url(${banner.image})` }}
              >
                <div className="banner-content">
                  <h2>{banner.title}</h2>
                  <p>{banner.subtitle}</p>
                  <button className="shop-now-btn">Shop Now</button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Banner Navigation */}
          <div className="banner-nav">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`nav-dot ${index === currentBanner ? 'active' : ''}`}
                onClick={() => setCurrentBanner(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Today's Deals */}
      <section className="deals-section">
        <div className="container">
          <div className="section-header">
            <h2>Today's Deals</h2>
            <a href="/deals" className="see-all">See all deals</a>
          </div>
          
          <div className="deals-grid">
            {deals.map((deal) => (
              <div key={deal._id} className="deal-card">
                <div className="deal-badge">
                  <span className="discount">{deal.discount?.percentage || deal.discountPercentage || 0}% off</span>
                  <span className="deal-label">Deal of the Day</span>
                </div>
                
                <div className="deal-image">
                  <img src={deal.images?.[0]?.url || deal.image || 'https://via.placeholder.com/200x150'} alt={deal.name} />
                </div>
                
                <div className="deal-info">
                  <div className="deal-timer">
                    <span className="timer-icon">⏰</span>
                    <span className="time-left">Limited Time</span>
                  </div>
                  
                  <div className="deal-pricing">
                    <span className="deal-price">{formatPrice(deal.price?.sale || deal.price?.regular || deal.price)}</span>
                    {deal.price?.regular && (
                      <span className="original-price">{formatPrice(deal.price.regular)}</span>
                    )}
                  </div>
                  
                  <div className="deal-rating">
                    <div className="stars">
                      {renderStars(deal.ratings?.average || 0)}
                    </div>
                    <span className="rating-text">({deal.ratings?.average || 0})</span>
                  </div>
                  
                  <h3 className="deal-name">{deal.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Sections */}
      <section className="category-sections">
        <div className="container">
          <div className="category-grid">
            {homeCategories.map((category, index) => (
              <div key={index} className="category-card">
                <h3 className="category-title">{category.title}</h3>
                <div className="category-items">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="category-item">
                      <img src={item.image} alt={item.name} />
                      <p>{item.name}</p>
                    </div>
                  ))}
                </div>
                <a href="#" className="category-link">See more</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Brands */}
      <section className="brands-section">
        <div className="container">
          <div className="section-header">
            <h2>Top brands for you</h2>
          </div>
          
          <div className="brands-grid">
            {topBrands.map((brand, index) => (
              <div key={index} className="brand-card">
                <img src={brand.image} alt={brand.name} />
                <h4>{brand.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prime Benefits Banner */}
      <section className="prime-banner">
        <div className="container">
          <div className="prime-content">
            <div className="prime-logo">
              <img src="/prime-logo.png" alt="Amazon Prime" />
            </div>
            <div className="prime-text">
              <h3>Join Prime for unlimited fast, free delivery</h3>
              <p>Plus, enjoy exclusive deals, Prime Video, Prime Music and more</p>
            </div>
            <div className="prime-actions">
              <button className="prime-join-btn">Join Prime</button>
              <a href="/prime" className="prime-learn-more">Learn more</a>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="recently-viewed">
        <div className="container">
          <div className="section-header">
            <h2>Your recently viewed items</h2>
            <a href="/history" className="see-all">View all</a>
          </div>
          
          <div className="products-carousel">
            <div className="carousel-track">
              {products.slice(0, 8).map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image">
                    <img src={product.images?.[0]?.url || product.image || 'https://via.placeholder.com/200x150'} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <div className="product-rating">
                      <div className="stars">
                        {renderStars(product.rating?.average || 0)}
                      </div>
                      <span>({product.rating?.average || 0})</span>
                    </div>
                    <div className="product-price">
                      <span className="current-price">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="original-price">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="recommendations">
        <div className="container">
          <div className="section-header">
            <h2>Recommended for you</h2>
          </div>
          
          <div className="recommendations-grid">
            {recommended.slice(0, 8).map((product) => (
              <div key={product._id} className="recommendation-card">
                <div className="product-image">
                  <img src={product.images?.[0]?.url || product.image || 'https://via.placeholder.com/200x150'} alt={product.name} />
                  <div className="quick-actions">
                    <button className="wishlist-btn">♡</button>
                    <button className="compare-btn">⚖</button>
                  </div>
                </div>
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <div className="product-rating">
                    <div className="stars">
                      {renderStars(product.ratings?.average || 0)}
                    </div>
                    <span>({product.ratings?.average || 0})</span>
                  </div>
                  <div className="product-price">
                    <span className="current-price">{formatPrice(product.price?.sale || product.price?.regular || product.price)}</span>
                    {product.price?.regular && (
                      <span className="original-price">{formatPrice(product.price.regular)}</span>
                    )}
                    {product.discount?.percentage && (
                      <span className="discount">({product.discount.percentage}% off)</span>
                    )}
                  </div>
                  <div className="delivery-info">
                    <span className="free-delivery">FREE Delivery</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="recommendations">
          <div className="container">
            <div className="section-header">
              <h2>Continue browsing</h2>
            </div>
            
            <div className="recommendations-grid">
              {recentlyViewed.map((product) => (
                <div key={product._id} className="recommendation-card">
                  <div className="product-image">
                    <img src={product.images?.[0]?.url || product.image || 'https://via.placeholder.com/200x150'} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <div className="product-price">
                      <span className="current-price">{formatPrice(product.price?.sale || product.price?.regular || product.price)}</span>
                      {product.price?.regular && (
                        <span className="original-price">{formatPrice(product.price.regular)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AmazonHomePage;