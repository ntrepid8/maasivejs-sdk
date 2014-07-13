/**
 * MaaSive.net JavaScript SDK.
 * User: Josh Austin
 * Date: 6/16/2014
 * Time: 3:36 PM EST
 * Version: 1.1.1-beta.1
 */

var maasive = (function($){
    'use strict';
    var m = {
        host: null,
        $: $,
        RSVP: null,
        baseRequest: {
            xhrFields: {withCredentials: true},
            dataType: 'json',
            processData: false,
            contentType: "application/json",
            statusCode: {}
        },
        statusCode: {},  // attach 'global' handlers to all requests, works for RSVPs too
        success: null,  // run this on every request
        error: null  // run this on every request
    };
    $.support.cors = true;
    m.requireHost = function(){
        if (!m.host) {throw "maasive.host can not be null";}
    };
    m.processData = function(data){
        if (typeof(data) === 'object'){
            data = JSON.stringify(data);
        }
        return data;
    };
    m._request = function(args){
        var error = null;
        if (typeof(args) !== 'object'){
            error = {
                statusCode: 400,
                error: 'invalid_arguments',
                reason: 'arg[0] must be an object'
            };
        }
        console.log(args);
        m.requireHost();
        var requestArgs = $.extend(true, args, m.baseRequest);
        if (!(args.url.substring(0, 4) === 'http' || args.url.substring(0, 5) === 'https')){
            requestArgs.url = m.host+args.url;
        }
        requestArgs.data = m.processData(args.data);
        var request;
        if (error){
            if (m.RSVP){
                request = new m.RSVP.Promise(function(resolve, reject){
                    reject(error);
                });
            } else {
                request = new $.Deferred().promise();
                request.reject(error);
            }
        } else {
            if (m.RSVP){
                request = new m.RSVP.Promise(function(resolve, reject){
                    $.ajax(requestArgs).then(function(data, textStatus, jqXHR){
                        resolve({
                            data: data,
                            textStatus: textStatus,
                            jqXHR: jqXHR
                        });
                    }, function(jqXHR, textStatus, errorThrown){
                        var response, reason;
                        if (jqXHR.responseText) {
                            response = $.parseJSON(jqXHR.responseText);
                        }
                        if (response && response.hasOwnProperty('error')) {
                            reason = response.error.reason || null;
                        } else {
                            reason = jqXHR.statusText;
                        }
                        reject({
                            jqXHR: jqXHR,
                            textStatus: textStatus,
                            errorThrown: errorThrown,
                            reason: reason
                        });
                    });
                });
            } else {
                request = $.ajax(requestArgs);
            }
        }
        return request;
    };
    m.request = function(args){
        return m._request(args).then(m.success, m.error);
    };
    m.auth = {
        login: function (email, password, onSuccess, onError) {
            if (email && password){
                m.request({
                    url: '/auth/login/',
                    type: 'POST',
                    data: {
                        email: email,
                        password: password
                    }
                }).then(onSuccess, onError);
            } else if (!email) {
                if(onError){
                    onError({
                        error: 'email_missing',
                        reason: 'email is required'
                    });
                }
            } else if (!password) {
                if(onError){
                    onError({
                        error: 'password_missing',
                        reason: 'password is required'
                    });
                }
            } else {
                if(onError){
                    onError({
                        error: 'unknown_error',
                        reason: 'unable to process login request'
                    });
                }
            }
        },
        logout: function(onSuccess, onError){
            m.request({
                url: '/auth/logout/',
                type: 'GET'
            }).then(onSuccess, onError);
        },
        register: function(registrationObj, onSuccess, onError){
            m.request({
                url: '/auth/register/',
                type: 'POST',
                data: {
                    first_name: registrationObj.firstName,
                    last_name: registrationObj.lastName,
                    email: registrationObj.email,
                    company: registrationObj.company,
                    phone: registrationObj.phone,
                    password: registrationObj.password
                }
            }).then(onSuccess, onError);
        },
        verify: function(token, onSuccess, onError){
            m.request({
                url: '/auth/verify/',
                type: 'POST',
                data: {token: token}
            }).then(onSuccess, onError);
        },
        getCurrentUser: function(onSuccess, onError){
            return m._request({
                url: '/auth/user/',
                type: 'GET'
            }).then(function(response){
                return response.data[0];
            }).then(onSuccess, onError);
        }
    };
    m.options = function(url, onSuccess, onError){
        return m.request({url: url, type: 'OPTIONS'}).then(onSuccess, onError);
    };
    m.get = function(url, onSuccess, onError, ifModified){
        ifModified = typeof ifModified !== 'undefined' ? ifModified : false;
        return m.request({
            url: url,
            type: 'GET',
            ifModified: ifModified
        }).then(onSuccess, onError);
    };
    m.post = function(url, data, onSuccess, onError){
        return m.request({
            url: url,
            type: 'POST',
            data: data
        }).then(onSuccess, onError);
    };
    m.put = function(url, data, onSuccess, onError){
        return m.request({
            url: url,
            type: 'PUT',
            data: data
        }).then(onSuccess, onError);
    };
    m.remove = function(url, onSuccess, onError){
        return m.request({
            url: url,
            type: 'DELETE'
        }).then(onSuccess, onError);
    };
    return m;
}(window.jQuery));
