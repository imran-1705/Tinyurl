const config = {
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
server: process.env.DB_SERVER,
database: process.env.DB_NAME,
options: {
encrypt: true,
trustServerCertificate: true
},
pool: {
max: 10,
min: 0,
idleTimeoutMillis: 30000
}
};


let pool;
export async function getPool() {
if (pool) return pool;
pool = await sql.connect(config);
return pool;
}


export default getPool;