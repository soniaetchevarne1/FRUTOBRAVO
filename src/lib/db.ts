import { Product, Order, OrderStatus } from './types';
import clientPromise from './mongodb';

const DB_NAME = 'frutosbravos';

// Helper to check if we are on Vercel
const isVercel = process.env.VERCEL === '1' || !!process.env.NOW_REGION;

// --- DYNAMIC IMPORTS FOR LOCAL DB ---
async function getLocalData() {
    const { readFile } = await import('fs/promises');
    const path = (await import('path')).default;
    const filePath = path.join(process.cwd(), 'src', 'data', 'db.json');
    try {
        const content = await readFile(filePath, 'utf8');
        return JSON.parse(content);
    } catch (e) {
        return { products: [], orders: [] };
    }
}

// --- PRODUCTS ---

export async function getProducts(): Promise<Product[]> {
    if (!isVercel) {
        const data = await getLocalData();
        return data.products || [];
    }

    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const products = await db.collection<Product>('products').find({}).sort({ order: 1 }).toArray();
        return products;
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        return [];
    }
}

export async function getProduct(slug: string): Promise<Product | undefined> {
    if (!isVercel) {
        const products = await getProducts();
        return products.find(p => p.slug === slug);
    }

    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const product = await db.collection<Product>('products').findOne({ slug });
        return product || undefined;
    } catch (error) {
        console.error('Error obteniendo producto:', error);
        return undefined;
    }
}

export async function saveProduct(product: Product) {
    if (!isVercel) {
        const { writeFile } = await import('fs/promises');
        const path = (await import('path')).default;
        const filePath = path.join(process.cwd(), 'src', 'data', 'db.json');
        const data = await getLocalData();

        const index = data.products.findIndex((p: any) => p.id === product.id);
        if (index >= 0) {
            data.products[index] = product;
        } else {
            data.products.push(product);
        }

        await writeFile(filePath, JSON.stringify(data, null, 2));
        return product;
    }

    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        await db.collection<Product>('products').updateOne(
            { id: product.id },
            { $set: product },
            { upsert: true }
        );
        return product;
    } catch (error) {
        console.error('Error guardando producto:', error);
        throw error;
    }
}

export async function deleteProduct(id: string) {
    if (!isVercel) {
        const { writeFile } = await import('fs/promises');
        const path = (await import('path')).default;
        const filePath = path.join(process.cwd(), 'src', 'data', 'db.json');
        const data = await getLocalData();
        data.products = data.products.filter((p: any) => p.id !== id);
        await writeFile(filePath, JSON.stringify(data, null, 2));
        return;
    }

    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        await db.collection<Product>('products').deleteOne({ id });
    } catch (error) {
        console.error('Error eliminando producto:', error);
        throw error;
    }
}

export async function reorderProducts(products: Product[]) {
    if (!isVercel) {
        const { writeFile } = await import('fs/promises');
        const path = (await import('path')).default;
        const filePath = path.join(process.cwd(), 'src', 'data', 'db.json');
        const data = await getLocalData();
        data.products = products;
        await writeFile(filePath, JSON.stringify(data, null, 2));
        return;
    }

    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const bulkOps = products.map((product, index) => ({
            updateOne: {
                filter: { id: product.id },
                update: { $set: { ...product, order: index } },
                upsert: true
            }
        }));
        if (bulkOps.length > 0) {
            await db.collection<Product>('products').bulkWrite(bulkOps);
        }
    } catch (error) {
        console.error('Error reordenando productos:', error);
        throw error;
    }
}

// --- ORDERS ---

export async function getOrders(): Promise<Order[]> {
    if (!isVercel) {
        const data = await getLocalData();
        return data.orders || [];
    }

    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const orders = await db.collection<Order>('orders').find({}).sort({ date: -1 }).toArray();
        return orders;
    } catch (error) {
        console.error('Error obteniendo órdenes:', error);
        return [];
    }
}

export async function saveOrder(order: Order) {
    if (!isVercel) {
        const { writeFile } = await import('fs/promises');
        const path = (await import('path')).default;
        const filePath = path.join(process.cwd(), 'src', 'data', 'db.json');
        const data = await getLocalData();
        data.orders.push(order);
        await writeFile(filePath, JSON.stringify(data, null, 2));
        return order;
    }

    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        await db.collection<Order>('orders').insertOne(order);
        return order;
    } catch (error) {
        console.error('Error guardando pedido:', error);
        throw error;
    }
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
    if (!isVercel) {
        const { writeFile } = await import('fs/promises');
        const path = (await import('path')).default;
        const filePath = path.join(process.cwd(), 'src', 'data', 'db.json');
        const data = await getLocalData();
        const index = data.orders.findIndex((o: any) => o.id === id);
        if (index >= 0) {
            data.orders[index].status = status;
        }
        await writeFile(filePath, JSON.stringify(data, null, 2));
        return;
    }

    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        await db.collection<Order>('orders').updateOne(
            { id },
            { $set: { status } }
        );
    } catch (error) {
        console.error('Error actualizando estado de orden:', error);
        throw error;
    }
}

// --- CLIENTES ---

export async function getCustomers() {
    const orders = await getOrders();
    const customersMap = new Map();

    orders.forEach(order => {
        const email = order.customer.email.toLowerCase().trim();
        const existing = customersMap.get(email);

        if (existing) {
            existing.totalSpent += order.total;
            existing.orderCount += 1;
            // Keep the most recent info
            if (new Date(order.date) > new Date(existing.lastOrderDate)) {
                existing.lastOrderDate = order.date;
                existing.phone = order.customer.phone;
                existing.name = `${order.customer.firstName} ${order.customer.lastName}`;
            }
        } else {
            customersMap.set(email, {
                email,
                name: `${order.customer.firstName} ${order.customer.lastName}`,
                phone: order.customer.phone,
                totalSpent: order.total,
                orderCount: 1,
                lastOrderDate: order.date
            });
        }
    });

    return Array.from(customersMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}
