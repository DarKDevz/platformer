MapData = { data: `{"0":[[0,150,250,170,50],[0,350,100,100,50],[0,-1,400,810,32],[1,610,200,60,100],[0,600,300,150,32],[0,600,300,32,100],[2,295,350,60,50,0,500],[5,529,73,"let managerObject = this;  function overrideLateUpdate() {     class OverriddenEnemy extends Enemy {         lateUpdate() {             textSize(16);             fill(0);             text(this.health, this.x, this.y);             let speed = 0.025;             let playerPos = player.pos;              let targetX = playerPos.x + 100;             let targetY = playerPos.y;              this.x = lerp(this.x, targetX, speed);             this.y = lerp(this.y, targetY, speed);             if (this.health <= 0) {                 removeObject(levels[activeLevel].boxes.indexOf(this));                 managerObject.enemyMade = false;             }             super.lateUpdate();         }     }      let enemy = new OverriddenEnemy(player.pos.x + 100, player.pos.y, player.size.x, player.size.y);     enemy.typeId = undefined;     enemy.isShootable = true;     enemy.health = 100;     levels[activeLevel].boxes.push(enemy);     levels[activeLevel].reloadBoxes(); }  if (!this.enemyMade) {     overrideLateUpdate(); }  this.enemyMade = true;",25]],"1":[[0,350,100,100,50],[0,-1,400,890,32],[0,600,300,260,32],[0,860,300,10,100],[2,390,350,60,50,350,600],[3,500,330,"S to crouch"],[1,790,350,60,50]],"2":[[0,150,250,170,50],[0,350,100,100,50],[0,-1,400,810,32],[0,50,360,50,32],[0,600,300,150,32],[0,600,300,32,100],[2,280,13,50,50,90,590],[0,-160,-50,150,50],[0,-372,268,150,50],[0,-766,168,150,50],[0,-1205,-60,150,50],[0,-133,-3,50,350],[0,-1354,-441,150,50],[0,-1551,-223,150,50],[0,-984,-643,150,50],[0,-407,-758,150,50],[1,48,-843,50,25]],"3":[[0,-83,84,150,50],[0,322,90,150,50],[0,147,-21,50,100],[0,532,-89,50,100],[2,583,-315,100,50,500,800],[0,1130,-426,150,50],[0,1398,-478,50,100],[0,1514,-488,150,50],[0,1492,-1061,150,500],[0,1831,-566,150,50],[1,2225,-808,50,50]],"4":[[0,401,64,50,50],[0,451,-22,30,89],[0,375,-85,117,64],[0,323,-57,26,1],[0,346,-55,36,62],[0,292,69,109,46],[0,113,68,99,48],[0,-53,-39,99,45],[0,-97,-173,99,48],[2,229,-203,199,85,-17,483],[4,108,-179,44,37],[4,190,-180,58,41],[4,21,-181,258,43],[4,21,-181,258,43],[0,712,-130,126,38],[0,712,-130,126,38],[0,1127,173,32,29],[0,1377,180,43,27],[4,1495,7,59,38],[0,1612,-15,52,47],[0,-314,42,75,47],[0,1202,-307,38,188],[4,676,-212,0,0],[4,602,-331,107,187],[0,1201,-499,40,140],[0,1936,-17,51,40],[0,2711,-23,125,37],[4,2712,-97,75,80],[1,2839,16,34,14],[4,2924,-118,31,128]],"5":[[0,96,64,438,434],[0,389,-79,139,51],[0,1770,-191,380,123],[0,2312,-212,173,101],[0,2632,-75,81,134],[0,2859,39,112,130],[0,3051,115,104,101],[0,3277,179,113,86],[0,3502,246,58,52],[0,3645,258,170,108],[0,3977,325,230,133],[0,4371,442,336,140],[0,4933,549,315,171],[0,5286,349,255,78],[0,5391,231,134,33],[4,5277,-203,136,470],[1,5888,266,90,65],[4,5695,173,140,415],[0,4704,-118,275,500],[4,5777,-370,140,415],[3,547,-183,"Vai tutto a destra scemu"]],"6":[[0,-35,-269,127,385]]}` }