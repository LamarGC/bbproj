//MODELS
var user = Backbone.Model.extend({
	url: '/user',
	defaults: {
		first_name: '',
		last_name: '',
		email: '',
		username: '',
		password: '',
		vehicles: []
	},
	initialize: function(){
		console.log('A new user model was created');
	}
});

var VehicleData = Backbone.Model.extend({
	dafaults:{
		vehicleName: '',
		category: '',
		cost: '',
		date: '',
		description: '',
		action: ''
	},
	initialize: function(){
		console.log('A new vehicle data model was initialized');
	}
});


//COLLECTIONS
var Users = Backbone.Collection.extend({
	//url: 'http://localhost:3000/api/users'
});

var VehicleDatas = Backbone.Collection.extend({
	//url: 'http://localhost:3000/api/vehicledatas'
});

var users = new Users();
var vehicleDatas = new VehicleDatas();


//VIEWS
var VehicleDataView = Backbone.View.extend({
	model: new VehicleData(),
	tagName: 'tr',
	events: {
		'click .edit-row': 'edit',
		'click .delete-row': 'delete',
		'click .update-row': 'update',
		'click .cancel': 'cancel'
	},
	edit: function(){
		$('.edit-row').hide();
		$('.delete-row').hide();
		this.$('.update-row').show();
		this.$('.cancel').show();

		var name = this.$('.name').html();
		var category = this.$('.category').html();
		var cost = this.$('.cost').html();
		var date = this.$('.date').html();
		var description = this.$('.description').html();

		this.$('.name').html('<input type="text" class="form-control name-update" value=' + name + '>');
		this.$('.category').html('<input type="text" class="form-control category-update" value=' + category + '>');
		this.$('.cost').html('<input type="text" class="form-control cost-update" value=' + cost + '>');
		this.$('.date').html('<input type="text" class="form-control date-update" value=' + date + '>');
		this.$('.description').html('<input type="text" class="form-control description-update" value=' + description + '>');

	},
	delete: function(){

	},
	update: function(){

	},
	cancel: function(){

	},
	initialize: function(){
		console.log('a new VehicleView has been created');
		this.template = _.template($('.vehicledata-list-template').html());
	},
	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}

});

var VehicleDatasView = Backbone.View.extend({
	model: vehicleDatas,
	el: $('.vehicles-list'),
	initialize: function(){
		console.log('a new VehiclesView has been created');
		this.model.on('add', this.render, this);
		this.model.on('change', this.render, this);
		this.model.on('remove', this.render, this);
	},
	render: function(){
		var self = this;
		this.$el.empty('');
		_.each(this.model.toArray(), function(vehicleData){
			self.$el.append((new VehicleDataView({model: vehicleData}).render().$el));
		});
		return this;
	}

});

var vehicleDatasView = new VehicleDatasView();

//JQUERY
$(document).ready(function(){
	$('.add-vehicledata').on('click', function(){
		console.log('clicked to add vehicledata');
		var vehicleData = new VehicleData({
			name: $('.name-input').val(),
			category: $('.category-input').val(),
			cost: $('.cost-input').val(),
			date: $('.date-input').val(),
			description: $('.description-input').val()
		});
		$('.name-input').val('');
		$('.category-input').val('');
		$('.cost-input').val('');
		$('.date-input').val('');
		$('.description-input').val('');
		vehicleDatas.add(vehicleData);
	});
});