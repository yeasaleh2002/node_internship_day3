const express = require('express');
const router = express.Router();
const db = require('../../models');
const atob = require('atob');

// Evaluate API
router.get('/', async (req, res) => {
  try {
    const { variable: encodedVariable } = req.query;

    if (!encodedVariable) {
      return res.status(400).json({ error: 'Variable payload is required' });
    }

    console.log('Encoded variable:', encodedVariable);

    let decodedVariable;
    try {
      decodedVariable = atob(encodedVariable);
      decodedVariable = decodedVariable.trim();
      console.log('Decoded variable:', decodedVariable);
      decodedVariable = JSON.parse(`${decodedVariable}`);
    } catch (err) {
      console.error('Error decoding base64:', err);
      return res.status(400).json({ error: err.message });
    }

    console.log('Parsed variable:', decodedVariable);

    const variables = await db.variables.findAll();

    const whereCondition = {};
    for (const variable in decodedVariable) {
      const dbVariable = variables.find(v => v.name === variable);
      if (dbVariable) {
        switch (dbVariable.type) {
          case 'STRING':
            whereCondition[variable] = decodedVariable[variable];
            break;
          case 'FLOAT':
            whereCondition[variable] = parseFloat(decodedVariable[variable]);
            break;
          case 'INTEGER':
            whereCondition[variable] = parseInt(decodedVariable[variable]);
            break;
          default:
            break;
        }
      }
    }

    console.log('Where condition:', whereCondition);
    const rules = await db.rules.findAll();

    const matchedRules = rules.filter(rule => {
      try {
        const ruleCondition = JSON.parse(rule.condition);
        return JSON.stringify(ruleCondition) === JSON.stringify(whereCondition);
      } catch (error) {
        console.error('Error parsing rule condition:', error);
        return false;
      }
    });

    if (matchedRules.length === 0) {
      return res.json({ message: 'No rules matched the condition' });
    }

    const results = matchedRules.map(rule => ({
      rule_id: rule.id,
      result: rule.action
    }));

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
