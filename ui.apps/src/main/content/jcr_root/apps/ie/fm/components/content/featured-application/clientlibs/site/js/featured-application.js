const featureaccordion = document.getElementsByClassName('acc-container-featured');

	for (let i=0; i<featureaccordion.length; i++) {
  		featureaccordion[i].addEventListener('click', function () {
		let symbol= this.className;
        resetall();
		if (symbol !="acc-container-featured active-featured")
        this.classList.toggle('active-featured');
  })
}

function resetall(){

for (let i=0; i<featureaccordion.length; i++) {
	featureaccordion[i].className = "acc-container-featured";


  }
}

