<template>
    <div >
        <!--<div class="login_container&#45;&#45;png">-->
            <!--<img src="../assets/images/login/park-shared.png" alt="" style="left: 0px; top: 180px;">-->
            <!--<img src="../assets/images/login/GPS.png" alt="" style="left: 130px; top: 60px;">-->
            <!--<img src="../assets/images/login/park-manage.png" alt="" style="left: 130px; top: 300px;">-->
            <!--<img src="../assets/images/login/charge-manage.png" alt="" style="left: 260px; top: 180px;">-->
            <!--<img src="../assets/images/login/travel-manage.png" alt="" style="left: 390px; top: 60px;">-->
            <!--<img src="../assets/images/login/pay.png" alt="" style="left: 390px; top: 300px;">-->
        <!--</div>-->
        <!--<img block="center" style="width:100%;height:100%" src="../assets/dxw.png"/>-->
        <img block="center" style="width:100%;height:100%" src="../assets/images/main-bg.jpg"/>

    </div>


</template>

<style rel="stylesheet/less" lang='less'>
    .index-container {
        padding: 15px;

        &__card {
            display: flex;
            justify-content: flex-start;
            margin-bottom: 15px;

            &-item {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                width: 260px;
                height: 80px;
                margin-right: 20px;
                padding: 20px;
                background: #FFF;
                box-shadow: 0 2px 10px 0 rgba(0, 67, 138, 0.15);
                border-radius: 4px;

                img {
                    display: inline-block;
                    width: 80px;
                    height: 80px;
                }

                .text {
                    margin-left: 30px;
                    font-size: 12px;
                    color: #333333;
                    letter-spacing: 0;
                    line-height: 12px;

                    p {

                    }

                    .number {
                        font-size: 30px;
                        line-height: 54px;
                    }

                    .percent {
                        margin-right: 8px;
                    }
                }
            }

            &-item:last-child {
                margin-right: 0;
            }
        }

        &__info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;

            & > div {
                height: 295px;
                padding: 20px 36px;
            }

            &-line {
                flex-grow: 1;
                margin-right: 30px;
                background: #fff;
                padding: 20px 36px;

                .pie3-area {
                    width: 100%;
                    height: 290px;
                }

                .el-form-item--mini .el-form-item__label {
                    line-height: 36px;
                }

                .el-form-item__label {
                    color: #000;
                }

                .el-input--mini .el-input__inner {
                    width: 220px;
                    height: 36px;
                    line-height: 36px;
                }

                .el-form--inline .el-form-item {
                    margin-right: 40px;
                }
            }

            &-notice {
                flex-grow: 2;
                background: #fff;

                .list-content {
                    .item {
                        display: flex;
                        justify-content: space-between;
                        height: 30px;
                        line-height: 30px;

                        span {
                            color: #ddd;
                            line-height: 30px;
                        }

                        &-left {
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                        }

                        .keyword {
                            color: #333;
                        }

                        .page-view {
                            color: #999;
                        }

                        .top-num {
                            display: inline-block;
                            width: 16px;
                            height: 16px;
                            margin-right: 5px;
                            border-radius: 50%;
                            background: #ddd;
                            color: #fff;
                            font-size: 12px;
                            text-align: center;
                            line-height: 16px;
                        }

                        .el-icon {
                            font-size: 12px;
                        }
                    }
                }
            }

            &-title {
            }
        }

        &__chart {
            display: flex;
            justify-content: space-between;

            & > div {
                width: 442px;
                height: 230px;
                background: #fff;
                margin-right: 28px;
                padding: 20px 36px;
            }

            & > div:last-child {
                margin-right: 0;
            }

            .pie-area {
                width: 100%;
                height: 190px;
            }
        }

        .public-title {
            padding-bottom: 15px;
            font-size: 18px;
            color: #333333;
            font-weight: bold;
            border-bottom: 1px solid #ddd;
        }
    }
</style>

<script>
    export default {
        name: 'eCharts',
        data() {
            return {
                date: new Date().setTime(new Date().getTime() - 3600 * 1000 * 24),  // 默认展示昨天的时间
                option: {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'right',
                        y: 'center',
                        data: ['广州', '深圳', '北京', '上海', '香港']
                    },
                    series: [
                        {
                            name: '使用次数',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            color: ['#5493FA', '#01FBAE', '#FFCB00', '#FB4E44', '#5D4FE2'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '16',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [
                                {value: 335, name: '广州'},
                                {value: 310, name: '深圳'},
                                {value: 234, name: '北京'},
                                {value: 135, name: '上海'},
                                {value: 1548, name: '香港'}
                            ]
                        }
                    ]
                },
                option1: {
                    // title: {
                    //     text: '某站点用户访问来源',
                    //     subtext: '纯属虚构',
                    //     x: 'center'
                    // },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'right',
                        y: 'center',
                        data: ['广州', '深圳', '北京', '上海', '香港']
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '70%',
                            color: ['#5493FA', '#01FBAE', '#FFCB00', '#FB4E44', '#5D4FE2'],
                            data: [
                                {value: 335, name: '广州'},
                                {value: 310, name: '深圳'},
                                {value: 234, name: '北京'},
                                {value: 135, name: '上海'},
                                {value: 1548, name: '香港'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                },
                option2: {
                    color: ['#208BEF'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: ['微信', '支付宝', '银联', '余额', '好收', '财付通'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '使用量',
                            type: 'bar',
                            barWidth: '60%',
                            data: [10, 52, 200, 334, 390, 330]
                        }
                    ]
                },
                option3: {
                    color: ['#5493FA', '#08C2B7'],
                    tooltip: {
                        trigger: 'none',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    legend: {
                        data: ['入场数', '出场数'],
                        orient: 'vertical',
                        x: 'right',
                        y: 'center'
                    },
                    grid: {
                        top: 30,
                        left: 30
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLine: {
                                onZero: false,
                                lineStyle: {
                                    color: '#666'
                                }
                            },
                            axisPointer: {
                                label: {
                                    formatter: function (params) {
                                        return '出场数  ' + params.value + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                    }
                                }
                            },
                            data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
                        },
                        {
                            type: 'category',
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLine: {
                                onZero: false,
                                lineStyle: {
                                    color: '#999'
                                }
                            },
                            axisPointer: {
                                label: {
                                    formatter: function (params) {
                                        return '入场数  ' + params.value + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                    }
                                }
                            },
                            data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '入场数',
                            type: 'line',
                            xAxisIndex: 1,
                            smooth: true,
                            data: []
                        },
                        {
                            name: '出场数',
                            type: 'line',
                            smooth: true,
                            data: []
                        }
                    ]
                },
                myCharts3: null
            };
        },
        mounted() {
            this.init();
            this.getPie3Data();
        },
        methods: {
            init() {
                let myCharts = this.$echarts.init(document.getElementById('pie'));
                myCharts.setOption(this.option);
                let myCharts1 = this.$echarts.init(document.getElementById('pie1'));
                myCharts1.setOption(this.option1);
                let myCharts2 = this.$echarts.init(document.getElementById('pie2'));
                myCharts2.setOption(this.option2);
            },
            getPie3Data() {
                let that = this;
                let year = new Date(this.date).getFullYear();
                let month = new Date(this.date).getMonth() + 1;
                let date = new Date(this.date).getDate();
                let searchDate = year + '-' + month + '-' + date;
                let out = this.$api.ipark.AccessInfoService.getEchartsOut(1, searchDate); // 获取出场数据
                let entry = this.$api.ipark.AccessInfoService.getEchartsIn(1, searchDate); // 获取入场数据
                let promiseAll = Promise.all([entry, out]);
                promiseAll.then(function (res) {
                    res[0].unshift(0); // 添加00：00默认展示数据
                    res[1].unshift(0); // 添加00：00默认展示数据
                    that.option3.series[0].data = res[0];
                    that.option3.series[1].data = res[1];
                    that.myCharts3 = that.$echarts.init(document.getElementById('pie3'));
                    that.myCharts3.setOption(that.option3);
                });
            },
            search() {
                this.getPie3Data();
            }
        }
    }
</script>

