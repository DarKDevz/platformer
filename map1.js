var t_boxes = [];
function addObj(ind,arr) {
	switch(ind) {
	case 0:
	t_boxes.push(new Box(...arr));
	break;
	case 1:
	t_boxes.push(new End(...arr));
	break;
	case 2:
	t_boxes.push(new movingPlatform(...arr));
	break;
	case 3:
	t_boxes.push(new Text(...arr))
	}
}
function setupLevels() {
  boxes = [];
  levels = [];
  addObj(0,[150,250,170,50]);
  addObj(0,[350,100,100,50]);
  addObj(0,[-1,400,810,32]);
  addObj(1,[610,200,60,100]);
  addObj(0,[600,300,150,32]);
  addObj(0,[600,300,32,100]);
  addObj(2,[-500,350,60,50, 0, 500]);
  addLevel(t_boxes, createVector(400,-10));
  t_boxes = [];
  //2nd Level
  addObj(0,[350,100,100,50]);
  addObj(0,[-1,400,890,32]);
  addObj(0,[600,300,260,32]);
  addObj(0,[860,300,10,100]);
  addObj(2,[450,350,60,50, 350, 600]);
  addObj(3,[500, 330,'S to crouch']);
  addObj(1,[790,350,60,50]);
  addLevel(t_boxes, createVector(400,-10));
  t_boxes = [];
  //3rd Level
  addObj(0,[150,250,170,50]);
  addObj(0,[350,100,100,50]);
  addObj(0,[-1,400,810,32]);
  addObj(0,[50,360,50 ,32]);
  addObj(0,[600,300,150,32]);
  addObj(0,[600,300,32,100]);
  addLevel(t_boxes, createVector(400,-10));
  Levels();
}
function Levels() {
	levels[0].loadLevel();
}
