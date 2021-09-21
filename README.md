# 1. 用途
Theme for <http://linianhui.cnblogs.com> .

# 2. 原理

本项目会编译出3个文件 :
1. `lnh.cnblogs.js` : 一些自定义的js脚本。
2. `lnh.cnblogs.css` : PC端样式文件。
3. `lnh.cnblogs.mobile.css` : 为移动端适配优化的样式文件。

把这三个文件添加到博客的配置中即可。

## 2.1 博客设置

主题 : `LessIsMore`

页首代码
```html
<script type="text/javascript">$("#mobile-style").remove();</script>
<link href="//cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/>
<link href="//files.cnblogs.com/files/linianhui/lnh.cnblogs.css" rel="stylesheet"/>
```

页脚代码
```html
<script type="text/javascript" src="//files.cnblogs.com/files/linianhui/lnh.cnblogs.js"></script>
```

# 3. 自定义

本项目使用`sass`https://github.com/sass 进行编译。

1. node用户 : `npm install -g sass`
2. docker用户 : `docker pull ghcr.io/linianhui/sass:1.23.7`(https://github.com/linianhui/docker/pkgs/container/sass)

热更新（结合Chrome调试用）

1. pwsh : [watch.ps1](/watch.ps1)
2. bash : [watch.sh](/watch.sh)

编译 

1. pwsh : [build.ps1](/build.ps1)
2. bash : [build.sh](/build.sh)
3. docker : 
    ```sh
    docker run --rm \
               --volume $(pwd):/build \
               --workdir /build \
               ghcr.io/linianhui/sass:1.23.7 \
               sh build.sh 
    ```
