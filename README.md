## webdriver-lixian-demo
----

auto lixian download robot demo using webdriver (phantomjs/casperjs/selenium etc) 


#### background
----
- what's webdriver?
> 

#### requirements
----
* nodejs & mac 

#### phantomjs/casperjs demo
----
##### install phantomjs & casperjs
```
brew install casperjs --devel
```

##### run casperjs demo
```
casperjs casperjs-115.js {http/ftp/magnet link}
```


#### selenium demo
----
##### install selenium server & webdriverio client
```
npm install --production selenium-standalone@latest -g
npm install webdriverio
```


##### run selenium demo
- start selenium
```
start-selenium
```
- run node test
```
node webdriverio-115.js {http/ftp/magnet link}
```