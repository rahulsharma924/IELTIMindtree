$("#signInTextDesk").click(function(){
     	  document.cookie = "returnToPath=;path=/;";
          document.cookie = "returnToPath="+window.location.href+";path=/;";

  });
