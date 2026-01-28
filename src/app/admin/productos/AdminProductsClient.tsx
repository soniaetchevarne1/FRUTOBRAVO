"use client";

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { Edit, Trash2, Plus, Search, ChevronUp, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { Product } from '@/lib/types';
import { deleteProductAction, reorderProductsAction } from '@/app/actions';
import ProductForm from './ProductForm';

// We can't import `getProducts` directly in Client Component if it uses `fs`.
// Strategy: Make the page a Server Component that passes data to a Client Component "ProductList".
// BUT to keep it simple, I'll fetch data via a classic API route or just reload. 
// Actually, let's use the Pattern: Page (Server) -> ClientList (Client).

export default function AdminProductsClient({ initialProducts }: { initialProducts: Product[] }) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

    // Sync with server state if revalidated? 
    // In Next.js App Router, router.refresh() handles this. 
    // For this simple custom DB, we might need manual refresh or just trust the initialProducts prop updates on revalidatePath.
    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    // Persistence
    useEffect(() => {
        const saved = localStorage.getItem('adminProductViewMode');
        if (saved === 'grid' || saved === 'list') {
            setViewMode(saved);
        }
    }, []);

    const handleViewModeChange = (mode: 'grid' | 'list') => {
        setViewMode(mode);
        localStorage.setItem('adminProductViewMode', mode);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            await deleteProductAction(id);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleNew = () => {
        setEditingProduct(undefined);
        setIsFormOpen(true);
    };

    const handleMove = async (index: number, direction: 'up' | 'down') => {
        const newProducts = [...products];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newProducts.length) return;

        // Swap
        const temp = newProducts[index];
        newProducts[index] = newProducts[targetIndex];
        newProducts[targetIndex] = temp;

        setProducts(newProducts);
        await reorderProductsAction(newProducts);
    };

    return (
        <>
            <div className={styles.header}>
                <div>
                    <h1 className="h2" style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Gestión de Productos</h1>
                    <p className="body-sm">Administra tu catálogo, precios y stock.</p>
                </div>
                <button className="btn btn-primary" onClick={handleNew}>
                    <Plus size={20} /> Nuevo Producto
                </button>
            </div>

            {/* Filters & Toggle */}
            <div style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
            }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o categoría..."
                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid var(--border)', borderRadius: '6px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className={styles.viewToggle} style={{ display: 'flex', background: '#f3f4f6', padding: '4px', borderRadius: '8px', gap: '4px' }}>
                    <button
                        onClick={() => handleViewModeChange('list')}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: viewMode === 'list' ? 'white' : 'transparent',
                            boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            color: viewMode === 'list' ? 'var(--primary)' : '#666',
                            fontWeight: 600,
                            fontSize: '0.85rem'
                        }}
                    >
                        <List size={18} /> Líneas
                    </button>
                    <button
                        onClick={() => handleViewModeChange('grid')}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: viewMode === 'grid' ? 'white' : 'transparent',
                            boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            color: viewMode === 'grid' ? 'var(--primary)' : '#666',
                            fontWeight: 600,
                            fontSize: '0.85rem'
                        }}
                    >
                        <LayoutGrid size={18} /> Cuadrícula
                    </button>
                </div>
            </div>

            {/* List/Table View */}
            {viewMode === 'list' ? (
                <div className={styles.tableCard}>
                    <div style={{ overflowX: 'auto' }}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th style={{ width: '60px' }}>Orden</th>
                                    <th style={{ width: '60px' }}>Img</th>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Precio Minorista</th>
                                    <th>Precio Mayorista</th>
                                    <th>Stock</th>
                                    <th style={{ textAlign: 'right' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product, index) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                <button
                                                    disabled={index === 0}
                                                    onClick={() => handleMove(index, 'up')}
                                                    style={{ color: index === 0 ? '#ccc' : 'var(--primary)', cursor: index === 0 ? 'not-allowed' : 'pointer' }}
                                                >
                                                    <ChevronUp size={18} />
                                                </button>
                                                <button
                                                    disabled={index === filteredProducts.length - 1}
                                                    onClick={() => handleMove(index, 'down')}
                                                    style={{ color: index === filteredProducts.length - 1 ? '#ccc' : 'var(--primary)', cursor: index === filteredProducts.length - 1 ? 'not-allowed' : 'pointer' }}
                                                >
                                                    <ChevronDown size={18} />
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            {product.image ? (
                                                <img src={product.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                            ) : (
                                                <div style={{ width: '40px', height: '40px', background: '#f3f4f6', borderRadius: '4px' }}></div>
                                            )}
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{product.name}</td>
                                        <td>
                                            <span style={{ fontSize: '0.8em', padding: '2px 8px', background: '#f3f4f6', borderRadius: '12px', color: 'var(--text-secondary)' }}>
                                                {product.category}
                                            </span>
                                        </td>
                                        <td>${new Intl.NumberFormat('es-AR').format(product.priceRetail)}</td>
                                        <td>${new Intl.NumberFormat('es-AR').format(product.priceWholesale)}</td>
                                        <td>
                                            <span style={{ color: product.stock < 10 ? 'var(--error)' : 'var(--success)', fontWeight: 600 }}>
                                                {product.stock} {product.unit}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                <button onClick={() => handleEdit(product)} style={{ padding: '6px', color: 'var(--primary)', background: 'var(--surface-alt)', borderRadius: '4px' }}>
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} style={{ padding: '6px', color: 'var(--error)', background: '#fee2e2', borderRadius: '4px' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Grid View */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {filteredProducts.map((product, index) => (
                        <div key={product.id} className={styles.tableCard} style={{ padding: '1rem', position: 'relative' }}>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                                    {product.image ? (
                                        <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: '#f3f4f6', borderRadius: '8px' }}></div>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>{product.category}</div>
                                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{product.name}</h4>
                                    <div style={{ marginTop: '4px', fontSize: '0.9rem', color: product.stock < 10 ? 'var(--error)' : 'var(--success)', fontWeight: 600 }}>
                                        Stock: {product.stock} {product.unit}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem', background: '#f8f9fa', padding: '10px', borderRadius: '8px' }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#666' }}>Minorista</div>
                                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>${new Intl.NumberFormat('es-AR').format(product.priceRetail)}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#666' }}>Mayorista</div>
                                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>${new Intl.NumberFormat('es-AR').format(product.priceWholesale)}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <button
                                        disabled={index === 0}
                                        onClick={() => handleMove(index, 'up')}
                                        style={{ padding: '4px', color: index === 0 ? '#ccc' : 'var(--primary)' }}
                                    >
                                        <ChevronUp size={20} />
                                    </button>
                                    <button
                                        disabled={index === filteredProducts.length - 1}
                                        onClick={() => handleMove(index, 'down')}
                                        style={{ padding: '4px', color: index === filteredProducts.length - 1 ? '#ccc' : 'var(--primary)' }}
                                    >
                                        <ChevronDown size={20} />
                                    </button>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleEdit(product)} className="btn" style={{ padding: '8px 16px', background: 'var(--surface-alt)', color: 'var(--primary)', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
                                        <Edit size={16} /> Editar
                                    </button>
                                    <button onClick={() => handleDelete(product.id)} className="btn" style={{ padding: '8px 16px', background: '#fee2e2', color: 'var(--error)', border: 'none', fontSize: '0.85rem' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}


            {isFormOpen && (
                <ProductForm
                    initialProduct={editingProduct}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </>
    );
}
