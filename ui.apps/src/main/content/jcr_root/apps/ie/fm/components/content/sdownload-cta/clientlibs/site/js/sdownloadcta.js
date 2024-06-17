function loadclick(){

   var el = document.getElementsByClassName('sdload-loadnone');
	for (var i = 0; i < el.length; i++) {
  		el[i].classList.add('sdownloadcta-loadclick');
	}

    var el2=document.getElementById('sdownload-loadid');
    el2.classList.add('sdownloadcta-removeload');  
}
function loadmore(){
    $('#sdownload-loadmorebtn').addClass('hide-loadmore');
    $('.sdownload-loadmore').each(function(i,element){
        $(element).removeClass('hide-loadmore');
    })
    }
document.querySelector("body").addEventListener(
    'click', 
    function(e) { 
        var anchor = e.target.closest('a');
        var doccat="";
        var docname="";
        var doctype= "";
        var docid= "";
        if(
            anchor !== null && 
            anchor.closest('.analyticsdownload')!=null
        ) {  
          doccat= anchor.textContent.trim() + " - " + pageName
          docid = anchor.textContent.trim()
          docname = anchor.href.split("/").pop()
          doctype= anchor.href.split("/").pop().split(".").pop()  
          parameter=docname + "@@" + doctype + "@@" + "" + "@@" + "" + "@@" + "Software Downloads" + "@@" + "";
          parameterArray = parameter.split("@@"); 
        documentDLCall(parameterArray,"Click",doccat,docid);     
        } 
    }, false);