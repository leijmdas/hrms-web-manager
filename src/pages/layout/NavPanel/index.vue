<!-- 菜单 -->
<template>
    <div class="nav-top">
        <el-menu mode="horizontal" background-color="#00438A" text-color="#fff" active-text-color="#fff"
                 :default-active="domainIndex" @select="onDomainSelected">

            <el-menu-item index="domain_dongxw"><span class="ele-icon el-icon-ipyunyingguanli"></span>
                <span>ERP</span>
            </el-menu-item>

            <!--<el-menu-item v-show="isadmin=='true'" index="domain_parking"><span-->
                <!--class="ele-icon el-icon-ipyunyingguanli"></span><span>运营</span>-->
            <!--</el-menu-item>-->
            <!---->
            <!--<el-menu-item index="domain_maintenance"><span-->
                <!--class="ele-icon el-icon-ipyunyingbaobiao"></span><span>运维</span>-->
            <!--</el-menu-item>-->

            <el-menu-item v-show="isadmin=='true'" index="domain_sys"><span
                class="ele-icon el-icon-ipshezhi"></span><span>设置</span>
            </el-menu-item>
        </el-menu>

        <el-menu mode="horizontal" :default-active="activeIndex" background-color="#00438A" text-color="#fff"
                 active-text-color="#ffd04b">
            <el-menu-item index="2">
                <a href="http://120.79.98.67/" target="_blank" class="go-to">宏利达海棉</a>
            </el-menu-item>
            <el-menu-item index="0">
                <el-popover placement="bottom" width="300" trigger="hover">
                    <ul class="msgUL">
                        <li v-for="r in msgPage.data" :key="r.id" @click="onMsgClick(r.id)">
                            <a href="javascript:void(0)">{{r.title}}</a>
                            <span style="color: #a0a0a0;font-size: 12px;">{{r.msgOn}}</span>
                        </li>
                    </ul>
                    <el-alert title="" v-if="msgPage.total<1">暂无</el-alert>
                    <router-link to="/msg">
                        <el-button type="text">更多</el-button>
                    </router-link>

                    <div slot="reference">


                        <el-badge>
                            <span class="ele-icon el-icon-ipe-mail_icon info-icon"></span>
                            <span class="info-icon-text">消息中心</span>
                        </el-badge>
                    </div>
                </el-popover>
            </el-menu-item>
            <el-submenu index="1">
                <template slot="title">
                    <span class="ele-icon el-icon-ipyonghu"></span>
                    <span>{{user.realname}}</span>
                </template>
                <el-menu-item-group>
                    <template slot="title">--- 个人中心 ---</template>
                    <el-menu-item index="1-2" @click="onPersonalInfo">个人信息</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                    <template slot="title">--- 系统设置 ---</template>
                    <el-menu-item index="2-3" @click="onModifyPwd">修改密码</el-menu-item>
                    <el-menu-item index="2-4" @click="logout">退出登录</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
        <el-dialog title="个人信息" :visible.sync="personalInfoShowFlag" width="50%">
            <personal-info ref="personalInfoForm"></personal-info>
        </el-dialog>
        <el-dialog title="密码修改" :visible.sync="resetPwdDiagShowFlag" width="50%">
            <modify-pwd-panel ref="modifyPwdPanel" @saved="onModifyOk"></modify-pwd-panel>
        </el-dialog>
    </div>
</template>
<style lang="less">
    .nav-top {
        width: ~"calc(100% - 308px)";
        display: flex;
        justify-content: space-between;
        margin-left: 108px;

        .el-menu-item {
            width: 104px;
            height: 70px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            span {
                font-size: 14px;
                line-height: 1.5;
            }
        }

        .el-menu-item [class^="el-icon-"] {
            margin-right: 0;
        }

        .el-menu.el-menu--horizontal {
            border-bottom: none;
        }

        .el-menu--horizontal > .el-menu-item {
            border-bottom: none;
        }

        .el-menu--horizontal > .el-submenu .el-submenu__title {
            border-bottom: none;
        }

        .el-menu--horizontal > .el-menu-item.is-active {
            border-bottom: none;
            background-color: #06274B !important;
        }

        .el-submenu .el-submenu__title {
            height: 70px;
            line-height: 70px;
            padding: 0 10px;
            [class^="el-icon-"] {
                font-size: 16px;
            }

            span {
                font-size: 16px;
            }
        }

        .el-submenu__title * {
            vertical-align: baseline;
        }

        .el-badge {
            .info-icon {
                font-size: 16px;
            }
            span {
                height: 70px;
                line-height: 70px;
                font-size: 16px;
            }
        }

        .el-submenu__title i {
            color: #fff;
        }
    }
</style>

<script>
    import router, {routers} from '@/router';
    import {auth, bus, fetch} from '@/utils';
    import ModifyPwdPanel from '../ModifyPwd';
    import PersonalInfo from '../PersonalInfo.vue';

    let timer = null;
    export default {
        components: {ModifyPwdPanel, PersonalInfo},
        data() {
            return {
                isadmin: 'true',
                activeIndex: '0-3',
                domainIndex: 'domain_dongxw',
                permRouters: [],
                msgPage: {
                    data: [],
                    total: 0
                },
                isNest: false,
                resetPwdDiagShowFlag: false,
                personalInfoShowFlag: false,
                user: router.app.user || {realName: '匿名'}
            };
        },
        watch: {
            '$router.app.user': function (val) {
                this.isadmin = window.localStorage.getItem('isadmin')
                this.user = val;
            }
        },
        methods: {
            onPersonalInfo() {
                this.personalInfoShowFlag = true;
                this.$nextTick(() => {
                    this.$refs.personalInfoForm.$emit('init', {
                        userId: this.user.id
                    });
                });
            },
            onMsgClick(msgId) {
                this.$router.push({name: 'msg:view', query: {id: msgId}});
            },
            linkTo(path) {
                this.$router.push(path);
            },
            logout() {
                auth.removeToken();
                bus.$emit('app:logout');
                this.$router.app.user = null;
                this.$router.push('/login');
            },

            onModifyPwd() {
                this.resetPwdDiagShowFlag = true;
            },
            onModifyOk() {
                this.$alert('修改成功！请重新登录', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$router.push('/login');
                    }
                });
            },
            onDomainSelected(menu) {
                bus.$emit('app:domain:selected', menu.replace('domain_', ''))
            },
            loadMsg() {
                let {user} = router.app;
                // 加载消息
                fetch.base.MsgInfo.query(
                    {
                        pageDTO: {start: 0, pageSize: 5},
                        readState: 0,
                        receiverUserId: (user || {}).id
                    },
                    {
                        openLoading: false
                    }
                ).then(rsp => {
                    this.msgPage = rsp;
                });
            }
        },
        destroyed() {
            if (timer) {
                timer = clearInterval(timer);
            }
        },
        mounted() {
            let self = this;
            if (this.$router.app.openMsg) {
                self.loadMsg();
                timer = setInterval(function () {
                    // 加载消息
                    self.loadMsg();
                }, 10000);
            }

        }
    };
</script>
