let alistfile = "hiker://files/rules/Src/Juying/Alist.json";
try{
  eval("var alistData=" + fetch(alistfile));
  let jknum = alistData.drives.length;
}catch(e){
  var alistData = {};
}
let datalist = alistData.drives || [];
let alistconfig = alistData.config || {};
let fileFilter = alistconfig['fileFilter']==0?0:1;
let audiovisual = alistconfig.contain?alistconfig.contain.replace(/\./,""):'mp4|avi|mkv|rmvb|flv|mov|ts|mp3|m4a|wma|flac';//影音文件
let contain = new RegExp(audiovisual,"i");//设置可显示的影音文件后缀
let music = new RegExp("mp3|m4a|wma|flac","i");//进入音乐播放器
let image = new RegExp("jpg|png|gif|bmp|ico|svg","i");//进入图片查看
const transcoding = {UHD: "4K 超清",QHD: "2K 超清",FHD: "1080 全高清",HD: "720 高清",SD: "540 标清",LD: "360 流畅"};

function aliSharePlayUrl(share_id,share_pwd,file_id,alitoken){
  try{
    function getNowTime() {
      const yy = new Date().getFullYear()
      const MM = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
      const dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
      const HH = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
      const mm = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      return yy + '' + dd + '' + HH + '' + MM + '' + mm
    }
    share_pwd = share_pwd&&share_pwd.length==4?share_pwd:"";
    let sharetoken = JSON.parse(request('https://api.aliyundrive.com/v2/share_link/get_share_token', { body: { "share_pwd": share_pwd, "share_id": share_id }, method: 'POST', timeout: 3000 })).share_token;
    let headers = {
      'content-type': 'application/json;charset=UTF-8',
      "origin": "https://www.aliyundrive.com",
      "referer": "https://www.aliyundrive.com/",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.41",
      "x-canary": "client=web,app=adrive,version=v3.1.0"
    };
    let nowtime = Date.now();
    let oldtime = parseInt(getMyVar('userinfoChecktime','0').replace('time',''));
    let userinfo;
    let aliuserinfo = storage0.getMyVar('aliuserinfo');
    if (aliuserinfo && aliuserinfo.user_id && nowtime < (oldtime+2*60*60*1000)) {
      userinfo = aliuserinfo;
    } else {
      userinfo = JSON.parse(request('https://auth.aliyundrive.com/v2/account/token', { headers: headers, body: { "refresh_token": alitoken, "grant_type": "refresh_token" }, method: 'POST', timeout: 3000 }));
      storage0.putMyVar('aliuserinfo', userinfo);
      putMyVar('userinfoChecktime', nowtime+'time');
    }
    let authorization = 'Bearer ' + userinfo.access_token;
    let deviceId = userinfo.device_id;
    let userId = userinfo.user_id;
    let signature;
    let public_key;
    let getaliecc = JSON.parse(request('http://124.221.241.174:87/api', { body: 'did=' + deviceId + '&uid=' + userId + '&token=' + md5(getNowTime()), method: 'POST', timeout: 3000 }));
    if (getaliecc.code == 200) {
      signature = getaliecc.sign;
      public_key = getaliecc.key;
    }
    /*
    let a = justTestSign('5dde4e1bdf9e4966b387ba58f4b3fdc3',deviceId,userId);
    signature = a.split('##')[0];
    public_key = a.split('##')[1];
    */
    headers['authorization'] = authorization;
    headers['x-device-id'] = deviceId;
    headers['x-signature'] = signature;
    let data = {
      "deviceName": "Edge浏览器",
      "modelName": "Windows网页版",
      "pubKey": public_key,
    }
    let aliyunUrl = [];
    if (signature && public_key) {
      let req = JSON.parse(request("https://api.aliyundrive.com/users/v1/users/device/create_session", { headers: headers, body: data, timeout: 3000 }));
      if (req.success) {
        headers['x-share-token'] = sharetoken;
        headers['fileid'] = userId;
        data = {
          "category": "live_transcoding",
          "file_id": file_id,
          "get_preview_url": true,
          "share_id": share_id,
          "template_id": "",
          "get_subtitle_info": true
        }
        let json = JSON.parse(request('https://api.aliyundrive.com/v2/file/get_share_link_video_preview_play_info', { headers: headers, body: data, method: 'POST', timeout: 3000 }));
        aliyunUrl = json.video_preview_play_info.live_transcoding_task_list;
        aliyunUrl.reverse();
      }
    }
    return aliyunUrl;
  }catch(e){
    log('根据共享链接获取播放地址失败，挂载的阿里分享应有密码>'+e.message);
    return "";
  }
}

function getAliUrl(share_id, share_pwd, file_id, alitoken) {
  try {
    let urls = [];
    let names = [];
    let heads = [];
    let u = startProxyServer($.toString((aliSharePlayUrl,share_id,share_pwd,file_id,alitoken) => {
      function geturl(fileid,line){
        //预加载时会变file_id,所以ts过期更新时还取原来的id
        let playUrlList = aliSharePlayUrl(share_id,share_pwd,fileid,alitoken) || [];
        let aliurl;
        playUrlList.forEach((item) => {
          if(item.template_id == line){
            aliurl = JSON.parse(request(item.url, { headers: { 'Referer': 'https://www.aliyundrive.com/' }, onlyHeaders: true, redirect: false, timeout: 3000 })).headers.location[0];
          }
        })
        //上面是获取阿里的播放地址
        //log("我在代理" + aliurl);
        let home = aliurl.split('media.m3u8')[0];
        let f = fetch(aliurl, { headers: { 'Referer': 'https://www.aliyundrive.com/' }, timeout: 3000}).split("\n");
        let ff = f.map(it => {
            if (it.startsWith("media-")) {
                return "/proxy?url=" + base64Encode(home+it);
            }
            return it;
        }).join("\n");
        //log('ufid-'+fileid);
        writeFile('hiker://files/cache/_fileSelect_'+fileid+'.m3u8',ff);
        return ff;
      }
      let url = base64Decode(MY_PARAMS.url);
      if(url.includes(".ts")){
        let fid = url.split('&f=')[1].split('&')[0];
        //log('sfid-'+fid);
        let f = fetch('hiker://files/cache/_fileSelect_'+fid+'.m3u8').split("\n");
        f.forEach(it => {
          if(it&&it.startsWith('/proxy?url=')){
            let furl = base64Decode(it.replace('/proxy?url=',''));
            if(url.substr(url.indexOf('/media-'),url.indexOf('.ts')) == furl.substr(furl.indexOf('/media-'),furl.indexOf('.ts'))){
              url = furl;
            }
          }
        })
        let expires = url.split('x-oss-expires=')[1].split('&')[0];
        const lasttime = parseInt(expires) - Date.now() / 1000;
        if(lasttime < 40){
          //log('过期更新')
          let line  = url.split('/media')[0];//取之前播放的ts段线路
          line = line.substring(line.lastIndexOf('/')+1);
          let f = geturl(fid,line).split("\n");
          f.forEach(it => {
            if(it&&it.startsWith('/proxy?url=')){
              let furl = base64Decode(it.replace('/proxy?url=',''));
              if(url.substr(url.indexOf('/media-'),url.indexOf('.ts')) == furl.substr(furl.indexOf('/media-'),furl.indexOf('.ts'))){
                url = furl;
              }
            }
          })

        }else{
          //log('未过期')
          //log("代理ts：" + url);
        }
        return JSON.stringify({
              statusCode: 302,
              headers: {
                  "Location": url,
                  'Referer': 'https://www.aliyundrive.com/'
              }
          });
      }else{
        //log('首次更新')
        //let line  = url.split('|')[1];
        let aliurl = JSON.parse(request(url.split('|')[0], { headers: { 'Referer': 'https://www.aliyundrive.com/' }, onlyHeaders: true, redirect: false, timeout: 3000 })).headers.location[0];
        //let ff = geturl(file_id,line);
        //return ff;
        let home = aliurl.split('media.m3u8')[0];
        let f = fetch(aliurl, { headers: { 'Referer': 'https://www.aliyundrive.com/' }, timeout: 3000}).split("\n");
        let ff = f.map(it => {
            if (it.startsWith("media-")) {
                return "/proxy?url=" + base64Encode(home+it);
            }
            return it;
        }).join("\n");
        //log('ufid-'+fileid);
        writeFile('hiker://files/cache/_fileSelect_'+fileid+'.m3u8',ff);
        return ff;
      }
    },aliSharePlayUrl,share_id,share_pwd,file_id,alitoken));

    let playUrlList = aliSharePlayUrl(share_id, share_pwd, file_id, alitoken) || [];
    if(playUrlList.length>0){
      playUrlList.forEach((item) => {
        urls.push(u + "?url=" + base64Encode(item.url+"|"+item.template_id) + "#.m3u8#pre#");
        names.push(transcoding[item.template_id] ? transcoding[item.template_id] : item.template_height);
        heads.push({ 'Referer': 'https://www.aliyundrive.com/' });
      })
      return {
          urls: urls,
          names: names,
          headers: heads
      };
    }else{
      log('未获取阿里播放地址，建议重进软件再试一次')
      return {};
    }
  } catch (e) {
    log('获取共享链接播放地址失败>' + e.message);
    return {};
  }
}