let cfgfile = "hiker://files/rules/Src/Hk/config.json";
let Jucfg=fetch(cfgfile);
if(Jucfg != ""){
    eval("var Juconfig=" + Jucfg+ ";");
}else{
    var Juconfig= {};
    writeFile(cfgfile, JSON.stringify(Juconfig));
}
let runModes = ["正版","动漫","影视","其他"];
let runMode = Juconfig["runMode"] || "影视";
let sourcename = Juconfig[runMode+'sourcename'] || "";//主页源名称

let sourcefile = "hiker://files/rules/Src/Hk/jiekou.json";
let sourcedata = fetch(sourcefile);
if(sourcedata != ""){
    try{
        eval("var datalist=" + sourcedata+ ";");
    }catch(e){
        var datalist = [];
    }
}else{
    var datalist = [];
}
datalist.reverse();

let yxdatalist = datalist.filter(it=>{
    return !it.stop;
});
let yidatalist = yxdatalist.filter(it=>{
    return it.parse;
});
let erdatalist = yxdatalist.filter(it=>{
    return it.erparse;
});
function selectsource(input) {
    let sourcenames = [];
    yidatalist.forEach(it=>{
        if(it.type==input && sourcenames.indexOf(it.name)==-1){
            if(Juconfig[runMode+'sourcename'] == it.name){
                it.name = '‘‘’’<span style="color:red" title="'+it.name+'">'+it.name+'</span>';
            }
            sourcenames.push(it.name);
        }
    })
    return $(sourcenames,3,"选择"+input+"主页源").select((runMode,sourcename,cfgfile,Juconfig) => {
        input = input.replace(/‘|’|“|”|<[^>]+>/g,"");
        if(Juconfig["runMode"] == runMode && input==Juconfig[runMode+'sourcename']){
            return 'toast://'+runMode+' 主页源：' + input;
        }
        if (typeof (unRegisterTask) != "undefined") {
            unRegisterTask("juyue");
        }else{
            toast("软件版本过低，可能存在异常");
        }
        clearMyVar(MY_RULE.title + "分类");
        clearMyVar(MY_RULE.title + "更新");
        clearMyVar(MY_RULE.title + "类别");
        clearMyVar(MY_RULE.title + "地区");
        clearMyVar(MY_RULE.title + "进度");
        clearMyVar(MY_RULE.title + "排序");
        clearMyVar("排名");
        clearMyVar("分类");
        clearMyVar("更新");
        clearMyVar(runMode+"_"+sourcename);
        clearMyVar("一级源接口信息");
        Juconfig["runMode"] = runMode;
        Juconfig[runMode+'sourcename'] = input;
        writeFile(cfgfile, JSON.stringify(Juconfig));
        refreshPage(false);
        return 'toast://'+runMode+' 主页源已设置为：' + input;
    }, input, sourcename, cfgfile, Juconfig)
}
function rulePage(type,page) {
    return $("hiker://empty#noRecordHistory##noHistory#" + (page ? "?page=fypage" : "")).rule((type) => {
        require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js');
        getYiData(type);
    },type)
}


function lunbo(start, arr, data, cfg) {
     
    let id = 'juyue';
    var rnum = Math.floor(Math.random() * data.length);
    var item = data[rnum];
    putMyVar('rnum', rnum);
    let time = 5000;
    let col_type = 'pic_1_card';
    let desc = '';
    if (cfg != undefined) {
        time = cfg.time ? cfg.time : time;
        col_type = cfg.col_type ? cfg.col_type : col_type;
        desc = cfg.desc ? cfg.desc : desc;
    }

    arr.push({
        col_type: col_type,
        img: item.img,
        desc: desc,
        title: item.title,
        url: item.url,
        extra: {
            id: 'bar',
        }
    })

    if (start == false || getMyVar('benstart', 'true') == 'false') {
        unRegisterTask(id)
        return
    }

    let obj = {
        data: data,
    };

    registerTask(id, time, $.toString((obj) => {
        var data = obj.data;
        var rum = getMyVar('rnum');

        var i = Number(getMyVar('banneri', '0'));
        if (rum != '') {
            i = Number(rum) + 1
            clearMyVar('rnum')
        } else {
            i = i + 1;
        }
        //log(i)
        //log(data.length)

        if (i > data.length - 1) {
            i = 0
        }
        var item = data[i];
        //log(item)
        try {
            updateItem('bar', {
                title: item.title,
                img: item.img,
                extra: {
                    name: item.title,
                    sname: item.extra.sname,
                    stype: item.extra.stype,
                    surl: item.url,
                    //img:item.img,
                    pageTitle: item.title,
                }
            })
        } catch (e) {
            log(e.message)
            unRegisterTask('banner')
        }
        putMyVar('banneri', i);

    }, obj))

}
//获取一级数据
function getYiData(type,od) {
    let d = od || [];
    let sourcedata = yidatalist.filter(it=>{
        return it.name==sourcename && it.type==runMode;
    });
    let parse;
    let 公共;
    try{
        if(sourcedata.length>0){
            eval("let source = " + sourcedata[0].parse);
            if(source.ext && /^http/.test(source.ext)){
                requireCache(source.ext, 48);
                parse = yidata;
            }else{
                parse = source;
            }
        }
    }catch(e){
        log("√一级源接口加载异常>"+e.message);
    }
    if(parse){
        eval("let gonggong = " + sourcedata[0].public);
        if (gonggong && gonggong.ext && /^http/.test(gonggong.ext)) {
            requireCache(gonggong.ext, 48);
            gonggong = ggdata;
        }
        公共 = gonggong || parse['公共'] || {};
        let info = storage0.getMyVar('一级源接口信息');
        let 标识 = info.type + "_" + info.name;
        let page = MY_PAGE || 1;
        let data = [];
        try{
            eval("let 数据 = " + parse[type])
            data = 数据();
        }catch(e){
            log(e.message);
        }
        if(data.length==0 && page==1){
            data.push({
                title: "未获取到数据",
                url: "hiker://empty",
                col_type: "text_center_1",
            })
        }
        data.forEach(item => {
            let extra = item.extra || {};
         
            extra.name = extra.name || extra.pageTitle || (item.title?item.title.replace(/‘|’|“|”|<[^>]+>/g,""):"");
            extra.img = extra.img || item.pic_url || item.img;
            
            extra.stype = extra.stype||sourcedata[0].type;
            extra.pageTitle = extra.pageTitle || extra.name;
            if(item.url && !/js:|select:|\(|\)|=>|@|toast:|hiker:\/\/page/.test(item.url)){
                extra.surl = item.url.replace(/hiker:\/\/empty|#immersiveTheme#|#autoCache#|#noRecordHistory#|#noHistory#|#noLoading#|#/g,"");
                extra.sname = extra.sname||sourcename;
            }
            if((item.col_type!="scroll_button") || item.extra){
                item.extra = extra;
            }
            item.url = (extra.surl||!item.url)?$('hiker://empty#immersiveTheme##autoCache#').rule(() => {
                require(config.依赖);
                erji();
            }):item.url
          
        })
        d = d.concat(data);
    }else{
        d.push({
            title: "请先配置一个主页源\n设置-选择影视/动漫/...",
            url: "hiker://empty",
            col_type: "text_center_1",
        })
    }
    setResult(d);
}
//简繁互转,x可不传，默认转成简体，传2则是转成繁体
function jianfan(str,x) {
    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcSimple.js');
    return PYStr(str,x);
}