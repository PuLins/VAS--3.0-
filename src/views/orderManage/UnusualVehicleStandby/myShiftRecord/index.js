import newLabel from '../newLabel/index.vue';
import alarmComponent from '../alarmComponent/index.vue';
export default{
    name:'myShiftRecord',
    props: ['windowOutHeight'],
    components:{
        newLabel,
        alarmComponent
    },
    data() {
        return {
            listData: [{
                index:1,
                toDoNum:'YC2018122800005',
                AbnormalCauses:'2018-12-27 10:30，停车超时（8天12小时25分钟）',
                generationtime:'2018-12-28 10:30:35',
                AffiliatedCompany:'中厚公司',
                VehicleLabels:['有保险','已结清'],
                jurisdiction:'是',
                handoverTime:'2018/12/26 09:50:35',
                LatestProcessingDetails:"【小智-派单维护】2018/12/28 09:50:25已派单-维修"
            }],
            formDialogTableVisible: false,
            listLoading: false,
            filters: {
                domSearch: [{
                    select: ['toDoNum'],
                    content: '',
                    startDate: '',
                }], //查询框
                isdelete: '0',
            },
            openMore:false,
            timevalue: '',
            total: 0,
            currentPage: 1,
            pageSize: 15,
            options: [{
                value: '1',
                label: '全部待办'
              }, {
                value: '2',
                label: '交接过来的待办'
              }, {
                value: '3',
                label: '全部已办'
            }],
            value1:'',
            Labels:[{
                value: '1',
                label: '添加其他标签'
            }],
            labelsValue:'',
            tags: [
                { name: '有保险', type: '' },
                { name: '已扣车', type: 'success' },
                { name: '已逾期', type: 'info' },
                { name: '已垫款', type: 'warning' },
                { name: '已结清', type: 'success' },
                { name: '疑似风险', type: 'danger' }
            ],
            AddOtherLabels:'',
            otherLabels:[
                {
                    value: '1',
                    label: '添加其他标签'
                }, {
                    value: '2',
                    label: '已卖车'
                }
            ],
            addInput:false,
            customlabel:''
        }
    },
    methods:{
        // 添加查询条件
        addSelect() {
            this.filters.domSearch.push({
                select: [],
                content: ''
            });
        },
        //搜索按钮——模糊查询
        handleQuerySelect() {
            let para = {
                page: this.currentPage,
                limit: this.pageSize,
                domSearch: this.filters.domSearch,
            };
            if (this.filters.domSearch[0].select.length == 0) {
                this.$message.error('请选择查询条件！');
                return;
            }
            this.listLoading = true;
            // getVehTypeListSelect(para).then((res) => {
            //     this.total = res.data.data.total;
            //     this.listData = res.data.data.records;
            //     this.listLoading = false;
            // }).catch((error) => {
            //     this.listLoading = false;
            // });
        },
        //显示新增界面
        handleAdd() {
            this.addFormVisible = true;
            this.addForm = {
                brand: '',
                serious: '',
                model: '',
                yeartomarket: new Date(),
                firstcategory: '',
                salestatus: '在售',
                colorlist: [],
                standardprice: '',
            };

        },
        // 移除查询条件
        removeSelect(index) {
            this.filters.domSearch.splice(index, 1); //从当前index位置开始，删除一项
        },
        // 有效无效颜色切换
        tableRowClassName(row, index) {
            if (row.isdelete == 1) {
                return 'warning-row';
            }
            return '';
        },
        // 排序
        sortChange(col, prop, order) {
            let para = {
                prop: col.prop,
                order: col.order.substring(0, col.order.length - 6),
            }
        },
        //切换当前页
        handleCurrentChange(val) {
            this.currentPage = val;
            this.handleQuerySelect();
            // this.GetPositions();
        },
        //切换每页显示数量
        handleSizeChange(val) {
            this.pageSize = val;
            this.GetPositions();
        },
        //展开详情
        formDetailHandle(index){
            this.formDialogTableVisible=true;
            console.log(index,"index")
        },
        addLabel(){
            if(this.customlabel!=''){
                // console.log(this.customlabel)
                // console.log(this.tags)
                let arrayObj={};
                arrayObj.name=this.customlabel;
                arrayObj.type='success';
                this.tags.push(arrayObj);
                this.customlabel='';
                this.addInput=false;
            }else{
                
            }
        },
        handleClose(index){
            this.tags.splice(index,1)
        },
        //获取列表
        GetPositions() {
            let para = {
                page: this.currentPage,
                limit: this.pageSize,
                // isdelete:this.filters.isdelete,
            };
            this.listLoading = true;
            // getVehTypeList(para).then((res) => {
            //     this.total = res.data.data.total;
            //     this.listData = res.data.data.records;
            //     this.listLoading = false;
            // }).catch((error) => {
            //     this.listLoading = false;
            // });
        },
    }
    
}