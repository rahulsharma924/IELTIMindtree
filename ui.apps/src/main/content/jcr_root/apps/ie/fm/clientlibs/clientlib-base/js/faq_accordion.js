$(document).ready(function() {
// setTimeout(faqAccordion, 2000);
   function faqAccordion(){
      $('#tool_resources_faq .cmp-accordion__icon').each(function() {
        $(this).addClass('cmp-accordion__icon1').removeClass('cmp-accordion__icon');              
      });
      $('#tool_resources_faq .cmp-accordion__header').each(function(index) {
        $(this).click(function(){            
          let opemItem = false;           
          let accordionSection = $(this).find('.cmp-accordion__button');
          if(accordionSection.hasClass('questionOpend')){
              opemItem = true;
          }
          $('.cmp-accordion__panel').addClass('cmp-accordion__panel--hidden').removeClass('cmp-accordion__panel--expanded');
          $('.cmp-accordion__button').removeClass('cmp-accordion__button--expanded').removeClass('questionOpend');
          if(!opemItem){            
            $(this).closest('.cmp-accordion__item').find('.cmp-accordion__panel').addClass('cmp-accordion__panel--expanded').removeClass('cmp-accordion__panel--hidden');  
            $(this).find('.cmp-accordion__button').addClass('cmp-accordion__button--expanded').addClass('questionOpend');
          }
        });
        $(this).addClass('cmp-accordion__icon1').removeClass('cmp-accordion__icon');              
      });
       $('#tool_resources_faq .cmp-accordion__title').addClass('textbold');
    }
    faqAccordion();
});

