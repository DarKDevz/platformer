function HandleCollision() {
    let newArgs = Object.values(arguments);
    let type1 = (newArgs.shift())
    let type2 = (newArgs.shift())
    let func = window[('collide')+type1+type2]
    if(typeof func === "function") {
        //console.error('collision between: ',type1,' and ',type2)
        return func(...newArgs);
    }else {
        console.trace()
        throw new Error('collision between: ',type1,' and ',type2,'  doesnt exist')
    }
}