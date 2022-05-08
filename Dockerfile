#FROM是所有Dockerfile文件的必须，并且开头就要写明，意思是依赖的环境，我们的项目依赖node镜像，所以要写node，10是版本号。
#不用管我好像没有pull node image啊，没关系这里写了，就会自动帮你下载
FROM node:12
# Dockerfile的概念就是 build一个镜像用的 什么依赖都在这里写
# 起注释的作用
LABEL maintainer = "zl <zhangle-cn@qq.com>"
# 创建容器中的工作目录，容器是一个干净的目录什么都没有，你想要放一个项目肯定要创建一些目录
#为了简单，这里创了一个根目录下面的app目录, 每次构建镜像都删除app目录，其实没必要因为你每次构建镜像都是一个感觉的
RUN rm -rf /app
RUN mkdir /app
# 创建工作目录就是容器内部的目录 必须指定
WORKDIR /app

# 安装项目依赖  将当前目录所有文件拷贝到上面创建的容器工作目录 忽略.dockerignore的文件 copy 和 add都会忽略
COPY . /app
# 安装yarn 
# RUN curl -o- -L https://yarnpkg.com/install.sh | bash
# RUN $HOME/.yarn/bin/yarn install
# RUN yarn install
RUN npm install
RUN npm run build
RUN rm -rf !(app.js|node_modules)
#ENV PORT=4403 NODE_ENV=pro
# 该镜像生产的容器内的端口号，相当于后续docker run -p 8827: 9930的9930
EXPOSE 3636

#容器生成时 执行 yarn run prd启动项目
CMD node app.js