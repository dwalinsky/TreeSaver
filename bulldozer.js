function Bulldozer(speed, start_loc, start_dir) {
    this.intact = true;
    this.speed = speed;
    this.location = start_loc;
    this.direction = (typeof start_dir !== 'undefined' ? start_dir : 2);

    this.timer = false;
}

Bulldozer.prototype.move = function() {
    if(!this.intact)
        return false;

    // Move bulldozer
    var prev_loc = new Location(this.location.x, this.location.y);
    this.location = getNewLoc(this.location, this.direction);
    var new_loc_stat = tileStat[this.location.y][this.location.x];

    // Demolish tree (if there is one)
    if (new_loc_stat == 1) {
        tileStat[this.location.y][this.location.x] = 2;
        new_loc_stat = 2;
        checkPools();
    }

    // Choose new direction
    var possible_directions = [], tree_in_sight = false,
        node_exits = nodes[this.location.y][this.location.x];
    for(var i=0;i<4;i++) {
        // Can't reverse or go into a wall
        if(i == (this.direction + 2) % 4 || node_exits.charAt(i) == "1")
            continue;

        var possible_new_location = getNewLoc(this.location, i),
            possible_new_loc_stat = tileStat[possible_new_location.y][possible_new_location.x];

        if(tree_in_sight && possible_new_loc_stat != 1)
            continue;

        if(possible_new_loc_stat == 1 && !tree_in_sight) {
            tree_in_sight = true;
            possible_directions = [];
        }

        possible_directions.push(i);
    }
    if(!possible_directions.length)
        return false;

    this.direction = possible_directions[Math.floor(Math.random()*possible_directions.length)];

    // Show the new tile
    processTile(prev_loc);
    processTile(this.location);

    checkWeapon(this.location, true, false, false);

    var _this = this;
    this.timer = setTimeout(function() {_this.move()}, _this.speed)
};

Bulldozer.prototype.destroy = function() {
    clearTimeout(this.timer);
    this.intact = false;
};

Bulldozer.prototype.start = function() {
    if(tileStat[this.location.y][this.location.x] == 1)
        tileStat[this.location.y][this.location.x] = 2;
    processTile(this.location);
    var _this = this;
    this.timer = setTimeout(function() {_this.move()}, _this.speed);
};

function checkForBulldozers(loc) {
    for(var i=0;i<bulldozers.length;i++) {
       if(bulldozers[i].intact && bulldozers[i].location.x == loc.x && bulldozers[i].location.y == loc.y) {
            return bulldozers[i];
        }
    }
    return false;
}
