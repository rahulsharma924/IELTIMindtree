/*******************************************************************************
 * Copyright 2016 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function () {
    "use strict";

    var NS = "cmp";
    var IS = "formText";
    var IS_DASH = "form-text";

    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]'
    };

    var properties = {
        /**
         * A validation message to display if there is a type mismatch between the user input and expected input.
         *
         * @type {String}
         */
        constraintMessage: "",
        /**
         * A validation message to display if no input is supplied, but input is expected for the field.
         *
         * @type {String}
         */
        requiredMessage: ""
    };

    function readData(element) {
        var data = element.dataset;
        var options = [];
        var capitalized = IS;
        capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
        var reserved = ["is", "hook" + capitalized];

        for (var key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                var value = data[key];

                if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);

                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }

        return options;
    }

    function FormText(config) {
        if (config.element) {
            // prevents multiple initialization
            config.element.removeAttribute("data-" + NS + "-is");
        }

        this._cacheElements(config.element);
        this._setupProperties(config.options);

        this._elements.input.addEventListener("invalid", this._onInvalid.bind(this));
        this._elements.input.addEventListener("input", this._onInput.bind(this));
    }

    FormText.prototype._onInvalid = function (event) {
        event.target.setCustomValidity("");
        if (event.target.validity.typeMismatch) {
            if (this._properties.constraintMessage) {
                event.target.setCustomValidity(this._properties.constraintMessage);
            }
        } else if (event.target.validity.valueMissing) {
            if (this._properties.requiredMessage) {
                event.target.setCustomValidity(this._properties.requiredMessage);
            }
        }
    };

    FormText.prototype._onInput = function (event) {
        event.target.setCustomValidity("");
    };

    FormText.prototype._cacheElements = function (wrapper) {
        this._elements = {};
        this._elements.self = wrapper;
        var hooks = this._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS_DASH + "]");
        for (var i = 0; i < hooks.length; i++) {
            var hook = hooks[i];
            var capitalized = IS;
            capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
            var key = hook.dataset[NS + "Hook" + capitalized];
            this._elements[key] = hook;
        }
    };

    FormText.prototype._setupProperties = function (options) {
        this._properties = {};

        for (var key in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, key)) {
                var property = properties[key];
                if (options && options[key] != null) {
                    if (property && typeof property.transform === "function") {
                        this._properties[key] = property.transform(options[key]);
                    } else {
                        this._properties[key] = options[key];
                    }
                } else {
                    this._properties[key] = properties[key]["default"];
                }
            }
        }
    };

    function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new FormText({ element: elements[i], options: readData(elements[i]) });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body = document.querySelector("body");
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function (addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function (element) {
                                new FormText({ element: element, options: readData(element) });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

})();


$(document).ready(function () {
    var passNewField = document.getElementById("pswd1");
    var passNewField1 = document.getElementById("pswd11");
    var passNewField2 = document.getElementById("pswd22");
    var passNewField3 = document.getElementById("code");
    var passNewField4 = document.getElementById("pswd2");
    var signinpwdField = document.getElementById("signinpwd");
    var signinemailField = document.getElementById("signinemail");
    if (passNewField) {
        passNewField.parentNode.parentNode.classList.add("custom_form_container");
    }
    if (passNewField1) {
        passNewField1.parentNode.parentNode.classList.add("custom_form_container");
        passNewField1.parentNode.parentNode.parentNode.classList.add("accenterpassword");
    }
    if (passNewField2) {
        passNewField2.parentNode.parentNode.classList.add("custom_form_container");
        passNewField2.parentNode.parentNode.parentNode.classList.add("Accconfirmpassword");
    }
    if (passNewField3) {
        passNewField3.parentNode.parentNode.classList.add("custom_form_container");
        if (passNewField3.type === "password") {
            passNewField3.type = "text";
            $(".pi-code.fa.fa-thin.fa-eye-slash").removeClass("fa-eye-slash");
        }
    }
    if (passNewField4) {
        passNewField4.parentNode.parentNode.classList.add("custom_form_container");
    }
    if (signinemailField) {
        $("#signinemail").parent().attr("id", "mob-align");
        if (signinemailField.type === "password") {
            signinemailField.type = "text";
            $(".pi-signinemail").removeClass("fa-eye-slash");
        } else {
            $(".pi-signinemail").removeClass("fa-eye-slash");
        }
    }
    if (signinpwdField) {
        $("#signinpwd").parent().attr("id", "mob-align");
        signinpwdField.parentNode.classList.add("sign-password-container");

        $(".pi-signinpwd").on("click", function (e) {
            // var x = document.getElementById("signinpwd");
            if (signinpwdField.type === "password") {
                signinpwdField.type = "text";
                $(".pi-signinpwd.fa.fa-thin.fa-eye-slash").removeClass("fa-eye-slash");
                $(".pi-signinpwd.fa-thin").addClass("fa-eye");
            } else {
                signinpwdField.type = "password";
                $(".pi-signinpwd.fa-thin.fa-eye").removeClass("fa-eye");
                $(".pi-signinpwd.fa-thin").addClass("fa-eye-slash");
            }
        });
    }
    var currentPwd = document.getElementById('currentpassword');
    if (currentPwd) {
        // var iTag = document.getElementById("pi-currentpassword");
        //$(".pi-currentpassword.fa-thin").addClass("fa-eye-slash");
        currentPwd.parentNode.classList.add("passNewClass");
        $(".pi-currentpassword").on("click", function (e) {
            var x = document.getElementById("currentpassword");
            if (x.type === "password") {
                x.type = "text";
                $(".pi-currentpassword.fa-thin.fa-eye-slash").removeClass("fa-eye-slash");
                $(".pi-currentpassword.fa-thin").addClass("fa-eye");
            } else {
                x.type = "password";
                $(".pi-currentpassword.fa-thin.fa-eye").removeClass("fa-eye");
                $(".pi-currentpassword.fa-thin").addClass("fa-eye-slash");
            }
        });
    }

    var pswd1 = $("#pswd1");
    if (pswd1) {
        var iTag = $(".pi-pswd1");
        $(".pi-pswd1").on("click", function (e) {
            var x = document.getElementById("pswd1");
            if (x.type === "password") {
                x.type = "text";
                $(".pi-pswd1.fa-thin.fa-eye-slash").removeClass("fa-eye-slash");
                $(".pi-pswd1.fa-thin").addClass("fa-eye");
            } else {
                x.type = "password";
                $(".pi-pswd1.fa-thin.fa-eye").removeClass("fa-eye");
                $(".pi-pswd1.fa-thin").addClass("fa-eye-slash");
            }
        });
    }
    var pswd11 = $("#pswd11");
    if (pswd11) {
        var iTag = $(".pi-pswd11");
        $(".pi-pswd11").on("click", function (e) {
            var x = document.getElementById("pswd11");
            if (x.type === "password") {
                x.type = "text";
                $(".pi-pswd11.fa-thin.fa-eye-slash").removeClass("fa-eye-slash");
                $(".pi-pswd11.fa-thin").addClass("fa-eye");
            } else {
                x.type = "password";
                $(".pi-pswd11.fa-thin.fa-eye").removeClass("fa-eye");
                $(".pi-pswd11.fa-thin").addClass("fa-eye-slash");
            }
        });
    }
    var pswd2 = $("#pswd2");
    if (pswd2) {
        var iTag = $(".pi-pswd2");
        $("#pswd2").keypress(function () {
            $("#confirmpasswordbutton").addClass("confirm-btn-enabled");
        });
        $("#pswd2").bind("paste", function (e) {
            $("#confirmpasswordbutton").addClass("confirm-btn-enabled");
        });
        $(".pi-pswd2").on("click", function (e) {
            var x = document.getElementById("pswd2");
            if (x.type === "password") {
                x.type = "text";
                $(".pi-pswd2.fa-thin.fa-eye-slash").removeClass("fa-eye-slash");
                $(".pi-pswd2.fa-thin").addClass("fa-eye");
            } else {
                x.type = "password";
                $(".pi-pswd2.fa-thin.fa-eye").removeClass("fa-eye");
                $(".pi-pswd2.fa-thin").addClass("fa-eye-slash");
            }
        });
    }
    var pswd22 = $("#pswd22");
    if (pswd22) {
        var iTag = $(".pi-pswd22");
        $(".pi-pswd22").on("click", function (e) {
            var x = document.getElementById("pswd22");
            if (x.type === "password") {
                x.type = "text";
                $(".pi-pswd22.fa-thin.fa-eye-slash").removeClass("fa-eye-slash");
                $(".pi-pswd22.fa-thin").addClass("fa-eye");
            } else {
                x.type = "password";
                $(".pi-pswd22.fa-thin.fa-eye").removeClass("fa-eye");
                $(".pi-pswd22.fa-thin").addClass("fa-eye-slash");
            }
        });
    }

    var newPwd = $("#newpassword");
    if (newPwd) {
        newPwd.parent().addClass("passNewClass");
        $(".pi-newpassword").on("click", function (e) {
            var x = document.getElementById("newpassword");
            if (x.type === "password") {
                x.type = "text";
                $(".pi-newpassword.fa-thin.fa-eye-slash").removeClass("fa-eye-slash");
                $(".pi-newpassword.fa-thin").addClass("fa-eye");
            } else {
                x.type = "password";
                $(".pi-newpassword.fa-thin.fa-eye").removeClass("fa-eye");
                $(".pi-newpassword.fa-thin").addClass("fa-eye-slash");
            }
        });
    }
    let confirmPwd = $("#confirmpassword"),
        $input = $('#signinpwd'),
        $inputuser = $('#signinemail'),
        $register = $('#signinbtn');
    if (confirmPwd) {
        confirmPwd.parent().addClass("passNewClass");
        $(".pi-confirmpassword").on("click", function (e) {
            var x = document.getElementById("confirmpassword");
            if (x.type === "password") {
                x.type = "text";
                $(".pi-confirmpassword.fa-thin.fa-eye-slash").removeClass("fa-eye-slash");
                $(".pi-confirmpassword.fa-thin").addClass("fa-eye");
            } else {
                x.type = "password";
                $(".pi-confirmpassword.fa-thin.fa-eye").removeClass("fa-eye");
                $(".pi-confirmpassword.fa-thin").addClass("fa-eye-slash");
            }
        });
    }

    if (signinpwdField) {
        $("#signinpwd").keypress(function () {
            $("#signinbtn").addClass("signin-btn-enabled")
        })
    }

    //to enable the signIn once auto complete is triggred
    $.fn.extend({
        has_value: function () {
            return this.filter(function () {
                return $(this).val().length == 0;
            }).length;
        },
        has_value_user: function () {
            return this.filter(function () {
                return $(this).val().length == 0;
            }).length;
        },
        detect_autofill: function(){       
            if ($('#signinpwd:-webkit-autofill').length == 1)
               {
                $register.addClass('signin-btn-enabled');
                clearInterval(autofillInterval);
                $input.trigger('change');
                }
        }
    });
    

    $input.on('change keyup', function () {
        if ($input.has_value() <= 0 && $inputuser.has_value_user() <= 0) {
            $register.addClass('signin-btn-enabled');
        }
    });  
   let autofillInterval = setInterval($input.detect_autofill, 1000);
    //to enable the signIn once auto complete is triggred ends here. 
});

