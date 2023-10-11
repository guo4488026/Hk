function bookCase() {
    let publicfile;
    try {
        publicfile = config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js';
    } catch (e) {
        let cfgfile = "hiker://files/rules/Src/Hk/config.json";
        if (fileExist(cfgfile)) {
            eval("let Juconfig=" + fetch(cfgfile) + ";");
            publicfile = Juconfig["依赖"].match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js';
        }
    }
    require(publicfile);
    addListener("onClose", $.toString(() => {
        clearMyVar('SrcJuBookType')
    }))
    let Julist = [];
    let collection = JSON.parse(fetch("hiker://collection?rule=" + MY_RULE.title));
    collection.forEach(it => {
        try {
            if (it.params && (JSON.parse(it.params).title == MY_RULE.title)) {
                Julist.push(it);
            }
        } catch (e) {
            log("√书架加载异常>" + e.message);
        }
    })
    setPageTitle('我的收藏');
    let d = [];
    d.push({
        title: '我的收藏',
        url: "hiker://collection?rule=搜视",
        img: "https://hikerfans.com/tubiao/messy/70.svg",
        col_type: "icon_small_3"
    });
    d.push({
        title: ' 切换样式',
        url: $('#noLoading#').lazyRule((cfgfile, Juconfig) => {
            if (Juconfig["bookCase_col_type"] == "movie_1_vertical_pic") {
                Juconfig["bookCase_col_type"] = "movie_3_marquee";
            } else {
                Juconfig["bookCase_col_type"] = "movie_1_vertical_pic";
            }
            writeFile(cfgfile, JSON.stringify(Juconfig));
            refreshPage(false);
            return 'hiker://empty';
        }, cfgfile, Juconfig),
        img: "https://hikerfans.com/tubiao/messy/85.svg",
        col_type: "icon_small_3"
    });
    d.push({
        title: ' 切换模式',
        url: $('#noLoading#').lazyRule(() => {
            if (getMyVar("SrcJuBookType")) {
                clearMyVar("SrcJuBookType")
            } else {
                putMyVar("SrcJuBookType", "全部")
            }
            refreshPage(false)
            return "hiker://empty"
        }),
        img: "https://hikerfans.com/tubiao/messy/9.svg",
       col_type:"icon_small_3"
    })
    for (let i = 0; i < 8; i++) {
        d.push({
            col_type: "blank_block"
        })
    }
    let typebtn = runModes;

    if (getMyVar("SrcJuBookType")) {
        typebtn.unshift("全部");
        typebtn.forEach(it => {
            d.push({
                title: getMyVar("SrcJuBookType", "全部") == it ? `““””<b><span style="color: #3399cc">` + it + `</span></b>` : it,
                url: $('#noLoading#').lazyRule((it) => {
                    putMyVar("SrcJuBookType", it);
                    refreshPage(false);
                    return "hiker://empty";
                }, it),
                col_type: 'scroll_button'
            })
        })





        Julist.forEach(it => {
            try {
                let params = JSON.parse(it.params);

                let stype = JSON.parse(params.params).stype;
                if (getMyVar("SrcJuBookType") == stype || getMyVar("SrcJuBookType", "全部") == "全部") {
                    let name = it.mTitle.indexOf(JSON.parse(params.params).name) > -1 ? JSON.parse(params.params).name : it.mTitle;
                    let sname = JSON.parse(params.params).sname;
                    let surl = JSON.parse(params.params).surl;
                    let extraData = it.extraData ? JSON.parse(it.extraData) : {};
                    let last = extraData.lastChapterStatus ? extraData.lastChapterStatus : "";
                    let mask = it.lastClick ? it.lastClick.split('@@')[0] : "";
                    let col = Juconfig["bookCase_col_type"] || 'movie_1_vertical_pic';
                    d.push({
                        title: col == 'movie_1_vertical_pic' ? name + "\n\n‘‘’’<small>💠 " + stype + " | " + (sname || "") + "</small>" : name,
                        pic_url: it.picUrl,
                        desc: col == 'movie_1_vertical_pic' ? "🕓 " + mask + "\n\n🔘 " + last : last,
                        url: $("hiker://empty#immersiveTheme##autoCache#").rule(() => {
                            require(config.依赖);
                            erji();
                            putMyVar('SrcBookCase', '1');
                        }),
                        col_type: col,
                        extra: {
                            pageTitle: name,
                            name: name,
                            img: it.picUrl,
                            sname: sname,
                            surl: surl,
                            stype: stype,
                            sourcedata: JSON.parse(params.params).sourcedata,
                            lineVisible: false,
                            cls: "caselist"
                        }
                    })
                }
            } catch (e) {
                log("√书架加载异常>" + e.message);
            }
        })
    } else {
        var m = {
            1: "0",
            2: "1",
            3: "2",
            4: "3",
            5: "4",
            6: "5",
            0: "6"
        };

        var week = new Date().getDay();
        var tabs = ["一", "二", "三", "四", "五", "六", "日"];
        for (var i in tabs) {
            d.push({
                title: getMyVar("weekbook", m[week]) == i ? `““””<b><span style="color: #3399cc">` + tabs[i] + `</span></b>` : tabs[i],
                url: $("hiker://empty").lazyRule((i) => {
                    putMyVar("weekbook", i)
                    refreshPage(false)
                    return "hiker://empty"
                }, i),
                col_type: "scroll_button"
            })
        }

        Julist.forEach(it => {
            try {
                let params = JSON.parse(it.params);
                let stype = JSON.parse(params.params).stype;

                let group = it.group;
                var tabl=tabs[getMyVar("weekbook", m[week])];
                if (group.includes(tabl)) {
                    let name = it.mTitle.indexOf(JSON.parse(params.params).name) > -1 ? JSON.parse(params.params).name : it.mTitle;
                    let sname = JSON.parse(params.params).sname;
                    let surl = JSON.parse(params.params).surl;
                    let extraData = it.extraData ? JSON.parse(it.extraData) : {};
                    let last = extraData.lastChapterStatus ? extraData.lastChapterStatus : "";
                    let mask = it.lastClick ? it.lastClick.split('@@')[0] : "";
                    let col = Juconfig["bookCase_col_type"] || 'movie_1_vertical_pic';
                    d.push({
                        title: col == 'movie_1_vertical_pic' ? name + "\n\n‘‘’’<small>💠 " + stype + " | " + (sname || "") + "</small>" : name,
                        pic_url: it.picUrl,
                        desc: col == 'movie_1_vertical_pic' ? "🕓 " + mask + "\n\n🔘 " + last : last,
                        url: $("hiker://empty#immersiveTheme##autoCache#").rule(() => {
                            require(config.依赖);
                            erji();
                            putMyVar('SrcBookCase', '1');
                        }),
                        col_type: col,
                        extra: {
                            pageTitle: name,
                            name: name,
                            img: it.picUrl,
                            sname: sname,
                            surl: surl,
                            stype: stype,
                            sourcedata: JSON.parse(params.params).sourcedata,
                            lineVisible: false,
                            cls: "caselist"
                        }
                    })
                }
            } catch (e) {
                log("√书架加载异常>" + e.message);
            }
        })

    }

    d.push({
        title: Julist.length == 0 ? "书架空空如也~~♥收藏即加入书架" : "",
        url: "hiker://empty",
        col_type: "text_center_1",
        extra: {
            lineVisible: false,
            id: "caseloading"
        }
    })
    setResult(d);
}
