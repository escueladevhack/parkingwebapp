$(() => {

  obtenerTodosParqueaderos();

  $('#parqueaderos').on('click', '#btnEntrada', function (evt) {

    $('#nombreClienteEntrada').val('')
    $('#placaCarroEntrada').val('')
    $('#celularClienteEntrada').val('')
    $('#observacionEntrada').val('')
    $('#btnUploadFile').val('')
    $('.determinate').attr('style', `width: 0%`)

    sessionStorage.setItem('imgNewEntrada', null)
    sessionStorage.setItem('idParqueadero', $(this).data('id'))

    const user = null; // TODO

    if (user == null) {
      Materialize.toast(`Para crear la entrada debes estar autenticado`, 4000)
      return
    }

    $('#modalEntrada').modal('open')
  })

  $('#parqueaderos').on('click', '#btnSalida', function (evt) {
    const user = firebase.auth().currentUser;

    if (user == null) {
      Materialize.toast(`Para crear la entrada debes estar autenticado`, 4000)
      return
    }

    console.log($(this).data('identrada'));

    // TODO call functions

    const costo = 0;

    sessionStorage.setItem('costo', costo);
    sessionStorage.setItem('idEntrada', $(this).data('identrada'));
    sessionStorage.setItem('idParqueadero', $(this).data('id'));

    const fechaActual = Utilidad.obtenerFechaHoraActual();

    $('#lblHoraSalida').html(`Hora Salida: ${fechaActual}`);
    $('#lblCosto').html(`Costo: $ ${costo} pesos`);

    $('#modalSalida').modal('open');
  })

  $('#btnTodoParqueaderos').click(() => {
    $('#tituloParqueadero').text('Todos los Parqueaderos');
    obtenerTodosParqueaderos();
  })

  $('#btnParqueaderoLibre').click(async () => {
    $('#tituloParqueadero').text('Parqueaderos Libres');
    const parqueaderoObj = new Parqueadero();
    $('#parqueaderos').empty();
    await parqueaderoObj.consultarParqueaderoLibres(mostrarParqueadero);
  })

  async function obtenerTodosParqueaderos() {
    $('#tituloParqueadero').text('Todos los Parqueaderos');
    const parqueaderoObj = new Parqueadero();
    $('#parqueaderos').empty();
    await parqueaderoObj.consultarTodosParquedaderos(mostrarParqueadero);
  }

  function mostrarParqueadero(parqueadero) {
    let parqueaderoHtml = "";
    if (parqueadero.libre) {
      parqueaderoHtml = Utilidad.obtenerTemplateParqueaderoVacio(
        parqueadero.nombreParqueadero,
        parqueadero.id
      )
    } else {
      parqueaderoHtml = Utilidad.obtenerParqueaderoTemplate(
        parqueadero.nombreParqueadero,
        parqueadero.nombreCliente,
        parqueadero.celularCliente,
        parqueadero.placa,
        parqueadero.observacion,
        parqueadero.imagenLink,
        Utilidad.obtenerFecha(parqueadero.fecha.toDate()),
        parqueadero.id
      )
    }
    $('#parqueaderos').append(parqueaderoHtml);

  }

  $('#btnRegistroEntrada').click(async () => {
    const parqueaderoObj = new Parqueadero();
    const user = null// TODO 

    if (user == null) {
      Materialize.toast(`Para crear la entrada debes estar autenticado`, 4000)
      return
    }

    const nombreCliente = $('#nombreClienteEntrada').val();
    const placaCarro = $('#placaCarroEntrada').val();
    const celularCliente = $('#celularClienteEntrada').val();
    const observacion = $('#observacionEntrada').val();
    const idParqueadero = sessionStorage.getItem('idParqueadero');

    const imagenLink = sessionStorage.getItem('imgNewEntrada') == 'null'
      ? null
      : sessionStorage.getItem('imgNewEntrada')

    try {
      await parqueaderoObj
        .crearEntrada(
          user.uid,
          idParqueadero,
          nombreCliente,
          placaCarro,
          celularCliente,
          observacion,
          imagenLink
        )

      Materialize.toast(`Entrada de vehículo creada correctamente`, 4000)
      $('.modal').modal('close')

    } catch (error) {
      console.error(`Error creando la entrada => ${error}`)
    }
  })

  $('#btnRegistroSalida').click(async () => {
    const parqueaderoObj = new Parqueadero();

    const fechaSalida = firebase.firestore.FieldValue.serverTimestamp();
    const costo = sessionStorage.getItem('costo');
    const idEntrada = sessionStorage.getItem('idEntrada');
    const idParqueadero = sessionStorage.getItem('idParqueadero');

    const trace = firebase.performance().trace('RegistroSalida');
    trace.start();

    try {
      await parqueaderoObj
        .crearSalida(
          idEntrada,
          fechaSalida,
          costo,
          idParqueadero
        );

      trace.stop();

      Materialize.toast(`Salida de vehículo creada correctamente`, 4000)
      $('.modal').modal('close')

    } catch (error) {
      console.error(`Error creando la salida => ${error}`)
    }
  })

  $('#btnUploadFile').on('change', e => {
    const file = e.target.files[0]
    const user = null;// TODO
    const parqueaderoObj = new Parqueadero();
    parqueaderoObj.subirImagenPost(file, user.uid)
  })
})
