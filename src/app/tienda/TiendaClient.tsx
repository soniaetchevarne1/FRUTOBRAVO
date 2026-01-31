"use client";

import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Category, Product } from '@/lib/types';
import { useStore } from '@/context/StoreContext';
import styles from './page.module.css';
import { Filter, Minus, Plus, ShoppingCart, SearchX, X } from 'lucide-react';
import SideCart from './SideCart';
import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES: Category[] = ['Frutos Secos', 'Frutas Desecadas', 'Especias y Condimentos', 'Harinas', 'Semillas y Legumbres', 'Maní', 'Cereales', 'Aceites', 'Arroz', 'Suplementos', 'Otros'];

const WEIGHT_OPTIONS = [
    { value: 1000, label: '1kg', multiplier: 1 },
    { value: 500, label: '500g', multiplier: 0.5 },
    { value: 250, label: '250g', multiplier: 0.25 }
];

// Modal de vista detallada del producto
function ProductModal({ product, isOpen, onClose, onAdd }: {
    product: Product,
    isOpen: boolean,
    onClose: () => void,
    onAdd: () => void
}) {
    const { addToCart, isWholesale } = useStore();
    const [selectedWeight, setSelectedWeight] = useState(WEIGHT_OPTIONS[0]);
    const [quantity, setQuantity] = useState(1);
    const [showToast, setShowToast] = useState(false);

    const isOutOfStock = product.stock === 0;
    const basePrice = isWholesale ? product.priceWholesale : product.priceRetail;
    const adjustedPrice = basePrice * selectedWeight.multiplier;
    const totalPrice = adjustedPrice * quantity;

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        const modifiedProduct = {
            ...product,
            priceRetail: adjustedPrice,
            priceWholesale: adjustedPrice,
            name: `${product.name} (${selectedWeight.label})`
        };
        addToCart(modifiedProduct, quantity);
        setShowToast(true);
        onAdd();
        setTimeout(() => {
            setShowToast(false);
            onClose();
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem',
                backdropFilter: 'blur(4px)',
                animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'white',
                    borderRadius: '24px',
                    maxWidth: '900px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    position: 'relative',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    animation: 'slideUp 0.3s ease-out'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        zIndex: 10,
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.background = '#f5f5f5';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.background = 'white';
                    }}
                >
                    <X size={24} color="#333" />
                </button>

                {/* Toast de Agregado */}
                {showToast && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'white',
                        padding: '2rem 3rem',
                        borderRadius: '20px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                        zIndex: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                        border: '3px solid var(--primary)',
                        animation: 'bounceIn 0.5s ease-out'
                    }}>
                        <span style={{ fontSize: '3rem' }}>✨</span>
                        <span style={{ fontWeight: 900, fontSize: '1.5rem', color: 'var(--primary)', letterSpacing: '1px' }}>
                            ¡AGREGADO AL CARRITO! 🛒
                        </span>
                    </div>
                )}

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
                    gap: '2rem',
                    padding: '2rem'
                }}>
                    {/* Columna izquierda: Imagen */}
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '100%',
                            height: window.innerWidth > 768 ? '500px' : '300px',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            background: '#f5f5f5',
                            position: 'relative'
                        }}>
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
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    color: '#999'
                                }}>
                                    {product.name}
                                </div>
                            )}

                            {/* Overlay de Sin Stock */}
                            {isOutOfStock && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    backdropFilter: 'blur(3px)'
                                }}>
                                    <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🌰💧</div>
                                    <span style={{
                                        background: '#ff4444',
                                        padding: '8px 20px',
                                        borderRadius: '50px',
                                        fontWeight: 900,
                                        fontSize: '1.2rem',
                                        letterSpacing: '2px'
                                    }}>SIN STOCK</span>
                                    <p style={{ margin: '10px 0 0', fontSize: '0.9rem', fontWeight: 600 }}>
                                        Pronto volveremos...
                                    </p>
                                </div>
                            )}

                            {product.isBestSeller && !isOutOfStock && (
                                <span style={{
                                    position: 'absolute',
                                    top: 15,
                                    left: 15,
                                    background: 'var(--secondary)',
                                    color: 'black',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: '700',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                }}>
                                    ⭐ Bestseller
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Columna derecha: Información y compra */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <div style={{
                                display: 'inline-block',
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                marginBottom: '1rem'
                            }}>
                                {product.category}
                            </div>
                            <h2 style={{
                                fontSize: '2rem',
                                fontWeight: '900',
                                marginBottom: '1rem',
                                color: '#333',
                                lineHeight: '1.2'
                            }}>
                                {product.name}
                            </h2>
                            <p style={{
                                fontSize: '1rem',
                                color: '#666',
                                lineHeight: '1.6',
                                marginBottom: '1.5rem'
                            }}>
                                {product.description}
                            </p>
                        </div>

                        {/* Selector de peso */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontWeight: '700',
                                marginBottom: '0.75rem',
                                fontSize: '0.95rem',
                                color: '#333'
                            }}>
                                Selecciona el peso:
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {WEIGHT_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        disabled={isOutOfStock}
                                        onClick={() => setSelectedWeight(opt)}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            fontSize: '0.95rem',
                                            borderRadius: '12px',
                                            border: selectedWeight.value === opt.value ? '3px solid var(--primary)' : '2px solid #ddd',
                                            background: isOutOfStock ? '#eee' : (selectedWeight.value === opt.value ? 'var(--primary)' : 'white'),
                                            color: selectedWeight.value === opt.value ? 'white' : '#666',
                                            fontWeight: 800,
                                            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.2s ease',
                                            transform: selectedWeight.value === opt.value ? 'scale(1.05)' : 'scale(1)'
                                        }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Precio y cantidad */}
                        <div style={{
                            background: '#f8f8f8',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            border: '2px solid #eee'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1rem'
                            }}>
                                <span style={{ fontWeight: '700', fontSize: '0.95rem', color: '#666' }}>
                                    Precio total:
                                </span>
                                <div style={{
                                    fontSize: '2rem',
                                    fontWeight: '900',
                                    color: 'var(--primary)',
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    gap: '4px'
                                }}>
                                    <span style={{ fontSize: '1.5rem' }}>$</span>
                                    {new Intl.NumberFormat('es-AR').format(totalPrice)}
                                </div>
                            </div>

                            {/* Selector de cantidad */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontWeight: '700',
                                    marginBottom: '0.75rem',
                                    fontSize: '0.95rem',
                                    color: '#333'
                                }}>
                                    Cantidad:
                                </label>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    background: 'white',
                                    padding: '0.5rem',
                                    borderRadius: '12px',
                                    border: '2px solid #ddd'
                                }}>
                                    <button
                                        disabled={isOutOfStock}
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        style={{
                                            background: 'var(--primary)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            width: '40px',
                                            height: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                                            opacity: isOutOfStock ? 0.5 : 1,
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <Minus size={20} color="white" strokeWidth={3} />
                                    </button>
                                    <span style={{
                                        flex: 1,
                                        textAlign: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: '900',
                                        color: '#333'
                                    }}>
                                        {quantity}
                                    </span>
                                    <button
                                        disabled={isOutOfStock}
                                        onClick={() => setQuantity(quantity + 1)}
                                        style={{
                                            background: 'var(--primary)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            width: '40px',
                                            height: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                                            opacity: isOutOfStock ? 0.5 : 1,
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <Plus size={20} color="white" strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Botón de agregar al carrito */}
                        <button
                            disabled={isOutOfStock}
                            onClick={handleAddToCart}
                            style={{
                                width: '100%',
                                padding: '1.25rem',
                                fontSize: '1.1rem',
                                fontWeight: '900',
                                borderRadius: '16px',
                                border: 'none',
                                background: isOutOfStock ? '#ccc' : 'var(--primary)',
                                color: 'white',
                                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease',
                                letterSpacing: '1px',
                                boxShadow: isOutOfStock ? 'none' : '0 4px 16px rgba(0,0,0,0.2)',
                                transform: 'scale(1)'
                            }}
                            onMouseEnter={(e) => {
                                if (!isOutOfStock) {
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isOutOfStock) {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
                                }
                            }}
                        >
                            {isOutOfStock ? 'AGOTADO 😿' : '¡AGREGAR AL CARRITO! 😋'}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes bounceIn {
                    0% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.3);
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.05);
                    }
                    100% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }
            `}</style>
        </div>
    );
}

function ProductCard({ product, onAdd }: { product: Product, onAdd: () => void }) {
    const { addToCart, isWholesale } = useStore();
    const [selectedWeight, setSelectedWeight] = useState(WEIGHT_OPTIONS[0]);
    const [quantity, setQuantity] = useState(1);
    const [showToast, setShowToast] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isOutOfStock = product.stock === 0;

    const basePrice = isWholesale ? product.priceWholesale : product.priceRetail;
    const adjustedPrice = basePrice * selectedWeight.multiplier;
    const totalPrice = adjustedPrice * quantity;

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        const modifiedProduct = {
            ...product,
            priceRetail: adjustedPrice,
            priceWholesale: adjustedPrice,
            name: `${product.name} (${selectedWeight.label})`
        };
        addToCart(modifiedProduct, quantity);
        setShowToast(true);
        onAdd(); // Abrir el carrito lateral
        setTimeout(() => setShowToast(false), 2000);
    };

    return (
        <>
            <ProductModal
                product={product}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={onAdd}
            />

            <div className={styles.productCard} style={{
                position: 'relative',
                opacity: isOutOfStock ? 0.7 : 1,
                filter: isOutOfStock ? 'grayscale(0.6)' : 'none'
            }}>
                {/* Toast de Agregado */}
                {showToast && (
                    <div className="toast-in" style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        left: '10px',
                        background: 'white',
                        padding: '0.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        border: '2px solid var(--primary)'
                    }}>
                        <span style={{ fontSize: '1.2rem' }}>✨</span>
                        <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)', letterSpacing: '0.5px' }}>¡AL CARRITO! 🛒</span>
                    </div>
                )}

                <div
                    className={styles.imageContainer}
                    onClick={() => setIsModalOpen(true)}
                    style={{ cursor: 'pointer' }}
                >
                    {product.image ? (
                        <img src={product.image} alt={product.name} style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }} />
                    ) : (
                        <span>{product.name}</span>
                    )}

                    {/* Overlay de Sin Stock */}
                    {isOutOfStock && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 3,
                            color: 'white',
                            backdropFilter: 'blur(2px)'
                        }}>
                            <div style={{ fontSize: '4rem', marginBottom: '0.5rem', filter: 'grayscale(1)' }}>🌰💧</div>
                            <span style={{
                                background: '#ff4444',
                                padding: '4px 12px',
                                borderRadius: '50px',
                                fontWeight: 900,
                                fontSize: '0.9rem',
                                letterSpacing: '1px'
                            }}>SIN STOCK</span>
                            <p style={{ margin: '5px 0 0', fontSize: '0.7rem', fontWeight: 600 }}>Pronto volveremos...</p>
                        </div>
                    )}

                    {product.isBestSeller && !isOutOfStock && (
                        <span style={{
                            position: 'absolute', top: 10, left: 10, background: 'var(--secondary)', color: 'black',
                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', zIndex: 2
                        }}>
                            Bestseller
                        </span>
                    )}

                    {/* Indicador de "Ver más" */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                        padding: '2rem 1rem 0.5rem',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        pointerEvents: 'none'
                    }}
                        className="view-more-overlay"
                    >
                        <span style={{
                            color: 'white',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            letterSpacing: '0.5px'
                        }}>
                            👁️ Ver detalles
                        </span>
                    </div>
                </div>

                <div className={styles.productInfo}>
                    <div className={styles.productCategory}>{product.category}</div>
                    <h3
                        className={styles.productName}
                        onClick={() => setIsModalOpen(true)}
                        style={{ cursor: 'pointer', transition: 'color 0.2s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = ''}
                    >
                        {product.name}
                    </h3>

                    <p className={styles.productDescription} style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '1rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.5rem'
                    }}>
                        {product.description}
                    </p>

                    {/* Weights Selector */}
                    <div className={styles.weightSelector} style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
                        {WEIGHT_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                disabled={isOutOfStock}
                                onClick={() => setSelectedWeight(opt)}
                                style={{
                                    flex: 1,
                                    padding: '6px 2px',
                                    fontSize: '0.75rem',
                                    borderRadius: '8px',
                                    border: selectedWeight.value === opt.value ? '2px solid var(--primary)' : '1px solid #ddd',
                                    background: isOutOfStock ? '#eee' : (selectedWeight.value === opt.value ? 'var(--primary)' : 'white'),
                                    color: selectedWeight.value === opt.value ? 'white' : '#666',
                                    fontWeight: 700,
                                    cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {/* Info de precio y cantidad */}
                    <div className={styles.priceQtyWrapper}>
                        <div className={styles.productPriceBadge}>
                            <span className={styles.priceSymbol}>$</span>
                            {new Intl.NumberFormat('es-AR').format(totalPrice)}
                        </div>

                        {/* Quantity Selector */}
                        <div className={styles.qtyContainer}>
                            <button
                                disabled={isOutOfStock}
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className={styles.qtyBtn}
                            >
                                <Minus size={14} strokeWidth={4} />
                            </button>
                            <span className={styles.qtyValue}>{quantity}</span>
                            <button
                                disabled={isOutOfStock}
                                onClick={() => setQuantity(quantity + 1)}
                                className={styles.qtyBtn}
                            >
                                <Plus size={14} strokeWidth={4} />
                            </button>
                        </div>
                    </div>

                    <button
                        disabled={isOutOfStock}
                        className={styles.addToCartBtn}
                        onClick={handleAddToCart}
                    >
                        {isOutOfStock ? 'AGOTADO 😿' : '¡LO QUIERO! 😋'}
                    </button>
                </div>

                <style jsx>{`
                    .${styles.imageContainer}:hover .view-more-overlay {
                        opacity: 1;
                    }
                `}</style>
            </div>
        </>
    );
}

const CATEGORY_IMAGES_MAP: Record<string, string> = {
    'Frutos Secos': '/products/almendras.png',
    'Frutas Desecadas': '/products/mix-energetico.png',
    'Especias y Condimentos': '/products/pimenton.png',
    'Harinas': '/placeholder/harina-almendras.jpg',
    'Semillas y Legumbres': '/placeholder/mix-semilla.jpg',
    'Maní': '/placeholder/mix-salado.jpg',
    'Cereales': '/placeholder/mix-cereal.jpg',
    'Aceites': '/logo-fruto-bravo.png',
    'Arroz': '/logo-fruto-bravo.png',
    'Suplementos': '/placeholder/proteina.jpg',
    'Otros': '/logo-fruto-bravo.png'
};

export default function TiendaClient({ initialProducts }: { initialProducts: Product[] }) {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');

    const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');
    // View mode removed at user request

    // const [isCartOpen, setIsCartOpen] = useState(false); // Global now
    const { cartCount } = useStore();
    const router = useRouter();
    const searchQuery = searchParams.get('q')?.toLowerCase() || '';

    // Efecto para seleccionar la categoría desde la URL
    useEffect(() => {
        if (categoryParam && CATEGORIES.includes(categoryParam as Category)) {
            setSelectedCategory(categoryParam as Category);
        }
    }, [categoryParam]);

    const filteredProducts = useMemo(() => {
        return initialProducts
            .filter(p => {
                const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
                const matchesSearch = !searchQuery ||
                    p.name.toLowerCase().includes(searchQuery) ||
                    p.description.toLowerCase().includes(searchQuery);
                return matchesCategory && matchesSearch;
            });
    }, [initialProducts, selectedCategory, searchQuery]);

    return (
        <>
            <Navbar />

            <div className="container">
                <div style={{ paddingTop: '1.5rem' }}></div>

                {selectedCategory === 'Todos' && !searchQuery ? (
                    // VISTA INICIAL: GRID DE CATEGORÍAS
                    <div className={styles.shopContainer}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 className="h2" style={{ margin: 0 }}>Categorías</h2>
                                <button
                                    onClick={() => setSelectedCategory('Frutos Secos')} // Por defecto a una categoría o añadir un "Ver todo" logic
                                    className="btn btn-secondary"
                                    style={{ fontSize: '0.85rem' }}
                                >
                                    Ver todos los productos
                                </button>
                            </div>
                            <div className={styles.categoriesMainGrid}>
                                {CATEGORIES.map((cat) => (
                                    <div
                                        key={cat}
                                        className={styles.categoryMainCard}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        <img
                                            src={CATEGORY_IMAGES_MAP[cat] || '/logo-fruto-bravo.png'}
                                            alt={cat}
                                            className={styles.categoryMainImage}
                                        />
                                        <h3 className={styles.categoryMainTitle}>{cat}</h3>
                                        <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            Ver productos
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    // VISTA DE PRODUCTOS POR CATEGORÍA
                    <>
                        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => {
                                    setSelectedCategory('Todos');
                                    if (searchQuery) router.push('/tienda');
                                }}
                                className="btn"
                                style={{ background: '#eee', color: '#555', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                            >
                                ← Volver a Categorías
                            </button>

                        </div>

                        <div className={styles.shopContainer}>
                            <div style={{ flex: 1 }}>
                                {filteredProducts.length === 0 ? (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '3rem 1rem',
                                        background: 'white',
                                        borderRadius: '24px',
                                        boxShadow: 'var(--shadow-sm)',
                                        border: '1px solid #eee'
                                    }}>
                                        <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🔍🥜</div>
                                        <h2 className="h3" style={{ marginBottom: '1rem' }}>No encontramos productos en {selectedCategory}</h2>
                                        <button
                                            onClick={() => setSelectedCategory('Todos')}
                                            className="btn btn-primary"
                                            style={{ padding: '0.75rem 2rem' }}
                                        >
                                            Ver otras categorías
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.productsGrid}>
                                        {filteredProducts.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                onAdd={() => {
                                                    // Ya no abrimos el carrito automáticamente
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </>
    );
}
