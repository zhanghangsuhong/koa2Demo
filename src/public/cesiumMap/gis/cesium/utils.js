if (typeof BX == "undefined") { var BX = {}; }
function getPortalServerFromLocation(){
    var server = window.location.host;
    return server;
  }
function getPath() {
	    var fullPath, path;

	    fullPath = window.location.pathname;
	    if (fullPath === '/' || fullPath.substr(fullPath.length - 1) === '/') {
	      path = fullPath;
	    }else{
	      var sections = fullPath.split('/');
	      var lastSection = sections.pop();
	      if (/\.html$/.test(lastSection) || /\.aspx$/.test(lastSection) ||
	         /\.jsp$/.test(lastSection) || /\.php$/.test(lastSection) || /\.do$/.test(lastSection) || /\.htm$/.test(lastSection)) {
	        //index.html may be renamed to index.jsp, etc.
	        path = sections.join('/') + '/';
	      } else {
	        return false;
	      }
	    }
	    return path;
	  }

function getServerPath() {
    //获取当前网址，如： http://localhost/GGFW/
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址
    var localhostPaht = curWwwPath.substring(0, pos);
    localhostPaht = localhostPaht.replace('http://','');
    //获取带"/"的项目名
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    if (projectName == "")
        projectName = pathName;
    return (localhostPaht + projectName + "/");
}
/**
 * js获取项目根路径，如： http://localhost/GGFW/
*/
function getRootPath() {
    //获取当前网址，如： http://localhost/GGFW/
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址
    var localhostPaht = curWwwPath.substring(0, pos);
    //获取带"/"的项目名
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    if (projectName == "")
        projectName = pathName;
    return (localhostPaht + projectName + "/");
}
/*提示对话框信息-----------------------------------------------------------------------------------------------------------------开始*/
/**
 * 提示对话框信息,自动关闭
*/
function promptdialog(title,content) {
    var dialog = jDialog.dialog({
        title: title,
        modal: true,         // 非模态，即不显示遮罩层
        autoClose: 1500,
        content: content
    });
    return dialog;
}