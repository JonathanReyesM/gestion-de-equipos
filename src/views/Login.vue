<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-danger text-light">Inicio de Sesión</div>
          <div class="card-body">
            <form @submit.prevent="login">
              <div class="form-group">
                <label for="email">Usuario</label>
                <input type="email" class="form-control" id="email" v-model="email" placeholder="Tu correo electrónico" required>
              </div>
              <div class="form-group">
                <label for="password">Contraseña</label>
                <div class="input-group">
                  <input id="pass" type="password" v-model="password" placeholder="Contraseña" required>
                  <div class="input-group-append">
                    <button @click="togglePasswordVisibility" class="btn btn-outline-secondary password-toggle" type="button">
                      <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
                <button @click="irARegistro" class="btn btn-secondary">Registrarse</button>
              </div>
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
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
      if(this.showPassword){
        document.getElementById('pass').type = 'text';
      }else{
        document.getElementById('pass').type = 'password';
      }
    },

    irARegistro() {
      this.$router.push({ name: 'Signin' });
    },

    login() {
      if (!this.email || !this.password) {
        alert('Por favor, complete todos los campos.');
        return;
      }
      const userData = {
        correo_usuario: this.email,
        contrasena: this.password,
      };
      axios.post(url + '/api/login', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        localStorage.setItem('token', response.data.token);
        this.$router.push({ name: 'Devices' });
        //localStorage.setitem( 'token', JSON.stringify(response.data) );
      })
      .catch(error => {
        console.error(error.response);
        // Manejar errores, por ejemplo, mostrar un mensaje de error al usuario
        alert('Error: '+ error);
      });
    }
  },
};
</script>
