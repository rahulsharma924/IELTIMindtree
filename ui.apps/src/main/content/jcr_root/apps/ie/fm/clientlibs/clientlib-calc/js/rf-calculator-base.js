var labelDataCalc;
$(document).ready(function () {
  window.getAPIModule
    .getCalUtility()
    .done(function (response) {   
          labelDataCalc = response ? response[0] : [];   
        $(document).ready(function(){
          if($('.convertedpower-cls').length > 0)
          {    
              $('.convertedpower-cls').html(labelDataCalc.labels.ConvertedPower);
          }
          if($('.convertedratio-cls').length > 0)
          {    
              $('.convertedratio-cls').html(labelDataCalc.labels.ConvertedRatio);
          }
          if($('.convertedtemp-cls').length > 0)
          {    
              $('.convertedtemp-cls').html(labelDataCalc.labels.ConvertedTemp);
          }   
          if($('.convertedtorque-cls').length > 0)
          {    
              $('.convertedtorque-cls').html(labelDataCalc.labels.ConvertedTorque);
          }  
          if($('.convertedtorquerange-cls').length > 0)
          {    
              $('.convertedtorquerange-cls').html(labelDataCalc.labels.ConvertedTorqueRange);
          }    
          if($('.Convertedlength-cls').length > 0)
          {    
              $('.Convertedlength-cls').html(labelDataCalc.labels.ConvertedLength);
          } 
          if($('.Convertedmass-cls').length > 0)
          {    
              $('.Convertedmass-cls').html(labelDataCalc.labels.ConvertedWMass);
          } 
          if($('.convertedtemprange-cls').length > 0)
          {    
              $('.convertedtemprange-cls').html(labelDataCalc.labels.ConvertedTempRange);
          }      
      
      }); 
    })
    .fail(function (error) {
  
    });
  
  });

