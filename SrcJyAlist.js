//本代码仅用于个人学习，请勿用于其他作用，下载后请24小时内删除，代码虽然是公开学习的，但请尊重作者，应留下说明
var Alistfile = "hiker://files/rules/Src/Juying/Alist.json";
var AlistData = fetch(Alistfile);
if (AlistData != "") {
  eval("var datalist=" + AlistData + ";");
} else {
  var datalist = [
    {
      "name": "小雅",
      "server": "http://alist.xiaoya.pro"
    },
    {
      "name": "帅鹏",
      "server": "https://hi.shuaipeng.wang"
    }
  ];
}
function gethtml(api,path,password) {
  try{
    path = path || "";
    password = password || "";
    let html = fetch(api, {body: {"path":path,"password":password},method:'POST'});
    return html;
  }catch(e){
    return "";
  }
}
function getlist(data,isdir) {
  try{
    let list = data.filter(item => {
        return isdir ? item.is_dir : /\.mp4|\.avi|\.mkv|\.rmvb|\.flv|\.mov|\.wmv|\.3gp|\.mp3|\.wma|\.wav/.test(item.name);
    })
    return list;
  }catch(e){
    return [];
  }
}

function yiji() {
  let d = [];
  datalist.forEach(item => {
    d.push({
      title: item.name,
      url: $('#noLoading#').lazyRule((item) => {
        storage0.putMyVar('Alistapi', item);
        refreshPage(false);
        return "hiker://empty";
      }, item),
      col_type: 'scroll_button',
    })
  })
  if (datalist.length > 0) {
    let alistapi = storage0.getMyVar('Alistapi', datalist[0]);
    try{
      let json = JSON.parse(gethtml(alistapi.server + "/api/fs/list", "", alistapi.password));
      if(json.code==200){
        let dirlist = getlist(json.data.content,1);
        d = d.concat(arrayAdd(dirlist,1,alistapi));
        
        let filelist = getlist(json.data.content,0);
        d = d.concat(arrayAdd(filelist,0,alistapi));
        /*
        filelist.forEach(item => {
          d.push({
            title: item.name,
            img: item.thumb || "https://cdn.jsdelivr.net/gh/alist-org/logo@main/logo.svg",
            url: $().lazyRule((apiurl,path,password) => {
              require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJyAlist.js');
              let json = JSON.parse(gethtml(apiurl, path, password));
              if(json.code==200){
                return json.data.raw_url;
              }
              return "hiker://empty";
            }, alistapi.server+"/api/fs/get", "/"+item.name, alistapi.password),
            col_type: 'avatar',
          })
        })*/
      }
    }catch(e){ }
  }
  setResult(d);
}
function arrayAdd(list,isdir,alistapi){
  let d = [];
  if(isdir){
    list.forEach(item => {
      d.push({
        title: item.name,
        img: item.thumb || "https://gitcode.net/qq_32394351/dr/-/raw/master/img/文件类型/文件夹.svg",
        url: $("hiker://empty#noRecordHistory##noHistory#").rule((api) => {
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJyAlist.js');
            Alistlist(api);
        },alistapi),
        col_type: 'avatar',
        extra: {
          path: (MY_PARAMS.path||"") + "/" + item.name
        }
      })
    })
  }else{
    list.forEach(item => {
      d.push({
        title: item.name,
        img: item.thumb || "https://cdn.jsdelivr.net/gh/alist-org/logo@main/logo.svg@Referer=",
        url: $().lazyRule((apiurl,path,password) => {
          require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJyAlist.js');
          let json = JSON.parse(gethtml(apiurl, path, password));
          log(json.data.raw_url);
          if(json.code==200){
            return json.data.raw_url;
          }
          return "hiker://empty";
        }, alistapi.server + "/api/fs/get", (MY_PARAMS.path||"") + "/" + item.name, alistapi.password),
        col_type: 'avatar',
      })
    })
  }
  return d;
}
function Alistlist(alistapi){
  let d = [];
  try{
    let json = JSON.parse(gethtml(alistapi.server + "/api/fs/list", MY_PARAMS.path, alistapi.password));
    if(json.code==200){
      let dirlist = getlist(json.data.content,1);
      d = d.concat(arrayAdd(dirlist,1,alistapi));
      
      let filelist = getlist(json.data.content,0);
      d = d.concat(arrayAdd(filelist,0,alistapi));
      /*
      let dirlist = getlist(json.data.content,1);
      dirlist.forEach(item => {
        d.push({
          title: item.name,
          img: item.thumb || "https://gitcode.net/qq_32394351/dr/-/raw/master/img/文件类型/文件夹.svg",
          url: $("hiker://empty#noRecordHistory##noHistory#").rule((api) => {
              require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJyAlist.js');
              Alistlist(api);
          },alistapi),
          col_type: 'avatar',
          extra: {
            path: MY_PARAMS.path+"/"+item.name
          }
        })
      })
      let filelist = getlist(json.data.content,0);
      filelist.forEach(item => {
        d.push({
          title: item.name,
          img: item.thumb || "https://cdn.jsdelivr.net/gh/alist-org/logo@main/logo.svg@Referer=",
          url: $().lazyRule((apiurl,path,password) => {
            require(config.依赖.match(/http(s)?:\/\/.*\//)[0] + 'SrcJyAlist.js');
            let json = JSON.parse(gethtml(apiurl, path, password));
            log(json.data.raw_url);
            if(json.code==200){
              return json.data.raw_url;
            }
            return "hiker://empty";
          }, alistapi.server+"/api/fs/get", MY_PARAMS.path+"/"+item.name, alistapi.password),
          col_type: 'avatar',
        })
      })
      */
    }
  }catch(e){ }
  setResult(d);
}