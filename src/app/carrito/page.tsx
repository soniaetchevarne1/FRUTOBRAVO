"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useStore } from '@/context/StoreContext';
import Link from 'next/link';

export default function CarritoPage() {
    const { cart, cartTotal, isWholesale, updateQuantity, removeFromCart } = useStore();

    if (cart.length === 0) {
        return (
            <>
                <Navbar />
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem 1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem' }}>🛒</div>
                    <h2 style={{ fontWeight: 800, marginBottom: '1rem' }}>TU CARRITO ESTÁ VACÍO</h2>
                    <Link href="/tienda" style={{
                        display: 'inline-block',
                        padding: '1rem 2rem',
                        background: '#D4AF37',
                        color: 'white',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        fontWeight: 800
                    }}>
                        IR A LA TIENDA
                    </Link>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                padding: '2rem 1rem 150px',
                background: '#f8f9fa',
                minHeight: '100vh'
            }}>

                <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: 900,
                    textAlign: 'center',
                    marginBottom: '2rem',
                    color: '#333'
                }}>
                    MI CARRITO 🛒
                </h1>

                {/* PRODUCTOS */}
                <div style={{ background: 'white', borderRadius: '15px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#2c5e50' }}>
                        RESUMEN DE COMPRA
                    </h2>
                    {cart.map((item) => (
                        <div key={item.id} style={{
                            display: 'flex',
                            gap: '1rem',
                            padding: '1rem 0',
                            borderBottom: '1px solid #eee',
                            position: 'relative'
                        }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: '#f5f5f5',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'
                            }}>
                                {item.image ? (
                                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontSize: '1.5rem' }}>🥜</span>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem', paddingRight: '30px' }}>
                                    {item.name}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', background: '#f0f0f0', padding: '4px 10px', borderRadius: '8px' }}>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            style={{
                                                border: 'none',
                                                background: 'none',
                                                fontSize: '1.2rem',
                                                fontWeight: 800,
                                                cursor: 'pointer',
                                                padding: '0 5px'
                                            }}
                                        >
                                            -
                                        </button>
                                        <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            style={{
                                                border: 'none',
                                                background: 'none',
                                                fontSize: '1.2rem',
                                                fontWeight: 800,
                                                cursor: 'pointer',
                                                padding: '0 5px'
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span style={{ fontWeight: 800, color: '#2c5e50', fontSize: '1rem' }}>
                                        ${new Intl.NumberFormat('es-AR').format((isWholesale ? item.priceWholesale : item.priceRetail) * item.quantity)}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '0',
                                    border: 'none',
                                    background: 'none',
                                    color: '#ff4444',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    fontWeight: 700
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <div style={{
                        marginTop: '1.5rem',
                        paddingTop: '1rem',
                        borderTop: '2px dashed #ddd',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontWeight: 800,
                        fontSize: '1.2rem'
                    }}>
                        <span>SUBTOTAL:</span>
                        <span style={{ color: '#2c5e50' }}>${new Intl.NumberFormat('es-AR').format(cartTotal)}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem', textAlign: 'center' }}>
                        * El costo de envío se calcula en el siguiente paso
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    marginTop: '2rem'
                }}>
                    <Link href="/tienda" style={{
                        color: '#2c5e50',
                        textDecoration: 'none',
                        fontWeight: 700,
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        ← CONTINUAR COMPRANDO
                    </Link>

                    <Link
                        href="/checkout"
                        style={{
                            display: 'inline-block',
                            width: '80%', // Shorter
                            maxWidth: '300px',
                            padding: '1rem',
                            background: '#D4AF37',
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '1.1rem',
                            fontWeight: 900,
                            textAlign: 'center',
                            textDecoration: 'none',
                            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                        }}
                    >
                        FINALIZAR PEDIDO 🚀
                    </Link>
                </div>

            </div>

            <Footer />
        </>
    );
}
