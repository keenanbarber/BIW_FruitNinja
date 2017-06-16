// Loads all of the game assets and starts the Level State.

var FruitNinja = FruitNinja || {}; /* Created namespace if it hasn't yet been created. */

FruitNinja.LoadingState = function() {
	"use strict";
	Phaser.State.call(this);
};

FruitNinja.prototype = Object.create(Phaser.State.prototype);
FruitNinja.prototype.constructor = FruitNinja.LoadingState;

FruitNinja.LoadingState.prototype.init = function(level_data) { 
	// Recieves level_data from BootState and stores it. 
	"use strict";
	this.level_data = level_data;
};

FruitNinja.LoadingState.prototype.preload = function() {
	"use strict"; 
	var assets, asset_loader, asset_key, asset;
	assets = this.level_data.assets;
	for(asset_key in assets) {
		if(assets.hasOwnProperty(asset_key)) { // Makes sure the key exists in the assets.
			asset = assets[asset_key];
			switch(asset.type) {
				case "image": 
					this.load.image(asset_key, asset.source);
					break; 
				case "spritesheet": 
					this.load.spritesheet(asset_key, asset_source, asset.frame_width, asset.frame_height, asset.frames, asset.margin, asset.spacing);
					break;
			}
		}
	}
};

FruitNinja.LoadingState.prototype.create = function() {
	"use strict"; 
	this.game.state.start("GameState", true, false, this.level_data);
};