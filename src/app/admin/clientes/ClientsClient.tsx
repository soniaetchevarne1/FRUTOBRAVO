"use client";

import { useState } from 'react';
import { Search, User, Phone, Mail, ShoppingBag, DollarSign } from 'lucide-react';
import styles from '../admin.module.css';

interface CustomerSummary {
    email: string;
    name: string;
    phone: string;
    totalSpent: number;
    orderCount: number;
    lastOrderDate: string;
}

export default function ClientsClient({ initialCustomers }: { initialCustomers: any[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCustomers = initialCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    );

    return (
        <div>
            <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '15px',
                marginBottom: '2rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
            }}>
                <Search size={20} color="#666" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, email o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        fontSize: '1rem',
                        fontFamily: 'inherit'
                    }}
                />
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem'
            }}>
                {filteredCustomers.map((customer) => (
                    <div key={customer.email} style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '15px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        border: '1px solid #f0f0f0',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                background: 'rgba(242, 102, 34, 0.1)',
                                color: 'var(--primary)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <User size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{customer.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.85rem' }}>
                                    <Mail size={14} />
                                    {customer.email}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                            <div style={{
                                background: '#f9f9f9',
                                padding: '0.75rem',
                                borderRadius: '10px',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Pedidos</div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 900, color: 'var(--primary)' }}>
                                    <ShoppingBag size={14} />
                                    {customer.orderCount}
                                </div>
                            </div>
                            <div style={{
                                background: '#f9f9f9',
                                padding: '0.75rem',
                                borderRadius: '10px',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Total Gastado</div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', fontWeight: 900, color: '#10B981' }}>
                                    <DollarSign size={14} />
                                    {new Intl.NumberFormat('es-AR').format(customer.totalSpent)}
                                </div>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#444', fontSize: '0.9rem' }}>
                                <Phone size={16} color="var(--primary)" />
                                <strong>{customer.phone}</strong>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#999', textAlign: 'right', marginTop: '0.25rem' }}>
                                Última compra: {new Date(customer.lastOrderDate).toLocaleDateString('es-AR')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCustomers.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'white', borderRadius: '15px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                    <h3 style={{ color: '#666' }}>No se encontraron clientes</h3>
                    <p style={{ color: '#999' }}>Prueba con otros términos de búsqueda.</p>
                </div>
            )}
        </div>
    );
}
