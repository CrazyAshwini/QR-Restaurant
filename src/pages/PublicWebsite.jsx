import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRestaurant } from '../context/RestaurantContext'

export default function PublicWebsite() {
  const { menu } = useRestaurant()
  const [activeSection, setActiveSection] = useState('home')

  const renderSection = () => {
    switch (activeSection) {
      case 'menu':
        return <MenuSection menu={menu} />
      case 'about':
        return <AboutSection />
      case 'contact':
        return <ContactSection />
      default:
        return <HomeSection onNavigate={setActiveSection} />
    }
  }

  return (
    <div>
      <nav className="nav">
        <Link to="/" className="nav-brand" onClick={() => setActiveSection('home')}>
          La Bella Italia
        </Link>
        <div className="nav-links">
          <a href="#home" onClick={() => setActiveSection('home')}>Home</a>
          <a href="#menu" onClick={() => setActiveSection('menu')}>Menu</a>
          <a href="#about" onClick={() => setActiveSection('about')}>About</a>
          <a href="#contact" onClick={() => setActiveSection('contact')}>Contact</a>
        </div>
      </nav>
      {renderSection()}
    </div>
  )
}

function HomeSection({ onNavigate }) {
  return (
    <div>
      <section className="hero-section">
        <div className="container">
          <h1>La Bella Italia</h1>
          <p>Authentic Italian Cuisine in the Heart of the City</p>
          <div style={{ marginTop: '30px' }}>
            <button className="btn btn-primary" onClick={() => onNavigate('menu')}>
              View Our Menu
            </button>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '60px 20px' }}>
        <div className="grid grid-3">
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🍝</div>
            <h3>Fresh Pasta</h3>
            <p>Made fresh daily with imported Italian ingredients</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🍷</div>
            <h3>Fine Wines</h3>
            <p>Selection of premium Italian wines</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>👨‍🍳</div>
            <h3>Expert Chefs</h3>
            <p>Traditional recipes from Italy</p>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '0 20px 60px' }}>
        <h2 className="section-title">Featured Dishes</h2>
        <div className="grid grid-2">
          <div className="menu-item">
            <img src="https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200" alt="Steak" className="menu-item-image" />
            <div className="menu-item-content">
              <div className="menu-item-name">Ribeye Steak</div>
              <div className="menu-item-desc">12oz premium ribeye with herb butter</div>
              <div className="menu-item-price">$42.99</div>
            </div>
          </div>
          <div className="menu-item">
            <img src="https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=200" alt="Pizza" className="menu-item-image" />
            <div className="menu-item-content">
              <div className="menu-item-name">Margherita Pizza</div>
              <div className="menu-item-desc">Fresh mozzarella, tomatoes, basil</div>
              <div className="menu-item-price">$18.99</div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ background: '#1d3557', color: 'white', padding: '40px 20px', textAlign: 'center' }}>
        <p>Open Daily: 11:00 AM - 10:00 PM</p>
        <p>123 Italian Street, Foodie City</p>
        <p style={{ marginTop: '20px', opacity: 0.7 }}>&copy; 2026 La Bella Italia</p>
      </footer>
    </div>
  )
}

function MenuSection({ menu }) {
  const allItems = [
    ...menu.starters.map(i => ({ ...i, category: 'Starters' })),
    ...menu.mains.map(i => ({ ...i, category: 'Mains' })),
    ...menu.desserts.map(i => ({ ...i, category: 'Desserts' })),
    ...menu.drinks.map(i => ({ ...i, category: 'Drinks' })),
  ]

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h2 className="section-title">Our Menu</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>Visit us to order. This is our public menu display.</p>
      <div className="grid grid-2">
        {allItems.map(item => (
          <div key={item.id} className="menu-item">
            <img src={item.image} alt={item.name} className="menu-item-image" />
            <div className="menu-item-content">
              <div className="menu-item-name">{item.name}</div>
              <div className="menu-item-desc">{item.description}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="menu-item-price">${item.price.toFixed(2)}</div>
                <div className="menu-item-badges">
                  <span className={`badge ${item.veg ? 'badge-veg' : 'badge-non-veg'}`}>
                    {item.veg ? 'Veg' : 'Non-Veg'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AboutSection() {
  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h2 className="section-title">About Us</h2>
      <div className="grid grid-2">
        <div>
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400" 
            alt="Restaurant" 
            style={{ width: '100%', borderRadius: '12px' }}
          />
        </div>
        <div>
          <h3>Our Story</h3>
          <p style={{ color: '#666', lineHeight: 1.8 }}>
            Founded in 2010, La Bella Italia brings the authentic flavors of Italy to your table. 
            Our chefs trained in Rome, Florence, and Naples to bring you traditional recipes passed 
            down through generations.
          </p>
          <h3 style={{ marginTop: '20px' }}>Our Mission</h3>
          <p style={{ color: '#666', lineHeight: 1.8 }}>
            To provide an unforgettable dining experience with fresh ingredients, warm hospitality, 
            and dishes that make you feel like you're in Italy.
          </p>
        </div>
      </div>
    </div>
  )
}

function ContactSection() {
  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h2 className="section-title">Contact Us</h2>
      <div className="grid grid-2">
        <div className="card">
          <h3>Location</h3>
          <p>123 Italian Street<br />Foodie City, FC 12345</p>
          <h3 style={{ marginTop: '20px' }}>Hours</h3>
          <p>Mon-Sun: 11:00 AM - 10:00 PM</p>
          <h3 style={{ marginTop: '20px' }}>Phone</h3>
          <p>(555) 123-4567</p>
        </div>
        <div className="card">
          <h3>Reserve a Table</h3>
          <div className="form-group">
            <label>Name</label>
            <input type="text" placeholder="Your name" />
          </div>
          <div className="form-group">
            <label>Number of Guests</label>
            <select>
              <option>1 Guest</option>
              <option>2 Guests</option>
              <option>3 Guests</option>
              <option>4 Guests</option>
              <option>5+ Guests</option>
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }}>
            Reserve Table
          </button>
        </div>
      </div>
    </div>
  )
}