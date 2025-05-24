项目已经使用命令打包好了（5.24 18：22）放在dist文件夹里面，包含所有编译后的静态文件

你可以自行通过以下命令再次打包

``` sh
npm install
npm run build
```

项目中基本包含Dockerfile，使用nginx作为Web服务器来托管静态文件。

- 使用Docker构建镜像

``` sh
docker build -t xm-cfd:latest .
```

- 运行Docker容器 如果端口号被占用记得换一个端口号

``` sh
docker run -d -p 80:80 --name xm-cfd-container xm-cfd:latest
```

