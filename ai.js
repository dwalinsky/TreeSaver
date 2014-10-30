
function AI(speed, start_loc, start_dir) {
    this.intact = true;
    this.speed = speed;
    this.location = start_loc;
    this.direction = (typeof start_dir !== 'undefined' ? start_dir : 2);

    this.timer = false;
}
AI.prototype.destroy = function() {
    clearTimeout(this.timer);
    this.intact = false;
};

AI.prototype.start = function() {
    if(this instanceof Bulldozer) {
        if(tileStat[this.location.y][this.location.x] == 1)
            tileStat[this.location.y][this.location.x] = 2;
        processTile(this.location);
    }

    var _this = this;
    this.timer = setTimeout(function() {_this.move()}, _this.speed);
};

AI.prototype.move = function() {
    if(!this.intact)
        return false;

    if(this instanceof Human) {
        // Check if bunny is in front of human and throw rock if so
        var in_view = this.checkLOS();
        if(in_view) {
            this.throwRock();
            return false;
        }
    }

    // Move AI 
    var prev_loc = new Location(this.location.x, this.location.y);
    this.location = getNewLoc(this.location, this.direction);
    if(this.location.x < 0 || this.location.x >= col_count || this.location.y < 0 || this.location.y >= row_count) {
        this.destroy();
        processTile(prev_loc);
        return false;
    }

    var new_loc_stat = tileStat[this.location.y][this.location.x];

    if(this instanceof Bulldozer) {
        // Demolish tree (if there is one)
        if (new_loc_stat == 1) {
            tileStat[this.location.y][this.location.x] = 2;
            new_loc_stat = 2;
            checkPools();
        }
    }

    // Choose new direction
    var possible_directions = [], tree_in_sight = false,
        node_exits = nodes[this.location.y][this.location.x];
    for(var i=0;i<4;i++) {
        // Can't reverse or go into a wall
        if(i == (this.direction + 2) % 4 || node_exits.charAt(i) == "1") {
            continue;
        }

        var possible_new_location = getNewLoc(this.location, i);
        if(typeof tileStat[possible_new_location.y] == 'undefined' || typeof tileStat[possible_new_location.y][possible_new_location.x] == 'undefined' ) {
            console.log(possible_new_location, i);
            possible_directions.push(i);
            continue;
        }
        var possible_new_loc_stat = tileStat[possible_new_location.y][possible_new_location.x],
            new_loc_was_city = city_tiles[possible_new_location.y][possible_new_location.x];

        if(this instanceof Bulldozer) {
            if(new_loc_was_city || (tree_in_sight && possible_new_loc_stat != 1))
                continue;
            if(possible_new_loc_stat == 1 && !tree_in_sight) {
                tree_in_sight = true;
                possible_directions = [];
            }
        }
        else {
            if(!new_loc_was_city)
                continue;
        }

        possible_directions.push(i);
    }

    if(!possible_directions.length)
        return false;

    this.direction = possible_directions[Math.floor(Math.random()*possible_directions.length)];

    // Show the new tile
    processTile(prev_loc);
    processTile(this.location);

    // Check if bulldozer rode over bunny
    if(this instanceof Bulldozer)
        checkWeapon(this.location, true, false, false);

    var _this = this;
    this.timer = setTimeout(function() {_this.move()}, _this.speed)
};

function Bulldozer(speed, start_loc, start_dir) {
    AI.apply(this, arguments);
}
Bulldozer.prototype = Object.create(AI.prototype);
Bulldozer.prototype.constructor = Bulldozer;

function Human(speed, start_loc, start_dir) {
    AI.apply(this, arguments);
}
Human.prototype = Object.create(AI.prototype);
Human.prototype.constructor = Human;
Human.prototype.checkLOS = function() {
    var loc = new Location(this.location.x, this.location.y);
    while(loc.x > 0 && loc.x < col_count && loc.y > 0 && loc.y < row_count) {
        if(nodes[loc.y][loc.x].charAt(this.direction) == '1')
            break;
        loc = getNewLoc(loc, this.direction);
        if(loc.x == my_loc.x && loc.y == my_loc.y) {
            return true;
        }
    }
    return false;
};

Human.prototype.throwRock = function() {
    var _this = this;
    this.timer = setTimeout(function() {
        if(_this.intact) {
            rocks.push(new Rock(_this.location, _this.direction));

            _this.timer = setTimeout(function() {
                _this.move();
            }, _this.speed)
        }
    }, _this.speed * 0.5)
};

function Rock(location, direction) {
    this.intact = true;
    this.hit = false;

    this.location = location;
    this.direction = direction;
    this.distance_traveled = 0;

    var _this = this;
    this.timer = setTimeout(function() {
        _this.move();
    }, 150);
}
Rock.prototype.move = function() {
    showTile(2, 'blank', this.location);

    if(!this.intact) {
        return false;
    }
    if(!checkDirection(this.location, this.direction) || this.distance_traveled > 5) {
        for(var i=0;i<rocks.length;i++) {
            if(rocks[i] === this) {
                rocks.splice(i, 1);
            }
        }
        this.intact = false;
        return true;
    }
    this.location = getNewLoc(this.location, this.direction);
    showTile(2, 'bullet', this.location);

    if(checkWeapon(this.location, true, false, true)) {
        this.intact = false;
        this.hit = true;
    }

    var _this = this;
    this.timer = setTimeout(function() {
        _this.move();
    }, 120+(this.distance_traveled*5)+(this.hit ? 200 : 0));

    this.distance_traveled++;
};

function checkForAI(ai_list, loc, return_all) {
    if(typeof return_all == 'undefined')
        return_all = false;

    var to_return = [];
    for(var i=0;i<ai_list.length;i++) {
       if(ai_list[i].intact && loc.compareTo(ai_list[i].location)) {
            if(!return_all)
                return ai_list[i];
            to_return.push(ai_list[i])
        }
    }

    if(return_all)
        return to_return;
    return false;
}




