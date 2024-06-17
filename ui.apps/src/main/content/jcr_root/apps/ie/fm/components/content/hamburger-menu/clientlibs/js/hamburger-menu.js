/*Sign out button in hamburger*/
var isUserLoggedIn;
var userDataJSON = "";

$(document).ready(function() {
    const signInText = document.getElementById('signInHamB');
    signInText.addEventListener('click', loginRedirect);
    const singOutText = document.getElementById("signOutBtnTextHamB");
    singOutText.addEventListener('click', logoutFromHamB);
//loginFromHamB();
    isUserLoggedIn = getCookieForHamB("isUserLoggedIn");

    //if  yes display sign out
    if (isUserLoggedIn === "true") {
        // $("#signOutBtnTextHamB").css('display','block'); -> temporarily not displaying the sign out
    } else {
        // $("#signOutBtnTextHamB").css('display','none'); -> temporarily not displaying the sign out
    }

    $("[href]").each(function() {
        if (this.href == window.location.href) {
            $(this).addClass("activeLink");
            $(this).addClass("current");
        }
    });
    
    $(".industrycard .industries-menu").find('a').each(function() {
        if (this.href == window.location.href) {
            $(this).addClass("activeLink");
            $(this).addClass("current");
             $('.industries-navigation-btn a').addClass('showBorderBottom');
        }
    });
    
    $('#overlay').click(function(evt) {
        onClickMenuShow();
    });

    $(".products-btn.mob").click(function() {
        var zeynep_mob = $('.zeynep_mob').zeynep({
            opened: function() {
                $('#sidebarMenu').find('.products-active').hide();
                $('#sidebarMenu').find('#productstable-mob').hide();
                    $('.sec_level_border').show();
            },
            closed: function() {
                if (!$('.zeynep_mob').hasClass('submenu-opened')) {
                    $('#sidebarMenu').find('.products-active').show();
                    $('#sidebarMenu').find('#productstable-mob').show();
                    $('.sec_level_border').hide();
                }if (!$('.zeynep_mob').hasClass('current')) {
                    $('#sidebarMenu').find('.products-active').show();
                    $('#sidebarMenu').find('#productstable-mob').show();
                    $('.sec_level_border').hide();
                }else{$('.sec_level_border').hide();}
            }
        });
        // dynamically bind 'closing' event
        zeynep_mob.on('closing', function() {});
    });
    $(document).click(function(event) {
        if($(event.target).hasClass('mob_acc'))
        {
            $('.third_level_nav').removeClass('transitioned');
            $('.third_level_nav').prev('a').removeClass('secnav_activeLink');
            $(event.target).next('.third_level_nav').toggleClass('transitioned');
            $(event.target).addClass('secnav_activeLink');
        }
    })
    $('.mobile-hamburger').find('.overlay').click(function(){
        $(this).removeClass('active');
    });
    
    showMyAccount();
});

/*Log out for hamburger menu*/
function logoutFromHamB() {
    //Ajax call later to CT to invalidate customer token

    $.ajax({
        type: "POST",
        url: '/bin/logouttest',
        data: { message: getCookieForHamB('customerToken') },
        success: function() {
            //need to extract path from cookie//returnTo

        }
    });
    isUserLoggedIn = false;
    var pathToReturn = getPath('returnToPath');
    deleteCookie();
    // $("#signOutBtnTextHamB").css('display','none'); -> temporarily not displaying the sign out
    document.cookie = "isUserLoggedIn=" + false + ";path=/;"
    window.location.href = pathToReturn;

}

function deleteCookie() {
    document.cookie = "returnToPath=;path=/;";
    document.cookie = "customerToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function getPath(cookieName) {
    return getCookieForHamB(cookieName);
}

function getCookieForHamB(cookieName) {
    var pair = document.cookie.split('; ').find(x => x.startsWith(cookieName + '='));
    if (pair)
        return pair.split('=')[1];
}

/* Sign In From Hamburger */

// mocking login feature by just loading the customer token
// function loginFromHamB() {
//     $.getJSON('/content/dam/fm/userdataafterlogin.json', function(data) {
//         userDataJSON = data;
//     });
//     return true;
// }

//gets called when clicked on my account/sign in page for setting the path and taking to the my account section
function loginRedirect() {
    //isUserLoggedIn = true;

    document.cookie = "returnToPath=;path=/;";
    document.cookie = "returnToPath=" + window.location.href + ";path=/;";
    document.cookie = "customerToken=" + userDataJSON['customertoken'] + ";path=/;";
    document.cookie = "isUserLoggedIn=" + true + ";path=/;"
}

/* hamburger-menu (navigation bar for mobile view js) */
function onClickMenu() {
    $('#openSidebar').addClass('active');
    $('#sidebarMenu').removeClass('active');
    $('.productList-display').addClass('d-block');
}

function onClickMenuShow() {
    $('#openSidebar').removeClass('active');
    $('#sidebarMenu').addClass('active');
}

function on() {
    // document.getElementById("overlay").style.display = "block";
    $('#overlay').addClass('active');
    $('body').css('overflow-y', 'hidden');
}

function off() {
    // document.getElementById("overlay").style.display = "none";
    $('#overlay').removeClass('active');
    $('body').css('overflow-y', 'scroll');
}

var submenu = $('.navigation-menu-mob .submenu-mob li');
if (submenu.length > 0) {
    $('.navigation-menu-mob a .hamburger_right_icon').addClass('d-block');
    $('.navigation-menu-mob a .hamburger_right_icon').removeClass('d-none');
} else {
    $('.navigation-menu-mob a .hamburger_right_icon').removeClass('d-block');
    $('.navigation-menu-mob a .hamburger_right_icon').addClass('d-none');
}

function showMyAccount() {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));

        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);

        x = x.replace(/^\s+|\s+$/g, "");
        if (x == "customerInfo") {
            var $this = $(".mobile-hamburger .hamburger_sign_in .hamburger_sign_in_link a");
            $this.text("My Account");
            $this.attr("href", "/content/fm/en/my-account/account-details/personal-information.html");
        }
    }
}

/*live chat js */
document.querySelector("body").addEventListener('click', function(e) {
    var paraElement = e.target.closest('button');
    var hyperlinkElement = e.target.closest('a');
    var label = "";
    var category = "";
    if ((paraElement !== null && paraElement.closest('.analytic-Live-support') != null)) {
        label = paraElement.textContent.trim();
        category = "Live support-" + '${currentPage.getName @ context="scriptString"}';
    } else if ((hyperlinkElement !== null && hyperlinkElement.closest('.analytic-customcap') != null)) {
        label = hyperlinkElement.textContent.trim();
        category = "Custom Capabilities-" + '${currentPage.getName @ context="scriptString"}';
    } else if ((hyperlinkElement !== null && hyperlinkElement.closest('.analytic-samedayshipping') != null)) {
        label = hyperlinkElement.textContent.trim();
        category = "Same day shipping-" + '${currentPage.getName @ context="scriptString"}';
    }
    ctalinkDataLayerCall(label, category);
}, false);