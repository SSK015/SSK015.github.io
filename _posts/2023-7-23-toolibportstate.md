---
layout: post
title: "用infiniband提供的ibportstate命令调整ib网卡链路速度 Use command'ibportstate' offered by infiniband to change link speed"
date:   2023-7-23
tags: [RDMA, research]
comments: true
author: LtyinHUST
---

## Chinese:
### 最近遇到一个需要改变rdma网卡最大带宽的需求，有两种办法可以实现：opensm和ibportstate。

最终选择看似简单方便的后者，在实际使用中踩了不少坑。这个工具的本源逻辑有点奇特，**而且没有很详细的官方文档。**

主要用了以下几个参数：
```shell
speed <int>(1/3/7)
espeed <int>(30/31)
width <int>(1/3)
reset
```
在我的ib网卡 connectx-4上，分别允许2.5,5,10Gps三种速率和1x和4x两种带宽。

**需要注意**：ibstat观察到的Rate只是一个计算得到的数值，实际上不同的Rate数值可能是使用了不同的传输协议（QDR/FDR/DDR）。

先ibstat查看目前网卡端口情况：

```shell
sudo ibportstate <lid> <port> query
```

# 图待补

当需要改变网卡链路速度时，先要reset。命令格式如下：

```shell
sudo ibportstate <lid> <port> speed x espeed x width x reset.
```

再次输入命令：
```shell
sudo ibportstate <lid> <port> 即可刷新网卡配置
```

如果此时出现网卡一直处于down & polling 状态的情况：
```shell

```

再次查看ibstat：


配置成功！
