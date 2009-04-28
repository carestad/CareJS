var care = {
    xSend: function(type, config) {
        if (typeof(XMLHttpRequest) == 'undefined')
            XMLHttpRequest = this._init();

        var XHReq = new XMLHttpRequest;
        var callbackFunction = config.handler;
        XHReq.open(type, config.url, true);

        XHReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        XHReq.onreadystatechange = function() {
            if (XHReq.readyState == 4) {
                var ioArgs = {
                    status: XHReq.status,
                    statusText: XHReq.statusText
                };
                if (config.handleAs && config.handleAs.toLower == 'xml')
                    callbackFunction(XHReq.responseXML, ioArgs);
                else if (config.handleAs && config.handleAs.toLower == 'json')
                    callbackFunction(eval('(' + XHReq.responseText + ')'), ioArgs);
                else
                    callbackFunction(XHReq.responseText, ioArgs);
            }
        }
        XHReq.send(config.query);
    },

    xPost: function(config) {
        if (typeof(config.vars) == 'object') {
            var queryStr = '';
            var varCount = 0;
            for (var v in config.vars) {
                queryStr += (varCount == 0) ? '' : '&';
                queryStr += v + '=' + config.vars[v];
                varCount++;
            }
            config.query = queryStr;
            delete config.vars;
        }
        this.xSend('POST', config);
    },

    xGet: function (config) {
        if (!config.vars)
            config.vars = {};
        // Set URL-argument to avoid the browser caching the GET-request
        config.vars.xhrCache = new Date().getTime();

        var queryStr = '';
        var regex = new RegExp(/(\?|&)/);
        for (var v in config.vars) {
            queryStr += (!regex.test(config.url)) ? '?' : '&';
            queryStr += v + '=' + config.vars[v];
        }
        config.url += queryStr;

        if (config.handleAs == 'jsonp' && typeof(config.jsonp) != 'undefined') {
            if (typeof(config.handler) == 'function') {
                // Not a part of the standard
                if (typeof(config.handler.name) != 'undefined') {
                    config.handler = config.handler.name;
                }
                else {
                    var handler = config.handler.toString().match(/function\s*([A-Z0-9_]+)\s*\(/i)[1];
                    if (handler != null)
                        config.handler = handler;
                    else
                        throw new Error('Function passed by referance needs to be named');
                }
            }
            config.url += config.handler;
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = config.url;
            document.getElementsByTagName('head')[0].appendChild(script);
            script.parentNode.removeChild(script);

            // no need to send XHR
            return;
        }

        delete config.vars;
        this.xSend('GET', config);
    },

    jsonp: function(config) {
        config.handleAs = 'jsonp';
        this.xGet(config);
    },

    _init: function() {
        try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch(e) {}
        try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch(e) {}
        try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch(e) {}
        try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch(e) {}
        throw new Error("This browser does not support XMLHttpRequest.");
    }
}
