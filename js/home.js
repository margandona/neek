$(document).ready(function() {

  // Verificar si el usuario está autenticado
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const userId = user.uid; // Definir userId solo si el usuario está autenticado

      // Obtener los datos del perfil del usuario actual
      db.collection('users').doc(userId).get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          $('#nombre').val(data.nombre);
          $('#apellido').val(data.apellido);
          $('#email').val(data.email); // Este campo es solo lectura
          $('#telefono').val(data.telefono);
          $('#pais').val(data.pais);
          $('#ciudad').val(data.ciudad);

          // Mostrar la sección de administración solo si el rol es administrador
          if (data.rol === 'administrador') {
            $('#adminSection').show();
            cargarUsuarios();
          }
        } else {
          alert('No se encontraron datos del usuario.');
        }
      });
    } else {
      window.location.href = 'login.html'; // Redirigir si no está autenticado
    }
  });

  // Funcionalidad de cerrar sesión
  $('#logoutBtn').click(function() {
    auth.signOut().then(() => {
      window.location.href = 'index.html'; // Redirigir al login después de cerrar sesión
    }).catch((error) => {
      alert('Error al cerrar sesión: ' + error.message);
    });
  });

  // Actualizar los datos del perfil de usuario
  $('#userProfileForm').on('submit', function(e) {
    e.preventDefault();

    const userId = auth.currentUser ? auth.currentUser.uid : null; // Asegurarse de que userId no esté vacío
    if (!userId) {
      alert('No se pudo obtener el ID del usuario.');
      return;
    }

    const nombre = $('#nombre').val();
    const apellido = $('#apellido').val();
    const telefono = $('#telefono').val();
    const pais = $('#pais').val();
    const ciudad = $('#ciudad').val();

    db.collection('users').doc(userId).update({
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      pais: pais,
      ciudad: ciudad
    }).then(() => {
      alert('Datos actualizados correctamente.');
    }).catch((error) => {
      alert('Error al actualizar los datos: ' + error.message);
    });
  });

  // Función para cargar los usuarios (solo administradores)
  function cargarUsuarios() {
    db.collection('users').get().then((querySnapshot) => {
      $('#usersTableBody').empty(); // Limpiar la tabla antes de llenarla
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const row = `
          <tr>
            <td>${userData.nombre}</td>
            <td>${userData.apellido}</td>
            <td>${userData.email}</td>
            <td>${userData.telefono}</td>
            <td>${userData.pais}</td>
            <td>${userData.ciudad}</td>
            <td>${userData.rol}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="editarUsuario('${doc.id}')">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="eliminarUsuario('${doc.id}')">Eliminar</button>
            </td>
          </tr>`;
        $('#usersTableBody').append(row);
      });
    });
  }

  // Editar usuario (abrir modal y cargar datos)
  window.editarUsuario = function(userId) {
    db.collection('users').doc(userId).get().then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        $('#editNombre').val(userData.nombre);
        $('#editApellido').val(userData.apellido);
        $('#editTelefono').val(userData.telefono);
        $('#editPais').val(userData.pais);
        $('#editCiudad').val(userData.ciudad);
        $('#editRol').val(userData.rol);  // Establecer el valor del select de rol

        $('#editUserModal').modal('show'); // Mostrar modal
        $('#editUserForm').off('submit').on('submit', function(e) {
          e.preventDefault();

          // Actualizar datos en Firestore, incluido el rol seleccionado
          db.collection('users').doc(userId).update({
            nombre: $('#editNombre').val(),
            apellido: $('#editApellido').val(),
            telefono: $('#editTelefono').val(),
            pais: $('#editPais').val(),
            ciudad: $('#editCiudad').val(),
            rol: $('#editRol').val()  // Obtener el valor del select de rol
          }).then(() => {
            $('#editUserModal').modal('hide'); // Ocultar modal
            cargarUsuarios(); // Recargar la tabla
          }).catch((error) => {
            alert('Error al actualizar usuario: ' + error.message);
          });
        });
      }
    });
  };

  // Eliminar usuario (solo administradores)
  window.eliminarUsuario = function(userId) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      db.collection('users').doc(userId).delete().then(() => {
        alert('Usuario eliminado.');
        cargarUsuarios(); // Recargar la tabla
      }).catch((error) => {
        alert('Error al eliminar usuario: ' + error.message);
      });
    }
  };
});
