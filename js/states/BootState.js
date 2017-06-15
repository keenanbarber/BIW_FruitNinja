// Boot State loads a json file with the level information and starts the Loading State

var FruitNinja = FruitNinja || {}; /* <---- This is used to create a namespace, or a named object
												under which functions and variables can be created
												without polluting the global object. More info: (https://stackoverflow.com/questions/6439579/what-does-var-foo-foo-assign-a-variable-or-an-empty-object-to-that-va) */

FruitNinja.BootState = function() {
	"use strict"; /* <-------- Defines that JavaScript code should be executed in "strict mode".
								It turns previously accepted "bad syntax" into real errors. */
	Phaser.State.call(this);
}; 

FruitNinja.prototype = Object.create(Phaser.State.prototype);
FruitNinja.prototype.constructor = FruitNinja.BootState;

FruitNinja.BootState.prototype.init = function(level_file) {
	"use strict";
	this.level_file = level_file;
};

FruitNinja.BootState.prototype.preload = function() {
	"use strict"; 
	this.load.text("level1", this.level_file);
};

FruitNinja.BootState.prototype.create = function() {
	"use strict"; 
	var level_text, level_data; 
	level_text = this.game.cache.getText("level1");
	level_data = JSON.parse(level_text);
	this.game.state.start("LoadingState", true, false, level_data);
}