//if user is signed in then display their name

$(document).ready(function(){
    const data = $.fn.cookiesRead().logedInCookiesData();
    if (data && data?.customer) {
        $("#userFirstName").text( `, ${data?.customer?.firstName}`);
    }
    

    const rmaFname = localStorage.getItem("rmaFName");
    if(rmaFname){
        $("#userRMAThankName").html(
            ` ${rmaFname},`
        );
        localStorage.removeItem("rmaFName");
    }else{
        $("#userRMAThankName").html(
            `,`
        );
    }
});

    
