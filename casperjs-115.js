var fs = require('fs');

var casper = require("casper").create({
    // verbose: true,
    // logLevel: 'debug',
    pageSettings: {
        loadImages: false, // The WebPage instance used by Casper will
        loadPlugins: false, // use these settings
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4'
    }
});

var account = '**@**.com';
var passwd = '***';
var link = casper.cli.args[0];

var cookieFileName = '_casper_cookie_.js';
var cookies = '';

try {
    cookies = fs.read(cookieFileName) || '';
} catch (e) {}

if (!cookies) {
    console.log('no cookies');
    // no cookies and login
    casper.start('http://www.115.com/?goto=http%3A%2F%2F115.com%2F%3Ftab%3Doffline%26mode%3Dwangpan', function() {
        this.fillSelectors('#js-login_form', {
            'input#js-account': account,
            'input#js-passwd': passwd
        }, false);
        this.thenClick('a#js-submit');
    });

    casper.then(function() {
        // casper.echo(this.page.cookies)
        var res = '';
        this.page.cookies.forEach(function(cookie) {
            res += [cookie.domain, 'TRUE', cookie.path, 'FALSE', cookie.expiry, cookie.name, cookie.value].join('\t') + '\r\n';
        });
        fs.write(cookieFileName, res, 'w');
    });

} else {
    console.log('has cookies');

    cookies = cookies.split("\r\n");
    cookies.forEach(function(cookie) {
        var detail = cookie.split("\t"),
            newCookie = {
                'name': detail[5],
                'value': detail[6],
                'domain': detail[0],
                'path': detail[2],
                'httponly': false,
                'secure': false,
                'expires': (new Date()).getTime() + 3600 * 24 * 30 /* <- expires in 1 month */
            };
        phantom.addCookie(newCookie);
    });

    casper.start('http://115.com/?tab=offline&mode=wangpan');
}

casper.thenEvaluate(function() {
    document.querySelector('iframe[rel="wangpan"]').setAttribute('name', 'wangpan');
    document.querySelector('iframe[rel="wangpan"]').setAttribute('id', 'wangpan');

    function getIframeIndex(iframe_id) {

        var iframes = document.getElementsByTagName('iframe');
        for (i = 0; i < iframes.length; i++) {
            if (iframes[i].id == iframe_id) {
                return i;
            }
        }
        return null;
    }
    // call function pass id - 
    var iframe_index = getIframeIndex('wangpan');

    console.log(document.querySelector('iframe[rel="wangpan"]').getAttribute('name'));
    console.log(iframe_index);
});

casper.then(function() {
    // this.withFrame('wangpan', function() {
    // iframe_index - 1
    this.withFrame(3, function() {
        this.click('a#js_link_pro_btn');
    });
});

casper.waitForSelector('input#js_offline_new_add', function() {
    this.fillSelectors('.offline-container', {
        'input#js_offline_new_add': link
    })
});

casper.thenClick('a[data-btn=start]')

casper.run();

casper.on('remote.message', function(msg) {
    // this.echo('remote message caught: ' + msg);
});

casper.on("page.error", function(msg, trace) {
    // this.echo("Page Error: " + msg, "ERROR");
});
