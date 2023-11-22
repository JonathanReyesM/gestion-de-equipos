<!-- EquipoList.vue -->
<template>
    <div>
      <h2>Lista de Equipos</h2>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Serial</th>
              <th>Fecha</th>
              <th>Fecha Garantía</th>
              <th>Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="equipo in equipos" :key="equipo.id">
              <td>{{ equipo.id }}</td>
              <td>{{ equipo.descripcion_equipo }}</td>
              <td>{{ equipo.marca_equipo }}</td>
              <td>{{ equipo.modelo_equipo }}</td>
              <td>{{ equipo.serial_equipo }}</td>
              <td>{{ equipo.fecha_equipo }}</td>
              <td>{{ equipo.fecha_garantia }}</td>
              <td>{{ equipo.usuario_nombre }}</td>
              <td>
                <button @click="editarEquipo(equipo)">Editar</button>
                <button @click="eliminarEquipo(equipo.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  const { axios, url } = require('../config');
  
  export default {
    props: ['equipos'],
    
    methods: {
      editarEquipo(equipo) {
        // Implementa la lógica para editar el equipo
      },
      eliminarEquipo(equipoId) {
        // Implementa la lógica para eliminar el equipo
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilos específicos del componente */
  </style>
  