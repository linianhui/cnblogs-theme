set -x

sass --style compressed \
     ./src/style/_.scss:./dist/lnh.cnblogs.css \
     ./src/style/mobile/mobile.scss:./dist/lnh.cnblogs.mobile.css

cp ./src/js/lnh.cnblogs.js ./dist/lnh.cnblogs.js