window.GlobalVar = new cc.Class({});

GlobalVar.switchPosToNode = (node, toNode)=>{
    let world = node.parent.convertToWorldSpaceAR(node.getPosition());
    return toNode.convertToNodeSpaceAR(world);
}
GlobalVar.switchPosToNodeLocalPos = (node, pos, toNode)=>{
    let world = node.convertToWorldSpaceAR(pos);
    return toNode.convertToNodeSpaceAR(world);
}
GlobalVar.shuffle = (arr)=>{
    for(let i = arr.length; i ; i--){
        let j = Math.floor(Math.random() * i);
        [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
    }
    return arr;
}
GlobalVar.getRanElementByArray = (arr, count)=>{
    let shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min).map(Number);
}
GlobalVar.ConstVal = {
     AUDIO_DIR : "audios"
}