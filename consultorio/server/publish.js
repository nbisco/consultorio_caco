//Coleccion Pacientes -- {	nombre: 		String,
//							fecha_de_nac:	Fecha,
//						  	dni:    		String,
//							obra_social: 	String,
//							edad:    		String,
//							telefono:  		String,
//							direccion:      String}
Pacientes = new Meteor.Collection('pacientes');

Meteor.publish('pacientes', function (buscar, apellido) {
	if (buscar && !apellido)
		return Pacientes.find();
	else
		return Pacientes.find({apellido:apellido});
});

//Coleccion Diagnosticos -- {	paciente_id: 		String,
//						  		timestamp:    		Number,
//								medico_derivante: 	String,
//								descripcion_diag:	String,
//								tratamiento:   		String}
Diagnosticos = new Meteor.Collection('diagnosticos');

Meteor.publish('diagnosticos', function (paciente_id) {
	check(paciente_id, String);
	return	Diagnosticos.find({paciente_id:paciente_id});
});
