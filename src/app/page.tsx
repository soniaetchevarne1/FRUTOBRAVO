"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import Link from 'next/link';
import { Leaf, Truck, Tag, ChevronLeft, ChevronRight, Zap, Shield, Heart, Star, Sparkles } from 'lucide-react';
import styles from './page.module.css';

const HERO_IMAGES = [
  '/placeholder/nuez-brava-hero.png',
  '/placeholder/nuez-brava-power.png',
  '/placeholder/nuez-brava-fitness.png',
  '/placeholder/nuez-brava-adventure.png'
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
  const prevSlide = () => setCurrentImage((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);

  return (
    <>
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className={styles.hero}>

          {/* Comic Speech Bubble */}
          <div className={styles.speechBubble}>
            <div className={styles.bubbleContent}>
              <Sparkles size={20} className={styles.sparkleIcon} />
              <span>¡Sé BRAVO! 💪</span>
            </div>
          </div>

          {/* Floating Energy Icons */}
          <div className={styles.floatingIcons}>
            <Zap className={styles.floatingIcon} style={{ animationDelay: '0s' }} />
            <Star className={styles.floatingIcon} style={{ animationDelay: '1s' }} />
            <Heart className={styles.floatingIcon} style={{ animationDelay: '2s' }} />
          </div>

          {/* Background Images Layer */}
          <div className={styles.heroBackground}>
            {HERO_IMAGES.map((img, index) => (
              <div
                key={img}
                className={`${styles.heroSlide} ${index === currentImage ? styles.activeSlide : ''}`}
                style={{ backgroundImage: `url(${img})` }}
              />
            ))}
            <div className={styles.heroOverlay} />
          </div>

          <div className="container" style={{ position: 'relative', zIndex: 10 }}>
            <div className={styles.heroContent}>
              <div className={styles.heroTitle}>
                <h1 className="h1" style={{ fontSize: '4rem', marginBottom: '1rem', color: 'white', textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 40px rgba(242, 102, 34, 0.3)', lineHeight: '1.1' }}>
                  ¡Nutrición <span className={styles.braveText}>BRAVO</span>!
                </h1>
                <div className={styles.subtitle}>
                  <span className={styles.badge}>🔥 100% Natural</span>
                  <span className={styles.badge}>⚡ Energía Pura</span>
                </div>
              </div>
              <p className="body-lg" style={{ fontSize: '1.3rem', marginBottom: '2.5rem', maxWidth: '700px', color: 'rgba(255,255,255,0.95)', fontWeight: 600, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                Descubrí nuestra selección <strong style={{ color: 'var(--secondary)' }}>premium</strong> de frutos secos, especias, harinas y suplementos.
                <span className={styles.highlight}> ¡Venta minorista y mayorista con envíos a todo el país!</span>
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Link href="/tienda" className={`btn btn-primary ${styles.btnPulse}`} style={{ padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  🛒 Comprar Ahora
                </Link>
                <Link href="/mayorista" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', background: 'white', color: 'var(--primary)', border: 'none', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  💼 Soy Mayorista
                </Link>
              </div>
            </div>
          </div>

          {/* Slider Controls */}
          <button onClick={prevSlide} className={styles.sliderBtnLeft}><ChevronLeft /></button>
          <button onClick={nextSlide} className={styles.sliderBtnRight}><ChevronRight /></button>
        </section>

        {/* Featured Products */}
        <section className="section" style={{ background: 'white' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <h2 className="h2" style={{ fontSize: '2.5rem' }}>
                ⭐ <span style={{ color: 'var(--primary)' }}>Favoritos</span> del Equipo
              </h2>
              <Link href="/tienda" className="btn-text" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem' }}>
                VER TODA LA TIENDA →
              </Link>
            </div>

            <div className="grid-cols-4">
              {[
                { name: 'Almendras Premium', price: '$12.000', img: '/products/almendras.png', badge: '🔥 TOP' },
                { name: 'Nueces Mariposa', price: '$10.500', img: '/placeholder/nueces.jpg', badge: '⚡ NUEVO' },
                { name: 'Mix Energético', price: '$5.500', img: '/products/mix-energetico.png', badge: '💪 POWER' },
                { name: 'Castañas de Cajú', price: '$14.000', img: '/products/castanas.png', badge: '👑 PREMIUM' }
              ].map((prod, i) => (
                <div key={i} className={`card ${styles.productCard}`} style={{ overflow: 'hidden', border: '2px solid #eee', position: 'relative' }}>
                  <div className={styles.productBadge}>{prod.badge}</div>
                  <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                    <img src={prod.img} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} className={styles.productImage} />
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{prod.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem', fontWeight: 600 }}>✨ Cosecha Seleccionada</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 900, fontSize: '1.4rem', color: 'var(--primary)' }}>{prod.price}</span>
                      <Link href="/tienda" className={styles.addBtnBrave} style={{ textDecoration: 'none' }}>
                        <span>+</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Power-Up Value Props */}
        <section className="section" style={{ background: 'linear-gradient(135deg, #fdfdfb 0%, #fff5e6 100%)', borderTop: '3px solid var(--secondary)' }}>
          <div className="container">
            <h2 className="h2" style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>
              ⚡ <span style={{ color: 'var(--primary)' }}>Súper Poderes</span> Fruto Bravo
            </h2>
            <div className={`grid-cols-3 ${styles.propsGrid}`}>
              <div className={`${styles.propCard} ${styles.powerCard}`}>
                <div className={styles.propIconBrave} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  <Leaf size={36} />
                </div>
                <h3 className="h3" style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>🌿 100% Natural</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Productos seleccionados sin conservantes ni aditivos. ¡Pura naturaleza!</p>
                <div className={styles.powerBadge}>PODER VERDE</div>
              </div>
              <div className={`${styles.propCard} ${styles.powerCard}`}>
                <div className={styles.propIconBrave} style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                  <Tag size={36} />
                </div>
                <h3 className="h3" style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>💰 Precios Mayoristas</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Accedé a descuentos exclusivos comprando en cantidad. ¡Ahorrá en grande!</p>
                <div className={styles.powerBadge}>PODER DORADO</div>
              </div>
              <div className={`${styles.propCard} ${styles.powerCard}`}>
                <div className={styles.propIconBrave} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                  <Truck size={36} />
                </div>
                <h3 className="h3" style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>🚀 Envíos Rápidos</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Recibí tu pedido en la puerta de tu casa o negocio. ¡Velocidad máxima!</p>
                <div className={styles.powerBadge}>PODER AZUL</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className={styles.ctaBanner}>
          <div className="container">
            <div className={styles.ctaContent}>
              <div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'white' }}>
                  ¿Listo para ser <span style={{ color: 'var(--secondary)', textShadow: '0 0 20px rgba(212, 175, 55, 0.5)' }}>BRAVO</span>?
                </h2>
                <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', marginBottom: '0' }}>
                  Únete a miles de clientes que ya disfrutan de nuestros productos premium
                </p>
              </div>
              <Link href="/tienda" className={`btn btn-primary ${styles.ctaBtn}`}>
                <Zap size={24} />
                ¡Empezar Ahora!
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
