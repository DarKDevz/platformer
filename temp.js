class Object {
    constructor() {
        this.overrides = {};
        this.savedFuncs = {};
    }

    onCollide(a, b, c) {
        // Normal code
        console.log(["Og", a, b, c, this]);
    }

    notAffected() {
        // Normal code
        console.log("Inside this.notAffected");
    }

    addOverrides(overridesObj) {
        for (let i in overridesObj) {
            console.log(i);
            //check if the overriden value even exists and if we want to replace with a function
            if (this[i] !== undefined && typeof overridesObj[i] === "function") {
                if (this.savedFuncs[i] === undefined) {
                    this.savedFuncs[i] = this[i];
                }
                this[i] = function() {
                    overridesObj[i].call(this, ...arguments);
                    this.savedFuncs[i].call(this, ...arguments);
                }
                console.log(overridesObj[i]);
            }
        }
    }
}

// Example usage
const obj = new Object();
obj.onCollide(2, 3, 1); // Logs: Inside this.onCollide
obj.notAffected(); // Logs: Inside this.notAffected

obj.addOverrides({
    onCollide: (a) => {
        console.log("works", a);
    }
});

obj.onCollide(1, 2, 3); // Logs: Inside this.onCollide, Value inside the overrides object: () => { alert("works"); }
obj.notAffected(); // Logs: Inside this.notAffected

obj.addOverrides({
    onCollide: function() {
        console.log("updated", arguments);
    },
    notAffected: function() {
        alert("weird Change")
    }
});

obj.onCollide(2, 3, 5); // Logs: Inside this.onCollide, Value inside the overrides object: () => { alert("updated"); }
obj.notAffected(); // Logs: Inside this.notAffected