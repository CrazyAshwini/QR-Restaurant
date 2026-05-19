import React from 'react'
import demoData from '../data/demo-data.json'

const sections = [
  { title: 'Starters', category: 'starters' },
  { title: 'Mains', category: 'mains' },
  { title: 'Desserts', category: 'desserts' },
  { title: 'Drinks', category: 'drinks' }
]

const galleryImages = [
  { alt: 'Cafe dining', src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80' },
  { alt: 'Coffee and drinks', src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80' },
  { alt: 'Comfort food', src: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=900&q=80' }
]

export default function Home() {
  return (
    <div className="page home">
      <section className="hero">
        <div>
          <p className="eyebrow">Campus Cafe</p>
          <h1>Order from your table, skip the wait.</h1>
          <p className="hero-copy">
            Scan any table QR code, browse the menu, place your order, and request the bill—all from your phone.
            Fast service for students, faculty, and campus visitors.
          </p>
          <div className="hero-actions">
            <a className="btn" href="/table/1">View Table Experience</a>
            <a className="btn btn-secondary" href="#menu-preview">Menu Preview</a>
          </div>
        </div>
        <div className="hero-card">
          <p>Table QR sample</p>
          <pre className="qr-sample">/table/7</pre>
          <p className="small">Point your phone camera at any table QR to open the menu instantly.</p>
        </div>
      </section>

      <section className="feature-grid">
        <article className="feature-card">
          <h3>Look, order, track</h3>
          <p>Customers browse the full menu, place items in the cart, and watch order progress in real-time.</p>
        </article>
        <article className="feature-card">
          <h3>Kitchen ready</h3>
          <p>The kitchen display updates the moment an order is placed, with live status and table badges.</p>
        </article>
        <article className="feature-card">
          <h3>Cashier desk</h3>
          <p>Bill requests, payments, and table management are visible from one cashier panel.</p>
        </article>
        <article className="feature-card">
          <h3>Manager dashboard</h3>
          <p>Track revenue, top sellers, and table utilization from a single analytics view.</p>
        </article>
      </section>

      <section id="menu-preview" className="menu-preview">
        <header>
          <p className="eyebrow">Menu Preview</p>
          <h2>Campus Cafe favorites</h2>
          <p>Browse the menu as guests would: clear categories, pricing, and quick descriptions.</p>
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
          <h2>Feel the campus cafe vibe</h2>
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
          <h2>Campus Cafe, Main Plaza</h2>
          <p>Open daily from 8:00 AM to 10:00 PM. Fresh coffee, easy ordering, and a quiet place to focus.</p>
          <ul>
            <li>123 University Ave, Campus Center</li>
            <li>Phone: (555) 010-2024</li>
            <li>Email: info@campuscafe.example</li>
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
