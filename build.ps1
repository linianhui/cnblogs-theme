sass --style compressed `
     ./src/style/_.scss:./dist/lnh.cnblogs.css `
     ./src/style/mobile/mobile.scss:./dist/lnh.cnblogs.mobile.css

Copy-Item -Path ./src/js/lnh.cnblogs.js `
          -Destination ./dist/lnh.cnblogs.js