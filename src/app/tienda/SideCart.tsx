"use client";

import { useStore } from "@/context/StoreContext";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import styles from "./page.module.css";
import Link from 'next/link';

export default function SideCart({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { cart, removeFromCart, updateQuantity, cartTotal, isWholesale } = useStore();

    if (!isOpen) return null;

    return (
        <>
            <div className={styles.sideCartContainer}>
                {/* Fondo Decorativo Sutil */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: "url('/background-pattern.png')",
                    backgroundSize: '200px',
                    opacity: 0.05,
                    pointerEvents: 'none',
                    zIndex: -1
                }} />

                {/* Header */}
                <div style={{
                    padding: '1.25rem 1rem',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--primary)',
                    color: 'white',
                    position: 'relative'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ background: 'white', color: 'var(--primary)', padding: '0.4rem', borderRadius: '10px', display: 'flex' }}>
                            <ShoppingBag size={20} />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase' }}>Resumen de Compra</h2>
                            <p style={{ margin: 0, fontSize: '0.65rem', opacity: 0.9, fontWeight: 600 }}>Tus elegidos</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Cart Items */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem' }}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                            <h3 style={{ color: '#444', fontWeight: 800, fontSize: '1rem' }}>¡Tu bolsa está vacía!</h3>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {cart.map((item) => (
                                <div key={item.id} style={{
                                    display: 'flex',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    background: 'white',
                                    borderRadius: '12px',
                                    border: '1px solid #f0f0f0',
                                    position: 'relative',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{
                                        width: '65px',
                                        height: '65px',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                        border: '1px solid #eee',
                                        backgroundColor: '#f9f9f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ fontSize: '1.5rem' }}>🌰</span>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', fontWeight: 800, paddingRight: '20px', color: '#333' }}>
                                            {item.name}
                                        </h4>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#f5f5f5', borderRadius: '5px', padding: '2px 4px' }}>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        style={{ padding: '2px', display: 'flex', color: '#666', border: 'none', background: 'transparent', cursor: 'pointer' }}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, minWidth: '15px', textAlign: 'center', color: '#333' }}>{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        style={{ padding: '2px', display: 'flex', color: 'var(--primary)', border: 'none', background: 'transparent', cursor: 'pointer' }}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.95rem' }}>
                                                ${new Intl.NumberFormat('es-AR').format((isWholesale ? item.priceWholesale : item.priceRetail) * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            color: '#ff4444',
                                            background: '#fff0f0',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer / Total */}
                <div style={{
                    padding: '1.25rem 1rem',
                    borderTop: '1px solid #f0f0f0',
                    backgroundColor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: '#666' }}>TOTAL:</span>
                        <span style={{ fontWeight: 900, fontSize: '1.4rem', color: 'var(--primary)' }}>
                            ${new Intl.NumberFormat('es-AR').format(cartTotal)}
                        </span>
                    </div>


                    {cart.length > 0 && (
                        <Link href="/checkout" style={{ width: '100%' }}>
                            <button
                                onClick={onClose}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    backgroundColor: '#D4AF37',
                                    color: 'white',
                                    borderRadius: '12px',
                                    border: 'none',
                                    fontWeight: 900,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer'
                                }}
                            >
                                ENVIAR PEDIDO 🚀
                            </button>
                        </Link>
                    )}

                    {/* Mas dibujos alegres */}
                    <div style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px', filter: 'grayscale(0.3)' }}>
                        🌰😊🥜✨🥜😊🌰
                    </div>
                </div>
            </div>
        </>
    );
}
