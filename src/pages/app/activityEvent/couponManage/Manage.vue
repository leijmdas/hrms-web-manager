<template>
    <div>
        <div class="panel panel-default panel-search">
            <el-form :inline="true">
                <el-form-item label="业务类型">
                    <el-select :clearable="true">
                        <el-option>1</el-option>
                        <el-option>2</el-option>
                        <el-option>3</el-option>
                        <el-option>4</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="批次号">
                    <el-input clearable></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-input clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">查询</el-button>
                    <el-button @click="create">新增</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <v-table ref="table" :table-minheight="450">
            <el-table-column label="业务类型"></el-table-column>
            <el-table-column label="编码" ></el-table-column>
            <el-table-column label="模板名称"></el-table-column>
            <el-table-column label="开始时间"></el-table-column>
            <el-table-column label="结束时间"></el-table-column>
            <el-table-column label="有效期"></el-table-column>
            <el-table-column label="可见性"></el-table-column>
            <el-table-column label="优惠"></el-table-column>
            <el-table-column label="总量"></el-table-column>
            <el-table-column label="备注"></el-table-column>
            <el-table-column label="状态"></el-table-column>
            <el-table-column label="上架时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" title="上下架">
                        <i class="el-icon-share"></i>
                    </el-button>
                    <el-button type="text" title="编辑">
                        <i class="el-icon-edit"></i>
                    </el-button>
                </template>
            </el-table-column>
        </v-table>
        <v-dialog ref="formDiag" title="新增">
            <form-panel @saved="onFormSaved"></form-panel>
            <div slot="footer">
                <el-button type="primary">保存</el-button>
                <el-button type="default">取消</el-button>
            </div>
        </v-dialog>
    </div>
</template>

<script>
    import FormPanel from "./Form";
    export default {
        name: "Manage",
        components: {FormPanel},
        data() {
            return {
            }
        },
        methods: {
            create() {
                this.$refs.formDiag.show();
            },
        }
    }
</script>

<style scoped>

</style>
