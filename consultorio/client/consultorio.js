Pacientes = new Meteor.Collection('pacientes');
Diagnosticos = new Meteor.Collection('diagnosticos');

//VARIABLES DE SESION...
Session.set('buscar', true);
Session.set('apellido', null);
Session.set('paciente_id', null);
Session.set('agregando_paciente', false);
Session.set('agregando_diagnostico', false);

Deps.autorun(function () {
	var buscar = Session.get('buscar');
	var apellido = Session.get('apellido');
	if (buscar)
		Meteor.subscribe('pacientes',buscar, apellido);
});


Deps.autorun(function () {
	var paciente_id = Session.get('paciente_id');
  	if (paciente_id)
    	Meteor.subscribe('diagnosticos', paciente_id);
});



//TEMPLATE AGREGAR_PACIENTE....
Template.acciones_paciente.helpers({
	add_paciente: function () {
		return Session.equals('agregando_paciente', true);
	}
});
	//EVENTS...
	Template.acciones_paciente.events({
		'click #btnAddPaciente': function (e, t) {
			Session.set('agregando_paciente', true);
			Session.set('paciente_id', null);
			Meteor.flush();
			focusText(t.find('#add-apellido'));
		},
		'submit .agregar-paciente' : function (e) {
			e.preventDefault();

			var paciente = {
				apellido: $(e.target).find('[id=add-apellido]').val(),
				nombre: $(e.target).find('[id=add-nombre]').val(),
				edad:$(e.target).find('[id=add-edad]').val(),
				dni: $(e.target).find('[id=add-dni]').val(),
				direccion:$(e.target).find('[id=add-direccion]').val(),
				telefono:$(e.target).find('[id=add-telefono]').val(),
				obra_social: $(e.target).find('[id=add-obra-social]').val(),
			};

			Pacientes.insert(paciente);
			Session.set('agregando_paciente', false);
		},
		'submit #buscar': function(e) {
			e.preventDefault();

			var apellido = $(e.target).find('[id=apellido]').val();
			Session.set('apellido', apellido);
			
		}

	});	
		



//TEMPLATE LISTA_PACIENTES...
Template.lista_pacientes.helpers({
	pacientes: function () {
		return	Pacientes.find({}, {sort:{apellido:1}});
	},
	paciente_status: function () {
		if (Session.equals('paciente_id', this._id))
			return 'seleccionado';
		else
			return '';
	},
	edicion_activada: function () {
		return Session.equals('paciente_id', this._id);
	},
});
	//EVENTS....
	Template.lista_pacientes.events({
		'click .editar': function () {
			Session.set('paciente_id', this._id);
			Session.set('agregando_paciente', false);
			Session.set('agregando_diagnostico', false);
		},
		'click .no-editar': function() {
			Session.set('paciente_id', null);
		},

	});



Session.set('editar_tratamiento', null);
//TEMPLATE DETALLES_DEL_PACIENTE....
Template.detalles_del_paciente.helpers({
	diagnosticos: function () {
		return	Diagnosticos.find();
	},
	add_diagnostico: function () {
		return Session.equals('agregando_diagnostico', true);
	},
	paciente: function () {
		var paciente = Pacientes.findOne({_id:Session.get('paciente_id')});
		return paciente;
	},
	editar_tratamiento: function () {
		return	Session.equals('editar_tratamiento', this._id);
	},
});
	//EVENTS...
	Template.detalles_del_paciente.events({
		'click #btnAddDiagnostico': function (e, t) {
			Session.set('agregando_diagnostico', true);
			Meteor.flush();
			focusText(t.find('#add-descripcion'));
		},
		'submit form': function(e) {
			e.preventDefault();

			var diagnostico = {
				paciente_id: Session.get('paciente_id'),
				descripcion_diag: $(e.target).find('[id=add-descripcion]').val(),
				medico_derivante: $(e.target).find('[id=add-medico-derivante]').val(),
				tratamiento: $(e.target).find('[id=add-tratamiento]').val(),
				observacion: $(e.target).find('[id=add-observacion]').val(),
			}

			Diagnosticos.insert(diagnostico);
			Session.set('agregando_diagnostico', false);
		},
		'click .btnEditarTratamiento' : function(e, t) {
			Session.set('editar_tratamiento', this._id);
			Meteor.flush();
			focusText(t.find('#editar-tratamiento'));
		},
		'keyup #editar-tratamiento': function(e, t) {
		if (e.which === 13) {
			var tratVal = String(e.target.value || '');
			if (tratVal) {
				diagnostico_id = Session.get('editar_tratamiento');
				Diagnosticos.update({_id:diagnostico_id}, 
					{$set: {tratamiento:tratVal}});
			}
			Session.set('editar_tratamiento', null);
			}
		},
	});	


//Funciones Helpers Genericas.
function focusText(i) {
	i.focus();
	i.select();
};

