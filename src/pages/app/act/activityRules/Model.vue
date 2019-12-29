<template>
    <div class="modelImport">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="轮播图列表" name="first">
                <el-form :model="entity" ref="form">
                    <div style="margin-bottom: 20px; display: flex;justify-content: space-between"><el-button type="primary" @click="saveImg">保存</el-button> <span>备注：请上传PNG格式  活动尺寸大小为554px*676px, banner图尺寸大小为690px*264px</span></div>
                    <el-upload :action="action" list-type="picture-card" :data="formData" :beforeUpload="beforeUpload" :file-list="entitys.fileList" :on-success="handleSuccess" :auto-upload="true" :on-exceed="handleExceed" :on-remove="handleRemove" :limit="limit">
                        <i slot="default" class="el-icon-plus"></i>
                    </el-upload>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="优惠券模板" name="second">
                <div style="display: flex;justify-content: flex-end;margin-bottom: 10px;"><el-button type="primary" @click="create">添加</el-button></div>
                <v-table ref="table" :page-size="-1" :table-data="tableDataArea" :table-minheight="200" class="panel-main" >
                    <el-table-column width="140" label="类型">
                        <template slot-scope="{row}">
                            <el-select placeholder="请选择" v-model="row.bizType" v-if="row.editable">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <span v-else>{{$dict.getText(row.bizType, $dict.store.BUSINESSTYPE)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="模板名称">
                        <template slot-scope="{row}">
                            <model-select v-model="row.promotionInfo.id" :bizId="row.bizType" :status="status" v-if="row.editable"></model-select>
                            <span v-else>{{(row.promotionInfo||{}).name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="批次号">
                        <template slot-scope="{row}">
                            <batch-select v-model="row.promotionCouponBatch.id" :modelId="row.promotionInfo.id" v-if="row.editable"></batch-select>
                            <span v-else>{{(row.promotionCouponBatch||{}).batchNo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="数量">
                        <template slot-scope="{row}">
                            <el-input-number type="text" placeholder="只能为数字" v-model="row.couponNumber" v-if="row.editable" :precision="0"></el-input-number>
                            <span v-else>{{row.couponNumber}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="100" label="操作" :fixed="'right'">
                        <template slot-scope="scope">
                            <el-button type="text" title="保存" v-if="scope.row.editable" @click="save(scope.row)">
                                <i class="el-icon-success"></i>
                            </el-button>
                            <el-button type="text" title="编辑" v-if="!scope.row.editable" @click="edit(scope.row)">
                                <i class="el-icon-edit"></i>
                            </el-button>
                            <el-button type="text" title="删除" @click="del(scope.row, scope.$index)">
                                <i class="el-icon-delete red"></i>
                            </el-button>
                        </template>
                    </el-table-column>
                </v-table>
            </el-tab-pane>
        </el-tabs>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
    import {getToken} from '@/utils/auth'
    import ModelSelect from "@/components/widgets/ModelSelect.vue";
    import BatchSelect from "@/components/widgets/BatchSelect.vue";
    const defaultEntity = {
        id: null,
        name: '', // 活动名称
        type: '', // 活动类型
        branchCompanyId: null, //  分公司ID
        merchantId: null, // 商户ID
        issueType: 0, // 派发单位类型
        sceneType: 0, // 使用场景
        startTime: new Date(), // 开始时间
        endTime: new Date(), // 结束时间
        ruleRemark: '', // 规则说明
        remark: '' // 备注
    };

    const entitys = {
        fileList: [],
        id: '',
        imgUrl: '',
        imgNumber:''

    }
    export default {
        name: "Model",
        components: { ModelSelect, BatchSelect},
        data() {
            return {
                entity: _.cloneDeep(defaultEntity),
                entitys: _.cloneDeep(entitys),
                activeName: 'first',
                dialogImageUrl: '',
                status: 1,
                dialogVisible: false,
                disabled: false,
                tableData: [],
                tableDataArea: [{
                    id: null,
                    bizType: 1,
                    promotionInfo:  {
                        id: '',
                        name: ''
                    },
                    promotionCouponBatch: {
                       id: '',
                        batchNo: ''
                    },
                    couponNumber: 0,
                    editable: false
                }],
                formData: {},
                action: '/api/file/upload',
                imgPath: '', // 图片路径
                limit: 1,
                limit1: 5,
                options: [{
                    value: 1,
                    label: '临停'
                }, {
                    value: 2,
                    label: '预约'
                }],
            }
        },
        methods: {
            /*
             * banner保存
              * */
            saveBanner() {

            },
            /**
             * 保存图片
             * */
            saveImg() {
                this.entitys.id = this.id;
                this.entitys.imgUrl = this.imgPath;
                if (!!this.imgPath) {
                    this.entitys.imgNumber = 1;
                } else {
                    this.entitys.imgNumber = 0;
                }

                this.$api.ipark.ActivityRulesService.updateImg(this.entitys).then((res) => {
                    this.$message({
                        type: "success",
                        message: "保存成功!"
                    })
                    // 保存成功之后需要刷新table页面
                })
            },
            handleExceed() {
              this.$message('最多只允许上传一张图片！')
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
                this.imgPath = ''
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleDownload(file) {
                console.log(file);
            },
            beforeUpload(file) {
                Object.assign(this.formData,{"access-token":getToken()})
            },
            handleClick(tab, event) {
                console.log(tab, event);
            },
            /**
             * 上传成功之后拿到返回值
             */
            handleSuccess(response, file, fileList) {
                console.log(response)
                this.imgPath = response.path
            },
            create() {
                this.tableDataArea.push({
                    id: null,
                    bizType: 1,
                    promotionInfo:  {
                        id: '',
                        name: ''
                    },
                    promotionCouponBatch: {
                        id: '',
                        batchNo: ''
                    },
                    couponNumber: 0,
                    editable: true
                });
            },
            /**
             * 保存行
             */
            save(row) {
                console.log(row)
                row.editable = false
                if (row.couponNumber) {
                    this.$message('数量')
                }
                let params = {
                    id: row.id,
                    couponNumber: row.couponNumber,
                    masterId: this.id,
                    promotionId: row.promotionInfo.id,
                    promotionCouponBatchId: row.promotionCouponBatch.id,
                    couponName: row.couponName,
                    bizType: row.bizType
                }
                console.log(params)
                this.$api.ipark.ActivityRulesService.saveCoupon(params).then((res) => {
                    this.$emit('init', this.id)
                    this.$message({
                        type: "success",
                        message: "保存成功!"
                    })
                    // 保存成功之后需要刷新table页面
                    let param = {
                        "dateRanges":{},
                        "limit":-1,
                        "param":{
                            "masterId":this.id
                        },
                        "start":0
                    }
                    this.$api.ipark.ActivityRulesService.queryLeft(param).then(r=>{
                        if (r.data && r.data.length) {
                            r.data.forEach(i => (i.editable = false));
                            this.tableDataArea = r.data
                        } else {
                            this.tableDataArea = []
                        }
                    })
                })
            },
            /**
             *
             * 删除
             * */
            del(row, index) {
                console.log(index)
                // 这里的删除有两张操作  数据带ID的删除 需要调后天接口，不带ID数据，本地删除
                this.$confirm("确定删除此条记录吗?", "提示", {
                    type: "warning"
                }).then(() => {
                    if (row.id) {
                        this.$api.ipark.ActivityRulesService.deleteCoupon(row.id).then(rsp => {
                            this.tableDataArea.splice(index, 1)
                            this.$message({
                                type: "success",
                                message: "删除成功!"
                            });
                        });
                    } else {
                        this.tableDataArea.splice(index, 1)
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                    }
                });
            },
            /**
             * 编辑行
             */
            edit(row) {
                console.log('编辑')
                row.editable = true
            },
            init(options) {
                if (options.id) {
                    this.id = options.id
                    this.entitys.id = options.id
                    let param = {
                        "dateRanges":{},
                        "limit":-1,
                        "param":{
                            "masterId":options.id
                        },
                        "start":0
                    }
                    this.$api.ipark.ActivityRulesService.queryLeft(param).then(r=>{
                        if (r.data && r.data.length) {
                            r.data.forEach(i => (i.editable = false));
                            this.tableDataArea = r.data
                        } else {
                            this.tableDataArea = []
                        }
                    })
                    this.$api.ipark.ActivityRulesService.get(options.id).then(r=>{
                        this.imgPath = r.imgUrl;
                        this.entitys.imgUrl = r.imgUrl;
                        if (!!this.imgPath) {
                            this.entitys.fileList = [{name: '', url: this.imgPath}]
                        } else  {
                            this.entitys.fileList = []
                        }
                    })
                }
            },
            closed() {
                this.entitys = _.cloneDeep(entitys);
            }
        },
        mounted() {
            this.$on('init', this.init);
            this.$on('closed', this.closed)
        }
    }
</script>

<style lang="less">
    .modelImport {
        min-height: 500px;
        .el-upload{
            width: 148px !important;
            height: 148px !important;
        }
        .el-upload--picture-card {
            background-color: #fbfdff;
            border: 1px dashed #c0ccda;
            border-radius: 6px;
            box-sizing: border-box;
            width: 148px;
            height: 148px;
            cursor: pointer;
            line-height: 146px;
            vertical-align: top;
        }
    }
</style>
