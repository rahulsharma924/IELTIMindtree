setInterval(function(){
	const Time=new Date();
	
	let Hours=Time.getHours();
	let Minutes=Time.getMinutes();
	//let Seconds=Time.getSeconds();
	
	
	let date=Time.getDate();
	let Month=Time.getMonth();
	let Day=Time.getDay();
	

	function zeroPad(number) {
	let num= number.toString();
	while (num.length < 2) {
	num = "0" + num;
	}
	return `${num}`;
	}
	
	
	function validate_countdown(){
		if(Minutes!=0){
		return `${zeroPad(Hrs=17-Hours)} Hours and ${zeroPad(Mins=60-Minutes)} Minutes`; 

        }else if(Minutes==0){
		return `${zeroPad(Hrs=18-Hours)} Hours and ${zeroPad(Mins=60-60)} Minutes`;


        }else if(Hours < 18 && Minutes==0){
		return `${zeroPad(Hrs=18-Hours)} Hours and ${zeroPad(Mins=60-60)} Minutes`;
			
		}else if(Hours==18){
		return`${zeroPad(Hrs=18-Hours)} Hours and ${zeroPad(Mins=60-60)} Minutes`;

		}else{
		return `${zeroPad(Hrs=17-Hours)} Hours and ${zeroPad(Mins=(Minutes-60)*-1)} Minutes`;
		}
	}

	
  	if(Hours ==6 && Minutes==0){
		document.getElementById("test").innerHTML=`${validate_countdown()}`;
	   }else if(Hours > 6 && Hours < 18){
		 document.getElementById("test").innerHTML=`${validate_countdown()}`;
	   }else{
		document.getElementById("test").innerHTML="00 Hours and 00 Minutes";
	   }
	   
	   },070);
