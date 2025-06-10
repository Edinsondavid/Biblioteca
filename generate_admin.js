const bcrypt = require('bcrypt');
const db = require('./lib/db');

async function createAdminUser() {
    try {
        const username = 'admin';
        const password = 'admin123';
        const email = 'admin@biblioteca.com';
        const fullName = 'Administrador Principal';
        const role = 'admin';

        // Generar hash de la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Verificar si el usuario ya existe
        const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
        db.query(checkQuery, [username, email], (error, results) => {
            if (error) {
                console.error('Error al verificar usuario existente:', error);
                process.exit(1);
            }

            if (results && results.length > 0) {
                console.log('El usuario ya existe. Actualizando contraseña...');
                
                // Actualizar usuario existente
                const updateQuery = 'UPDATE users SET password = ?, status = 1 WHERE username = ?';
                db.query(updateQuery, [hashedPassword, username], (error) => {
                    if (error) {
                        console.error('Error al actualizar usuario:', error);
                        process.exit(1);
                    }
                    console.log('Usuario administrador actualizado exitosamente');
                    console.log('Username:', username);
                    console.log('Password:', password);
                    process.exit(0);
                });
            } else {
                // Crear nuevo usuario
                const insertQuery = 'INSERT INTO users (username, password, full_name, role, email, status) VALUES (?, ?, ?, ?, ?, 1)';
                db.query(insertQuery, [username, hashedPassword, fullName, role, email], (error) => {
                    if (error) {
                        console.error('Error al crear usuario:', error);
                        process.exit(1);
                    }
                    console.log('Usuario administrador creado exitosamente');
                    console.log('Username:', username);
                    console.log('Password:', password);
                    process.exit(0);
                });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createAdminUser(); 