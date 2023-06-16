this.isCollidable = false;
this.listOfBoxes = {};
this.lastPress = false;
this.draw = function() {
  return 1;
};
this.update = function() {
  if (mouseIsPressed) {
      let roundedX = mouseX + player.cameraPos.x - 32;
      roundedX = Math.round(roundedX / 64) * 64;
      let roundedY = mouseY + player.cameraPos.y - 32;
      roundedY = Math.round(roundedY / 64) * 64;
      if (this.listOfBoxes[roundedX + ',' + roundedY]) {
        /*Block has already been added*/
        if(!this.lastPress) {
        this.listOfBoxes[roundedX + ',' + roundedY].isCollidable = true;
        this.listOfBoxes[roundedX + ',' + roundedY].shown.index += 1;
        if (this.listOfBoxes[roundedX + ',' + roundedY].shown.index >= 16) {
          this.listOfBoxes[roundedX + ',' + roundedY].shown.index = 4;
        }else if(this.listOfBoxes[roundedX + ',' + roundedY].shown.index == 15){
          this.listOfBoxes[roundedX + ',' + roundedY].isCollidable = false;
        };
        }
      } else {
        let box = new Box(roundedX, roundedY, 64, 64);
        this.listOfBoxes[roundedX + ',' + roundedY] = box;
        engine.getActiveScene().boxes.push(box);
        console.warn(box);
        let params = {
          fileUUID: '0xa428cdb409c950',
          vals: {
            index: 12
          }
        };
        box.components.push(new componentList['gameScript']({
          ...params,
          obj: box
        }));
        params = {
          fileUUID: '0xabe79e914218f8',
          src: {
            width: 256,
            height: 256
          }
        };
        box.components.push(new componentList['gameSprite']({
          ...params,
          obj: box
        }));
        box.typeId = undefined;
      }
    }
    this.lastPress = mouseIsPressed;
}