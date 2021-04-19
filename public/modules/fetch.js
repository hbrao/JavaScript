//ES6 +

define([], function () {
    class FetchLib {
        //Make an HTTP Get request
        get(url){
            return new Promise((resolve, reject) => {
                fetch(url)
                .then(res => res.json())
                .then(data => resolve(data))
                .catch(err => reject(err))
            })
        }

        //Make an HTTP Post request
        post(url, data) {
            return new Promise((resolve, reject) => {
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-type' : 'application/json'
                    }, 
                    body : JSON.stringify(data)
                })
                .then(res => res.json())
                .then(data => resolve(data))
                .catch(err => reject(err))
            })
        }

        //Make an HTTP PUT request
        put(url, data) {
            return new Promise((resolve, reject) => {
                fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-type' : 'application/json'
                    }, 
                    body : JSON.stringify(data)
                })
                .then(res => res.json())
                .then(data => resolve(data))
                .catch(err => reject(err))
            })
        }

        //Make an HTTP DELETE request
        delete(url) {
            return new Promise((resolve, reject) => {
                fetch(url,{
                    method : 'DELETE'
                })
                .then(res => res.json())
                .then(data => resolve('User deleted.'))
                .catch(err => reject(err))
            })
        }

    }

    return new FetchLib()
})