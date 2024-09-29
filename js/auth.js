// js/auth.js
$(document).ready(function() {
    // Registro con correo electrónico y campos adicionales
    $('#registerForm').on('submit', function(e) {
      e.preventDefault();
      
      // Obtener los valores de los campos del formulario
      const nombre = $('#nombre').val();
      const apellido = $('#apellido').val();
      const email = $('#email').val();
      const telefono = $('#telefono').val();
      const pais = $('#pais').val();
      const ciudad = $('#ciudad').val();
      const password = $('#password').val();
      
      // Crear usuario con correo y contraseña en Firebase
      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          
          // Crear documento del usuario en Firestore con los datos adicionales
          db.collection('users').doc(user.uid).set({
            nombre: nombre,
            apellido: apellido,
            email: email,
            telefono: telefono,
            pais: pais,
            ciudad: ciudad,
            rol: 'lector'  // Asignar rol automáticamente como lector
          }).then(() => {
            alert('Registro exitoso');
            window.location.href = 'index.html';  // Redirigir al login o página principal
          }).catch((error) => {
            alert('Error al guardar los datos en Firestore: ' + error.message);
          });
          
        })
        .catch((error) => {
          alert('Error en el registro: ' + error.message);
        });
    });
  
    // Inicio de sesión con correo electrónico
    $('#loginForm').on('submit', function(e) {
      e.preventDefault();
      const email = $('#loginEmail').val();
      const password = $('#loginPassword').val();
      
      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          alert('Inicio de sesión exitoso');
          window.location.href = 'home.html';  // Redirigir al home o página principal
        })
        .catch((error) => {
          alert('Error al iniciar sesión: ' + error.message);
        });
    });
  
    // Registro e inicio de sesión con Google
    $('#googleLogin, #googleRegister').click(function() {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider)
        .then((result) => {
          const user = result.user;
          
          // Guardar datos del usuario en Firestore, usando los datos de Google
          db.collection('users').doc(user.uid).set({
            nombre: user.displayName.split(' ')[0],
            apellido: user.displayName.split(' ')[1] || '',
            email: user.email,
            telefono: '',  // Se deja vacío
            pais: '',      // Se deja vacío
            ciudad: '',    // Se deja vacío
            rol: 'lector'  // Asignar rol automáticamente
          }, { merge: true }).then(() => {
            window.location.href = 'home.html';  // Redirigir al home o página principal
          }).catch((error) => {
            alert('Error al guardar los datos de Google en Firestore: ' + error.message);
          });
        })
        .catch((error) => {
          alert('Error al iniciar sesión con Google: ' + error.message);
        });
    });
  
    // Recuperar contraseña
    $('#resetPasswordForm').on('submit', function(e) {
      e.preventDefault();
      const email = $('#resetEmail').val();
      
      auth.sendPasswordResetEmail(email)
        .then(() => {
          alert('Correo de recuperación enviado');
          window.location.href = 'index.html';  // Redirigir al login
        })
        .catch((error) => {
          alert('Error al enviar correo de recuperación: ' + error.message);
        });
    });
  });
  