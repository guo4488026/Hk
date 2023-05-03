
//引入Ali公用文件
require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJyAliPublic.js');

function aliShareUrl(input) {
    let li = input.split('\n');
    let share_id;
    let folder_id;
    let share_pwd
    li.forEach(it => {
        it = it.trim();
        if (it.indexOf("提取码") > -1) {
            share_pwd = it.replace('提取码: ', '');
        }
        if (it.indexOf("https://www.aliyundrive.com") > -1) {
            it = it.replace('https://www.aliyundrive.com/s/', '').replace('链接：', '');
            share_id = it.indexOf('/folder/') > -1 ? it.split('/folder/')[0] : it;
            folder_id = it.indexOf('/folder/') > -1 ? it.split('/folder/')[1] : "root";
        }
    })
    aliShare(share_id, folder_id, share_pwd);
}

function myDiskMenu(islogin){
    let setalitoken = $().lazyRule((alistfile, alistData) => {
        let alistconfig = alistData.config || {};
        let alitoken = alistconfig.alitoken;
        return $(alitoken||"","refresh_token").input((alistfile,alistData,alistconfig)=>{
            alistconfig.alitoken = input;
            alistData.config = alistconfig;
            writeFile(alistfile, JSON.stringify(alistData));
            clearMyVar('getalitoken');
            refreshPage(false);
            return "toast://已设置";
        },alistfile,alistData,alistconfig)
    }, alistfile, alistData)

    let onlogin = [{
        title: userinfo.nick_name,
        url: setalitoken,
        img: userinfo.avatar,
        col_type: 'avatar'
    },{
        col_type: "line"
    }];
    let nologin = [{
        title: "⚡登录获取token⚡",
        url: $("hiker://empty###noRecordHistory##noHistory#").rule(() => {
            let d = [];
            let url = 'https://auth.aliyundrive.com/v2/oauth/authorize?login_type=custom&response_type=code&redirect_uri=https%3A%2F%2Fwww.aliyundrive.com%2Fsign%2Fcallback&client_id=25dzX3vbYqktVxyX&state=%7B%22origin%22%3A%22*%22%7D#/login'
            let js = $.toString(() => {
                const tokenFunction = function () {
                    var token = JSON.parse(localStorage.getItem('token'))
                    if (token && token.user_id) {
                        let alistfile = "hiker://files/rules/Src/Juying/Alist.json";
                        if(fy_bridge_app.fetch(alistfile)){
                            eval("var alistData = " + fy_bridge_app.fetch(alistfile));
                        }else{
                            var alistData = {};
                        }
                        let alistconfig = alistData.config || {};
                        alistconfig.alitoken = token.refresh_token;
                        alistData.config = alistconfig;
                        fy_bridge_app.writeFile(alistfile, JSON.stringify(alistData));
                        localStorage.clear();
                        alert('TOKEN获取成功，返回后刷新页面！');
                        fy_bridge_app.parseLazyRule(`hiker://empty@lazyRule=.js:refreshX5WebView('');`);
                        fy_bridge_app.back();
                        return;
                    } else {
                        token_timer();
                    }
                }
                var token_timer = function () {
                    setTimeout(tokenFunction, 500)
                };
                tokenFunction();
            })
            d.push({
                url: url,
                col_type: 'x5_webview_single',
                desc: '100%&&float',
                extra: {
                    canBack: true,
                    js: js
                }
            })
            setResult(d);
        }),
        col_type: 'text_center_1'
    },{
        title: "⭐手工填写token⭐",
        url: setalitoken,
        col_type: 'text_center_1'
    }]
    if(islogin){
        return onlogin;
    }else{
        return nologin;
    }
}

evalPrivateJS('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')
function aliDiskSearch(input,data) {
    showLoading('搜索中，请稍后...');
    let datalist = [];
    if(data){
        datalist.push(data);
    }else{
        let filepath = "hiker://files/rules/Src/Juying/yundisk.json";
        let datafile = fetch(filepath);
        if(datafile != ""){
            try{
                eval("datalist=" + datafile+ ";");
            }catch(e){
                datalist = [];
            }
        }
    }
    let diskMark = storage0.getMyVar('diskMark') || {};
    let i = 0;
    let one = "";
    for (var k in diskMark) {
        i++;
        if (i == 1) { one = k }
    }
    if (i > 30) { delete diskMark[one]; }
    let task = function(obj) {
        try{
            eval('let Parse = '+obj.parse)
            let datalist2 = Parse(input) || [];
            let searchlist = [];
            datalist2.forEach(item => {
                let arr = {
                    title: item.title,
                    img: "hiker://files/cache/src/文件夹.svg",
                    col_type: "avatar",
                    extra: {
                        cls: "loadlist",
                        dirname: input
                    }
                };

                let home = "https://www.aliyundrive.com/s/";
                if(obj.name=="我的云盘"){
                    arr.url = $("hiker://empty##").rule((input) => {
                        require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJyAliDisk.js');
                        aliMyDisk(input);
                    },item.url);
                }else if(item.url.includes(home)){
                    arr.url = $("hiker://empty##").rule((input) => {
                        require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJyAliDisk.js');
                        aliShareUrl(input);
                    },item.url);
                } else if (obj.erparse) {
                    arr.url = $("hiker://empty##").lazyRule((url,erparse) => {
                        eval('let Parse = '+erparse)
                        let aurl = Parse(url);
                        if(aurl.indexOf('aliyundrive.com')>-1){
                            return $("hiker://empty##").rule((input) => {
                                require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJyAliDisk.js');
                                aliShareUrl(input);
                            },aurl)
                        }else{
                            return "toast://二解云盘共享链接失败";
                        }
                    },item.url,obj.erparse);
                }
                searchlist.push(arr);
            })
            if(searchlist.length>0){
                hideLoading();
                searchlist.unshift({
                    title: obj.name + " 找到" + searchlist.length + "条 “" + input + "” 相关",
                    url: "hiker://empty",
                    col_type: "text_center_1",
                    extra: {
                        cls: "loadlist"
                    }
                });
                searchlist.unshift({
                    col_type: "line_blank",
                    extra: {
                        cls: "loadlist"
                    }
                });
                diskMark[input] = diskMark[input] || [];
                diskMark[input] = diskMark[input].concat(searchlist);
                addItemBefore('listloading', searchlist);
            }
        }catch(e){
            log(obj.name + '>' + e.message);
        }
        return 1;
    }
    let list = datalist.map((item)=>{
        return {
          func: task,
          param: item,
          id: item.name
        }
    });
    if(list.length>0){
        deleteItemByCls('loadlist');
        putMyVar('diskSearch', '1');
        be(list, {
            func: function(obj, id, error, taskResult) {
            },
            param: {
            }
        });
        storage0.putMyVar('diskMark',diskMark);
        clearMyVar('diskSearch');
        toast('搜索完成');
    }else{
        toast('无接口，无法搜索');
    }
    hideLoading();
}
//evalPrivateJS('iaMHVUwEWdrsrKjTIKI6SNbdnLpzylrLM46nf9cb7Q6dcU82OVS9GKA4DjR3uN9hDpUx/XLclpoqWaOaHmZE0QLz0b+0IiXMGZ16e9cYCtft4Sg2x5XxXwpBh7+FQelKkGNG9HqWS9GqNHHK8RrGWaGEGU/kZDyK252E2qq6EMnvlLAW+gei+S23Bvp1EtOv1Rd9SRRyIPQ24Q7nhGLfca6TBA7Bd9unxl7V9LPGZXTf1OUgbeCIyIqSgFIhzj7GhYVh+hPqDv3U3z6QPdShT7YtbBiBZuZtcMjlWjOOpv3F+5oaqkQcjCD8ysZMB8mUZMlH3p/FtAl00aBTGVbOPAwy6YQkfdYAAa8DFlZVW+8jtdd7MuYXQY4MCfWeMijYQInlr16+axzk8J2hJ3Zjvwb2zF7tyPCigJtBAdRtJE7qXq0wo2ix9twq+UE3qECRTv5GI5BnRKT6Wsfs6u+3agb2zF7tyPCigJtBAdRtJE5CbqVbfQfzSjVM+diJgRfttEy42p3x8tBnEcaZn/3d7ZBizo0rogop0HoK0uTIAYOnUVImIO8XdEX/7sP3yvlI7rQXUyxcMPFxL1lWnBm57VEpqmMuZ7S8hNVUvC3IEREREPD2OLvmUyJwGxZz4QH3Xxf0xHv7+6u9oJMulheQJFcRfVRD712IIeHuGBAMWNW5DhUz6YODYx2OHtHeRAwqdouaTJLcZL4ceg8njJpNP8z4DsnBkZOue3lUeBFiaXcizjFz+7m1/ugMT6dREk0ZJIjHLq7YDcb73HcsYbLe7ZdBuew9fJP/slkbZBH2havvYdR5wCpZ1CSEdrRWEOZal65THzdx7W7M13/eOSNN6D12o7y0j2+beXOERxYmMP8IYdXuc6ddZz+SYWPRJlxOhfzAIkEKtS3vD564Y+AMyG78WqNEjWPNtT/prhSClcj9e/S81aqg4wR/eJ6cZ44KPIteADxu9OYoap2z3F1CzZI1FCZKV2v/1xbWsTELfAzbytlHYaQf/DqUeRZX8XUnyyvLSNZWc/sIn/vWSAHU9tCTRTD31LYxvYjkXAEC/cnvr7MFiu7pttAcbBwnglkHYl6TcYdNEdrZroMs/SLnrcsry0jWVnP7CJ/71kgB1PZTVSXNtEv0E2kRDHSb6FNroS2mn4wZozYSDOSp2CYj1yDTwvDzcdjaHu1EuMpU6K1bVXbqiKUVjJcVn6/sQcTwEhhSuN+ILPloBnDVUoQ42/Pi3W0q6ePwsWpx6F99OiTLK8tI1lZz+wif+9ZIAdT2VmnXdgwucr9kIwKj/xtucgRx11zQfiktu7GjP+4DRLbT/drCgPUivvzR7Kn9dwjrw6pTXQiq0GoxcsuwOu8RMMM5E64qOIwER+mcE16UZR9T4L8NC8D28R76ZutdLWT5569xYGKzteh09J5cT8AAuDu9CQzhNodTDCFP3Fw0ipabZvg/E3zVYxCdv5nUFvpfp5c6JpSwcYoFpMEClPXLkMT5ffMT3Si5f0cIjHtcg7cwtIl6aXbbcIo9On+qH44Am28BG/gSt/sL0h8oyLWkidesbEQ89RDmLEHz81WEbWH01fifZsGMWcv7fswP4ZaEyyvLSNZWc/sIn/vWSAHU9vr/1sFue//aReSiWkmI21ry+jNhOruDPommM+dsXpkSJzcUT7WvwsBKQOGXnzU+nIdKIcj/PgsiCSliivWbkK/J/aiQ1hy/j1GMP6bbg5sFyyvLSNZWc/sIn/vWSAHU9vBacAXsikESBKTFkD5E2cOMz+igrC4hXDyfmNzbXeOhXphtqqTc+10k3mcGOxV62wJ5Y2u0Dr8ubP7TepNYBgUdlpeXv1SA0g5ALiB6N6nPKkvuB+76qtv3vYJO2CegA1rQqlhDBaljhbOmTdJpNMzLK8tI1lZz+wif+9ZIAdT2/Q46e2kXnwX4XTdlr3m1l1R623I4/9dZz/P8NNduMa8rodNPSeZzQY5cLffv9znlPO9y5cgSuCvUP8+6AWaE5a3pJaQWoRIZB/If5G50Ip9uWwG+fOIcM0qCR7I0YpCj0ndhEI7TcSgNLX4QaHCa73qBfyDxkpYNq1XQebrMXZiNUqWQEAooMKJmkOcoJQKu414toMgDK54sEKIOChqwVPV9ikWsSLa8p4jS73xRx8MrZ55jIKzqtE4zOHu616GzyyvLSNZWc/sIn/vWSAHU9p/6lqQN5XID+I4NkynsOmTOlDL7DvzzsOQnK+/bCc4n4XxIl0eFVqFJjGZEH5Y5+IYwBA6Rw9m2FMNe9qZOzO4FEKKCb2KwmzgGwvTajSbXRDebG/nMh7MwIdVvLgaN3DGzgeVVZg0gM3VWaDLrB+D+n7zSVYEXU7WNjIT1XRIPQEOiF0aSfvHUQu1/OEpZ/8sry0jWVnP7CJ/71kgB1Pb4TlFqjJWolULueXMnmqEIlcZ/aB8uVewz4l9ljXx4fMsry0jWVnP7CJ/71kgB1PbXEMIwzOoQzKHaeL/kuaKSQ+MNIMPu4ISikhL1cbvIg8sry0jWVnP7CJ/71kgB1Pas8Zh7t7h2wmDdE3GmIu5krp14rb/lccUIqfUW2hlggHTu0s4oaMe8DtMFf8L1AAfLK8tI1lZz+wif+9ZIAdT2ERo42chXCUP0OmiW79C6RL6tXC0Q0DM+YvPyNFt2aUp0y2ETvPEVFJNP1WnZQKb3zIKx2/LbsLoSzmIK//vuPMsry0jWVnP7CJ/71kgB1PZIaPsnmM8tmc4lxQ8tZW5OBwQ58ufHct4th+qCAeOz6aqsCFX/8GKTNufCifbi+N2SIXlqeW6vjS9BiVrLEUpO/ih7lhea6Jcb5+w6gp6+lXbxoSqyyI8mtdcgadizLczLK8tI1lZz+wif+9ZIAdT2/+JhFOSiVuP9nfFoAbqN0VcHjNSPsoGgIbdyjARuAM7LK8tI1lZz+wif+9ZIAdT2yyNYJ/iZsCtV+VNF9lhNu8sry0jWVnP7CJ/71kgB1Payc+Nrvd2NCQqWg8Zf6kJAyyvLSNZWc/sIn/vWSAHU9iQ+4S7ONZZTrYdiXyPe4Q11NiSk7wPUx5Gy2XqO+COLCEGIet8IZP2LeGjgISuHS5/VbPieTL7YsMtIFMPBgM6iEyOTT8j5Ep2LTz0OCgxvyyvLSNZWc/sIn/vWSAHU9g+WITcTkPmR1TuHGOfHgNzFknhprMlgglIWSouljw0aQXhwVC2p4Oq8vv3UVeTdxOk2P4tbitxsuoAerp41tfmTzotR7aXib0wZB1Xuew1dxdJHVVwkLaotlgdEkDf2xik0mKgZkdoiWrQROKtSNFlFVDGnSoxctrK81bi9MCBs7g3lek62f12thQpLXVobEMN+dX9QTU6ym7w3slRXQcuaOJjypn6sIu5oWKpIdui00kjP/ashxF2CaMRySc3iVt6NlXY6NlkSUThHT44RR8LLK8tI1lZz+wif+9ZIAdT2x0Kqo5RvuNwPjlHiruEJaBQSGHsZbLw3Jwy3Atr/OsD0qj39vmOI0EG87lAQWUiKkfIqBRjreAspfxkF5+h+5taIPbCwWCbLDMRH30sZvoqkezJo9U9vfNst2Qys+yNa7r546BLDRs+VQns29i/KAlKpQyYTf3gFCMUnJushX1PLK8tI1lZz+wif+9ZIAdT2hcCKI9leUCz+THN8NVKc+tD4uq11660H5Xagbt4Ga2LLK8tI1lZz+wif+9ZIAdT2e0S0CP2/dSDJTB0xheGOLssry0jWVnP7CJ/71kgB1PYcQGJm9ej528HgWoPLkgL5nfxH32D1d4+QNDeM1iosDdP92sKA9SK+/NHsqf13COvXpF60+neYkyySAVCLe3I71PP55uD/0Gqjs0ZZYQseN6TKWMui3rekmLT1m7Yzwls873LlyBK4K9Q/z7oBZoTlrKwJ3m31hZIiFeODVYIHp9hvl3ZHtdgMWR6mY9mCA3DLK8tI1lZz+wif+9ZIAdT2e0S0CP2/dSDJTB0xheGOLssry0jWVnP7CJ/71kgB1PYcQGJm9ej528HgWoPLkgL5nfxH32D1d4+QNDeM1iosDdP92sKA9SK+/NHsqf13COvXpF60+neYkyySAVCLe3I7stJwsGrg3ASfp6jU8Zqut6ZAm/WD0V7+YBuBzeR8Hy+Oq4YJnAUsaG8CY/WOlc8NqeE5VKNFWtE+rEbzoc5L5xTsg1QndC4R13RYmG88IZZ2sEgS+i5MDGhrqBRu3iLSikRTXQF+5Suy1Fo8EHtY6X0lcUFKPc4n0g1gigf7XjCMFg2UvN5RWLisW8owRIi1EOqPy9XKVPQ5AnerODf36+EAbnaesxIx1ZNyRHnqc+xwX2gL8m4oX7xoBRyms4n7ADPk3uGxHIgrxq2W76RylE1vv8oRV/XkJC8ge8kQBPoZTlFdnM3WrhFJgRmEoS/CJwMIlxSPWglog50WoVMI7yxE4X7JdoPgPX0nxpyjGDUG89mXnpbQrjj6taQiLuuAmcP1Tnjvk2N2DBJvCoCTRx2xlEl23Cx06UbXnHt67L1Qxqp1FaB5zdg5cO2nux4WxG9LokoZbPStGyJ9LSJm+1Crh+K1CT6Dk874YSLmevLwGN4+H+gHMecQnCLoJnH2H7MNizpSeVYn8n8JMeuKgm48N7n8fnE6T2DtJN5Ko2seFeDHI11zK7+dfstYI1o2z5B/ig8+NUSLQN6H02z+PIyZS39Ssrv055B5KwSY5QFj60aDxSXjoei1OrYjo97e97CRGARp9tGA7G4/vguYVyKi2OJx3pED9IdMDsXwrbph5GeqADvMRpa66kBQfOacyG2H0ZRcCkbyfcCMMsNi3pyH7X/mGLm56ZkwCdJciZDYLI8vZUv4OW+GOx2IQuRlqKq9MN5Jr3T4oYGuU0VUnHl4BsB9jgXzbXEPCQt5MyoAJq58MTSPiTeREPo4xwZtQIFJynwgscHC0KuCkKgC3ZoAI/dNYUKtaxEFWsRf2PuhcrBD9E8ERgqWinnMdHkHWfbz9MvMgjxbO/K+GGYDMkMCNIMXyxya2OHL1TDOWMOuCBPTxAPZQN+P5xfbKtTYr3Qm3gT8Oyf/kiGNl7AzzrP1F4B8x5N7vkZ8oB7p2ZF7ixu5mi4VLWMIE5JmUQFShXwgAqQDJXWlSF6Bn1MEBNcXzZVhY/x61Ro7+5JKraPqz1dD4XZ5BF0ldoMVBkDdrs70cEKfSPbCXrdWeURE9rzgXXY6wjw4iVSBprf61XSK4/4LPcKp7MhKlb9t0a0thdGUf8HJImHQJT3X5Ey0iA==')
evalPrivateJS('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')
