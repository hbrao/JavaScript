//ES7 +

define([], function () {
    class AsyncLib {
        async get(url) {
            const res = await fetch(url)

            const resData = await res.json()

            return resData
        }

        async post(url, data) {
            const res = await fetch(url, {
                method : 'POST',
                headers: {
                    'Content-type' : 'application/json'
                },
                data : JSON.stringify(data)
            })

            const resData = await res.json()

            return resData
        }
    }

    return new AsyncLib()
})