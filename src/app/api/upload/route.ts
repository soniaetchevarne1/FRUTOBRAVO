import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Convertir el archivo a buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Crear nombre de archivo único
        const timestamp = Date.now();
        const originalName = file.name.replace(/\s+/g, '-').toLowerCase();
        const fileName = `${timestamp}-${originalName}`;

        // Ruta donde se guardará el archivo
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(uploadsDir, fileName);

        // Asegurar que existe el directorio
        try {
            await mkdir(uploadsDir, { recursive: true });
        } catch (error) {
            // El directorio ya existe, continuar
        }

        // Guardar el archivo
        await writeFile(filePath, buffer);

        // Retornar la URL del archivo
        const url = `/uploads/${fileName}`;

        return NextResponse.json({
            success: true,
            url,
            fileName
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { error: 'Error uploading file' },
            { status: 500 }
        );
    }
}
