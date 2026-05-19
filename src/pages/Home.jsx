import React from 'react'
import demoData from '../data/demo-data.json'

const sections = [
  { title: 'Starters', category: 'starters' },
  { title: 'Mains', category: 'mains' },
  { title: 'Desserts', category: 'desserts' },
  { title: 'Drinks', category: 'drinks' }
]

const galleryImages = [
  { alt: 'Indian street food', src: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=900&q=80' },
  { alt: 'Spicy curry dishes', src: 'https://images.unsplash.com/photo-1604908177522-8da46d8b4bd6?auto=format&fit=crop&w=900&q=80' },
  { alt: 'Indian dessert', src: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=900&q=80' }
]

export default function Home() {
  return (
    <div className="page home">
      <section className="hero hero-indian">
        <div>
          <p className="eyebrow">Campus Dhaba</p>
          <h1>Authentic Indian flavors, served right at your table.</h1>
          <p className="hero-copy">
            Scan your table QR, explore our spicy favorites, add items to your cart, and track your order live.
            A modern dining experience for an Indian restaurant on campus.
          </p>
          <div className="hero-actions">
            <a className="btn" href="/table/1">Order at Table 1</a>
            <a className="btn btn-secondary" href="#menu-preview">Menu Preview</a>
          </div>
        </div>
        <div className="hero-card hero-image-card">
          <img
            src="https://images.unsplash.com/photo-1604908177522-8da46d8b4bd6?auto=format&fit=crop&w=900&q=80"
            alt="Indian cuisine"
          />
          <div className="hero-image-copy">
            <p>Scan the table QR</p>
            <pre className="qr-sample">/table/1</pre>
            <p className="small">Enjoy biryani, butter chicken, chai, and more without waiting in line.</p>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <article className="feature-card">
          <h3>Instant table ordering</h3>
          <p>Guests browse the Indian menu, select spice levels, and place orders from their phone.</p>
        </article>
        <article className="feature-card">
          <h3>Kitchen up next</h3>
          <p>New orders appear instantly, so the kitchen can start cooking right away.</p>
        </article>
        <article className="feature-card">
          <h3>Fast checkout</h3>
          <p>Cashier panel shows bill requests, payments, and tables ready to clear.</p>
        </article>
        <article className="feature-card">
          <h3>Manager analytics</h3>
          <p>Understand top selling dishes and peak service times instantly.</p>
        </article>
      </section>

      <section id="menu-preview" className="menu-preview">
        <header>
          <p className="eyebrow">Menu Preview</p>
          <h2>Campus Dhaba favorites</h2>
          <p>Explore our Indian restaurant menu with spicy starters, rich curries, and refreshing drinks.</p>
        </header>
        <div className="menu-grid">
          {sections.map(section => (
            <div className="menu-section" key={section.category}>
              <h3>{section.title}</h3>
              <ul>
                {Object.entries(demoData.menu[section.category]).map(([key, item]) => (
                  <li key={key} className="menu-item">
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.prep} min • {item.veg ? 'Veg' : 'Non-veg'}</p>
                    </div>
                    <div>${item.price.toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="gallery-section">
        <header>
          <p className="eyebrow">Gallery</p>
          <h2>Feel the Indian dining vibe</h2>
        </header>
        <div className="gallery-grid">
          {galleryImages.map(img => (
            <img key={img.src} src={img.src} alt={img.alt} />
          ))}
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-copy">
          <p className="eyebrow">Visit us</p>
          <h2>Campus Dhaba, Spice Street</h2>
          <p>Open daily from 8:00 AM to 10:00 PM. Spicy curries, fragrant biryani, and quick table service.</p>
          <ul>
            <li>123 Curry Lane, Campus Center</li>
            <li>Phone: (555) 010-2024</li>
            <li>Email: hello@campusdhaba.example</li>
          </ul>
        </div>
        <form className="reserve-form">
          <h3>Reserve a table</h3>
          <label>
            Name
            <input placeholder="Your name" />
          </label>
          <label>
            Guests
            <input placeholder="2" type="number" min="1" />
          </label>
          <label>
            Date & time
            <input type="datetime-local" />
          </label>
          <button className="btn">Send request</button>
        </form>
      </section>
    </div>
  )
}
