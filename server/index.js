const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let db;

const path = require('path');

initDb().then(database => {
    db = database;
    console.log('Database initialized');
}).catch(err => {
    console.error('Failed to initialize database', err);
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../dist'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js') || path.endsWith('.mjs')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// GET all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await db.all('SELECT * FROM projects');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET projects by type (optional optimization, but frontend does filtering)
// We will just fetch all for now to keep it simple and match current context logic.

// POST login
app.post('/api/login', async (req, res) => {
    try {
        const { name, idNumber } = req.body;
        if (!name || !idNumber) {
            return res.status(400).json({ error: 'Name and ID number are required' });
        }

        // Case-insensitive name match, exact ID match
        const user = await db.get('SELECT * FROM users WHERE lower(name) = lower(?) AND id_number = ?', [name, idNumber]);

        if (user) {
            res.json(user);
        } else {
            res.status(401).json({ error: 'Invalid name or ID number' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create project
app.post('/api/projects', async (req, res) => {
    try {
        const { name, client, clientPhone, location, year, type, oneDriveLink, imageUrl, createdAt } = req.body;
        const id = req.body.id || Math.random().toString(36).substr(2, 9); // Fallback ID generation

        await db.run(
            `INSERT INTO projects (id, name, client, clientPhone, location, year, type, oneDriveLink, imageUrl, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, name, client, clientPhone, location, year, type, oneDriveLink, imageUrl, createdAt]
        );

        const newProject = await db.get('SELECT * FROM projects WHERE id = ?', id);
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update project
app.put('/api/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, client, clientPhone, location, year, type, oneDriveLink, imageUrl } = req.body;

        // Check if project exists
        const project = await db.get('SELECT * FROM projects WHERE id = ?', id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        await db.run(
            `UPDATE projects 
       SET name = ?, client = ?, clientPhone = ?, location = ?, year = ?, type = ?, oneDriveLink = ?, imageUrl = ?
       WHERE id = ?`,
            [name, client, clientPhone, location, year, type, oneDriveLink, imageUrl, id]
        );

        const updatedProject = await db.get('SELECT * FROM projects WHERE id = ?', id);
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE project
app.delete('/api/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.run('DELETE FROM projects WHERE id = ?', id);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
