"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useStore } from '@/context/StoreContext';
import styles from './pedido.module.css';
import Link from 'next/link';
import { createOrderAction } from '@/app/actions';
import { Trash2, Plus, Minus, ShoppingBag, Truck, CreditCard, User, ChevronLeft, ArrowRight } from 'lucide-react';

export default function MobileCartPage() {
    const { cart, cartTotal, isWholesale, clearCart, updateQuantity, removeFromCart } = useStore();
    const [step, setStep] = useState(1); // 1: Resumen, 2: Datos

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dni: '',
        address: '',
        city: '',
        province: '',
        zip: '',
    });

    const [deliveryMethod, setDeliveryMethod] = useState<'envio' | 'retiro'>('envio');
    const [paymentMethod, setPaymentMethod] = useState<'transferencia' | 'efectivo'>('transferencia');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const shippingCost = deliveryMethod === 'envio' ? (cartTotal > 50000 ? 0 : 3500) : 0;
    const discountAmount = paymentMethod === 'efectivo' ? cartTotal * 0.10 : 0;
    const finalTotal = cartTotal + shippingCost - discountAmount;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (isSuccess) {
        return (
            <>
                <Navbar />
                <div className={styles.container} style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                    <div style={{ width: '80px', height: '80px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'white' }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <h1 style={{ fontWeight: 900, marginBottom: '1rem' }}>¡PEDIDO ENVIADO!</h1>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>Nos pondremos en contacto contigo pronto.</p>
                    <Link href="/tienda" className={styles.submitBtn}>VOLVER A LA TIENDA</Link>
                </div>
                <Footer />
            </>
        );
    }

    if (cart.length === 0) {
        return (
            <>
                <Navbar />
                <div className={styles.container} style={{ textAlign: 'center', padding: '5rem 1rem' }}>
                    <ShoppingBag size={64} style={{ color: '#ccc', marginBottom: '1.5rem' }} />
                    <h2 style={{ fontWeight: 800 }}>TU CARRITO ESTÁ VACÍO</h2>
                    <Link href="/tienda" className={styles.submitBtn} style={{ marginTop: '2rem' }}>IR A LA TIENDA</Link>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className={styles.container}>

                {/* INDICADOR DE PASOS */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        background: step === 1 ? 'var(--primary)' : '#eee',
                        color: step === 1 ? 'white' : '#666',
                        fontSize: '0.8rem',
                        fontWeight: 700
                    }}>1. Resumen</div>
                    <div style={{
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        background: step === 2 ? 'var(--primary)' : '#eee',
                        color: step === 2 ? 'white' : '#666',
                        fontSize: '0.8rem',
                        fontWeight: 700
                    }}>2. Mis Datos</div>
                </div>

                {step === 1 ? (
                    /* PASO 1: RESUMEN DE COMPRA */
                    <div className="fade-in">
                        <h1 className={styles.mainTitle}>TU COMPRA 🛒</h1>
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}><ShoppingBag size={20} /> Artículos Seleccionados</h2>
                            <div className={styles.itemList}>
                                {cart.map((item) => (
                                    <div key={item.id} className={styles.item}>
                                        <div className={styles.itemImage}>
                                            {item.image ? <img src={item.image} alt={item.name} /> : <span>🌰</span>}
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <h3>{item.name}</h3>
                                            <div className={styles.itemControls}>
                                                <div className={styles.quantityPicker}>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                                                </div>
                                                <span className={styles.itemPrice}>
                                                    ${new Intl.NumberFormat('es-AR').format((isWholesale ? item.priceWholesale : item.priceRetail) * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                        <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.subtotalRow}>
                                <span>Subtotal:</span>
                                <span>${new Intl.NumberFormat('es-AR').format(cartTotal)}</span>
                            </div>
                        </div>

                        <button
                            className={styles.submitBtn}
                            onClick={() => { setStep(2); window.scrollTo(0, 0); }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            CONFIRMAR Y CONTINUAR <ArrowRight size={20} />
                        </button>
                    </div>
                ) : (
                    /* PASO 2: CARGA DE DATOS */
                    <div className="fade-in">
                        <button
                            onClick={() => { setStep(1); window.scrollTo(0, 0); }}
                            style={{ background: 'none', border: 'none', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '1.5rem', cursor: 'pointer' }}
                        >
                            <ChevronLeft size={20} /> VOLVER AL CARRITO
                        </button>

                        <h1 className={styles.mainTitle}>DATOS DE ENVÍO 🚚</h1>

                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}><User size={20} /> Información Personal</h2>
                            <div className={styles.grid}>
                                <div className={styles.inputGroup}>
                                    <label>Nombre *</label>
                                    <input required name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Tu nombre" />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Apellido *</label>
                                    <input required name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Tu apellido" />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>WhatsApp *</label>
                                <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Ej: 11 1234 5678" />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Email *</label>
                                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="tu@email.com" />
                            </div>
                        </div>

                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}><Truck size={20} /> Método de Entrega</h2>
                            <div className={styles.radioGroup}>
                                <label className={`${styles.radioCard} ${deliveryMethod === 'envio' ? styles.active : ''}`}>
                                    <input type="radio" checked={deliveryMethod === 'envio'} onChange={() => setDeliveryMethod('envio')} />
                                    <div className={styles.radioContent}>
                                        <strong>Envío a Domicilio</strong>
                                        <span>{cartTotal > 50000 ? 'GRATIS' : '$3.500'}</span>
                                    </div>
                                </label>
                                <label className={`${styles.radioCard} ${deliveryMethod === 'retiro' ? styles.active : ''}`}>
                                    <input type="radio" checked={deliveryMethod === 'retiro'} onChange={() => setDeliveryMethod('retiro')} />
                                    <div className={styles.radioContent}>
                                        <strong>Retiro en Local</strong>
                                        <span>GRATIS</span>
                                    </div>
                                </label>
                            </div>

                            {deliveryMethod === 'envio' && (
                                <div className={styles.addressFields}>
                                    <div className={styles.inputGroup}>
                                        <label>Calle y Número *</label>
                                        <input required name="address" value={formData.address} onChange={handleInputChange} placeholder="Ej. Calle 123" />
                                    </div>
                                    <div className={styles.grid}>
                                        <div className={styles.inputGroup}>
                                            <label>Ciudad *</label>
                                            <input required name="city" value={formData.city} onChange={handleInputChange} placeholder="Tu ciudad" />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>CP *</label>
                                            <input required name="zip" value={formData.zip} onChange={handleInputChange} placeholder="CP" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}><CreditCard size={20} /> Pago</h2>
                            <div className={styles.radioGroup}>
                                <label className={`${styles.radioCard} ${paymentMethod === 'transferencia' ? styles.active : ''}`}>
                                    <input type="radio" checked={paymentMethod === 'transferencia'} onChange={() => setPaymentMethod('transferencia')} />
                                    <div className={styles.radioContent}>
                                        <strong>Transferencia</strong>
                                        <span>Lista</span>
                                    </div>
                                </label>
                                <label className={`${styles.radioCard} ${paymentMethod === 'efectivo' ? styles.active : ''}`}>
                                    <input type="radio" checked={paymentMethod === 'efectivo'} onChange={() => setPaymentMethod('efectivo')} />
                                    <div className={styles.radioContent}>
                                        <strong>Efectivo</strong>
                                        <span style={{ color: '#22c55e' }}>10% OFF</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className={styles.totalCard}>
                            <div className={styles.totalRow}><span>Subtotal</span><span>${new Intl.NumberFormat('es-AR').format(cartTotal)}</span></div>
                            <div className={styles.totalRow}><span>Envío</span><span>{shippingCost === 0 ? 'GRATIS' : `$${new Intl.NumberFormat('es-AR').format(shippingCost)}`}</span></div>
                            {discountAmount > 0 && <div className={styles.totalRow} style={{ color: '#22c55e' }}><span>Efectivo -10%</span><span>-${new Intl.NumberFormat('es-AR').format(discountAmount)}</span></div>}
                            <div className={styles.finalTotal}><span>TOTAL</span><span>${new Intl.NumberFormat('es-AR').format(finalTotal)}</span></div>

                            <button
                                type="button"
                                disabled={isLoading}
                                className={styles.submitBtn}
                                onClick={async () => {
                                    if (!formData.firstName || !formData.phone || !formData.email) {
                                        alert("Por favor completa los campos obligatorios");
                                        return;
                                    }
                                    setIsLoading(true);
                                    try {
                                        const newOrder = {
                                            id: crypto.randomUUID(),
                                            customer: { ...formData },
                                            deliveryMethod,
                                            paymentMethod,
                                            date: new Date().toISOString(),
                                            items: cart.map(item => ({
                                                productId: item.id,
                                                productName: item.name,
                                                quantity: item.quantity,
                                                price: isWholesale ? item.priceWholesale : item.priceRetail,
                                                image: item.image
                                            })),
                                            subtotal: cartTotal,
                                            shippingCost,
                                            discount: discountAmount,
                                            total: finalTotal,
                                            status: 'Pendiente' as const,
                                            type: isWholesale ? 'Mayorista' as const : 'Minorista' as const,
                                        };
                                        await createOrderAction(newOrder);
                                        alert("¡PEDIDO REALIZADO! Gracias.");
                                        clearCart();
                                        window.location.href = '/tienda';
                                    } catch (e) {
                                        alert("Error al enviar pedido.");
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }}
                            >
                                {isLoading ? 'CARGANDO...' : 'CONFIRMAR PEDIDO 🚀'}
                            </button>
                        </div>
                    </div>
                )}

            </div>
            <Footer />
        </>
    );
}
