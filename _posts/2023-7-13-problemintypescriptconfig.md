---
layout: post
title: "ubuntu20.04配置typescript遇到的一个问题以及解决方法"
date:   2023-7-13
tags: [env, configuration]
comments: true
author: LtyinHUST
---

### 这几天心血来潮，想学typescript。先要配它的环境，在我的ubuntu20.04虚拟机上配环境。用apt-get工具分别以-g命令下载nodejs和npm之后，用tsc编译.ts文件时出现以下报错：

```shell
xyw@ubuntu:~/Documents/Code/Learning-typescript-from-scratch/src$ tsc hello.ts 
/usr/local/lib/node_modules/typescript/lib/tsc.js:93
  for (let i = startIndex ?? 0; i < array.length; i++) {
                           ^

SyntaxError: Unexpected token ?
    at Module._compile (internal/modules/cjs/loader.js:723:23)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:789:10)
    at Module.load (internal/modules/cjs/loader.js:653:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:593:12)
    at Function.Module._load (internal/modules/cjs/loader.js:585:3)
    at Module.require (internal/modules/cjs/loader.js:692:17)
    at require (internal/modules/cjs/helpers.js:25:18)
    at Object.<anonymous> (/usr/local/lib/node_modules/typescript/bin/tsc:2:1)
    at Module._compile (internal/modules/cjs/loader.js:778:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:789:10)

```

尝试用npm重新安装typescript，出现以下报错:

```shell
root@ubuntu:/home/xyw/Documents/Code# npm install -g typescript
[..................] / rollbackFailedOptional: verb npm-session 072b7b0747965df0
[..................] / rollbackFailedOptional: verb npm-session 072b7b0747965df0
/usr/local/bin/tsc -> /usr/local/lib/node_modules/typescript/bin/tsc
/usr/local/bin/tsserver -> /usr/local/lib/node_modules/typescript/bin/tsserver
npm WARN notsup Unsupported engine for typescript@5.1.6: wanted: {"node":">=14.17"} (current: {"node":"10.19.0","npm":"6.14.4"})
npm WARN notsup Not compatible with your version of node/npm: typescript@5.1.6
```

原来是apt自动装的这个包版本太旧了，跟ts版本冲突了。然而我们明明指定让他装最新版本的，怎么会是呢，？

##### 重装无果，最终选择配置nvm工具，再通过nvm工具安装新版本的nodejs(v16.6.0)，配置成功。

命令参考如下：
```shell
wget https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh # get nvm install shell
chmod +x install.sh
./install.sh
nvm install v16.6.0
```



