window.jynotify = {
	"top":0,
	"right":0,
	"show":function(type,message,time,callback){
		var obj = this;obj.right=0;
		if(typeof time == 'function'){
			callback = time;
			time = null;
		}
		if(!time){
			time = 2000;
		}
		var win = document.createElement('div');
		win.className = 'jynotify';
		win.innerHTML = '<div class="jynotify_flag"></div>'
					   +'<div class="jynotify_content">'
					   +'<p class="title">成功</p>'
					   +'<p class="content">保存成功</p>'
					   +'</div>'
					   +'<div class="jynotify_operate"></div>';

		if(type === 'success'){
			win.childNodes[0].className = win.childNodes[0].className + ' success';
			win.childNodes[1].childNodes[0].innerHTML = '成功';
		}else if(type === 'alert'){
			win.childNodes[0].className = win.childNodes[0].className + ' alert';
			win.childNodes[1].childNodes[0].innerHTML = '警告';
		}else if(type === 'info'){
			win.childNodes[0].className = win.childNodes[0].className + ' info';
			win.childNodes[1].childNodes[0].innerHTML = '信息';
		}else if(type === 'error'){
			win.childNodes[0].className = win.childNodes[0].className + ' error';
			win.childNodes[1].childNodes[0].innerHTML = '错误';
		}

		win.childNodes[1].childNodes[1].innerHTML = message;

		win.childNodes[2].onclick = function(){
			// var timer = setInterval(function(){
			// 	obj.right += -150;
			// 	win.style.right = obj.right + 'px';

			// 	if(obj.right <= -330){
			// 		document.body.removeChild(win);
			// 		clearInterval(timer);
			// 	}
			// },100);
			document.body.removeChild(win);
			
			if(callback){
				callback();
			}
		}
		setTimeout(function(){
			win.childNodes[2].click();
		},time);

		document.body.appendChild(win);
	},
	"success": function(message,time,callback){
		var _ = this;
		_.show('success',message,time,callback);
	},
	"alert": function(message,time,callback){
		var _ = this;
		_.show('alert',message,time,callback);
	},
	"info": function(message,time,callback){
		var _ = this;
		_.show('info',message,time,callback);
	},
	"error": function(message,time,callback){
		var _ = this;
		_.show('error',message,time,callback);
	},
	"confirm": function(title,message,callback){
		var mask = document.createElement('div');
		mask.className = 'jyconfirmmask';

		var win = document.createElement('div');
		win.className = 'jyconfirm';

		win.innerHTML = ''
					   +'<div class="wrap">'
					   +'<div class="title">'
					   +'<label>删除</label>'
					   +'<i></i>'
					   +'</div>'
					   +'<div class="content">确定要删除吗</div>'
					   +'<div class="operate">'
					   +'<input type="button" class="btn cancel" value="取消" />'
					   +'<input type="button" class="btn sure" value="确认" />'
					   +'</div>'
					   +'</div>'
					   +'';

		var wrap = win.childNodes[0];
		wrap.childNodes[0].childNodes[0].innerHTML = title;
		wrap.childNodes[0].childNodes[1].onclick = function(){
			document.body.removeChild(mask);
			document.body.removeChild(win);
		}
		wrap.childNodes[1].innerHTML = message;
		wrap.childNodes[2].childNodes[0].onclick = function(){
			document.body.removeChild(mask);
			document.body.removeChild(win);
		}
		wrap.childNodes[2].childNodes[1].onclick = function(){
			document.body.removeChild(mask);
			document.body.removeChild(win);
			if(callback){
				callback();
			}
		}

		document.body.appendChild(mask);
		document.body.appendChild(win);
		var height = win.clientHeight;
		var width = win.clientWidth;
		win.style.cssText = 'margin:'+(-height/2) +'px'+' 0 0 '+(-width/2)+'px';
		mask.style.height = document.body.scrollHeight + 'px';
	}
};


