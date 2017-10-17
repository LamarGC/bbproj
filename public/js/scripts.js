Backbone.Model.prototype.idAttribute = '_id';

//MODELS
var user = Backbone.Model.extend({
	url: '/user',
	defaults: {
		username: '',
		email: '',
		password: '',
		passwordConf: ''
	},
	initialize: function(){
		console.log('A new user model was created');
	}
});

var VehicleData = Backbone.Model.extend({
	dafaults:{
		name: '',
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
	url: 'http://localhost:3000/api/vehicledatas'
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

		this.$('.name').html('<input type="text" class="form-control name-update" value="' + name + '">');
		this.$('.category').html('<input type="text" class="form-control category-update" value="' + category + '">');
		this.$('.cost').html('<input type="text" class="form-control cost-update" value="' + cost + '">');
		this.$('.date').html('<input type="text" class="form-control date-update" value="' + date + '">');
		this.$('.description').html('<input type="text" class="form-control description-update" value="' + description + '">');

	},
	delete: function(){
		this.model.destroy({
			success: function(response){
				console.log('successfully DELETED vehicle with _id: ' + response.toJSON()._id);
			},
			error: function(){
				console.log('failed to DELETE vehicle');
			}
		});
	},
	update: function(){
		var name = this.$('.name-update').val();
		var category = this.$('.category-update').val();
		var cost = this.$('.cost-update').val();
		var date = this.$('.date-update').val();
		var description = this.$('.description-update').val();

		if(!$('.cost-update').val() || isNaN($('.cost-update').val())){
			$('.alert.alert-danger').show();
			return;
		}

		this.model.set({name: name,
						category: category,
						cost: cost,
						date: date,
						description, description});

		this.model.save(null, {
			success: function(response){
				$('.alert.alert-danger').hide();
				console.log('successfully UPDATED vehicledata with _id: ' + response.toJSON()._id);
			},
			error: function(response){
				$('.alert.alert-danger').show();
				console.log('failed to update vehicledata');
			}
		});
	},
	cancel: function(){
		vehicleDatasView.render();
	},
	initialize: function(){
		console.log('a new VehicleDataView has been created');
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
		console.log('a new VehicleDatasView has been created');
		this.model.on('add', this.render, this);
		this.model.on('change', this.render, this);
		this.model.on('remove', this.render, this);

		this.model.fetch({
			success: function(response){
				_.each(response.toJSON(), function(item){
					console.log('Sucessfully GOT vehicle with _id '  + item._id);
				})
			},
			error: function(){
				console.log('failed to get vehicle!');
			}
		})
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
$('#datepicker').datepicker();
$(document).ready(function(){
	$('.add-vehicledata').on('click', function(){
		console.log('clicked to add vehicledata');
		if(!$('.cost-input').val() || isNaN($('.cost-input').val())){
			$('.alert.alert-danger').show();
			return;
		}
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

		vehicleData.save(null, {
			success: function(response){
				$('.alert.alert-danger').hide();
				console.log('Successfully saved vehicledata with _id ' + response.toJSON()._id);
			},
			error: function(){
				$('.alert.alert-danger').show();
				console.log('failed to save vehicledata');
			}
		});
	});
});