<template>
    <div>
        <div class="panel panel-default panel-search">
            <el-form :inline="true">
                <el-form-item label="产品类型" prop="custNo">
                    <el-input v-model="page.query.param.code" clearable></el-input>
                </el-form-item>
                <el-form-item label="产品类型说明" prop="custNo">
                    <el-input v-model="page.query.param.name" clearable></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" plain @click="create">新增</el-button>

                </el-form-item>
            </el-form>
        </div>
        <v-toolbar title="数据列表" type="alert">
            <!--<el-button plain @click="exportRecords">导出 XLS</el-button>-->
            <!--<el-button type="primary" plain @click="create">新增</el-button>-->
        </v-toolbar>


        <v-table ref="table" :page="page" :table-minheight="450" @dataloaded="onDataloaded">
            <el-table-column prop="seq" label="序号" width="50">

                <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>

            </el-table-column>
            <el-table-column  prop="code" label="产品类型" width="100"></el-table-column>
            <el-table-column  prop="name" label="产品类型说明" width="200"></el-table-column>

            <el-table-column width="100" label="操作"  >
                <!--<el-table-column width="100" label="操作" :fixed="'right'">-->
                <template slot-scope="scope">

                    <el-button type="text" title="编辑" @click="edit(scope.row)"  >
                        <i class="el-icon-edit"></i>
                    </el-button>
                    <!--<el-button type="text" @click="del(scope.row,scope.$index)" title="删除" v-if="scope.row.status==0">-->
                    <!--<i class="el-icon-delete red"></i>-->
                    <!--</el-button>-->
                </template>
            </el-table-column>

        </v-table>
        <v-dialog ref="formDiag" :width="'400px'" title="信息编辑">
            <form-panel @saved="onFormSaved"></form-panel>
            <div slot="footer">
                <el-button type="primary" @click="$refs.formDiag.dispatch('submit')">保存</el-button>
                <el-button type="default" @click="()=>{$refs.formDiag.hide()}">取消</el-button>
            </div>
        </v-dialog>
    </div>
</template>
<style rel="stylesheet/less" scoped lang="less">

    .status_green {
        color: green;
    }
</style>

<script>

    import FormPanel from './Form';

    export default {
        components: {FormPanel },
        data() {
            return {
                formStatus: 1,
                orderDateRange: [],
                summaryMap: {},
                page: {
                    query: {
                        orderBys: 'id|desc',
                        param: {
                            subjectId: undefined,
                            isDeleted: false
                        }
                    },
                    getData : this.$api.dongxw.ProductTypeService.query

        },
                tableActions: [
                    {
                        name: "编辑",
                        handle: this.edit
                    },
                    {
                        name: "删除",
                        handle: this.del,
                        style: "color:red"
                    }
                ]
            };
        },
        computed: {},

        methods: {
            onDataloaded(rsp) {
                // if (rsp.total < 1) return;
                // let promotionIds = rsp.data.map(r => r.id);
                // this.$api.ipark.PromotionInfoService.summaryGroupByPromotionId(promotionIds).then(rs => {
                //     let _rs = rs || [];
                //     this.summaryMap = {}
                //     _rs.forEach(r => {
                //         this.summaryMap[r.promotionId] = r;
                //     })
                // })
            },
            /*
            导出
             */
            exportRecords() {
                let params = this.getSearchParams();
                console.log(params);
                // this.$api.dongxw.CustomerService.export(params);
            },
            getSearchParams() {
                this.page.query.dateRanges = {};
                if (this.dateRangeType != null && this.dateRange&&this.dateRange.length > 0) {
                    this.page.query.dateRanges[this.dateRangeType] = {
                        startDate: this.dateRange[0],
                        endDate: this.dateRange.length > 1 ? this.dateRange[1] : null
                    };
                }
                return this.page.query;
            },
            create() {
                this.$refs.formDiag.show();
            },
            edit(row) {
                this.$refs.formDiag.show({id: row.id});
            },
            toggleStatus(row) {
                let status = row.status;
                let msg = '确定上架此活动吗？</br><span style="color:red">一旦上架，部分信息不允许修改!</span>';
                if (status == 1) {
                    msg = '确定下架此活动吗？</br><span style="color:red">一旦下架，已派发的优惠券无法使用!</span>';
                }
                this.$confirm(msg, "确认", {
                    type: "warning",
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    this.$api.ipark.PromotionInfoService.updateStatus(row.id, status == 1 ? 2 : 1).then(rsp => {
                        this.search();
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                    });
                });
            },
            del(row) {
                this.$confirm("确定删除此条记录吗?", "提示", {
                    type: "warning"
                }).then(() => {
                    this.$api.ipark.PromotionInfoService.delete(row.id).then(rsp => {
                        this.search();
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                    });
                });
            },
            onFormSaved() {
                this.$refs.formDiag.hide();
                this.$nextTick(this.search);
            },
            init(options = {}) {
                this.search();
            },
            search() {
                this.$refs.table.load();
            },
            cancel() {
                this.dateRange = [];
                this.page.query.param = {};
                this.search();
            }
        },
        created() {
        },
        mounted() {
            this.$on("init", this.init);

        }
    };
</script>
