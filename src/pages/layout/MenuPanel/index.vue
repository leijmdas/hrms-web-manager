<!--菜单 -->
<template>
    <div>
    <el-menu unique-opened class="el-menu-demo" background-color="#06274B"
             active-text-color="#fff" :collapse="collapse" :default-openeds="defaultOpeneds"
             :default-active="activeIndex" v-if="permRouters.length>0">
        <template v-for="item in permRouters" v-if="!item.hidden&&item.children">
            <!--
          <el-menu-item v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow" :key="item.children[0].name" :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
            <router-link :to="item.path+'/'+item.children[0].path">
                <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
              <span v-if="item.children[0].meta&&item.children[0].meta.title">{{generateTitle(item.children[0].meta.title)}}</span>

            </router-link>
          </el-menu-item>
            <el-submenu v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow" :key="item.children[0].name" :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
              <template slot="title">
               <icon :name="item.meta.icon" scale="2" v-if="item.meta&&item.meta.icon"></icon>
                <span v-if="item.meta&&item.meta.title">{{generateTitle(item.meta.title)}}</span>
              </template>

              <router-link v-for="c in getShowingChildren(item.children)" :key="c.path" :to="{name:c.name,params:c.params,query:c.query}">
                <el-menu-item :index="c.path">
                  <span v-if="c.meta&&c.meta.title">{{generateTitle(c.meta.title)}}</span>
                </el-menu-item>
              </router-link>
            </el-submenu>-->
            <el-submenu :index="item.name||item.path" :key="item.name" v-if="getShowingChildren(item.children)">
                <template slot="title">
                    <icon :name="item.meta.icon" scale="2" v-if="item.meta&&item.meta.icon"></icon>
                    <span slot="title" v-if="item.meta&&item.meta.title">{{generateTitle(item.meta.title)}}</span>
                </template>

                <template v-for="child in item.children" v-if="!child.hidden">
                    <router-link :to="{name:child.name,params:child.params,query:child.query}" :key="child.name">
                        <el-menu-item :index="item.path+'/'+child.path">
                            <span v-if="child.meta&&child.meta.title">{{generateTitle(child.meta.title)}}</span>
                        </el-menu-item>
                    </router-link>
                </template>
            </el-submenu>
        </template>
    </el-menu>

    <el-alert v-else title="" :closable="false" type="warning" style="margin:5px">暂无权限</el-alert>
    </div>

</template>
<style lang="less">
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }

    .el-menu-demo .el-submenu.is-opened .el-submenu__title {
        border-left: 4px solid #3385FF;
    }

    .el-submenu__title {
        height: 70px;
        line-height: 70px;
        color: rgba(255, 255, 255, 0.5);
    }

    .el-submenu .el-menu-item {
        height: 34px;
        line-height: 34px;
    }
</style>
<script>
    import {routers} from '@/router';
    import {auth, bus, fetch} from '@/utils';

    export default {
        components: {},
        data() {
            return {
                collapse: false,
                activeIndex: null,
                currentDomain: '', // 当前域
                permRouters: [],
                defaultOpeneds: [],
                msgPage: {
                    data: [],
                    total: 0
                },
                isNest: false
            };
        },
        watch: {
            '$route.path': function (val) {
                this.activeIndex = this.$route.path;
                if (val === '/index') {
                    this.activeIndex = '';
                }
            }
        },
        methods: {
            toggoleCollapse(flag) {
                this.collapse = flag;
            },
            getShowingChildren(children) {
                const showingChildren = children.filter(item => {
                    return !item.hidden && this.$hasPermission(item.meta.perm);
                });
                return showingChildren;
            },
            hasOneShowingChildren(children) {
                const showingChildren = this.getShowingChildren(children)
                if (showingChildren.length === 1) {
                    return true;
                }
                return false;
            },
            hasMoreThanOneShowingChildren(children) {
                const showingChildren = this.getShowingChildren(children)
                if (showingChildren.length > 1) {
                    return true;
                }
                return false;
            },
            generateTitle(title) {
                return title;
            },
            linkTo(path) {
                this.$router.push(path);
            },
            getPermRouter(_r) {
                let r = _.cloneDeep(_r);
                let m = r.meta || {};
                let result = null;
                if (r.children) {
                    let childs = [];
                    for (let i = 0; i < r.children.length; i++) {
                        let c = r.children[i];
                        let tmp = this.getPermRouter(c);
                        if (tmp != null) {
                            childs.push(tmp);
                        }
                    }
                    if (childs.length > 0) {
                        result = r;
                        result.children = childs;
                    }
                    return result;
                } else {
                    if (this.$hasPermission(m.perm)) {
                        return r;
                    } else {
                        return null;
                    }
                }
            },
            getPermRouters() {
                let rs = [];
                routers.forEach(r => {
                    let tmp = this.getPermRouter(r);
                    tmp && rs.push(tmp);
                });
                return rs;
            }
        },
        mounted() {
            this.permRouters = [];
            bus.$on('app:domain:selected', (domain) => {
                this.currentDomain = domain;

                let p = this.getPermRouters()
                p = p.filter(t => (t.meta || {}).group == domain);
                this.permRouters = p;

                if (p.length > 0) {
                    let item = p[0]
                    this.defaultOpeneds = [item.name || item.path]
                }

            });
        }
    };
</script>
