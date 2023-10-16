<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Registro de Usuario</div>
          <div class="card-body">
            <form @submit.prevent="registrarUsuario">
              <div class="form-group">
                <input type="text" class="form-control" v-model="nombre" placeholder="Nombre" required>
              </div>
              <div class="form-group">
                <input type="text" class="form-control" v-model="apellidoPaterno" placeholder="Apellido Paterno" required>
              </div>
              <div class="form-group">
                <input type="text" class="form-control" v-model="apellidoMaterno" placeholder="Apellido Materno" required>
              </div>
              <div class="form-group">
                <input type="text" class="form-control" v-model="numeroControl" placeholder="Número de Control" required>
              </div>
              <div class="form-group">
                <select class="form-control" v-model="puesto" required>
                  <option value="" disabled>Selecciona un puesto</option>
                  <option v-for="puesto in puestos" :key="puesto.id_puesto" :value="puesto.id_puesto">{{ puesto.nombre_puesto }}</option>
                </select>
              </div>
              <div class="form-group">
                <input type="email" class="form-control" v-model="correo" placeholder="Correo Electrónico" required>
              </div>
              <div class="form-group">
                <input type="password" class="form-control" v-model="contrasena" placeholder="Contraseña" required>
              </div>
              <button type="submit" class="btn btn-primary">Registrar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import axios from 'axios';

  export default {
    data() {
      return {
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        numeroControl: "",
        puesto: "",
        correo: "",
        contrasena: "",
        puestos: [] // Obtener la lista de puestos desde tu base de datos o API
      };
    },

    beforeMount() {
      axios.get('http://localhost:3000/api/puestos')
        .then(response => {
          console.log(response.data);
          this.puestos = response.data.puestos;
          // this.$router.push('/dashboard');
        })
        .catch(error => {
          console.error(error.response); // Cambiado de alert a console.error
        });
    },

    methods: {
      registrarUsuario() {
        // Implementa la lógica para enviar los datos del formulario al servidor
        console.log({
          nombre: this.nombre,
          apellidoPaterno: this.apellidoPaterno,
          apellidoMaterno: this.apellidoMaterno,
          numeroControl: this.numeroControl,
          puesto: this.puesto,
          correo: this.correo,
          contrasena: this.contrasena
        });
      }
    },
  };
  </script>
  