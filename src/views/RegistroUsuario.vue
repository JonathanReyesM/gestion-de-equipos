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
const { axios, url } = require('../config');

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
        puestos: []
      };
    },

    beforeMount() {
      axios.get(url + '/api/puestos/puestos')
        .then(response => {
          this.puestos = response.data.puestos;
        })
        .catch(error => {
          console.error(error.response);
        });
    },

    methods: {
      registrarUsuario() {
        // Implementa la lógica para enviar los datos del formulario al servidor
        const userData = {
          nombre_usuario: this.nombre,
          apellidoP_usuario: this.apellidoPaterno,
          apellidoM_usuario: this.apellidoMaterno,
          numero_control: this.numeroControl,
          id_puesto: this.puesto,
          correo_usuario: this.correo,
          contrasena: this.contrasena,
          id_status: 1,
          id_rol: 2
        };
        axios.post('http://localhost:3000/api/signup', userData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          alert("¡Registro exitoso!");
        })
        .catch(error => {
          // Manejar errores, por ejemplo, mostrar un mensaje de error al usuario
          alert(error.response.data.message);
        });
      }
    },
  };
  </script>
  