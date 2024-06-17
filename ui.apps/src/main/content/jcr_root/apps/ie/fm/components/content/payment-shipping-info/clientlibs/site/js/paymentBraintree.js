    function getPaymentDetails() {
        $.ajax({
            type: "GET",
            url: "/bin/getPaymentToken",
            data: {
                CTCustomerToken: window.isCustomerToken(),
                bearertoken: window.getbearerToken()
    
            },
            success: function(getPayment) {
                getPaymentToken = getPayment
    
    
            var form = document.querySelector('#my-sample-form');
            
            var submit = document.querySelector('input[type="submit"]');
            
            var nonceValue = '';
            braintree.client.create({
                authorization:  getPaymentToken
            }, function(clientErr, clientInstance) {
            
                if (clientErr) {
            
                    console.error("client error" +clientErr);
                    return;
                }
    
    
                    // This example shows Hosted Fields, but you can also use this
    
                    // client instance to create additional components here, such as
    
                    // PayPal or Data Collector.
    
    
    
                    braintree.hostedFields.create({
                        client: clientInstance,
                        styles: {
                            'input': {
                                'font-size': '14px'
                            },
                            'input.invalid': {
                                'color': 'red'
                            },
                            'input.valid': {
                                'color': '#343A40'
                            }
                        },
    
                        fields: {
                            number: {
                                container: '#card-number',
                                placeholder: '4111 1111 1111 1111'
                            },
    
                            cvv: {
                                container: '#cvv',
                                placeholder: '123'
                            },
    
                            expirationDate: {
                                container: '#expiration-date',
                                placeholder: '10 / 2022'
                            }
                        }
                    }, function(hostedFieldsErr, hostedFieldsInstance) {
                        fields = {
        'number' : {
            errMsg : utilityMessage.messages.enterValidCardNo,
            errField : '.errNumber'
    
        },
            'cvv' : {
                errMsg : utilityMessage.messages.enterValidCVV,
            errField : '.errCvv'
    
        },
            'expirationDate' : {
                errMsg : utilityMessage.messages.enterValidExpiryDate,
            errField : '.errED'
    
        }
    }
                        submit.removeAttribute('disabled');
                        form.addEventListener('submit', function(event) {
                            event.preventDefault();
                            hostedFieldsInstance.tokenize(function(tokenizeErr, payload) {
                                if (tokenizeErr) {
                                    c = tokenizeErr;
                                    if(c.code == "HOSTED_FIELDS_FIELDS_EMPTY"){
                                        document.getElementById('card-number').nextElementSibling.innerHTML = utilityMessage.messages.enterCardNo;
                                        document.getElementById('expiration-date').nextElementSibling.innerHTML = utilityMessage.messages.enterValidExpiryDate;
                                        document.getElementById('cvv').nextElementSibling.innerHTML = utilityMessage.messages.enterCVV;
                                        document.getElementById('card-number').nextElementSibling.style.display = 'block';
                                        document.getElementById('expiration-date').nextElementSibling.style.display = 'block';
                                        document.getElementById('cvv').nextElementSibling.style.display = 'block';
                                        }
                                    else if(c.code == "HOSTED_FIELDS_FIELDS_INVALID") {
    
                                    for( v in c.details.invalidFieldKeys){
    
                                        p = (c.details.invalidFieldKeys[v]);
                                        document.getElementById('card-number').nextElementSibling.style.display = 'block';
                                        document.getElementById('expiration-date').nextElementSibling.style.display = 'block';
                                        document.getElementById('cvv').nextElementSibling.style.display = 'block';
                                        document.querySelector('p'+fields[p].errField).innerHTML = fields[p].errMsg;
    
                                    }
                                    //console.error("error in field" +tokenizeErr.details);
                                    //$(".errorMsg").html("Please enter valid details");
    
                                    return;
                                    }
    
                                }
                                else{
                                    $(".errNumber").empty();
                                    $(".errED").empty();
                                    $(".errCvv").empty();
                                }
    
                                nonceValue = payload.nonce;
                                // If this was a real integration, this is where you would
    
                                // send the nonce to your server.
                                 if (selectedRadio == "carddetails") {
                                    let shippingAddress_guest = recalculateData.shippingAddress;
                                    var addId = recalculateData.shippingAddress.id;
                                     var flag;
                                    var country = shippingAddress_guest.country;
                                    var state = shippingAddress_guest.state;
                                    var line2 = shippingAddress_guest.streetName;
                                    var zipcode = shippingAddress_guest.postalCode;
                                    var line1 = shippingAddress_guest.streetNumber;
                                    var phone = shippingAddress_guest.phone;
                                    var name = shippingAddress_guest.firstName;
                                    var city = shippingAddress_guest.city;
                                    var company = shippingAddress_guest.company;
                                    if( $("#saveCardDetailsInfo").is(':checked'))
                                    {
                                        flag = true;
                                    }
                                     else
                                     {
                                         flag = false;
                                     }
                                     if (customerToken == null || customerToken == undefined) {
                                        if ($("#billingAddress").is(':checked')) {
    
    
                                            var paymentMethod = {
                                                "nonce": nonceValue,
                                                "billingAddress": {
                                                    "state": state,
                                                    "country": country,
                                                    "line2": line2,
                                                    "zipcode": zipcode,
                                                    "line1": line1,
                                                    "phone": phone,
                                                    "name": name,
                                                    "city": city,
                                                    "company": company
                                                },
                                                "savePaymentInfo": false
                                            }
                                        } else {
                                            var paymentMethod = {
                                                "nonce": nonceValue,
                                                "billingAddress": {
                                                    "state": billingState,
                                                    "country": billingCountry,
                                                    "line2": addressTwo,
                                                    "zipcode": areaZipcode,
                                                    "line1": addressOne,
                                                    "phone": phoneNumber,
                                                    "name": userName,
                                                    "city": cityName,
                                                    "company": companyName
                                                },
                                                "savePaymentInfo": false
                                            }
                                        }
    
                                    } else {
                                         if ($("#billingAddress").is(':checked')) {
    
                                        var paymentMethod = {
                                            "nonce": nonceValue,
                                            "billingAddress": {
                                                "id": addId
                                            },
                                            "savePaymentInfo": flag
                                        }
                                        }
                                        else
                                        {
                                          var paymentMethod = {
                                            "nonce": nonceValue,
                                            "billingAddress": {
                                                "id": curEditAdd
                                            },
                                            "savePaymentInfo": flag
                                        }
                                        }
                                    }
                                }
                                $.ajax({
                                    type: "POST",
                                    url: "/bin/processPayment",
                                    data: {
                                        CTCustomerToken: window.isCustomerToken(),
                                        bearerToken: window.getbearerToken(),
                                        jsonData: JSON.stringify(paymentMethod)
                                    },
                                    success: function(data, statuscode, xhr) {
                                        if (data != null && data != "") {
                                            if (xhr.status == 200 && data.statusCode != 401) {
                                                let orderid = data.id;
                                                if (orderid != null || orderid != undefined) {
                                                window.location.href = "/content/fm/en/checkout-success.html?orderid=" + orderid;
                                            }
                                        }
                                    }
                                    }
                                });
    
                            });
    
                        });
    
                    });
    
                });
            }
        });
    }