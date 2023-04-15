function bookCase() {
    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js');
    let Julist = [];
    let collection = JSON.parse(fetch("hiker://collection?rule="+MY_RULE.title));
    collection.forEach(it => {
        try{
            if(it.params&& (JSON.parse(it.params).title==MY_RULE.title)){
                Julist.push(it);
            }
        }catch(e){
            log("√书架加载异常>"+e.message);
        }
    })

    let d = [];
    d.push({
        title: ' 本地书架',
        url: getMyVar("SrcJuBookType","全部")=="全部"?"hiker://page/Main.view?rule=本地资源管理":"hiker://page/Bookrack.view?rule=本地资源管理&ruleName="+MY_RULE.title+"&type="+(getMyVar("SrcJuBookType")=="漫画"?"comic":"novel"),
        img: "https://lanmeiguojiang.com/tubiao/messy/70.svg",
        col_type: "icon_2"
    });
    d.push({
        title: ' 切换样式',
        url: $('#noLoading#').lazyRule((cfgfile, Juconfig) => {
            if(Juconfig["bookCase_col_type"]=="movie_1_vertical_pic"){
                Juconfig["bookCase_col_type"] = "movie_3_marquee";
            }else{
                Juconfig["bookCase_col_type"] = "movie_1_vertical_pic";
            }
            writeFile(cfgfile, JSON.stringify(Juconfig));
            refreshPage(false);
            return 'hiker://empty';
        }, cfgfile, Juconfig),
        img: "https://lanmeiguojiang.com/tubiao/messy/85.svg",
        col_type: "icon_2"
    });
    for (let i = 0; i < 8; i++) {
        d.push({
            col_type: "blank_block"
        })
    }
    let typebtn = runModes;
    typebtn.unshift("全部");
    typebtn.forEach(it =>{
        d.push({
            title: getMyVar("SrcJuBookType","全部")==it?`““””<b><span style="color: #3399cc">`+it+`</span></b>`:it,
            url: $('#noLoading#').lazyRule((it) => {
                putMyVar("SrcJuBookType",it);
                refreshPage(false);
                return "hiker://empty";
            },it),
            col_type: 'scroll_button'
        })
    })

    Julist.forEach(it => {
        try{
            let params = JSON.parse(it.params);
            let stype = JSON.parse(params.params).stype;
            if(getMyVar("SrcJuBookType")==stype || getMyVar("SrcJuBookType","全部")=="全部"){
                let name = JSON.parse(params.params).name;
                let sname = JSON.parse(params.params).sname;
                let extraData = it.extraData?JSON.parse(it.extraData):{};
                let last = extraData.lastChapterStatus?extraData.lastChapterStatus:"";
                let mask = it.lastClick?it.lastClick.split('@@')[0]:"";
                let col = Juconfig["bookCase_col_type"] || 'movie_1_vertical_pic';
                d.push({
                    title: col=='movie_1_vertical_pic'?name + "\n\n‘‘’’<small>💠 "+stype+" | "+(sname||"")+"</small>":name,
                    pic_url: it.picUrl,
                    desc: col=='movie_1_vertical_pic'?"🕓 "+mask+"\n\n🔘 "+last:last,
                    url: $("hiker://empty#immersiveTheme##autoCache#").rule(() => {
                        require(config.依赖);
                        erji();
                        putMyVar('SrcBookCase','1');
                    }),
                    col_type: col,
                    extra: {
                        pageTitle: name,
                        name: name,
                        img: it.picUrl,
                        stype: stype,
                        lineVisible: false,
                        cls: "caselist"
                    }
                })
            }
        }catch(e){
            log("√书架加载异常>"+e.message);
        }
    })
    d.push({
        title: Julist.length==0?"书架空空如也~♥收藏即加入书架":"",
        url: "hiker://empty",
        col_type: "text_center_1",
        extra: {
            lineVisible: false,
            id: "caseloading"
        }
    })
    setResult(d);
}