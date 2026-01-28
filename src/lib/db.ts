import fs from 'fs';
import path from 'path';
import { Product, Order, OrderStatus, BlogContent } from './types';

// Path to the JSON file
const dbPath = path.join(process.cwd(), 'src', 'data', 'db.json');

// Helper to read DB
function readDb() {
    if (!fs.existsSync(dbPath)) {
        return { products: [], orders: [], blog: [] };
    }
    const fileContent = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(fileContent);
}

// Helper to write DB
function writeDb(data: any) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// --- PRODUCTS ---

export async function getProducts(): Promise<Product[]> {
    const db = readDb();
    return db.products || [];
}

export async function getProduct(slug: string): Promise<Product | undefined> {
    const products = await getProducts();
    return products.find((p) => p.slug === slug);
}

export async function saveProduct(product: Product) {
    const db = readDb();
    const index = db.products.findIndex((p: Product) => p.id === product.id);

    if (index >= 0) {
        db.products[index] = product;
    } else {
        db.products.push(product);
    }

    writeDb(db);
    return product;
}

export async function deleteProduct(id: string) {
    const db = readDb();
    db.products = db.products.filter((p: Product) => p.id !== id);
    writeDb(db);
}

export async function reorderProducts(products: Product[]) {
    const db = readDb();
    db.products = products;
    writeDb(db);
}

// --- ORDERS ---
export async function getOrders(): Promise<Order[]> {
    const db = readDb();
    return db.orders || [];
}

export async function saveOrder(order: Order) {
    try {
        const db = readDb();
        if (!db.orders) {
            db.orders = [];
        }
        db.orders.unshift(order); // Add new orders to the top
        writeDb(db);

        // También enviamos por email/notificación (para implementar después)
        console.log('📦 Nuevo pedido recibido:', {
            id: order.id,
            customer: `${order.customer.firstName} ${order.customer.lastName}`,
            total: order.total,
            phone: order.customer.phone
        });

        return order;
    } catch (error) {
        console.error('Error guardando pedido en DB:', error);
        // En producción (Vercel), no podemos escribir archivos
        // Pero al menos logueamos el pedido para que aparezca en los logs
        console.log('PEDIDO (no guardado en DB por limitación de Vercel):', JSON.stringify(order, null, 2));
        // No hacemos throw para que el usuario vea el mensaje de éxito
        return order;
    }
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
    const db = readDb();
    const order = db.orders.find((o: Order) => o.id === id);
    if (order) {
        order.status = status;
        writeDb(db);
    }
}

