import { products } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AddToCartClient from './AddToCart';

export async function generateStaticParams() {
    return products.map((product) => ({
        slug: product.slug,
    }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const product = products.find((p) => p.slug === slug);

    if (!product) {
        return (
            <>
                <Navbar />
                <div className="container section">Producto no encontrado</div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container" style={{ minHeight: '60vh', maxWidth: '750px', paddingTop: '1.5rem', paddingBottom: '4rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem',
                    background: 'rgba(255, 255, 255, 0.92)',
                    padding: '1.5rem',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    backdropFilter: 'blur(10px)'
                }}>
                    {/* Image */}
                    <div style={{ background: '#f9f9f9', height: '300px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', border: '1px solid var(--border)', overflow: 'hidden', position: 'relative' }}>
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        ) : (
                            <span>Imagen de {product.name}</span>
                        )}
                    </div>

                    {/* Details */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}>
                        <div style={{ marginBottom: '0.75rem' }}>
                            <span className="badge badge-new" style={{ background: 'var(--surface-alt)', color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
                                {product.category}
                            </span>
                        </div>

                        <h1 className="h2" style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>{product.name}</h1>

                        {/* Price Rendering */}
                        <div style={{ marginBottom: '1rem' }}>
                            <p className="body-lg" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.5rem' }}>
                                ${new Intl.NumberFormat('es-AR').format(product.priceRetail)}
                                <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-secondary)' }}> / {product.unit}</span>
                            </p>
                        </div>

                        <p style={{ marginBottom: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.9rem' }}>
                            {product.description}
                        </p>

                        <AddToCartClient product={product} />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
