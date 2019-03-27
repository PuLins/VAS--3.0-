import { getSysDictionaryDataList, addSysDictionaryData, modifySysDictionaryData, removeSysDictionaryData } from './service';

// 验证字典值
var checkFn = (rule, value, callback) => {
    var reg = /[A-Z][\.\_]*$/,// 只能为大写字母或者._
        flag = reg.test(value);
    if (!flag) {
        return callback(new Error('只能输入大写字母'));
    } else {
        callback();
    }
};

export default {
    props: ['windowOutHeight'],
    data () {
        return {
            filters: {
                model: ''
            },
            listData: [],
            customers: [],
            total: 0,
            currentPage: 0,
            pageSize: 15,
            listLoading: false,
            // sels: [], //列表选中列
            editFormVisible: false, //编辑界面是否显示
            editLoading: false,
            editFormRules: {
                dictvalue: [
                    {required: true, message: '字典值必填', trigger: 'blur'},
                    {validator: checkFn, trigger: 'blur'}
                ],
                dictdataname: [
                    {required: true, message: '数据名称必填', trigger: 'blur'}
                ],
                dictdatavalue: [
                    {required: true, message: '数据值必填', trigger: 'blur'}
                ]
            },
            //编辑界面数据
            editForm: {
                act_status: '',
                id: 0,
                dictvalue: '',
                dictdataname: '',
                dictdatavalue: '',
                isfixed: 0,
                remarks: '',
                act_id: '',
            },

            addFormVisible: false, //新增界面是否显示
            addLoading: false,
            //新增界面数据
            addForm: {
                act_status: '',
                dictvalue: '',
                dictdataname: '',
                dictdatavalue: '',
                isfixed: 0,
                remarks: '',
                act_id: '',
            },
        }
    },
    methods: {
        //有效转换器
        formatIsactive (row, column) {
            return row.isactive == 1 ? '有效' : row.isactive == 0 ? '无效' : '未知';
        },
        //切换每页显示数量
        handleSizeChange (val) {
            this.pageSize = val;
            this.handleQuery();
        },
        handleCurrentChange (val) {
            this.currentPage = val;
            this.handleQuery();
        },
        handleQueryFn() {
            this.currentPage = 1;
            this.handleQuery();
        },
        //获取保单列表
        handleQuery () {
            let para = {
                page: this.currentPage,
                limit: this.pageSize,
                searchKey: this.filters.model
            };
            this.listLoading = true;
            getSysDictionaryDataList(para).then(({data}) => {
                this.total = data.data.total;
                this.currentPage = data.data.current;
                this.listData = data.data.records;
                this.listLoading = false;
            });
        },
        //删除
        handleDel (index, row) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                //NProgress.start();
                let para = {
                    ids: row.id
                };

                // let para = new FormData();
                // para.append('ids', row.id);
                // para.append('method','delete');

                removeSysDictionaryData(para).then((res) => {
                    this.listLoading = false;
                    //NProgress.done();
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.handleQuery();
                }, () => {
                    this.listLoading = false;
                });
            }).catch(() => {

            });
        },
        //显示编辑界面
        handleEdit (index, row) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
            // this.GetCustomers();
        },
        //显示新增界面
        handleAdd () {
            this.addFormVisible = true;
            this.addForm = {
                act_status: '',
                dictvalue: '',
                dictdataname: '',
                dictdatavalue: '',
                isfixed: 0,
                remarks: '',
                act_id: '',
            };
            // this.GetCustomers();

        },
        //编辑
        editSubmit () {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    // this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.editLoading = true;
                    //NProgress.start();
                    let para = Object.assign({}, this.editForm);
                    modifySysDictionaryData(para).then((res) => {
                        this.editLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.$refs['editForm'].resetFields();
                        this.editFormVisible = false;
                        this.handleQuery();
                    }, () => {
                        this.editLoading = false;
                    });
                    // });
                }
            });
        },
        //新增
        addSubmit () {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    // this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.addLoading = true;
                    //NProgress.start();
                    let para = Object.assign({}, this.addForm);
                    addSysDictionaryData(para).then((res) => {
                        this.addLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.$refs['addForm'].resetFields();
                        this.addFormVisible = false;
                        this.handleQuery();
                    }, () => {
                        this.addLoading = false;
                    });
                    // });
                }
            });
        },
        // selsChange (sels) {
        //     this.sels = sels;
        // },
    },
    created () {
        this.handleQuery();
    }
}