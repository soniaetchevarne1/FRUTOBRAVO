"use server";

import { saveProduct, deleteProduct, reorderProducts, saveOrder, updateOrderStatus } from "@/lib/db";
import { Product, Order, OrderStatus } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
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
        await require('fs').promises.mkdir(uploadDir, { recursive: true });
    } catch (e) { }

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
