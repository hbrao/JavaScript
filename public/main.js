//Require JS module configuration
requirejs.config({
    baseUrl: '.',
    paths: {
        'ajax' : './public/modules/ajax',
        'fetch' : './public/modules/fetch',
        'async' : './public/modules/async'
    }
})

//Import require js modules defined above and write application logic
require(['ajax', 'fetch', 'async'], (lib1, lib2, lib3) => {

    var newPost = {
        title : 'My new post',
        body : 'This is a post aboult using Ajax requests'
    }

    //XMLHttpRequest Demo

    function getPost() {
        lib1.get('http://jsonplaceholder.typicode.com/posts/6',
            function(result, data) {
                if ( result === 'SUCCESS') {
                    document.getElementById('xhrout').innerHTML = data
                } else {
                    document.getElementById('xhrout').innerHTML = `Error ${result}`
                }
            }
        )
    }

    function addPost() {
        lib1.post('http://jsonplaceholder.typicode.com/posts', newPost, 
            function(result, data) {
                if ( result === 201 )
                    document.getElementById('xhrout').innerHTML = data
                else
                    document.getElementById('xhrout').innerHTML = `Error ${result}`
            }
        )
    }

    function updPost() {
        lib1.put('http://jsonplaceholder.typicode.com/posts/9', newPost, 
            function(result, data) {
                if ( result === 200 )
                    document.getElementById('xhrout').innerHTML = data
                else
                    document.getElementById('xhrout').innerHTML = `Error ${result}`
            }
        )
    }

    function delPost() {
        lib1.delete('http://jsonplaceholder.typicode.com/posts/9', 
            function(result, data) {
                if ( result === 200 )
                    document.getElementById('xhrout').innerHTML = data
                else
                    document.getElementById('xhrout').innerHTML = `Error ${result}`
            }
        )
    }


    document.getElementById('btn1').addEventListener('click',getPost)
    document.getElementById('btn2').addEventListener('click',addPost)
    document.getElementById('btn3').addEventListener('click',updPost)
    document.getElementById('btn4').addEventListener('click',delPost)

    //Fetch API demo. 

    document.getElementById('btn5').addEventListener('click',getReposArrowFunc)

    function getReposArrowFunc() {
        fetch('https://api.github.com/users/hbrao/repos')
        .then( res => res.json())
        .then( data => {
            let output = ''
            data.forEach(function(repo){
                output += `<li>${repo.name}</li>`
            })
        document.getElementById('fetchout').innerHTML = output
        })
        .catch( error => {
            document.getElementById('fetchout').innerHTML = error
        })
    }

    //Promise Demo

    function getUsers() {
        lib2.get('https://jsonplaceholder.typicode.com/users')
        .then(users => {
            let data = ''
            users.forEach(usr => {
                data += `<li>${usr.name}</li>`
            })
            document.getElementById('promiseout').innerHTML = data
        })
    }

    const newUser = {
        name: 'John Doe',
        username: 'johndoe',
        email:'abc@gmail.com'
    }

    function addUser(){
        lib2.post('https://jsonplaceholder.typicode.com/users',newUser)
        .then(usr => {
            document.getElementById('promiseout').innerHTML = `${usr.name} created with id ${usr.id}`
        })
    }

    function delUser(){
        lib2.delete('https://jsonplaceholder.typicode.com/users/9')
        .then(data => {
            document.getElementById('promiseout').innerHTML = data
        })
    }


    document.getElementById('btn6').addEventListener('click',getUsers)
    document.getElementById('btn7').addEventListener('click',addUser)
    document.getElementById('btn8').addEventListener('click',delUser)


    //Async | Await demo 

    function getUsers2(){
    lib3.get('https://jsonplaceholder.typicode.com/users')
    .then(users => {
            let out = ''
            users.forEach(usr => {
            out += `<li>${usr.name}</li>`
            })
            document.getElementById('asyncout').innerHTML = out
    })
    }

    const newUser2 = {
        name: 'Johns Doe',
        username: 'johnsdoe',
        email:'abcd@gmail.com'
    }

    function addUser2(){
        lib3.post('https://jsonplaceholder.typicode.com/users', newUser2)
        .then(usr => {
            document.getElementById('asyncout').innerHTML = `user created with id ${usr.id}`
        })
    }

    document.getElementById('btn9').addEventListener('click',getUsers2)
    document.getElementById('btn10').addEventListener('click',addUser2)


    // OAuth2.0 demo

    function getToken() {
        var auth = btoa('username:password');
        console.log(auth);

        fetch('https://idcs-6db8bcfa3ac7450e89e700f1290c9846.identity.preprod.oraclecloud.com/oauth2/v1/token', {
            method : 'POST',
            body: 'grant_type=password&username=sranard&password=Welcome1&scope=urn:opc:resource:fusion:oracle:sales-common/',
            headers: {
                'Authorization': 'Basic ' + auth,
                'Content-Type' : 'application/x-www-form-urlencoded',
                'charset' : 'UTF-8'
            }
        }).then(  (res) => {
            return res.json()
        }).then ( (data) => {
            document.getElementById('authtoken').innerHTML = `Bearer ${data.access_token}`;
        }).catch( (err) => {
            console.log(err)
            document.getElementById('authtoken').innerHTML = `${err}`;
        })
    }

    document.getElementById('btn11').addEventListener('click', getToken)
})