sass ./src/style/_.scss ./dist/lnh.cnblogs.css --style compressed --sourcemap=none --no-cache

sass ./src/style/mobile/mobile.scss ./dist/lnh.cnblogs.mobile.css --style compressed --sourcemap=none --no-cache

Copy-Item -Path ./src/js/lnh.cnblogs.js -Destination ./dist/lnh.cnblogs.js