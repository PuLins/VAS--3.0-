import util from 'utils/tools';
import {
    getEquipmentLoss,
    getProductList,
    getLossDetails,
    getRestockList,
    addRestock,
    getPurchaseCascader,
    getStoList

} from './service.js';
import { checkNum } from '@/utils/formValidation'
import lossDetail from './loss-detail/index.vue'

export default {
    props: ['windowOutHeight'],
    components: {
        lossDetail
    },
    computed: {
    },
    data() {
        return {
            Dayjs:dayjs,
            filters: {
                batchno:'',
                timeScope: '',
            },
            filtersYishi: {
                domSearch: [{
                    select: ['prodnum'],
                    content: ''
                }], //查询框
                timeScope: '',
            },
            filtersProd: {
                domSearch: [{
                    select: ['prodnum'],
                    content: ''
                }], //查询框
            },
            listData: [],
            total: 0,
            currentPage: 1,
            pageSize: 15,
            listLoading: false,
            addFormVisible: false, //新增界面是否显示
            addLoading: false,
            activeName:'first',
            activeName2:'first',
            moreData:[],//遗失列表数据
            lostLoading:false,
            lostDetail:{},//遗失详情
            storageList:[],//库房
            storageLoading:false,
            restockFormVisible:false,
            chooseRestockProdData:[],//已选择遗失设备组
            restockForm:{      //遗失单
                storageid:'',
                storagename:'',
                remarks:'',
                details:[],
            },
            restockFormRules:{
                storagename: [{required: true,message: '请选择重新入库库房',trigger: 'blur'}],
            },
            ytotal: 0,
            ycurrentPage: 1,
            ypageSize: 15,
            deviceListData: [], //设备选择列表
            deviceFormVisible: false,
            devicelistLoading: false,
            dtotal: 0,
            dcurrentPage: 1,
            dpageSize: 15,
            editable:false,
            modelOptions:[],//配件列表
            typeForm:{//添加配件
                modelcategoryname: '',
                modelcategory:'A',
                modelname: '',
                modelnameArr:[],
                id:'',
                modelnameSpan:'',
                qty: '',
            },
            partsData:[],//配件组
        }
    },
    methods: {
        // ----------------------------------------------------新增-------------------------------------------------
        handleAdd() {
            this.addFormVisible = true;
            this.$router.push({name: 'loss-detail'})
        },


        // ----------------------------------------------------------入库单详情--------------------------------------------------------
        async toPutInStoDetails(rows){
            this.deviceFormVisible = true;
            try {
                 const res = await getDetails({modelid:rows.modelId});
                 this.deviceListData = res.data.data;
            } catch (e) {}
        },


        // ---------------------------------------------------------重新入库-----------------------------------------------------------
        async viewRestocking () {
            this.restockFormVisible = true;
            this.restockForm = {      //遗失单初始化
                storageid:'',
                storagename:'',
                remarks:'',
                details:[],
            },
            this.chooseRestockProdData = [];//初始化
            this.lostDetail = {};//初始化
            this.activeName = "first"
        },
        // 遗失tab切换
        handleClickResto(tab) {
            if (tab.index == 1) this.getRestockData();         //列表
            if (tab.index == 0) this.viewRestocking();          //添加
        },
        // 遗失列表
        getRestockData(){
            this.lostLoading = true;
            let para = {
                page:this.ycurrentPage,
                limit:this.ypageSize,
                domSearch:this.filtersYishi.domSearch,
                startTime: this.filtersYishi.timeScope ? (this.filtersYishi.timeScope[0] ? util.formatDate.format(new Date(this.filtersYishi.timeScope[0]), 'yyyy-MM-dd') : '') : '',
                endTime: this.filtersYishi.timeScope ? (this.filtersYishi.timeScope[1] ? util.formatDate.format(new Date(this.filtersYishi.timeScope[1]), 'yyyy-MM-dd') : '') : '',
            }
            getRestockList(para).then((res) => {
                this.ytotal = res.data.data.total;
                this.moreData = res.data.data.records;
                this.lostLoading = false;
            });
        },
        yhandleCurrentChange(val) {
         this.ycurrentPage = val;
         this.getRestockData();
        },
        yhandleSizeChange(val) {
         this.ypageSize = val;
         this.getRestockData();
        },


        // 库房下拉
        stoChange (r) {
            this.storageList = [];
            if (!r || this.storageList.length > 0) return;
            this.storageLoading = true;
            getStoList({limit: 1000, isactive: 1}).then((res) => {
                this.storageList = res.data.data.records;
                this.storageLoading = false;
            });
        },
        //点击 添加设备 按钮
        addDeviceList(val) {
            this.deviceFormVisible = true;
            if (val == 0) {             //添加设备
                this.activeName2 = 'first';
                this.editable = false;
                this.filtersProd.domSearch = [{select: ['prodnum'],content: ''}];//初始化查询框
                this.getDeciceListInfo();
            }else if (val == 1) {   //添加配件
                this.activeName2 = 'second';
                this.typeForm = {
                    modelcategoryname: '配件',
                    modelcategory:'A',
                    modelname: '',
                    modelnameArr:[],
                    id:'',
                    modelnameSpan:'',
                    qty: '',
                },//清空输入框，初始化
                this.partsData.push(this.typeForm);
                this.modelOptions = [];
                this.editable = true;
            }
        },
        //获取设备列表信息
        getDeciceListInfo() {
            let para = {
                page: this.dcurrentPage,
                limit: this.dpageSize,
                domSearch: this.filtersProd.domSearch, //查询框
            };
            this.devicelistLoading = true;
            getProductList(para).then((res) => {
                this.dtotal = res.data.data.total;
                this.deviceListData = res.data.data.records;
                this.devicelistLoading = false;
            }).catch((error) => {
                this.devicelistLoading = false;
            });
        },
        // 双击确认选择设备
        comlist(checkData, event) {
                // 选择重复设备时
                let isRepeat = true;
                this.chooseRestockProdData.forEach((item,index) =>{
                    if (item.id == checkData.id) {
                        this.$message.error('设备重复！请重新选择！');
                        isRepeat = false;
                    }
                });
                if (isRepeat) {
                    this.deviceFormVisible = false;
                    checkData.qty = '1';
                    this.chooseRestockProdData.push(checkData);
                    this.restockForm.qty = this.chooseRestockProdData.length;
                }else{
                    return;
                }
        },
        // 删除已选设备
        handleDelete(index,row){
            this.chooseRestockProdData.splice(index,1);
            this.restockForm.qty = this.chooseRestockProdData.length;
        },
        //切换当前页——选择遗失设备
        dhandleCurrentChange(val) {
            this.dcurrentPage = val;
            this.getDeciceListInfo();
        },
        //切换每页显示数量
        dhandleSizeChange(val) {
            this.dpageSize = val;
            this.getDeciceListInfo();
        },
        // 获取配件下拉信息
        modelCascader () {
            getPurchaseCascader({storageid:3}).then((res) => {
                this.modelOptions = res.data.data;
            });
        },
        // 级联选择器-选择配件时
        handleChangeModel(val) {
            this.typeForm.id = val[val.length-1];
            this.typeForm.modelname = this.$refs['cascader'].currentLabels[1];//传参-汉字
            this.typeForm.modelnameSpan = this.$refs['cascader'].currentLabels.toString();//选择时显示
        },
        // 确认添加配件
        confirmParts(){
             this.$refs.typeForm.validate((valid) => {
                if (valid) {
                    this.chooseRestockProdData.push(this.typeForm);
                    this.cancelParts();
                }
            })
        },
        // 点击取消添加配件
        cancelParts(){
            this.editable = false;
            this.deviceFormVisible = false;
            this.typeForm = {
                modelcategoryname: '配件',
                modelcategory:'A',
                modelname: '',
                modelnameArr:[],
                id:'',
                modelnameSpan:'',
                qty: '',
            }
        },
        // 确认遗失提交
        restockSubmit(){
            this.$refs.restockForm.validate((valid) => {
                if(valid) {
                    if (this.chooseRestockProdData.length == 0) {//当未选择遗失设备时
                        this.$message.warning('请添加遗失设备信息！');
                        return;
                    }
                    this.restockForm.details = this.chooseRestockProdData;
                    this.restockForm.storageid = this.restockForm.storagename;
                    let para = Object.assign(this.restockForm);
                    addRestock(para).then((res) => {
                        this.$message.success('重新入库成功！');
                        this.activeName = 'second';
                        this.getRestockData();
                    })
                }
            });
        },


        // ---------------------------------------------------------查看详情-----------------------------------------------------------
        viewDetails(row){
            let para = {id:row.id}
            getLossDetails(para).then((res) => {
                this.$router.push({
                    name: `loss-detail`,
                    query: res.data.data
                })
            })
        },

        //查询清空
        clearAll() {
            this.filters.domSearch = [{
                select: [],
                content: ''
            }] //清空查询框;
        },        
        // 添加查询条件
        addSelect() {
            this.filters.domSearch.push({
                select: [],
                content: ''
            });
        },
        // 移除查询条件
        removeSelect(index) {
            this.filters.domSearch.splice(index, 1); //从当前index位置开始，删除一项
        },
        //切换当前页
        handleCurrentChange(val) {
            this.currentPage = val;
            this.handleQuery();
        },
        //切换每页显示数量
        handleSizeChange(val) {
            this.pageSize = val;
            this.handleQuery();
        },
        //获取列表
        handleQuery() {
            let para = {
                page: this.currentPage,
                limit: this.pageSize,
                batchno: this.filters.batchno,
                startTime: this.filters.timeScope ? (this.filters.timeScope[0] ? util.formatDate.format(new Date(this.filters.timeScope[0]), 'yyyy-MM-dd') : '') : '',
                endTime: this.filters.timeScope ? (this.filters.timeScope[1] ? util.formatDate.format(new Date(this.filters.timeScope[1]), 'yyyy-MM-dd') : '') : '',
            };
            this.listLoading = true;
            getEquipmentLoss(para).then((res) => {
                this.total = res.data.data.total;
                this.listData = res.data.data.records;
                this.listLoading = false;
            }).catch((error) => {
                this.listLoading = false;
            });
        },
        //时间转换1
        dateFormatter: function(row, col) {
            if(row.actiondate == "" || row.actiondate == undefined) return '--';
            return util.formatDate.format(new Date(row.actiondate), 'yyyy-MM-dd');
        },
    },
    created() {
        this.handleQuery();
    }
}