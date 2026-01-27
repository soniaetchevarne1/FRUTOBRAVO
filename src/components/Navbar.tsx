"use client";

import { Suspense } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu } from 'lucide-react';
import styles from './Navbar.module.css';
import { useStore } from '@/context/StoreContext';
import NavbarSearch from './NavbarSearch';

export default function Navbar() {
    const { cartCount, openCart } = useStore();

    return (
        <nav className={styles.navbar}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                <Link href="/" className={styles.logoWrapper}>
                    <img src="/logo-fruto-bravo.png" alt="Fruto Bravo Logo" className={styles.logoImg} />
                    <span className={styles.logoText}>FRUTO BRAVO</span>
                </Link>

                {/* Desktop Menu */}
                <div className={styles.links}>
                    <Link href="/">Inicio</Link>
                    <Link href="/tienda">Tienda</Link>
                    <Link href="/mayorista">Mayorista</Link>
                    <Link href="/blog">Blog</Link>
                    <Link href="/contacto">Contacto</Link>
                </div>

                {/* Icons */}
                <div className={styles.icons}>
                    <div className={styles.searchWrapper}>
                        <Suspense fallback={<div style={{ width: '200px' }}></div>}>
                            <NavbarSearch />
                        </Suspense>
                    </div>
                    <Link href="/cuenta" aria-label="Cuenta" className={styles.iconBtn}><User size={20} /></Link>
                    <button onClick={openCart} aria-label="Carrito" className={`${styles.iconBtn} ${styles.cartBtn}`}>
                        <ShoppingCart size={20} />
                        {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
                    </button>
                    <button className={styles.mobileMenu} aria-label="Menu"><Menu size={24} /></button>
                </div>
            </div>
        </nav>
    );
}
