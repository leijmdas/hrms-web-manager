<template>
    <el-tabs type="border-card" v-model="currentTab" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="first">
            <form-panel @saved="onFormSaved" ref="formPanel"></form-panel>
        </el-tab-pane>
        <el-tab-pane label="营业执照&资质" name="second" :disabled="!id">
            <license-form ref="licenseForm" @saved="onFormSaved2"></license-form>
        </el-tab-pane>
    </el-tabs>
</template>
<style lang="less">
</style>

<script>
    import FormPanel from './Form';
    import licenseForm from './licenseForm';

    export default {
        components: {FormPanel, licenseForm},
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
            }
        },
        mounted() {
            this.$on('init', this.init);
        }
    };
</script>
