import util from 'utils/tools.js';
import {
    getGroupInfoList,
    addGroupInfo,
    modifyGroupInfo,
    SetStateGroupInfo,
} from './service'

import { getDepartmentInfoList } from '../department/service'
import { getParentInfoList } from '../organizationManage/service'
import { getEmployeeInfoList, getNamebyUserid } from '@/views/basicManage/employeeManage/service'
import { getSysDictionaryDataList } from '@/views/sysManage/dictionaryManage/SysDictionaryData/service'
import { checkChinese } from '@/utils/formValidation'

export default {
    name: "groupManage",
    props: ['windowOutHeight'],
    data () {
        return {
            fmtdata: util,
            filters: {
                domSearch: [{
                    select: ['groupname'],
                    content: ''
                }], //查询框
                isactive: '1'
            },
            pickerOptions: { //日期
            },
            employlist: [],
            grouptypeOptions: [],
            // typeMap: {},
            value: '',
            formDialogTableVisible: false,
            corplist: [], //所属公司
            corpLoading: false,
            groups: [],
            groupThisList: [],
            empOptions: [], //员工分组列表
            groupNumData: [], //组人数详情列表
            empLoading: false,
            total: 0,
            currentPage: 1,
            pageSize: 15,
            createname: "",
            updatename: "",
            listLoading: false,
            deptlist: [], //员工所属部门列表
            deptLoading: false,
            sels: [], //列表选中列
            checkoutDataT: true, //数据验证返回的布尔值true
            checkoutDataF: [], //数据验证组
            thisInput: '', //编辑时存入row验证的值
            editFormVisible: false, //编辑界面是否显示
            editLoading: false,
            editEmpLoading: false,
            //编辑界面数据
            editForm: {},
            editFormId: {
                deptid: '',
                corpid: '',
            },
            editEmpOptions: [],
            addFormVisible: false, //新增界面是否显示
            addLoading: false,
            rules: {
                groupname: [
                    {required: true, message: '请输入组名', trigger: 'blur'},
                    {validator: checkChinese, trigger: 'blur'}
                ],
                mobile: [
                    {required: true, message: '请输入组长电话', trigger: 'blur'}
                ],
                grouptype: [
                    {required: true, message: '请选择类型', trigger: 'change'}
                ],
                deptname: [
                    {required: true, message: '请选择所属部门', trigger: 'change'}
                ],
                leadername: [
                    {required: true, message: '请选择组长', trigger: 'change'}
                ],
                // mobile: [
                //     {required: true, message: '请输入组长电话', trigger: 'blur'},
                //     {validator: checkAllMobile, trigger: 'blur'}
                // ],
            },
            //新增界面数据
            addForm: {},
            grouptypeLoading: false,
            curGroupUser: [], //编辑页当前已选择的组员
        }
    },
    methods: {
        corpChange (r) {
            if (!r || this.corplist.length > 0) return;
            this.corpLoading = true;
            let para = {
                page: 1,
                limit: 10000
            };
            getParentInfoList(para).then(({data}) => {
                this.corplist = data.data.records;
                this.corpLoading = false;
            }, () => {
                this.corpLoading = false;
            });
        },
        //分组类型查询
        grouptypeChange (r) {
            if (!r || this.grouptypeOptions.length > 0) return;
            this.grouptypeLoading = true;
            let param = {
                dictvalue: 'GroupType',
                limit: 1000,
                page: 1
            }
            getSysDictionaryDataList(param).then((res) => {
                this.grouptypeOptions = res.data.data.records;
                this.grouptypeLoading = false;
                // this.grouptypeOptions.forEach(item => {
                //     this.typeMap[item.dictdataname] = item.dictdatavalue
                // })
            });
        },
        employChange (r) {
            if (!r || this.employlist.length > 0) return;
            let param = {
                page: 1,
                limit: 10000,
                isactive: 1
            }
            getEmployeeInfoList(param).then(({data}) => {
                this.employlist = data.data.records;//未选择公司时不获取部门信息
            }, () => {
                //
            });
        },
        employChangeFn (id) {
            this.employlist.forEach(item => {
                if (item.ID === id) {
                    this.addForm.mobile = item.mobile
                    this.editForm.mobile = item.mobile
                    this.addForm.leadername = id
                }
            })
        },
        // 数据重复验证
        checkout (p, v, index) {
            // if (v == "") return;
            // if (this.thisInput == v) return; //编辑时 没改输入框值
            // this.checkoutDataT = true; //初始化
            // let paras = {
            //     para: p,
            //     value: v,
            // }
            // getCheckoutOfGroupInfo(paras).then((res) => {
            //     let errorInput = res.data.data.param; //保存验证失败的字段
            //     if (!res.data.data.result) {
            //         this.$message({
            //             message: '信息输入重复！',
            //             type: 'warning'
            //         });
            //         this.$refs[errorInput].$el.className = "el-form-item is-error"; //输入框标红
            //         this.checkoutDataF[index] = false
            //     } else {
            //         this.$refs[errorInput].$el.className = "el-form-item"; //输入框恢复
            //         this.checkoutDataF[index] = true
            //     }
            // });
        },
        //查询清空
        clearAll () {
            this.filters.domSearch = [{
                select: [],
                content: ''
            }] //清空查询框;
        },
        //详情查看
        formDetailHandle (data) {
            this.createname = "";
            this.updatename = "";
            this.formDialogTableVisible = true;
            this.groupThisList = ''; //清空上条数据
            // 获取当前分组信息
            // getGroupInfoById(groupid).then(({data}) => {
            this.groupThisList = data;
            let paraThree = {
                createby: this.groupThisList.createby == null ? 0 : this.groupThisList.createby,
                updateby: this.groupThisList.updateby == null ? 0 : this.groupThisList.updateby,
            }

            if (paraThree.createby === paraThree.updateby) {
                getNamebyUserid(paraThree.createby).then(({data}) => {
                    this.createname = data.data && data.data.employeename;
                    this.updatename = data.data && data.data.employeename;
                });
            } else {
                getNamebyUserid(paraThree.createby).then(({data}) => {
                    this.updatename = data.data && data.data.employeename;
                });
                getNamebyUserid(paraThree.updateby).then(({data}) => {
                    this.updatename = data.data && data.data.employeename;
                });
            }
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
        // 排序
        sortChange (col, prop, order) {
            let para = {
                prop: col.prop,
                order: col.order.substring(0, col.order.length - 6),
            }
            // console.log(para);
            // getSortList(para).then((res) => {});
        },
        // 有效无效开关
        showData (i) {
            this.filters.isactive = i;
            this.handleQuerySelect();
        },
        // 组人数详情列表
        showNumData (id) {
            // let para = {
            //     groupid: id,
            // }
            // //获取设备信息
            // getEmpsList(para).then((res) => {
            //     this.groupNumData = res.data.data;
            // });
        },
        //有效无效转换
        isdeleteFomat (row, col) {
            return row.isactive == 0 ? '否' : row.isactive != undefined ? '是' : '未知';
        },
        // 有效无效颜色切换
        tableRowClassName (row, index) {
            if (row.isactive == 0) {
                return 'warning-row';
            }
            return '';
        },
        // 有效按钮切换状态
        handleChange: function (index, row) {
            this.$confirm('确认设置该条记录的状态吗？', '提示', {
                type: 'warning'
            }).then(() => {
                // let para = {
                //     id: row.id,
                //     isactive: row.isactive == 1 ? 0 : 1,
                // }
                let para = Object.assign({}, row)
                para.isactive = row.isactive == 1 ? 0 : 1
                SetStateGroupInfo(para).then((res) => {
                    this.$message({
                        message: '设置成功',
                        type: 'success'
                    });
                    row.isactive = para.isactive;
                    this.handleQuerySelect();
                }).catch(() => {
                    this.listLoading = false;
                });
            });
        },
        // 部门——搜索下拉
        deptChange (r) {
            if (!r || this.deptlist.length > 0) return;
            this.deptLoading = true;
            let param = {
                page: 1,
                limit: 10000,
                cropid: 1,
                isactive: 1
            }
            getDepartmentInfoList(param).then((res) => {
                this.deptlist = res.data.data.records;
                this.deptLoading = false;
            });
        },
        // 部门——搜索下拉
        // deptChangeSelect (query) {
        //     let para = {
        //         showCount: 30,
        //         deptname: query,
        //     }
        //     getAllDeptList(para).then((res) => {
        //         this.deptlist = res.data.data.records;
        //         this.deptLoading = false;
        //     });
        // },
        handleSelectName (item) {
            this.editForm.employeename = item.value;
            this.editForm.groupleaderid = item.id;
            this.editForm.mobile = item.leadermobile;
            this.addForm.employeename = item.value;
            this.addForm.groupleaderid = item.id;
            this.addForm.mobile = item.leadermobile;
        },
        //分组类型显示转换
        // formattype (row, column) {
        //     return !row.grouptype ? '未知' : this.typeMap[row.grouptype];
        // },
        //切换当前页
        handleCurrentChange (val) {
            this.currentPage = val;
            this.handleQuerySelect();
            // this.getGroup();
        },
        //切换每页显示数量
        handleSizeChange (val) {
            this.pageSize = val;
            this.handleQuerySelect();
        },
        //搜索按钮——模糊查询
        handleQuerySelect () {
            let para = {
                page: this.currentPage,
                limit: this.pageSize,
                isactive: this.filters.isactive,
                domSearch: this.filters.domSearch,
            };
            this.listLoading = true;
            getGroupInfoList(para).then(({data}) => {
                _.forEach(data.data.records, item => {
                    item.employeeInfos = _.filter(item.employeeInfos, item => item);
                })
                this.total = data.data.total;
                this.groups = data.data.records;
                this.listLoading = false;
            }).catch((error) => {
                this.listLoading = false;
            });
        },
        handleQuerySelectFn () {
            this.currentPage = 1;
            this.handleQuerySelect()
        },
        //获取用户列表
        // getGroup () {
        //     let para = {
        //         page: this.currentPage,
        //         limit: this.pageSize,
        //         isactive: this.filters.isactive,
        //     };
        //     this.listLoading = true;
        //     getGroupInfoList(para).then(({data}) => {
        //         this.total = data.data.total;
        //         this.groups = data.data.records;
        //         this.listLoading = false;
        //     }).catch((error) => {
        //         this.listLoading = false;
        //     });
        // },
        //显示编辑界面
        handleEdit (index, row) {
            $(".is-error").removeClass('is-error'); //清空验证时的红框
            this.editFormVisible = true;
            //当前已选择的组员
            let ids = row.employeeInfos.map((item) => {
                return item.id
            });
            this.curGroupUser = [...new Set(ids)]
            // this.editForm = Object.assign({}, row)
            // this.editForm.emps = []
            // this.editForm.tempEmps = []
            this.editForm = {
                id: row.id,
                groupcode: row.groupcode,
                groupname: row.groupname,
                deptname: row.deptname,
                corpname: row.corpname,
                croupnum: row.croupnum,
                grouptype: row.grouptype,
                mobile: row.mobile,
                groupleaderid: row.groupleaderid,
                leadername: row.leadername,
                emps: [],
                tempEmps: [],
            };
            this.editForm.tempEmps = this.curGroupUser;
            this.editEmpOptions = this.curGroupUser;
            this.editFormId = {
                deptid: row.deptid,
                deptname: row.deptname,
                corpid: row.corpid,
                corpname: row.corpname,
                leadername: row.leadername,
                groupleaderid: row.groupleaderid,
            }
            this.thisInput = this.editForm.groupname; //将当前验证的字段 已获得的值存入
        },
        //显示新增界面
        handleAdd () {
            $(".is-error").removeClass('is-error'); //清空验证时的红框
            this.addFormVisible = true;
            this.addForm = {
                groupcode: '',
                groupname: '',
                grouptype: '',
                groupleaderid: '',
                mobile: '',
                croupnum: '',
                leadername: '',
                deptname: '',
                corpname: '',
                isactive: '1',
                emps: []
            };
        },
        //编辑
        editSubmit () {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    let grouptype = null,
                        para = Object.assign({}, this.editForm),
                        reg = /^[A-Za-z]+$/;
                    this.editLoading = true;
                    if (reg.test(this.editForm.grouptype)) {
                        grouptype = this.editForm.grouptype;
                    }
                    if (this.editFormId.deptname == this.editForm.deptname) {
                        para.deptid = this.editFormId.deptid;
                    } else {
                        para.deptid = this.editForm.deptname;
                    }

                    if (this.editFormId.leadername == this.editForm.leadername) {
                        para.groupleaderid = this.editFormId.groupleaderid;
                    } else {
                        para.groupleaderid = this.editForm.leadername;
                    }
                    var empsIds = new Array();
                    this.editForm.tempEmps.forEach(function (item, index) {
                        empsIds.push(item);
                    });
                    para.emps = empsIds;

                    modifyGroupInfo(para).then((res) => {
                        this.editLoading = false;
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        });
                        this.$refs['editForm'].resetFields();
                        this.editFormVisible = false;
                        this.handleQuerySelect();
                    }, () => {
                        this.editLoading = false;
                    });
                }
            });
        },
        //新增
        addSubmit () {
            this.checkoutDataF.forEach((item, index) => {
                this.checkoutDataT = item && this.checkoutDataT;
            });
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.addLoading = true;
                    let para = Object.assign({}, this.addForm)
                    para.deptid = para.deptname
                    if (this.checkoutDataT) { //验证通过时(无重复时)
                        addGroupInfo(para).then((res) => {
                            this.addLoading = false;
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            });
                            this.$refs['addForm'].resetFields();
                            this.addFormVisible = false;
                            this.handleQuerySelect();
                        }, () => {
                            this.addLoading = false;
                        });
                    } else {
                        this.addLoading = false;
                        this.$message({
                            message: '标红信息已存在！',
                            type: 'warning'
                        });
                    }

                }
            });
        },
        selsChange (sels) {
            this.sels = sels;
        }
    },
    mounted () {
        this.handleQuerySelect();
        this.employChange(true);
        this.grouptypeChange(true);
    }

}