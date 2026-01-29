const WebHDFS = require('webhdfs');
const http = require('http');

// Configuración del cliente WebHDFS
const hdfs = WebHDFS.createClient({
    user: 'root',
    host: 'hadoop-namenode',
    port: 9870,
    path: '/webhdfs/v1'
});

const readFileFromHDFS = async (path) => {
    return new Promise((resolve, reject) => {
        // Leemos el directorio para encontrar el archivo part-*.json
        hdfs.readdir(path, (err, files) => {
            if (err) {
                console.error(`Error reading directory ${path}:`, err);
                return reject(err);
            }

            // Buscamos el archivo que comienza con 'part-' y termina en '.json' o 'csv'
            // Spark suele generar archivos tipo part-00000-....json
            const partFile = files.find(file => file.type === 'FILE' && file.pathSuffix.startsWith('part-'));

            if (!partFile) {
                return reject(new Error(`No part file found in ${path}`));
            }

            const fullPath = `${path}/${partFile.pathSuffix}`;
            console.log(`Reading file from: ${fullPath}`);

            // Leemos el contenido del archivo
            const remoteStream = hdfs.createReadStream(fullPath);
            let data = '';

            remoteStream.on('error', (err) => {
                reject(err);
            });

            remoteStream.on('data', (chunk) => {
                data += chunk;
            });

            remoteStream.on('finish', () => {
                try {
                    // Intentamos parsear como JSON si es posible, si no devolvemos texto
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        // Si no es un JSON válido completo (ej. NDJSON), lo devolvemos tal cual o lo procesamos
                        resolve(data);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
    });
};

// Obtener resumen de contenido (espacio, ficheros, etc)
// Implementado via HTTP directo ya que la libreria webhdfs puede no tener getContentSummary
const getSummary = async (path) => {
    return new Promise((resolve, reject) => {
        const url = `http://hadoop-namenode:9870/webhdfs/v1${path}?op=GETCONTENTSUMMARY&user.name=root`;

        http.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    if (res.statusCode >= 400) {
                        return reject(new Error(`HDFS Error: ${res.statusCode} ${data}`));
                    }

                    const json = JSON.parse(data);
                    // HDFS retorna { ContentSummary: { ... } }
                    resolve(json.ContentSummary);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
};

// Obtener metricas JMX del NameNode (Capacity, Blocks, Health)
const getJMXMetrics = async () => {
    return new Promise((resolve, reject) => {
        // Query específico para FSNamesystem
        const url = 'http://hadoop-namenode:9870/jmx?qry=Hadoop:service=NameNode,name=FSNamesystem';

        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    // Si la respuesta es HTML (error) o vacía
                    if (data.trim().startsWith('<')) {
                        // Fallback por si JMX no está disponible o da error
                        return resolve({});
                    }

                    const json = JSON.parse(data);
                    if (json.beans && json.beans.length > 0) {
                        resolve(json.beans[0]);
                    } else {
                        resolve({});
                    }
                } catch (e) {
                    console.error("Error parsing JMX response:", e);
                    resolve({}); // Resolvemos vacío para no romper todo el endpoint
                }
            });
        }).on('error', err => {
            console.error("Error fetching JMX:", err);
            resolve({}); // Resolvemos vacío
        });
    });
};

module.exports = { readFileFromHDFS, getSummary, getJMXMetrics };