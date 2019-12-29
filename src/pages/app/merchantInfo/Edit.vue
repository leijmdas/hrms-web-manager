<template>
    <el-tabs type="border-card" v-model="currentTab" @tab-click="handleClick">
        <el-tab-pane label="商户信息" name="first">
            <form-panel @saved="onFormSaved" ref="formPanel"></form-panel>
        </el-tab-pane>
        <el-tab-pane label="结算信息" name="second" :disabled="!id">
            <settlement-form ref="settlementForm" @saved="onFormSaved2"></settlement-form>
        </el-tab-pane>
    </el-tabs>
</template>
<style lang="less">
</style>

<script>
    import FormPanel from './Form';
    import SettlementForm from './SettlementForm';

    export default {
        components: {FormPanel, SettlementForm},
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
                    $form = this.$refs.settlementForm;
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
