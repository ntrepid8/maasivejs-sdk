/**
 * MaaSive.net JavaScript SDK.
 * User: ntrepid8
 * Date: 8/17/13
 * Time: 8:03 PM
 * Version: 0.1
 */
/*globals $ */

var maasive = (function(){
    var m = {
        host: null
    };
    $.support.cors = true;
    m.requireHost = function(){
        if (!m.host) {throw "maasive.host can not be null"}
    };
    m.auth = {
        login: function (email, password, onSuccess, onError) {
            m.requireHost();
            if (email && password){
                $.ajax({
                    url: m.host + "/auth/login/",
                    type: "POST",
                    dataType: 'json',
                    data: {
                        email: email,
                        password: password
                    },
                    xhrFields: {
                      withCredentials: true
                    },
                    success: function(data){if(onSuccess){onSuccess(data)}},
                    error: function(jqxhr, textStatus, error){
                        if(onError){
                            var response, reason;
                            if (jqxhr.responseText){response = $.parseJSON(jqxhr.responseText);}
                            if (response){reason = response['error']['reason'];}
                            onError(jqxhr, textStatus, error, reason);
                        }
                    }
                });
            } else if (!email) {
                if(onError){onError(null, "email is required", null)}
            } else if (!password) {
                if(onError){onError(null, "password is required", null)}
            } else {
                if(onError){onError(null, "unable to process login request", null)}
            }
        },
        logout: function(onSuccess, onError){
            m.requireHost();
            $.ajax({
                url: m.host + "/auth/logout/",
                type: "GET",
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: function(data){if(onSuccess){onSuccess(data)}},
                error: function(jqxhr, textStatus, error){if(onError){onError(jqxhr, textStatus, error)}}
            });
        },
        register: function(registrationObj, onSuccess, onError){
            m.requireHost();
            $.ajax({
                url: m.host + "/register/",
                type: "POST",
                dataType: 'json',
                processData: false,
                contentType: "application/json",
                xhrFields: {withCredentials: true},
                data: JSON.stringify({
                    first_name: registrationObj.firstName,
                    last_name: registrationObj.lastName,
                    email: registrationObj.email,
                    company: registrationObj.company,
                    phone: registrationObj.phone,
                    password: registrationObj.password
                }),
                success: function(data){if(onSuccess){onSuccess(data)}},
                error: function(jqxhr, textStatus, error){if(onError){onError(jqxhr, textStatus, error)}}
            });
        },
        verify: function(token, userId, onSuccess, onError){
            m.requireHost();
            if (token && userId){
                $.ajax({
                    url: m.host + "/auth/user/"+userId+"/verified?token="+token,
                    type: "GET",
                    dataType: 'json',
                    xhrFields: {withCredentials: true},
                    success: function(data){if(onSuccess){onSuccess(data)}},
                    error: function(jqxhr, textStatus, error){if(onError){onError(jqxhr, textStatus, error)}}
                });
            } else if (!token && onError){
                onError(null, "token is required", null);
            } else if (!userId && onError){
                onError(null, "userId is required", null);
            }
        },
        getCurrentUser: function(onSuccess, onError){
            m.requireHost();
            $.ajax({
                url: m.host + "/auth/user/",
                type: "GET",
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: function(data){
                    if(onSuccess && (data.length === 1)){onSuccess(data[0])}},
                error: function(jqxhr, textStatus, error){
                    if(onError){
                        var response, reason;
                        if (jqxhr.responseText){response = $.parseJSON(jqxhr.responseText);}
                        if (response){reason = response['error']['reason'];}
                        onError(jqxhr, textStatus, error, reason);
                    }
                }
            });
        }
    };
    m.options = function(url, onSuccess, onError){
        m.requireHost();
        return $.ajax({
            url: m.host + url,
            type: "OPTIONS",
            dataType: 'json',
            xhrFields: {withCredentials: true},
            success: function(data){if(onSuccess && data){onSuccess(data)}},
            error: function(jqxhr, textStatus, error){
                if(onError){
                    var response, reason;
                    if (jqxhr.responseText){response = $.parseJSON(jqxhr.responseText);}
                    if (response){reason = response['error']['reason'];}
                    onError(jqxhr, textStatus, error, reason);
                }
            }
        });
    };
    m.get = function(url, onSuccess, onError){
        m.requireHost();
        return $.ajax({
            url: m.host + url,
            type: "GET",
            dataType: 'json',
            xhrFields: {withCredentials: true},
            success: function(data){if(onSuccess && data){onSuccess(data)}},
            error: function(jqxhr, textStatus, error){
                if(onError){
                    var response, reason;
                    if (jqxhr.responseText){response = $.parseJSON(jqxhr.responseText);}
                    if (response){reason = response['error']['reason'];}
                    onError(jqxhr, textStatus, error, reason);
                }
            }
        });
    };
    m.post = function(url, data, onSuccess, onError){
        m.requireHost();
        return $.ajax({
            url: m.host + url,
            type: "POST",
            data: JSON.stringify(data),
            dataType: 'json',
            processData: false,
            contentType: "application/json",
            xhrFields: {withCredentials: true},
            success: function(data){if(onSuccess && data){onSuccess(data)}},
            error: function(jqxhr, textStatus, error){
                if(onError){
                    var response, reason;
                    if (jqxhr.responseText){response = $.parseJSON(jqxhr.responseText);}
                    if (response){reason = response['error']['reason'];}
                    onError(jqxhr, textStatus, error, reason);
                }
            }
        });
    };
    m.put = function(url, data, onSuccess, onError){
        m.requireHost();
        return $.ajax({
            url: m.host + url,
            type: "PUT",
            data: JSON.stringify(data),
            dataType: 'json',
            processData: false,
            contentType: "application/json",
            xhrFields: {withCredentials: true},
            success: function(data){if(onSuccess && data){onSuccess(data)}},
            error: function(jqxhr, textStatus, error){
                if(onError){
                    var response, reason;
                    if (jqxhr.responseText){response = $.parseJSON(jqxhr.responseText);}
                    if (response){reason = response['error']['reason'];}
                    onError(jqxhr, textStatus, error, reason);
                }
            }
        });
    };
    m.remove = function(url, onSuccess, onError){
        m.requireHost();
        return $.ajax({
            url: m.host + url,
            type: "DELETE",
            dataType: 'json',
            xhrFields: {withCredentials: true},
            success: function(data){if(onSuccess && data){onSuccess(data)}},
            error: function(jqxhr, textStatus, error){
                if(onError){
                    var response, reason;
                    if (jqxhr.responseText){response = $.parseJSON(jqxhr.responseText);}
                    if (response){reason = response['error']['reason'];}
                    onError(jqxhr, textStatus, error, reason);
                }
            }
        });
    };
    return m;
}());