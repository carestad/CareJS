# CareJS
## The straightforward AJAX javascript framework

---
### GET request

`
care.xGet({
    url: 'http://example.com/somefile',
    vars: {
        arg1: 'foo',
        arg2: 'bar
    },
    handleAs: 'json',
    handler: foo,
    headers: {
        accept: 'application/xml'
    }
});
`


---
### JSONP request

`
care.jsonp({
    url: 'http://example.com/somefile.php',
    vars: {
        arg1: 'foo',
        arg2: 'bar'
    },
    jsonp: 'callback',
    handler: foo,
    headers: {
        accept: 'application/xml'
    }
});
`
