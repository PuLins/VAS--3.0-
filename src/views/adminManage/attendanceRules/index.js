import util from 'utils/tools'
import { 
         getAttdRuleList, 
         addAttdRule, 
         modifyAttdRule, 
         removeAttdRule, 
         getSelectAttdRuleList, 
         getGroupInfoList, 
         getDeptList, 
         getAttdCenterList 
       } from './service.js';

export default {
    props: ['windowOutHeight'],
    data() {
        //验证考勤区域范围是否为数字
        var checkparam = (rule,value,callback) => {
            var reg =/^[0-9]+$/g,
            flag = reg.test(value);
            if(!flag){
                return callback(new Error('只能输入数字'));
            } else{
                callback();
            }
        };
        return {
            filters: {
                domSearch: [{
                    select: ['deptname'],
                    content: ''
                }], //查询框
            },
            listData: [],
            customers: [],
            deptlist: [], //员工所属部门列表
            deptLoading: false,
            grouplist: [], //所属分组
            groupLoading: false, //
            attendcenterlist: [], //所属中心区域
            attendcenterLoading: false, //
            total: 0,
            currentPage: 1,
            pageSize: 15,
            listLoading: false,
            sels: [], //列表选中列
            editFormVisible: false, //编辑界面是否显示
            editLoading: false,
            editFormRules: {
                deptname: [
                	{ required: true, message: '请选择部门', trigger: 'change' }
                ],
                standardintime: [
                	{ required: true, message: '请输入签入标准时间', trigger: 'blur' }
                ],
                standardouttime: [
                	{ required: true, message: '请输入签出标准时间', trigger: 'blur' }
                ],
                attendparam: [{ 
                        required: true,
                        message: '请输入考勤区域范围', 
                        trigger: 'blur'
                    }, 
                    {
                        validator: checkparam,
                        trigger:'blur'
                    }
                ],
                emplevel: [
                	{ required: true, message: '请输入签出标准时间', trigger: 'blur' }
                ],
                attendcentername: [
                	{ required: true, message: '请输入所属中心区域', trigger: 'change' }
                ],
                buffertime: [{ 
                        required: true, 
                        message: '请输入缓冲时间', 
                        trigger: 'blur' 
                    },
                    {
                        validator: checkparam,
                        trigger:'blur'
                        }
                ],
            },
            //编辑界面数据
            editForm: {
                id: '',
                deptid: '',
                groupid: '',
                emplevel: '',
                standardintime: '',
                standardouttime: '',
                buffertime: '',
                attendcenterid: '',
                attendparam: '',
                remarks: '',
                deptname: '',
                groupname: '',
                attendcentername: '',
            },
            editFormId: {
                groupid: '',
                groupname: '',
                deptname: '',
                deptid: '',
                attendcenterid: '',
                attendcentername: '',
            },

            addFormVisible: false, //新增界面是否显示
            addLoading: false,
            addFormRules: {
                deptname: [
                	{ required: true, message: '请选择部门', trigger: 'change' }
                ],
                standardintime: [
                	{ required: true, message: '请输入签入标准时间', trigger: 'blur' }
                ],
                standardouttime: [
                	{ required: true, message: '请输入签出标准时间', trigger: 'blur' }
                ],
                attendparam: [{ 
                        required: true,
                        message: '请输入考勤区域范围', 
                        trigger: 'blur'
                    }, 
                    {
                        validator: checkparam,
                        trigger:'blur'
                    }
                ],
                emplevel: [
                	{ required: true, message: '请输入员工级别', trigger: 'blur' }
                ],
                attendcentername: [
                	{ required: true, message: '请输入所属中心区域', trigger: 'change' }
                ],
                buffertime: [{ 
                        required: true, 
                        message: '请输入缓冲时间', 
                        trigger: 'blur' 
                    },
                    {
                        validator: checkparam,
                        trigger:'blur'
                        }
                ],
            },
            //新增界面数据
            addForm: {
                deptid: '',
                groupid: '',
                emplevel: '',
                standardintime: '',
                standardouttime: '',
                buffertime: '0',
                attendcenterid: '',
                attendparam: '',
                remarks: '',
                deptname: '',
                groupname: '',
                attendcentername: '',
            },
        }
    },
    methods: {
        // 选择所属部门时，匹配分组，传deptid
        sendDeptIdData(val) {
            this.addForm.groupname = ''; //清空所属分组
            this.editForm.groupname = ''; //清空所属分组
            let para = {
                deptid: val
            }
            getGroupInfoList(para).then((res) => {
                this.grouplist = res.data.data.records;
            });
        },
        //所属 部门——搜索下拉
        deptChange(r) {
            if(!r || this.deptlist.length > 0) return;
            this.deptLoading = true;
            let para = {
                page:1,
                limit:10000,
                isactive:1,
                corpid: 1
            }
            getDeptList(para).then((res) => {
                this.deptlist = res.data.data.records;
                this.deptLoading = false;
            });
        },
        /*所属中心区域——下拉*/
        attendcenterChange(r) {
            if(!r || this.attendcenterlist.length > 0) return;
            const params = {
                limit: 10000,
                page: 1
            }
            this.attendcenterLoading = true;
            getAttdCenterList(params).then((res) => {
                this.attendcenterlist = res.data.data.records;
                this.attendcenterLoading = false;
            });
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
       
        handleCurrentChange(val) {
            this.currentPage = val;
            this.handleQuery();
        },
        //切换每页显示数量
        handleSizeChange(val) {
            this.pageSize = val;
            this.handleQuery();
        },
         //搜索按钮——模糊查询
        handleQuerySelect() {
            let para = {
                page: 1,
                limit: this.pageSize,
                domSearch: this.filters.domSearch,
            };
            this.listLoading = true;
            getSelectAttdRuleList(para).then((res) => {
                this.total = res.data.data.total;
                this.listData = res.data.data.records;
                this.listLoading = false;
            }).catch((error) => {
                this.listLoading = false;
            });
        },
        //获取保单列表
        handleQuery() {
            let para = {
                page: this.currentPage,
                limit: this.pageSize,
            };
            this.listLoading = true;
            getAttdRuleList(para).then((res) => {
                this.total = res.data.data.total;
                this.listData = res.data.data.records;
                this.listLoading = false;
            });
        },

        //删除
        handleDel(index, row) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                let para = {
                    id: row.id,
                };
                removeAttdRule(para).then((res) => {
                    this.listLoading = false;
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.handleQuerySelect();
                }, () => {
                    this.listLoading = false;
                });
            }).catch(() => {

            });
        },
        //显示编辑界面
        handleEdit(index, row) {
            this.editFormVisible = true;
            this.editForm = {
                id: row.id,
                deptname: row.deptname,
                groupname: row.groupname,
                emplevel: row.emplevel,
                standardintime: new Date(2017, 7, 7, row.standardintime.split(":")[0], row.standardintime.split(":")[1], row.standardintime.split(":")[2]),
                standardouttime: new Date(2017, 7, 7, row.standardouttime.split(":")[0], row.standardouttime.split(":")[1], row.standardouttime.split(":")[2]),
                buffertime: row.buffertime,
                attendcentername: row.attendcentername,
                attendparam: row.attendparam,
                remarks: row.remarks,
            }
            this.editFormId = {
                deptid: row.deptid,
                deptname: row.deptname,
                groupid: row.groupid,
                groupname: row.groupname,
                attendcenterid: row.attendcenterid,
                attendcentername: row.attendcentername,
            }
        },
        //显示新增界面
        handleAdd() {
            this.addFormVisible = true;
            this.addForm = {
                groupid: '',
                groupname: '',
                deptname: '',
                deptid: '',
                attendcenterid: '',
                attendcentername: '',
                emplevel: '0',
                standardintime: new Date(2017, 7, 19, 9, 0),
                standardouttime: new Date(2017, 7, 19, 17, 30),
                buffertime: '0',
                attendparam: '',
                remarks: '',
            };

        },
        //编辑
        editSubmit() {
            this.$refs.editForm.validate((valid) => {
                if(valid) {
                    this.editLoading = true;
                    let para = {
                        id: this.editForm.id,
                        deptid: this.editForm.deptname,
                        groupid: this.editForm.groupname,
                        emplevel: this.editForm.emplevel,
                        standardintime: util.formatDate.format(this.editForm.standardintime, 'hh:mm:ss'),
                        standardouttime: util.formatDate.format(this.editForm.standardouttime, 'hh:mm:ss'),
                        buffertime: this.editForm.buffertime,
                        attendcenterid: this.editForm.attendcentername,
                        attendparam: this.editForm.attendparam,
                        remarks: this.editForm.remarks,
                    }
                    if(this.editFormId.deptname == this.editForm.deptname) {
                        para.deptid = this.editFormId.deptid;
                    } else {
                        para.deptid = this.editForm.deptname;
                    }
                    if(this.editFormId.groupname == this.editForm.groupname) {
                        para.groupid = this.editFormId.groupid;
                    } else {
                        para.groupid = this.editForm.groupname;
                    }
                    if(this.editFormId.attendcentername == this.editForm.attendcentername) {
                        para.attendcenterid = this.editFormId.attendcenterid;
                    } else {
                        para.attendcenterid = this.editForm.attendcentername;
                    }
                    modifyAttdRule(para).then((res) => {
                        this.editLoading = false;
                        if(res.data.data==true){
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.$refs['editForm'].resetFields();
                            this.editFormVisible = false;
                            this.handleQuery();
                        }else{
                            this.$message({
                                message: "修改失败！！"+res.data.msg,
                                type: 'error'
                            });
                            // this.editForm.attendcentername='';
                        }
                    }, () => {
                        this.editLoading = false;
                    });
                }
            });
        },
        //新增
        addSubmit() {
            this.$refs.addForm.validate((valid) => {
                if(valid) {
                    this.addLoading = true;
                    let para = {
                         deptid: this.addForm.deptname,
                         groupid: this.addForm.groupname,
                         emplevel: this.addForm.emplevel,
                         standardintime: util.formatDate.format(this.addForm.standardintime, 'hh:mm:ss'),
                         standardouttime: util.formatDate.format(this.addForm.standardouttime, 'hh:mm:ss'),
                         buffertime: this.addForm.buffertime,
                         attendcenterid: this.addForm.attendcentername,
                         attendparam: this.addForm.attendparam,
                         remarks: this.addForm.remarks,
                    }
                    addAttdRule(para).then((res) => {
                        this.addLoading = false;
                        if(res.data.data==true){
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            });
                            this.addFormVisible = false;
                            this.$refs['addForm'].resetFields();
                            this.handleQuery();
                        }else{
                            this.$message({
                                message: "新增失败！！"+res.data.msg,
                                type: 'error'
                            });
                            this.addForm.attendcentername = ''
                        }
                    }, () => {
                        this.addLoading = false;
                    });
                }
            });
        },
        selsChange(sels) {
            this.sels = sels;
        },
    },
    created() {
        this.handleQuery();
    },
}