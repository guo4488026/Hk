let yidata = {
    "页码": {
        "分类": 1,
    },

    "主页": function() {
        var d = []


        eval(fetchCache("https://gitcode.net/gf4488026/Hk/-/raw/Ju/动漫城.json",48))

        var rules = data.rules
        var rule = rules[公共.sname];
        if(公共.host){
            MY_URL=公共.host
        }else{
        MY_URL = rule.syurl;
        }
        var cookie = rule.Cookie;
        var parStr = rule.parStr;

        var html = request(MY_URL, {
            headers: {
                "Cookie": cookie
            }
        });
        if (html.length < 200) {
            html = fetchCodeByWebView(MY_URL)
        }

        var M = parStr.split(";")
        var 更新表 = M[6]
        var 大标题 = M[7]
        var 大列表 = M[5]
       
        var len = pdfa(html, 大列表);
        if (更新表 && 更新表 != "*") {
            var tabs = ["一", "二", "三", "四", "五", "六", "日"];
            var lists = [];
            var conts = pdfa(html, 更新表);

            for (var i in tabs) {
                lists.push(pdfa(conts[i], M[0]))
            }

            function 定位(k) {
                var m = {
                    1: "0",
                    2: "1",
                    3: "2",
                    4: "3",
                    5: "4",
                    6: "5",
                    0: "6"
                };
                return m[k]
            }
            var week = new Date().getDay();

            storage0.putMyVar("lists_1", lists);
            var list = lists[getMyVar(MY_URL, 定位(week))];

            tabs.forEach((data, id) => {
                d.push({
                    title: getMyVar(MY_URL, 定位(week)) == id ? '‘‘’’<strong><font color="#FA7298">☀周' + data + '</font></strong>' : data,
                    url: $("#noLoading#").lazyRule((线路, id, MY_URL, tu, sname,runMode) => {
                        MY_URL = MY_URL
                        var lists = storage0.getMyVar("lists_1");

                        线路.forEach((data, xlid) => {
                            updateItem({
                                title: id == xlid ? '‘‘’’<strong><font color="#FA7298">☀周' + data + '</font></strong>' : data,
                                extra: {
                                    id: MY_URL + "_线路" + xlid
                                }
                            });
                        })
                        putMyVar(MY_URL, id)
                        var 章节 = lists[getMyVar(MY_URL, '0')];


                        let cp = 章节.map((data, ssid) => {
                            return {
                                title: pdfh(data, tu[1]),
                                img: pd(data, tu[2]),
                                url: "hiker://empty#immersiveTheme##autoCache#" + $("").rule(() => {
                                    require(config.依赖);
                                    erji();
                                }),

                                extra: {
                                    cls: MY_URL + "_选集",
                                    name: pdfh(data, tu[1]),
                                    stype: runMode,
                                    pageTitle: pdfh(data, tu[1]),
                                    sname: sname,
                                    surl: getHome(MY_URL) + pdfh(data, tu[4]),
                                    img: pdfh(data, tu[2]),
                                    newWindow: true,
                            windowId:"搜视二级"    

                                }
                            };
                        });
                        deleteItemByCls(MY_URL + "_选集");
                        addItemBefore(MY_URL + "footer", cp);
                        return "hiker://empty"
                    }, tabs, id, MY_URL, M, 公共.sname,runMode),
                    col_type: 'flex_button',
                    extra: {
                        id: MY_URL + "_线路" + id
                    }
                });
            })

            list.forEach((data, id) => {
                var img = pd(data, M[2]);
                d.push({
                    title: pdfh(data, M[1]),
                    url: pd(data, 'a&&href'),
                    img: 公共.Referer ? img + 公共.Referer : img,
                    desc: pdfh(data, M[3]),

                    extra: {
                        cls: MY_URL + "_选集",



                    }
                });
            })


            d.push({
                col_type: "big_blank_block",
                extra: {
                    id: MY_URL + "footer",
                }
            });

            d.push({
                col_type: "line"
            })


        }



        var pngtou = "https://hikerfans.com/tubiao/ke/";

        var imgs = ["19.png", "30.png", "34.png", "63.png", "70.png", "150.png", "150.png", "150.png", "150.png"]


        for (var i in len) {

            
            var le = pdfa(len[i], M[0]).slice(0, 6)

            if(rule.libs){
            eval("var libs ="+rule.libs)
            var title = libs[i]
             } else {
                title = pdfh(len[i], 大标题);
            }
            d.push({
                title: title,
                img: pngtou + imgs[i],
                url: "hiker://empty",
                col_type: "avatar"
            })

            le.forEach((data, id) => {
                var img = pdfh(data, M[2]);
                img = img.startsWith("/") ? MY_URL + img : img;

                d.push({
                    title: pdfh(data, M[1]),
                    url: pd(data, M[4]),
                    img: 公共.Referer ? img + 公共.Referer : img,
                    desc: pdfh(data, M[3]),

                })
            })
            d.push({
                col_type: "line"
            })
        }
        return d
    },
    "分类": function() {
        var d = [];
        eval(fetchCache("https://gitcode.net/gf4488026/Hk/-/raw/Ju/动漫城.json",48))
        var rules = data.rules
        var rule = rules[公共.sname];
        
        var svurl =rule.syurl+ rule.svurl;
        if(公共.host){
            var svurl =公共.host+ rule.svurl;
        }
        var page = MY_PAGE
        MY_URL = svurl;
        if (rule.dtfl != true) {


            addListener('onClose', $.toString(() => {
                clearMyVar("dtfl_url")
                clearMyVar("dtfl_title")
            }))


            var 分类颜色 = "#FA7298"
            eval("var dtfl=" + rule.dtfl);
            var 大类定位 = dtfl.大类定位;
            var 拼接分类 = dtfl.拼接分类;
            var 小类定位 = dtfl.小类定位;
            var 分类标题 = dtfl.分类标题;
            var 分类链接 = dtfl.分类链接;

            var sname = 公共.sname;

            var true_url = getMyVar(sname + "_url", svurl);
            eval("var get_url=" + rule.true_url);
            true_url = get_url(true_url);
            var parStr = rule.parStr;

            var html = request(true_url);
            eval(JSON.parse(fetch("hiker://page/dtfl?rule=搜视")).rule)

            var M = parStr.split(";")

            var list = pdfa(html, M[0]);

            for (var it of list) {
                var img = pdfh(it, M[2]);
                d.push({
                    title: pdfh(it, M[1]),
                    url: pd(it, M[4]),
                    img: 公共.Referer ? img + 公共.Referer : img,
                    desc: pdfh(it, M[3]),
                    col_type: "movie_2"

                })
            }

        } else {



            addListener('onClose', $.toString(() => {
                clearVar(MY_RULE.url)
                clearVar(MY_RULE.title)
                clearMyVar("data")
            }))

            var true_url = getVar(MY_RULE.url, MY_URL)


            type = true_url.split("show/")[1].split(".")[0]
            time = "" + new Date().getTime()
            key = md5("DS" + time + "DCC147D11943AF75")

            var result = {
                'type': type,
                'page': page,
                'time': time,
                'key': key
            };

            var data = Object.assign(storage0.getMyVar("data", {}), result)




            var html = fetchCache(true_url)

            var 分类颜色 = "#FA7298"
            var categories = pdfa(html, "body&&.swiper-wrapper:not(:matches(首页))").concat(["<li data-type=\"by\" data-val=\"time\"><a href=\"javascript:\">按最新</a></li>\n <li data-type=\"by\" data-val=\"hits\"><a href=\"javascript:\">按最热</a></li>\n <li data-type=\"by\" data-val=\"score\"><a href=\"javascript:\">按评分</a></li>"])



            var 小类定位 = 'body&&li';
            var 分类标题 = 'a&&Text'
            var 分类链接 = 'a&&href'

            var init_cate = []

            for (let i = 0; i < 20; i++) {
                init_cate.push("0")
            }

            var fold = getVar(MY_RULE.group, "0")
            var cate_temp_json = getVar(MY_RULE.title, JSON.stringify(init_cate))
            var cate_temp = JSON.parse(cate_temp_json)

            if (parseInt(page) === 1) {
                d.push({
                    title: fold === '1' ? '““””<b>' + '∨'.fontcolor("#FF0000") + '</b>' : '““””<b>' + '∧'.fontcolor("#1aad19") + '</b>',
                    url: $().lazyRule((fold) => {
                        putVar(MY_RULE.group, fold === '1' ? '0' : '1');
                        refreshPage(false);
                        return "hiker://empty"
                    }, fold),
                    col_type: 'scroll_button',
                })
                categories.forEach((category, index) => {
                    let sub_categories = pdfa(category, 小类定位);
                    if (index === 0) {
                        sub_categories.forEach((item, key) => {
                            let title = pdfh(item, 分类标题)
                            if (typeof(排除) != 'undefined' && 排除 != '') {
                                title = title.replace(new RegExp(排除, "g"), "")
                            }
                            d.push({
                                title: key.toString() === cate_temp[index] ? "““””" + title.fontcolor(分类颜色) : title,
                                url: $(pd(item, 分类链接) + '#noLoading#').lazyRule((params) => {
                                    let new_cate = []
                                    params.cate_temp.forEach((cate, index) => {
                                        new_cate.push(index === 0 ? params.key.toString() : "0")
                                    });
                                    if (params.val == "") {
                                        storage0.putMyVar("data", {})
                                    } else {
                                        var result = storage0.getMyVar("data", {});
                                        result[params.type] = params.val;
                                        storage0.putMyVar("data", result)
                                    }
                                    putVar(MY_RULE.title, JSON.stringify(new_cate))
                                    putVar(MY_RULE.url, input)
                                    refreshPage(true)
                                    return "hiker://empty"
                                }, {
                                    cate_temp: cate_temp,
                                    key: key,
                                    val: pdfh(item, 'li&&data-val'),
                                    type: pdfh(item, 'li&&data-type'),
                                    page: page,
                                }),
                                col_type: 'scroll_button',
                            })
                        })
                        d.push({
                            col_type: "blank_block"
                        });
                    } else if (fold === '1') {
                        sub_categories.forEach((item, key) => {
                            let title = pdfh(item, 分类标题)
                            if (typeof(排除) != 'undefined' && 排除 != '') {
                                title = title.replace(new RegExp(排除, "g"), "")
                            }
                            d.push({
                                title: key.toString() === cate_temp[index] ? "““””" + title.fontcolor(分类颜色) : title,
                                url: $(pd(item, 分类链接) + '#noLoading#').lazyRule((params) => {
                                    params.cate_temp[params.index] = params.key.toString()
                                    if (params.val == "") {
                                        storage0.putMyVar("data", {})
                                    } else {
                                        var result = storage0.getMyVar("data", {});
                                        result[params.type] = params.val;
                                        storage0.putMyVar("data", result)
                                    }
                                    putVar(MY_RULE.title, JSON.stringify(params.cate_temp))
                                    putVar(MY_RULE.url, input)
                                    refreshPage(true)
                                    return "hiker://empty"
                                }, {
                                    cate_temp: cate_temp,
                                    index: index,
                                    key: key,
                                    val: pdfh(item, 'li&&data-val'),
                                    type: pdfh(item, 'li&&data-type'),
                                    page: page,
                                }),
                                col_type: 'scroll_button',
                            })
                        })
                        d.push({
                            col_type: "blank_block"
                        });
                    }
                })
            }



            数据 = JSON.parse(post(getHome(MY_URL) + "/index.php/api/vod", {

                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "User-Agent": "Mozilla/5.0 (Linux; Android 12; 2201122C Build/SKQ1.211006.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/95.0.4638.74 Mobile Safari/537.36"

                },
                body: JSON.stringify(data)

            })).list


            var list = 数据
            list.forEach(item => {
                d.push({
                    title: item.vod_name,
                    desc: item.vod_remarks,
                    img: item.vod_pic,
                    url: getHome(MY_URL) + "/bangumi/" + item.vod_id + '.html',

                    col_type: 'movie_3_marquee',
                })
            })
        }

        return d

    }
}

var erdata = {
    "搜索": function(name, page) {
        var d = []
        eval(fetchCache("https://gitcode.net/gf4488026/Hk/-/raw/Ju/动漫城.json",48))
        var rules = data.rules
        var rule=rules[公共.sname]
        var ssurl =rule.syurl+ rule.ssurl;
        if(公共.host){
           ssurl =公共.host+ rule.ssurl;
        }
        ssurl = ssurl.replace("**", name).replace("fypage", page);

        var parStr = rules[公共.sname].parStr;
        var html = request(ssurl);
        var M = parStr.split(";");

        var list = pdfa(html, M[0])
        for (var it of list) {
            var img = pdfh(it, M[2]).startsWith("/") ? getHome(ssurl) + pdfh(it, M[2]) : pdfh(it, M[2]);
            var url = pdfh(it, M[4])
            if(pdfh(it, M[1]).includes(name)){
            d.push({
                title: pdfh(it, M[1]),
                img: 公共.Referer ? img + 公共.Referer : img,
                desc: pdfh(it, M[3]),
                url: url.startsWith("/") ? getHome(ssurl) + url : url
            })
          }
        }
        return d

    },
    "二级": function(surl) {
        var data = JSON.parse(fetch("hiker://files/rules/cy/动漫城.json"));
        var rules = data.rules;

        var rule = rules[公共.sname];
        var cookie = rule.Cookie;
        try {


            var content = rule.content;
            var Desc = content.split(";")
            var 片名 = Desc[0]
            var 图片 = Desc[1]
            var 类型 = Desc[2]
            var 更新 = Desc[3]
            var 简介 = Desc[4]
        } catch (e) {}
        try {
            var playlist = rule.playlist;
            var List = playlist.split(";")
            var 线路 = List[0]
            var 线路名 = List[1]
            var 列表 = List[2]
            var 子列表 = List[3]

        } catch (e) {}

        var html = request(surl, {
            headers: {
                "Cookie": cookie
            }
        })
        MY_URL = surl;
        var 名 = "片名：" + pdfh(html, 片名);
        var 类 = "类型：" + pdfh(html, 类型).replace(/类型|分类|:|：/g, "");
        var 更 = pdfh(html, 更新);
        var 图 = pd(html, 图片)
        var desc = pdfh(html, 简介);
        var tabs = [];
        var lists = [];
        var arts = pdfa(html, 线路)
        var conts = pdfa(html, 列表)

        for (var i in conts) {
            var list = pdfa(conts[i], 子列表).map(it => {
                return {
                    title: pdfh(it, "a&&Text"),
                    url: pd(it, "a&&href")
                }
            })
            lists.push(list)
            var 线路s = pdfh(arts[i], 线路名);
            tabs.push(线路s)
        }

        return {

            detail1: 名 + '\n' + 类,
            detail2: 更,
            img: 公共.Referer ? 图 + 公共.Referer : 图,
            desc: desc,
            line: tabs,
            list: lists

        }

    },
    "最新": function(surl) {
        try {
            eval(fetchCache("https://gitcode.net/gf4488026/Hk/-/raw/Ju/动漫城.json",48))
            var rules = data.rules
            var rule = rules[公共.sname];

            var playlist = rule.playlist;
            var List = playlist.split(";")
            var 线路 = List[0]
            var 线路名 = List[1]
            var 列表 = List[2]
            var 子列表 = List[3]

        } catch (e) {}
        var html = request(surl)
        var lists = []
        var arr = []
        var conts = pdfa(html, 列表);
        for (var i in conts) {
            var list = pdfa(conts[i], 子列表).map(it => {
                return {
                    title: pdfh(it, "a&&Text"),
                    url: pd(it, "a&&href")
                }
            })
            lists.push(list)
            arr.push(list.length)
        }
        var n = 0
        var max = 0
        for (var i in arr) {
            if (arr[i] > max) {
                max = arr[i]
                n = i
            }
        }
        var 更 = lists[n].length;
        setResult("更新至第" + 更 + "集")
    },
    "解析": function(url) {
            eval(fetchCache("https://gitcode.net/gf4488026/Hk/-/raw/Ju/动漫城.json",48))
            eval("var lazy=" + data.rules[公共.sname].lazy)
            return lazy(url)       
    }
}