const express = require('express');
const router = express.Router();
const db = require('../../models');

// Get all rules
router.get('/', async (req, res) => {
    try {
      const rules = await db.rules.findAll();
      // Convert condition objects to strings
      const rulesWithConditionsString = rules.map(rule => {
        return {
          ...rule.toJSON(),
          condition: JSON.parse(rule.condition)
        };
      });
      res.json(rulesWithConditionsString);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
  
  // Get a rule by ID
  router.get('/:id', async (req, res) => {
    try {
      const rule = await db.rules.findByPk(req.params.id);
      if (!rule) {
        return res.status(404).json({ error: 'Rule not found' });
      }
      // Convert condition object to string
      const ruleWithConditionString = {
        ...rule.toJSON(),
        condition: JSON.parse(rule.condition)
      };
      res.json(ruleWithConditionString);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
  
// Add a rule
router.post('/', async (req, res) => {
  try {
    console.log(("-------------------req ------------------------------", req));
    const { name, condition, action } = req.body;
    const newRule = await db.rules.create({ name, condition, action });
    res.status(201).json(newRule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update a rule by ID
router.put('/:id', async (req, res) => {
  try {
    const rule = await db.rules.findByPk(req.params.id);
    if (!rule) {
      return res.status(404).json({ error: error });
    }
    const { name, condition, action } = req.body;
    await rule.update({ name, condition, action });
    res.json(rule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a rule by ID
router.delete('/:id', async (req, res) => {
  try {
    const rule = await db.rules.findByPk(req.params.id);
    if (!rule) {
      return res.status(404).json({ error: error });
    }
    await rule.destroy();
    res.json({ message: 'Rule deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
