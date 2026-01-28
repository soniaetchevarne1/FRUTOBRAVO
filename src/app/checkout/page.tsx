"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useStore } from '@/context/StoreContext';
import Link from 'next/link';
import { createOrderAction } from '@/app/actions';
import { ChevronLeft } from 'lucide-react';

export default function CheckoutPage() {
    const { cart, cartTotal, isWholesale, clearCart } = useStore();

    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [direccion, setDireccion] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [cp, setCp] = useState('');
    const [envio, setEnvio] = useState<'envio' | 'retiro'>('envio');
    const [pago, setPago] = useState<'transferencia' | 'efectivo' | 'tarjeta'>('transferencia');
    const [enviando, setEnviando] = useState(false);

    const costoEnvio = envio === 'envio' ? (cartTotal > 50000 ? 0 : 3500) : 0;
    const descuento = pago === 'efectivo' ? cartTotal * 0.10 : 0;
    const total = cartTotal + costoEnvio - descuento;

    const enviarPedido = async () => {
        if (!nombre || !telefono || !email) {
            alert('Por favor completa Nombre, Teléfono y Email');
            return;
        }
        if (envio === 'envio' && !direccion) {
            alert('Por favor completa la dirección de envío');
            return;
        }

        setEnviando(true);

        try {
            const pedido = {
                id: 'PED-' + Date.now(),
                customer: {
                    firstName: nombre,
                    lastName: '',
                    email: email,
                    phone: telefono,
                    dni: '',
                    address: direccion,
                    city: ciudad,
                    zip: cp
                },
                deliveryMethod: envio,
                paymentMethod: pago,
                date: new Date().toISOString(),
                items: cart.map(item => ({
                    productId: item.id,
                    productName: item.name,
                    quantity: item.quantity,
                    price: isWholesale ? item.priceWholesale : item.priceRetail,
                })),
                subtotal: cartTotal,
                shippingCost: costoEnvio,
                discount: descuento,
                total: total,
                status: 'Pendiente' as const,
                type: isWholesale ? 'Mayorista' as const : 'Minorista' as const,
            };

            await createOrderAction(pedido);
            alert('¡PEDIDO ENVIADO CON ÉXITO! Nos comunicaremos pronto por WhatsApp.');
            clearCart();
            window.location.href = '/tienda';
        } catch (error) {
            alert('Error al enviar el pedido. Por favor intenta nuevamente.');
        } finally {
            setEnviando(false);
        }
    };

    if (cart.length === 0) {
        return (
            <>
                <Navbar />
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem 1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem' }}>📦</div>
                    <h2 style={{ fontWeight: 800, marginBottom: '1rem' }}>NO HAY PRODUCTOS EN EL CARRITO</h2>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>Agrega productos antes de finalizar tu pedido.</p>
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

                <Link
                    href="/carrito"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#2c5e50',
                        textDecoration: 'none',
                        fontWeight: 700,
                        marginBottom: '1.5rem'
                    }}
                >
                    <ChevronLeft size={20} /> Volver al Carrito
                </Link>

                <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: 900,
                    textAlign: 'center',
                    marginBottom: '2rem',
                    color: '#333'
                }}>
                    DATOS DE ENVÍO
                </h1>

                {/* DATOS PERSONALES */}
                <div style={{ background: 'white', borderRadius: '15px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', color: '#2c5e50' }}>
                        TUS DATOS
                    </h2>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#555', textTransform: 'uppercase' }}>
                            Nombre Completo *
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Juan Perez"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                border: '2px solid #ddd',
                                borderRadius: '10px',
                                fontSize: '1rem',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#555', textTransform: 'uppercase' }}>
                            WhatsApp / Teléfono *
                        </label>
                        <input
                            type="tel"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            placeholder="Ej: 11 1234 5678"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                border: '2px solid #ddd',
                                borderRadius: '10px',
                                fontSize: '1rem',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '0' }}>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#555', textTransform: 'uppercase' }}>
                            Email *
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                border: '2px solid #ddd',
                                borderRadius: '10px',
                                fontSize: '1rem',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>
                </div>

                {/* MÉTODO DE ENTREGA */}
                <div style={{ background: 'white', borderRadius: '15px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#2c5e50' }}>
                        ENTREGA
                    </h2>

                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        border: envio === 'envio' ? '2px solid #2c5e50' : '2px solid #eee',
                        borderRadius: '10px',
                        marginBottom: '0.75rem',
                        background: envio === 'envio' ? 'rgba(44,94,80,0.05)' : 'white',
                        cursor: 'pointer'
                    }}>
                        <input
                            type="radio"
                            checked={envio === 'envio'}
                            onChange={() => setEnvio('envio')}
                            style={{ width: '20px', height: '20px', accentColor: '#2c5e50' }}
                        />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Envío a Domicilio</div>
                            <div style={{ fontSize: '0.85rem', color: '#666' }}>{cartTotal > 50000 ? 'GRATIS' : '$3.500'}</div>
                        </div>
                    </label>

                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        border: envio === 'retiro' ? '2px solid #2c5e50' : '2px solid #eee',
                        borderRadius: '10px',
                        background: envio === 'retiro' ? 'rgba(44,94,80,0.05)' : 'white',
                        cursor: 'pointer'
                    }}>
                        <input
                            type="radio"
                            checked={envio === 'retiro'}
                            onChange={() => setEnvio('retiro')}
                            style={{ width: '20px', height: '20px', accentColor: '#2c5e50' }}
                        />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Retiro en Local</div>
                            <div style={{ fontSize: '0.85rem', color: '#22c55e', fontWeight: 700 }}>GRATIS</div>
                        </div>
                    </label>

                    {envio === 'envio' && (
                        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#555', textTransform: 'uppercase' }}>
                                    Dirección *
                                </label>
                                <input
                                    type="text"
                                    value={direccion}
                                    onChange={(e) => setDireccion(e.target.value)}
                                    placeholder="Calle y Número"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        border: '2px solid #ddd',
                                        borderRadius: '10px',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#555', textTransform: 'uppercase' }}>
                                        Ciudad
                                    </label>
                                    <input
                                        type="text"
                                        value={ciudad}
                                        onChange={(e) => setCiudad(e.target.value)}
                                        placeholder="Tu ciudad"
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            border: '2px solid #ddd',
                                            borderRadius: '10px',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#555', textTransform: 'uppercase' }}>
                                        CP
                                    </label>
                                    <input
                                        type="text"
                                        value={cp}
                                        onChange={(e) => setCp(e.target.value)}
                                        placeholder="Código postal"
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            border: '2px solid #ddd',
                                            borderRadius: '10px',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* FORMA DE PAGO */}
                <div style={{ background: 'white', borderRadius: '15px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#2c5e50' }}>
                        FORMA DE PAGO
                    </h2>

                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        border: pago === 'transferencia' ? '2px solid #2c5e50' : '2px solid #eee',
                        borderRadius: '10px',
                        marginBottom: '0.75rem',
                        background: pago === 'transferencia' ? 'rgba(44,94,80,0.05)' : 'white',
                        cursor: 'pointer'
                    }}>
                        <input
                            type="radio"
                            checked={pago === 'transferencia'}
                            onChange={() => setPago('transferencia')}
                            style={{ width: '20px', height: '20px', accentColor: '#2c5e50' }}
                        />
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Transferencia Bancaria</span>
                    </label>

                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        border: pago === 'efectivo' ? '2px solid #2c5e50' : '2px solid #eee',
                        borderRadius: '10px',
                        background: pago === 'efectivo' ? 'rgba(44,94,80,0.05)' : 'white',
                        cursor: 'pointer'
                    }}>
                        <input
                            type="radio"
                            checked={pago === 'efectivo'}
                            onChange={() => setPago('efectivo')}
                            style={{ width: '20px', height: '20px', accentColor: '#2c5e50' }}
                        />
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Efectivo (contra entrega)</div>
                            <div style={{ fontSize: '0.85rem', color: '#22c55e', fontWeight: 800 }}>✓ 10% DE DESCUENTO</div>
                        </div>
                    </label>
                </div>

                {/* TOTAL */}
                <div style={{ background: '#222', color: 'white', borderRadius: '15px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.95rem' }}>
                        <span>Subtotal:</span>
                        <span>${new Intl.NumberFormat('es-AR').format(cartTotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', opacity: 0.8, fontSize: '0.95rem' }}>
                        <span>Envío:</span>
                        <span>{costoEnvio === 0 ? 'GRATIS' : `$${new Intl.NumberFormat('es-AR').format(costoEnvio)}`}</span>
                    </div>
                    {descuento > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#22c55e', fontSize: '0.95rem' }}>
                            <span>Descuento efectivo:</span>
                            <span>-${new Intl.NumberFormat('es-AR').format(descuento)}</span>
                        </div>
                    )}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        color: '#D4AF37'
                    }}>
                        <span>TOTAL:</span>
                        <span>${new Intl.NumberFormat('es-AR').format(total)}</span>
                    </div>
                </div>

            </div>

            {/* BOTÓN FIJO ABAJO */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'white',
                padding: '1rem',
                boxShadow: '0 -10px 30px rgba(0,0,0,0.15)',
                zIndex: 1000
            }}>
                <button
                    onClick={enviarPedido}
                    disabled={enviando}
                    style={{
                        width: '100%',
                        padding: '1.2rem',
                        background: enviando ? '#ccc' : '#D4AF37',
                        color: 'white',
                        border: 'none',
                        borderRadius: '15px',
                        fontSize: '1.2rem',
                        fontWeight: 900,
                        cursor: enviando ? 'not-allowed' : 'pointer',
                        boxShadow: '0 5px 20px rgba(212, 175, 55, 0.4)'
                    }}
                >
                    {enviando ? 'ENVIANDO...' : 'CONFIRMAR PEDIDO 🚀'}
                </button>
            </div>

            <Footer />
        </>
    );
}
