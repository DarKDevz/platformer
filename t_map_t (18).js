{"0":[[0,150,250,170,50],[0,350,100,100,50],[0,-1,400,810,32],[1,610,200,60,100],[0,600,300,150,32],[0,600,300,32,100],[2,442,350,60,50,0,500],[5,529,73,0,25],[5,294,58,0,25]],"1":[[0,350,100,100,50],[0,-1,400,890,32],[0,600,300,260,32],[0,860,300,10,100],[2,522,350,60,50,350,600],[3,500,330,"S to crouch"],[1,790,350,60,50]],"2":[[0,150,250,170,50],[0,350,100,100,50],[0,-1,400,810,32],[0,50,360,50,32],[0,600,300,150,32],[0,600,300,32,100],[2,289,13,50,50,90,590],[0,-160,-50,150,50],[0,-372,268,150,50],[0,-766,168,150,50],[0,-1205,-60,150,50],[0,-133,-3,50,350],[0,-1354,-441,150,50],[0,-1551,-223,150,50],[0,-984,-643,150,50],[0,-407,-758,150,50],[1,48,-843,50,25]],"3":[[0,-83,84,150,50],[0,322,90,150,50],[0,147,-21,50,100],[0,532,-89,50,100],[2,661,-315,100,50,500,800],[0,1130,-426,150,50],[0,1398,-478,50,100],[0,1514,-488,150,50],[0,1492,-1061,150,500],[0,1831,-566,150,50],[1,2225,-808,50,50]],"4":[[0,401,64,50,50],[0,451,-22,30,89],[0,375,-85,117,64],[0,323,-57,26,1],[0,346,-55,36,62],[0,292,69,109,46],[0,113,68,99,48],[0,-53,-39,99,45],[0,-97,-173,99,48],[2,262,-203,199,85,-17,483],[4,108,-179,44,37],[4,190,-180,58,41],[4,21,-181,258,43],[4,21,-181,258,43],[0,712,-130,126,38],[0,712,-130,126,38],[0,1127,173,32,29],[0,1377,180,43,27],[4,1495,7,59,38],[0,1612,-15,52,47],[0,-314,42,75,47],[0,1202,-307,38,188],[4,676,-212,0,0],[4,602,-331,107,187],[0,1201,-499,40,140],[0,1936,-17,51,40],[0,2711,-23,125,37],[4,2712,-97,75,80],[1,2839,16,34,14],[4,2924,-118,31,128]],"5":[[0,96,64,438,434],[0,389,-79,139,51],[0,1770,-191,380,123],[0,2312,-212,173,101],[0,2632,-75,81,134],[0,2859,39,112,130],[0,3051,115,104,101],[0,3277,179,113,86],[0,3502,246,58,52],[0,3645,258,170,108],[0,3977,325,230,133],[0,4371,442,336,140],[0,4933,549,315,171],[0,5286,349,255,78],[0,5391,231,134,33],[4,5277,-203,136,470],[1,5888,266,90,65],[4,5695,173,140,415],[0,4704,-118,275,500],[4,5777,-370,140,415],[3,547,-183,"Vai tutto a destra scemu"]],"6":[[0,-35,-269,127,385],[0,170,241,817,383],[5,422,165,0,50],[0,309,41,385,68],[0,2169,181,659,234],[5,1192,53,0,40],[5,2246,116,0,50],[0,3523,-46,1000,88],[0,4801,-175,1000,88],[4,943,-148,89,242],[0,6056,-304,1000,88],[1,6968,-430,53,105]],"7":[[0,-222,-111,428,150],[0,-227,-552,27,427],[4,-165,-383,400,103],[0,374,-170,214,126],[5,11,-468,0,1],[3,476,-277,"vai tutto dritto- cit.sponton"],[3,520,-336,"a destra-sponton"],[0,1512,-250,643,172],[0,3268,-313,389,122],[0,4635,-356,608,176],[0,4774,-375,53,199],[0,4734,-544,131,455],[4,4769,-695,59,71],[1,5021,-502,125,142]],"0l":[0,400,-10,500],"1l":[1,400,-10,500],"2l":[2,400,-10,500],"3l":[3,400,-10,500],"4l":[4,400,-10,500],"5l":[5,400,-10,500],"6l":[6,400,150,500],"7l":[7,0,-500,500],"0c":[{"7":[{"name":"gameScript","params":{"fn":"let managerObject = this;function overrideLateUpdate() {class OverriddenEnemy extends Enemy {lateUpdate() {textSize(16);fill(0);text(this.health, this.x, this.y);let speed = 0.025;let playerPos = player.pos;let targetX = playerPos.x + 100;let targetY = playerPos.y;this.x = lerp(this.x, targetX, speed);this.y = lerp(this.y, targetY, speed);if (this.health <= 0) {removeObject(levels[activeLevel].boxes.indexOf(this));managerObject.enemyMade = false;}_sprite.width = player.size.x;_sprite.height = player.size.y;image(_sprite, this.x, this.y);super.lateUpdate();}}let enemy = new OverriddenEnemy(player.pos.x + 100, player.pos.y, player.size.x, player.size.y);enemy.typeId = undefined;enemy.isShootable = true;enemy.health = 100;levels[activeLevel].boxes.push(enemy);levels[activeLevel].reloadBoxes();}if (!this.enemyMade) {overrideLateUpdate();let _img = JSON.parse(this.components[1].src);console.log(_img);var _sprite = loadImage(\"data:image/png;base64,\" + _img[\"imageb64\"].toString());_sprite.width = _img.width;_sprite.height = _img.height;}this.enemyMade = true;"}},{"name":"gameSprite","params":{"src":"{\"imageb64\":\"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\",\"width\":707,\"height\":879}"}}]},{"8":[{"name":"gameScript","params":{"fn":"player.shootingDelay  = 50;"}}]}],"1c":[],"2c":[],"3c":[],"4c":[],"5c":[],"6c":[{"2":[{"name":"gameScript","params":{"fn":"let managerObject = this; player.shootingDelay = Infinity; function overrideLateUpdate() { class OverriddenEnemy extends Enemy { earlyUpdate() { if (this.collision(player)) { player.playerDeath(); this.health = 100; } super.earlyUpdate(); } lateUpdate() { textSize(16); fill(0); text(this.health, this.x, this.y); let speed = 0.025; let playerPos = player.pos; let targetX = playerPos.x + this.dirX; let targetY = playerPos.y + this.dirY; this.x = lerp(this.x, targetX, speed); this.y = lerp(this.y, targetY, speed); if (this.health <= 0) { removeObject(levels[activeLevel].boxes.indexOf(this)); managerObject.enemyMade = false; } super.lateUpdate(); } } let enemy = new OverriddenEnemy(player.pos.x + 100, player.pos.y, player.size.x, player.size.y); enemy.typeId = undefined; enemy.isShootable = true; enemy.health = 100; enemy.dirX = 100; enemy.dirY = 0; levels[activeLevel].boxes.push(enemy); levels[activeLevel].reloadBoxes(); } if (!this.enemyMade) { overrideLateUpdate(); } this.enemyMade = true;"}}]},{"5":[{"name":"gameScript","params":{"fn":"player.shootingDelay = 50;"}}]},{"6":[{"name":"gameScript","params":{"fn":"let managerObject = this; function overrideLateUpdate() { class OverriddenEnemy extends Enemy { earlyUpdate() { if (this.collision(player)) { player.playerDeath(); this.health = 100; } super.earlyUpdate(); } lateUpdate() { textSize(16); fill(0); text(this.health, this.x, this.y); let speed = 0.04; let playerPos = player.pos; let targetX = playerPos.x + this.dirX; let targetY = playerPos.y + this.dirY; this.x = lerp(this.x, targetX, speed); this.y = lerp(this.y, targetY, speed); if (this.health <= 0) { removeObject(levels[activeLevel].boxes.indexOf(this)); managerObject.enemyMade = false; } super.lateUpdate(); } } let enemy = new OverriddenEnemy(player.pos.x - 100, player.pos.y, player.size.x, player.size.y); enemy.typeId = undefined; enemy.isShootable = true; enemy.health = 100; enemy.dirX = 100; enemy.dirY = 0; levels[activeLevel].boxes.push(enemy); levels[activeLevel].reloadBoxes(); } if (!this.enemyMade) { overrideLateUpdate(); } this.enemyMade = true;"}}]}],"7c":[{"4":[{"name":"gameScript","params":{"fn":"player.shootingDelay = 25;"}}]}]}