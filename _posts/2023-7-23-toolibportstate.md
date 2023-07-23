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

```shell
ywxia@node24:~/datameasure$ ibstat
CA 'mlx4_0'
        CA type: MT4099
        Number of ports: 2
        Firmware version: 2.42.5000
        Hardware version: 1
        Node GUID: 0x000
        System image GUID: 0x000
        Port 1:
                State: Active
                Physical state: LinkUp
                Rate: 14
                Base lid: 6
                LMC: 0
                SM lid: 3
                Capability mask: 
                Port GUID: 
                Link layer: InfiniBand
        Port 2:
                State: Down
                Physical state: Polling
                Rate: 10
                Base lid: 0
                LMC: 0
                SM lid: 0
                Capability mask: 
                Port GUID: 
                Link layer: InfiniBand
```

当需要改变网卡链路速度时，先要reset。命令格式如下：

```shell
sudo ibportstate <lid> <port> speed x espeed x width x reset.
```

如：
```shell
ywxia@node24:~/datameasure$ sudo ibportstate 6 1 speed 7 width 1 espeed 30 reset
Initial CA/RT PortInfo:
# Port info: Lid 6 port 1
LinkState:.......................Active
PhysLinkState:...................LinkUp
Lid:.............................6
SMLid:...........................3
LMC:.............................0
LinkWidthSupported:..............1X or 4X
LinkWidthEnabled:................1X
LinkWidthActive:.................1X
LinkSpeedSupported:..............2.5 Gbps or 5.0 Gbps or 10.0 Gbps
LinkSpeedEnabled:................2.5 Gbps or 5.0 Gbps or 10.0 Gbps
LinkSpeedActive:.................10.0 Gbps
LinkSpeedExtSupported:...........14.0625 Gbps
LinkSpeedExtEnabled:.............14.0625 Gbps
LinkSpeedExtActive:..............14.0625 Gbps
Mkey:............................<not displayed>
MkeyLeasePeriod:.................0
ProtectBits:.....................0
# MLNX ext Port info: Lid 6 port 1
StateChangeEnable:...............0x00
LinkSpeedSupported:..............0x01
LinkSpeedEnabled:................0x01
LinkSpeedActive:.................0x00

After PortInfo set:
# Port info: Lid 6 port 1
LinkState:.......................Active
PhysLinkState:...................LinkUp
Lid:.............................6
SMLid:...........................3
LMC:.............................0
LinkWidthSupported:..............1X or 4X
LinkWidthEnabled:................1X
LinkWidthActive:.................1X
LinkSpeedSupported:..............2.5 Gbps or 5.0 Gbps or 10.0 Gbps
LinkSpeedEnabled:................2.5 Gbps or 5.0 Gbps or 10.0 Gbps
LinkSpeedActive:.................Extended speed
LinkSpeedExtSupported:...........14.0625 Gbps
LinkSpeedExtEnabled:.............0
LinkSpeedExtActive:..............14.0625 Gbps
Mkey:............................<not displayed>
MkeyLeasePeriod:.................0
ProtectBits:.....................0
```


再次输入命令：
```shell
sudo ibportstate <lid> <port> 即可刷新网卡配置
```

如：

```shell
ywxia@node24:~/datameasure$ sudo ibportstate 6 1
CA/RT PortInfo:
# Port info: Lid 6 port 1
LinkState:.......................Active
PhysLinkState:...................LinkUp
Lid:.............................6
SMLid:...........................3
LMC:.............................0
LinkWidthSupported:..............1X or 4X
LinkWidthEnabled:................1X
LinkWidthActive:.................1X
LinkSpeedSupported:..............2.5 Gbps or 5.0 Gbps or 10.0 Gbps
LinkSpeedEnabled:................2.5 Gbps or 5.0 Gbps or 10.0 Gbps
LinkSpeedActive:.................10.0 Gbps
LinkSpeedExtSupported:...........14.0625 Gbps
LinkSpeedExtEnabled:.............14.0625 Gbps
LinkSpeedExtActive:..............No Extended Speed
Mkey:............................<not displayed>
MkeyLeasePeriod:.................0
ProtectBits:.....................0
# MLNX ext Port info: Lid 6 port 1
StateChangeEnable:...............0x00
LinkSpeedSupported:..............0x01
LinkSpeedEnabled:................0x01
LinkSpeedActive:.................0x01
```

如果此时出现网卡一直处于down & polling 状态的情况：
```shell
sudo ibportstate <lid> <port> -C mlx4_0 -P <port> enable
```

再次查看ibstat：
```shell
ywxia@node24:~/datameasure$ ibstat
CA 'mlx4_0'
        CA type: MT4099
        Number of ports: 2
        Firmware version: 2.42.5000
        Hardware version: 1
        Node GUID: 
        System image GUID: 
        Port 1:
                State: Active
                Physical state: LinkUp
                Rate: 10 (FDR10)
                Base lid: 6
                LMC: 0
                SM lid: 3
                Capability mask: 
                Port GUID: 
                Link layer: InfiniBand
        Port 2:
                State: Down
                Physical state: Polling
                Rate: 10
                Base lid: 0
                LMC: 0
                SM lid: 0
                Capability mask: 
                Port GUID: 
                Link layer: InfiniBand
```

速度修改成功！
