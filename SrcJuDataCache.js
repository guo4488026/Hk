function cacheData(data){
    let jkdata = data;
    let fileid = jkdata.name+'-'+jkdata.type;
    let cachefile = `hiker://files/cache/_fileSelect_${fileid}.json`;
    if (!fileExist(cachefile)) {
        writeFile(cachefile,JSON.stringify(jkdata));
    }
}

function readData(fileid,datatype){
    let cachefile = `hiker://files/cache/_fileSelect_${fileid}.json`;
    let cachedata = fetch(cachefile);
    if(cachedata != ""){
        try{
            eval("var jkdata=" + cachedata+ ";");
        }catch(e){
            var jkdata = {};
        }
    }else{
        var jkdata = {};
    }
    if(datatype=="主页"){
        return jkdata.parse;
    }else if(datatype=="二级"){
        return jkdata.erparse;
    }else if(datatype=="公共"){
        return jkdata.public;
    }
}