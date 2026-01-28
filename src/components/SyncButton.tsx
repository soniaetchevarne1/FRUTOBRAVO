"use client";

import { useState } from 'react';
import { syncDatabaseAction } from '@/app/actions';
import { RefreshCw } from 'lucide-react';

export default function SyncButton() {
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        if (!confirm('¿Deseas subir todos los productos de tu archivo local (db.json) a la base de datos en la nube? Esto no borrará lo que ya existe.')) return;

        setIsSyncing(true);
        try {
            const result = await syncDatabaseAction();
            alert(`¡Sincronización exitosa! Se procesaron ${result.count} productos.`);
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Error al sincronizar. Revisa la consola para más detalles.');
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <button
            onClick={handleSync}
            disabled={isSyncing}
            className="btn btn-secondary"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                padding: '0.5rem 1rem'
            }}
        >
            <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Sincronizando...' : 'Subir Datos a la Nube'}
        </button>
    );
}
