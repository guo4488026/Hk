//本代码仅用于个人学习，请勿用于其他作用，下载后请24小时内删除，代码虽然是公开学习的，但请尊重作者，应留下说明
function autoerji(url,html){
    let data = {};
    if(!/http/.test(url)){return data;}
    let html = html||request(url, {headers: {'User-Agent': PC_UA }});
    let urldomian = url.match(/http(s)?:\/\/(.*?)\//)[0];
	let tmplSortfile = "hiker://files/rules/Src/Juying/TmplSort.json";
	let tmplSortfiles = fetch(tmplSortfile);
    if(tmplSortfiles!=""){
		eval("var tmplSort = " + tmplSortfiles+ ";");
	}else{
		var tmplSort = {};
	}
	let sortlist = [];
	if(tmplSort.erji){
		Object.assign(sortlist, tmplSort.erji);
	}
	erjiTmpl = erjiTmpl.map(item => {
		item.sort = 0;
		for(let j=0;j<sortlist.length;j++){
			if(sortlist[j].id==item.id){
				item.sort = sortlist[j].sort;
				break;
			}
		}
		return item;
	})
	//定义排序函数
    function sortData(a, b) {
        if(a.sort!=b.sort){
            return b.sort - a.sort
        }else{
            return a.id - b.id;
        }
    };
	erjiTmpl.sort(sortData)
    let urltmpl = JSON.parse(getMyVar('Tmpl-'+urldomian,'{}'));
    let tmplidex = erjiTmpl.findIndex(it=>it.id===urltmpl.id);
    if(tmplidex>-1) {
        let tmpl = erjiTmpl.splice(tmplidex, 1);
        erjiTmpl.unshift(tmpl[0]);
    }
	let detail = {};
	//线程
	let task = function(obj) {
        //log('【'+obj.id+'】');
		let tabs = pdfa(html, obj.tabs);
		var arts = [];
		tabs.forEach(item => {
			let name = pdfh(item, obj.tab_text?obj.tab_text:'h3||a||span||body&&Text');
			if(name&&!/更多精品/.test(name)){
				arts.push(name);
			}
		});
		let lists = pdfa(html,'body&&'+obj.lists.split(';')[0]);//全线路影片列表
		var conts = [];
		let key = obj.lists.split(';')[1];
		lists.forEach(item=>{
			let list = pdfa(item, key);//单线路影片列表
			let cont = [];
			for (let j = 0; j < list.length; j++) {
				let contname = pdfh(list[j],"a&&Text");
				let conturl = pd(list[j],obj.tab_id?obj.tab_id:'a&&href');
				cont.push(contname+"$"+conturl)
			}
			conts.push(cont.join("#"))
		})
		try{
			var details = obj.desc.split(';');
			var details1 = pdfh(html, details[0]);
			var details2 = "";
			for(let j=1;j<details.length;j++){
				details2 = details2.concat(pdfh(html, details[j]));
			}
			if(details1&&!detail.details1){detail.details1 = details1;}
			if(details2&&!detail.details2){detail.details2 = details2;}
		}catch(e){
			var details1 = "";
			var details2 = "";
		}
		try{
			var pic = pdfh(html, obj.img).replace(/http.*\/tu\.php\?tu=|\/img\.php\?url=| |\/tu\.php\?tu=/g,'');
			if(!/^http/.test(pic)&&pic){
				pic = urldomian + pic;
			}
			if(pic&&!detail.pic){detail.pic = pic;}
		}catch(e){
			var pic = "";
		}
		try{
			var desc = obj.content?pdfh(html,obj.content):"";
			if(desc&&!detail.desc){detail.desc = desc;}
		}catch(e){
			var desc = "";
		}
        return {details1:details1,details2:details2,pic:pic,desc:desc,arts:arts,conts:conts};
    };
	let setid = 0;
    for(let i in erjiTmpl){
		if(setid > 0){
			break;
		}
        let p = i+10;
        if(p>erjiTmpl.length){p=erjiTmpl.length}
        let TmplList = [];
        for(let s=i;s<p;s++){
            TmplList.push(erjiTmpl[s]);
            i=s;
        }
		let Tmpls = TmplList.map((item)=>{
			return {
				func: task,
				param: item,
				id: item.id
			}
        });
		let t = {};
		be(Tmpls, {
            func: function(obj, id, error, taskResult) {
				if (taskResult.arts.length>0&&taskResult.conts.length>0&&taskResult.conts[0]) {
					setid = id;
					data = taskResult;
					o = obj;
					return "break";
				}
            },
            param: {
				o: t,
            }
        });
        if(setid>0&&data.arts.length>0&&data.conts.length>0){
			putMyVar('Tmpl-'+urldomian,JSON.stringify(t));
			let sortidex = sortlist.findIndex(it=>it.id===setid);
			if(sortidex>-1) {
				sortlist[sortidex].sort++;
			}else{
				sortlist.push({id:setid,sort:1});
			}
			if(data.arts.length>data.conts.length){
				data.arts.splice(data.conts.length-1,data.arts.length-data.conts.length);
			}
			data.details1 = data.details1||detail.details1||"";
			data.details2 = data.details2||detail.details2||"模板未匹配到信息";
			data.pic = data.pic||detail.pic||"";
			data.desc = data.desc||detail.desc||"";
		}else{
			data = {};
		}
    }
	if(data.conts){
		return data;
	}else{
		return aierji(html,url,detail);
	}
}
//AI二级
function aierji(html,url,detail){
	var d = [];
	let alist = pdfa(html, "body&&a");
	let arr = alist.map(it => {
		return {
			//html: it,
			text: pdfh(it, "a&&Text").replace(/new|最新|新/g,''),
			title: pdfh(it, "a&&title"),
			href: pd(it, "a&&href", url)
		}
	});
	//log(arr);
	let debug = false;

	function clearText(it) {
		return it.replace(/第|集|章|-|期/g, "");
	}

	function isMovie(it) {
		if (it == null || it.text == null) {
			return false;
		}
		let tit = it.title || "";
		it = it.text || "";
		if (it == "" || it.length > 8) {
			return false;
		}
		//排除
		let reg = /\.|高清直播|写真推荐/;
		if (tit != "" && !tit.includes(it) || reg.test(it)) {
			return false;
		}
		return it.match(/原画|备用|蓝光|超清|国语|粤语|英语|高清|正片|韩版|4K|4k|1080P|720P|TC|HD|BD/)
	}

	function notChapter(it) {
		if (it == null || it.text == null) {
			return true;
		}
		return it.text.match(/[0-9]\.[0-9]分/);
	}

	function isChapter(it, pre, next) {
		if (notChapter(it)) {
			//优先排除
			return false;
		}
		//判断是不是电影
		if (isMovie(it)) {
			return true;
		}
		return isChapter0(it, pre) || isChapter0(it, next);
	}

	function getChapterNum(it) {
		if (it == null || it.text == null) {
			return -1;
		}
		it = it.text || "";
		if (it == "") {
			return -1;
		}
		it = clearText(it);
		let reg = /^[0-9]*$/;
		if (!reg.test(it)) {
			return -1;
		}
		it = parseInt(it);
		if (isNaN(it)) {
			return -1;
		}
		return it;
	}

	function isChapter0(it, brother) {
		/*if (debug) {
			log({
				it: it,
				brother: brother
			});
		}*/
		it = getChapterNum(it);
		//if (debug) log(it);
		if (it < 0) {
			return false;
		}
		brother = getChapterNum(brother);
		//if (debug) log(brother);
		if (brother < 0) {
			return false;
		}
		return it - brother < 2 && it - brother > -2;
	}

	for (let i = 0; i < arr.length; i++) {
		let it = arr[i];
		let t = it.text;
		if (!it.href || it.href == "" || (it.href==url&&it.href.indexOf('-')==-1) || /voddetail|s\/guoyu|vodshow/.test(it.href)) {
			continue;
		}
		let pre = i == 0 ? null : arr[i - 1];
		let next = i == (arr.length - 1) ? null : arr[i + 1];
		if (isChapter(it, pre, next)) {
			d.push({
				title: t,
				url: it.href,
			});
		}
	}
	//log(d);
	if (d.length == 0&&!/502|403|Unavailable/.test(html)) {
		//匹配失败
		d.push({
			title: "",
			url: url,
			col_type: "x5_webview_single",
			desc: "float&&100%",
			pic_url: "",
			extra: {
				canBack: true
			}
		});
		//toast("AI匹配失败，已使用X5加载");
		setResult(d);
	} else {
		//线路分割
		let arts = ["播放源1"];
		let conts = [];
		let d2 = [];
		for (let i = 0; i < d.length; i++) {
			d2.push(d[i].title+'$'+d[i].url);
			if (i < d.length - 1) {
				let it = d[i];
				let t1 = parseInt(clearText(it.title));
				let next = d[i + 1];
				let t2 = parseInt(clearText(next.title));
				if (t2 - t1 > 1 || t1 - t2 > 1) {
					conts.push(d2.join('#'));
					let s = arts.length+1;
					arts.push("播放源"+s);
					d2 = [];
				}
			}else{
				conts.push(d2.join('#'));
			}
		}
		if(conts.length==0){arts = [];}
		return {details1:detail.details1||"",details2:detail.details2||"选集列表来源于AI识片技术",pic:detail.pic||"",desc:detail.desc||"暂无信息",arts:arts,conts:conts};
	}
	return {};
}

let erjiTmpl = [
	{
    	"id": 1,
		"img": ".lazyload&&data-original",
		"desc": ".data&&Text;.data,6&&Text",
		"content": "p.detail&&Text.js:input.replace(\"简介：\",\"\").replace(\"详情\",\"\")",
		"tabs": ".nav-tabs&&li||a",
		"lists": ".stui-content__playlist;body&&li"
	},
	{
        "id": 2,
		"img": ".lazyload&&data-original",
		"desc": "span.sketch.content&&Text",
		"tabs": ".nav-tabs&&li",
		"lists": ".myui-content__list;body&&li"
	},
	{
        "id": 3,
		"img": ".lazyload&&data-original",
		"desc": ".module-info-item,1&&Text;.module-info-item,2&&Text;.module-info-item,3&&Text",
		"content": ".module-info-introduction-content&&Text",
		"tabs": "body&&.module-tab-item",
		"lists": "body&&.module-play-list;body&&a"
	},
	{
        "id": 4,
		"img": ".myui-content__thumb&&a&&img&&data-original",
		"desc": ".data,2&&Text;.data,3&&Text",
		"content": "#desc&&span.data&&Text",
		"tabs": "ul.nav-tabs&&li",
		"lists": ".tab-content&&#id&&li"
	},
	{
        "id": 5,
		"img": ".lazyload&&data-src",
		"desc": ".tag-link&&Text",
		"content": ".video-info-content&&Text",
		"tabs": "body&&.module-tab-item",
		"lists": "body&&.scroll-box-y;body&&a"
	},
	{
        "id": 6,
		"img": ".lazyload&&data-original",
		"desc": "p.data,-1&&Text;p.data,-2&&Text",
		"content": "body&&.stui-pannel_bd:not(:has(a)):has(.col-pd)&&Text",
		"tabs": "body&&.bottom-line:has(span)",
		"lists": "body&&.stui-content__playlist;body&&li"
	},
	{
        "id": 7,
		"img": ".lazyload&&data-original",
		"desc": "p.data&&Text;.stui-content__detail&&p,-2&&Text",
		"content": ".detail&&Text",
		"tabs": "body&&.stui-vodlist__head:has(span)",
		"lists": ".stui-content__playlist;body&&li"
	},
	{
        "id": 8,
		"img": ".lazyload&&data-original",
		"desc": "p.data&&Text;.stui-content__detail&&p,-2&&Text",
		"content": ".desc&&Text",
		"tabs": "body&&.stui-pannel:has(span.more)",
		"tab_text": ".title&&Text",
		"lists": ".stui-content__playlist;body&&li"
	},
	{
        "id": 9,
		"img": ".fed-lazy&&data-original",
		"desc": ".fed-list-remarks&&Text;.fed-deta-info&&li,-2&&Text;.fed-deta-info&&li,-3&&Text",
		"content": ".fed-tabs-info&&p&&Text",
		"tabs": "body&&.fed-play-btns",
		"lists": ".fed-play-item;body&&ul,1&&li"
	},
	{
        "id": 10,
		"img": ".hl-lazy&&data-original",
		"desc": ".hl-full-box&&li,1&&Text",
		"content": ".hl-full-box&&li,-1&&Text",
		"tabs": ".hl-from-list&&li",
		"lists": "body&&.hl-plays-list;body&&li"
	},
	{
        "id": 11,
		"img": ".lazy&&data-original",
		"desc": ".vodTag&&Text",
		"content": ".ecshow&&Text",
		"tabs": ".play_source_tab&&a",
		"lists": "body&&.content_playlist;body&&a"
	},
	{
        "id": 12,
		"img": ".lazyload&&data-original",
		"desc": ".content_min&&li,1&&Text",
		"content": ".content_min&&li,-1&&Text",
		"tabs": ".play_source_tab&&a",
		"lists": "body&&.content_playlist;body&&li"
	},
	{
        "id": 13,
		"img": ".lazy&&data-original",
		"desc": ".mv-showr&&p,2&&Text;.mv-showr&&p,3&&Text",
		"content": ".des&&Text",
		"tabs": ".layui-tab-brief,1&&.layui-tab-title&&li",
		"lists": ".layui-tab-content,1&&.layui-tab-item:has(a);body&&a"
	},
	{
        "id": 14,
		"img": ".y-part-2by3&&data-original",
		"desc": ".y-part-rows&&li&&Text&&Text;.y-part-rows&&li,1&&Text",
		"tabs": ".nav-tabs&&li",
		"lists": ".episodes-list;body&&li"
	},
	{
        "id": 15,
		"img": ".fed-part-2by3&&data-original",
		"desc": ".fed-deta-content&&.fed-part-rows&&li&&Text",
		"content": ".fed-conv-text&&Text",
		"tabs": ".fed-tabs-foot&&li",
		"lists": ".fed-tabs-btm;body&&li"
	},
	{
        "id": 16,
		"img": ".detail-pic&&img&&src",
		"desc": ".addtime&&Text",
		"content": ".info&&Text",
		"tabs": ".tab_box&&h2",
		"lists": "body&&.video_list;body&&a"
	},
	{
        "id": 17,
		"img": ".cover&&img&&src",
		"desc": ".v_desc&&Text;#intro&&p,0&&Text;#intro&&p,2&&Text;#intro&&p,1&&Text;#intro&&p,3&&Text",
		"content": "#intro&&p,-1&&Text;",
		"tabs": ".tab_control&&li",
		"lists": "#play_list&&.play_list;body&&li"
	},
	{
        "id": 18,
		"img": ".poster&&img&&src",
		"desc": ".detail_imform_kv,0&&Text;.detail_imform_kv,2&&Text;.detail_imform_kv,5&&Text",
		"content": ".detail_imform_desc_pre&&p&&Text",
		"tabs": "#menu0&&li",
		"lists": "#main0&&.movurl;body&&li"
	},
	{
        "id": 19,
		"img": ".lazy&&data-original",
		"desc": ".info-txt&&p,2&&Text;.info-txt&&p,3&&Text;",
		"content": ".brief&&Text",
		"tabs": "body&&.playname",
		"lists": ".playerlist;body&&ul&&a"
	},
	{
        "id": 20,
		"img": ".poster&&a&&style",
		"desc": ".play-tag&&Text",
		"content": ".info-wrap,-1&&Text",
		"tabs": ".swiper-slide",
		"lists": "#playsx;body&&li"
	},
	{
        "id": 21,
		"img": "",
		"desc": "body&&.data&&Text",
		"content": ".stui-player__detail&&p,-1&&Text",
		"tabs": ".tab-top",
		"lists": ".stui-play__list;body&&li"
	},
	{
        "id": 22,
		"img": ".pic&&img&&src",
		"desc": "body&&dd,0&&Text;info&&dd,1&&Text;.info&&dd,2&&Text",
		"content": ".desdd&&Text",
		"tabs": ".tab0&&li:not(:matches(^$))",
		"lists": "body&&.plist;body&&a"
	},
	{
        "id": 23,
		"img": ".pic&&img&&src",
		"desc": "body&&dd,0&&Text;info&&dd,1&&Text;.info&&dd,2&&Text",
		"content": ".desdd&&Text",
		"tabs": "#tab11",
		"lists": "body&&.plist;body&&a"
	},
	{
        "id": 24,
		"img": ".dyimg&&img&&src",
		"desc": ".data,0&&Text",
		"content": "#desc&&.stui-content__desc&&Text",
		"tabs": "#bofy&&.t-ul&&li",
		"lists": ".stui-content__playlist;body&&li"
	},
	{
        "id": 25,
		"img": ".lazyload&&data-original",
		"desc": ".fed-deta-content&&.fed-part-rows&&Text",
		"content": ".fed-tabs-info&&p&&Text",
		"tabs": ".fed-tabs-boxs&&.fed-part-rows&&li",
		"lists": ".fed-play-item;body&&ul,1&&li"
	},
	{
        "id": 26,
		"img": ".lazyload&&data-original",
		"desc": ".play-ail&&p,-2&&Text",
		"content": ".detail-intro-txt&&Text",
		"tabs": "#playTab&&li",
		"lists": ".playlist&&ul;body&&li"
	},
	{
        "id": 27,
		"img": ".v-pic&&img&&src",
		"desc": ".txt_list&&li,2&&Text;.txt_list&&li,3&&Text;.txt_list&&li,4&&Text",
		"content": ".infor_intro&&Text",
		"tabs": ".play_source_tab&&a",
		"lists": "body&&.play_num_list;body&&li"
	},
	{
        "id": 28,
		"img": ".dyimg&&img&&src",
		"desc": ".moviedteail_list&&Text",
		"content": "body&&.yp_context&&Text",
		"tabs": ".mi_paly_box&&.ypxingq_t",
		"lists": ".paly_list_btn;body&&a"
	},
	{
        "id": 29,
		"img": ".lazyload&&data-original",
		"desc": ".myui-content__detail&&.data&&Text",
		"content": "#rating&&Text",
		"tabs": "body&&.myui-panel__head&&h3",
		"tab_text": ".title&&Text",
		"lists": "#playlist1&&li;body&&a"
	},
	{
        "id": 30,
		"img": ".m_background&&style",
		"desc": ".v_info_box&&p&&Text",
		"content": ".p_txt&&Text",
		"tabs": ".from_list&&li",
		"lists": "#play_link&&li;body&&a"
	},
	{
        "id": 31,
		"img": ".lazy&&src",
		"desc": ".detail_top&&li,2&&Text;.detail_top&&li,,3&&Text;.detail_top&&li,4&&Text",
		"content": ".li_intro&&Text",
		"tabs": ".play_source_tab&&a",
		"lists": "body&&.player_list;body&&li"
	},
	{
        "id": 32,
		"img": "#book-cont&&img&&src",
		"desc": "#book-cont&&.r&&Text",
		"content": "#wrap&&Text",
		"tabs": "#zhankai&&.arconix-toggle-title",
		"lists": "#zhankai&&.arconix-toggle-content;body&&li"
	},
	{
        "id": 33,
		"img": "#imglazy&&src",
		"desc": ".info,0&&Text;.info,1&&Text;.info,2&&Text;.starring&&Text",
		"content": ".animeplot&&Text",
		"tabs": "#two1",
		"lists": ".playlist;body&&.list-title"
	},
	{
        "id": 34,
		"img": ".lazyload&&data-original||src",
		"desc": ".module-info-item,3&&Text;.module-info-item,1&&Text;.module-info-item,4&&Text",
		"content": ".module-info-item,5||.module-info-item&&Text",
		"tabs": "#two1",
		"lists": ".playlist;body&&.list-title"
	}
]
