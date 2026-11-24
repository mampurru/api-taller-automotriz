// services/turnos.service.js
// Capa de SERVICIOS: contiene la lógica de negocio, los cálculos
// y la gestión de los datos (arreglo en memoria).

// ===================================================================
// PARÁMETRO N DEL EQUIPO
// N = número de lista oficial del primer integrante del equipo
//     (ordenando a los integrantes alfabéticamente por apellido).
// Equipo (orden alfabético por apellido):
//   1. Colorado Sanchez Oscar Andres  -> N.º 5  (primer integrante)
//   2. Romero Gonzalez Juan David     -> N.º 18
//   3. Toro Labarca Cesar Enrique     -> N.º 21
// ===================================================================
const N = 5;

// porcentajeRecargo = N x 2%
const PORCENTAJE_RECARGO = N * 2;

// Almacenamiento en memoria (datos de ejemplo iniciales)
const turnos = [
  {
    id: 1,
    cliente: 'Carlos Ramírez',
    placa: 'ABC123',
    vehiculo: 'Chevrolet Spark 2018',
    tipoServicio: 'cambio de aceite',
    fecha: '2026-11-25T08:00',
    precioBase: 120000,
    prioritario: false,
    porcentajeRecargo: 0,
    totalPagar: 120000
  },
  {
    id: 2,
    cliente: 'Laura Gómez',
    placa: 'XYZ789',
    vehiculo: 'Mazda 3 2021',
    tipoServicio: 'revision de frenos',
    fecha: '2026-11-25T10:30',
    precioBase: 200000,
    prioritario: true,
    porcentajeRecargo: PORCENTAJE_RECARGO,
    totalPagar: 200000 + 200000 * (PORCENTAJE_RECARGO / 100)
  }
];

let siguienteId = turnos.length + 1;

// ---- Regla de negocio ----
// Si es prioritario: totalPagar = precioBase + (precioBase * porcentajeRecargo / 100)
// Si no:             totalPagar = precioBase
function calcularTotal(precioBase, prioritario) {
  if (prioritario === true) {
    const total = precioBase + precioBase * (PORCENTAJE_RECARGO / 100);
    return Math.round(total * 100) / 100; // redondeo a 2 decimales
  }
  return precioBase;
}

// ---- Gestión de datos ----
function obtenerTodos() {
  return turnos;
}

function obtenerPorId(id) {
  return turnos.find((t) => t.id === id);
}

// Arma un turno con los datos recibidos y calcula su total a pagar
function construirTurno(id, datos) {
  const prioritario = datos.prioritario === true;

  return {
    id,
    cliente: datos.cliente.trim(),
    placa: datos.placa.trim().toUpperCase(),
    vehiculo: datos.vehiculo.trim(),
    tipoServicio: datos.tipoServicio.toLowerCase().trim(),
    fecha: datos.fecha,
    precioBase: datos.precioBase,
    prioritario,
    porcentajeRecargo: prioritario ? PORCENTAJE_RECARGO : 0,
    totalPagar: calcularTotal(datos.precioBase, prioritario)
  };
}

function crear(datos) {
  const nuevoTurno = construirTurno(siguienteId++, datos);
  turnos.push(nuevoTurno);
  return nuevoTurno;
}

// Reemplaza los datos de un turno existente (el id se conserva)
// y vuelve a calcular el total, por si cambió el precio o la prioridad.
function actualizar(id, datos) {
  const indice = turnos.findIndex((t) => t.id === id);
  if (indice === -1) return null;

  turnos[indice] = construirTurno(id, datos);
  return turnos[indice];
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, calcularTotal, N, PORCENTAJE_RECARGO };
