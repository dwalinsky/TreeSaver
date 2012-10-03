var tiles1 = new Array("1001", "1010", "1100","1001","1010","1010","1010","1000","1000","1100","1001","1000","1000","1010","1010","1010","1100","1001","1010","1100");
var tiles2 = new Array("0101","1111","0101","0101","1001","1010","1000","0110","0101","0101","0101","0101","0011","1000","1010","1100","0101","0101","1111","0101");
var tiles3 = new Array("0011","1010","0100","0101","0011","1100","0011","1010","0100","0011","0110","0001","1010","0110","1001","0110","0101","0001","1010","0110");
var tiles4 = new Array("1001","1100","0011","0000","1000","0100","1001","1100","0001","1100","1001","0100","1001","1100","0001","1000","0000","0110","1001","1100");
var tiles5 = new Array("0101","0101","1001","0100","0011","0100","0101","0011","0000","0110","0011","0000","0110","0101","0001","0110","0001","1100","0101","0101");
var tiles6 = new Array("0101","0011","0100","0001","1100","0011","0000","1100","0001","1000","1000","0100","1001","0000","0110","1001","0100","0001","0110","0101");
var tiles7 = new Array("0001","1100","0101","0001","0110","1111","0001","0110","0001","0000","0000","0100","0011","0100","1111","0011","0100","0101","1001","0100");
var tiles8 = new Array("0101","0001","0010","0010","1010","1100","0011","1010","0010","0000","0000","0010","1010","0110","1001","1010","0010","0010","0100","0101");
var tiles9 = new Array("0011","0010","1010","1000","1010","0000","1000","1000","1010","0010","0010","1010","1000","1000","0000","1010","1000","1010","0010","0110");
var tiles10 = new Array("1001","1010","1010","0100","1001","0100","0011","0100","1001","1000","1000","1100","0001","0110","0001","1100","0001","1010","1010","1100");
var tiles11 = new Array("0101","1001","1010","0000","0000","0010","1000","0100","0011","0000","0000","0110","0001","1000","0010","0000","0000","1010","1100","0101");
var tiles12 = new Array("0001","0100","1111","0101","0001","1100","0011","0010","1000","0010","0010","1000","0010","0110","1001","0100","0101","1111","0001","0100");
var tiles13 = new Array("0101","0011","1010","0110","0001","0010","1010","1000","0000","1000","1000","0000","1000","1010","0010","0100","0011","1010","0110","0101");
var tiles14 = new Array("0011","1010","1010","1010","0010","1010","1010","0110","0011","0010","0010","0110","0011","1010","1010","0010","1010","1010","1010","0110");

tileStat = new Array();
tileStat[0] = new Array();
tileStat[1] = new Array();
tileStat[2] = new Array();
tileStat[3] = new Array();
tileStat[4] = new Array();
tileStat[5] = new Array();
tileStat[6] = new Array();
tileStat[7] = new Array();
tileStat[8] = new Array();
tileStat[9] = new Array();
tileStat[10] = new Array();
tileStat[11] = new Array();
tileStat[12] = new Array();
tileStat[13] = new Array();

var nodes = [tiles1,tiles2,tiles3,tiles4,tiles5,tiles6,tiles7,tiles8,tiles9,tiles10,tiles11,tiles12,tiles13,tiles14];
var row=14;
var col=20;
var guy_row=6;
var guy_col=10;
var guy_dir=3;
var cru_row=[3,13,9];
var cru_col=[19,12,19];
var cru_dir=[3,0,3];
var winnerCount=3;
var level=1;
var NOpools=6;
var bd4timer = 0;
var bd5timer = 0;
var bd6timer = 0;
var bd7timer = 0;
var bd8timer = 0;
var bd9timer = 0;
var bd10timer = 0;
var bombTimer1 = 0;
var bombTimer2 = 0;
window.onload = function() {
	// Initializes tiles so that they are all set as forest.
	// Adds table cells to game table
	var new_html = "";
	for(i=0;i<row;i++) {
		new_html += "<tr>";
		for(j=0;j<col;j++) {
			new_html += "<td><img src=''/></td>";
			tileStat[i][j]=1;
		}
		new_html += "</tr>";
	}
	document.getElementById("game_table").innerHTML = new_html;

	setTimeout(function() {
		// This loop sets up the table written in HTML above, and adds initial pictures to it.
		for (i=0;i<row;i++) {
			for(j=0;j<col;j++) {
				showTile("tr",i,j);
			}
		}
		// Make the starting points of the cruisers into bulldozed tiles
		for (i=0;i<3;i++) {
			showTile("bdd",cru_row[i],cru_col[i]);
			tileStat[cru_row[i]][cru_col[i]] = 2;
		}
		guyLocation();
		cruiserTimer1();
		cruiserTimer2();
		cruiserTimer3();
		document.onkeydown = KeyCheck;
	},0);
};
function initializer1() {
    row=14;
    col=20;
    guy_row=6;
    guy_col=10;
    guy_dir=3;
    cru_row=[3,13,9];
    cru_col=[19,12,19];
    cru_dir=[3,0,3];
    winnerCount=3;
    NOpools=6

    // Initializes tiles so that they are all set as forest.
    for(i=0;i<row;i++) {
        for(j=0;j<col;j++) {
            tileStat[i][j]=1;
        }
    }

    // This loop sets up the table written in HTML above, and adds initial pictures to it.
    for (i=0;i<row;i++) {
        for(j=0;j<col;j++) {
            showTile("tr",i,j);
        }
    }
    // Make the starting points of the cruisers into bulldozed tiles
    for (i=0;i<3;i++) {
        showTile("bdd",cru_row[i],cru_col[i]);
        tileStat[cru_row[i]][cru_col[i]] = 2;
    }
    guyLocation();
    if(bd1timer)
        clearTimeout(bd1timer);
    if(bd2timer)
        clearTimeout(bd2timer);
    if(bd3timer)
        clearTimeout(bd3timer);
    cruiserTimer1();
    cruiserTimer2();
    cruiserTimer3();
}
function initializer2() {
    var forest1 = new Array("1001", "1010", "1000","1000","1010","1100","1001","1010","1000","1000","1010","1100","2222","2222");
    var forest2 = new Array("0101","1111","0101","0011","1010","0100","0001","1010","0110","0101","1111","0101","2222","2222");
    var forest3 = new Array("0011","1010","0000","1000","1100","0001","0100","1001","1000","0000","1010","0110","2222","2222");
    var forest4 = new Array("1001","1010","0100","0101","0011","0010","0010","0110","0101","0001","1010","1100","2222","2222");
    var forest5 = new Array("0001","1100","0101","0101","1001","1100","1001","1100","0101","0101","1001","0100","2222","2222");
    var forest6 = new Array("0001","0100","0001","0010","0010","0100","0001","0010","0010","0100","0001","0100","2222","2222");
    var forest7 = new Array("0011","0010","0000","1100","1001","0000","0000","1100","1001","0000","0010","0110","2222","2222");
    var forest8 = new Array("1001","1010","0100","0101","0001","0010","0010","0100","0101","0001","1010","1100","2222","2222");
    var forest9 = new Array("0011","1010","0010","0000","0100","1111","1111","0001","0000","0010","1000","0000","1000","1100");
    var forest10 = new Array("1001","1010","1100","0011","0010","1000","1000","0010","0110","1001","0010","0100","0001","0100");
    var forest11 = new Array("0101","1111","0011","1000","1010","0010","0010","1010","1000","0110","1111","0101","0101","0101");
    var forest12 = new Array("0011","1010","1010","0010","1010","1010","1010","1010","0010","1010","1010","0000","0100","0101");
    var forest13 = new Array("2222","2222","2222","2222","2222","2222","2222","2222","2222","1001","1010","0010","0100","0101");
    var forest14 = new Array("2222","2222","2222","2222","2222","2222","2222","2222","2222","0011","1010","1010","0010","0110");
    nodes2 = [forest1,forest2,forest3,forest4,forest5,forest6,forest7,forest8,forest9,forest10,forest11,forest12,forest13,forest14];

    guy_row=8;
    guy_col=10;
    guy_dir=2;
    cru_row=[-1,-1,-1,3,8,0];
    cru_col=[-1,-1,-1,0,0,5];
    cru_dir=[0,0,0,1,1,2];
    winnerCount=3;
    NOpools=6;
    level=2;
    for(i=0;i<14;i++) {
        for(j=0;j<14;j++) {
            if(nodes2[i][j] != "2222")
                tileStat[i][j]=1;
        }
    }
    for (i=0;i<row;i++) {
        for(j=0;j<col;j++) {
            document.images[col*i+j].src = "blank.jpg";
        }
    }
    for (i=0;i<14;i++) {
        for(j=0;j<14;j++) {
            if(nodes2[i][j] != "2222")
                showTile("tr",i,j);
        }
    }
    for (i=3;i<6;i++) {
        showTile("bdd",cru_row[i],cru_col[i]);
        tileStat[cru_row[i]][cru_col[i]] = 2;
    }
    guyLocation();
    if(bd4timer)
        clearTimeout(bd4timer);
    if(bd5timer)
        clearTimeout(bd5timer);
    if(bd6timer)
        clearTimeout(bd6timer);
    cruiserTimer4();
    cruiserTimer5();
    cruiserTimer6();
}
function initializer3() {
    var forest1 = new Array("1001", "1010", "1100","1001","1010","1010","1010","1000","1000","1100","1001","1000","1000","1010","1010","1010","1100","1001","1010","1100");
    var forest2 = new Array("0101","1111","0101","0101","1001","1010","1000","0110","0101","0101","0101","0101","0011","1000","1010","1100","0101","0101","1111","0101");
    var forest3 = new Array("0011","1010","0100","0101","0011","1100","0011","1010","0100","0011","0110","0001","1010","0110","1001","0110","0101","0001","1010","0110");
    var forest4 = new Array("1001","1100","0011","0000","1000","0100","1001","1100","0001","1100","1001","0100","1001","1100","0001","1000","0000","0110","1001","1100");
    var forest5 = new Array("0101","0101","1001","0100","0011","0100","0101","0011","0000","0110","0011","0000","0110","0101","0001","0110","0001","1100","0101","0101");
    var forest6 = new Array("0101","0011","0100","0001","1100","0011","0000","1100","0001","1000","1000","0100","1001","0000","0110","1001","0100","0001","0110","0101");
    var forest7 = new Array("0001","1100","0101","0001","0110","1111","0001","0110","0001","0000","0000","0100","0011","0100","1111","0011","0100","0101","1001","0100");
    var forest8 = new Array("0101","0001","0010","0010","1010","1100","0011","1010","0010","0000","0000","0010","1010","0110","1001","1010","0010","0010","0100","0101");
    var forest9 = new Array("0011","0010","1010","1000","1010","0000","1000","1000","1010","0010","0010","1010","1000","1000","0000","1010","1000","1010","0010","0110");
    var forest10 = new Array("1001","1010","1010","0100","1001","0100","0011","0100","1001","1000","1000","1100","0001","0110","0001","1100","0001","1010","1010","1100");
    var forest11 = new Array("0101","1001","1010","0000","0000","0010","1000","0100","0011","0000","0000","0110","0001","1000","0010","0000","0000","1010","1100","0101");
    var forest12 = new Array("0001","0100","1111","0101","0001","1100","0011","0010","1000","0010","0010","1000","0010","0110","1001","0100","0101","1111","0011","0110");
    var forest13 = new Array("0101","0011","1010","0110","0001","0010","1010","1000","0000","1000","1000","0000","1000","1010","0010","0100","0101","1001","1010","1100");
    var forest14 = new Array("0011","1010","1010","1010","0010","1010","1010","0110","0011","0010","0010","0110","0011","1010","1010","0010","0110","0011","1010","0100");
    nodes3 = [forest1,forest2,forest3,forest4,forest5,forest6,forest7,forest8,forest9,forest10,forest11,forest12,forest13,forest14];
    guy_row=6;
    guy_col=10;
    guy_dir=3;
    cru_row=[-1,-1,-1,-1,-1,-1,3,0,8,13];
    cru_col=[-1,-1,-1,-1,-1,-1,0,11,19,11];
    cru_dir=[0,0,0,0,0,0,1,2,3,0];
    hum_row=[13];
    hum_col=[19];
    hum_dir=[0];
    level=3;
    winnerCount=4;
    NOpools=6;
    for(i=0;i<row;i++) {
        for(j=0;j<col;j++) {
            tileStat[i][j]=1;
        }
    }
    for (i=0;i<row;i++) {
        for(j=0;j<col;j++) {
            document.images[col*i+j].src = "images/blank.jpg";
        }
    }
    for (i=0;i<row;i++) {
        for(j=0;j<col;j++) {
            showTile("tr",i,j);
        }
    }
    for (i=6;i<10;i++) {
        showTile("bdd",cru_row[i],cru_col[i]);
        tileStat[cru_row[i]][cru_col[i]] = 2;
    }
    showTile("s",12,17);
    showTile("s",12,18);
    showTile("s",12,19);
    showTile("s",13,17);
    showTile("s",13,18);
    showTile("smr",13,19);
    guyLocation();
    if(bd7timer)
        clearTimeout(bd7timer);
    if(bd8timer)
        clearTimeout(bd8timer);
    if(bd9timer)
        clearTimeout(bd9timer);
    if(bd10timer)
        clearTimeout(bd10timer);
    cruiserTimer7();
    cruiserTimer8();
    cruiserTimer9();
    cruiserTimer10();
    hm1timer = setInterval("moveHuman(0)",1300);
}
// Function to display an image in a table location
function showTile (c, rows, cols) {
    if(level==1)
        document.images[col*rows+cols].src = "images/" + c + nodes[rows][cols] + ".png";
    else if(level==2)
        document.images[col*rows+cols].src = "images/" + c + nodes2[rows][cols] + ".png";
    else if(level==3)
        document.images[col*rows+cols].src = "images/" + c + nodes3[rows][cols] + ".png";
}

// Checks whether the police and the player are in the same position
function checkCruisers() {
    if (guy_row == cru_row[0] && guy_col == cru_col[0])
        youLose();
    else if (guy_row == cru_row[1] && guy_col == cru_col[1])
        youLose();
    else if (guy_row == cru_row[2] && guy_col == cru_col[2])
        youLose();
    else if (guy_row == cru_row[3] && guy_col == cru_col[3])
        youLose();
    else if (guy_row == cru_row[4] && guy_col == cru_col[4])
        youLose();
    else if (guy_row == cru_row[5] && guy_col == cru_col[5])
        youLose();
    else if (guy_row == cru_row[6] && guy_col == cru_col[6])
        youLose();
    else if (guy_row == cru_row[7] && guy_col == cru_col[7])
        youLose();
    else if (guy_row == cru_row[8] && guy_col == cru_col[8])
        youLose();
    else if (guy_row == cru_row[9] && guy_col == cru_col[9])
        youLose();
}
// Sets the player's new position and calls the above checking function 
function guyLocation() {
    if (tileStat[guy_row][guy_col] == "1")
        var n = "tb";
    else if(tileStat[guy_row][guy_col] == "2")
        var n = "bb";
    else if(tileStat[guy_row][guy_col] == "3")
        var n = "db";
    if (level==1)
        document.images[col*guy_row+guy_col].src = "images/" + n + nodes[guy_row][guy_col] + ".png";
    else if (level==2)
        document.images[col*guy_row+guy_col].src = "images/" + n + nodes2[guy_row][guy_col] + ".png";
    else if (level==3)
        document.images[col*guy_row+guy_col].src = "images/" + n + nodes3[guy_row][guy_col] + ".png";
    checkCruisers();
}
// Removes the player from his current location and moves his position.
function walk(direction) {
    guy_dir=direction;
    if (level==1) {
        if(nodes[guy_row][guy_col].charAt(direction) == 0) {
            if (tileStat[guy_row][guy_col] == 1)
                showTile("tr",guy_row,guy_col);
            else if(tileStat[guy_row][guy_col] == 2)
                showTile("bd",guy_row,guy_col);
            else if(tileStat[guy_row][guy_col] == 3)
                showTile("d",guy_row,guy_col);
            if( direction == 0)
                guy_row--;
            else if( direction == 1)
                guy_col++;
            else if( direction == 2)
                guy_row++;
            else if( direction == 3)
                guy_col--;
            guyLocation();
        }
    }
    if (level==2) {
        if(nodes2[guy_row][guy_col].charAt(direction) == 0) {
            if (tileStat[guy_row][guy_col] == 1)
                showTile("tr",guy_row,guy_col);
            else if(tileStat[guy_row][guy_col] == 2)
                showTile("bd",guy_row,guy_col);
            else if(tileStat[guy_row][guy_col] == 3)
                showTile("d",guy_row,guy_col);
            if( direction == 0)
                guy_row--;
            else if( direction == 1)
                guy_col++;
            else if( direction == 2)
                guy_row++;
            else if( direction == 3)
                guy_col--;
            guyLocation();
        }
    }
    if (level==3) {
        if(nodes3[guy_row][guy_col].charAt(direction) == 0) {
            if (tileStat[guy_row][guy_col] == 1)
                showTile("tr",guy_row,guy_col);
            else if(tileStat[guy_row][guy_col] == 2)
                showTile("bd",guy_row,guy_col);
            else if(tileStat[guy_row][guy_col] == 3)
                showTile("d",guy_row,guy_col);
            if( direction == 0)
                guy_row--;
            else if( direction == 1)
                guy_col++;
            else if( direction == 2)
                guy_row++;
            else if( direction == 3)
                guy_col--;
            guyLocation();
        }
    }
}
// Functions to set the timers for when the cruisers move.
function cruiserTimer1() {
    bd1timer = setTimeout("moveCruiser(0)",1210);
    checkCruisers();
}
function cruiserTimer2() {
    bd2timer = setTimeout("moveCruiser(1)",1140);
    checkCruisers();
}
function cruiserTimer3() {
    bd3timer = setTimeout("moveCruiser(2)",950);
    checkCruisers();
}
function cruiserTimer4() {
    bd4timer = setTimeout("moveCruiser(3)",1010);
    checkCruisers();
}
function cruiserTimer5() {
    bd5timer = setTimeout("moveCruiser(4)",1130);
    checkCruisers();
}
function cruiserTimer6() {
    bd6timer = setTimeout("moveCruiser(5)",910);
    checkCruisers();
}
function cruiserTimer7() {
    bd7timer = setTimeout("moveCruiser(6)",970);
    checkCruisers();
}
function cruiserTimer8() {
    bd8timer = setTimeout("moveCruiser(7)",800);
    checkCruisers();
}
function cruiserTimer9() {
    bd9timer = setTimeout("moveCruiser(8)",680);
    checkCruisers();
}
function cruiserTimer10() {
    bd10timer = setTimeout("moveCruiser(9)",1100);
    checkCruisers();
}

function moveCruiser(chosen) {
    // Check if the cruiser is moving from a position where a bomb was set off and removes cruiser from map
    if (tileStat[cru_row[chosen]][cru_col[chosen]] == 2)
        showTile("bd",cru_row[chosen],cru_col[chosen]);
    else if (tileStat[cru_row[chosen]][cru_col[chosen]] == 3)
        showTile("d",cru_row[chosen],cru_col[chosen]);
    // Moves the cruiser's location and creates array which shows the possible directions the cruiser can go (and not be reversed)
    if( cru_dir[chosen] == 0){
        cru_row[chosen]--;
        if (chosen<3) {
            var p = nodes[cru_row[chosen]][cru_col[chosen]];
        }
        else if (chosen<6) {
            var p = nodes2[cru_row[chosen]][cru_col[chosen]];
        }
        else if (chosen<10) {
            var p = nodes3[cru_row[chosen]][cru_col[chosen]];
        }
        var q=[p.charAt(0),p.charAt(1),1,p.charAt(3)];
        var reversed = 2;
    }
    else if( cru_dir[chosen] == 1) {
        cru_col[chosen]++;
        if (chosen<3) {
            var p = nodes[cru_row[chosen]][cru_col[chosen]];
        }
        else if (chosen<6) {
            var p = nodes2[cru_row[chosen]][cru_col[chosen]];
        }
        else if (chosen<10) {
            var p = nodes3[cru_row[chosen]][cru_col[chosen]];
        }
        var q=[p.charAt(0),p.charAt(1),p.charAt(2),1];
        var reversed = 3;
    }
    else if( cru_dir[chosen] == 2) {
        cru_row[chosen]++;
        if (chosen<3) {
            var p = nodes[cru_row[chosen]][cru_col[chosen]];
        }
        else if (chosen<6) {
            var p = nodes2[cru_row[chosen]][cru_col[chosen]];
        }
        else if (chosen<10) {
            var p = nodes3[cru_row[chosen]][cru_col[chosen]];
        }
        var q=[1,p.charAt(1),p.charAt(2),p.charAt(3)];
        var reversed = 0;
    }
    else if( cru_dir[chosen] == 3) {
        cru_col[chosen]--;
        if (chosen<3) {
            var p = nodes[cru_row[chosen]][cru_col[chosen]];
        }
        else if (chosen<6) {
            var p = nodes2[cru_row[chosen]][cru_col[chosen]];
        }
        else if (chosen<10) {
            var p = nodes3[cru_row[chosen]][cru_col[chosen]];
        }
        var q=[p.charAt(0),1,p.charAt(2),p.charAt(3)];
        var reversed = 1;
    }
    // If new location has a tree, change the tileStat of that location
    if (tileStat[cru_row[chosen]][cru_col[chosen]] == 1) {
        tileStat[cru_row[chosen]][cru_col[chosen]] = 2;
    }
    // Determines a new direction for cruiser
    var decisions = 4;
    decisions-=q[0];
    decisions-=q[1];
    decisions-=q[2];
    decisions-=q[3];
    var qString=q[0]+q[1]+q[2]+q[3];
    if (decisions == 1) {
        cru_dir[chosen]=qString.indexOf(0);
    }
    else if (decisions == 2) {
        var statDir0=0;
        var statDir1=0;
        var dir0;
        var dir1;
        if(q[0]==0) {
            statDir0 = tileStat[cru_row[chosen]-1][cru_col[chosen]];
            dir0 = 0;
        }
        if(q[1]==0) {
            if(statDir0==0) {
                statDir0 = tileStat[cru_row[chosen]][cru_col[chosen]+1];
                dir0 = 1;
            }
            else {
                statDir1 = tileStat[cru_row[chosen]][cru_col[chosen]+1];
                dir1 = 1;
            }
        }
        if(q[2]==0) {
            if(statDir0==0) {
                statDir0 = tileStat[cru_row[chosen]+1][cru_col[chosen]];
                dir0 = 2;
            }
            else{
                statDir1 = tileStat[cru_row[chosen]+1][cru_col[chosen]];
                dir1 = 2;
            }
        }
        if(q[3]==0) {
            statDir1 = tileStat[cru_row[chosen]][cru_col[chosen]-1];
            dir1 = 3;
        }
        if(statDir0<statDir1) {
            cru_dir[chosen] = dir0;
        }
        else if(statDir0>statDir1) {
            cru_dir[chosen] = dir1;
        }
        else {
            rand = Math.floor(Math.random()*2)
            if (rand == 0)
                cru_dir[chosen] = dir0;
            else
                cru_dir[chosen] = dir1;
        }
    }
    else if (decisions == 3) {
        var statDir0=0;
        var statDir1=0;
        var statDir2=0;
        var dir0;
        var dir1;
        var dir2;
        if(q[0]==0) {
            statDir0 = tileStat[cru_row[chosen]-1][cru_col[chosen]];
            dir0 = 0;
        }
        if(q[1]==0) {
            if(statDir0==0) {
                statDir0 = tileStat[cru_row[chosen]][cru_col[chosen]+1];
                dir0 = 1;
            }
            else {
                statDir1 = tileStat[cru_row[chosen]][cru_col[chosen]+1];
                dir1 = 1;
            }
        }
        if(q[2]==0) {
            if(statDir1==0) {
                statDir1 = tileStat[cru_row[chosen]+1][cru_col[chosen]];
                dir1 = 2;
            }
            else{
                statDir2 = tileStat[cru_row[chosen]+1][cru_col[chosen]];
                dir2 = 2;
            }
        }
        if(q[3]==0) {
            statDir2 = tileStat[cru_row[chosen]][cru_col[chosen]-1];
            dir2 = 3;
        }
        if(statDir0<statDir1 && statDir0<statDir2) {
            cru_dir[chosen] = dir0;
        }
        else if(statDir1<statDir0 && statDir1<statDir2) {
            cru_dir[chosen] = dir1;
        }
        else if(statDir2<statDir0 && statDir2<statDir1) {
            cru_dir[chosen] = dir2;
        }
        else {
            rand = Math.floor(Math.random()*3)
            if (rand==reversed) {
                cru_dir[chosen]=3;
            }
            else {
                cru_dir[chosen]=rand;
            }
        }
    }
    // Show cruiser's new location
    if (tileStat[cru_row[chosen]][cru_col[chosen]] == 2) {
        switch(cru_dir[chosen]) {
            case 0:
                showTile("bdu",cru_row[chosen],cru_col[chosen]);
                break;
            case 1:
                showTile("bdr",cru_row[chosen],cru_col[chosen]);
                break;
            case 2:
                showTile("bdd",cru_row[chosen],cru_col[chosen]);
                break;
            case 3:
                showTile("bdl",cru_row[chosen],cru_col[chosen]);
                break;
        }
    }
    else if (tileStat[cru_row[chosen]][cru_col[chosen]] == 3) {
        switch(cru_dir[chosen]) {
            case 0:
                showTile("dbu",cru_row[chosen],cru_col[chosen]);
                break;
            case 1:
                showTile("dbr",cru_row[chosen],cru_col[chosen]);
                break;
            case 2:
                showTile("dbd",cru_row[chosen],cru_col[chosen]);
                break;
            case 3:
                showTile("dbl",cru_row[chosen],cru_col[chosen]);
                break;
        }
    }
    // Call timer for cruiser
    if (chosen==0)
        cruiserTimer1();
    else if (chosen==1)
        cruiserTimer2();
    else if (chosen==2)
        cruiserTimer3();
    else if (chosen==3)
        cruiserTimer4();
    else if (chosen==4)
        cruiserTimer5();
    else if (chosen==5)
        cruiserTimer6();
    else if (chosen==6)
        cruiserTimer7();
    else if (chosen==7)
        cruiserTimer8();
    else if (chosen==8)
        cruiserTimer9();
    else if (chosen==9)
        cruiserTimer10();
    if (level==1)
        checkPools();
    else if (level==2)
        checkPools2();
    else if (level==3)
        checkPools();
}

// The following functions control bombing
function plantTNT() {
    if(bombTimer1)
        return 0;
    tntrow = guy_row;
    tntcol = guy_col;
    bombTimer1 = setTimeout("blowUp(tntrow,tntcol)",1000);
}
function blowUp(tntrow,tntcol) {
    if(bombTimer1) {
        document.images[col*tntrow+tntcol].src = "images/explzn.png";
        if (checkBomb(tntrow,tntcol))
            return 0;
        tileStat[tntrow][tntcol] = 3;
        bombTimer2 = setTimeout("dustSettles(tntrow,tntcol)",125);
    }
}
function dustSettles(tntrow,tntcol) {
    if(bombTimer1) {
        if (checkBomb(tntrow,tntcol))
            return 0;
        showTile("d",tntrow,tntcol);
        bombTimer1=0;
    }
}
function checkBomb(tntrow,tntcol) {
    if (guy_row == tntrow && guy_col == tntcol) {
        youLose();
        return 1;
    }
    if (cru_row[0] == tntrow && cru_col[0] == tntcol) {
        clearTimeout(bd1timer);
        cru_row[0]=-1;
        cru_col[0]=-1;
        winnerCount--;
        if (winnerCount==0) {
            youWin();
            return 1;
        }
    }
    if (cru_row[1] == tntrow && cru_col[1] == tntcol) {
        clearTimeout(bd2timer);
        cru_row[1]=-1;
        cru_col[1]=-1;
        winnerCount--;
        if (winnerCount==0) {
            youWin();
            return 1;
        }
    }
    if (cru_row[2] == tntrow && cru_col[2] == tntcol) {
        clearTimeout(bd3timer);
        cru_row[2]=-1;
        cru_col[2]=-1;
        winnerCount--;
        if (winnerCount==0) {
            youWin();
            return 1;
        }
    }
    if (cru_row[3] == tntrow && cru_col[3] == tntcol) {
        clearTimeout(bd4timer);
        cru_row[3]=-1;
        cru_col[3]=-1;
        winnerCount--;
        if (winnerCount==0) {
            youWin();
            return 1;
        }
    }
    if (cru_row[4] == tntrow && cru_col[4] == tntcol) {
        clearTimeout(bd5timer);
        cru_row[4]=-1;
        cru_col[4]=-1;
        winnerCount--;
        if (winnerCount==0) {
            youWin();
            return 1;
        }
    }
    if (cru_row[5] == tntrow && cru_col[5] == tntcol) {
        clearTimeout(bd6timer);
        cru_row[5]=-1;
        cru_col[5]=-1;
        winnerCount--;
        if (winnerCount==0) {
            youWin();
            return 1;
        }
    }
    if (cru_row[6] == tntrow && cru_col[6] == tntcol) {
        clearTimeout(bd7timer);
        cru_row[6]=-1;
        cru_col[6]=-1;
        winnerCount--;
        if (winnerCount==0) {
            youWin();
            return 1;
        }
    }
    if (cru_row[7] == tntrow && cru_col[7] == tntcol) {
        clearTimeout(bd8timer);
        cru_row[7]=-1;
        cru_col[7]=-1;
        winnerCount--;
        if (winnerCount==0) {
            youWin();
            return 1;
        }
    }
    if (cru_row[8] == tntrow && cru_col[8] == tntcol) {
        clearTimeout(bd9timer);
        cru_row[8]=-1;
        cru_col[8]=-1;
        winnerCount--;
        if (winnerCount==0) {
            youWin();
            return 1;
        }
    }
    if (cru_row[9] == tntrow && cru_col[9] == tntcol) {
        clearTimeout(bd10timer);
        cru_row[9]=-1;
        cru_col[9]=-1;
        winnerCount--;
        if (winnerCount==0) {
            youWin();
            return 1;
        }
    }
    return 0;
}
// Moves the one human present on the third level
function moveHuman(chosen) {
    // Removes human from map
   showTile("s",hum_row[chosen],hum_col[chosen]);
    // Moves the human's location and creates array which shows the possible directions the human can go (and not be reversed)
    if( hum_dir[chosen] == 0){
        hum_row[chosen]--;
        if (chosen<1) {
            var p = nodes3[hum_row[chosen]][hum_col[chosen]];
        }
        var q=[p.charAt(0),p.charAt(1),1,p.charAt(3)];
        var reversed = 2;
    }
    else if( hum_dir[chosen] == 1) {
        hum_col[chosen]++;
        if (chosen<1) {
            var p = nodes3[hum_row[chosen]][hum_col[chosen]];
        }
        var q=[p.charAt(0),p.charAt(1),p.charAt(2),1];
        var reversed = 3;
    }
    else if( hum_dir[chosen] == 2) {
        hum_row[chosen]++;
        if (chosen<1) {
            if (hum_col[chosen] == 19 && hum_row[chosen] == 14) {
               clearInterval(hm1timer);
               return 0;
            }
            var p = nodes3[hum_row[chosen]][hum_col[chosen]];
        }
        var q=[1,p.charAt(1),p.charAt(2),p.charAt(3)];
        var reversed = 0;
    }
    else if( hum_dir[chosen] == 3) {
        hum_col[chosen]--;
        if (chosen<1) {
            var p = nodes3[hum_row[chosen]][hum_col[chosen]];
        }
        var q=[p.charAt(0),1,p.charAt(2),p.charAt(3)];
        var reversed = 1;
    }
    // Determine new direction for human
    var decisions = 4;
    decisions-=q[0];
    decisions-=q[1];
    decisions-=q[2];
    decisions-=q[3];
    var qString=q[0]+q[1]+q[2]+q[3];
    if (decisions == 1) {
        hum_dir[chosen]=qString.indexOf(0);
    }
    else if (decisions == 2) {
        var dir0=4;
        var dir1=4;
        if(q[0]==0) {
            dir0=0;
        }
        if(q[1]==0) {
            if(dir0==4) {
                dir0=1;
            }
            else {
                dir1=1;
            }
        }
        if(q[2]==0) {
            if(dir0==4) {
                dir0=2;
            }
            else {
                dir1=2;
            }
        }
        if(q[3]==0) {
            dir1=3;
        }
        rand = Math.floor(Math.random()*2);
        if (rand == 0) {
            hum_dir[chosen]=dir0;
        }
        else {
            hum_dir[chosen]=dir1;
        }
    }
    else if (decisions == 3) {
        rand = Math.floor(Math.random()*3);
        if (rand == reversed) {
            hum_dir[chosen]=3;
        }
        else {
            hum_dir[chosen]=rand;
        }
    }
    // Show human's new location
    switch(hum_dir[chosen]) {
        case 0:
        case 1:
            showTile("smr",hum_row[chosen],hum_col[chosen]);
            break;
        case 2:
        case 3:
            showTile("sml",hum_row[chosen],hum_col[chosen]);
            break;
    }
}
// The following functions check the pools in each level to see what types of tiles they border and possibly change the status of the pool
function checkPools() {
    p1 = tileStat[0][1]+tileStat[1][0]+tileStat[2][1]+tileStat[1][2];
    p2 = tileStat[0][18]+tileStat[1][17]+tileStat[2][18]+tileStat[1][19];
    p3 = tileStat[5][5]+tileStat[6][4]+tileStat[7][5]+tileStat[6][6];
    p4 = tileStat[5][14]+tileStat[6][13]+tileStat[7][14]+tileStat[6][15];
    p5 = tileStat[10][2]+tileStat[11][1]+tileStat[12][2]+tileStat[11][3];
    p6 = tileStat[10][17]+tileStat[11][18]+tileStat[12][17]+tileStat[11][16];
    if (p1>5 && tileStat[1][1]==1) {
        tileStat[1][1] = 2;
        NOpools--;
        showTile("bd",1,1);
    }
    if (p2>5 && tileStat[1][18]==1) {
        tileStat[1][18] = 2;
        NOpools--;
        showTile("bd",1,18);
    }
    if (p3>5 && tileStat[6][5]==1) {
        tileStat[6][5] = 2;
        NOpools--;
        showTile("bd",6,5);
    }
    if (p4>5 && tileStat[6][14]==1) {
        tileStat[6][14] = 2;
        NOpools--;
        showTile("bd",6,14);
    }
    if (p5>5 && tileStat[11][2]==1) {
        tileStat[11][2] = 2;
        NOpools--;
        showTile("bd",11,2);
    }
    if (p6>5 && tileStat[11][17]==1) {
        tileStat[11][17] = 2;
        NOpools--;
        showTile("bd",11,17);
    }
}
function checkPools2() {
    p1 = tileStat[0][1]+tileStat[1][0]+tileStat[2][1]+tileStat[1][2];
    p2 = tileStat[0][10]+tileStat[1][9]+tileStat[2][10]+tileStat[1][11];
    p3 = tileStat[9][1]+tileStat[10][0]+tileStat[11][1]+tileStat[10][2];
    p4 = tileStat[9][10]+tileStat[10][9]+tileStat[11][10]+tileStat[10][11];
    p5 = tileStat[7][5]+tileStat[8][4]+tileStat[9][5]+tileStat[8][6];
    p6 = tileStat[7][6]+tileStat[8][5]+tileStat[9][6]+tileStat[8][7];
    if (p1>5 && tileStat[1][1]==1) {
        tileStat[1][1] = 2;
        NOpools--;
        showTile("bd",1,1);
    }
    if (p2>5 && tileStat[1][10]==1) {
        tileStat[1][10] = 2;
        NOpools--;
        showTile("bd",1,10);
    }
    if (p3>5 && tileStat[10][1]==1) {
        tileStat[10][1] = 2;
        NOpools--;
        showTile("bd",10,1);
    }
    if (p4>5 && tileStat[10][10]==1) {
        tileStat[10][10] = 2;
        NOpools--;
        showTile("bd",10,10);
    }
    if (p5>5 && tileStat[8][5]==1) {
        tileStat[8][5] = 2;
        NOpools--;
        showTile("bd",8,5);
    }
    if (p6>5 && tileStat[8][6]==1) {
        tileStat[8][6] = 2;
        NOpools--;
        showTile("bd",8,6);
    }
}
// Functions for calculating player's score
function calcForest() {
    var treesnpools=0;
    if (level==2) {
        for(i=0;i<14;i++) {
            for(j=0;j<14;j++) {
                if (nodes2[i][j] != "2222") {
                    if (tileStat[i][j]==1)
                        treesnpools++;
                }
            }
        }
    }
    else {
        for(i=0;i<row;i++) {
            for(j=0;j<col;j++) {
                if (tileStat[i][j]==1)
                    treesnpools++;
            }
        }
    }
    trees=treesnpools-NOpools;
    if (level==3)
        trees = trees-6;
    return trees;
}
function calcScore() {
    theScore = NOpools * 5 + calcForest()
    return theScore;
}

function KeyCheck(e) {
    var KeyID = (window.event) ? event.keyCode : e.keyCode;
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
    }
}
function pauseButton() {
    alert("Game Paused");
}
// Functions shown if player wins or loses
function youWin() {
    alert("YOU WIN! Your forest is safe. For now...\nTrees saved: " + calcForest() + "\nPools saved: " + NOpools + "\nTotal score: " + calcScore());
    bombTimer1=0;
    var answer = confirm("Oh no! Here come some more...");
    if(answer) {
        if(level==1)
            initializer2();
        else if(level==2)
            initializer3();
        else if(level==3)
            window.location = 'level4nq5dh6rr.html';
    }
    else
        window.location = 'start.html';
}
function youLose() {
    alert("Oh dear.... it looks like you're dead. While your remains decompose, your forest is rapidly converted into timber.");
    bombTimer1=0;
    var answer = confirm("Try again?");
    if(answer) {
        if(level==1)
            initializer1();
        else if(level==2)
            initializer2();
        else if(level==3)
            initializer3();
    }
    else
        window.location = 'start.html';
}
