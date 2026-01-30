"use client";

import { useState, useEffect, useRef } from 'react';
import styles from '../admin.module.css';
import { Save, X, Trash2, Plus, Search, Upload, Image as ImageIcon } from 'lucide-react';
import { Product } from '@/lib/types';
import { deleteProductAction, updateProductAction } from '@/app/actions';

export default function AdminProductsClient({ initialProducts }: { initialProducts: Product[] }) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedProduct, setEditedProduct] = useState<Product | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

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
        setEditingId(product.id);
        setEditedProduct({ ...product });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditedProduct(null);
    };

    const handleSave = async () => {
        if (editedProduct) {
            await updateProductAction(editedProduct);
            setEditingId(null);
            setEditedProduct(null);
        }
    };

    const handleFieldChange = (field: keyof Product, value: any) => {
        if (editedProduct) {
            setEditedProduct({
                ...editedProduct,
                [field]: value
            });
        }
    };

    const handleImageUpload = async (productId: string, file: File) => {
        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                const imageUrl = data.url;

                // Actualizar la imagen en el producto editado
                if (editedProduct && editedProduct.id === productId) {
                    handleFieldChange('image', imageUrl);
                } else {
                    // Si no está en modo edición, actualizar directamente
                    const product = products.find(p => p.id === productId);
                    if (product) {
                        const updatedProduct = { ...product, image: imageUrl };
                        await updateProductAction(updatedProduct);
                    }
                }
            } else {
                alert('Error al subir la imagen');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error al subir la imagen');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleNew = () => {
        const newProduct: Product = {
            id: `new-${Date.now()}`,
            name: '',
            category: '',
            priceRetail: 0,
            priceWholesale: 0,
            stock: 0,
            unit: 'kg',
            description: '',
            image: ''
        };

        setProducts([newProduct, ...products]);
        setEditingId(newProduct.id);
        setEditedProduct(newProduct);
    };

    return (
        <>
            <div className={styles.header}>
                <div>
                    <h1 className="h2" style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Gestión de Productos</h1>
                    <p className="body-sm">Haz clic en una fila para editar directamente</p>
                </div>
                <button className="btn btn-primary" onClick={handleNew}>
                    <Plus size={20} /> Nuevo Producto
                </button>
            </div>

            {/* Filters */}
            <div style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
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
            </div>

            {/* Table View - Excel Style with Inline Editing */}
            <div className={styles.tableCard} style={{ overflowX: 'auto' }}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '100px' }}>Imagen</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio Minorista</th>
                            <th>Precio Mayorista</th>
                            <th>Stock</th>
                            <th>Unidad</th>
                            <th style={{ width: '200px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                    No hay productos registrados.
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((product) => {
                                const isEditing = editingId === product.id;
                                const displayProduct = isEditing && editedProduct ? editedProduct : product;

                                return (
                                    <tr
                                        key={product.id}
                                        style={{
                                            background: isEditing ? '#fffbeb' : 'transparent',
                                            cursor: isEditing ? 'default' : 'pointer'
                                        }}
                                        onClick={() => !isEditing && handleEdit(product)}
                                    >
                                        {/* Columna de Imagen */}
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                                                {displayProduct.image ? (
                                                    <img
                                                        src={displayProduct.image}
                                                        alt={displayProduct.name}
                                                        style={{
                                                            width: '60px',
                                                            height: '60px',
                                                            objectFit: 'cover',
                                                            borderRadius: '6px',
                                                            border: '1px solid var(--border)'
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        background: '#f3f4f6',
                                                        borderRadius: '6px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        border: '1px solid var(--border)'
                                                    }}>
                                                        <ImageIcon size={24} color="#9ca3af" />
                                                    </div>
                                                )}
                                                <input
                                                    ref={(el) => fileInputRefs.current[product.id] = el}
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            handleImageUpload(product.id, file);
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={() => fileInputRefs.current[product.id]?.click()}
                                                    disabled={uploadingImage}
                                                    style={{
                                                        padding: '4px 8px',
                                                        fontSize: '0.75rem',
                                                        background: 'var(--primary)',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: uploadingImage ? 'wait' : 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}
                                                >
                                                    <Upload size={12} />
                                                    {uploadingImage ? 'Subiendo...' : 'Cambiar'}
                                                </button>
                                            </div>
                                        </td>

                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={displayProduct.name}
                                                    onChange={(e) => handleFieldChange('name', e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '4px 8px',
                                                        border: '1px solid var(--primary)',
                                                        borderRadius: '4px',
                                                        fontWeight: 600
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                <span style={{ fontWeight: 600 }}>{product.name}</span>
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={displayProduct.category}
                                                    onChange={(e) => handleFieldChange('category', e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '4px 8px',
                                                        border: '1px solid var(--primary)',
                                                        borderRadius: '4px'
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                product.category
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={displayProduct.priceRetail}
                                                    onChange={(e) => handleFieldChange('priceRetail', parseFloat(e.target.value) || 0)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '4px 8px',
                                                        border: '1px solid var(--primary)',
                                                        borderRadius: '4px'
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                `$${new Intl.NumberFormat('es-AR').format(product.priceRetail)}`
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={displayProduct.priceWholesale}
                                                    onChange={(e) => handleFieldChange('priceWholesale', parseFloat(e.target.value) || 0)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '4px 8px',
                                                        border: '1px solid var(--primary)',
                                                        borderRadius: '4px'
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                `$${new Intl.NumberFormat('es-AR').format(product.priceWholesale)}`
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={displayProduct.stock}
                                                    onChange={(e) => handleFieldChange('stock', parseInt(e.target.value) || 0)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '4px 8px',
                                                        border: '1px solid var(--primary)',
                                                        borderRadius: '4px'
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                <span style={{ color: product.stock < 10 ? 'var(--error)' : 'var(--text-main)' }}>
                                                    {product.stock}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <select
                                                    value={displayProduct.unit}
                                                    onChange={(e) => handleFieldChange('unit', e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '4px 8px',
                                                        border: '1px solid var(--primary)',
                                                        borderRadius: '4px'
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <option value="kg">kg</option>
                                                    <option value="g">g</option>
                                                    <option value="unidad">unidad</option>
                                                    <option value="paquete">paquete</option>
                                                </select>
                                            ) : (
                                                product.unit
                                            )}
                                        </td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {isEditing ? (
                                                    <>
                                                        <button
                                                            onClick={handleSave}
                                                            className="btn"
                                                            style={{
                                                                padding: '6px 12px',
                                                                background: 'var(--success)',
                                                                color: 'white',
                                                                border: 'none',
                                                                fontSize: '0.85rem'
                                                            }}
                                                        >
                                                            <Save size={16} /> Guardar
                                                        </button>
                                                        <button
                                                            onClick={handleCancel}
                                                            className="btn"
                                                            style={{
                                                                padding: '6px 12px',
                                                                background: '#e5e7eb',
                                                                color: '#374151',
                                                                border: 'none',
                                                                fontSize: '0.85rem'
                                                            }}
                                                        >
                                                            <X size={16} /> Cancelar
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="btn"
                                                        style={{
                                                            padding: '6px 12px',
                                                            background: '#fee2e2',
                                                            color: 'var(--error)',
                                                            border: 'none',
                                                            fontSize: '0.85rem'
                                                        }}
                                                    >
                                                        <Trash2 size={16} /> Eliminar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
