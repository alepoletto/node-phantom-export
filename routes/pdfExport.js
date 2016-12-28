const express = require('express');
const router = express.Router();
const phantom = require("phantom");
const Horseman = require('node-horseman');
const fs = require('fs');
const tmpdir = require('os').tmpdir();


// middleware that is specific to this router
router.use((req, res, next) => {
  req.start = Date.now();
  next();
});

router.get('/', function (req, res) {

  const settings = {
    headers: {
      "Export": "node"
    }
  };

  const filename = 'export2.pdf';
  const file = temp + '/' + filename;
  const path = req.query.url;
  const origin = req.headers.origin;
  const url = origin + "/#" + path;
  console.log(url);
  res.header('Content-disposition', 'inline; filename="' + filename +'"');
  res.header('Content-type', 'application/pdf');
  phantom.create(['--ignore-ssl-errors=yes', '--load-images=yes']).then(function (ph) {
    ph.createPage().then(function (page) {
      page.property('viewportSize', {width: 1540, height: 760}).then(function() {
      });

      page.setting('javascriptEnabled', true);
      page.open(url, settings).then(function (status) {
        page.evaluate(function() {
          var arr = document.getElementById("loginUser");
          if(arr) {
            console.log(' entro');
            arr.elements["loginEmail"].value="alex@dra.com";
            arr.elements["loginPassword"].value="neon123*";
            arr.submit();
          }
          return;
        }).then(function() {
          page.render(filename);
          let ivl = setInterval(function(){
            console.log(' executando moleke');
            fs.access(filename, function(err) {
              console.log(' ele tinha que dar');
              console.log(err);
              if (err) {
                console.log(' nao acabo');
              } else {
                clearInterval(ivl);
                res.download(filename, filename);
                page.close();
                ph.exit();
              }
            });
          }, 300);
        });

      });

      page.property('onLoadStarted').then(function() {
       loadInProgress = true;
       console.log('Loading started');
      });

      page.property('onLoadFinished').then(function() {
        loadInProgress = false;
        console.log('Loading finished');
      });

      });
    }).catch(error => {
        console.log(error);
        ph.exit();
    });

});

router.use((err,req, res) => {
  console.log(err);
  let time = Date.now() - req.start;
  console.log("time taken to render pdf: "+time);
});


module.exports = router;
