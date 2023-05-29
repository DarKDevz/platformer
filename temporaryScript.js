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
            _sprite.width = player.size.x;
            _sprite.height = player.size.y;
            image(_sprite, this.x, this.y);
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
    let _img = JSON.parse(this.components[1].src);
    console.log(_img);
    var _sprite = loadImage("data:image/png;base64," + _img["imageb64"].toString());
    _sprite.width = _img.width;
    _sprite.height = _img.height;
}
this.enemyMade = true;