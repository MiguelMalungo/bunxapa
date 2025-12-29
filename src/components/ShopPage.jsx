import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ShopPage.css';

const ShopPage = () => {
  const backgroundRef = useRef(null);
  const navRef = useRef(null);
  const itemsRef = useRef(null);
  const footerRef = useRef(null);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const shopItems = [
    { id: 1, name: 'Item 1', price: '$25.00', image: '' },
    { id: 2, name: 'Item 2', price: '$30.00', image: '' },
    { id: 3, name: 'Item 3', price: '$20.00', image: '' },
    { id: 4, name: 'Item 4', price: '$35.00', image: '' },
  ];

  const albumItems = [
    { id: 1, name: 'Album 1', price: '$15.00', image: '' },
    { id: 2, name: 'Album 2', price: '$18.00', image: '' },
    { id: 3, name: 'Album 3', price: '$20.00', image: '' },
  ];

  useEffect(() => {
    // Set up Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all elements
    const elementsToObserve = [
      backgroundRef.current,
      navRef.current,
      itemsRef.current,
      footerRef.current
    ].filter(Boolean);

    elementsToObserve.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="shop-page">
      {/* Background Image */}
      <div
        ref={backgroundRef}
        className="shop-background animate-background"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}shop.webp)` }}
      />

      {/* Black Overlay */}
      <div className="shop-overlay" />

      {/* Navigation Menu */}
      <nav className="nav-menu animate-nav" ref={navRef}>
        <Link to="/" className="nav-link">HOME</Link>
        <Link to="/tour" className="nav-link">DATES</Link>
        <Link to="/listen" className="nav-link">LISTEN</Link>
        <Link to="/shop" className="nav-link active">SHOP</Link>
      </nav>

      {/* Albums Container - Aligned to the left */}
      <div className="shop-albums-container animate-items" ref={itemsRef}>
        {albumItems.map(item => (
          <div key={item.id} className="shop-item" onClick={() => setSelectedItem(item)}>
            <div className="shop-item-image">
              {item.image && <img src={item.image} alt={item.name} />}
            </div>
            <div className="shop-item-details">
              <h3>{item.name}</h3>
              <p className="shop-item-price">{item.price}</p>
              <button className="shop-item-btn">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>

      {/* Shop Items Container - Aligned to the right */}
      <div className="shop-items-container animate-items">
        {shopItems.map(item => (
          <div key={item.id} className="shop-item" onClick={() => setSelectedItem(item)}>
            <div className="shop-item-image">
              {item.image && <img src={item.image} alt={item.name} />}
            </div>
            <div className="shop-item-details">
              <h3>{item.name}</h3>
              <p className="shop-item-price">{item.price}</p>
              <button className="shop-item-btn">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for selected item */}
      {selectedItem && (
        <div className="shop-modal" onClick={() => setSelectedItem(null)}>
          <div className="shop-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="shop-modal-close" onClick={() => setSelectedItem(null)}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="shop-modal-image">
              {selectedItem.image && <img src={selectedItem.image} alt={selectedItem.name} />}
            </div>
            <div className="shop-modal-details">
              <h2>{selectedItem.name}</h2>
              <p className="shop-modal-price">{selectedItem.price}</p>
              <button className="shop-modal-btn">Add to Cart</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="shop-footer animate-footer" ref={footerRef}>
        <div className="footer-content">
          <div className="footer-right">
            Created by <span className="footer-author">DIGISOL</span>
            <img
              src={`${import.meta.env.BASE_URL}logodigi.png`}
              alt="DIGISOL Logo"
              className="footer-logo"
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ShopPage;
