"use server";

import { saveProduct, deleteProduct, reorderProducts, saveOrder, updateOrderStatus } from "@/lib/db";
import { Product, Order, OrderStatus } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";

export async function updateProductAction(product: Product) {
    await saveProduct(product);
    revalidatePath('/admin/productos');
    revalidatePath('/tienda');
    revalidatePath(`/tienda/${product.slug}`);
}

export async function deleteProductAction(id: string) {
    await deleteProduct(id);
    revalidatePath('/admin/productos');
    revalidatePath('/tienda');
}

export async function reorderProductsAction(products: Product[]) {
    await reorderProducts(products);
    revalidatePath('/admin/productos');
    revalidatePath('/tienda');
}

export async function uploadImageAction(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) {
        throw new Error('No file uploaded');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename
    const filename = file.name.replace(/\s+/g, '-').toLowerCase();
    const relPath = `/uploads/${Date.now()}-${filename}`;
    const uploadPath = path.join(process.cwd(), 'public', relPath);

    // Ensure public/uploads exists (create if not) - skipping check for MVP speed, directory likely exists or needs mkdir
    // For robustness we should check/create dir here but assuming user created it or existing logic handles it
    // Let's create directory just in case
    const uploadDir = path.dirname(uploadPath);
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        console.error("Error creating directory:", e);
    }

    await writeFile(uploadPath, buffer);
    return relPath;
}

// --- ORDER ACTIONS ---

export async function createOrderAction(order: Order) {
    try {
        console.log('Creating order:', order.id);
        await saveOrder(order);
        revalidatePath('/admin/ventas');
        console.log('Order created successfully:', order.id);
        return { success: true, orderId: order.id };
    } catch (error) {
        console.error('Error creating order:', error);
        throw new Error('No se pudo crear el pedido. Por favor, contáctanos por WhatsApp.');
    }
}


export async function updateOrderStatusAction(id: string, status: OrderStatus) {
    await updateOrderStatus(id, status);
    revalidatePath('/admin/ventas');
}

export async function syncDatabaseAction() {
    const filePath = path.join(process.cwd(), 'src', 'data', 'db.json');
    try {
        console.log('Intentando leer archivo en:', filePath);
        const fileContent = await readFile(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        const products = data.products || [];

        console.log(`Sincronizando ${products.length} productos a MongoDB...`);

        // Usamos una URI alternativa directa para saltear bloqueos de DNS/SRV del proveedor de internet
        // Esta URI usa los hostnames específicos de los nodos de Atlas.
        const directUri = "mongodb://soniaetchevarne_db_user:NachoF02@ac-9vn2adl-shard-00-00.6tqs4s6.mongodb.net:27017,ac-9vn2adl-shard-00-01.6tqs4s6.mongodb.net:27017,ac-9vn2adl-shard-00-02.6tqs4s6.mongodb.net:27017/?ssl=true&replicaSet=atlas-m66mki-shard-0&authSource=admin&retryWrites=true&w=majority&appName=FRUTOSBRAVOS";

        const { MongoClient } = await import('mongodb');
        const client = new MongoClient(directUri, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000
        });
        await client.connect();
        const db = client.db('frutosbravos');

        for (const product of products) {
            await db.collection('products').updateOne(
                { id: product.id },
                { $set: product },
                { upsert: true }
            );
        }

        await client.close();
        revalidatePath('/admin/productos');
        revalidatePath('/tienda');
        return { success: true, count: products.length };
    } catch (error: any) {
        console.error('Error detallado de sincronización:', error);
        throw new Error(`Error al sincronizar: ${error.message}.`);
    }
}
