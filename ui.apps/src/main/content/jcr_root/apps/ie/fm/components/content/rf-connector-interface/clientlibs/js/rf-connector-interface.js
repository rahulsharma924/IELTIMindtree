
function getColwidth(){
    let iecol=document.querySelectorAll('.ie-columns')
iecol.forEach(function(item, index){
    let cardthumb=item.querySelectorAll('.card-thumb')
  
    if(cardthumb.length==4){
        let parentel=cardthumb[0].parentNode.parentNode.parentNode.parentNode
     
        parentel.setAttribute('class', 'col-xs-12 col-md-12 col-lg-8  rf-lg-columns ie-columns "')
    
    }
    if(cardthumb.length==3){
        let parentel=cardthumb[0].parentNode.parentNode.parentNode.parentNode
     
        parentel.setAttribute('class', 'col-xs-12 col-md-12 col-lg-4 ie-columns   threeimge-card')
    }
   

})
}
$(document).ready(function(){
    getColwidth();


    $(".datasheet-box").click(function(){
        $("body").find(".open").addClass("d-none-box");
        let sheetdata=$(this).closest(".datasheet-main");
        if(this.href == "" || this.href == undefined){
        $(sheetdata).find(".data-unavailable").removeClass("d-none-box");
        $(sheetdata).find(".data-unavailable").addClass("open");
        }    
      
     });
     $(".closepopup").click(function(){
      
        $(".data-unavailable").addClass("d-none-box");
     });
     $(document).click(function(event) {
        
        if (!$(event.target).closest(".datasheet-box").length) {
          $("body").find(".data-unavailable").addClass("d-none-box");
        }
    });
})

  
