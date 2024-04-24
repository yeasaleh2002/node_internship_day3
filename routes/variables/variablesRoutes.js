// variablesRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../../models');

// Get all variables
router.get('/', async (req, res) => {
    console.log("res", res)
  try {
    const variables = await db.variables.findAll();
    res.json(variables);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get a variable by ID
router.get('/:id', async (req, res) => {
  try {
    const variable = await db.variables.findByPk(req.params.id);
    if (!variable) {
      return res.status(404).json({ error: 'Variable not found' });
    }
    res.json(variable);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Add a variable
router.post('/', async (req, res) => {
  try {
    const { name, type } = req.body;

    // Check if name and type are provided
    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    const newVariable = await db.variables.create({ name, type });
    res.status(201).json(newVariable);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update a variable by ID
router.put('/:id', async (req, res) => {
  try {
    const variable = await db.variables.findByPk(req.params.id);
    if (!variable) {
      return res.status(404).json({ error: 'Variable not found' });
    }

    const { name, type } = req.body;

    // Check if name and type are provided
    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    await variable.update({ name, type });
    res.json(variable);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a variable by ID
router.delete('/:id', async (req, res) => {
  try {
    const variable = await db.variables.findByPk(req.params.id);
    if (!variable) {
      return res.status(404).json({ error: 'Variable not found' });
    }
    await variable.destroy();
    res.json({ message: 'Variable deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
