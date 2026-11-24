// routes/turnos.routes.js
// Capa de RUTAS: define únicamente los endpoints y los asocia con su controlador.

const { Router } = require('express');
const turnosController = require('../controllers/turnos.controller');

const router = Router();

router.get('/', turnosController.listarTurnos);        // GET  /api/turnos
router.get('/:id', turnosController.obtenerTurno);     // GET  /api/turnos/:id
router.post('/', turnosController.crearTurno);         // POST /api/turnos
router.put('/:id', turnosController.actualizarTurno);  // PUT  /api/turnos/:id

module.exports = router;
