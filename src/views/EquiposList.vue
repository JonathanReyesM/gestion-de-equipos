<template>
    <div>
      <EquipoFormComponent ref="EquipoFormComponent"/>
      <h2>Lista de Equipos</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Marca</th>
            <th>Modelo</th>
            <th>No. Serie</th>
            <th>Categoría</th>
            <th>Descripción Equipo</th>
            <th>Usuario Asignado</th>
            <th>Fecha de asignación</th>
            <th>Fecha de garantía</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="equipo in equipos" :key="equipo.id">
            <td>{{ equipo.marca_equipo }}</td>
            <td>{{ equipo.modelo_equipo }}</td>
            <td>{{ equipo.serial_equipo }}</td>
            <td>{{ equipo.nombre_categoria }}</td>
            <td>{{ equipo.descripcion_equipo }}</td>
            <td>{{ equipo.nombre_usuario }} {{ equipo.apellidoP_usuario }} {{ equipo.apellidoM_usuario }}</td>            
            <td>{{ equipo.fecha_equipo }}</td>
            <td>{{ equipo.fecha_garantia }}</td>
            <td>
              <button @click="editarEquipo(equipo)">Editar</button>
              <button @click="eliminarEquipo(equipo.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
<script>
import EquipoFormComponent from '@/components/EquipoFormComponent.vue';
const { axios, url } = require('../config');
  export default {
    data() {
        return {
            equipos: [],
        };
    },
    mounted() {
        this.cargarEquipos();
    },
    methods: {
        async cargarEquipos() {
            try {
                const token = localStorage.getItem('token');
                console.log(token);
                if (token === null || token === undefined) {
                    console.error('Error al obtener Token');
                }
                else {
                    const response = await axios.get(url + '/api/equipos/main', { headers: {
                            Authorization: `Bearer ${token}`
                        } });
                    if (response.status === 200) {
                        this.equipos = response.data;
                    }
                    else {
                        console.error('Error al cargar equipos:', response.status, response.statusText);
                    }
                }
            }
            catch (error) {
                if (error.response) {
                    console.error('Respuesta del servidor:', error.response.data);
                    console.error('Código de estado:', error.response.status);
                }
                else if (error.request) {
                    console.error('No se recibió respuesta del servidor', error.request);
                }
                else {
                    console.error('Error en la configuración de la solicitud:', error.message);
                }
            }
        },
        async editarEquipo(equipo) {
          this.$refs.EquipoFormComponent.abrirModal();
            console.log(equipo);
        }
    },
    components: { EquipoFormComponent }
};
</script>