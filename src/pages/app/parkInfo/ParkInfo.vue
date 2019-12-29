<template>
    <div class="park-info">
        <div class="park-info__search">
            <p class="title">实时状态</p>
            <el-form label-width="64px" inline>
                <el-form-item label="停车场">
                    <el-input type="text" autocomplete="off" placeholder="请输入停车场名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="medium">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="park-info__content">
            <div class="park-info__baseInfo">
                <p class="title">基本信息</p>
                <div class="park-info__baseInfo-arg">
                    <span>总车位：180个</span>
                    <span>已安装：124个</span>
                    <span>正常使用：66个</span>
                    <span>异常状态：10个</span>
                </div>
            </div>
            <div class="park-info__showPark">
                <p class="title">泊位展示</p>
                <div class="park-info__showPark-area">
                    <p class="area-title">B1楼A区</p>
                    <div class="area-list">
                        <div class="area-item">
                            <div class="area-item-box has-red-border">
                                <span class="ele-icon el-icon-ipcar"></span>
                                <span class="ele-icon el-icon-ipdichi small break"></span>
                            </div>
                            <p>A001有车</p>
                            <p>电量15%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-red-border"></div>
                            <p>A002空位</p>
                            <p>电量50%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-green-border">
                                <span class="ele-icon el-icon-ipcar"></span>
                            </div>
                            <p>A003有车</p>
                            <p>电量100%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-red-border">
                                <span class="ele-icon el-icon-ipcar"></span>
                            </div>
                            <p>A004有车</p>
                            <p>电量80%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-green-border">
                                <span class="ele-icon el-icon-ipcar"></span>
                            </div>
                            <p>A005有车</p>
                            <p>电量100%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-green-border">
                                <span class="ele-icon el-icon-ipcar"></span>
                            </div>
                            <p>A006有车</p>
                            <p>电量81%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-green-border"></div>
                            <p>A007空位</p>
                            <p>电量100%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-red-border">
                                <span class="ele-icon el-icon-ipultrasonicbreak small off"></span>
                            </div>
                            <p>A008空位</p>
                            <p>电量90%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-green-border"></div>
                            <p>A009空位</p>
                            <p>电量40%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-red-border">
                                <span class="ele-icon el-icon-ipcar"></span>
                                <span class="ele-icon el-icon-ipultrasonicbreak small off"></span>
                            </div>
                            <p>A010有车</p>
                            <p>电量60%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-green-border"></div>
                            <p>A011空位</p>
                            <p>电量1%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-green-border"></div>
                            <p>A012空位</p>
                            <p>电量18%</p>
                        </div>
                    </div>
                </div>
                <div class="park-info__showPark-area">
                    <p class="area-title">B1楼B区</p>
                    <div class="area-list">
                        <div class="area-item">
                            <div class="area-item-box has-green-border"></div>
                            <p>B001空位</p>
                            <p>电量10%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-red-border">
                                <span class="ele-icon el-icon-ipdichi small break"></span>
                            </div>
                            <p>B002有车</p>
                            <p>电量50%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-green-border"></div>
                            <p>B003空位</p>
                            <p>电量44%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-green-border"></div>
                            <p>B004空位</p>
                            <p>电量34%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-red-border">
                                <span class="ele-icon el-icon-ipcar"></span>
                                <span class="ele-icon el-icon-ipwifibreak small break"></span>
                            </div>
                            <p>B005有车</p>
                            <p>电量27%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-green-border"></div>
                            <p>B006空位</p>
                            <p>电量65%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-green-border"></div>
                            <p>B007空位</p>
                            <p>电量450%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-green-border"></div>
                            <p>B008空位</p>
                            <p>电量80%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-green-border">
                                <span class="ele-icon el-icon-ipcar"></span>
                            </div>
                            <p>B009有车</p>
                            <p>电量90%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-green-border">
                                <span class="ele-icon el-icon-ipcar"></span>
                            </div>
                            <p>B010有车</p>
                            <p>电量53%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-green-border">
                                <span class="ele-icon el-icon-ipcar"></span>
                            </div>
                            <p>B011有车</p>
                            <p>电量99%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-red-border">
                                <span class="ele-icon el-icon-ipwifibreak off small"></span>
                            </div>
                            <p>B012空位</p>
                            <p>电量64%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-green-border"></div>
                            <p>B013空位</p>
                            <p>电量75%</p>
                        </div>
                        <div class="area-item">
                            <div class="area-item-box has-green-border"></div>
                            <p>B014空位</p>
                            <p>电量21%</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="park-info__sample">
                <p class="title">图示</p>
                <div class="park-info__sample-list">
                    <div class="park-info__sample-item">
                        <span class="sample-box has-red-border"></span>
                        <span class="sample-text">空位故障</span>
                    </div>
                    <div class="park-info__sample-item">
                        <span class="sample-box has-green-border"></span>
                        <span class="sample-text">空位正常</span>
                    </div>
                    <div class="park-info__sample-item">
                        <span class="sample-box">
                            <span class="ele-icon el-icon-ipwifibreak break"></span>
                        </span>
                        <span class="sample-text">WiFi故障</span>
                    </div>
                    <div class="park-info__sample-item">
                        <span class="sample-box">
                            <span class="ele-icon el-icon-ipdichi break"></span>
                        </span>
                        <span class="sample-text">地磁异常</span>
                    </div>
                </div>
                <div class="park-info__sample-list">
                    <div class="park-info__sample-item">
                        <span class="sample-box has-red-border">
                            <span class="ele-icon el-icon-ipcar"></span>
                        </span>
                        <span class="sample-text">有车故障</span>
                    </div>
                    <div class="park-info__sample-item">
                        <span class="sample-box has-green-border">
                            <span class="ele-icon el-icon-ipcar"></span>
                        </span>
                        <span class="sample-text">有车正常</span>
                    </div>
                    <div class="park-info__sample-item">
                        <span class="sample-box">
                            <span class="ele-icon el-icon-ipwifibreak off"></span>
                        </span>
                        <span class="sample-text">WiFi断开</span>
                    </div>
                    <div class="park-info__sample-item">
                        <span class="sample-box">
                            <span class="ele-icon el-icon-ipultrasonicbreak off"></span>
                        </span>
                        <span class="sample-text">超声波故障</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'ParkInfo'
    }
</script>

<style lang="less">
    .park-info {
        &__search {
            height: 90px;
            padding: 20px;
            margin-bottom: 10px;
            background-color: #fff;

            .title {
                margin-bottom: 30px;
            }

            .el-form-item__label {
                height: 36px;
                line-height: 36px;
                color: #000 !important;
            }

            .el-input--mini .el-input__inner {
                width: 220px;
                height: 36px;
                margin-right: 30px;
                line-height: 36px;
            }
        }

        &__content {
            padding: 20px;
            background-color: #fff;
        }

        &__baseInfo {
            margin-bottom: 28px;

            .title {
                margin-bottom: 30px;
            }

            &-arg {
                display: flex;
                justify-content: flex-start;

                span {
                    margin-right: 60px;
                    font-size: 16px;
                    color: #333333;
                    letter-spacing: 0;
                }
            }
        }

        &__showPark {
            margin-bottom: 15px;

            &-area {
                margin-bottom: 10px;

                .area-title {
                    height: 34px;
                    line-height: 34px;
                    margin-bottom: 20px;
                    font-size: 16px;
                    padding-left: 32px;
                    color: #000;
                    background-color: rgba(32, 139, 239, 0.15);
                }

                .area-list {
                    display: flex;
                    justify-content: flex-start;

                    .area-item {
                        width: 100px;
                        height: 120px;
                        margin-right: 20px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;

                        &-box {
                            position: relative;
                            width: 96px;
                            height: 60px;
                            margin-bottom: 10px;
                            text-align: center;
                            line-height: 60px;
                            border-width: 2px !important;
                            border-radius: 4px !important;

                            .el-icon-ipcar {
                                font-size: 26px;
                                line-height: 60px;
                            }
                        }

                        & > p {
                            font-size: 16px;
                            color: #000;
                            line-height: 1.4;
                        }
                    }
                }

            }

            .title {
                margin-bottom: 20px;
            }
        }

        &__sample {
            .title {
                margin-bottom: 15px;
            }

            &-list {
                display: flex;
                justify-content: flex-start;
                align-items: center;
            }

            &-item {
                display: flex;
                width: 120px;
                line-height: 20px;
                margin-right: 20px;
                margin-bottom: 10px;

                .sample-box {
                    display: inline-block;
                    width: 40px;
                    height: 20px;
                    text-align: center;
                    line-height: 20px;
                }

                .sample-text {
                    margin-left: 4px;
                    font-size: 14px;
                    color: #666;
                    letter-spacing: 0;
                }

                .ele-icon {
                    line-height: 20px;
                }
            }
        }

        .title {
            font-size: 16px;
            color: #000;
            letter-spacing: 0;
            font-weight: bold;
        }

        .break {
            color: #EB4B3E;
        }

        .off {
            color: #FF8431;
        }

        .el-icon-ipcar {
            color: #1BAE2E;
        }

        .small {
            position: absolute;
            left: 5px;
            top: 5px;
            font-size: 12px;
        }

        .has-red-border {
            border: 1px solid #EB4B3E;
            border-radius: 3px;
        }

        .has-green-border {
            border: 1px solid #1BAE2E;
            border-radius: 3px;
        }
    }
</style>
