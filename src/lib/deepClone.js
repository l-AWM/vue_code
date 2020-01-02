export const deepClone = (data) => {
    //function 排除在外
    if(typeof data !== 'object' || data === null) return data;
    if(data instanceof Date) return new Date(data);
    if(data instanceof RegExp) return new RegExp(data);
    //对象 与 数组
    let newData = new data.constructor;
    //console.log(newData);
    for(let key in data){ //遍历属性
        //判断是否位自身的属性
        if(data.hasOwnProperty(key)){
            //console.log(key);
            newData[key] = deepClone(data[key]);
        }
        //判断对象循环 属性 引用 自己 
    }
    return newData;
}

//有环
// let a ={a:1,b:[1,2,3,{a:456}]};
// let c = a;
// a.e = c;
// let b = deepClone(a);

// console.log(a);
// console.log(b);