
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
            it = it.replace('https://www.aliyundrive.com/s/', '');
            share_id = it.indexOf('/folder/') > -1 ? it.split('/folder/')[0] : it;
            folder_id = it.indexOf('/folder/') > -1 ? it.split('/folder/')[1] : "root";
        }
    })
    aliShare(share_id, folder_id, share_pwd);
}

function aliShare(share_id, folder_id, share_pwd) {
    let d = [];
    setPageTitle(MY_PARAMS && MY_PARAMS.dirname ? MY_PARAMS.dirname : '云盘共享文件 | 聚影√');
    let headers = {
        'content-type': 'application/json;charset=UTF-8',
        "origin": "https://www.aliyundrive.com",
        "referer": "https://www.aliyundrive.com/",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.41",
        "x-canary": "client=web,app=share,version=v2.3.1"
    };
    try{
        let sharetoken = JSON.parse(request('https://api.aliyundrive.com/v2/share_link/get_share_token', { headers: headers, body: { "share_pwd": share_pwd, "share_id": share_id }, method: 'POST', timeout: 3000 })).share_token;
        let postdata = { "share_id": share_id, "parent_file_id": folder_id || "root", "limit": 200, "image_thumbnail_process": "image/resize,w_256/format,jpeg", "image_url_process": "image/resize,w_1920/format,jpeg/interlace,1", "video_thumbnail_process": "video/snapshot,t_1000,f_jpg,ar_auto,w_256", "order_by": "name", "order_direction": "DESC" };
        headers['x-share-token'] = sharetoken;
        let sharelist = JSON.parse(request('https://api.aliyundrive.com/adrive/v2/file/list_by_share', { headers: headers, body: postdata, method: 'POST' })).items;
        let sublist = sharelist.filter(item => {
            return item.type == "file" && /srt|vtt|ass/.test(item.file_extension);
        })
        
        let dirlist = sharelist.filter((item) => {
            return item.type == "folder";
        })
        dirlist.forEach((item) => {
            d.push({
                title: item.name,
                img: "hiker://files/cache/src/文件夹.svg",//#noRecordHistory##noHistory#
                url: $("hiker://empty##").rule((share_id, folder_id, share_pwd) => {
                    require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJyAliDisk.js');
                    aliShare(share_id, folder_id, share_pwd);
                }, item.share_id, item.file_id, share_pwd),
                col_type: 'avatar',
                extra: {
                    dirname: item.name
                }
            })
        })
        let filelist = sharelist.filter((item) => {
            return item.type == "file";
        })
        filelist.sort(SortList);
        filelist.forEach((item) => {
            if (item.category == "video") {
                let sub_file_id;
                if (sublist.length == 1) {
                    sub_file_id = sublist[0].file_id;
                } else if (sublist.length > 1) {
                    sublist.forEach(it => {
                        if (it.name.substring(0, it.name.lastIndexOf(".")) == item.name.substring(0, item.name.lastIndexOf("."))) {
                            sub_file_id = it.file_id;
                        }
                    })
                }
                d.push({
                    title: item.name,
                    img: item.thumbnail || item.category == "video" ? "hiker://files/cache/src/影片.svg" : item.category == "audio" ? "hiker://files/cache/src/音乐.svg" : item.category == "image" ? "hiker://files/cache/src/图片.png" : "https://img.alicdn.com/imgextra/i1/O1CN01mhaPJ21R0UC8s9oik_!!6000000002049-2-tps-80-80.png",
                    url: $("hiker://empty##").lazyRule((share_id, file_id, sub_file_id, share_pwd) => {
                        require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJyAliPublic.js');
                        let alitoken = alistconfig.alitoken;
                        let play = getAliUrl(share_id, file_id, alitoken, share_pwd);
                        if (play.urls) {
                            let subtitle;
                            if (sub_file_id) {
                                subtitle = getSubtitle(share_id, sub_file_id, share_pwd);
                            }
                            if (subtitle) {
                                play['subtitle'] = subtitle;
                            }
                            return JSON.stringify(play);
                        }
                    }, item.share_id, item.file_id, sub_file_id, share_pwd),
                    col_type: 'avatar',
                    extra: {
                        id: item.file_id
                    }
                })
            }
        })
    }catch(e){
        d.push({
            title: '来晚啦，该分享已失效',
            url: 'hiker://empty##',
            col_type: "text_center_1"
        })
        toast('来晚啦，该分享已失效.');
    }
    setResult(d);
}

function aliShareSearch(input) {
    deleteItemByCls('loadlist');

    let datalist = [{ id: '小纸条', parse: function (input) {let list = JSON.parse(request('https://gitcafe.net/tool/alipaper/', { body: "action=search&keyword=" + input, method: 'POST', timeout: 5000 }));
    let data = list.map(item => {
        return {
            id: '小纸条',
            title: item.title,
            key: item.key
        }
    })
    return data;}},{ id: '大纸条', parse: function (input) {let list = JSON.parse(request('https://gitcafe.net/tool/alipaper/', { body: "action=search&keyword=" + input, method: 'POST', timeout: 5000 }));
    let data = list.map(item => {
        return {
            id: '大纸条',
            title: item.title,
            key: item.key
        }
    })
    return data;}}];
    
    let task = function(obj) {
        try{
            let datalist = obj.parse(input) || [];
            let searchlist = datalist.map(item => {
                return {
                    title: item.title + ' - ' + item.id,
                    url: $("hiker://empty##fypage#noRecordHistory##noHistory#").rule((input) => {
                        require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJyAliDisk.js');
                        aliShare(input, 'root', '');
                    },item.key),
                    col_type: "text_1",
                    extra: {
                        cls: "loadlist"
                    }
                };
            })
            addItemBefore('listloading', searchlist);
        }catch(e){
          
        }
        return 1;
    }
    let list = datalist.map((item)=>{
        return {
          func: task,
          param: item,
          id: item.id
        }
    });
    if(list.length>0){
        be(list, {
            func: function(obj, id, error, taskResult) {
            },
            param: {
            }
        });
    }
    
}
