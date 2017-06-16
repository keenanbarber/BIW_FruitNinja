// Creates the game groups and prefabs

var FruitNinja = FruitNinja || {}; // Creates namespace if haven't already. 

FruitNinja.LevelState = function() {
	"use strict"; 
	Phaser.State.call(this);

	this.prefab_classes = {
		"fruit_spawner": FruitNinja.FruitSpawner.prototype.constructor, 
		"bomb_spawner": FruitNinja.BombSpawner.prototype.constructor, 
		"background": FruitNinja.Prefab.prototype.constructor
	};
};

FruitNinja.LevelState.prototype = Object.create(Phaser.State.prototype);
FruitNinja.LevelState.prototype.constructor = FruitNinja.LevelState;

FruitNinja.LevelState.prototype.init = function(level_data) {
	"use strict";
	this.level_data = level_data;

	this.scale.scaleMode = Phaser.ScaleManaher.SHOW_ALL;
	this.scale.pageAlignHorizontally = true;
	this.scale.pageAlignVertically = true;

	// Start physics system
	this.game.physics.startSystem(Phaser,Physics.ARCADE);
	this.game.physics.arcade.gravity.y = 1000;

	this.MINIMUM_SWIPE_LENGTH = 50;

	this.score = 0;
};

FruitNinja.LevelState.prototype.create = function() {
	"use strict"; 
	var group_name, prefab_name;

	// Create groups
	this.groups = {}; 
	this.level_data.groups.forEach(function(group_name) {
		this.groups[group_name] = this.game.add.group();
	}, this);

	// Create prefabs
	this.prefabs = {};
	for(prefab_name in this.level_data.prefabs) {
		if(this.level_data.prefabs.hasOwnProperty(prefab_name)) {
			// Create prefab
			this.create_prefab(prefab_name, this.level_data.prefabs[prefab_name]);
		}
	}

	// Add events to check for swipe
	this.game.input.onDown.add(this.start_swipe, this);
	this.game.input.onUp.add(this.end_swipe, this);

	this.init_hud();
};

FruitNinja.LevelState.prototype.create_prefab = function(prefab_name, prefab_data) {
	"use strict";
	var prefab;
	// Create object according to its type
	if(this.prefab_classes.hasOwnProperty(prefab_data.type)) {
		prefab = new this.prefab_classes[prefab_data.type](
			this, prefab_name, prefab_data.position, prefab_data.properties);
	}
};

FruitNinja.LevelState.prototype.game_over = function() {
	"use strict";
	this.game.state.restart(true, false, this.level_data);
};

FruitNinja.LevelState.prototype.start_swipe = function (pointer) {
    "use strict";
    this.start_swipe_point = new Phaser.Point(pointer.x, pointer.y);
};

FruitNinja.LevelState.prototype.end_swipe = function (pointer) {
    "use strict";
    var swipe_length, cut_style, cut;
    this.end_swipe_point = new Phaser.Point(pointer.x, pointer.y);
    swipe_length = Phaser.Point.distance(this.end_swipe_point, this.start_swipe_point);
    // if the swipe length is greater than the minimum, a swipe is detected
    if (swipe_length >= this.MINIMUM_SWIPE_LENGTH) {
        // create a new line as the swipe and check for collisions
        cut_style = {line_width: 5, color: 0xE82C0C, alpha: 1}
        cut = new FruitNinja.Cut(this, "cut", {x: 0, y: 0}, {group: "cuts", start: this.start_swipe_point, end: this.end_swipe_point, duration: 0.3, style: cut_style});
        this.swipe = new Phaser.Line(this.start_swipe_point.x, this.start_swipe_point.y, this.end_swipe_point.x, this.end_swipe_point.y);
        this.groups.fruits.forEachAlive(this.check_collision, this);
        this.groups.bombs.forEachAlive(this.check_collision, this);
    }
}