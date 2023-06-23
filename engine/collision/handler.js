function HandleCollision() {
    let newArgs = [...arguments];
    let type1 = (newArgs.shift())
    let type2 = (newArgs.shift())
    let func = window[('collide')+type1+type2]
    if(type2==="CircleVector") {
        //console.log(newArgs);
    }
    if(typeof func === "function") {
        //console.error('collision between: ',type1,' and ',type2)
        return func(...newArgs);
    }else {
        console.error('collision between: ',type1,' and ',type2,'  doesnt exist')
    }
}