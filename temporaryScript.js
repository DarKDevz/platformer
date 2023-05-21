let managerObject = this;

function overrideLateUpdate() {
    class OverriddenEnemy extends Enemy {
        lateUpdate() {
            textSize(16);
            fill(0);
            text(this.health, this.x, this.y);
            let speed = 0.025;
            let playerPos = player.pos;

            let targetX = playerPos.x + 100;
            let targetY = playerPos.y;

            this.x = lerp(this.x, targetX, speed);
            this.y = lerp(this.y, targetY, speed);
            if (this.health <= 0) {
                removeObject(levels[activeLevel].boxes.indexOf(this));
                managerObject.enemyMade = false;
            }
            super.lateUpdate();
        }
    }

    let enemy = new OverriddenEnemy(player.pos.x + 100, player.pos.y, player.size.x, player.size.y);
    enemy.typeId = undefined;
    enemy.isShootable = true;
    enemy.health = 100;
    levels[activeLevel].boxes.push(enemy);
    levels[activeLevel].reloadBoxes();
}

if (!this.enemyMade) {
    overrideLateUpdate();
}

this.enemyMade = true;
let LValues = levels[activeLevel].getLevelValues();
let LValueNames = levels[activeLevel].getLevelValueNames();
let LValueIndx = levels[activeLevel].getActualLevelValues();
for (let i = 0; i < LValues.length; i += 1) {
    addMenuInput(LValueNames[i], (val) => {
        let actValue = parseInt(val) ? parseInt(val) : val.replace('"', '').replace('\"', '')
        levels[activeLevel][LValueIndx[i]] = actValue;
        LValues[i] = actValue;
    }, LValues[i])
}