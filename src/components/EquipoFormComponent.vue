<template>
  <div>
    <div class="modal" tabindex="-1" role="dialog" ref="equipoModal" v-if="showModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modo === 'agregar' ? 'Agregar Equipo' : 'Actualizar Equipo' }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="cerrarModal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <!-- Formulario para agregar/actualizar equipo -->
            <form @submit.prevent="guardarEquipo">
              <!-- Campos del formulario (puedes agregar más según tus necesidades) -->
              <div class="form-group">
                <label for="marca">Marca:</label>
                <input v-model="equipo.marca" type="text" class="form-control" required>
              </div>
              <div class="form-group">
                <label for="modelo">Modelo:</label>
                <input v-model="equipo.modelo" type="text" class="form-control" required>
              </div>
              <!-- Otros campos del formulario -->

              <!-- Lista desplegable para id_usuario (ejemplo, debes cargar los usuarios desde tu API) -->
              <div class="form-group">
                <label for="id_usuario">Usuario:</label>
                <select v-model="equipo.id_usuario" class="form-control" required>
                  <option v-for="usuario in listaUsuarios" :key="usuario.id" :value="usuario.id">{{ usuario.nombre }}</option>
                </select>
              </div>

              <!-- Botón de guardar -->
              <button type="submit" class="btn btn-primary">{{ modo === 'agregar' ? 'Agregar' : 'Actualizar' }}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
  const { axios, url } = require('../config');
  
  export default {
    data() {
      return {
        modoEdicion: false,
        showModal: false
        // Otros datos del formulario
      };
    },
    methods: {
    abrirModal() {
      this.showModal = true;
      //this.$refs.equipoModal.showModal(); // Abre el modal
    },
    cerrarModal() {
      this.showModal = false;
      //this.$refs.equipoModal.hide(); // Cierra el modal
    },
      async guardarEquipo() {
        // Lógica para guardar o actualizar el equipo
        try {
          if (this.modoEdicion) {
            // Lógica para actualizar el equipo
          } else {
            // Lógica para agregar un nuevo equipo
            this.cerrarModal();
          }
          // Luego, puedes emitir un evento para indicar que se guardó el equipo
          this.$emit('equipoGuardado');
        } catch (error) {
          console.error('Error al guardar el equipo:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilos específicos del componente */
  </style>
  