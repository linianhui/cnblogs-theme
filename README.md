# 1. Cnblogs Theme
Theme for http://linianhui.cnblogs.com .

# 2. 安装编译工具

使用`sass`https://github.com/sass 进行编译。

1. ruby用户 : `gem install sass`
2. node用户 : `npm install -g sass`
3. docker用户 : `docker pull lnhcode/sass`(https://hub.docker.com/r/lnhcode/sass)

# 3. 热更新（结合Chrome调试用）

1. pwsh : [watch.ps1](/watch.ps1)
2. bash : [watch.sh](/watch.sh)

# 4. 编译 

1. pwsh : [build.ps1](/build.ps1)
2. bash : [build.sh](/build.sh)
3. docker : 
    ```sh
    docker run --rm \
               --volume $(pwd):/build \
               --workdir /build \
               lnhcode/sass \
               sh build.sh 
    ```

# 博客设置

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