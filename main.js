
var my_loc, my_dir = 2, current_page, page_count_x, page_count_y,
    row_count, col_count, level,
    nodes = [], tileStat = [], city_tiles = [];
    bulldozers = [], humans = [], rocks = [], pools = [],
    bombTimer = false, loseFlag = false, winFlag = false, controls_active = false, game_paused = false;


function Location(x, y) {
    this.x = x;
    this.y = y;
}
Location.prototype.compareTo = function(other_loc) {
    if(this.x == other_loc.x && this.y == other_loc.y)
        return true;
    return false;
};


function checkDirection(loc, direction) {
    return nodes[loc.y][loc.x].charAt(direction) == "0";
}
function getNewLoc(start_loc, direction) {
    var new_loc = new Location(start_loc.x, start_loc.y);
    switch(direction) {
        case 0: new_loc.y--; break;
        case 1: new_loc.x++; break;
        case 2: new_loc.y++; break;
        case 3: new_loc.x--; break;
    }
    return new_loc;
}
function checkIfTileAtLoc(location) {
	if(location.x < 0 || location.x >= col_count*page_count_x || location.y < 0 || location.y >= row_count*page_count_y)
		return false;
	return true;
}
function dirToTileType(direction) {
    switch(direction) {
        case 0: return "u"; //up
        case 1: return "r"; //right
        case 2: return "d"; //down
        case 3: return "l"; //left
    }
}
function statToBGType(status) {
    switch(status) {
		case 0: return "g"; //grass
        case 1: return "tr"; //tree
        case 2: return "bd"; //bulldozed
        case 3: return "d"; //destroyed
        case 4: return "s"; //street
    }
}

// Function to display an image in a table location
function showTile(z_index, text, loc, background_img) {
    var img_loc = new Location(loc.x % col_count, loc.y % row_count);
    if(typeof background_img == 'undefined')
        background_img = false;

    document.images[z_index*row_count*col_count + col_count*img_loc.y + img_loc.x].src =
        "images/" + (background_img ? text + nodes[loc.y][loc.x] : text) + ".png";
}


function processTile(loc) {
    var tile_stat = statToBGType( tileStat[loc.y][loc.x] );
    if(nodes[loc.y][loc.x] == "2222" || nodes[loc.y][loc.x] == undefined)
        showTile(0, "blank", loc, false);
    else
        showTile(0, tile_stat, loc, true);

    var bulldozer = checkForAI(bulldozers, loc);
    if(bulldozer) {
        showTile(1, "bulldozer" + dirToTileType(bulldozer.direction), loc);
    }

    var human = checkForAI(humans, loc);
    if(human && !bulldozer) {
        showTile(1, "human" + dirToTileType(human.direction), loc);
    }

    var me = false;
    if(!bulldozer && !human) {
        if(my_loc.x == loc.x && my_loc.y == loc.y) {
            showTile(1, "AngryBunny", loc);
            me = true;
        }
    }

    if(!bulldozer && !human && !me)
        showTile(1, "blank", loc);

}

function processAllTiles() {
    for(i=row_count*current_page.y;i<row_count*(current_page.y + 1);i++) {
        for(j=col_count*current_page.x;j<col_count*(current_page.x + 1);j++) {
            processTile(new Location(j, i));
        }
    }
}


// Called when player tries to move
function walk(direction) {
    my_dir=direction;
    if(nodes[my_loc.y][my_loc.x].charAt(direction) == "0") {
        // Move character
        prev_loc = new Location(my_loc.x, my_loc.y);
        my_loc = getNewLoc(my_loc, direction);

        // Check if a bulldozer or rock is on the new tile
        death_obj = checkForAI(bulldozers.concat(rocks), my_loc);
        if(death_obj) {
            if(death_obj instanceof Rock) {
                death_obj.intact = false;
                death_obj.hit = true;
            }

            youLose();
        }

        // check if we are on a new page
        var my_current_page = new Location(Math.floor(my_loc.x / col_count), Math.floor(my_loc.y / row_count));
        if(!my_current_page.compareTo(current_page)) {
			pausePage(current_page);
			unpausePage(my_current_page);
            current_page = my_current_page;
            processAllTiles();
			$("#arrow").hide();
        }
        else {
            processTile(prev_loc);
            processTile(my_loc);
        }
    }
}

// The following functions control bombing
function plantTNT() {
    if(bombTimer)
        return 0;
    var tnt_placed = new Location(my_loc.x, my_loc.y);
    bombTimer = setTimeout(function() {
        showTile(1, "explzn", tnt_placed);
        tileStat[tnt_placed.y][tnt_placed.x] = 3;
        checkWeapon(tnt_placed, true, true, true)
        bombTimer = setTimeout(function() {
            checkWeapon(tnt_placed, true, true, true)
            processTile(tnt_placed);
            bombTimer = false;
        }, 150);
    },1000);
}

// Special ability added after fourth level
function addSpecialAbility(type, callback) {
	$("#"+type).fadeIn(function() {
		setTimeout(function() {
		$("#"+type).fadeOut();
			if(typeof callback == "function") {
				callback();
			}
		}, 3500);
	});
	$("#weapon2").html(type.toUpperCase());
	var special_ability_cooldown = false;
	specialAbility = function() {
		if(special_ability_cooldown)
			return false;
		special_ability_cooldown = setTimeout(function() {
			special_ability_cooldown = false;
		}, type == "vines" ? 900 : 1250);

		switch(type) {
			case "vines":
				var new_loc = my_loc;
				for(i=0;i<3;i++) {
					new_loc = getNewLoc(new_loc, my_dir);
				}
				if(!checkIfTileAtLoc(new_loc) || !isOnPage(new_loc, current_page))
					return false;
				showTile(2, "vines", new_loc);
				checkWeapon(new_loc, false, true, true);
				if(tileStat[new_loc.y][new_loc.x] != 1) {
					// If tile is not a lake, change it to a grassy area
					tileStat[new_loc.y][new_loc.x] = 0;
				}

				setTimeout(function() {
					showTile(2, "blank", new_loc);
					checkWeapon(new_loc, false, true, true);
					processTile(new_loc);
				}, 400);
			break;
			case "acid":
				var new_locs = [];
				new_locs.push(getNewLoc(my_loc, my_dir));
				new_locs.push(getNewLoc(new_locs[0], my_dir));
				new_locs.push(getNewLoc(new_locs[1], (my_dir + 5) % 4));
				new_locs.push(getNewLoc(new_locs[1], (my_dir + 3) % 4));
				for(var i=0;i<new_locs.length;i++) {
					(function(loc) {
						if(!checkIfTileAtLoc(loc) || !isOnPage(loc, current_page))
							return false;
						showTile(2, "acid", loc);
						checkWeapon(loc, false, true, true);
						tileStat[loc.y][loc.x] = 3;
						processTile(loc);

						setTimeout(function() {
							showTile(2, "blank", loc);
							checkWeapon(loc, false, true, true);
							processTile(loc);
						}, 300);
					})(new_locs[i]);
				}
		}
	};
}

// Checks a weapon to see if anyone was hit. Returns true if the weapon hit something
function checkWeapon(location, can_hurt_player, can_hurt_bulldozer, can_hurt_human) {
    if(can_hurt_player && location.compareTo(my_loc)) {
        youLose();
        return true;
    }
    var bd_list = [], hum_list = [];
    if(can_hurt_bulldozer) {
        bd_list = checkForAI(bulldozers, location, true);
        for(var i=0;i<bd_list.length;i++) {
            bd_list[i].destroy();
        }
        checkWin();
    }
    if(can_hurt_human) {
        hum_list = checkForAI(humans, location, true);
        for(var i=0;i<hum_list.length;i++) {
            hum_list[i].destroy();
        }
    }
    return hum_list.length || bd_list.length;
}

function isOnPage(loc, page) {
	if(loc.x >= col_count*page.x && loc.x < col_count*(page.x + 1) && loc.y >= row_count*page.y && loc.y < row_count*(page.y + 1))
		return true;
	return false;
}

function pausePage(page) {
	var allAIs = bulldozers.concat(humans).concat(rocks);

	for(var i=0;i<allAIs.length;i++) {
		if(isOnPage(allAIs[i].location, page)) {
			// AI is on page
			allAIs[i].timer.pause();
		}
	}
}
function unpausePage(page) {
	var allAIs = bulldozers.concat(humans).concat(rocks);
	for(var i=0;i<allAIs.length;i++) {
		if(isOnPage(allAIs[i].location, page)) {
			// AI is on page
			allAIs[i].timer.start();
		}
	}
}

function pauseButton() {
	game_paused = !game_paused;
	if(game_paused)
		pausePage(current_page);
	else
		unpausePage(current_page);
}

function checkWin() {
    for(var i=0;i<bulldozers.length;i++) {
        if(bulldozers[i].intact)
            return false;
    }
    youWin();
}


// The following functions check the pools in each level to see what types of tiles they border and possibly change the status of the pool
function checkPools() {
    function scoreForXY(x, y) {
        stat = tileStat[y][x];
        if(stat == 4)
            return 2;
        else return stat;
    }
    for(var i=0;i<pools.length;i++) {
        if(tileStat[pools[i].y][pools[i].x] == 1) {
            if( scoreForXY(pools[i].x + 1, pools[i].y) +
                scoreForXY(pools[i].x - 1, pools[i].y) + 
                scoreForXY(pools[i].x, pools[i].y + 1) +
                scoreForXY(pools[i].x, pools[i].y - 1) > 5) {
                    tileStat[pools[i].y][pools[i].x] = 2;
                    processTile(pools[i]);
            }
        }
    }
}

// Functions for calculating player's score
function calcScore() {
    var score = {trees: {total: 0, saved: 0}, pools: {total: 0, saved: 0}, total: 0};
    for(var i=0;i<row_count;i++) {
        for(var j=0;j<col_count;j++) {
            if(nodes[i][j] == "1111") {
                if(tileStat[i][j] == 1) {
                    score.pools.saved++;
                    score.total += 5;
                }
                if(tileStat[i][j] != 4)
                    score.pools.total++;
            }
            else if(nodes[i][j] != "2222") {
                if(tileStat[i][j] == 1) {
                    score.trees.saved++;
                    score.total++;
                }
                score.trees.total++;
            }
        }
    }
    return score;
}

// Functions shown if player wins or loses
function youWin() {
    if(loseFlag || winFlag)
        return false;

    winFlag = setTimeout(function() {
		if(level == 5) {
			alert("Yay! You won the game. The End.");
			return true;
		}
        var score = calcScore();
        alert("YOU WIN! Your forest is safe. For now...\nTrees saved: "
            + score.trees.saved + "/" + score.trees.total + "\nPools saved: "
            + score.pools.saved + "/" + score.pools.total + "\nTotal score: " + score.total);
        level++;
        winFlag = false;

		if(level == 5) {
			addSpecialAbility(humans[0].intact ? "vines" : "acid", startLvl);
		}
		else {
			startLvl();
		}
    }, 800);
}
function youLose() {
	if(loseFlag)
		return false;
    controls_active = false;

    loseFlag = setTimeout(function() {
        alert("Oh dear.... it looks like you're dead. While your remains decompose, your forest is rapidly converted into timber.");
        loseFlag = false;

        startLvl();
    }, 150);
}

function KeyCheck(e) {
    if(!controls_active)
        return true;

    var KeyID = (window.event) ? event.keyCode : e.keyCode;
	if(game_paused && KeyID != 80) {
		return true;
	}
    switch(KeyID) {
        case 87:
            walk(0);
            break;
        case 68:
            walk(1);
            break;
        case 83:
            walk(2);
            break;
        case 65:
            walk(3);
            break;
        case 66:
            plantTNT();
            break;
		case 78:
			if(typeof specialAbility != "undefined")
				specialAbility();
			break;
		case 80:
			pauseButton();
			break;
    }
}


window.onload = function() {
    document.onkeydown = KeyCheck;
};

function enterCode() {
    var code = prompt("Enter the level code here:");
    if(!code)
        return false;
    code = parseInt(code);
    if(code > 0 && code < 6)
        startFromLevel(code);
    else
        alert("Sorry, the code you entered wasn't valid...");
}
function startFromLevel(new_lvl) {
    //document.getElementById('animal_rights').play();
    document.getElementById('opening').style.display = "none";
    var pnda = document.getElementById('pnda');
    pnda.height = window.innerHeight;
    pnda.width = window.innerWidth;
    setTimeout(function() {
        pnda.style.display = "none";
        level = new_lvl;
        startLvl();
    }, 100);
}




