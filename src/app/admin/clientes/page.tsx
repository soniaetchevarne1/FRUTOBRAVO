import { getCustomers } from '@/lib/db';
import ClientsClient from './ClientsClient';

export const dynamic = 'force-dynamic';

export default async function AdminClientsPage() {
    const customers = await getCustomers();

    if (!customers || customers.length === 0) {
        return (
            <div className="section">
                <h1 className="h2" style={{ marginBottom: '2rem' }}>Clientes</h1>
                <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '15px', color: '#666' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                    <h3>Aún no tienes clientes registrados</h3>
                    <p>Los clientes aparecerán aquí automáticamente cuando realicen su primer pedido.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="section">
            <h1 className="h2" style={{ marginBottom: '2rem' }}>Clientes</h1>
            <ClientsClient initialCustomers={customers} />
        </div>
    );
}
