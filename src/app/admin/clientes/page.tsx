import { getCustomers } from '@/lib/db';
import ClientsClient from './ClientsClient';

export const dynamic = 'force-dynamic';

export default async function AdminClientsPage() {
    const customers = await getCustomers();

    return (
        <div className="section">
            <h1 className="h2" style={{ marginBottom: '2rem' }}>Clientes</h1>
            <ClientsClient initialCustomers={customers} />
        </div>
    );
}
