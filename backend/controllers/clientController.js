const asyncHandler = require('express-async-handler');
const Client = require('../models/clientModel');

// @desc    Obtener todos los clientes
// @route   GET /api/clients
// @access  Public
const getClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({});
  res.json(clients);
});

// @desc    Obtener un cliente por ID
// @route   GET /api/clients/:id
// @access  Public
const getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  
  if (client) {
    res.json(client);
  } else {
    res.status(404);
    throw new Error('Cliente no encontrado');
  }
});

// @desc    Crear un nuevo cliente
// @route   POST /api/clients
// @access  Public
const createClient = asyncHandler(async (req, res) => {
  const { documentType, documentNumber, fullName, contactNumber, email } = req.body;

  const clientExists = await Client.findOne({ documentNumber });

  if (clientExists) {
    res.status(400);
    throw new Error('El cliente ya existe');
  }

  const client = await Client.create({
    documentType,
    documentNumber,
    fullName,
    contactNumber,
    email
  });

  if (client) {
    res.status(201).json(client);
  } else {
    res.status(400);
    throw new Error('Datos de cliente inválidos');
  }
});

// @desc    Actualizar un cliente
// @route   PUT /api/clients/:id
// @access  Public
const updateClient = asyncHandler(async (req, res) => {
  const { documentType, documentNumber, fullName, contactNumber, email } = req.body;

  const client = await Client.findById(req.params.id);

  if (client) {
    client.documentType = documentType || client.documentType;
    client.documentNumber = documentNumber || client.documentNumber;
    client.fullName = fullName || client.fullName;
    client.contactNumber = contactNumber || client.contactNumber;
    client.email = email || client.email;

    const updatedClient = await client.save();
    res.json(updatedClient);
  } else {
    res.status(404);
    throw new Error('Cliente no encontrado');
  }
});

// @desc    Eliminar un cliente
// @route   DELETE /api/clients/:id
// @access  Public
const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (client) {
    await client.deleteOne();
    res.json({ message: 'Cliente eliminado' });
  } else {
    res.status(404);
    throw new Error('Cliente no encontrado');
  }
});

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
};