var MaaSive = (function (host, api) {
    // Privates
    var mHost = host || "http://dev.maasive.net";
    var mApi = api || "/";
    var uri = mHost + mApi;
    var currentUserToken = null;
    var currentUser = null;

    function createMaaSiveRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest !== "undefined") {
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            xhr = null;
        }
        return xhr;
    }

    // Public Object
    return {
        currentUser: function () {
            if (currentUser) {
                return currentUser;
            } else {
                return false;
            }
        },
        authenticate: function (email, password, success, failure) {
            if (currentUser === email) {
                console.log("Maasive user already logged in: " + currentUser);
            } else {
                console.log("auth: " + uri);
                var auth = createMaaSiveRequest("POST", uri + "/auth/login/");
                if (!auth) {
                    throw new Error("CORS not supported");
                }
                auth.onload = function () {
                    var responseObj = JSON.parse(auth.responseText);
                    console.log(responseObj);
                    if (auth.status !== 200) {
                        failure(responseObj);
                    } else {
                        currentUser = responseObj.user;
                        success(responseObj);
                    }

                };
                auth.onerror = function () {
                    console.log("Auth client error.");
                };
                auth.withCredentials = true;
                var authData = {
                    email: email,
                    password: password
                };
                auth.setRequestHeader("Content-Type", "application/json");
                auth.send(JSON.stringify(authData));
            }
        },
        get: function (path, success, failure) {
            var http = createMaaSiveRequest("GET", uri + path);
            http.onload = function () {
                var responseObj = JSON.parse(http.responseText);
                console.log(responseObj);
                if (http.status !== 200) {
                    failure(responseObj);
                } else {
                    currentUser = responseObj.user;
                    success(responseObj);
                }
            };
            http.onerror = function () {
                console.log("Auth Error.");
            };
            http.withCredentials = true;
            http.send();
        },
        post: function (path, body, success, failure) {
            var http = createMaaSiveRequest("POST", uri + path);
            http.onload = function () {
                var responseObj = JSON.parse(http.responseText);
                console.log(responseObj);
                if (http.status !== 200) {
                    failure(responseObj);
                } else {
                    currentUser = responseObj.user;
                    success(responseObj);
                }
            };
            http.onerror = function () {
                console.log("Post error.");
            };
            http.withCredentials = true;
            http.setRequestHeader("Content-Type", "application/json");
            http.send(JSON.stringify(body));
        },
        put: function (path, json, success, failure) {
            var http = createMaaSiveRequest("PUT", uri + path);
            http.onload = function () {
                var responseObj = JSON.parse(http.responseText);
                console.log(responseObj);
                if (http.status !== 200) {
                    failure(responseObj);
                } else {
                    currentUser = responseObj.user;
                    success(responseObj);
                }
            };
            http.onerror = function () {
                console.log("Put failed.");
            };
            http.withCredentials = true;
            http.setRequestHeader("Content-Type", "application/json");
            http.send(JSON.stringify(json));
        },
        delete: function (path, success, failure) {
            var http = createMaaSiveRequest("DELETE", uri + path);
            http.onload = function () {
                var responseObj = JSON.parse(http.responseText);
                console.log(responseObj);
                if (http.status !== 200) {
                    failure(responseObj);
                } else {
                    currentUser = responseObj.user;
                    success(responseObj);
                }
            };
            http.onerror = function () {
                console.log("Delete failed.");
            };
            http.withCredentials = true;
            http.setRequestHeader("Content-Type", "application/json");
            http.send();
        },
        alive: function () {
            return "I'm the NEW MaaSive.net JavaScript SDK.";
        }
    };
});

$(function () {
    $(document).ready(function () {
        var m = null;
        $("#host-form").submit(function (event) {
            event.preventDefault();
            var host = $("input[name=host]").val();
            var api = $("input[name=api]").val();
            m = new MaaSive(host, api);
            $("#host-results > pre > code").append("maasive sdk loaded");
        });

        $("#auth-form").submit(function (event) {
            event.preventDefault();
            var email = $("input[name=email]").val();
            var pass = $("input[name=password]").val();
            if (m === null) {
                $("#auth-results > pre > code").append("load maasive first\n");
            } else {
                m.authenticate(email, pass, function (data) {
                    $("#auth-results > pre > code").append("auth: " + data.status + "\n");
                }, function (data) {
                    $("#auth-results > pre > code").append("auth: " + data.status_message + "\n");
                });
            }
        });
		
        $("input[name=logout]").click(function (event) {
            if (m === null) {
                $("#auth-results > pre > code").append("load maasive first\n");
            } else {
                m.get("/auth/logout/", function (data) {
                    $("#auth-results > pre > code").append("logout success\n");
                });
            }
        });
		
        $("#get-form").submit(function (event) {
            event.preventDefault();
            var path = $("form#get-form input[name=path]").val();
            if (m === null) {
                $("#get-results > pre > code").append("load maasive first");
            } else {
                m.get(path, function (data) {
                    $("#get-results > pre > code").text(JSON.stringify(data, undefined, 2));
                }, function (data) {
                    $("#get-results > pre > code").text("auth: " + data.status_message + "\n");
                });
            }
        });
        
        $("#post-form").submit(function (event) {
            event.preventDefault();
            var path = $("form#post-form input[name=path]").val();
            if (m === null) {
                $("#post-results > pre > code").append("load maasive first");
            } 
            else {
                var body = $("#post-body").val();
                try {
                    body = JSON.parse(body);
                } catch(err) {
                    throw new Error('Invalid JSON');
                }
                m.post(path, body, 
                       function (data) {
                            $("#post-results > pre > code").text(JSON.stringify(data, undefined, 2));
                       }, 
                       function (data) {
                            $("#post-results > pre > code").text(data.status_message);
                       }
               );
            }
        });
        
        $("#put-form").submit(function (event) {
            event.preventDefault();
            var path = $("form#put-form input[name=path]").val();
            if (m === null) {
                $("#put-results > pre > code").append("load maasive first");
            } 
            else {
                var body = $("#put-body").val();
                try {
                    body = JSON.parse(body);
                } catch(err) {
                    throw new Error('Invalid JSON');
                }
                m.put(path, body, 
                       function (data) {
                            $("#put-results > pre > code").text(JSON.stringify(data, undefined, 2));
                       }, 
                       function (data) {
                            $("#put-results > pre > code").text(data.status_message);
                       }
               );
            }
        });
        
        $("#delete-form").submit(function (event) {
            event.preventDefault();
            var path = $("form#delete-form input[name=path]").val();
            if (m === null) {
                $("#delete-results > pre > code").append("load maasive first");
            } else {
                m.delete(path, function (data) {
                    $("#delete-results > pre > code").text(JSON.stringify(data, undefined, 2));
                });
            }
        });
    });
});