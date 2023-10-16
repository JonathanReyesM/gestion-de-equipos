<template>
  <div class="container">
    <h1>Inicio de sesión</h1>
    <form action="/login" method="post">
      <input type="email" name="email" placeholder="Correo electrónico">
      <input type="password" name="password" placeholder="Contraseña">
      <button type="submit">Iniciar sesión</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    login() {
      // Validar datos del formulario
      if (!this.email || !this.password) {
        alert('Por favor, complete todos los campos.');
        return;
      }

      // Iniciar sesión al usuario
      const { email, password } = this.$data; // ESLint may not detect this usage
      this.$axios.post('/login', {
        email,
        password,
      })
        .then(({ data }) => {
          this.$router.push('/dashboard');
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    }
  },
};
</script>
