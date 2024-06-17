(function() {
    var i,x,y,ARRcookies=document.cookie.split(";");

    for (i=0;i<ARRcookies.length;i++)
    {
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x == "customerInfo")
        {
           if(document.cookie.length != 0){
              var name=document.cookie.split("firstName");
               document.fname=name[1];
               var s=document.fname.split(":");
			   document.sname=s[1];
               var s=document.fname.split(",");
               document.sname1=s[0];
               var svalue=document.sname1.replaceAll('"','');
			   var firstname=svalue.replaceAll(':','');
        	   var signNameText="Hi " + firstname;
               //var signNameText1=`<p>${signNameText}</p>`;

               document.getElementsByClassName("signin_username").innerHTML = signNameText; 

    		} 
        }
    }


});

