import Link from 'next/link';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'; // Facebook as placeholder for TikTok if not avail or just use Text
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    {/* Brand */}
                    <div className={styles.column}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <img src="/logo-fruto-bravo.png" alt="Frutos Bravos Logo" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid var(--secondary)' }} />
                            <h3 className={styles.heading} style={{ margin: 0, fontSize: '1.8rem' }}>FRUTOS BRAVOS</h3>
                        </div>
                        <p className={styles.text}>
                            Alimentos saludables, frescos y de la mejor calidad. Venta mayorista y minorista.
                        </p>
                    </div>

                    {/* Links */}
                    <div className={styles.column}>
                        <h4 className={styles.subheading}>Explorar</h4>
                        <ul className={styles.list}>
                            <li><Link href="/tienda">Tienda</Link></li>
                            <li><Link href="/mayorista">Mayorista</Link></li>
                            <li><Link href="/blog">Blog & Recetas</Link></li>
                            <li><Link href="/sobre-nosotros">Sobre nosotros</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className={styles.column}>
                        <h4 className={styles.subheading}>Contacto</h4>
                        <ul className={styles.contactList}>
                            <li><Mail size={16} /> frutosbravos@gmail.com</li>
                            <li><Phone size={16} /> 3416091224</li>
                            <li><MapPin size={16} /> Rosario, Santa Fe, Argentina</li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div className={styles.column}>
                        <h4 className={styles.subheading}>Seguinos</h4>
                        <div className={styles.socials}>
                            <a href="#" aria-label="Instagram"><Instagram size={24} /></a>
                            <a href="#" aria-label="TikTok"><span style={{ fontWeight: 'bold' }}>Tk</span></a>
                        </div>
                    </div>
                </div>

                <div className={styles.copyright}>
                    &copy; {new Date().getFullYear()} Frutos Bravos Alimentos Saludables. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}
