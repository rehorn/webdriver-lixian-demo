var webdriverio = require('webdriverio');

var options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

var account = '**@**.com';
var passwd = '***';

var link = 'magnet:?xt=**';

var fs = require('fs');

var cookies = [];

try {
    cookies = require('./_cookie_.js');
} catch (e) {}

var client = webdriverio
    .remote(options)
    .init()
    .url('http://115.com/static/js/jquery.js');

if (cookies.length == 0) {
    client.setValue('input[name="account"]', account)
        .setValue('input[name="passwd"]', passwd)
        .click('a#js-submit')
        .pause(1000)
        .url('http://115.com/?tab=offline&mode=wangpan')
        .getCookie(function(err, cookies) {
            var str = 'module.exports=' + JSON.stringify(cookies, null, 4);
            fs.writeFile('./_cookie_.js', str, function(err) {
                if (err) throw err;
            });
        })
} else {
    cookies.forEach(function(ck) {
        client.setCookie(ck);
    });

    client.url('http://115.com/?tab=offline&mode=wangpan');
}

client.execute(function() {
    document.querySelector('iframe[rel=wangpan]').setAttribute('name', 'wangpan');
    document.querySelector('iframe[rel=wangpan]').setAttribute('id', 'wangpan');
});

// TODO: pause to wait frame loaded
client.pause(10000)
    .frame('wangpan')
    .click('a#js_link_pro_btn')
    .frame(null)
    .waitFor('input#js_offline_new_add')
    .setValue('input#js_offline_new_add', link)
    .click('a[data-btn=start]')
    .end();
