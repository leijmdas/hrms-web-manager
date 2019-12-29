<template>
    <el-tabs type="border-card" v-model="currentTab" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="first">
            <form-panel @saved="onFormSaved" ref="formPanel"></form-panel>
        </el-tab-pane>
        <el-tab-pane label="营业执照&资质" name="second" :disabled="!id">
            <license-form ref="licenseForm" @saved="onFormSaved2"></license-form>
        </el-tab-pane>
        <el-tab-pane label="审核" name="third">
            <check-form ref="checkForm" @saved="onFormSaved3"></check-form>
        </el-tab-pane>
    </el-tabs>
</template>
<style lang="less">
</style>

<script>
    import FormPanel from './baseForm';
    import licenseForm from './licenseForm';
    import checkForm from './checkForm';

    export default {
        components: {FormPanel, licenseForm, checkForm},
        data() {
            return {
                id: 0,
                currentTab: 'first'
            };
        },
        methods: {
            handleClick(tab) {
                let $form = null;
                if (tab.name == 'first') {
                    $form = this.$refs.formPanel;
                } else if (tab.name == 'second') {
                    $form = this.$refs.licenseForm;
                } else if (tab.name == 'third') {
                    $form = this.$refs.checkForm;
                }
                $form.$emit('init', {id: this.id});
            },
            init(options = {}) {
                this.id = options.id;
                this.currentTab = 'first';
                this.handleClick({name: 'first'});
            },
            onFormSaved(rsp) {
                this.id = rsp;
                this.$message('保存成功');
                this.$emit('saved', rsp);
            },
            onFormSaved2() {
                this.$message('保存成功');
                this.$emit('saved');
            },
            onFormSaved3() {
                this.$message('保存成功');
                this.$emit('saved');
            }
        },
        mounted() {
            this.$on('init', this.init);
        }
    };
</script>
