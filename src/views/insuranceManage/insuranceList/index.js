import util from 'utils/tools.js'
import { getToken } from '@/utils/auth'
import axios from 'axios'
import {
    getVehTypeList,
    handleCorrect,
    getInsuranceInfoList,
    modifyInsuranceInfo,
    getInsTemplate,
    handleInsurance,
    getRecordsInfo,
    getMoreInfo,
    getCheckoutOfIns,
    getCorpList,
    getBankList,
    againInsuranceInfo,
} from './service';
import { checkPrice, checkVin, checkWord, checkVehicleNumber, checkMobile, checkIdcard } from '@/utils/formValidation'

import { mapState } from 'vuex'

import { getInsuranceDataCount, getPolicyno } from '../insuranceCount/service'

export default {
    name: 'InsuranceInfo',
    props: ["windowOutHeight"],
    data () {
        return {
            fmtdata: util,
            filters: {
                Formate (value) {
                    return new Date(value).toLocaleDateString().replace(/\//g, "-");
                },
                domSearch: [{
                    select: ['serialnum'],
                    content: ''
                }], //查询框
                isactive: '1',
                issueDate: [],
                effectiveDate: []
            },
            bxDialogVisible: false,//打印保单
            // flowData:{
            //  flowData:'',
            // },//保单信息
            flowData: '',
            moNamelist: [], //设备型号列表
            moNameLoading: false, //设备型号
            pickerOptions: { //日期
            },
            prOptions: util.initProvince(),
            activeNames: '',
            insurancestatusOptions: [{
                value: 1,
                label: '预投保'
            }, {
                value: 2,
                label: '已出单'
            }, {
                value: 3,
                label: '已拒绝'
            }],
            insurances: [],
            moreDetailsData: [], //其他详情
            somedata: [],
            customers: [],
            insurancelist: [{
                label: '盗抢险',
                value: 'THEFT',
            }], //保险类型列表
            insuranceLoading: false, //保险类型
            total: 0,
            currentPage: 1,
            pageSize: 15,
            listLoading: false,
            corptwolist: [], //受理银行
            corptwoLoading: false, //
            incorplist: [], //保单公司列表
            incorpLoading: false,
            modellist: [],
            modelLoading: false,
            checkoutDataT: true, //数据验证返回的布尔值true
            thisInput: [], //编辑时存入row验证的值
            sels: [], //列表选中列
            editFormVisible: false, //编辑界面是否显示
            editFormVisibleAgain: false,
            formDialogTableVisible: false, //是否显示订单详情弹出
            editLoading: false,
            editFormRules: {
                serialnum: [{required: true, message: "请输入万网保单编号", trigger: 'blur'}, {validator: checkWord, trigger: 'blur'}],
                price: [{required: true, message: "请输入金额", trigger: 'blur'}, {validator: checkPrice, trigger: 'blur'}],
                indemnitylimit: [{required: true, message: "请输入赔偿限额", trigger: 'blur'}, {validator: checkPrice, trigger: 'blur'}],
                effectivedate: [{required: true, message: "请选生效日期", trigger: 'blur'}],
                expiredate: [{required: true, message: "请选择失效日期", trigger: 'blur'}],
                isactive: [{required: true, message: "请选择保单状态", trigger: 'blur'}],
                status: [{required: true, message: "请选择保险状态", trigger: 'blur'}],
                beneficiary: [{required: true, message: "请选择第一受益人", trigger: 'blur'}],
                insurancecorpname: [{required: true, message: "请选择保险公司", trigger: 'blur'}],
            },
            editFormAgainRules: {
                insurancecorpname: [{required: true, message: "请选择保险公司", trigger: 'blur'}],
                policyno: [{required: true, message: "请输入大保单编号", trigger: 'blur'}],
                serialnum: [{required: true, message: "请输入万网保单编号", trigger: 'blur'}, {validator: checkWord, trigger: 'blur'}],
                issuedate: [{required: true, message: "请选择出单日期", trigger: 'blur'}],
                effectivedate: [{required: true, message: "请选生效日期", trigger: 'blur'}],
                expiredate: [{required: true, message: "请选择失效日期", trigger: 'blur'}],
                price: [{required: true, message: "请输入车价", trigger: 'blur'}, {validator: checkPrice, trigger: 'blur'}],
                indemnitylimit: [{required: true, message: "请输入赔偿限额", trigger: 'blur'}, {validator: checkPrice, trigger: 'blur'}],
                vehicleowner: [{required: true, message: "请输入车主姓名", trigger: 'blur'}],
                vehicleownercontact: [{required: true, message: "请输入车主手机号码", trigger: 'blur'}, {validator: checkMobile, trigger: 'blur'}],
                vehicleowneridcard: [{required: true, message: "请输入身份证号码", trigger: 'blur'}, {validator: checkIdcard, trigger: 'blur'}],
                vehiclevin: [{required: true, message: "请输入车架号", trigger: 'blur'}, {validator: checkVin, trigger: 'blur'}],
                vehicleplate: [{validator: checkVehicleNumber, trigger: 'blur'}],
                vehiclemodel: [{required: true, message: "请输入厂牌型号", trigger: 'blur'}],
                vehicleenginenum: [{required: true, message: "请输入发动机号", trigger: 'blur'}],
                beneficiary: [{required: true, message: "请选择第一受益人", trigger: 'blur'}],
                insurancetype: [{required: true, message: "请选择保险项目", trigger: 'blur'}],
            },
            //编辑界面数据
            editForm: {
                id: '',
                policyno: '',
                serialnum: '',
                insurancecorpid: '',
                vehicleid: '',
                itype: '',
                insurancetype: '',
                insurancestatus: '',
                vehicleplate: '',
                issuedate: util.formatDate.format(new Date(), 'yyyy-MM-dd'),
                effectivedate: util.formatDate.format(new Date(), 'yyyy-MM-dd'),
                expiredate: util.formatDate.format(new Date(), 'yyyy-MM-dd'),
                price: '',
                beneficiary: '',
                vin: '',
                model: '',
                color: '',
                name: '',
                gender: '',
                vehicleownercontact: '',
                addresshome: '',
                vehicleowneridcard: '',
                prodspec: '',
                prodmodel: '',
                prodnum: '',
                prodsnnum: '',
                indemnitylimit: '',
                isactive: '',
                status: ''
            },
            editFormId: {
                insurancecorpid: '',
                insurancecorpname: '',
                itype: 'THEFT',
                insurancetype: '',
            },
            //重新出单界面数据
            editFormAgain: {
                vehicleowner: '',
                vehicleownercontact: '',
                vehicleowneridcard: '',
                addresshome: '',
                gender: '',
                vehicleid: '',
                vehicleplate: '',
                vehiclevin: '',
                vehiclemodel: '',
                vehiclecolor: '',
                vehicleenginenum: '',
                id: '',
                policyno: '',
                insurancecorpid: '',
                itype: '',
                insurancetype: '',
                insurancestatus: '',
                issuedate: util.formatDate.format(new Date(), 'yyyy-MM-dd'),
                effectivedate: util.formatDate.format(new Date(), 'yyyy-MM-dd'),
                expiredate: util.formatDate.format(new Date(), 'yyyy-MM-dd'),
                price: '',
                indemnitylimit: '',
                beneficiary: '',
                createdate: util.formatDate.format(new Date(), 'yyyy-MM-dd'),
                remark: '',
                serialnum: '',
                isactive: '',
                status: ''
            },
            editFormAgainId: {
                insurancecorpid: '',
                insurancecorpname: '',
                itype: 'THEFT',
                insurancetype: '',
            },

            pickerOptions0: {
                disabledDate (time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            noteTitle: '',//操作弹窗标题
            noteDialogVisible: false,
            noteForm: {
                remark: '',
                words: 0
            },
            insuranceId: '',
            serialnum: '',
            eventType: '',
            eventStatus: '',
            checkWordsStatus: true,
            activeName: 'first',
            operationData: [],//操作记录
            checkoutDataF: true,//验证万网保单号重复
            baseUrl: this.$store.state.baseUrl,//基础模板地址
            iframeSrc: '',//模板地址
            operateUrlData: {
                0: '/reportRegistration',//报案登记
                1: '/surrenderCompleted',//退保完成
                2: '/claimCompleted',//理赔成功
                3: '/claimRefuse',//不予理赔
                4: '/revokeReport',//撤销报案
                6: '/claimStart',//理赔中
                7: '/cancellationPolicy'//废除保单
            },
            countData: {
                issue_num: '',
                issue_price_total: '',
                total_insurance_price: '',
                remain_insurance_price: ''
            },
            policynos: [],
            policyno: ''
        }
    },
    computed: {
        ...mapState({
            corporateinfo: state => {
                return state.user.corporateinfo
            },
            permissions: state => {
                return state.user.permissions
            }
        }),
        isInsurance () {
            return this.corporateinfo.corpcategory === 'INSURANCE'
        }
    },
    methods: {
        // 数据重复验证
        checkout () {
            let para = {
                policyno: this.editFormAgain.policyno
            }
            getCheckoutOfIns(para).then((res) => {
                if (res.data.data) {
                    this.$message({
                        message: '信息输入重复！',
                        type: 'warning'
                    });
                    this.$refs.policyno.$el.className = "el-form-item is-error"; //输入框标红
                    this.checkoutDataF = false;
                } else {
                    this.$refs.policyno.$el.className = "el-form-item"; //输入框恢复
                    this.checkoutDataF = true;
                }
            })
        },
        //查询清空
        clearAll () {
            this.filters.domSearch = [{
                select: [],
                content: ''
            }] //清空查询框;
        },

        // 第一受益人
        corpChangeTwo (queryString, cb) {
            let para = {
                    limit: 100,
                    page: 1,
                    corpcategory: 'BANK',
                    corpname: queryString,
                },
                corptwolist = [];
            getBankList(para).then((res) => {
                res.data.data.records.forEach(function (item, index) {
                    corptwolist.push({
                        value: item.corpname,
                        id: item.id,
                    });
                });
                cb(corptwolist);
            });
        },
        handleSelectCorp (val) {
            if (this.editFormVisible) {//编辑页面
                this.editForm.beneficiary = val.value;
            } else if (this.editFormVisibleAgain) {//重新出单页面
                this.editFormAgain.beneficiary = val.value;
            }
        },
        // 保单公司（出单单位）——搜索下拉
        incorpChange (r) {
            if (!r || this.incorplist.length > 0) return;
            this.incorpLoading = true;
            let para = {
                limit: 30,
                page: 1,
            }
            getCorpList(para).then((res) => {
                this.incorplist = res.data.data.records;
                this.incorpLoading = false;
            });
        },
        // 选择保险公司，匹配大保单编号
        handleSelectInsu (value) {
            this.editFormAgain.insurancecorpname = value.insucorpname;
            this.editFormAgain.insurancecorpid = value.insucorpid;
            this.editFormAgain.policyno = value.policyno;
        },
        // 车型下拉
        modelChange (r) {
            if (!r || this.modellist.length > 0) return;
            this.modelLoading = true;
            let para = {
                limit: 30,
                page: 1,
            }
            getVehTypeList(para).then((res) => {
                this.modellist = res.data.data.records;
                this.modelLoading = false;
            });
        },
        // 选择车型
        handleSelectModel (value) {
            this.editFormAgain.vehiclemodel = value;
        },
        // 模糊搜索车型
        remoteMethod (query) {
            if (query !== '') {
                this.modelLoading = true;
                let para = {
                    limit: 30,
                    page: 1,
                    domSearch: [{select: ['model'], content: query}]
                }
                getVehTypeList(para).then((res) => {
                    this.modellist = res.data.data.records;
                    this.modelLoading = false;
                });
            }
        },
        //改变出单日期 联动 生效日期、失效日期
        issuedateChange (val) {
            this.editForm.effectivedate = util.addReduceDate(new Date(val), +1);//生效日期
            var dayjian = util.addReduceDate(new Date(val), 0);
            this.editForm.expiredate = util.getDateThreeYers(dayjian, 3);//失效日期

            this.editFormAgain.effectivedate = util.addReduceDate(new Date(val), +1);//生效日期
            this.editFormAgain.expiredate = util.getDateThreeYers(dayjian, 3);//失效日期
        },
        //改变生效日期 同步 失效日期 有效期3年
        matchDate (val) {
            var dayjian = util.addReduceDate(new Date(val), -1);
            this.editForm.issuedate = dayjian;//出单日期
            this.editForm.expiredate = util.getDateThreeYers(dayjian, 3);//失效日期

            this.editFormAgain.issuedate = dayjian;//出单日期
            this.editFormAgain.expiredate = util.getDateThreeYers(dayjian, 3);//失效日期
        },
        // 选择到期日自动匹配生效日
        matchDateTwo (val) {
            var dayjian = util.addReduceDate(new Date(val), +1);
            this.editForm.effectivedate = util.getDateThreeYers(dayjian, -3);
            this.editFormAgain.effectivedate = util.getDateThreeYers(dayjian, -3);
        },


        // 有效 鼠标移入
        mouseoverChange (e) {
            if ($(e.target).hasClass('icon-duigou')) {
                $(e.target).addClass('operate-cha icon-cha').removeClass('operate-duigou icon-duigou');
            } else {
                $(e.target).addClass('operate-duigou icon-duigou').removeClass('operate-cha icon-cha');
            }
        },
        // 有效 鼠标移除
        mouseoutChange (e) {
            if ($(e.target).hasClass('icon-cha')) {
                $(e.target).addClass('operate-duigou icon-duigou').removeClass('operate-cha icon-cha');
            } else {
                $(e.target).addClass('operate-cha icon-cha').removeClass('operate-duigou icon-duigou');
            }
        },

        /*设备型号——下拉*/
        moNameChange (r) {
            if (!r || this.moNamelist.length > 0) return;
            this.moNameLoading = true;
            getMoNameList().then((res) => {
                this.moNamelist = res.data.data.records;
                this.moNameLoading = false;
            });
        },
        //编辑—— 设备型号选中时自动获取设备分类
        getNameEdit () {
            for (var i = 0; i < this.moNamelist.length; i++) {
                if (this.moNamelist[i].id == this.editForm.prodmodel) {
                    this.editForm.prodspec = this.moNamelist[i].prodspec;
                    this.editForm.prodcategory = this.moNamelist[i].prodcategory;
                }
            }
        },

        /*保险类型——下拉*/
        insuranceChange (r) {
            if (!r || this.insurancelist.length > 0) return;
            this.insuranceLoading = true;
            getInsuranceInfoList().then((res) => {
                this.insurancelist = res.data.data.records;
                this.insuranceLoading = false;
            });
        },


        // iframe模板路径
        parseParams (url, data) {
            try {
                let tempArr = [];
                for (let i in data) {
                    if (data[i]) {
                        let key = i;
                        let value = data[i];
                        tempArr.push(key + '=' + value);
                    }
                }
                return `${url}?&${tempArr.join('&')}`;
            } catch (err) {
                return '';
            }
        },
        // 电子保单
        electronicPrint (templateinfo, idinfo) {
            if (templateinfo == null) {
                this.$message({
                    message: '该保险公司暂无模板！请至【保单模板】中添加',
                    type: 'error'
                });
                return;
            }
            let para = {
                id: templateinfo,
            }
            getInsTemplate(para).then((res) => {
                this.bxDialogVisible = true;
                // 请求详情数据
                let paraTwo = {
                    id: idinfo,
                }
                getMoreInfo(paraTwo).then((result) => {
                    const data = result.data.data;//页面详细数据
                    let templateurl = res.data.data.templateurl;//模板url
                    const param = {
                        policyno: data.policyno,
                        serialnum: data.serialnum,
                        effectivedate: data.effectivedate,
                        expiredate: data.expiredate,
                        indemnitylimit: data.indemnitylimit,
                        vehicleowner: data.vehicleowner,
                        vehicleowneridcard: data.vehicleowneridcard,
                        vehicleownercontact: data.vehicleownercontact,
                        vehicleplate: data.vehicleplate,
                        vehiclemodel: data.vehiclemodel,
                        createdate: data.createdate,
                        vehicleenginenum: data.vehicleenginenum,
                        vehiclevin: data.vehiclevin,
                        price: data.price,
                        beneficiary: data.beneficiary,
                        equipmentinstalldate: data.equipmentinstalldate,
                        equipmentnum: data.equipmentnum,
                        insurancecorpname: data.insurancecorpname
                    }
                    this.iframeSrc = this.parseParams((this.baseUrl + templateurl), param)
                });
            });
        },
        //关闭当前电子保单
        closeDialog () {
            this.bxDialogVisible = false;
        },
        //详情查看
        formDetailHandle (message, idinfo) {
            this.formDialogTableVisible = true;
            let para = {
                id: idinfo,
            }
            getMoreInfo(para).then((res) => {
                this.moreDetailsData = res.data.data;
                this.initViewer();//图片加载器
            });

            // 操作详情
            let paraTwo = {
                insuranceid: idinfo,
            }
            getRecordsInfo(paraTwo).then((res) => {
                this.operationData = res.data.records;
            });
        },
        // 导出
        handleExport () {
            let para = {
                domSearch: this.filters.domSearch,
                isactive: this.filters.isactive,
                issueStartTime: this.filters.issueDate&&this.filters.issueDate[0] ? this.filters.issueDate[0] : '',
                issueEndTime: this.filters.issueDate&&this.filters.issueDate[1] ? this.filters.issueDate[1] : '',
                effectiveStartTime: this.filters.effectiveDate&&this.filters.effectiveDate[0] ? this.filters.effectiveDate[0] : '',
                effectiveEndTime: this.filters.effectiveDate&&this.filters.effectiveDate[1] ? this.filters.effectiveDate[1] : ''
            }
            let url = '/insurance/insuranceinfo/query/export'
            if (this.isInsurance)
                url = url + '2'
            axios({
                method: 'get',
                url,
                params: para,
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                },
                responseType: 'blob',//下载文件
            }).then((response) => {
                let blob = response.data;//得到返回数据
                let a = document.createElement('a');//创建a标签
                let fileURL = (window.URL || window.webkitURL).createObjectURL(new Blob([blob]));//url路径
                a.setAttribute('href', fileURL)//a标签href路径
                a.setAttribute('target', '_self')//a标签在当前页面打开该文件
                a.setAttribute('download', 'excel.xlsx');//设置download属性
                document.body.appendChild(a);//插入到文档中并click
                a.click();//插入到文档中并click
            }).catch((error) => {
                console.log(error)
            })
        },
        // 车架号关联
        querySearchVin (queryString, cb) {
            let para = {
                    VIN: queryString,
                },
                vinNameArray = [];
            getVehicleSearchInfoList(para).then((res) => {
                res.data.data.records.forEach(function (item, index) {
                    vinNameArray.push({
                        value: item.VIN,
                    });
                });
                cb(vinNameArray);
            });
        },
        handleSelectVin (item) {
            this.editForm.VIN = item.value;
            this.addForm.VIN = item.value;
        },
        // 有效无效颜色切换
        tableRowClassName (row, index) {
            if (row.isactive == 0) {
                return 'warning-row';
            }
            return '';
        },
        // 验证备注字数
        checkWords () {
            this.noteForm.words = this.noteForm.remark.length;
            if (this.noteForm.remark.length > 500) {
                this.$refs.remark.$el.className = "el-form-item el-form-item--medium is-error"; //输入框标红
                this.checkWordsStatus = false;
            } else {
                this.$refs.remark.$el.className = "el-form-item el-form-item--medium"; //输入框恢复
                this.checkWordsStatus = true;
            }
        },
        // 操作备注弹窗
        handleNote: function (index, row) {
            this.noteDialogVisible = true;
            this.noteForm.remark = '';//初始化
            this.noteForm.words = 0;
            // 操作标题
            switch (index) {
                case 0:
                    this.noteTitle = '报案登记情况'
                    break;
                case 1:
                    this.noteTitle = '退保完成情况'
                    break;
                case 2:
                    this.noteTitle = '理赔成功情况'
                    break;
                case 3:
                    this.noteTitle = '不予理赔情况'
                    break;
                case 4:
                    this.noteTitle = '撤销报案情况'
                    break;
                case 5:
                    this.noteTitle = '批改备注'
                    break;
                case 6:
                    this.noteTitle = '理赔中'
                    break;
                case 7:
                    this.noteTitle = '废除保单'
                    break;
            }
            // 存储
            this.insuranceId = row.id;//保险id
            this.serialnum = row.serialnum;//大保单编号
            this.eventType = index
            // this.eventType = index == 0 ? 1 : index == 1 ? 3 : index == 2 ? 2 : index == 3 ? 2 : index == 4 ? 1 : index == 5 ? 5 : ''; // 1报案，2理赔，3退保 , 5批改
            // this.eventStatus = index == 0 || index == 1 || index == 2 ? 1 : index == 3 || index == 4 ? 0 : ''; // 1正常，0撤销
        },
        // 操作备注提交
        remarkConfirm () {
            if (this.checkWordsStatus) {
                if (this.eventType == 5) {//批改操作时
                    let para = {
                        othSerialNo: this.serialnum,//万网保单号
                        memoNotes: this.noteForm.remark,//备注
                    };
                    handleCorrect(para).then((res) => {
                        this.noteDialogVisible = false;
                        this.$message.success('批改成功！')
                        this.GetInsurances();
                    })
                } else {
                    let para = {
                        insuranceid: this.insuranceId,
                        eventdesc: this.noteForm.remark,
                        // eventtype:this.eventType,
                        // eventstatus:this.eventStatus,
                    }
                    const url = this.operateUrlData[this.eventType]
                    handleInsurance(url, para).then((res) => {
                        this.noteDialogVisible = false;
                        this.GetInsurances();
                    })
                }
            } else {
                this.$message({
                    message: '字数超限制！',
                    type: 'error'
                });
            }
        },

        // 初始化 图片加载器
        initViewer () {
            if (this.viewer)
                this.viewer.destroy()
            const el = this.$refs['rpShowimgDialog'].$el
            this.$nextTick(() => {
                this.viewer = new Viewer(el)
            });
        },
        //时间转换1
        dateFormatter: function (row, col) {
            if (row.issuedate == "" || row.issuedate == undefined) return;
            return util.formatDate.format(new Date(row.issuedate), 'yyyy-MM-dd');
        },
        //时间转换2
        dateFormatterSecond: function (row, col) {
            if (row.effectivedate == "" || row.effectivedate == undefined) return;
            return util.formatDate.format(new Date(row.effectivedate), 'yyyy-MM-dd');
        },
        //时间转换3
        dateFormatterThird: function (row, col) {
            if (row.createdate == "" || row.createdate == undefined) return;
            return util.formatDate.format(new Date(row.createdate), 'yyyy-MM-dd hh:mm:ss');
        },
        //时间转换4
        dateFormatterForth: function (row, col) {
            if (row.updatedate == "" || row.updatedate == undefined) return;
            return util.formatDate.format(new Date(row.updatedate), 'yyyy-MM-dd hh:mm:ss');
        },
        // 保险状态转换
        statusFormatter: function (row, col) {
            return row.status == 'INVALID' ? '作废' : row.status == 'NORMAL' ? '正常' : '暂无';
        },
        //切换当前页
        handleCurrentChange (val) {
            this.currentPage = val;
            this.GetInsurances();
        },
        //切换每页显示数量
        handleSizeChange (val) {
            this.pageSize = val;
            this.GetInsurances();
        },
        // 添加查询条件
        addSelect () {
            this.filters.domSearch.push({
                select: [],
                content: ''
            });
        },
        // 移除查询条件
        removeSelect (index) {
            this.filters.domSearch.splice(index, 1); //从当前index位置开始，删除一项
        },
        //获取保单列表
        GetInsurances () {
            let para = {
                page: this.currentPage,
                limit: this.pageSize,
                domSearch: this.filters.domSearch,
                isactive: this.filters.isactive,
                policyno: this.policyno,
                issueStartTime: this.filters.issueDate&&this.filters.issueDate[0] ? this.filters.issueDate[0] : '',
                issueEndTime: this.filters.issueDate&&this.filters.issueDate[1] ? this.filters.issueDate[1] : '',
                effectiveStartTime: this.filters.effectiveDate&&this.filters.effectiveDate[0] ? this.filters.effectiveDate[0] : '',
                effectiveEndTime: this.filters.effectiveDate&&this.filters.effectiveDate[1] ? this.filters.effectiveDate[1] : ''
            };
            this.listLoading = true;
            getInsuranceInfoList(para).then((res) => {
                this.total = res.data.data.total;
                this.insurances = res.data.data.records;
                this.insurances.dateString = '';
                this.listLoading = false;
            }).catch((error) => {
                this.listLoading = false;
            });
        },
        // 重新出单
        // handleAgain: function(index, row) {
        //     $(".is-error").removeClass('is-error'); //清空验证时的红框
        //     this.editFormVisibleAgain = true;
        //     this.editFormAgain = {
        //         id: row.id,
        //         vehicleowner: row.vehicleowner,
        //         vehicleownercontact: row.vehicleownercontact,
        //         vehicleowneridcard: row.vehicleowneridcard,
        //         addresshome: row.addresshome,
        //         gender: row.gender,
        //         policyno: row.policyno,
        //         // serialnum:'',
        //         vehicleid: row.vehicleid,
        //         vehicleplate: row.vehicleplate,
        //         vehiclevin: row.vehiclevin,
        //         vehiclemodel: row.vehiclemodel,
        //         vehiclecolor: row.vehiclecolor,
        //         vehicleenginenum:row.vehicleenginenum,
        //         insurancetype: row.insurancetype,
        //         issuedate: util.formatDate.format(new Date(row.issuedate), 'yyyy-MM-dd'),
        //         effectivedate: util.formatDate.format(new Date(row.effectivedate), 'yyyy-MM-dd'),
        //         expiredate: row.expiredate == undefined ? null : util.formatDate.format(new Date(row.expiredate), 'yyyy-MM-dd'),
        //         price: row.price,
        //         indemnitylimit: row.indemnitylimit,
        //         beneficiary: row.beneficiary,
        //         insurancecorpname: row.insurancecorpname,
        //         insurancecorpid: row.insurancecorpid,
        //         receivingbankid: row.receivingbankid,
        //         createdate:util.formatDate.format(new Date(row.createdate), 'yyyy-MM-dd'),
        //         remark:row.remark,
        //         serialnum:row.serialnum,
        //     }
        //     this.editFormAgainId = {
        //         receivingbankid: row.receivingbankid,
        //         beneficiary: row.beneficiary,
        //         itype: 'THEFT',
        //         insurancetype: '盗抢险',
        //     }
        //     this.thisInput = this.editFormAgain.policyno; //将当前验证的字段 已获得的值存入
        // },
        editSubmitAgain () {
            this.$refs.editFormAgain.validate((valid) => {
                if (valid) {
                    this.editLoading = true;
                    let para = {
                        id: this.editFormAgain.id,
                        policyno: this.editFormAgain.policyno,
                        // serialnum: this.editFormAgain.serialnum,
                        vehicleowner: this.editFormAgain.vehicleowner,
                        vehicleownercontact: this.editFormAgain.vehicleownercontact,
                        vehicleowneridcard: this.editFormAgain.vehicleowneridcard,
                        gender: this.editFormAgain.gender,
                        addressHome: this.editFormAgain.addresshome,
                        vehicleid: this.editFormAgain.vehicleid,
                        vehiclevin: this.editFormAgain.vehiclevin,
                        vehiclemodel: this.editFormAgain.vehiclemodel,
                        vehiclecolor: this.editFormAgain.vehiclecolor,
                        vehicleenginenum: this.editFormAgain.vehicleenginenum,
                        vehicleplate: this.editFormAgain.vehicleplate,
                        issuedate: util.formatDate.format(new Date(this.editFormAgain.issuedate), 'yyyy-MM-dd'),
                        effectivedate: util.formatDate.format(new Date(this.editFormAgain.effectivedate), 'yyyy-MM-dd'),
                        expiredate: this.editFormAgain.expiredate,
                        price: this.editFormAgain.price,
                        indemnitylimit: this.editFormAgain.indemnitylimit,
                        beneficiary: this.editFormAgain.beneficiary,
                        insurancecorpname: this.editFormAgain.insurancecorpname,
                        insurancecorpid: this.editFormAgain.insurancecorpid,
                        insurancetype: this.editFormAgain.insurancetype,
                        createdate: util.formatDate.format(new Date(this.editFormAgain.createdate), 'yyyy-MM-dd'),
                        remark: this.editFormAgain.remark,
                        serialnum: this.editFormAgain.serialnum,
                    }
                    if (this.editFormAgainId.insurancetype == this.editFormAgain.insurancetype) {
                        para.insurancetype = this.editFormAgainId.itype;
                    } else {
                        para.itype = this.editFormAgain.insurancetype;
                    }
                    if (this.checkoutDataF) {
                        againInsuranceInfo(para).then((res) => {
                            this.editLoading = false;
                            this.$message({
                                message: '重新出单成功',
                                type: 'success'
                            });
                            this.$refs['editFormAgain'].resetFields();
                            this.editFormVisibleAgain = false;
                            this.GetInsurances();
                        });
                    } else {
                        this.editLoading = false;
                        this.$message({
                            message: '请先处理标红信息！',
                            type: 'error'
                        });
                    }
                }
            });
        },
        //显示编辑界面
        handleEdit (index, row) {
            $(".is-error").removeClass('is-error'); //清空验证时的红框
            this.editFormVisible = true;
            this.editForm = {
                id: row.id,
                policyno: row.policyno,
                serialnum: row.serialnum,
                vehicleid: row.vehicleid,
                vehicleplate: row.vehicleplate,
                itype: 'THEFT',
                insurancetype: row.insurancetype,
                issuedate: util.formatDate.format(new Date(row.issuedate), 'yyyy-MM-dd'),
                effectivedate: util.formatDate.format(new Date(row.effectivedate), 'yyyy-MM-dd'),
                expiredate: row.expiredate == undefined ? null : util.formatDate.format(new Date(row.expiredate), 'yyyy-MM-dd'),
                price: row.price,
                indemnitylimit: row.indemnitylimit,
                beneficiary: row.beneficiary,
                vin: row.vin,
                model: row.model,
                color: row.color,
                name: row.name,
                gender: row.gender,
                vehicleownercontact: row.vehicleownercontact,
                addresshome: row.addresshome,
                vehicleowneridcard: row.vehicleowneridcard,
                prodspec: row.prodspec,
                prodmodel: row.prodmodel,
                prodnum: row.prodnum,
                prodsnnum: row.prodsnnum,
                insurancecorpname: row.insurancecorpname,
                insurancestatus: row.insurancestatus,
                insurancecorpid: row.insurancecorpid,
                receivingbankid: row.receivingbankid,
                isactive: row.isactive == 1 ? '正常' : row.isactive == 0 ? '作废' : '未知',
                status: row.status == 1 ? '已无效' :
                    row.status == 2 ? '生效中' :
                        row.status == 3 ? '待生效' :
                            row.status == 4 ? '已退保' :
                                row.status == 5 ? '已报案' :
                                    row.status == 6 ? '已理赔' :
                                        row.status == 7 ? '已过期' :
                                            row.status == 8 ? '理赔中' : '未知'
            }
            this.editFormId = {
                insurancecorpid: row.insurancecorpid,
                insurancecorpname: row.insurancecorpname,
                receivingbankid: row.receivingbankid,
                beneficiary: row.beneficiary,
                itype: 'THEFT',
                insurancetype: '盗抢险',
            }
            this.thisInput = this.editForm.policyno; //将当前验证的字段 已获得的值存入
        },
        //编辑
        editSubmit () {
            if ($(".is-error").hasClass('is-error')) return;//如果保单号重复
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.editLoading = true;
                    let para = {
                        id: this.editForm.id,
                        policyno: this.editForm.policyno,
                        serialnum: this.editForm.serialnum,
                        vehicleid: this.editForm.vehicleid,
                        vehicleplate: this.editForm.vehicleplate,
                        issuedate: util.formatDate.format(new Date(this.editForm.issuedate), 'yyyy-MM-dd'),
                        effectivedate: util.formatDate.format(new Date(this.editForm.effectivedate), 'yyyy-MM-dd'),
                        expiredate: this.editForm.expiredate,
                        price: this.editForm.price,
                        beneficiary: this.editForm.beneficiary,
                        vin: this.editForm.vin,
                        model: this.editForm.model,
                        color: this.editForm.color,
                        name: this.editForm.name,
                        gender: this.editForm.gender,
                        vehicleownercontact: this.editForm.vehicleownercontact,
                        addressHome: this.editForm.addresshome,
                        vehicleowneridcard: this.editForm.vehicleowneridcard,
                        prodspec: this.editForm.prodspec,
                        prodmodel: this.editForm.prodmodel,
                        prodnum: this.editForm.prodnum,
                        prodsnnum: this.editForm.prodsnnum,
                        insurancestatus: this.editForm.insurancestatus,
                        indemnitylimit: this.editForm.indemnitylimit,
                        insurancecorpid: this.editForm.insurancecorpname,
                        insurancetype: this.editForm.insurancetype,
                    }
                    if (this.editFormId.insurancecorpname == this.editForm.insurancecorpname) {
                        para.insurancecorpid = this.editFormId.insurancecorpid;
                    } else {
                        para.insurancecorpid = this.editForm.insurancecorpname;
                    }
                    if (this.editFormId.insurancetype == this.editForm.insurancetype) {
                        para.insurancetype = this.editFormId.itype;
                    } else {
                        para.itype = this.editForm.insurancetype;
                    }
                    modifyInsuranceInfo(para).then((res) => {
                        this.editLoading = false;
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        });
                        this.$refs['editForm'].resetFields();
                        this.editFormVisible = false;
                        this.GetInsurances();
                    });
                }
            });
        },
        selsChange (sels) {
            this.sels = sels;
        },
        // 有效无效开关
        showData (i) {
            this.filters.isactive = i;
            this.currentPage = 1
            this.GetInsurances();
        },
        jump (path, boolean) {
            if (!boolean) {
                this.$message.warning('该账号无权限进入详情页面，请联系管理员!')
                return
            }
            this.$router.push(path)
        },
        async getPolicyno () {
            try {
                const params = {
                    insurancecorpid: this.corporateinfo.id
                }
                const {data} = await getPolicyno(params)
                this.policynos = data.data
            } catch (e) {

            }
        },
        async getInsuranceDataCount () {
            try {
                const params = {
                    insurancecorpid: this.corporateinfo.id,
                    policyno: this.policyno
                }
                const {data} = await getInsuranceDataCount(params)
                this.countData = data.data
                this.GetInsurances();
            } catch (e) {

            }
        },
        isJump (page) {
            return this.permissions.includes(page)
        }
    },
    created () {
        const {policyno} = this.$route.params
        if (policyno)
            this.policyno = policyno
        if (!this.isInsurance) {
            this.GetInsurances();
        } else {
            this.getPolicyno();
            this.getInsuranceDataCount();
        }

    }

}