"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, MessageCircle, Clock } from 'lucide-react';

export default function ContactoPage() {
    return (
        <>
            <Navbar />

            {/* Hero Section */}
            <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)', color: 'white', padding: '4rem 0' }}>
                <div className="container">
                    <h1 className="h1" style={{ marginBottom: '1rem', fontSize: '3rem' }}>Contactanos</h1>
                    <p className="body-lg" style={{ maxWidth: '600px', opacity: 0.95 }}>
                        Estamos para ayudarte. Comunicate con nosotros por cualquiera de estos medios.
                    </p>
                </div>
            </div>

            <div className="container section">
                <div className="grid-cols-2" style={{ gap: '2rem' }}>

                    {/* Contact Info Cards */}
                    <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'var(--surface-alt)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--primary)',
                            flexShrink: 0
                        }}>
                            <Phone size={28} />
                        </div>
                        <div>
                            <h3 className="h3" style={{ marginBottom: '0.5rem' }}>Teléfono / WhatsApp</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                Llamanos o escribinos por WhatsApp
                            </p>
                            <a href="https://wa.me/5493416091224" style={{
                                color: 'var(--primary)',
                                fontWeight: 700,
                                fontSize: '1.2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <MessageCircle size={20} />
                                3416091224
                            </a>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'var(--surface-alt)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--primary)',
                            flexShrink: 0
                        }}>
                            <Mail size={28} />
                        </div>
                        <div>
                            <h3 className="h3" style={{ marginBottom: '0.5rem' }}>Email</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                Envianos tu consulta por correo
                            </p>
                            <a href="mailto:frutosbravos@gmail.com" style={{
                                color: 'var(--primary)',
                                fontWeight: 700,
                                fontSize: '1.2rem'
                            }}>
                                frutosbravos@gmail.com
                            </a>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'var(--surface-alt)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--primary)',
                            flexShrink: 0
                        }}>
                            <MapPin size={28} />
                        </div>
                        <div>
                            <h3 className="h3" style={{ marginBottom: '0.5rem' }}>Ubicación</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                Nos encontramos en
                            </p>
                            <p style={{
                                color: 'var(--primary)',
                                fontWeight: 700,
                                fontSize: '1.2rem'
                            }}>
                                Rosario, Santa Fe<br />Argentina 🇦🇷
                            </p>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'var(--surface-alt)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--primary)',
                            flexShrink: 0
                        }}>
                            <Clock size={28} />
                        </div>
                        <div>
                            <h3 className="h3" style={{ marginBottom: '0.5rem' }}>Horarios de Atención</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                Lunes a Viernes
                            </p>
                            <p style={{
                                color: 'var(--primary)',
                                fontWeight: 700,
                                fontSize: '1.2rem'
                            }}>
                                9:00 - 18:00 hs
                            </p>
                        </div>
                    </div>

                </div>

                {/* CTA Section */}
                <div style={{
                    marginTop: '4rem',
                    background: 'var(--surface-alt)',
                    padding: '3rem',
                    borderRadius: 'var(--radius)',
                    textAlign: 'center'
                }}>
                    <h2 className="h2" style={{ marginBottom: '1rem' }}>¿Preferís escribirnos directamente?</h2>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Hacé click en el botón para abrir WhatsApp y enviarnos tu consulta al instante.
                    </p>
                    <a
                        href="https://wa.me/5493416091224?text=Hola!%20Quiero%20hacer%20una%20consulta%20sobre%20Frutos%20Bravos"
                        className="btn btn-primary"
                        style={{
                            padding: '1.2rem 2.5rem',
                            fontSize: '1.2rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}
                    >
                        <MessageCircle size={24} />
                        Abrir WhatsApp
                    </a>
                </div>
            </div>

            <Footer />
        </>
    );
}
