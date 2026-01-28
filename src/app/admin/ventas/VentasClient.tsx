"use client";

import { useState } from 'react';
import { Order } from '@/lib/types';
import { updateOrderStatusAction } from '@/app/actions';
import { Package, ChevronDown, ChevronUp, Clock, CheckCircle, Truck, DollarSign } from 'lucide-react';

export default function VentasClient({ initialOrders }: { initialOrders: Order[] }) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedOrder(expandedOrder === id ? null : id);
    };

    const handleStatusChange = async (id: string, newStatus: Order['status']) => {
        // Optimistic update
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
        await updateOrderStatusAction(id, newStatus);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pendiente': return '#f59e0b'; // Amber
            case 'Pagado': return '#3b82f6'; // Blue
            case 'Enviado': return '#8b5cf6'; // Purple
            case 'Entregado': return '#10b981'; // Green
            default: return '#6b7280';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Pendiente': return <Clock size={16} />;
            case 'Pagado': return <DollarSign size={16} />;
            case 'Enviado': return <Truck size={16} />;
            case 'Entregado': return <CheckCircle size={16} />;
            default: return <Package size={16} />;
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h1 className="h2" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <DollarSign size={28} /> Ventas y Pedidos
            </h1>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: '#f9fafb', borderRadius: '12px' }}>
                    <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>No hay pedidos registrados aún.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {orders.map((order) => (
                        <div key={order.id} style={{
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}>
                            {/* Summary Header */}
                            <div
                                onClick={() => toggleExpand(order.id)}
                                style={{
                                    padding: '1.25rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    background: expandedOrder === order.id ? '#fcfcfc' : 'white',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{
                                        background: getStatusColor(order.status),
                                        color: 'white',
                                        padding: '0.5rem',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {getStatusIcon(order.status)}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                                            {order.customer.firstName} {order.customer.lastName}
                                        </h3>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                            {new Date(order.date).toLocaleString('es-AR')} • {order.items.length} items
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary)' }}>
                                            ${new Intl.NumberFormat('es-AR').format(order.total)}
                                        </div>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            color: getStatusColor(order.status),
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            {order.status}
                                        </div>
                                    </div>
                                    {expandedOrder === order.id ? <ChevronUp size={20} color="#9ca3af" /> : <ChevronDown size={20} color="#9ca3af" />}
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedOrder === order.id && (
                                <div style={{
                                    borderTop: '1px solid #e5e7eb',
                                    padding: '1.5rem',
                                    background: '#f9fafb',
                                    animation: 'fadeIn 0.2s ease'
                                }}>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                        <div>
                                            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Datos del Cliente</h4>
                                            <div style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                                                <p style={{ margin: 0 }}><strong>Email:</strong> {order.customer.email}</p>
                                                <p style={{ margin: 0 }}><strong>Tel:</strong> {order.customer.phone}</p>
                                                <p style={{ margin: 0 }}><strong>DNI:</strong> {order.customer.dni}</p>
                                                <p style={{ margin: 0 }}><strong>Dirección:</strong> {order.customer.address}, {order.customer.city} ({order.customer.zip})</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Detalles de Entrega y Pago</h4>
                                            <div style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                                                <p style={{ margin: 0 }}><strong>Entrega:</strong> {order.deliveryMethod === 'envio' ? 'Envío a domicilio' : 'Retiro en local'}</p>
                                                <p style={{ margin: 0 }}><strong>Pago:</strong> {order.paymentMethod}</p>
                                                <div style={{ marginTop: '1rem' }}>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Cambiar Estado:</label>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        {['Pendiente', 'Pagado', 'Enviado', 'Entregado'].map((status) => (
                                                            <button
                                                                key={status}
                                                                onClick={() => handleStatusChange(order.id, status as Order['status'])}
                                                                style={{
                                                                    padding: '0.25rem 0.75rem',
                                                                    borderRadius: '6px',
                                                                    border: order.status === status ? `2px solid ${getStatusColor(status)}` : '1px solid #d1d5db',
                                                                    background: order.status === status ? getStatusColor(status) : 'white',
                                                                    color: order.status === status ? 'white' : '#374151',
                                                                    fontSize: '0.8rem',
                                                                    fontWeight: 600,
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                {status}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Items del Pedido</h4>
                                        <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} style={{
                                                    padding: '0.75rem 1rem',
                                                    borderBottom: idx === order.items.length - 1 ? 'none' : '1px solid #f3f4f6',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{ width: '40px', height: '40px', background: '#f3f4f6', borderRadius: '6px', overflow: 'hidden' }}>
                                                            {item.image && <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.productName}</div>
                                                            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                                                ${item.price} x {item.quantity} un.
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ fontWeight: 700 }}>
                                                        ${new Intl.NumberFormat('es-AR').format(item.price * item.quantity)}
                                                    </div>
                                                </div>
                                            ))}
                                            <div style={{ padding: '0.75rem 1rem', background: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                                <span>Envío:</span>
                                                <span>${order.shippingCost}</span>
                                            </div>
                                            <div style={{ padding: '0.75rem 1rem', background: '#f9fafb', display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>
                                                <span>Total:</span>
                                                <span>${new Intl.NumberFormat('es-AR').format(order.total)}</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
