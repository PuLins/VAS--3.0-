<template>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <!--<el-tab-pane label="字典设置" name="first">-->
            <!--<sys-dictionary :windowOutHeight="windowOutHeight"></sys-dictionary>-->
        <!--</el-tab-pane>-->
        <el-tab-pane label="字典数据" name="second">
            <sys-dictionary-data :windowOutHeight="windowOutHeight"></sys-dictionary-data>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import SysDictionary from './SysDictionary/index.vue'
    import SysDictionaryData from './SysDictionaryData/index.vue'

    export default {
        name: 'dictionaryManage',
        props: ['windowOutHeight'],
        data () {
            return {
                activeName: 'second'
            }
        },
        methods: {
            handleClick () {

            }
        },
        components: {
            SysDictionary,
            SysDictionaryData
        }
    }
</script>

<style lang="stylus" scoped>

</style>
