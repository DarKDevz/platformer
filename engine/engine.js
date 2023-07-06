var engine;
class Engine {
    constructor() {
        this.scene = [];
        this.activeScene;
        this.files = {};
        this.uuidList = {};
        this.hasUUID = false;
        this.assignedUUID = 0;
        this.cameraPos = {x:0,y:0};
        this.world = new b2World(new b2Vec2(0, 100)    //gravity
        ,  true ); // wheter to doSleep enabled to true because otherwise it will fuck over performance
        this.world.SetContactListener(contactListener)
        // this.body = new p2.Body({ mass: 1 });
        // this.world.addBody(this.body);
    }
    get componentList() {
        return Engine.componentList
    }
    set componentList(value) {
        console.trace()
        throw new Error("You can't set component list")
        //return false;
    }
    deleteGameFile(id,value = false) {
        delete this.files[this.getByReference(id,value).UUID]
    }
    getByReference(id,value=false) {
        if(this.files[id]) {
            return this.files[id];
        }else {
            for(let fileUUID in this.files) {
                let file = this.files[fileUUID];
                if(!value) {
                    for(let type in file.references) {
                        let reference = file.references[type];
                        if(reference == id) return file;
                    }
                }
                if(file.references[id]===value) return file;
            }
            return false;
        }
    }
    customFileUUID(fileType) {
        if(this.hasUUID) {
            this.hasUUID = false;
            return this.assignedUUID;
        }
        let fileName = Array.from(fileType);
        fileName.shift();
        fileName = fileName.toString().replaceAll(",","")
        var UUID = fileName+"file";
        let stack = -1;
        while(this.files[UUID]) {
            stack++;
            UUID = fileName+"file"+stack;
            if(stack>=99999999) {
                throw new Error("Stack exceeded! Math.random is broken or uuid list is filled");
            }
        }
        return UUID;
    }
    assignUUID(UUID) {
        this.hasUUID = true;
        this.assignedUUID = UUID;
    }
    getfromUUID(UUID) {
        return this.uuidList[UUID];
    }
    getActiveScene() {
        return this.scene[this.activeScene];
    }
    changeUUID(ogUUId,newUUID) {
        let ogVal = this.uuidList[ogUUId];
        delete this.uuidList[ogUUId];
        this.uuidList[newUUID] = ogVal;
        return this.uuidList[newUUID];
    }
    generateUUID() {
        if(this.hasUUID) {
            this.hasUUID = false;
            return this.assignedUUID;
        }
        var UUID = "0x"+(Math.random()*99999999999999999).toString(16);
        let stack = 0;
        while(this.uuidList[UUID]) {
            stack++;
            UUID = "0x"+(Math.random()*99999999999999999).toString(16);
            if(stack>=99999999) {
                throw new Error("Stack exceeded! Math.random is broken or uuid list is filled");
            }
        }
        return UUID;
    }
}