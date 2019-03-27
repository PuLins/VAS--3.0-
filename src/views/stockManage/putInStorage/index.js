import { getToken } from '@/utils/auth'
import { commitPutIn, getPutIn, getPutInById, viewDistribution, getStoPurchaseList, downloadErrorFile } from './service'
import { mapActions } from 'vuex'

export default {
    name: "putInStorage",
    data () {
        return {
            filters: {
                domSearch: [{
                    select: ['batchno'],
                    content: ''
                }], //查询框
            },
            putInList: [],
            loading: false,
            visible: false,
            distributionVisible: false,
            expandLoading: false,
            isExcel: false,
            pagination: {
                limit: 15,
                total: 0,
                page: 1
            },
            putInForm: {
                inType: '',
                contractNo: '',
                filePath: ''
            },
            fileList: [],
            accept: '.xlsx, .excel',
            token: getToken(),
            inTypes: [{
                value: 'IN_PURCHASE',
                label: '采购入库'
            }, {
                value: 'IN_RETURN',
                label: '返厂入库'
            }],
            purchaseList: [],
            putInRules: {
                inType: [{required: true, message: '请选择入库类型', trigger: 'change'}],
                contractNo: [{required: true, message: '请选择采购合同', trigger: 'change'}],
                filePath: [{required: true, message: '请上传采购文件', trigger: 'blur'}]
            },
            notext: '',
            logisticsList: [],
            putInLoading: false
        }
    },
    props: ['windowOutHeight'],
    methods: {
        ...mapActions(['setPutInData']),
        resetForm () {
            this.filters = {
                domSearch: [{
                    select: [],
                    content: ''
                }]
            }
        },
        handleSizeChange (limit) {
            this.pagination.limit = limit
            this.getPutIn()
        },
        handleCurrentChange (page) {
            this.pagination.page = page
            this.getPutIn()
        },
        addSelect () {
            this.filters.domSearch.push({
                select: [],
                content: ''
            });
        },
        removeSelect (index) {
            this.filters.domSearch.splice(index, 1); //从当前index位置开始，删除一项
        },
        async getPutIn () {
            const params = {
                page: this.pagination.page,
                limit: this.pagination.limit,
                domSearch: this.filters.domSearch,
            }
            this.loading = true
            try {
                const {data} = await getPutIn(params)
                this.putInList = data.data.records
                this.pagination.total = data.data.total
                this.loading = false
            } catch (e) {
                this.loading = false
            }
        },
        // 选择入库方式
        addPutInStorage (command) {
            this.visible = true
            this.fileList = []
            this.isExcel = command
        },
        // 选择改变文件
        changeFile (file, fileList) {
            if (fileList.length > 1) {
                this.fileList = fileList.slice(1)
            } else {
                this.fileList = fileList
            }
        },
        removeFile () {

        },
        // 文件上传成功
        uploadSuccess (response, file, fileList) {
            if (response.code === 1) {
                this.$message.warning(response.msg)
                this.$refs.upload.clearFiles()
                return
            }

            this.$message.success('上传成功')
            this.$refs.putInFilePath.clearValidate();
            this.putInForm.filePath = response.data;
        },
        uploadError (err) {
            const data = JSON.parse(err.message)
            if (data.code === 478) {
                this.$store.dispatch('felogout')
                this.$router.push('/')
            }
            this.$message.error(data.message || data.msg)
        },
        // 提交新增入库单
        submit () {
            this.$refs.putInForm.validate(async valid => {
                    if (valid) {
                        try {
                            this.putInLoading = true
                            let url = ''
                            let beanData = {
                                isExcel: this.isExcel
                            }
                            if (this.isExcel) {
                                url = 'sto/stoUpload/commitUploadFile'
                                beanData.attachurl = this.putInForm.filePath
                            } else {
                                url = 'sto/stoAction/createByManual'
                            }
                            const {data} = await commitPutIn(url, this.putInForm)
                            this.putInLoading = false
                            if (data.data.error) {
                                this.$message.error('你的入库文件验证未通过，详情请查看excel')
                                // const path = data.data.errorPath.split(':')
                                // downloadErrorFile({errorPath: data.data.errorPath})
                                // window.location = encodeURI(path[1])
                                window.location = `/sto/stoUpload/downloadErrorFile?errorPath=${data.data.errorPath}`;
                                return
                            }
                            if (data.data.data) {
                                this.setPutInData(Object.assign(beanData, data.data.data))
                                this.$router.push({name: 'putInStorageInvoices'})
                            } else if (data.data) {
                                this.setPutInData(Object.assign(beanData, data.data))
                                this.$router.push({name: 'putInStorageInvoices'})
                            } else {
                                this.$message.error('读取文件失败，请重试')
                            }
                        } catch (e) {
                            this.putInLoading = false
                        }
                    }
                }
            )
        },
        // 手动上传文件
        // submitUpload () {
        //     if(!this.fileList.length) {
        //         this.$message.warning('请选择文件')
        //         return
        //     }
        //     this.$refs.upload.submit();
        // },
        // 获取采购合同
        async getStoPurchaseList () {
            try {
                const params = {
                    limit: 10000,
                    page: 1
                }
                const {data} = await getStoPurchaseList(params)
                this.purchaseList = data.data
            } catch (e) {

            }
        },
        download () {
            if (this.putInForm.inType) {
                window.location = `/sto/stoUpload/getExcelTemplate?inType=${this.putInForm.inType}`;
            } else {
                this.$refs.putInForm.validateField('inType')
            }
        },
        // 查看详情
        async viewDetails (storage) {
            try {
                const {data} = await getPutInById(storage.id)
                this.setPutInData(Object.assign({
                    isView: true
                }, data.data))
                this.$router.push({name: 'putInStorageInvoices'})
            } catch (e) {

            }
        },
        dateFormatter (row) {
            if (row.actiontype === 'IN_PURCHASE')
                return new Date(row.purchasedate).format('yyyy-MM-dd')
            else
                return new Date(row.createdate).format('yyyy-MM-dd')
        },
        typeFormatter (row) {
            const data = _.find(this.inTypes, {value: row.actiontype})
            return data.label || '未知'
        },
        // 查看物流
        async viewDistribution (row) {
            this.distributionVisible = true
            this.expandLoading = true
            this.logisticsList = []
            this.notext = ''
            try {
                const params = {
                    id: row.deliveryid
                }
                const {data} = await viewDistribution(params)
                this.expandLoading = false
                this.logisticsList = data.data.traces.reverse();//倒叙
                this.logisticsList.logisticName = data.data.logisticName;
                this.logisticsList.logisticCode = data.data.logisticCode;
            } catch (e) {
                this.expandLoading = false
                this.notext = '抱歉！该订单暂不支持查询！'
                if (e && e.data && e.data.msg) {
                    this.notext = e.data.msg
                }
            }
        }
    },
    mounted () {
        this.getPutIn()
    }
}