// Definition for AI timers
function Timer(callback, delay) {
    var id, started, remaining = delay, running

    this.start = function() {
        running = true;
        started = new Date();
        id = setTimeout(callback, remaining);
    };

    this.pause = function() {
        running = false;
        clearTimeout(id);
        remaining -= new Date() - started;
    };
	
	this.end = function() {
		running = false;
		clearTimeout(id);
		remaining = 0;
	};

    this.start()
}


function AI(speed, start_loc, start_dir) {
    this.intact = true;
    this.speed = speed;
    this.location = start_loc;
    this.direction = (typeof start_dir !== 'undefined' ? start_dir : 2);

    this.timer = false;
}
AI.prototype.destroy = function() {
    this.timer.end();
    this.intact = false;
};
AI.prototype.pause = function() {
	this.timer.pause();
};
AI.prototype.unpause = function() {
	this.timer.start();
};

AI.prototype.start = function() {
    if(this instanceof Bulldozer) {
        if(tileStat[this.location.y][this.location.x] == 1)
            tileStat[this.location.y][this.location.x] = 2;
        if(isOnPage(this.location, current_page))
			processTile(this.location);
    }

    var _this = this;
    this.timer = new Timer(function() {_this.move()}, _this.speed);
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
    if(!checkIfTileAtLoc(this.location)) {
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
        if(!checkIfTileAtLoc(possible_new_location)) {
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

    var _this = this;
    this.timer = new Timer(function() {_this.move()}, _this.speed)

	// Hide old tile
    processTile(prev_loc);

	// If the AI went to a new page, we should pause it
	if(!isOnPage(this.location, current_page)) {
		this.timer.pause();
		return false;
	}

    // Show the new tile
    processTile(this.location);

    // Check if bulldozer rode over bunny
    if(this instanceof Bulldozer)
        checkWeapon(this.location, true, false, false);
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
    while(checkIfTileAtLoc(loc)) {
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
    this.timer = new Timer(function() {
        if(_this.intact) {
            rocks.push(new Rock(_this.location, _this.direction));

            _this.timer = new Timer(function() {
                _this.move();
            }, _this.speed)
        }
    }, _this.speed * 0.22)
};

function Rock(location, direction) {
    this.intact = true;
    this.hit = false;

    this.location = location;
    this.direction = direction;
    this.distance_traveled = 0;

    var _this = this;
    this.timer = new Timer(function() {
        _this.move();
    }, 100);
}
Rock.prototype.move = function() {
    showTile(2, 'blank', this.location);

    if(!this.intact) {
        return false;
    }
    if(!checkDirection(this.location, this.direction) || this.distance_traveled > 6) {
        for(var i=0;i<rocks.length;i++) {
            if(rocks[i] === this) {
                rocks.splice(i, 1);
            }
        }
        this.intact = false;
        return true;
    }
    this.location = getNewLoc(this.location, this.direction);

	// If rock went off page, remove it
	
	if(!isOnPage(this.location, current_page)) {
		this.intact = false;
		return true;
	}

    showTile(2, 'bullet', this.location);

	var bullet_hit = checkWeapon(this.location, true, false, true);
    if(bullet_hit) {
        this.intact = false;
        this.hit = true;
		if(bullet_hit !== true)
			processTile(this.location);
    }

    var _this = this;
    this.timer = new Timer(function() {
        _this.move();
    }, 100+(this.distance_traveled*5)+(this.hit ? 600 : 0));

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




