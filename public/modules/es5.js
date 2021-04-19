//ES5+

define([], function () {
    function AjaxLib() {
        this.xhr = new XMLHttpRequest()
    }

    //Make an HTTP Get request
    AjaxLib.prototype.get = function(url, callbackFunc) {
        this.xhr.open('GET', url, true)

        //Create variable self pointing to self
        //so that it can be called inside the onload function.
        let self = this

        this.xhr.onload = function() {
            // this.http is not available in the function scope
            if ( self.xhr.status === 200 ) { 
                callbackFunc('SUCCESS', self.xhr.responseText)
            } else {
                callbackFunc(self.xhr.status)
            }
        }

        this.xhr.send()
    }

    //Make an HTTP post request. 
    AjaxLib.prototype.post = function(url, data, callbackFunc) {
        this.xhr.open('POST', url, true)
        this.xhr.setRequestHeader('Content-type','application/json')

        let self = this

        this.xhr.onload = function() {
            callbackFunc(self.xhr.status,self.xhr.responseText)
        }

        this.xhr.send()
    }

    //Make an HTTP put request
    AjaxLib.prototype.put = function(url, data, callbackFunc) {
        this.xhr.open('PUT', url, true)
        this.xhr.setRequestHeader('Content-type', 'application/json')

        let self = this

        this.xhr.onload = function() {
            callbackFunc(self.xhr.status,self.xhr.responseText)
        }

        this.xhr.send()
    }

    //Make an DELETE request
    AjaxLib.prototype.delete = function(url, callbackFunc) {
        this.xhr.open('DELETE', url, true)

        let self = this

        this.xhr.onload = function () {
            callbackFunc(self.xhr.status,self.xhr.responseText)
        }

        this.xhr.send()
    }

    return new AjaxLib()
})