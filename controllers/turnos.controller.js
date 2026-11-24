// controllers/turnos.controller.js
// Capa de CONTROLADORES: recibe la petición (req), valida los datos de entrada,
// llama al servicio y responde (res) con el código HTTP adecuado.
// Aquí NO se hacen cálculos de negocio.

const turnosService = require('../services/turnos.service');

const TIPOS_SERVICIO = [
  'cambio de aceite',
  'alineacion y balanceo',
  'revision de frenos',
  'diagnostico electronico',
  'mantenimiento general',
  'latoneria y pintura'
];

// GET /api/turnos -> 200
const listarTurnos = (req, res) => {
  const turnos = turnosService.obtenerTodos();
  res.status(200).json(turnos);
};

// GET /api/turnos/:id -> 200 o 404
const obtenerTurno = (req, res) => {
  const id = Number(req.params.id);
  const turno = turnosService.obtenerPorId(id);

  if (!turno) {
    return res.status(404).json({ error: `No existe un turno con id ${req.params.id}` });
  }

  res.status(200).json(turno);
};

// POST /api/turnos -> 201 o 400
const crearTurno = (req, res) => {
  const errores = validarTurno(req.body);

  if (errores.length > 0) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: errores });
  }

  const nuevoTurno = turnosService.crear(req.body);
  res.status(201).json(nuevoTurno);
};

// ---- Validaciones de entrada ----
function validarTurno(body) {
  const errores = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return ['El cuerpo de la petición debe ser un objeto JSON'];
  }

  const { cliente, placa, vehiculo, tipoServicio, fecha, precioBase, prioritario } = body;

  // Campos de texto obligatorios
  const camposTexto = { cliente, placa, vehiculo, tipoServicio, fecha };
  for (const [campo, valor] of Object.entries(camposTexto)) {
    if (valor === undefined || valor === null || String(valor).trim() === '') {
      errores.push(`El campo "${campo}" es obligatorio`);
    } else if (typeof valor !== 'string') {
      errores.push(`El campo "${campo}" debe ser texto`);
    }
  }

  // Tipo de servicio permitido
  if (typeof tipoServicio === 'string' && tipoServicio.trim() !== '' &&
      !TIPOS_SERVICIO.includes(tipoServicio.toLowerCase().trim())) {
    errores.push(`El campo "tipoServicio" debe ser uno de: ${TIPOS_SERVICIO.join(', ')}`);
  }

  // Fecha válida
  if (typeof fecha === 'string' && fecha.trim() !== '' && isNaN(Date.parse(fecha))) {
    errores.push('El campo "fecha" debe tener un formato válido (ej: 2026-11-30T09:00)');
  }

  // Precio base: obligatorio, numérico y mayor a cero
  if (precioBase === undefined || precioBase === null || precioBase === '') {
    errores.push('El campo "precioBase" es obligatorio');
  } else if (typeof precioBase !== 'number' || Number.isNaN(precioBase)) {
    errores.push('El campo "precioBase" debe ser numérico');
  } else if (precioBase <= 0) {
    errores.push('El campo "precioBase" debe ser mayor a cero');
  }

  // Prioritario: opcional, pero si viene debe ser booleano
  if (prioritario !== undefined && typeof prioritario !== 'boolean') {
    errores.push('El campo "prioritario" debe ser true o false');
  }

  return errores;
}

module.exports = { listarTurnos, obtenerTurno, crearTurno };
