const express = require('express');
const router = express.Router();

const rulesRoutes = require('./rules/rulesRoutes');
const variablesRoutes = require('./variables/variablesRoutes');
const evaluationRouter = require('./evaluation/evaluationRoutes');

// Mount routes from each module
router.use('/rules', rulesRoutes);
router.use('/variables', variablesRoutes);
router.use('/evaluation', evaluationRouter);

module.exports = router;
