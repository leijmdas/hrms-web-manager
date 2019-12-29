<template>
    <el-container style="height:100%">
        <el-header class="header" style="height: 70px;">
            <router-link :to="{path:'/dashboard'}">
                <div class="logo">
                    <img src="../../assets/logo.png" style="height: 40px;">
                    <p>
                        <span style="font-size: 18px;">东兴旺ERP系统</span>
                        <span style="font-size: 12px;">DXW ERP SYSTEM</span>
                    </p>
                </div>
            </router-link>
            <!--<div class="navLocation">-->
            <!--&lt;!&ndash;<hamburger :isActive="!collapse" :toggleClick="onToggle" title="展开或折叠菜单"></hamburger>&ndash;&gt;-->
            <!--<el-breadcrumb>-->
            <!--<el-breadcrumb-item-->
            <!--v-for="item in currentNodePaths"-->
            <!--:key="item.name"-->
            <!--&gt;{{(item.meta||{}).title}}-->
            <!--</el-breadcrumb-item>-->
            <!--</el-breadcrumb>-->
            <!--</div>-->
            <nav-panel></nav-panel>
        </el-header>
        <el-container>
            <el-aside id="aside" :style="collapse?'width:65px':'width:200px'" :collapse="collapse">
                <menu-panel ref="menuPanel"></menu-panel>
            </el-aside>
            <el-container>
                <!--tab切换栏-->
                <el-header id="navTab" class="navTab">
                    <div style="width:100%;border-left:5px solid #208BEF">
                        <el-tabs v-model="currentTab" type="card" @tab-remove="onTabRemove" @tab-click="onTabClick">
                            <el-tab-pane v-for="(item) in tabs" :key="item.name" :name="item.name"
                                         :closable="item.closable">
                                <span slot="label">{{item.title}}</span>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-header>
                <!--内容区-->
                <el-main id="mainContainer" v-loading="loading" element-loading-text="loading ..."
                         element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)">
                    <!--<keep-alive>-->
                    <!--<router-view id="mainView" v-if="$route.meta.keepAlive" ref="defaultRootView"></router-view>-->
                    <!--</keep-alive>-->
                    <router-view id="mainView" v-if="!$route.meta.keepAlive" ref="defaultRootView"></router-view>
                </el-main>
                <div class="copyright">Copyright © 昆龙信息服务公司, All Rights Reserved.</div>
            </el-container>
        </el-container>
    </el-container>
</template>

<style lang="less" rel="stylesheet/less">
    .header {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 0 15px;
        line-height: 70px;
        background-color: #00438A;

        .el-menu-item {
            height: 40px;
            line-height: 40px;
        }

        .el-submenu .el-submenu__title {
            height: 40px;
            line-height: 40px;
        }

        .el-badge__content {
            top: 10px;
        }

        .el-breadcrumb {
            line-height: 40px;
        }
    }

    .logo {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        p {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-left: 18px;
            color: #FFFFFF;

            span {
                line-height: 1;
            }
        }
    }

    #aside {
        background-color: #06274B;
        opacity: 0.95;

        .el-menu {
            border-right: none;
        }

        .menu {
            border-right: none;
            margin-top: 5px;
        }

        .el-menu-demo.el-menu li {
            color: rgba(255, 255, 255, 0.5);
        }

        li.is-opened {
            li.is-active {
                background-color: #208BEF !important;
            }
        }
    }

    .navLocation {
        float: left;
        color: white;
        margin-left: 50px;
        margin-top: 5px;
        line-height: 35px;

        .hamburger {
            fill: #409eff;
        }

        .el-breadcrumb {
            margin-top: -40px;
            color: white;
            margin-left: 25px;
        }
    }

    .el-main {
        padding: 2px 5px;
        background: rgb(245, 247, 249);
        //margin-top:38px;
    }

    #navTab {
        //position:absolute;
        //width:100%;
        margin-top: 2px;
        padding: 0 5px;
        height: 38px !important;

        .el-tabs__header {
            margin: 0 0;
        }

        .el-tabs__item {
            height: 32px;
            line-height: 32px;
        }

        .el-tabs__nav-wrap {
            background: #e9eae9;
            //border-bottom: 1px solid #409eff;
            border-bottom: 1px solid #fff;
        }

        .el-tabs__nav {
            background: #fff;
            // -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12),
            //   0 0 3px 0 rgba(0, 0, 0, 0.04);
            // background: #fff;
            // border-bottom: 1px solid #d8dce5;
            // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
        }
    }

    .navTab .el-tabs--card > .el-tabs__header .el-tabs__item {
        margin: 0px 1px;
        border: 1px solid rgb(220, 223, 230);
        color: #999;
    }

    .navTab .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
        //background: #28ac49;
        background: #208BEF;
        color: white;
    }

    .el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
        border-bottom: 2px solid #409eff;
        color: #303133;
    }

    /* .el-aside {
      color: #333;
    } */
    .copyright {
        height: 30px;
        background: #f4f8fb;
        color: gray;
        text-align: center;
        line-height: 30px;
    }
</style>

<script>
    import {routers} from '@/router';
    import {bus} from '@/utils';
    import NavPanel from './NavPanel';
    import MenuPanel from './MenuPanel';
    import Hamburger from './Hamburger';

    function resizeMainView() {
        let $mainContainer = document.getElementById('mainContainer');
        let $mainTab = document.getElementById('navTab');
        let height = $mainContainer.offsetHeight - $mainTab.offsetHeight;

        // document.getElementById("mainView").style.height = height - 80 + "px";
    }

    export default {
        components: {NavPanel, MenuPanel, Hamburger},
        data() {
            return {
                collapse: false,
                currentNodePaths: [],
                currentTab: '',
                tabs: [],
                loading: false
            };
        },
        watch: {
            $route() {
                this.activeTab();
            }
        },
        methods: {
            flushBreadcrumb() {
                let paths = [];

                function getNodePath(r, name) {
                    if (!r) {
                        return;
                    }
                    paths.push(r)
                    if (r.name != undefined && r.name == name) {
                        throw new Error('find'); // 查询到，即中断跳出
                    }
                    if (r.children && r.children.length > 0) {
                        for (let i = 0, l = r.children.length; i < l; i++) {
                            getNodePath(r.children[i], name)
                        }
                    }
                    paths.pop();
                }

                let name = this.currentTab;
                try {
                    for (let i = 0, l = routers.length; i < l; i++) {
                        getNodePath(routers[i], name);
                    }
                } catch (e) {
                }

                this.currentNodePaths = paths;
            },
            onToggle() {
                this.collapse = !this.collapse;
                this.$refs.menuPanel.toggoleCollapse(this.collapse);
            },
            isTabClosable(tab) {
                console.log(tab);
            },
            getTab(name) {
                let rs = this.tabs.filter(tab => tab.name == name);
                return rs.length > 0 ? rs[0] : null;
            },
            activeTab() {
                this.loading = true;
                const r = this.$route;
                this.tabs.forEach(t => t.depth++);
                if (r) {
                    let closable = (r.meta || {}).closable;
                    if (closable === undefined) {
                        closable = true;
                    }
                    let tab = this.getTab(r.name);
                    if (!tab) {
                        tab = {
                            title: r.meta.title,
                            name: r.name,
                            query: r.query,
                            params: r.params,
                            depth: 0,
                            closable: closable
                        };

                        if (!r.query._current) {
                            this.tabs.push(tab);
                        }
                    }
                    tab.depth = 0; // 最先
                    if (!r.query._current) {
                        this.currentTab = tab.name;
                    }
                    this.$nextTick(() => {
                        resizeMainView();
                        // debugger
                        this.$refs.defaultRootView.$emit('init', r.query);
                        this.loading = false;
                    });
                    // 显示导航
                    this.flushBreadcrumb();
                }
            },
            onTabClick(tab) {
                this.tabs.forEach(t => t.depth++);
                tab.depth = 0;

                this._onTabClick(tab.name);
            },
            _onTabClick(name) {
                let rs = this.tabs.filter(_tab => _tab.name === name);
                this.$router.push({
                    name: name,
                    query: rs[0].query,
                    params: rs[0].params
                });
            },
            /**
             * tab移除事件
             * @param name
             */
            onTabRemove(name) {
                console.log(name);
                for (let i = 0, len = this.tabs.length; i < len; i++) {
                    let t = this.tabs[i];
                    if (t.name === name) {
                        this.tabs.splice(i, 1);
                        break;
                    }
                }
                let minDepthTab = null;
                for (let i = 0, l = this.tabs.length; i < l; i++) {
                    let t = this.tabs[i];
                    if (minDepthTab == null || minDepthTab.depth > t.depth) {
                        minDepthTab = t;
                    }
                }
                if (!minDepthTab) {
                    this.$router.push('/');
                } else {
                    this._onTabClick(minDepthTab.name);
                }
            },
            toRouter(routerOpt, closeCurrentFlag = true) {
                if (closeCurrentFlag) {
                    this.onTabRemove(this.currentTab);
                }
                this.$router.push(routerOpt);
            },
            goback() {
                this.onTabRemove(this.currentTab);
            },
            flush() {
                let q = Object.assign({}, this.$route.query);
                q._r = Math.random();
                this.$router.replace({name: this.$route.name, query: q, params: this.$route.params});
            }
        },
        created() {
            const loadingOption = {
                lock: true,
                text: '正在提交...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            };
            let loading = null;
            bus.$on('request:start', config => {
                if (!config.openLoading) {
                    return;
                }
                // 发起请求时调起loading
                if (config.method == 'post' && !loading) {
                    loading = this.$loading(loadingOption);
                } else {
                    this.loading = true;
                }
            });
            bus.$on('request:end', config => {
                // 结束请求时关闭loading
                if (!config.openLoading) {
                    return;
                }
                this.loading = false;
                _.debounce(tryCloseFullLoading, 150)(config);
            });

            const tryCloseFullLoading = (config) => {
                if (config.method == 'post') {
                    loading && loading.close();
                    loading = null;
                }
            };
        },
        mounted() {
            this.activeTab();
            this.$bus.$on('app:toRouter', this.toRouter);
            this.$bus.$on('app:goback', this.goback);
            this.$bus.$on('app:flush', this.flush);

            bus.$emit('app:domain:selected', 'dongxw');
            window.onresize = () => {
                resizeMainView();
            };
        }
    };
</script>
