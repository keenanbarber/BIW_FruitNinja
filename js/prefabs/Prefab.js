var FruitNinja = FruitNinja || {}; // Create namespace if haven't already. 
 
FruitNinja.Prefab = function (game_state, name, position, properties) {
    "use strict";
    Phaser.Sprite.call(this, game_state.game, position.x, position.y, properties.texture);
    
    this.game_state = game_state;
    
    this.name = name;
    
    this.game_state.groups[properties.group].add(this);
    this.frame = properties.frame;
    
    this.game_state.prefabs[name] = this;
};
 
FruitNinja.Prefab.prototype = Object.create(Phaser.Sprite.prototype);
FruitNinja.Prefab.prototype.constructor = FruitNinja.Prefab;