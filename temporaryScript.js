    textSize(16);
    fill(0);
    this.x = player.pos.x;
    this.y = player.pos.y;
    text(player.vel.x, this.x, this.y);
    if (keyIsDown(69) && typeof this.obstacleAdded !== undefined) {
        this.obstacleAdded = true;
        levels[activeLevel].boxes.push(new Box(533, 119, 222, 77));
        levels[activeLevel].boxes.push(new Box(536, 158, 61, 140));
        levels[activeLevel].reloadBoxes();
    }