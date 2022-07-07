var SrcParseS = {
    formatUrl: function (url, i) {
        try {
            if (url.trim() == "") {
                return "toast://解析失败，建议切换线路或更换解析方式";
            } else {
                if (url[0] == '/') { url = 'https:' + url }
                if (i == undefined) {
                    if (getMyVar('SrcM3U8', '1') == "1") {
                        url = cacheM3u8(url, {timeout: 2000});
                    }
                    if(url.indexOf('User-Agent')==-1){
                        if (/wkfile/.test(url)) {
                            url = url + ';{User-Agent@Mozilla/5.0&&Referer@https://fantuan.tv/}';
                        } else if (/bilibili|bilivideo/.test(url)) {
                            url = url + ";{User-Agent@Mozilla/5.0&&Referer@https://www.bilibili.com/}";
                        } /*else if (/shenglinyiyang\.cn/.test(url)) {
                            url = url + ";{User-Agent@Mozilla/5.0&&Referer@https://zyz.sdljwomen.com}";
                        }*/ else if (/mgtv/.test(url)) {
                            url = url + ";{User-Agent@Mozilla/5.0}";
                        }/* else {
                            url = url + ";{User-Agent@Mozilla/5.0}";
                        }*/
                    }
                } else {
                    if (getMyVar('SrcM3U8', '1') == "1") {
                        url = cacheM3u8(url, {timeout: 2000}, 'video' + parseInt(i) + '.m3u8') + '#pre#';
                    }
                }
                if(url.indexOf('#isVideo=true#')==-1){
                    url = url + '#isVideo=true#';
                }
                return url;
            }
        } catch (e) {
            return url;
        }
    },
    mulheader: function (url) {
        if (/mgtv/.test(url)) {
            var header = { 'User-Agent': 'Mozilla/5.0', 'Referer': 'www.mgtv.com' };
        } else if (/bilibili|bilivideo/.test(url)) {
            var header = { 'User-Agent': 'Mozilla/5.0', 'Referer': 'www.bilibili.com' };
        } else if (/wkfile/.test(url)) {
            var header = { 'User-Agent': 'Mozilla/5.0', 'Referer': 'fantuan.tv' };
        } else {
            var header = { 'User-Agent': 'Mozilla/5.0' };
        }
        return header;
    },
    嗅探: function (vipUrl) {
        showLoading('√嗅探解析中，请稍候');
        return (getMyVar('SrcXTNH', 'web') == 'x5' ? 'x5Rule://' : 'webRule://') + vipUrl + '@' + $.toString((formatUrl) => {
            if (typeof (request) == 'undefined' || !request) {
                eval(fba.getInternalJs());
            };
            if (window.c == null) {
                window.c = 0;
            };
            window.c++;
            if (window.c * 250 >= 15 * 1000) {
                fba.hideLoading();
                return "toast://解析超时，建议切换线路或更换解析方式";
            }
            //fba.log(fy_bridge_app.getUrls());
            var urls = _getUrls();
            var exclude = /m3u8\.tv/;
            var contain = /\.mp4|\.m3u8|\.flv|\.avi|\.mpeg|\.wmv|\.mov|\.rmvb|\.dat|qqBFdownload|mime=video%2F|video_mp4/;
            for (var i in urls) {
                if (!exclude.test(urls[i]) && contain.test(urls[i])) {
                    //fba.log(urls[i]);
                    if(fy_bridge_app.getHeaderUrl)
                        //return fy_bridge_app.getHeaderUrl(urls[i]).replace(";{", "#isVideo=true#;{");
                        
                        return $$$("#noLoading#").lazyRule((url) => {
                            return cacheM3u8(url.split(";{")[0], {timeout: 2000})+"#isVideo=true#;{"+url.split(";{")[1];
                        }, fy_bridge_app.getHeaderUrl(urls[i]));
                    else {
                        return $$$("#noLoading#").lazyRule((url, formatUrl) => {
                            //url = url.replace(/http.*?\?url=/, '');
                            return formatUrl(url);
                        }, urls[i], formatUrl);
                    }
                }
            }
        }, this.formatUrl)
    },
    智能: function (vipUrl, input) {
        showLoading('√智能解析中，请稍候');
        var video = "";
        try {
            if (vipUrl.search(/LT-/) > -1) {
                var jxList = ["https://ltjx.jeeves.vip/home/api?type=ys&uid=461939&key=degkpqruyzACEJLORW&url=", "https://ltjx.jeeves.vip/home/api?type=ys&uid=1589472&key=aehjpzAHILOPQRU456&url=", "https://vip.legendwhb.cn/m3u8.php?url=", "https://jx.zjmiao.com/?url=", "https://09tv.top/jx/?url="];
                var keyList = ["", "", "D63D64E0EDA774E3", "63f49d21a0dccf3c", "A42EAC0C2B408472"];
                var refList = ["", "", "https://wnvod.net", "", "https://09tv.top"];
                var jxLX = ["O", "O", "M", "M", "M"];
                for (var i = 0; i < jxList.length; i++) {
                    if (jxLX[i] != "M") {
                        video = this.明码(jxList[i] + vipUrl);
                        if (video.slice(0, 4) == 'http') {
                            break;
                        } else {
                            log('线路LT：' + jxList[i] + ' 解析异常');
                        }
                    } else {
                        video = this.maoss(jxList[i] + vipUrl, refList[i], keyList[i]);
                        if (video.slice(0, 4) == 'http') {
                            break;
                        } else {
                            log('线路LT：' + jxList[i] + ' 解析异常');
                        }
                    }
                }
            } else if (/renrenmi-/.test(vipUrl)) {
                var jxList = ["https://jx.blbo.cc:4433/analysis.php?v=", "https://jx.renrenmi.cc/?url=", "https://a.dxzj88.com/jxrrm/jiami.php?url="];
                for (var i = 0; i < jxList.length; i++) {
                    video = this.明码(jxList[i] + vipUrl);
                    if (video.slice(0, 4) == 'http') {
                        break;
                    } else {
                        log('线路RR：' + jxList[i] + ' 解析异常');
                    }
                }
            } else if (/RongXingVR/.test(vipUrl)) {
                var jxList = ["https://vip.rongxingvr.top/api/?key=CMTJsEtHIzsLqZ6OGl&url=", "https://tc.yuanmajs.cn/jxplayer.php?v="];
                for (var i = 0; i < jxList.length; i++) {
                    video = this.明码(jxList[i] + vipUrl);
                    if (video.slice(0, 4) == 'http') {
                        break;
                    } else {
                        log('线路RX：' + jxList[i] + ' 解析异常');
                    }
                }
            } else if (/wuduyun-/.test(vipUrl)) {
                var jxList = ["http://jf.1080p.icu:3232/home/api?type=dsp&uid=147565&key=adilmopuBEFJNUV067&url="];
                for (var i = 0; i < jxList.length; i++) {
                    video = this.明码(jxList[i] + vipUrl);
                    if (video.slice(0, 4) == 'http') {
                        break;
                    } else {
                        log('线路WD：' + jxList[i] + ' 解析异常');
                    }
                }
            } else if (/xueren-/.test(vipUrl)) {
                var jxList = ["https://www.shangjihuoke.com/json.php/?url="];
                for (var i = 0; i < jxList.length; i++) {
                    video = this.明码(jxList[i] + vipUrl);
                    if (video.slice(0, 4) == 'http') {
                        break;
                    } else {
                        log('线路XR：' + jxList[i] + ' 解析异常');
                    }
                }
            } else if (/\.suoyo|adHuRo0dcuHoM163L1/.test(vipUrl)) {
                var apiList = ["https://p.tjomet.com/duoduo/api.php", "https://jiexi.ysgc.xyz/api.php"];
                var refList = ["https://www.ysgc.cc/", "https://www.ysgc.cc/"];
                if (/suoyo/.test(vipUrl)) {
                    //明码https://a.dxzj88.com/jxdd/dd.php?url=
                    vipUrl = 'adHuRo0dcuHoM163L1y49tM3U4LmNhY2hlLnN1b3lvLmNj' + base64Encode(vipUrl.replace('https://m3u8.cache.suoyo.cc', ''));
                }
                for (var i = 0; i < apiList.length; i++) {
                    video = this.DD(vipUrl, apiList[i], refList[i]);
                    if (video.slice(0, 4) == 'http') {
                        break;
                    } else {
                        log('线路DD：' + apiList[i] + ' 解析异常');
                    }
                }
            } else if (/ruifenglb/.test(vipUrl)) {
                var jxList = ["http://player.yjhan.com:8090/api/?key=sQWHLErduwNEmxfx3V&url=", "https://004.summ.vip/?url=", "https://shangjihuoke.com/CL4K/?url="];
                var keyList = ["", "A42EAC0C2B408472", "A42EAC0C2B408472"];
                var refList = ["", "", ""];
                var jxLX = ["O", "M", "M"];
                for (var i = 0; i < jxList.length; i++) {
                    if (jxLX[i] != "M") {
                        video = this.明码(jxList[i] + vipUrl);
                        if (video.slice(0, 4) == 'http') {
                            break;
                        } else {
                            log('线路RX：' + jxList[i] + ' 解析异常');
                        }
                    } else {
                        video = this.maoss(jxList[i] + vipUrl, refList[i], keyList[i]);
                        if (video.slice(0, 4) == 'http') {
                            break;
                        } else {
                            log('线路CL4K：' + jxList[i] + ' 解析异常');
                        }
                    }
                }
            } else if (/xfy-/.test(vipUrl)) {
                video = this.maoss("https://jx.zjmiao.com/?url=" + vipUrl, "", "63f49d21a0dccf3c");
            } else if (/\.mp4|\.m3u8/.test(vipUrl)) {
                video = vipUrl;
            } else if (/youku|mgtv|ixigua|qq\.com|iqiyi|migu|bilibili|sohu|pptv|\.le\.|\.1905|cctv/.test(vipUrl)) {
                if (getMyVar('SrcGJFS', '1') == "2") {
                    return this.DN(vipUrl);
                } else {
                    return this.嗅探(input);
                }
            }
        } catch (e) { }
        if (video == "") {
            return this.嗅探(input);
        } else {
            return this.formatUrl(video);
        }
    },
    官网: function (vipUrl, jxUrl, isDn) {
        try {
            if (getMyVar('SrcGJFS', '1') == "2" || isDn == "1") {
                return this.DN(vipUrl);
            } else {
                if (getMyVar('author') == "帅√`人才") {
                    return this.聚嗅(vipUrl);
                } else {
                    if (jxUrl == "" || jxUrl == undefined) { jxUrl = "https://jx.blbo.cc:4433/?url=" }
                    return this.嗅探(jxUrl + vipUrl);
                }
            }
        } catch (e) {
            return '';
        }
    },
    明码: function (playUrl, ref) {
        try {
            if (ref == "") {
                var html = request(playUrl, { timeout: 5000 });
            } else {
                var html = request(playUrl, { headers: { 'Referer': ref }, timeout: 5000 });
            }
            try {
                let rurl = JSON.parse(html).url || JSON.parse(html).data;
                if (typeof (rurl) != "undefined") {
                    var url = rurl;
                }
            } catch (e) {
                var url = html.match(/urls = "(.*?)"/)[1];
            }
            return url;
        } catch (e) {
            return '';
        }
    },
    maoss: function (playUrl, ref, key) {
        try {
            if (ref) {
                var html = request(playUrl, { headers: { 'Referer': ref }, timeout: 8000 });
            } else {
                var html = request(playUrl, { timeout: 8000 });
            }
            if (html.indexOf('&btwaf=') != -1) {
                html = request(playUrl + '&btwaf' + html.match(/&btwaf(.*?)"/)[1], { headers: { 'Referer': ref }, timeout: 8000 })
            }
            var iv = html.match(/_token = "(.*?)"/)[1];

            var getVideoInfo = function (text) {
                eval(getCryptoJS());
                var video = CryptoJS.AES.decrypt(text, CryptoJS.enc.Utf8.parse(key), {
                    'iv': CryptoJS.enc.Utf8.parse(iv),
                    'mode': CryptoJS.mode.CBC
                }).toString(CryptoJS.enc.Utf8);
                return video;
            };
            eval(html.match(/var config = {[\s\S]*?}/)[0]);
            if (config.url.slice(0, 4) != 'http') {
                config.url = getVideoInfo(config.url);
            }
            if (config.url != "" && config.url.slice(0, 4) != 'http') {
                config.url = decodeURIComponent(config.url);
            }
            return config.url;
        } catch (e) {
            return '';
        }
    },
    DD: function (vipUrl, apiUrl, ref) {
        try {
            if (apiUrl == "" || apiUrl == undefined) { 
                /*
                if(getMyVar('ddfrom', '')=="duoduozy"){
                    apiUrl = "https://player.tjomet.com/ysgc/qa9ty92aTSGHwn3X.jpg" 
                }else{
                    apiUrl = "https://ysgc.tjomet.com/qa9ty92aTSGHwn3X.jpg" 
                }
                clearMyVar('ddfrom');
                */
                apiUrl = "https://ysgc.tjomet.com/qa9ty92aTSGHwn3X.jpg" ;
            }
            var html = request("https://ysgc.tjomet.com/?url="+vipUrl,{timeout:5000});
            eval(html.match(/var config = {[\s\S]*?}/)[0] + '');
            var bod = 'url=' + config.url + "&vkey=" + config.vkey + "&token=" + config.token + "&sign=bKvCXSsVjPyTNr9R";
            var json = JSON.parse(request(apiUrl, { method: 'POST', body: bod }));
            eval(fetch("https://vkceyugu.cdn.bspapp.com/VKCEYUGU-03ee1f89-f0d4-49aa-a2b3-50e203514d8a/2e54cc42-9b4c-457d-b2de-0cdf3e2aeeaa.js"));//https://p.tjomet.com/duoduo/js/decode.js
            let url = getVideoInfo(json.url);
            if(/^http/.test(url)){
                return url;
            }else{
                var jsonstr = JSON.parse(request("https://p.tjomet.com/lff/api.php", { headers: { 'Referer': ref }, method: 'POST', body: 'url=' + vipUrl }));
                eval(getCryptoJS());
                return CryptoJS.AES.decrypt(jsonstr.url, CryptoJS.enc.Utf8.parse(CryptoJS.MD5('rXjWvXl6')), {
                    'iv': CryptoJS.enc.Utf8.parse('NXbHoWJbpsEOin8b'),
                    'mode': CryptoJS.mode.CBC,
                    'padding': CryptoJS.pad.ZeroPadding
                }).toString(CryptoJS.enc.Utf8);
            }
        } catch (e) {
            return '';
        }
    },
    DD2: function (vipUrl, apiUrl, ref) {
        try {
            if(/youku|mgtv|ixigua|qq\.com|iqiyi|migu|bilibili|sohu|pptv|\.le\.|\.1905|cctv/.test(url)) {
                return SrcParseS.官网(url);
            } else {
                if (apiUrl == "" || apiUrl == undefined) { apiUrl = "https://bo.dd520.cc/xmplayer/duoduo.php" }
                if (ref == "" || ref == undefined) { ref = "http://www.xawqxh.net" }
                vipUrl = "ahHgRj0kceHdMc66L5y4" + base64Encode(vipUrl).slice(10);
                //var json = JSON.parse(request(apiUrl, { headers: { 'Referer': ref }, method: 'POST', body: 'url=' + vipUrl }));
                var json = JSON.parse(request(apiUrl, { method: 'POST', body: 'url=' + vipUrl }));
                eval(getCryptoJS());
                return CryptoJS.AES.decrypt(json.url, CryptoJS.enc.Utf8.parse(CryptoJS.MD5('rXjWvXl6')), {
                    'iv': CryptoJS.enc.Utf8.parse('NXbHoWJbpsEOin8b'),
                    'mode': CryptoJS.mode.CBC,
                    'padding': CryptoJS.pad.ZeroPadding
                }).toString(CryptoJS.enc.Utf8);
            }
        } catch (e) {
            return '';
        }
    },
    DN: function (vipUrl) {
        evalPrivateJS("OjB3OHrVodkVQlHIU8UUAC5W0ZBgTQEC4h9eUEcAT9kEM0hY/45YOxs7PDeQEnxjVhaWW2tIqO5GQimD4ssHKSka505+O0avEtQQZ9zRy6GxaBZdTHrbCPcoNIajmr3+JG22tRswOJFYDX5aYk0PfUDEFsZa2OjZbz+xTthnoUPLNm0R2g1kBFnWwGKBWUxEhEsFwFruhFSaxJi1E1WZ7WlbP0v4OpoQgn6M7UXGahP9h2fHi8UBVDGfjzIuVuJSCgICLlVGaAbT0ghic+Kfbp3TmjRhAo1DKretYp1U53apDMvO2Q+6oAyO1js5TJwx51ygFSUqVGAu0C2DLxkG0Z3+L8UPZyJa4KVDlqq/goE=")
        return aytmParse(vipUrl);
    },
    聚嗅: function (vipUrl, x5jxlist) {
        var jxhtml = config.依赖.match(/https.*\//)[0] + 'SrcJiexi.html';
        fc(jxhtml, 48);
        let libsjxjs = fetch("hiker://files/libs/" + md5(jxhtml) + ".js");
        if (x5jxlist != undefined) {
            if (x5jxlist.length > 0) {
                var a = JSON.parse(libsjxjs.match(/apiArray=(.*?);/)[1]);
                for (var i = 0; i < x5jxlist.length; i++) {
                    a.push(x5jxlist[i]);
                }
                function uniq(array) {
                    var temp = []; //一个新的临时数组
                    for (var i = 0; i < array.length; i++) {
                        if (temp.indexOf(array[i]) == -1) {
                            temp.push(array[i]);
                        }
                    }
                    return temp;
                }
                a = uniq(a);//去重
                libsjxjs = libsjxjs.replace(libsjxjs.match(/apiArray=(.*?);/)[1], JSON.stringify(a))
            }
        }
        let libsjxhtml = "hiker://files/libs/" + md5(jxhtml) + ".html";
        writeFile(libsjxhtml, libsjxjs);
        return this.嗅探(getPath(libsjxhtml) + '?url=' + vipUrl);
    },
    
    APP: function (vipUrl) {
        var appParses = getMyVar('parse_api', '');
        var Uparselist = [];
        Uparselist = appParses.split(',');
        function uniq(array) {
            var temp = []; //一个新的临时数组
            for (var i = 0; i < array.length; i++) {
                if (temp.indexOf(array[i]) == -1) {
                    temp.push(array[i]);
                }
            }
            return temp;
        }
        Uparselist = uniq(Uparselist);//去重
        var x5jxlist = []; //x5嗅探接口存放数组
        var url = "";
        var parseurl = "";
        var urls = [];//多线路地址
        var headers = [];//多线路头信息
        var exclude = /404\.m3u8|xiajia\.mp4|余额不足\.m3u8|\.suoyo|\.ruifenglb|m3u8\.tv/;//设置排除地址
        var contain = /\.mp4|\.m3u8|\.flv|\.avi|\.mpeg|\.wmv|\.mov|\.rmvb|\.dat|qqBFdownload|mime=video%2F|video_mp4/;//设置符合条件的正确地址
        if (!exclude.test(vipUrl) && contain.test(vipUrl)) {
            url = vipUrl;
        }
        for (var i = 0; i < Uparselist.length; i++) {
            if (contain.test(url)) { break; }
            if (x5jxlist.length >= 3) { break; }
            let UrlList = [];
            let p = i + 3;
            if (p > Uparselist.length) { p = Uparselist.length }
            for (let s = i; s < p; s++) {
                parseurl = Uparselist[s];
                if (parseurl[0] == '/') { parseurl = 'https:' + parseurl }
                if (parseurl.substring(0, 4) == 'http') {
                    UrlList.push(parseurl);
                }
                i = s;
            }
            if (UrlList.length > 0) {
                let playUrls = UrlList.map((playUrl) => {
                    return {
                        url: playUrl + vipUrl,
                        options: { headers: { 'User-Agent': PC_UA }, timeout: 2000 }
                    }
                });

                let bfhtml = batchFetch(playUrls);
                for (let k in bfhtml) {
                    let gethtml = bfhtml[k];
                    parseurl = UrlList[k];
                    if (gethtml == undefined || gethtml == "" || !/<|{/.test(gethtml)) {
                        //url直链网页打不开
                    } else {
                        try {
                            try {
                                var rurl = JSON.parse(gethtml).url || JSON.parse(gethtml).data;
                            } catch (e) {
                                try {
                                    var rurl = gethtml.match(/urls = "(.*?)"/)[1];
                                } catch (e) {
                                    x5jxlist.push(parseurl);
                                }
                            }
                            if (typeof (rurl) != "undefined" && contain.test(rurl) && !exclude.test(rurl)) {
                                url = rurl;
                                urls.push(this.formatUrl(url, urls.length));
                                headers.push(this.mulheader(url));
                            }
                        } catch (e) { }
                    }
                }//批量结果循环
            }
        }

        if (url == "") {
            if (/youku|mgtv|ixigua|qq\.com|iqiyi|migu|bilibili|sohu|pptv|\.le\.|\.1905|cctv/.test(vipUrl)) {
                if (getMyVar('SrcGJFS', '1') == "2") {
                    return this.DN(vipUrl);
                } else {
                    if (getMyVar('author') == "帅√`人才") {
                        return this.聚嗅(vipUrl);
                    } else {
                        return this.聚嗅(vipUrl, x5jxlist);
                    }
                }
            } else {
                if (getMyVar('author') == "帅√`人才") {
                    return this.智能(vipUrl);
                } else {
                    return this.聚嗅(vipUrl, x5jxlist);
                }
            }
        } else {
            if (urls.length > 1) {
                return JSON.stringify({
                    urls: urls,
                    headers: headers
                });
            } else {
                return this.formatUrl(url);
            }
        }
    },
    聚影: function (vipUrl) {
        //聚影采用新的、独立的解析逻辑
        var cfgfile = "hiker://files/rules/Src/Juying/config.json";
        var Juyingcfg=fetch(cfgfile);
        if(Juyingcfg != ""){
            eval("var JYconfig=" + Juyingcfg+ ";");
        }else{
            var JYconfig= {printlog: 0, isdn: 0, cachem3u8: 1, forcedn: 0, appjiexinum: 50, mulnum: 1};
        }
        var printlog = JYconfig.printlog||0;
        var isdn = 0;
        if(fileExist('hiker://files/cache/MyParseSet.json')&&fileExist('hiker://files/rules/DuanNian/MyParse.json')){
            try {
                isdn = JYconfig.isdn;
            } catch (e) { }
        }
        var forcedn = JYconfig.forcedn||0;
        var appjiexinum = JYconfig['appjiexinum'] || 50;
        putMyVar('SrcM3U8',JYconfig.cachem3u8);
        var mulnum = JYconfig.mulnum||1;
        if(printlog==1){log("影片地址："+vipUrl)}; 
        var exclude = /404\.m3u8|xiajia\.mp4|余额不足\.m3u8|m3u8\.tv/;//设置排除地址
        var contain = /\.mp4|\.m3u8|\.flv|\.avi|\.mpeg|\.wmv|\.mov|\.rmvb|\.dat|qqBFdownload|mime=video%2F|video_mp4/;//设置符合条件的正确地址
        var needparse = /suoyo\.cc|fen\.laodi/;//设置需要解析的视频地址

        if(contain.test(vipUrl)&&!exclude.test(vipUrl)&&!needparse.test(vipUrl)){
            if(printlog==1){log("直链视频地址，直接播放")}; 
            if(vipUrl.indexOf('app.grelighting.cn')>-1){vipUrl = vipUrl.replace('app.','ht.')}
            return vipUrl + '#isVideo=true#';
        }else if (vipUrl.indexOf('sa.sogou') != -1) {
            if(printlog==1){log("优看视频，直接明码解析")}; 
            return unescape(fetch(vipUrl).match(/"url":"([^"]*)"/)[1].replace(/\\u/g, "%u"));
        }else{
            var from = "";
            if(vipUrl.indexOf('-yanaifei.html') != -1){
                from = 'yanaifei';
            }else if(vipUrl.indexOf('.') != -1){
                var host = vipUrl.match(/\.(.*?)\//)[1];
                from = host.split('.')[0];
            }else if(vipUrl.indexOf('-') != -1){
                from = vipUrl.split('-')[0];
            }else{
                from = getMyVar('linecode', 'oth');
            }
            if(from=="qiyi"){from = "iqiyi"}
            
            if(printlog==1){log("片源标识："+from+"，需要解析")}; 
            
            var recordfile = "hiker://files/rules/Src/Juying/parse.json";
            var recordparse=fetch(recordfile);
            if(recordparse!=""){
                eval("var recordlist=" + recordparse+ ";");
            }else{
                var recordlist={};
            }

            var excludeurl = recordlist.excludeurl||[];
            var excludeparse = recordlist.excludeparse||[];
            try {
                var recordparse = recordlist.parse[from];
                var recordname = recordlist.name[from]||"***";
            } catch (e) {
                var recordparse = "";
                var recordname = "***";
            }
            function uniq(array) {
                var temp = []; //一个新的临时数组
                for (var i = 0; i < array.length; i++) {
                    if (temp.indexOf(array[i]) == -1) {
                        temp.push(array[i]);
                    }
                }
                return temp;
            }
            function removeByValue(arr, val) {
                for(var i = 0; i < arr.length; i++) {
                    if(arr[i] == val) {
                    arr.splice(i, 1);
                    break;
                    }
                }
            }
            var Uparselist = [];
            var Nparselist = [];
            var appParses = getMyVar('parse_api', '');
            if(appParses){
                let appParselist = appParses.split(',');
                appParselist = uniq(appParselist);//去重
                for (var i in appParselist) {
                    if(excludeparse.indexOf(appParselist[i])==-1){
                        Uparselist.push({type:'appz',name:'appz'+appParselist.length,parse:appParselist[i]});
                        Nparselist.push('appz'+appParselist.length);
                    }
                }
                if(printlog==1){log("接口自带的解析数："+Uparselist.length)}; 
            }
            //log(Uparselist)
            //读取本地app保存的解析，将可用加入备选
            var appJXfile = "hiker://files/rules/Src/Juying/appjiexi.json";
            var appJX=fetch(appJXfile);
            if(appJX != ""){
                eval("var appJXlist=" + appJX+ ";");
                var apjxnum = 0;
                for(var j=0;j<appJXlist.length;j++){
                    if(appJXlist[j].from.indexOf(from)>-1&&excludeparse.indexOf(appJXlist[j].parse)==-1&&!Uparselist.some(item => item.parse ==appJXlist[j].parse)){
                        Uparselist.push({type:'apps',name:'apps'+appJXlist.length,parse:appJXlist[j].parse});
                        Nparselist.push('apps'+appJXlist.length);
                        var apjxnum = apjxnum + 1;
                    }
                }
                if(printlog==1){log("保存的可用解析数：" + apjxnum)}; 
            }else{
                var appJXlist= [];
            }
            //读取私有增加的解析，将可用加入备选
            var myJXfile = "hiker://files/rules/Src/Juying/myjiexi.json";
            var myJX=fetch(myJXfile);
            if(myJX != ""){
                eval("var myJXlist=" + myJX+ ";");
                var myjxnum = 0;
                for(var j=0;j<myJXlist.length;j++){
                    let priorfrom = myJXlist[j].priorfrom || [];
                    if(priorfrom.indexOf(from)>-1){
                        if(Uparselist.some(item => item.parse ==myJXlist[j].parse)){
                            for(var i=0;i<Uparselist.length;i++){
                                if(Uparselist[i].parse==myJXlist[j].parse){
                                    Uparselist.splice(i,1);
                                    removeByValue(Nparselist,myJXlist[j].name);
                                    break;
                                }
                            }
                        }
                        Uparselist.unshift({type:'myjx',name:myJXlist[j].name,parse:myJXlist[j].parse});
                        Nparselist.unshift(myJXlist[j].name);
                        myjxnum = myjxnum + 1;
                    }else{
                        if(myJXlist[j].stopfrom.indexOf(from)==-1&&excludeparse.indexOf(myJXlist[j].parse)==-1&&!Uparselist.some(item => item.parse ==myJXlist[j].parse)){
                            Uparselist.push({type:'myjx',name:myJXlist[j].name,parse:myJXlist[j].parse});
                            Nparselist.push(myJXlist[j].name);
                            myjxnum = myjxnum + 1;
                        }
                    }
                }
                if(printlog==1){log("私有的可用解析数：" + myjxnum)}; 
            }else{
                var myJXlist= [];
            }
            //log(Uparselist)

            var url = "";//视频地址
            var x5jxlist = []; //x5嗅探接口存放数组
            var urls = [];//多线路地址
            var names = [];//多线路名称
            var headers = [];//多线路头信息
            var dellist = [];//需从本地解析中删除列表
            var appJXchange = 0;//app解析是否有发现新的或增加可解片源
            var myJXchange = 0;//私有解析是否排除片源

            //断插线程代码
            var dnaytmParse = function(vipUrl) {
                eval("var config =" + fetch("hiker://files/cache/MyParseSet.json"));
                eval(fetch(config.cj));
                var url = aytmParse(vipUrl);
                return {url: url, ulist: {type:"dn",name:'dn',parse:'dn',x5:0}}; 
            }

            //明码解析线程代码
            var task = function(obj) {
                var getjson = JSON.parse(request(obj.ulist.parse+obj.vipUrl,{withStatusCode:true,timeout:5000}));
                if (getjson.body&&getjson.statusCode==200){
                    var gethtml = getjson.body;
                    var rurl = "";
                    try {
                        rurl = JSON.parse(gethtml).url||JSON.parse(gethtml).data||JSON.parse(gethtml).data.url;
                    } catch (e) {
                        if(/\.m3u8|\.mp4/.test(getjson.url)&&getjson.url.indexOf('=http')==-1){
                            rurl = getjson.url;
                        }else if(/\.m3u8|\.mp4|\.flv/.test(gethtml)){
                            try {
                                if(gethtml.indexOf('urls = "') != -1){
                                    rurl = gethtml.match(/urls = "(.*?)"/)[1];
                                }else if(gethtml.indexOf('"url":"') != -1){
                                    rurl = gethtml.match(/"url":"(.*?)"/)[1];
                                }else if(gethtml.indexOf('id="video" src="') != -1){
                                    rurl = gethtml.match(/id="video" src="(.*?)"/)[1];
                                }else if(gethtml.indexOf('url: "') != -1){
                                    rurl = gethtml.match(/url: "(.*?)"/)[1];
                                }else{
                                    //if(printlog==1){log('将日志提交给作者，帮助完善解析逻辑>>>'+gethtml)};
                                }
                            } catch (e) {
                                if(printlog==1){log('明码获取错误：'+e.message)};
                            }
                        }
                    }
                    var x5 = 0;
                    if(rurl == ""){
                        if(!/404 /.test(gethtml)){
                            if(x5jxlist.length<=5){
                                x5jxlist.push(obj.ulist.parse);
                            }
                            x5 = 1;
                        }
                    }else{
                        function testurl(url,name){
                            try {
                                if (/\.m3u8/.test(url)) {
                                    var urlcode = JSON.parse(fetch(url,{withStatusCode:true,timeout:2000}));
                                    if(urlcode.statusCode!=200){
                                        log(name+'>播放地址疑似失效或网络无法访问，不信去验证一下>'+url);
                                        return 0;
                                    }else{
                                        var tstime = urlcode.body.match(/#EXT-X-TARGETDURATION:(.*?)\n/)[1];
                                        var urltss = urlcode.body.replace(/#.*?\n/g,'').replace('#EXT-X-ENDLIST','').split('\n');
                                        if(parseInt(tstime)*parseInt(urltss.length)<300){
                                            log(name+'>播放地址疑似跳舞小姐姐或防盗小视频，不信去验证一下>'+url);
                                            return 0;
                                        }else{
                                            var urlts = urltss[0];
                                            if(!/^http/.test(urlts)){
                                                let http = urlcode.url.match(/http.*\//)[0];//.match(/http(s)?:\/\/.*?\//)[0];
                                                urlts = http + urlts;
                                            }    
                                            var tscode = JSON.parse(fetch(urlts,{onlyHeaders:true,timeout:1000}));
                                            if(tscode.statusCode!=200){
                                                log(name+'>ts段地址疑似失效或网络无法访问，不信去验证一下>'+url+'\nts>'+urlts);
                                                return 0;
                                            }
                                        }
                                    }
                                    //log('test>播放地址连接正常');
                                }else if (/\.mp4/.test(url)) {
                                    var urlheader = JSON.parse(fetch(url,{onlyHeaders:true,timeout:2000}));
                                    if(urlheader.statusCode!=200){
                                        log(name+'>播放地址疑似失效或网络无法访问，不信去验证一下>'+url);
                                        return 0;
                                    }else{
                                        var filelength = urlheader.headers['content-length'];
                                        if(parseInt(filelength[0])/1024/1024 < 80){
                                            log(name+'>播放地址疑似跳舞小姐姐或防盗小视频，不信去验证一下>'+url);
                                            return 0;
                                        }
                                    }
                                }
                                return 1;
                            } catch (e) {
                                log(name+'>错误：探测超时未拦截，有可能是失败的')
                                return 1;
                            }
                        }
                        if(testurl(rurl,obj.ulist.name)==0){
                            rurl = "";
                        }
                    }
                    obj.ulist['x5'] = x5;
                    return {url: rurl,ulist: obj.ulist}; 
                }else{
                    obj.ulist['x5'] = 0;
                    return {url: "",ulist: obj.ulist}; 
                }
            };

            if(recordparse&&forcedn==0&&mulnum<=1){
                //优先上次成功的
                url = task({ulist:{parse:recordparse, name:recordname}, vipUrl:vipUrl}).url;
                
                if(contain.test(url)&&!exclude.test(url)&&excludeurl.indexOf(url)==-1){
                    if(printlog==1){log("优先上次解析("+recordname+")成功>"+url)}; 
                }else{
                    if(printlog==1){log("优先上次解析("+recordname+")失败，无效视频地址")}; 
                    url = "";
                    delete recordlist.parse[from];
                    writeFile(recordfile, JSON.stringify(recordlist));
                    //失败的从待解列表中去除
                    for(var i=0;i<Uparselist.length;i++){
                        if(Uparselist[i].parse==recordparse){
                            Uparselist.splice(i,1);
                            removeByValue(Nparselist,recordname);
                            break;
                        }
                    }
                        
                    for(var j=0;j<appJXlist.length;j++){
                        if(appJXlist[j].parse == recordparse){
                            //判断本地记录的解析是否已存在
                            if(appJXlist[j].from.length>1){
                                if(printlog==1){log('发现失效解析，自动删除解析片源')};
                                removeByValue(appJXlist[j].from,from);
                                appJXchange = 1;
                            }else{
                                if(printlog==1){log('发现失效解析，自动删除解析')};
                                appJXlist.splice(j,1);
                                j = j-1;
                                appJXchange = 1;
                            }
                        }
                    }
                }
            }
            if(url==""){
                if(forcedn==1){
                    if(printlog==1){log("开启强制断插解析模式")};
                    Uparselist = [{type:'dn'}];
                }else{
                    if(printlog==1){log("待命解析："+Nparselist)};
                    if(isdn==1&&Uparselist.length==0){
                        Uparselist.push({type:'dn'});
                    }
                }
            }
            //log(Uparselist);
            
            for (var i=0;i<Uparselist.length;i++) {
                if(contain.test(url)){break;}
                let UrlList = [];
                var beurls = [];//用于存储多线程返回url
                var beparses = [];//用于存储多线程解析地址
                var beerrors = [];//用于存储多线程是否有错误
                var sccess = 0;//计算成功的结果数
                let p = i+3;
                if(p>Uparselist.length){p=Uparselist.length}
                for(let s=i;s<p;s++){
                    UrlList.push(Uparselist[s]);
                    i=s;
                }
                if(isdn==1&&Uparselist.length>0){
                    UrlList.push({type:'dn'});
                }
                let Urlparses = UrlList.map((list)=>{
                    if(list.type=="dn"){
                        return {func: dnaytmParse, param: vipUrl, id: 'dn'}
                    }else{
                        if (/^\/\//.test(list.parse)) { list.parse = 'https:' + list.parse }
                        return {
                            func: task,
                            param: {
                                ulist: list,
                                vipUrl: vipUrl
                            },
                            id: list.parse
                        }
                    }
                });
                
                be(Urlparses, {
                    func: function(obj, id, error, taskResult) {
                        let beurl = taskResult.url;
                        if(needparse.test(beurl)&&beurl.indexOf('?')==-1){
                            beurl = "";
                        }
                        obj.results.push(beurl);
                        obj.parses.push(taskResult.ulist);
                        obj.errors.push(error);
                        if (contain.test(beurl)&&!exclude.test(beurl)&&excludeurl.indexOf(beurl)==-1) {
                            sccess = sccess + 1;
                            if(sccess>=mulnum){
                                if(printlog==1){log("线程中止，已捕获视频")};
                                return "break";
                            }
                        }else{
                            if(printlog==1&&taskResult.ulist.x5==0){log(taskResult.ulist.name + '>解析失败');}
                        }
                    },
                    param: {
                        results: beurls,
                        parses: beparses,
                        errors: beerrors
                    }
                });
                

                var isrecord = 0;
                for(let k in beparses){
                    var parseurl = beparses[k].parse;
                    if(url==""){url = beurls[k];}
                    if(beerrors[k]==null&&contain.test(url)&&!exclude.test(url)&&excludeurl.indexOf(url)==-1){
                        //记录除断插线程以外最快的，做为下次优先
                        if(beparses[k].type!="dn"){
                            if(printlog==1){log(beparses[k].name+'-解析成功>'+url)};
                            if(isrecord==0){
                                if(printlog==1){log(beparses[k].name+'，记录为片源'+from+'的优先')};
                                recordlist['parse'] = recordlist['parse']||{};
                                recordlist['parse'][from] = parseurl;

                                recordlist['name'] = recordlist['name']||{};
                                recordlist['name'][from] = beparses[k].name;
                                recordlist['from']= recordlist['from']||[];
                                if(recordlist['from'].indexOf(from)==-1){recordlist['from'].push(from)}
                                writeFile(recordfile, JSON.stringify(recordlist));
                                isrecord = 1;
                            }

                            if(!myJXlist.some(item => item.parse ==parseurl)){
                                //解析成功的且不在私有解析中的添加到本地
                                var isaddparse = 1;
                                for(var j=0;j<appJXlist.length;j++){
                                    let appjxurl = appJXlist[j].parse||"";
                                    if(appjxurl == parseurl){
                                        //判断本地记录的解析是否已存在
                                        if(appJXlist[j].from.indexOf(from)==-1){
                                            if(printlog==1){log('发现当前解析可解新片源'+from+'，自动修正')};
                                            appJXlist[j].from[appJXlist[j].from.length] = from;
                                            appJXchange = 1;
                                        }
                                        isaddparse = 0;
                                    }
                                }
                                if(isaddparse==1&&appJXlist.length<=appjiexinum){
                                    let arr  = { "parse" : parseurl, "from" : [from] };
                                    appJXlist.unshift(arr);//新解析放在前面
                                    appJXchange = 1;
                                    if(printlog==1){log('发现新解析，自动保存，当前解析数：' + appJXlist.length)};
                                }
                            }
                        }else{
                            if(printlog==1){log('当前播放地址通过断插解析获得')};
                        }
                        
                        //组一个多线路播放地址备用，log($.type(beurls[k]));
                        if(/^{/.test(beurls[k])){
                            try {
                                let murls = JSON.parse(beurls[k]).urls;
                                let mnames = JSON.parse(beurls[k]).names||[];
                                let mheaders = JSON.parse(beurls[k]).headers;
                                for(var j=0;j<murls.length;j++){
                                    let MulUrl = this.formatMulUrl(murls[j].replace(/;{.*}/,""), urls.length);
                                    urls.push(MulUrl.url);
                                    if(mnames.length>0){
                                        names.push(mnames[j]);
                                    }else{
                                        names.push('线路'+urls.length);
                                    }
                                    headers.push(mheaders[j]);
                                }
                            } catch (e) {
                                log('判断多线路地址对象有错：'+e.message);
                            }
                        }else{
                            let MulUrl = this.formatMulUrl(beurls[k], urls.length);
                            urls.push(MulUrl.url);
                            names.push('线路'+urls.length);
                            headers.push(MulUrl.header);
                        }
                        //if(ismul==0){break;}
                    }else{
                        if((beparses[k].type=="apps"||beparses[k].type=="myjx")&&beparses[k].x5==0){dellist.push(beparses[k])};
                        url = "";
                    }
                }//解析结果循环
            }//解析接口列表循环
            var failedmyjx = [];
            //失败的解析，处理
            for(var p=0;p<dellist.length;p++){
                if(dellist[p].type=="myjx"){
                    failedmyjx.push(dellist[p].name);
                    for(var j=0;j<myJXlist.length;j++){
                        if(dellist[p].parse==myJXlist[j].parse){
                            //解析失败的从私有中排除片源
                            if(myJXlist[j].stopfrom.indexOf(from)==-1){
                                myJXlist[j].stopfrom[myJXlist[j].stopfrom.length] = from;
                                myJXchange = 1;
                            }
                            break;
                        }
                    }
                }
                if(dellist[p].type=="apps"){
                    for(var j=0;j<appJXlist.length;j++){
                        if(dellist[p].parse==appJXlist[j].parse){
                            //解析失败的从app本地删除
                            if(appJXlist[j].from.length>1){
                                if(printlog==1){log('发现失效解析，自动删除解析片源'+from)};
                                removeByValue(appJXlist[j].from,from);
                                appJXchange = 1;
                            }else{
                                if(printlog==1){log('发现失效解析，自动删除解析')};
                                appJXlist.splice(j,1);
                                appJXchange = 1;
                            }
                            break;
                        }
                    }  
                }
            }
            //私有解析有排除片源
            if(myJXchange == 1){writeFile(myJXfile, JSON.stringify(myJXlist))};
            //app有发现或修改解析时保存本地
            if(appJXchange == 1){writeFile(appJXfile, JSON.stringify(appJXlist))};
            //if(printlog==1&&failedmyjx.length>0){log('本次失败的私有解析有：' + failedmyjx)};
            //播放
            if(url!=""){
                if(urls.length>1){
                    if(printlog==1){log('解析完成，进入播放2')};
                    return JSON.stringify({
                        urls: urls,
                        names: names,
                        headers: headers
                    }); 
                }else{
                    if(printlog==1){log('解析完成，进入播放1')};
                    return this.formatUrl(url);
                }
            }else{
                if(printlog==1){
                    log('明码解析失败，转嗅探备用解析');
                    log('进入嗅探解析列表：' + x5jxlist)
                }
                return this.聚嗅(vipUrl, x5jxlist);
            }
        }//需要解析的视频
    },
    //处理多线路播放地址
    formatMulUrl: function (url,i) {
        try {
            if (/mgtv/.test(url)) {
                var header = {'User-Agent': 'Mozilla/5.0','Referer': 'www.mgtv.com'};
            }else if(/bilibili|bilivideo/.test(url)) {
                var header = {'User-Agent': 'Mozilla/5.0','Referer': 'www.bilibili.com'};
            }else if (/wkfile/.test(url)) {
                var header = {'User-Agent': 'Mozilla/5.0','Referer': 'fantuan.tv'};
            }else{
                var header = {'User-Agent': 'Mozilla/5.0'};
            }

            if (getMyVar('SrcM3U8', '1') == "1") {
                var name = 'video'+parseInt(i)+'.m3u8';
                url = cacheM3u8(url, {headers: header, timeout: 2000}, name)+'#pre#';
            }
            return {url:url, header:header};
        } catch (e) {
            if(config.printlog==1){log("√错误："+e.message)};
            return url;
        }   
    },
    //测试视频地址有效性
    testvideourl: function (url) {
        try {
            if (/\.m3u8/.test(url)) {
                var header = this.getheader(url);
                var urlcode = JSON.parse(fetch(url,{header:header,withStatusCode:true,timeout:1000}));
                if(urlcode.statusCode!=200){
                    log('test>播放地址无法连接');
                    return 0;
                }else{
                    var urlts = urlcode.body.replace(/#.*?\n/g,'').split('\n')[0];
                    if(!/^http/.test(urlts)){
                        let http = urlcode.url.match(/http(s)?:\/\/.*?\//)[0];
                        urlts = http + urlts;
                    }    
                    var tscode = JSON.parse(fetch(urlts,{onlyHeaders:true,timeout:1000}));
                    if(tscode.statusCode!=200){
                        log('test>ts段无法连接');
                        return 0;
                    }
                }
                log('test>播放地址连接正常');
            }
            return 1;
        } catch (e) {
            log('test>错误：'+e.message)
            return 1;
        }   
    }
    
}