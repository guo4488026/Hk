//本代码仅用于个人学习，请勿用于其他作用，下载后请24小时内删除，代码虽然是公开学习的，但请尊重作者，应留下说明
//聚集型、接口型、平台型空壳小程序，接口分为主页源和搜索源
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

//一级
function yiji() {
    let sourcedata = yidatalist.filter(it => {
        return it.name == sourcename && it.type == runMode;
    });
    let parse;
    let 页码;
    let 提示;
    try {
        if (sourcedata.length > 0) {
            eval("let source = " + sourcedata[0].parse);
            if (source.ext && /^http/.test(source.ext)) {
                requireCache(source.ext, 48);
                parse = yidata;
            } else {
                parse = source;
            }
            storage0.putMyVar('一级源接口信息', {
                name: sourcename,
                type: runMode,
                group: sourcedata[0].group
            }); //传导给方法文件
            try {
                require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuMethod.js');
                cacheData(sourcedata[0]);
            } catch (e) {
                //log("√缓存临时文件失败>"+e.message);
            }
            页码 = parse["页码"];
            提示 = "当前主页源：" + sourcename + (parse["作者"] ? "，作者：" + parse["作者"] : "");
            if (!getMyVar(runMode + "_" + sourcename)) {
                toast(提示);
            }
        }
    } catch (e) {
        log("√一级源接口加载异常>" + e.message);
    }

    页码 = 页码 || {};
    let d = [];
    if (MY_PAGE == 1) {
        clearItem('searchmode'); //临时先去掉视界聚合代理搜索

        let adminbtn = Object.assign([], runModes);
        adminbtn.unshift("快速切换");
        adminbtn.unshift("接口管理");
        d.push({
            title: "设置",
            url: $("hiker://empty#noRecordHistory##noHistory#").rule(() => {
                        require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuSet.js');
                        SRCSet();
                    }),
            pic_url: "https://hikerfans.com/tubiao/more/129.png",
            col_type: 'icon_5',
            extra: {
                newWindow: true,
                windowId: MY_RULE.title + "管理",
            }

        })
        if (parse && parse["排行"]) {
            d.push({
                title: "排行",
                url: rulePage('排行', 页码["排行"]),
                pic_url: "https://hikerfans.com/tubiao/more/229.png",
                col_type: 'icon_5'
            })
        } else {
            d.push({
                title: "收藏",
                url: "hiker://collection?rule=" + MY_RULE.title,
                pic_url: "https://hikerfans.com/tubiao/more/109.png",
                col_type: 'icon_5'
            })
        }
        let sousuopage = $("hiker://empty#noRecordHistory##noHistory##fullTheme###fypage").rule(() => {
            addListener("onClose", $.toString(() => {
                initConfig({
                    依赖: getMyVar('SrcJuCfg')
                });
                clearMyVar('SrcJuCfg');
                clearMyVar('sousuoname');
                clearMyVar('sousuoPageType');
            }));
            addListener('onRefresh', $.toString(() => {
                initConfig({
                    依赖: getMyVar('SrcJuCfg')
                });
                clearMyVar('sousuoname');
            }));
            if (!getMyVar('SrcJuCfg')) {
                putMyVar('SrcJuCfg', config.依赖);
            }
            require(getMyVar('SrcJuCfg'));
            newsousuopage();
        })
        let sousuoextra = {
            longClick: [{
                title: "🔍搜索",
                js: $.toString((sousuopage) => {
                    return sousuopage;
                }, sousuopage)
            }]

        }
        if (parse && parse["分类"]) {
            d.push({
                title: "分类",
                url: rulePage('分类', 页码["分类"]),
                pic_url: "https://hikerfans.com/tubiao/more/287.png",
                col_type: 'icon_5',
                extra: sousuoextra
            })
        } else {
            d.push({
                title: "历史",
                url: "hiker://history?rule=" + MY_RULE.title,
                pic_url: "https://hikerfans.com/tubiao/more/213.png",
                col_type: 'icon_5'
            })
        }
        d.push({
            title: "搜索",
            url: sousuopage,
            pic_url: "https://hikerfans.com/tubiao/more/101.png",
            col_type: 'icon_5',
            extra: sousuoextra
        })

        d.push({
            title: Juconfig["btnmenu5"] || "订阅",
            url: Juconfig["btnmenu5"] == "历史" ? "hiker://history?rule=" + MY_RULE.title : Juconfig["btnmenu5"] == "收藏" ? "hiker://collection?rule=" + MY_RULE.title : $("hiker://empty###noRecordHistory##noHistory#").rule(() => {
                require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcBookCase.js');
                bookCase();
            }),
            pic_url: "https://hikerfans.com/tubiao/more/286.png",
            col_type: 'icon_5',
            extra: {
                longClick: [{
                    title: "切换按钮",
                    js: $.toString(() => {
                        require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js');
                        return $(["订阅", "收藏", "历史"], 1).select((cfgfile, Juconfig) => {
                            Juconfig["btnmenu5"] = input;
                            writeFile(cfgfile, JSON.stringify(Juconfig));
                            refreshPage(false);
                            return 'toast://已切换为' + input;
                        }, cfgfile, Juconfig)
                    })
                }]
            }
        })


        runModes.forEach((it) => {
            d.push({
                title: Juconfig["runMode"] == it ? `““””<b><span style="color: #3399cc">` + it + `</span></b>` : it,
                url: Juconfig["runMode"] == it ? $('#noLoading#').lazyRule((input) => {
                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuPublic.js');
                    return selectsource(input);
                }, it) : $('#noLoading#').lazyRule((cfgfile, Juconfig, input) => {
                    Juconfig["runMode"] = input;
                    writeFile(cfgfile, JSON.stringify(Juconfig));
                    refreshPage(false);
                    return 'toast://运行模式已切换为：' + input;
                }, cfgfile, Juconfig, it),
                col_type: 'text_' + runModes.length
            });
        })

        for (let i = 0; i < 8; i++) {
            d.push({
                col_type: "blank_block"
            })
        }


        d.push({
            col_type: 'blank_block'
        })
        putMyVar(runMode + "_" + sourcename, "1");
    }
    try {
        getYiData('主页', d);
    } catch (e) {
        toast("当前主页源有报错，可更换主页源或联系接口作者");
        log("√" + 提示);
        log("√当前主页源报错信息>" + e.message);
        setResult(d);
    }
}

//二级+源搜索
function erji() {
    addListener("onClose", $.toString(() => {
        clearMyVar('erjidetails');
        clearMyVar('erjiextra');
        clearMyVar('SrcJudescload');
        clearMyVar('已选择换源列表');
        clearMyVar('二级源接口信息');
        clearMyVar("sousuoname");
        clearMyVar("sousuoPageType");
        clearMyVar("listloading");
        if (getMyVar('SrcBookCase')) {
            clearMyVar('SrcBookCase');
            refreshPage(false);
        }
    }));
    clearMyVar('SrcJudescload');
    let isload; //是否正确加载
    let sauthor;
    let detailsfile = "hiker://files/_cache/SrcJu_details.json";
    let erjidetails = storage0.getMyVar('erjidetails') || {}; //二级海报等详情临时保存
    erjidetails.name = erjidetails.name || MY_PARAMS.name;
    let name = erjidetails.name.replace(/‘|’|“|”|<[^>]+>|全集|国语|粤语/g, "").trim();
    let myerjiextra = storage0.getMyVar('erjiextra') || {}; //二级换源时临时extra数据
    let d = [];
    let parse;
    let 公共;
    let 标识;
    let details;
    let stype = myerjiextra.stype || MY_PARAMS.stype;
    let datasource = [myerjiextra, MY_PARAMS, getMark(name, stype)];
    let erjiextra;
    let sname;
    let surl;
    let sgroup;
    let lineid;
    let pageid;
    let detailload;
    let oldMY_PARAMS = MY_PARAMS;
    let pic;
    for (let i = 0; i < datasource.length; i++) {
        if (datasource[i]) {
            sname = datasource[i].sname || "";
            surl = datasource[i].surl || "";
            if (sname && surl) {
                erjiextra = datasource[i];
                storage0.putMyVar('二级源接口信息', {
                    name: sname,
                    type: stype
                });
                break;
            }
        }
    }
    let sourcedata = erdatalist.filter(it => {
        return it.name == sname && it.type == stype;
    });
    let sourcedata2; //用于正常加载时，将二级接口存入当前页面PARAMS，确保分享时可以打开
    try {
        if (sourcedata.length == 0 && MY_PARAMS && MY_PARAMS.sourcedata) {
            //log('√分享页面，且本地无对应接口');
            sourcedata.push(MY_PARAMS.sourcedata);
        }
        if (sourcedata.length > 0 && sourcedata[0].erparse) {
            eval("let source = " + sourcedata[0].erparse);
            if (source.ext && /^http/.test(source.ext)) {
                requireCache(source.ext, 48);
                parse = erdata;
            } else {
                parse = source;
            }
            sourcedata2 = sourcedata[0];
            sgroup = sourcedata2.group;
            try {
                require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuMethod.js');
                cacheData(sourcedata[0]);
            } catch (e) {
                //log("√缓存临时文件失败>"+e.message);
            }
        }
    } catch (e) {
        log("√加载二级源接口>" + e.message);
    }
    try {
        if (parse && surl) {
            eval("let gonggong = " + sourcedata[0].public);
            if (gonggong && gonggong.ext && /^http/.test(gonggong.ext)) {
                requireCache(gonggong.ext, 48);
                gonggong = ggdata;
            }
            公共 = gonggong || parse['公共'] || {};

            标识 = stype + "_" + sname;
            MY_URL = surl;
            sauthor = parse["作者"];
            let detailsmark;
            if (getMyVar('是否取缓存文件') && getMyVar('一级源接口信息') && !getMyVar("调试模式")) {
                let detailsdata = fetch(detailsfile);
                if (detailsdata != "") {
                    try {
                        eval("let detailsjson=" + detailsdata + ";");
                        if (detailsjson.sname == sname && detailsjson.surl == surl) {
                            detailsmark = detailsjson; //本地缓存接口+链接对得上则取本地，用于切换排序和样式时加快
                        }

                    } catch (e) {}
                }
            }
            //方便换源时二级代码中使用MY_PARAMS
            MY_PARAMS = erjiextra;
            eval("let 二获获取 = " + parse['二级'])
            details = detailsmark || 二获获取(surl);
            pic = details.img || oldMY_PARAMS.img; // || "https://p1.ssl.qhimgs1.com/sdr/400__/t018d6e64991221597b.jpg";
            pic = pic && pic.indexOf("@Referer=") == -1 ? pic + "@Referer=" : pic;
            erjiextra.img = pic;
            erjidetails.img = erjiextra.img || erjidetails.img;
            erjidetails.detail1 = details.detail1 || erjidetails.detail1;
            erjidetails.detail2 = details.detail2 || erjidetails.detail2;
            erjidetails.desc = details.desc || erjidetails.desc;
            let detailextra = details.detailextra || {};
            detailextra.id = "detailid";
            detailextra.cls = 'detailid';
            detailextra.gradient = detailextra.gradient || true;

            d.push({
                desc:getItem("float","240")+ '&&float',
                col_type: "x5_webview_single",
                extra: {
                    ua: MOBILE_UA,
                }
            })
            d.push({
                title: erjidetails.detail1 || "",
                desc: erjidetails.detail2 || "",
                pic_url: erjidetails.img,
                url: details.detailurl ? details.detailurl : surl,
                col_type: 'movie_1_vertical_pic_blur',
                extra: detailextra
            })
            detailload = 1;
            lineid = parseInt(getMyVar("SrcJu_" + surl + "_line", (datasource[2].lineid || 0).toString()));
            let 线路s = details.line ? details.line : ["线路"];
            let 列表s = details.line ? details.list : [details.list];
            pageid = parseInt(getMyVar("SrcJu_" + surl + "_page", (datasource[2].pageid || 0).toString()));
            try {
                if ((detailsmark && pageid != details.pageid) || (!detailsmark && pageid > 0)) {
                    let 分页s = details.page;
                    if (pageid > 分页s.length) {
                        pageid = 0;
                    }
                    let 分页选集 = details.pageparse(分页s[pageid].url);
                    if ($.type(分页选集) == "array") {
                        列表s[lineid] = 分页选集;
                        details.list = details.line ? 列表s : 分页选集;
                    }
                }
            } catch (e) {
                log('√' + sname + '分页选集处理失败>' + e.message);
            }
            try {
                if (线路s.length != 列表s.length) {
                    log('√' + sname + '>源接口返回的线路数' + 线路s.length + '和列表数' + 列表s.length + '不相等');
                }
            } catch (e) {
                log('√' + sname + ">线路或列表返回数据有误>" + e.message);
                线路s = ["线路"];
                列表s = [
                    []
                ];
            }
            if (lineid > 0 && details.listparse) {
                let 线路选集 = details.listparse(lineid, 线路s[lineid]) || [];
                if (线路选集.length > 0) {
                    列表s[lineid] = 线路选集;
                }
            }
            if (lineid > 列表s.length - 1) {
                toast('选择的列表不存在，将显示第1线路选集');
                lineid = 0;
            }
            let 列表 = 列表s[lineid] || [];
            if (列表.length > 0) {
                try {
                    let i1 = parseInt(列表.length / 5);
                    let i2 = parseInt(列表.length / 3);
                    let list1 = 列表[i1].title;
                    let list2 = 列表[i2].title;
                    if (parseInt(list1.match(/(\d+)/)[0]) > parseInt(list2.match(/(\d+)/)[0])) {
                        列表.reverse();
                    }
                } catch (e) {
                    //log('√修正选集顺序失败>'+e.message)
                }
            }
            if (getMyVar(sname + 'sort') == '1') {
                列表.reverse();
            }

            let lazy;
            let itype;
            let 解析 = parse['解析'];

            lazy = $("").lazyRule((解析, 参数) => {
                eval(JSON.parse(fetch("hiker://page/lazy")).rule)
                return Lazy(input)
            }, 解析, {
                "规则名": MY_RULE.title,
                "标识": 标识
            });



            d.push({
                title: "搜索",
                url: $(runModes, 2).select((name, sgroup) => {

                    return $("#noLoading#").lazyRule((name, sgroup, stype) => {
                        updateItem("listloading2", {
                            extra: {
                                id: "listloading",
                                lineVisible: false
                            }
                        });
                        putMyVar("listloading", "1"); //做为排序和样式动态处理插入列表时查找id判断
                        if (getMyVar('SrcJuSousuoTest')) {
                            return "toast://编辑测试模式下不允许换源.";
                        } else if (!getMyVar('SrcJuSearching')) {
                            clearMyVar('已选择换源列表');
                            require(config.依赖);
                            deleteItemByCls('playlist');
                            showLoading('搜源中,请稍后.');
                            search(name, "erji", false, sgroup, stype);
                            hideLoading();
                            return "hiker://empty";
                        } else if (getMyVar('SrcJuSearchMode') == "sousuo") {
                            return "toast://上一个搜索线程还未结束，稍等...";
                        } else {
                            clearMyVar('已选择换源列表');
                            require(config.依赖);
                            deleteItemByCls('playlist');

                            showLoading('搜源中,请稍后.');
                            search(name, "erji", false, sgroup, stype);
                            hideLoading();
                            return "hiker://empty";
                        }
                    }, name, sgroup, input)
                }, MY_PARAMS.name, sgroup),
                img: getItem("img_1", "https://hikerfans.com/tubiao/more/103.png"),
                col_type: "icon_4",
                extra: {
                    longClick: [{
                        title: "更换图标",
                        js: $.toString(() => {
                            return $("").input(() => {
                                if (input) {
                                    setItem("img_1", input);
                                    refreshPage(false);
                                    return "hiker://empty"
                                }
                            })
                        })
                    }]
                }
            })

            d.push({
                title: "云盘君",
                url: "hiker://page/sou#noHistory#?rule=云盘君.简&p=fypage",
                img: getItem("img_2", "https://p2.itc.cn/q_70/images03/20211009/59c75745d3524163b9277c4006020ac0.jpeg"),
                col_type: "icon_4",
                extra: {
                    pageTitle: "搜索" + name,
                    searchTerms: name,
                    longClick: [{
                        title: "更换图标",
                        js: $.toString(() => {
                            return $("").input(() => {
                                if (input) {
                                    setItem("img_2", input);
                                    refreshPage(false);
                                    return "hiker://empty"
                                }
                            })
                        })
                    }]

                }
            })

            d.push({
                title: "动漫花园",
                url: "hiker://page/搜索结果#noRecordHistory##noHistory#?rule=动漫花园同步站&page=fypage&keyword=" + name,
                img: getItem("img_3", "http://pp.myapp.com/ma_icon/0/icon_42375936_1689215707/256"),
                col_type: "icon_4",
                extra: {
                    longClick: [{
                        title: "更换图标",
                        js: $.toString(() => {
                            return $("").input(() => {
                                if (input) {
                                    setItem("img_3", input);
                                    refreshPage(false);
                                    return "hiker://empty"
                                }
                            })
                        })
                    }]
                }
            })

            d.push({
                title: "聚影",
                url: "hiker://search?rule=聚影√&s=" + name,
                img: getItem("img_4", "https://hikerfans.com/tubiao/movie/61.svg"),
                col_type: "icon_4",
                extra: {
                    longClick: [{
                        title: "更换图标",
                        js: $.toString(() => {
                            return $("").input(() => {
                                if (input) {
                                    setItem("img_4", input);
                                    refreshPage(false);
                                    return "hiker://empty"
                                }
                            })
                        })
                    }]
                }
            })
            d.push({
                title: "详情简介",
                url: $("#noLoading#").lazyRule((desc) => {
                    if (getMyVar('SrcJudescload') == "1") {
                        clearMyVar('SrcJudescload');
                        deleteItemByCls("SrcJudescload");
                    } else {
                        putMyVar('SrcJudescload', "1");
                        addItemAfter('detailid', [{
                            title: `<font color="#098AC1">详情简介 </font><small><font color="#f47983"> ></font></small>`,
                            col_type: "avatar",
                            url: "hiker://empty",
                            pic_url: "https://hikerfans.com/tubiao/ke/91.png",
                            extra: {
                                cls: "SrcJudescload"
                            }
                        }, {
                            title: desc,
                            col_type: "rich_text",
                            extra: {
                                cls: "SrcJudescload"
                            }
                        }]);
                    }
                    return "hiker://empty";
                }, erjidetails.desc || ""),
                pic_url: "https://hikerfans.com/tubiao/messy/32.svg",
                col_type: 'icon_small_3',
                extra: {
                    cls: "tabs playlist",

                }
            })
            d.push({
                title: "观影设置",
                url: $("hiker://empty###noRecordHistory##noHistory#").rule(() => {
                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJyMenu.js');
                    lookset()
                }),
                pic_url: 'https://hikerfans.com/tubiao/messy/37.svg',
                col_type: 'icon_small_3',
                extra: {
                    cls: "tabs playlist",
                    newWindow: true,
                    windowId: MY_RULE.title + "观影",
                }
            })

            d.push({
                title: "切换站源",
                url: $("#noLoading#").lazyRule((name, sgroup, stype) => {
                    updateItem("listloading2", {
                        extra: {
                            id: "listloading",
                            lineVisible: false
                        }
                    });
                    putMyVar("listloading", "1"); //做为排序和样式动态处理插入列表时查找id判断
                    if (getMyVar('SrcJuSousuoTest')) {
                        return "toast://编辑测试模式下不允许换源.";
                    } else if (!getMyVar('SrcJuSearching')) {
                        clearMyVar('已选择换源列表');
                        require(config.依赖);
                        deleteItemByCls('playlist');
                        showLoading('搜源中,请稍后.');
                        search(name, "erji", false, sgroup, stype);
                        hideLoading();
                        return "hiker://empty";
                    } else if (getMyVar('SrcJuSearchMode') == "sousuo") {
                        return "toast://上一个搜索线程还未结束，稍等...";
                    } else {
                        clearMyVar('已选择换源列表');
                        require(config.依赖);
                        deleteItemByCls('playlist');

                        showLoading('搜源中,请稍后.');
                        search(name, "erji", false, sgroup, stype);
                        hideLoading();
                        return "hiker://empty";
                    }
                }, name, sgroup, stype),
                pic_url: 'https://hikerfans.com/tubiao/messy/20.svg',
                col_type: 'icon_small_3',
                extra: {
                    cls: "tabs playlist",
                    longClick: [{
                        title: "精准匹配：" + (getItem('searchMatch', '1') == "1" ? "是" : "否"),
                        js: $.toString(() => {
                            let sm;
                            if (getItem('searchMatch', '1') == "1") {
                                setItem('searchMatch', '2');
                                sm = "取消换源搜索精准匹配名称";
                            } else {
                                clearItem('searchMatch');
                                sm = "换源搜索精准匹配名称";
                            }
                            refreshPage(false);
                            return "toast://" + sm;
                        })
                    }]
                }
            })
            d.push({
                col_type: "line_blank"
            });
            for (let i = 0; i < 10; i++) {
                d.push({
                    col_type: "blank_block"
                })
            }
            d.push({
                title: getMyVar(sname + 'sort') == '1' ? `““””<b><span style="color: #66CCEE">∨</span></b>` : `““””<b><span style="color: #55AA44">∧</span></b>`,
                url: $("#noLoading#").lazyRule((sname) => {
                    let 列表 = findItemsByCls('loadlist') || [];
                    if (列表.length == 0) {
                        return 'toast://未获取到列表'
                    }
                    deleteItemByCls('loadlist');
                    if (getMyVar(sname + 'sort') == '1') {
                        putMyVar(sname + 'sort', '0');
                        updateItem('listsort', {
                            title: `““””<b><span style="color: #55AA44">∧</span></b>`
                        });
                    } else {
                        putMyVar(sname + 'sort', '1')
                        updateItem('listsort', {
                            title: `““””<b><span style="color: #66CCEE">∨</span></b>`
                        });
                    };
                    列表.reverse();

                    列表.forEach(item => {
                        item.col_type = item.type

                    })
                    addItemBefore(getMyVar("listloading", "1") == "1" ? "listloading" : "listloading2", 列表);
                    return 'toast://切换排序成功'
                }, sname),
                col_type: 'scroll_button',
                extra: {
                    id: "listsort",
                    cls: "tabs playlist",

                }
            })

            var Marksum = 30;
            var Color1 = getItem('SrcJy$linecolor1', '#09c11b') || '#09c11b';
            var Color2 = getItem('SrcJy$linecolor2', '');
            var Color3 = getItem('SrcJy$playcolor', '');

            function getHead(title, Color, strong) {
                if (Color) {
                    if (strong) {
                        return '‘‘’’<strong><font color="' + Color + '">' + title + '</front></strong>';
                    } else {
                        return '‘‘’’<font color="' + Color + '">' + title + '</front>';
                    }
                } else {
                    return title;
                }
            }
            let list_col_type = getItem('SrcJuList_col_type' + sname, 'text_2');


            for (var i in 线路s) {
                if (线路s[i] == "undefined") {
                    线路s[i] = "线路" + (parseInt(i) + 1)
                }
                d.push({
                    title: getMyVar("SrcJu_" + surl + "_line", '0') == i ? `““””<b><span style="color: #AABBFF">` + 线路s[i] + `<small>⚡</small></span></b>` : 线路s[i],
                    url: $("#noLoading#").lazyRule((surl, index, sname) => {
                        if (getMyVar("SrcJu_" + surl + "_line", '0') != index) {
                            putMyVar("SrcJu_" + surl + "_line", index);
                            refreshPage(false)

                        } else {
                            return $(["text_1", "text_2", "text_3", "text_4", "flex_button", "movie_2", "pic_2"], 2, "选集列表样式").select((sname) => {
                                setItem("SrcJuList_col_type" + sname, input)
                                refreshPage()
                                return "hiker://empty"
                            }, sname)
                        }
                        return 'hiker://empty'
                    }, surl, i, sname),
                    col_type: 'scroll_button',
                    extra: {
                        cls: "tabs playlist",
                        id: surl + "_线路_" + i
                    }
                })
            }


            if (Juconfig['yundiskLine'] == 1) {
                d.push({
                    title: getMyVar(surl, '0') == "98" ? getHead('云盘搜索', Color1, 1) : getHead('云盘搜索', Color2),
                    url: $("#noLoading#").lazyRule((surl, Marksum) => {
                        let i = 98;

                        if (parseInt(getMyVar(surl, '0')) != i) {
                            if (getMyVar('diskSearch') == "1") {
                                return 'toast://搜索线程中，稍等片刻.'
                            }
                            try {
                                eval('var SrcMark = ' + fetch("hiker://files/cache/SrcMark.json"));
                            } catch (e) {
                                var SrcMark = "";
                            }
                            if (SrcMark == "") {
                                SrcMark = {
                                    route: {}
                                };
                            } else if (SrcMark.route == undefined) {
                                SrcMark.route = {};
                            }
                            SrcMark.route[surl] = i;
                            var key = 0;
                            var one = "";
                            for (var k in SrcMark.route) {
                                key++;
                                if (key == 1) {
                                    one = k
                                }
                            }
                            if (key > Marksum) {
                                delete SrcMark.route[one];
                            }
                            writeFile("hiker://files/cache/SrcMark.json", JSON.stringify(SrcMark));
                            putMyVar(surl, i);
                            refreshPage(false);

                            return '#noHistory#hiker://empty'
                        } else {
                            putMyVar(surl, "0")
                            refreshPage()
                            return "hiker://empty"
                        }
                    }, surl, Marksum),
                    col_type: 'scroll_button',
                    extra: {
                        cls: "tabs playlist",
                    }
                });

            }
            if (getItem('enabledpush', '') == '1') {
                let push = {
                    "name": MY_PARAMS.name,
                    "pic": pic.split('@')[0],
                    "content": details.desc || "",
                    "director": details.detail1 || "",
                    "actor": details.detail2 || "",
                    "from": 线路s.join("$$$")
                };
                let tvip = getItem('hikertvboxset', '');
                d.push({
                    title: '推送TVBOX',
                    url: $("#noLoading#").lazyRule((push, lists, tvip) => {
                        if (tvip == "") {
                            return 'toast://观影设置中设置TVBOX接收端ip地址，完成后回来刷新一下';
                        }

                        var url = ""
                        if (lists) {
                            lists.forEach((ite, i) => {
                                if (getMyVar('shsort') == '1') {
                                    ite = ite.reverse();
                                }
                                ite.forEach(item => {
                                    var a = item.title + "$" + item.url.replace("#isVideo=true#", "")
                                    url += a + "#"
                                })

                                if (i + 1 != lists.length) {
                                    url += "$$$"
                                }
                            })

                        }

                        if (lists.length > 0) {
                            push['url'] = url;
                            log(push)
                            var state = request(tvip + '/action', {
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    //'X-Requested-With': 'XMLHttpRequest',
                                    'Referer': tvip
                                },
                                timeout: 2000,
                                body: 'do=push&url=' + JSON.stringify(push),
                                method: 'POST'
                            });
                            //log(push);
                            //log(state);
                            if (state == 'ok') {
                                return 'toast://推送成功，如果tvbox显示“没找到数据”可能是该链接需要密码或者当前的jar不支持。';
                            } else {
                                return 'toast://推送失败'
                            }
                        }
                        return 'toast://所有线路均不支持推送列表';
                    }, push, 列表s, tvip),
                    col_type: 'scroll_button',
                    extra: {
                        cls: "tabs playlist"
                    }
                })
            }
            if (details.page && details.pageparse) {
                let 分页s = details.page
                let 分页链接 = [];
                let 分页名 = [];
                分页s.forEach((it, i) => {
                    分页链接.push($("#noLoading#").lazyRule((pageurl, nowid, newid) => {
                        if (nowid != newid) {
                            putMyVar(pageurl, newid);
                            refreshPage(false);
                        }
                        return 'hiker://empty'
                    }, "SrcJu_" + surl + "_page", pageid, i))
                    分页名.push(pageid == i ? '““””<span style="color: #87CEFA">' + it.title : it.title)
                })
                if (分页名.length > 0) {
                    d.push({
                        col_type: "blank_block"
                    });
                    d.push({
                        title: pageid == 0 ? "↪️首页" : "⏮️上页",
                        url: pageid == 0 ? "hiker://empty" : 分页链接[pageid - 1],
                        col_type: 'text_4',
                        extra: {
                            cls: "loadlist"
                        }
                    })
                    d.push({
                        title: 分页名[pageid],
                        url: $(分页名, 2).select((分页名, 分页链接) => {
                            return 分页链接[分页名.indexOf(input)];
                        }, 分页名, 分页链接),
                        col_type: 'text_2',
                        extra: {
                            cls: "loadlist"
                        }
                    })
                    d.push({
                        title: pageid == 分页名.length - 1 ? "尾页↩️" : "下页⏭️",
                        url: pageid == 分页名.length - 1 ? "hiker://empty" : 分页链接[pageid + 1],
                        col_type: 'text_4',
                        extra: {
                            cls: "loadlist"
                        }
                    })
                }

            }

            function PlayList(i) {
                var urls = [];
                var tabs = []
                for (var j in 列表s) {
                    if (列表s[j][i]) {
                        urls.push("video://" + 列表s[j][i].url)
                        tabs.push(线路s[j])
                    }
                }
                return {
                    urls: urls,
                    names: tabs
                }
            }

            function GetDm(name, title, i) {

                var danmu = $.require("hiker://page/danmu?rule=Mikan Project");
                let dmList = danmu.getDanMu(encodeURIComponent(name));

                var anime = dmList.animes;
                if (anime.length > 0) {
                    var episode = anime[0].episodes
                    if (episode.length - 1 >= i) {
                        var episodeId = episode[i].episodeId;
                        var episodeTitle = episode[i].episodeTitle;

                        try {
                            let path = danmu.getLocalDanMu(episodeId, name + "_" + title) || danmu.downloadDanMu(episodeId, name + "_" + title);

                            if (path == undefined) {
                                toast("暂无弹幕")
                                return getMyVar("path", "")

                            } else {
                                toast("弹幕加载成功")
                                putMyVar("path", path)
                                return path
                            }
                        } catch (e) {
                            toast("弹幕加载失败")
                            return getMyVar("path", "")
                        }
                    }
                }
                toast("暂无弹幕")
                return getMyVar("path", "")

            }
            for (let i = 0; i < 列表.length; i++) {
                let extra = 列表[i].extra || {};
                try {
                    extra = Object.assign(extra, details["extra"] || {});
                } catch (e) {}
                extra.id = 列表[i].url;
                extra.url = 列表[i].url;
                extra.cls = "loadlist playlist";
                if (stype != "正版") {
                    extra.linkid = i;
                    extra.name = name
                }
                extra.jsLoadingInject = true;
                let blockRules = ['.m4a', '.mp3', '.gif', '.jpeg', '.jpg', '.ico', '.png', 'hm.baidu.com', '/ads/*.js', 'cnzz.com', '51.la'];
                if (extra.blockRules && $.type(extra.blockRules) == "array") {
                    try {
                        blockRules = Object.assign(blockRules, extra.blockRules);
                    } catch (e) {}
                }
                extra.blockRules = blockRules;

                if (list_col_type.indexOf("_left") > -1) {
                    extra.textAlign = 'left';
                }
                d.push({
                    title: 列表[i].title.trim().replace(/ |-|_/g, '').replace(name, ''),
                    url: "hiker://empty##" + 列表[i].url + lazy,
                    desc: 列表[i].desc,
                    img: 列表[i].img,
                    col_type: 列表[i].col_type || list_col_type.replace("_left", ""),
                    extra: extra
                });
            }

            if (列表.length > 0 || getMyVar('jiekouedit')) {
                isload = 1;
            } else if (列表.length == 0) {
                toast("选集列表为空，请更换其他源");
            }
        }
    } catch (e) {
        toast('有异常，看日志');
        log('√' + sname + '>加载详情失败>' + e.message);
    }

    if (isload) {
        if (getMyVar('已选择换源列表')) {
            putMyVar("listloading", "2");
        }
        if (getMyVar('sousuoPageType')) {
            var loadid = "sousuoloading" + getMyVar('sousuoPageType', '')
        } else {
            loadid = getMyVar('已选择换源列表') ? "listloading2" : "listloading"
        }
        d.push({
            title: "‘‘’’<small><font color=#f20c00>当前数据源：" + sname + (sauthor ? ", 作者：" + sauthor : "") + "</font></small>",
            url: 'hiker://empty',
            col_type: 'text_center_1',
            extra: {
                id: loadid,
                lineVisible: false
            }
        });
        let r = getItem("r", "");
        setResult(d);
        if (getMyVar(surl) == "98") {
            let diskMark = storage0.getMyVar('diskMark') || {};
            if (diskMark[MY_PARAMS.name]) {
                deleteItemByCls("loadlist")


                // deleteItemByCls('listsort');
                addItemBefore('listloading', diskMark[MY_PARAMS.name]);
            } else {
                require(config.依赖.match(/http(s)?:\/\/.*\//)[0].replace("/Ju/", "/master/") + 'SrcJyAliDisk.js');
                aliDiskSearch(MY_PARAMS.name);
            }
        }

        if (getMyVar("sousuoname")) {


            deleteItemByCls("playlist")

            if (runModes.includes(getMyVar('sousuoPageType'))) {
                let info = storage0.getMyVar('一级源接口信息') || {};

                let type = getMyVar("sousuoPageType", info.type);

                search(getMyVar("sousuoname"), "sousuopage", false, info.group, type);
            }
        }
        if (!getMyVar(sname + "_" + name)) {
            toast('当前数据源：' + sname + (sauthor ? ", 作者：" + sauthor : ""));
        }
        putMyVar(sname + "_" + name, "1");
        //更换收藏封面
        if (erjiextra.img && oldMY_PARAMS.img != erjiextra.img) {
            setPagePicUrl(erjiextra.img);
        }
        //二级详情简介临时信息
        storage0.putMyVar('erjidetails', erjidetails);
        //二级源浏览记录保存
        let erjidata = {
            name: name,
            sname: sname,
            surl: surl,
            stype: stype,
            lineid: lineid,
            pageid: pageid
        };
        setMark(erjidata);
        //当前二级详情数据保存
        if (!getMyVar("调试模式")) {
            details.sname = sname;
            details.surl = surl;
            details.pageid = pageid;
            writeFile(detailsfile, $.stringify(details));
        }
        //收藏更新最新章节
        if (parse['最新']) {
            setLastChapterRule('js:' + $.toString((sname, surl, 最新, 公共) => {
                let 最新str = 最新.toString().replace('setResult', 'return');
                eval("let 最新2 = " + 最新str);
                try {
                    let zx = 最新2(surl, 公共) || "";
                    setResult(sname + " | " + (zx || ""));
                } catch (e) {
                    最新2(surl, 公共);
                }
            }, sname, surl, parse['最新'], 公共))
        }
        //切换源时更新收藏数据，以及分享时附带接口
        if (typeof(setPageParams) != "undefined") {
            if ((surl && oldMY_PARAMS.surl != surl) || !oldMY_PARAMS.sourcedata) {
                delete sourcedata2['parse']
                erjiextra.name = erjiextra.name || name;
                erjiextra.sourcedata = sourcedata2;
                setPageParams(erjiextra);
            }
        }
        putMyVar('是否取缓存文件', '1'); //判断是否取本地缓存文件,软件打开初次在线取
    } else {
        if (!detailload) {
            pic = MY_PARAMS.img || "";
            pic = pic && pic.indexOf("@Referer=") == -1 ? pic + "@Referer=" : pic;
            d.push({
                title: "\n搜索接口源结果如下",
                desc: "\n\n选择一个源观看吧👇",
                pic_url: pic,
                url: pic,
                col_type: 'movie_1_vertical_pic_blur',
                extra: {
                    gradient: true
                }
            });
        }
        d.push({
            title: "",
            url: 'hiker://empty',
            col_type: 'text_center_1',
            extra: {
                id: "listloading",
                lineVisible: false
            }
        });
        setResult(d);
        if (!getMyVar('SrcJuSousuoTest') && !getMyVar("调试模式")) {
            showLoading('搜源中,请稍后.');
            search(name, "erji", false, sgroup, stype);
        }
    }
    clearMyVar('已选择换源列表');
}
//搜索页面
function sousuo() {
    let name = MY_URL.split('##')[1];
    if (getItem('searchmode') != "jusousuo") {
        let d = [];
        d.push({
            title: "搜索中...",
            url: "hiker://empty",
            extra: {
                id: "sousuoloading"
            }
        });
        setResult(d);
        let info = storage0.getMyVar('一级源接口信息') || {};
        search(name, 'sousuo', false, info.group);
    } else {
        setResult([{
            title: "视界聚搜",
            url: "hiker://search?s=" + name,
            extra: {
                rules: $.toString((name) => {
                    let info = storage0.getMyVar('一级源接口信息') || {};
                    require(config.依赖);
                    let ssdatalist = erdatalist.filter(it => {
                        if (info.group == "全全" || !group) {
                            return it.type == info.type;
                        } else {
                            return it.type == info.type && (it.group == info.group || it.group == "全全");
                        }
                    });
                    let data = [];
                    ssdatalist.forEach(it => {
                        data.push({
                            "title": it.name,
                            "search_url": "hiker://empty##fypage",
                            "searchFind": `js: require(config.依赖); let d = search('` + name + `  ` + it.name + `','jusousuo'); setResult(d);`
                        });
                    })
                    return JSON.stringify(data)
                }, name)
            }
        }])
    }
}
//搜索接口
function search(keyword, mode, sdata, group, type) {
    //mode:sousuo(聚阅聚合)、sousuotest(接口测试)、erji(二级换源)、sousuopage(嗅觉新搜索页)、jusousuo(视界聚合)
    let updateItemid = mode == "sousuo" ? "sousuoloading" : mode == "sousuopage" ? "sousuoloading" + getMyVar('sousuoPageType', '') : "listloading";
    if ((mode == "sousuo") && getMyVar('SrcJuSearching') == "1") {
        if (MY_PAGE == 1) {
            putMyVar("SrcJu_停止搜索线程", "1");
            let waittime = 10;
            for (let i = 0; i < waittime; i++) {
                if (getMyVar("SrcJu_停止搜索线程", "0") == "0") {
                    updateItem(updateItemid, {
                        title: '搜索中...'
                    });
                    break;
                }
                updateItem(updateItemid, {
                    title: '等待上次线程结束，' + (waittime - i - 1) + 's'
                });
                java.lang.Thread.sleep(1000);
            }
        }
    }
    let name = keyword.split('  ')[0];
    let searchMark = storage0.getMyVar('searchMark') || {}; //二级换源缓存
    if (mode == "erji" && searchMark[name]) {
        addItemBefore(updateItemid, searchMark[name]);
        updateItem(updateItemid, {
            title: getMyVar('SrcJuSearching') == "1" ? "‘‘’’<small>搜索中</small>" : "‘‘’’<small>当前搜索为缓存</small>",
            url: $("确定删除“" + name + "”搜索缓存吗？").confirm((name) => {
                let searchMark = storage0.getMyVar('searchMark') || {};
                delete searchMark[name];
                storage0.putMyVar('searchMark', searchMark);
                refreshPage(true);
                return "toast://已清除";
            }, name)
        });
        let i = 0;
        let one = "";
        for (var k in searchMark) {
            i++;
            if (i == 1) {
                one = k
            }
        }
        if (i > 20) {
            delete searchMark[one];
        }
        hideLoading();
        return "hiker://empty";
    } else if (mode == "erji") {
        updateItem(updateItemid, {
            title: "搜源中...",
            url: "hiker://empty",
        });
    }
    if (mode != "jusousuo" && mode != "sousuopage" && getMyVar('SrcJuSearching') == "1") {
        toast("上次搜索线程还未结束，等等再来");
        if (mode == "sousuotest") {
            return [];
        } else {
            return "hiker://empty";
        }
    }

    let page = 1;
    if (mode == "sousuo") {
        if (MY_PAGE == 1) {
            clearMyVar('MY_PGAE');
        } else {
            page = parseInt(getMyVar('MY_PGAE', '1')) + 1;
            putMyVar('MY_PGAE', page);
        }
    } else if (mode == "sousuotest" || mode == "sousuopage" || mode == "jusousuo") {
        page = MY_PAGE;
    }
    if (page == 1) {
        clearMyVar('nosousuolist');
    }
    let ssstype = type || runMode;
    let sssname;
    if (keyword.indexOf('  ') > -1) {
        sssname = keyword.split('  ')[1] || sourcename;
    }
    putMyVar('SrcJuSearchMode', mode);
    putMyVar('SrcJuSearching', '1');
    let success = 0;
    let results = [];
    let ssdatalist = [];
    if (sdata) {
        ssdatalist.push(sdata);
    } else if (sssname) {
        ssdatalist = erdatalist.filter(it => {
            return it.name == sssname && it.type == ssstype;
        });
    } else {
        ssdatalist = erdatalist.filter(it => {
            if (group == "全全" || !group) { //未分组或当前为全全分组的接口时，搜索所有此类型的接口
                return it.type == ssstype;
            } else {
                return it.type == ssstype && (it.group == group || it.group == "全全"); //分组名为真则只搜指定分组和全全
            }
        });
    }
    let nosousuolist = storage0.getMyVar('nosousuolist') || [];
    ssdatalist = ssdatalist.filter(it => {
        return nosousuolist.indexOf(it.name) == -1;
    })
    let task = function(obj) {
        let objdata = obj.data;
        let objmode = obj.mode;
        let name = obj.name;
        try {
            let parse;
            let 公共;
            let 标识;
            eval("let source = " + objdata.erparse);
            if (source.ext && /^http/.test(source.ext)) {
                requireCache(source.ext, 48);
                parse = erdata;
            } else {
                parse = source;
            }
            if (parse) {
                try {
                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuMethod.js');
                    cacheData(objdata);
                } catch (e) {
                    //log("√缓存临时文件失败>"+e.message);
                }
                eval("let gonggong = " + objdata.public);
                if (gonggong && gonggong.ext && /^http/.test(gonggong.ext)) {
                    requireCache(gonggong.ext, 48);
                    gonggong = ggdata;
                }
                公共 = gonggong || parse['公共'] || {};
                标识 = objdata.type + "_" + objdata.name;
                let ssdata = [];
                eval("let 搜索 = " + parse['搜索'])
                let 参数 = {
                    "规则名": MY_RULE.title,
                    "标识": 标识
                }

                function ocr(codeurl, headers) {
                    headers = headers || {};
                    let img = convertBase64Image(codeurl, headers).replace('data:image/jpeg;base64,', '');
                    let code = request('https://api.xhofe.top/ocr/b64/text', {
                        body: img,
                        method: 'POST',
                        headers: {
                            "Content-Type": "text/html"
                        }
                    });
                    code = code.replace(/o/g, '0').replace(/u/g, '0').replace(/I/g, '1').replace(/l/g, '1').replace(/g/g, '9');
                    log('识别验证码：' + code);
                    return code;
                }
                ssdata = 搜索(name, page, 公共, 参数) || [];
                //log('√'+objdata.name+">搜索结果>"+ssdata.length);
                let resultdata = [];


                ssdata.forEach(item => {
                    let extra = item.extra || {};
                    extra.name = extra.name || extra.pageTitle || (item.title ? item.title.replace(/‘|’|“|”|<[^>]+>|全集|国语|粤语/g, "").trim() : "");
                    if ((objmode == "erji" && ((getItem('searchMatch', '1') == "1" && extra.name == name) || extra.name.indexOf(name) > -1)) || objmode != "erji") {
                        extra.img = extra.img || item.img || item.pic_url;
                        extra.stype = objdata.type;
                        extra.sname = objdata.name;
                        extra.pageTitle = extra.pageTitle || extra.name;
                        extra.surl = item.url && !/js:|select:|\(|\)|=>|hiker:\/\/page|@|toast:/.test(item.url) ? item.url.replace(/hiker:\/\/empty|#immersiveTheme#|#autoCache#|#noRecordHistory#|#noHistory#|#readTheme#|#autoPage#|#noLoading#|#/g, "") : "";
                        item.extra = extra;
                        if (/js:|select:|\(|\)|=>|hiker:\/\/page|toast:/.test(item.url)) {
                            item.url = item.url
                        } else {
                            item.url = /sousuo/.test(objmode) ? $("hiker://empty#immersiveTheme##autoCache#").rule(() => {
                                require(config.依赖);
                                erji();
                            }) : "hiker://empty##" + item.url + $("#noLoading#").b64().lazyRule((extra) => {
                                if (getMyVar('已选择换源列表')) {
                                    return "toast://请勿重复点击，稍等...";
                                } else {
                                    putMyVar('已选择换源列表', '1');
                                    clearMyVar(extra.sname + "_" + extra.name);
                                    storage0.putMyVar('erjiextra', extra);
                                    refreshPage(false);
                                    return "toast://已切换源：" + extra.sname;
                                }
                            }, extra);
                        }
                        item.title = item.title;
                        //item.content = item.content || item.desc;
                        if (!item.desc) {
                            item.desc = "未知"
                        }

                        item.desc = objmode == "sousuo" || objmode == "sousuopage" ? MY_RULE.title + ' · ' + objdata.name + ' · ' + item.desc : objmode == "sousuotest" ? (item.content || item.desc) : (extra.desc || item.desc);
                        if (mode == "erji") {
                            item.desc = extra.sname + "·" + item.desc
                        }
                        item.col_type = objmode == "sousuo" || objmode == "jusousuo" ? "video" : (objmode == "sousuotest" || objmode == "sousuopage") ? "movie_1_vertical_pic" : "avatar";
                        resultdata.push(item);
                    }
                })

                return {
                    result: resultdata,
                    success: 1
                };

            }
            return {
                result: [],
                success: 0
            };
        } catch (e) {
            log('√' + objdata.name + '>搜索失败>' + e.message);
            return {
                result: [],
                success: 0
            };
        }
    }
    let list = ssdatalist.map((item) => {
        return {
            func: task,
            param: {
                "data": item,
                "mode": mode,
                "name": name
            },
            id: item.name
        }
    });
    if (list.length > 0) {
        be(list, {
            func: function(obj, id, error, taskResult) {
                if (getMyVar("SrcJu_停止搜索线程") == "1") {
                    return "break";
                } else if (taskResult.success == 1) {
                    let data = taskResult.result;
                    if (data.length > 0) {
                        success++;
                        if (mode == "erji") {
                            let searchMark = storage0.getMyVar('searchMark') || {}; //二级换源缓存
                            searchMark[name] = searchMark[name] || [];
                            searchMark[name] = searchMark[name].concat(data);
                            storage0.putMyVar('searchMark', searchMark);
                            if (!getMyVar('已选择换源列表')) {
                                addItemBefore("listloading", data);
                            }
                            hideLoading();
                        } else if (mode == "sousuo") {
                            addItemBefore(updateItemid, data);
                        } else if (mode == "sousuopage") {
                            addItemBefore(updateItemid, data);
                        } else if (mode == "sousuotest" || mode == "jusousuo") {
                            results = data;
                        }
                    } else {
                        nosousuolist.push(id);
                        storage0.putMyVar('nosousuolist', nosousuolist);
                    }
                }
            },
            param: {}
        });
        /*
        if (mode=="erji") {
            storage0.putMyVar('searchMark', searchMark);
        }
        */
        clearMyVar('SrcJuSearching');
        clearMyVar('SrcJuSearchMode');
        if (mode == "sousuotest" || mode == "jusousuo") {
            return results;
        } else {
            let sousuosm = mode == "sousuo" || mode == "sousuopage" ? success + "/" + list.length + "，第" + page + "页搜索完成" : "‘‘’’<small><font color=#f13b66a>" + success + "</font>/" + list.length + "，搜索完成</small>";
            updateItem(updateItemid, {
                title: sousuosm
            });
        }
    } else {
        clearMyVar('SrcJuSearching');
        clearMyVar('SrcJuSearchMode');
        if (page == 1) {
            toast("无接口");
            if (mode == "sousuo" || mode == "sousuopage") {
                updateItem("sousuoloading", {
                    title: "无接口"
                });
            }
        }
        if (mode == "sousuotest" || mode == "jusousuo") {
            return [];
        }
    }
    hideLoading();
    clearMyVar("SrcJu_停止搜索线程");
}

//取本地足迹记录
function getMark(name, stype) {
    let markfile = "hiker://files/rules/Src/Hk/mark.json";
    let markdata = fetch(markfile);
    if (markdata != "") {
        eval("var marklist=" + markdata + ";");
    } else {
        var marklist = [];
    }
    let mark = marklist.filter(it => {
        return it.name == name && it.stype == stype;
    })
    if (mark.length > 0) {
        return mark[0];
    } else {
        return "";
    }
}
//保存本地足迹记录
function setMark(data) {
    let markfile = "hiker://files/rules/Src/Hk/mark.json";
    let markdata = fetch(markfile);
    if (markdata != "") {
        eval("var marklist=" + markdata + ";");
    } else {
        var marklist = [];
    }
    let mark = marklist.filter(it => {
        return it.name == data.name && it.stype == data.stype;
    })
    if (mark.length > 0) {
        let index = marklist.indexOf(mark[0]);
        marklist.splice(index, 1)
    }
    marklist.push(data);
    if (marklist.length > 100) {
        marklist.splice(0, 1);
    }
    writeFile(markfile, JSON.stringify(marklist));
    return 1;
}
//图标下载
function downloadicon() {
    try {
        if (!fileExist('hiker://files/cache/src/管理.svg')) {
            downloadFile('https://hikerfans.com/tubiao/messy/13.svg', 'hiker://files/cache/src/管理.svg');
        }
        if (!fileExist('hiker://files/cache/src/更新.webp')) {
            downloadFile(config.依赖.match(/http(s)?:\/\/.*\//)[0] + "img/更新.webp", 'hiker://files/cache/src/更新.webp');
        }
        if (!fileExist('hiker://files/cache/src/分类.webp')) {
            downloadFile(config.依赖.match(/http(s)?:\/\/.*\//)[0] + "img/分类.webp", 'hiker://files/cache/src/分类.webp');
        }
        if (!fileExist('hiker://files/cache/src/排行.webp')) {
            downloadFile(config.依赖.match(/http(s)?:\/\/.*\//)[0] + "img/排行.webp", 'hiker://files/cache/src/排行.webp');
        }
        if (!fileExist('hiker://files/cache/src/收藏.svg')) {
            downloadFile('https://hikerfans.com/tubiao/messy/165.svg', 'hiker://files/cache/src/收藏.svg');
        }
    } catch (e) {}
}

//版本检测

//新搜索页
function newsousuopage(keyword, searchtype, relyfile) {
    addListener("onClose", $.toString(() => {
        clearMyVar('SrcJuCfg');
        clearMyVar('sousuoname');
        clearMyVar('sousuoPageType');
    }));
    addListener('onRefresh', $.toString(() => {
        clearMyVar('sousuoname');
    }));
    let d = [];
    d.push({
        title: "🔍",
        url: $.toString(() => {
            if (input) {
                putMyVar('sousuoname', input);
                let recordlist = storage0.getItem('searchrecord') || [];
                if (recordlist.indexOf(input) > -1) {
                    recordlist = recordlist.filter((item) => item !== input);
                }
                recordlist.unshift(input);
                if (recordlist.length > 20) {
                    recordlist.splice(recordlist.length - 1, 1);
                }
                storage0.setItem('searchrecord', recordlist);
                refreshPage(true);
            }
        }),
        desc: "搜你想要的...",
        col_type: "input",
        extra: {
            defaultValue: getMyVar('sousuoname', keyword || ''),
            titleVisible: true
        }
    });

    let typebtn = runModes;
    typebtn.forEach((it, i) => {
        let obj = {
            title: getMyVar("sousuoPageType", searchtype || runMode) == it ? `““””<b><span style="color: #3399cc">` + it + `</span></b>` : it,
            url: $('#noLoading#').lazyRule((it) => {
                putMyVar("sousuoPageType", it);
                refreshPage(false);
                return "hiker://empty";
            }, it),
            col_type: 'text_5'
        }
        if (i == (typebtn.length - 1)) {
            obj.extra = {};
            obj["extra"].longClick = [{
                title: "🔍聚影搜索",
                js: $.toString(() => {
                    putMyVar("sousuoPageType", "聚影");
                    refreshPage(false);
                    return "hiker://empty";
                })
            }];
        }
        d.push(obj);
    })

    let recordlist = storage0.getItem('searchrecord') || [];
    if (recordlist.length > 0) {
        d.push({
            title: '🗑清空',
            url: $('#noLoading#').lazyRule(() => {
                clearItem('searchrecord');
                deleteItemByCls('searchrecord');
                return "toast://已清空";
            }),
            col_type: 'flex_button', //scroll_button
            extra: {
                cls: 'searchrecord'
            }
        });
    } else {
        d.push({
            title: '↻无记录',
            url: "hiker://empty",
            col_type: 'flex_button',
            extra: {
                cls: 'searchrecord'
            }
        });
    }
    recordlist.forEach(item => {
        d.push({
            title: item,
            url: $().lazyRule((input) => {
                putMyVar('sousuoname', input);
                refreshPage(true);
                return "hiker://empty";
            }, item),
            col_type: 'flex_button',
            extra: {
                cls: 'searchrecord'
            }
        });
    })

    d.push({
        title: "",
        col_type: 'text_center_1',
        url: "hiker://empty",
        extra: {
            id: getMyVar('sousuoPageType') == "聚影" ? "loading" : "sousuoloading" + getMyVar('sousuoPageType', searchtype || ''),
            lineVisible: false
        }
    });
    setResult(d);
    let name = getMyVar('sousuoname', keyword || '');
    if (name) {
        deleteItemByCls('searchrecord');
        if (getMyVar('sousuoPageType') == "聚影") {
            relyfile = relyfile || config.依赖;
            require(relyfile.match(/http(s)?:\/\/.*\//)[0].replace('Ju', 'master') + 'SrcJyXunmi.js');
            xunmi(name);
        } else {
            let info = storage0.getMyVar('一级源接口信息') || {};
            let type = getMyVar("sousuoPageType", searchtype || info.type);
            search(name, "sousuopage", false, info.group, type);
        }
    }
}