import { MongoClient } from 'mongodb';

// Detectar si estamos en Vercel
const isVercel = process.env.VERCEL === '1' || !!process.env.NOW_REGION;

// No tiramos error aquí para permitir que la app funcione en modo local (db.json)
const standardUri = process.env.MONGODB_URI || "";

const options = {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Robust URI with direct hostnames to skip DNS/SRV issues
const robustUri = "mongodb://soniaetchevarne_db_user:NachoF02@ac-9vn2adl-shard-00-00.6tqs4s6.mongodb.net:27017,ac-9vn2adl-shard-00-01.6tqs4s6.mongodb.net:27017,ac-9vn2adl-shard-00-02.6tqs4s6.mongodb.net:27017/?ssl=true&replicaSet=atlas-m66mki-shard-0&authSource=admin&retryWrites=true&w=majority&appName=FRUTOSBRAVOS";

const uriToUse = standardUri && !standardUri.includes('TU_CONTRASENA_AQUI') ? standardUri : robustUri;

// Solo conectar a MongoDB si estamos en Vercel (producción)
if (isVercel) {
    if (process.env.NODE_ENV === 'development') {
        const globalWithMongo = global as typeof globalThis & {
            _mongoClientPromise?: Promise<MongoClient>;
        };

        if (!globalWithMongo._mongoClientPromise) {
            client = new MongoClient(uriToUse, options);
            globalWithMongo._mongoClientPromise = client.connect();
        }
        clientPromise = globalWithMongo._mongoClientPromise;
    } else {
        client = new MongoClient(uriToUse, options);
        clientPromise = client.connect();
    }
} else {
    // En desarrollo local, crear una promesa que nunca se resuelve
    // Esto permite que db.ts use el fallback a db.json sin errores
    console.log('🔧 Modo desarrollo local: usando db.json (MongoDB deshabilitado)');
    clientPromise = new Promise(() => { }) as Promise<MongoClient>;
}

export default clientPromise;
