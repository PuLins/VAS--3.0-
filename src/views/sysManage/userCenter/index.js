import util from 'utils/tools.js'
import {
    modifySysUserInfo,
    removeSysUserInfo,
    getSysRoleInfoList,
    editUserRole,
    getUserRole,
    getSysUserList,
    // getCorpAllList,
    editCorpRole,
    getThisCorpList,
    getCheckoutOfUser,
    getSelectListVehnotTag,
    getHaveVehList,
    modifyHaveVehList,
    getGroupAllList,
    getGroupThisList,
    editGroupRole,
    corporatelevel_authority,
    corporatevehicle_vehicles,
    getSelectListVehnotAuthority
} from './service';

import { getCorporateInfo } from '../organizationManage/service'

export default {
    props: ['windowOutHeight'],
    data () {
        return {
            vehRoleLabelList: [],
            defaultCheckedKeysVehLabels: [],
            checkAllTwoLable: false,
            checkAllThisPageLabel: false,
            treeRouseVehLabelLoading: false,
            checkAllTwoCarLabel: false,
            editLabelVehInfoVisible: false,

            vasRegions: [],
            labelTreeRouseLoading: false,
            labelDefaultProps: {
                label: 'tagname',
                children: 'children'
            },
            filters: {
                searchKey: '',
                name: '',
                isenable: '1'
            },
            pageSize: 15,
            filterTextGis: '', //组织过滤
            filterTextVas: '',
            filterTextGroup: '', //分组过滤
            activeName: 'first',
            tabName: '', //存储点击的tab名
            listData: [],
            customers: [],
            total: 0,
            curResourceId: '',
            currentPage: 1,
            listLoading: false,
            sels: [], //列表选中列
            checkoutDataT: true, //数据验证返回的布尔值true
            checkoutDataF: [], //
            treeLoading: false,
            thisInput: [], //编辑时存入row验证的值
            editFormVisible: false, //编辑界面是否显示
            editLoading: false,
            editRoleInfoVisible: false,
            editFormRules: {},
            checkAll: true,
            defaultCheckedKeysVehLabel: [],
            nodeLoading: false,
            checkedCities: [],
            cities: [],
            curUserId: '',
            isIndeterminate: true,

            groupLoading: false,
            editGroupInfoVisible: false, //分组权限页面
            groupRoleList: [], //选择的分组
            treeRouseGroupLoading: false,
            tempGroupRoleList: [],
            defaultPropsGroup: {
                label: 'groupname',
                children: 'groups'
            },
            isPeweGroup: true,
            defaultCheckedKeysGroup: [], //默认勾选的节点的 key 的数组
            defaultExpandedKeysGroup: [], //默认展开的节点的 key 的数组
            corpLoading: false,
            editCorpInfoVisible: false, //组织权限页面
            corpRoleList: [], //选择的组织组
            treeRouseVasLoading: false,
            gisCorpRoleList: [],
            treeRouseLoading: false,
            tempCorpRoleList: [],
            defaultProps: {
                label: 'corpname',
                children: 'children'
            },
            isPewe: true,
            defaultCheckedKeys: [], //默认勾选的节点的 key 的数组
            defaultExpandedKeys: [], //默认展开的节点的 key 的数组
            gisDefaultExpandedKeys: [],
            gisDefaultCheckedKeys: [],
            userId: '', //当前点击的用户id

            vehLabelLoading: false,
            vehLoading: false,
            editVehInfoVisible: false, //车辆权限页面
            vehRoleList: [], //选择的车辆组
            treeRouseVehLoading: false,
            vehStatus: [], //返回的用户组织车辆关联数据
            userCorpId: '', //当前用户组织关联id
            defaultCheckedKeysVeh: [], //默认勾选的节点的 key 的数组
            saveDefaultCheckedKeysVeh: [], //默认勾选的节点的 key 的数组
            saveDefaultCheckedKeysVehTwo: [], //默认勾选的节点的 key 的数组
            saveDefaultCheckedKeysVehTwoLabel: [],
            saveDefaultCheckedKeysVehLabel: [],
            checkAllTwo: false,
            checkAllThisPage: false,
            corpId: '', //存入当前组织id
            corpName: '', //存入当前组织name
            statusCorp: '', //当前车辆状态
            saveData: '',
            curtagid: '',
            defaultPropsVeh: {
                label: 'model',
            },
            defaultPropsVehLabel: {
                label: 'model',
            },
            //编辑界面数据
            editForm: {
                id: 0,
                name: '',
                checkPassword: '',
                password: '',
                qq: '',
                wechat: '',
                mobile: '',
                usertype: '',
                firstlogintime: '',
                lastlogintime: '',
                logincount: 0,
            },
        }
    },
    watch: {
        filterTextVas (val) {
            this.$refs.treeRouseVas.filter(val);
        },
        filterTextGis (val) {
            this.$refs.treeRouse.filter(val);
        },
        filterTextGroup (val) {
            this.$refs.treeRouseGroup.filter(val);
        },
    },
    methods: {
        vehEditLabelClose () {
            this.vehRoleLabelList = []; //列表初始化
            this.vehLabelLoading = false;
            this.checkAllThisPageLabel = false; //初始化
            this.checkAllTwoLable = false;
            this.defaultCheckedKeysVehLabels = []; //初始化

            this.saveDefaultCheckedKeysVehTwoLabel = [];
            this.checkAllTwoLable = false;
            this.filters.searchKey = "";
        },
        //树的选中操作
        handleCheckChangeVehLable (data, checked, indeterminate) {
            let tmpFlag = true;
            if (checked) { //勾选时
                if (this.saveDefaultCheckedKeysVehTwoLabel.length == 0) {
                    this.saveDefaultCheckedKeysVehTwoLabel.push(data.ID);
                    return;
                }
                this.saveDefaultCheckedKeysVehTwoLabel.forEach((id, index) => {
                    if (id == data.ID) tmpFlag = false; //存储数据里没有
                });
                if (tmpFlag) this.saveDefaultCheckedKeysVehTwoLabel.push(data.ID); //添加
            } else { //取消勾选时
                this.saveDefaultCheckedKeysVehTwoLabel.forEach((id, index) => {
                    if (id == data.ID) this.saveDefaultCheckedKeysVehTwoLabel.splice(index, 1); //存储数据里已有，删除
                });
                if (this.checkAllTwoLable) { //当全选框勾选时
                    if (this.vehRoleLabelList.length > this.$refs.treeRouseVehLabel.getCheckedKeys().length) {
                        this.checkAllTwoLable = false;
                    }
                }
            }
        },
        // 选择当页
        handleCheckAllChangeThisPageLabel (val) {
            let list = [];
            if (val) {
                this.vehRoleLabelList.forEach((item, index) => {
                    if (item.ID != undefined)
                        list.push(item.ID);
                });
                this.$refs.treeRouseVehLabel.setCheckedKeys(list);
                this.labelSearch();
            } else { //取消勾选时
                this.$refs.treeRouseVehLabel.setCheckedKeys([]);
            }
        },
        // 搜索
        labelSearch () {
            // 搜索出当前条件车辆
            let paraTwo = {
                    tagid: this.curtagid,
                    searchKey: this.filters.searchKey
                },
                keyids = this.$refs.treeRouseVehLabel.getCheckedKeys(); //将已选存入
            corporatevehicle_vehicles(paraTwo).then((res) => {
                if (res.data.result.code == 0) {
                    if (!this.checkAllTwoLable) { //当是全选时
                        res.data.data.records.forEach((item, index) => {
                            this.defaultCheckedKeysVehLabels.push(item.ID); //默认选中——全选框选中数组
                        });
                    } else {
                        let tempArr = []; //新选列表
                        if (this.saveDefaultCheckedKeysVehLabel.length != 0) { //当有数据时
                            this.saveDefaultCheckedKeysVehLabel = this.saveDefaultCheckedKeysVehTwoLabel; //将合并后的数据存入
                            keyids.forEach((id, index) => { //循环已选列表
                                this.saveDefaultCheckedKeysVehLabel.forEach((id2, index) => { //循环新选列表
                                    if (id != id2) { //当已选列表中不存在新选时
                                        tempArr.push(id); //添加给新选列表
                                    }
                                });
                            });
                        } else { //当没有数据时，将已选直接存入新选列表
                            tempArr = keyids;
                        }
                        this.saveDefaultCheckedKeysVehTwoLabel = this.saveDefaultCheckedKeysVehLabel.concat(tempArr); //合并
                        this.defaultCheckedKeysVehLabels = this.saveDefaultCheckedKeysVehTwoLabel; //赋值给默认选中
                    }
                    this.vehRoleLabelList = res.data.data.records; //存储搜索车辆列表数据
                }
            });
        },
        // 筛选过滤——组织
        filterNodeCorp (value, data) {
            if (!value) return true;
            return data.corpname.indexOf(value) !== -1;
        },
        //切换每页显示数量
        handleSizeChange (val) {
            this.pageSize = val;
            this.handleQuery();
        },
        // 筛选过滤——分组
        filterNodeGroup (value, data) {
            if (!value) return true;
            return data.groupname.indexOf(value) !== -1;
        },
        // 数据重复验证
        checkout (p, v, index) {
            if (v == "") return;
            if (this.thisInput == v) return; //编辑时 没改输入框值
            this.checkoutDataT = true; //初始化
            let paras = {
                para: p,
                value: v,
            }
            getCheckoutOfUser(paras).then((res) => {
                let errorInput = res.data.data.param; //保存验证失败的字段
                if (!res.data.data.result) {
                    this.$message({
                        message: '信息输入重复！',
                        type: 'warning'
                    });
                    this.$refs[errorInput].$el.className = "el-form-item is-error"; //输入框标红
                    this.checkoutDataF[index] = false
                } else {
                    this.$refs[errorInput].$el.className = "el-form-item"; //输入框恢复
                    this.checkoutDataF[index] = true
                }
            });
        },

        //分组权限编辑显示
        groupEdit (index, row) {
            this.userId = row.id; //获取用户id
            this.editGroupInfoVisible = true;

            // 查当前用户 有无选择组织权限
            let para = {
                id: row.id,
                system: 'A',
            };
            this.treeRouseGroupLoading = true;
            getGroupThisList(para).then((res) => {
                let dk = [],
                    ek = [],
                    tempdata = [];
                res.data.data.forEach((obj, index) => { //遍历当前用户已选分组
                    tempdata.push(obj); //筛选出子集
                });
                tempdata.forEach(function (item) { //重新遍历删除后的数组
                    dk.push(item);
                    ek.push(item);
                });
                this.defaultCheckedKeysGroup = dk; //选中当前树
                this.defaultExpandedKeysGroup = ek; //展开
                if (this.groupRoleList.length > 0) return;
                //初始化所有父节点树
                getGroupAllList().then((res) => {
                    this.groupRoleList = res.data.data;
                    this.treeRouseGroupLoading = false;
                });
            });
        },
        renderContentGroup (h, {
            node,
            data,
            store
        }) {
            return (<span><span>{data.groupname}</span></span>);
        },
        //树的选中操作
        handleCheckChangeGroup (data, checked, indeterminate) {
            let arr = this.$refs.treeRouseGroup.getCheckedKeys(), //目前被选中的节点所组成的数组
                kesarry = this.$refs.treeRouseGroup.getCheckedNodes(), //目前被选中的节点所组成的数组
                isClearFl = false;
            /*如果子菜单有选中不能取消当前选择 start*/
            if (!checked && data.groupcode != 0) {
                kesarry.forEach((res, index) => {
                    if (res.id == data.groupcode) {
                        res.groups.forEach((res, index) => {
                            if ($.inArray(parseInt(res.id), arr) >= 0) {
                                isClearFl = true;
                                return false;
                            }
                        });
                        if (!isClearFl) {
                            this.$refs.treeRouseGroup.setChecked(data.groupcode, false); //通过 key/data设置某个节点的勾选状态
                            return false;
                        }
                    }
                });
            }
            /*选中父类时候选中给所有子类*/
            if (data.groupcode == 0 && checked && this.isPeweGroup) {
                console.log(data)
                util.setCheckedGroup(this.$refs.treeRouseGroup, data, true, true);
                return;
            }
            ;
            /*取消选中父类时候取消给所有子类*/
            if (data.groupcode == 0 && !checked && this.isPeweGroup) {
                util.setCheckedGroup(this.$refs.treeRouseGroup, data, false, true);
                return;
            }
            ;
            this.isPeweGroup = true;
        },
        // 组织权限关闭时
        groupEditClose () {
            this.groupRoleList = [];
            this.filterTextGroup = ''; //过滤清空
        },
        // 有效无效开关
        showData (i) {
            this.filters.isenable = i;
            this.handleQuerySelect();
        },
        // 点击提交时
        handleGroupClick () {
            this.groupLoading = true;
            let treeNode = this.$refs.treeRouseGroup.getCheckedNodes(), //目前被选中的节点所组成的数组
                para = [],
                _this = this;

            if (treeNode.length == 0) { //当没选分组时
                para.push({
                    userid: _this.userId,
                    system: 'A'
                });
            } else {
                treeNode.forEach(function (item, index) {
                    let obj = {};
                    obj.userid = _this.userId; //当前用户id
                    obj.groupid = item.id; //第一级id
                    para.push(obj);
                });
            }
            editGroupRole(para).then((res) => {
                let data = res.data.data;
                if (res.data.result.code == 4001) {
                    this.$message({
                        message: res.result.desc,
                        type: 'error'
                    });
                } else {
                    this.$message({
                        message: '编辑分组成功！',
                        type: 'success'
                    });
                    this.groupLoading = false;
                    this.editGroupInfoVisible = false;
                }
            });
        },
        vehLabelEdit (data) {
            this.editLabelVehInfoVisible = true;
            let para = {
                tagid: data.id
            }
            this.curtagid = data.id;
            this.treeRouseVehLabelLoading = true;
            corporatevehicle_vehicles(para).then((resCar) => {
                if (resCar.data.result.code == 0) {
                    if (data.chooseArea == 'ALL') {
                        this.treeRouseVehLabelLoading = false;
                        resCar.data.data.records.forEach((item, index) => {
                            this.defaultCheckedKeysVehLabels.push(item.ID); //默认选中——全选框选中数组
                        });
                        this.saveDefaultCheckedKeysVehTwoLabel = this.defaultCheckedKeysVehLabels; //默认选中——全选框选中数组
                        this.vehRoleLabelList = resCar.data.data.records; //存储搜索车辆列表数据
                    } else {
                        if (this.userCorpId) {
                            let para = {
                                usercorpid: this.userCorpId,
                                tagid: data.id
                            }
                            getSelectListVehnotAuthority(para).then((res) => {
                                this.treeRouseVehLabelLoading = false;
                                if (res.data.result.code == 0) {
                                    this.defaultCheckedKeysVehLabels = res.data.data; //默认选中——全选框选中数组
                                    this.saveDefaultCheckedKeysVehTwoLabel = res.data.data; //默认选中——全选框选中数组
                                    this.vehRoleLabelList = resCar.data.data.records; //存储搜索车辆列表数据
                                }
                            });
                        } else {
                            this.treeRouseVehLabelLoading = false;
                            this.vehRoleLabelList = resCar.data.data.records; //存储搜索车辆列表数据
                        }
                    }
                } else {
                    this.treeRouseVehLabelLoading = false;
                }
            });
        },
        //车辆权限编辑显示
        vehEdit (data) {
            this.corpId = data.id; //存入corpid
            this.corpName = data.corpname; //存入corpname
            this.userCorpId = '';
            // 循环遍历——当点击的组织id与已选组织中某一个相同时，存入用户组织id
            this.vehStatus.forEach((item, index) => {
                if (item.corpid == data.id) this.userCorpId = item.usercorpid;
            });
            this.editVehInfoVisible = true;
            if (!this.userCorpId) {
                let paraTwo = {
                    corpid: this.corpId
                }
                this.treeRouseVehLoading = true;
                this.checkAllTwo = false;
                getSelectListVehnotTag(paraTwo).then((res) => {
                    this.treeRouseVehLoading = false;
                    if (res.data.result.code == 0) {
                        this.vehRoleList = res.data.data.records;
                    }
                });
            } else {// 查当前组织 有无选择车辆权限
                let para = {
                    usercorpid: this.userCorpId,
                };
                this.treeRouseVehLoading = true;
                getHaveVehList(para).then((res) => {
                    let resKey = res.data.data.records;
                    for (let i = 0, len = resKey.length; i < len; i++) {
                        this.defaultCheckedKeysVeh.push(resKey[i].id); //默认选中——全选框选中数组
                    }
                    this.saveDefaultCheckedKeysVehTwo = this.defaultCheckedKeysVeh;
                    // this.vehRoleList = resKey;//页面显示
                    this.statusCorp = res.data.data.queryMap.vehiclescope; //存入当前车辆状态
                    //当有已选车辆时，终止执行
                    if (this.vehRoleList.length > 0) {
                        this.treeRouseVehLoading = false;
                        return;
                    }
                    ;

                    //初始化所有父节点树
                    let paraTwo = {
                        corpid: this.corpId,
                    }
                    if (this.statusCorp == 'SUB') { //当为【部分】不选车时
                        this.checkAllTwoCarLabel = false;//全选框取消
                        getSelectListVehnotTag(paraTwo).then((res) => { //默认不选中
                            this.treeRouseVehLoading = false;
                            this.vehRoleList = res.data.data.records;
                            if (this.checkAllTwo == false) { //未全选时
                                let checkVeh = [];//当前已选车辆
                                this.vehRoleList.forEach((item, index) => {//当前查询这页的30条车辆数据
                                    resKey.forEach((item2, index2) => {//当前用户已分配的车辆信息
                                        if (item.id == item2.id) {//如果存在当前页面中
                                            checkVeh.push(item.id)//存入
                                        }
                                    })
                                })
                                this.$refs.treeRouseVeh.setCheckedKeys(checkVeh); //勾选节点
                            }
                        });
                    } else {
                        this.checkAllTwoCarLabel = true;//全选框勾选
                        getSelectListVehnotTag(paraTwo).then((res) => {
                            this.treeRouseVehLoading = false;
                            res.data.data.records.forEach((item, index) => {
                                this.defaultCheckedKeysVeh.push(item.id); //默认选中——全选框选中数组
                            })
                            this.vehRoleList = res.data.data.records;
                        });
                    }
                });
            }
            let paraTwo = {
                userid: this.userId,
                corpid: this.corpId,
                parenttagid: 0
            }
            this.labelTreeRouseLoading = true;
            corporatelevel_authority(paraTwo).then((res) => {
                this.labelTreeRouseLoading = false;
                if (res.data.result.code == 0) {
                    res.data.data.forEach((item, index) => {
                        if (item.isChoose == 1) {
                            this.defaultCheckedKeysVehLabel.push(item.id); //默认选中——全选框选中数组
                        }
                    });
                    this.vasRegions = res.data.data;
                }
            });
        },
        labelRenderContent (h, {
            node,
            data,
            store
        }) {
            let str;
            if (data.parentcorpcode != '0') { //当不为第一级【类别】的时候
                str = (<span>
                        <span><span>{data.tagname}</span></span>
                        <el-button style="margin-left:10px;display: inline-block;padding: 0 5px;height: 24px;line-height: 22px;font-size: 12px;opacity:0.8;"
                                   id={'ltag' + data.id} size='mini' on-click={(e) => {
                            this.vehLabelEdit(data);
                            e.stopPropagation();
                        }}>车辆权限分配</el-button>
                    </span>);
                return str;
            } else { //当为第一级的时候
                return (<span><span>{data.corpname}</span></span>);
            }
        },
        //点击父类加载子类标签节点
        loadLabelChild (node, resolve) {
            if (node.level === 0) {
                return resolve([{tagname: this.corpName}]);
            }
            if (node.level > 3) return resolve([]);
            let para = {
                userid: this.userId,
                corpid: this.corpId,
                parenttagid: 0
            }, data;
            if (node.data.id) {
                para.parenttagid = node.data.id;
            }
            this.isLevelLoading = true;
            corporatelevel_authority(para).then((res) => {
                this.isLevelLoading = false;
                if (res.data.result.code == 0) {
                    res.data.data.forEach((item, index) => {
                        if (item.isChoose == 1) {
                            this.defaultCheckedKeysVehLabel.push(item.id); //默认选中——全选框选中数组
                        }
                    });
                    data = res.data.data;
                    resolve(data)
                }
            });
        },
        // 搜索
        search () {
            // 搜索出当前条件车辆
            let paraTwo = {
                    corpid: this.corpId,
                    searchKey: this.filters.searchKey
                },
                keyids = this.$refs.treeRouseVeh.getCheckedKeys(); //将已选存入
            // if(keyids.length)
            getSelectListVehnotTag(paraTwo).then((res) => {
                if (res.data.result.code == 0) {
                    if (this.checkAllTwo) { //当是全选时
                        res.data.data.records.forEach((item, index) => {
                            // this.defaultCheckedKeysVeh.push(item.id);
                            this.$refs.treeRouseVeh.setChecked(item.id, true)//默认选中——全选框选中数组
                        })
                    } else {
                        let tempArr = []; //新选列表
                        if (this.saveDefaultCheckedKeysVehTwo.length != 0) { //当有数据时
                            this.saveDefaultCheckedKeysVeh = this.saveDefaultCheckedKeysVehTwo; //将合并后的数据存入
                            keyids.forEach((id, index) => { //循环已选列表
                                var isVeh = this.saveDefaultCheckedKeysVeh.filter((id2, index) => { //循环新选列表
                                    if (id == id2)//当已选列表中不存在新选时
                                        return id2;
                                });
                                if (isVeh.length == 0)
                                    tempArr.push(id);
                            });
                        } else { //当没有数据时，将已选直接存入新选列表
                            tempArr = keyids;
                        }
                        this.saveDefaultCheckedKeysVehTwo = this.saveDefaultCheckedKeysVeh.concat(tempArr); //合并
                        this.defaultCheckedKeysVeh = this.saveDefaultCheckedKeysVehTwo; //赋值给默认选中
                    }
                    this.vehRoleList = res.data.data.records; //存储搜索车辆列表数据
                }
            });
            // 搜索出当前条件车辆
            // let paraTwo = {
            // 	corpid:this.corpId,
            // 	searchKey:this.filters.searchKey
            // },
            // keyids = this.$refs.treeRouseVeh.getCheckedKeys(); //将已选存入
            // getSelectListVehnotTag(paraTwo).then((res) => {
            // 	if(res.data.result.code == 0){
            // 		if(this.checkAllTwo) { //当是全选时
            // 			res.data.data.records.forEach((item, index) => {
            // 				this.defaultCheckedKeysVeh.push(item.id); //默认选中——全选框选中数组
            // 			})
            // 		} else {
            // 			let tempArr = []; //新选列表
            // 			if(this.saveDefaultCheckedKeysVeh.length != 0) { //当有数据时
            // 				this.saveDefaultCheckedKeysVeh = this.saveDefaultCheckedKeysVehTwo; //将合并后的数据存入
            // 				keyids.forEach((id, index) => { //循环已选列表
            // 					this.saveDefaultCheckedKeysVeh.forEach((id2, index) => { //循环新选列表
            // 						if(id != id2) { //当已选列表中不存在新选时
            // 							tempArr.push(id); //添加给新选列表
            // 						}
            // 					});
            // 				});
            // 			} else { //当没有数据时，将已选直接存入新选列表
            // 				tempArr = keyids;
            // 			}
            // 			this.saveDefaultCheckedKeysVehTwo = this.saveDefaultCheckedKeysVeh.concat(tempArr); //合并
            // 			this.defaultCheckedKeysVeh = this.saveDefaultCheckedKeysVehTwo; //赋值给默认选中
            // 		}
            // 		this.vehRoleList = res.data.data.records; //存储搜索车辆列表数据
            // 	}
            // });
        },
        renderContentVehLabel (h, {node, data, store}) {
            return <span style="flex: 1; display: flex;font-size: 14px; padding-right: 8px;position:relative;height:60px;">
		                    <span>
		                    	<span>{'车架号：' + (data.vin == null ? '暂无' : data.vin)}</span>
		                    </span>
		                    <el-tag style="margin-left:10px;" size="mini" type="primary">{(data.name == null ? '暂无' : data.name)}</el-tag><br/>
		                    <span
                                style="font-size:12px;color:#B6B6B6;position:absolute;top: 18px;left: 0;">{'车型：' + (data.model == null ? '暂无' : data.model)}</span><br/>
		                    <span
                                style="font-size:12px;color:#B6B6B6;position:absolute;top: 35px;left: 0;">{'车牌号：' + (data.licenseplatenum == null ? '暂无' : data.licenseplatenum)}</span>
						</span>
        },
        renderContentVeh (h, {node, data, store}) {
            return <span style="flex: 1; display: flex;font-size: 14px; padding-right: 8px;position:relative;height:80px;">
		                    <span>
		                    	<span>{'车架号：' + (data.vin == null ? '暂无' : data.vin)}</span>
		                    </span>
		                    <el-tag style="margin-left:10px;" size="mini" type="primary">{(data.name == null ? '暂无' : data.name)}</el-tag><br/>
		                    <span
                                style="font-size:12px;color:#B6B6B6;position:absolute;top: 18px;left: 0;">{'车型：' + (data.model == null ? '暂无' : data.model)}</span><br/>
		                    <span
                                style="font-size:12px;color:#B6B6B6;position:absolute;top: 35px;left: 0;">{'车牌号：' + (data.licenseplatenum == null ? '暂无' : data.licenseplatenum)}</span>
		                     <span style="font-size:12px;color:#B6B6B6;position:absolute;top: 54px;left: 0;">
		                     车辆分组：
                                 {
                                     data.corporatelevels.map((item, index) => {
                                         return (<span><el-tag size="mini" type="primary">{item.tagname}</el-tag>-</span>)
                                     })
                                 }
							</span>
						</span>
        },
        handleVehLabelClick () {
            let _this = this;
            let treeNode = this.saveDefaultCheckedKeysVehTwoLabel, //目前被选中的节点所组成的数组
                para;
            para = {
                userid: _this.userId,
                corporateid: this.corpId,
                tagid: this.curtagid,
                vehicleids: treeNode
            }; //数据存入
            this.vehLabelLoading = true;
            modifyHaveVehList(para).then((res) => {
                let data = res.data.data;
                if (res.data.result.code == 4001) {
                    this.$message({
                        message: res.result.desc,
                        type: 'error'
                    });
                }
                if (res.data.result.code == 0) {
                    this.$message({
                        message: '编辑标签车辆权限成功！',
                        type: 'success'
                    });
                    this.editLabelVehInfoVisible = false;
                    this.editVehInfoVisible = false;
                    if (this.checkAllTwoLable) { //当全选框勾选时—【全部all】
                        $(this.$refs.treeRouseVehLabel.$el).find("#ltag" + this.curtagid).removeClass("el-button--warning").addClass("el-button--success").children().text("全部"); //改变组织标签颜色
                    } else {
                        $(this.$refs.treeRouseVehLabel.$el).find("#ltag" + this.curtagid).removeClass("el-button--success").addClass("el-button--warning").children().text("部分"); //改变组织标签颜色
                    }
                    if (!$(this.$refs.treeRouseVehLabel.$el).find("#ltag" + this.curtagid).parent().parent().parent().hasClass("is-checked"))
                        $(this.$refs.treeRouseVehLabel.$el).find("#ltag" + this.curtagid).parent().parent().parent().addClass("is-checked").attr("aria-checked", true).find("label.el-checkbox").addClass("is-checked").children().addClass("is-checked");
                }
                this.vehLabelLoading = false;
            });
        },
        // 点击提交时
        handleVehClick () {
            let _this = this;
            let fzlab = this.$refs.treeRouseVehFzLabel.getCheckedKeys();
            let treeNode = this.saveDefaultCheckedKeysVehTwo, //目前被选中的节点所组成的数组
                para;
            para = {
                userid: _this.userId,
                corporateid: this.corpId,
                tagids: [],
                vehiclescope: '',
                id: this.userCorpId,
                vehicleids: []
            }; //数据存入
            if (this.checkAllTwoCarLabel) {
                para.vehiclescope = 'ALL';
            } else {
                para.vehicleids = treeNode;
            }
            if (fzlab.length > 0) {
                para.tagids = fzlab;
            }
            this.vehLoading = true;
            modifyHaveVehList(para).then((res) => {
                let data = res.data.data;
                if (res.data.result.code == 4001) {
                    this.$message({
                        message: res.result.desc,
                        type: 'error'
                    });
                }
                if (res.data.result.code == 0) {
                    this.$message({
                        message: '编辑车辆权限成功！',
                        type: 'success'
                    });
                    this.editVehInfoVisible = false;
                    this.vehStatus.push({
                        corpid: this.corpId,
                        vehiclescope: data.vehiclescope,
                        usercorpid: data.id
                    }); //筛选出子集——公司、状态、组织用户关联id

                    if (this.checkAllTwoCarLabel) { //当全选框勾选时—【全部all】
                        $(this.$refs.treeRouse.$el).find("#tag" + this.corpId).removeClass("el-button--warning").addClass("el-button--success").children().text("全部"); //改变组织标签颜色
                    } else {
                        $(this.$refs.treeRouse.$el).find("#tag" + this.corpId).removeClass("el-button--success").addClass("el-button--warning").children().text("部分"); //改变组织标签颜色
                    }
                    if (!$(this.$refs.treeRouse.$el).find("#tag" + this.corpId).parent().parent().parent().hasClass("is-checked"))
                        $(this.$refs.treeRouse.$el).find("#tag" + this.corpId).parent().parent().parent().addClass("is-checked").attr("aria-checked", true).find("label.el-checkbox").addClass("is-checked").children().addClass("is-checked");
                }
                this.vehLoading = false;
            });
        },
        // 全选
        handleCheckAllChangeTwoLabel (val) {
            if (val) { //全选时
                this.$refs.treeRouseVehLabel.setCheckedKeys(this.defaultCheckedKeysVehLabels);
                this.labelSearch();
            } else { //取消全选时
                this.saveDefaultCheckedKeysVehTwoLabel = [];
                this.$refs.treeRouseVehLabel.setCheckedKeys([]); //勾选节点为空数组
            }
        },
        // 全选车辆
        handleCheckAllChangeTwo (val) {
            if (val) { //全选时
                this.$refs.treeRouseVeh.setCheckedKeys(this.defaultCheckedKeysVeh);
                this.search();
            } else { //取消全选时
                this.saveDefaultCheckedKeysVehTwo = [];
                this.saveDefaultCheckedKeysVeh = [];
                this.$refs.treeRouseVeh.setCheckedKeys([]); //勾选节点为空数组
            }
        },
        // 全选——车辆列表
        handleCheckAllChangeThisPage (val) {
            let list = [], labels = [];
            if (val) {//全选时
                this.vehRoleList.forEach((item, index) => {//当前查询的车辆数据
                    if (item.id != undefined)
                        list.push(item.id);
                });
                this.vasRegions.forEach((item, index) => {
                    if (item.id != undefined)
                        labels.push(item.id);
                });
                this.$refs.treeRouseVehFzLabel.setCheckedKeys(labels);
                this.$refs.treeRouseVeh.setCheckedKeys(list);
                this.search();
            } else {//取消全选时
                this.saveDefaultCheckedKeysVehTwo = [];
                this.$refs.treeRouseVeh.setCheckedKeys([]); //勾选节点为空数组
                this.$refs.treeRouseVehFzLabel.setCheckedKeys([]);
            }
        },
        // 车辆权限关闭时
        vehEditClose () {
            this.vehRoleList = []; //列表初始化
            this.vehLoading = false;
            this.checkAllThisPage = false; //初始化
            this.defaultCheckedKeysVeh = []; //初始化
            this.saveDefaultCheckedKeysVeh = [];
            this.saveDefaultCheckedKeysVehTwo = [];
            this.defaultCheckedKeysVehLabel = [];
            this.checkAllTwo = false;
            this.filters.searchKey = "";
        },
        //树的选中操作——GIS分配车辆
        handleCheckChangeVeh (data, checked, indeterminate) {
            let tmpFlag = true;
            if (checked) { //勾选时
                if (this.saveDefaultCheckedKeysVehTwo.length == 0) {
                    this.saveDefaultCheckedKeysVehTwo.push(data.id);
                    return;
                }
                var isVeh = this.saveDefaultCheckedKeysVehTwo.filter((id, index) => {
                    if (data.id == id)
                        return id; //存储数据里没有
                });
                if (isVeh.length == 0) this.saveDefaultCheckedKeysVehTwo.push(data.id); //添加
            } else { //取消勾选时
                this.saveDefaultCheckedKeysVehTwo.forEach((id, index) => {
                    if (id == data.id) {
                        this.saveDefaultCheckedKeysVehTwo.splice(index, 1);
                        this.saveDefaultCheckedKeysVeh.splice(index, 1);
                    }
                    ; //存储数据里已有，删除
                });
                if (this.checkAllTwo) { //当全选框勾选时
                    if (this.vehRoleList.length > this.$refs.treeRouseVeh.getCheckedKeys().length) {
                        this.checkAllTwo = false;
                    }
                }
            }
        },

        //组织权限编辑显示
        corpEdit (index, row) {
            this.userId = row.id; //获取用户id
            this.editCorpInfoVisible = true;
            // this.vehStatus = []; //初始化组织车辆状态
            // 查当前用户 有无选择组织权限
            let para = {
                userid: row.id,
                system: 'A',
                showCount: 1000
            };
            this.treeRouseVasLoading = true;
            getThisCorpList(para).then((res) => {
                let dk = [],
                    ek = [],
                    tempdata = [];
                res.data.data.forEach((obj, index) => { //遍历当前用户已选组织
                    if (obj.corporateid >= 0) { //第一级不再遍历选中
                        tempdata.push(obj.corporateid); //筛选出子集——公司
                        // this.vehStatus.push({corpid:obj.corporateid,vehiclescope:obj.vehiclescope,usercorpid:obj.ID});//筛选出子集——公司、状态、组织用户关联id
                    }
                });
                tempdata.forEach(function (item) { //重新遍历删除后的数组
                    dk.push(item);
                    ek.push(item);
                });
                this.defaultCheckedKeys = dk; //选中当前树
                this.defaultExpandedKeys = ek; //展开
                if (this.corpRoleList.length > 0) return;
                //初始化所有父节点树
                getCorporateInfo().then((res) => {
                    this.corpRoleList = res.data.data;
                    this.treeRouseVasLoading = false;
                });
            });
        },
        renderContentVas (h, {node, data, store}) {
            return (<span><span>{data.corpname}</span></span>);
        },
        // 循环corpid对应匹配vehiclescope
        getCorpvehStatus (corpid) {
            for (let i = 0, len = this.vehStatus.length; i < len; i++) {
                if (corpid == this.vehStatus[i].corpid) { //当传入的corpid==得到的corpid
                    return this.vehStatus[i].vehiclescope; //返回状态
                }
            }
        },
        renderContent (h, {node, data, store}) {
            let status, str;
            if (data.parentcorpcode != '0') { //当不为第一级【类别】的时候
                status = this.getCorpvehStatus(data.id);
                str = (<span>
                        <span><span>{data.corpname}</span></span>
                    {(status == 'SUB')
                        ? (<el-button style="margin-left:10px;display: inline-block;padding: 0 5px;height: 24px;line-height: 22px;font-size: 12px;opacity:0.8;"
                                      id={'tag' + data.id} type="warning" on-click={(e) => {
                            this.vehEdit(data);
                            e.stopPropagation();
                        }}>部分</el-button>)
                        : (<el-button style="margin-left:10px;display: inline-block;padding: 0 5px;height: 24px;line-height: 22px;font-size: 12px;opacity:0.8;"
                                      id={'tag' + data.id} type="success" on-click={(e) => {
                            this.vehEdit(data);
                            e.stopPropagation();
                        }}>全部</el-button>)
                    }
                    </span>);
                return str;
            } else { //当为第一级的时候
                return (<span><span>{data.corpname}</span></span>);
            }
        },
        //树的选中操作——GIS
        handleCheckChange (data, checked, indeterminate) {
            let arr = this.$refs.treeRouse.getCheckedKeys(), //目前被选中的节点所组成的数组
                kesarry = this.$refs.treeRouse.getCheckedNodes(), //目前被选中的节点所组成的数组
                isClearFl = false;
            /*如果子菜单有选中不能取消当前选择 start*/
            if (!checked && data.parentcorpcode != 0) {
                kesarry.forEach((res, index) => {
                    if (res.id == data.parentcorpcode) {
                        res.corporateinfos.forEach((res, index) => {
                            if ($.inArray(parseInt(res.id), arr) >= 0) {
                                isClearFl = true;
                                return false;
                            }
                        });
                        if (!isClearFl) {
                            this.$refs.treeRouse.setChecked(data.parentcorpcode, false); //通过 key/data设置某个节点的勾选状态
                            return false;
                        }
                    }
                });
            }
            /*选中父类时候选中给所有子类*/
            if (data.parentcorpcode == 0 && checked && this.isPewe) {
                util.setCheckedTwo(this.$refs.treeRouse, data, true, true);
                return;
            }
            /*取消选中父类时候取消给所有子类*/
            if (data.parentcorpcode == 0 && !checked && this.isPewe) {
                util.setCheckedTwo(this.$refs.treeRouse, data, false, true);
                return;
            }
            /*二级——选中父类时候选中所有子类*/
            if (data.parentcorpcode != 0 && data.corporateinfos.length > 0 && checked && this.isPewe) {
                util.setCheckedTwo(this.$refs.treeRouse, data, true, true);
                return;
            }
            /*二级——取消选中父类时候取消所有子类*/
            if (data.parentcorpcode != 0 && data.corporateinfos.length > 0 && !checked && this.isPewe) {
                util.setCheckedTwo(this.$refs.treeRouse, data, false, true);
                return;
            }
            this.isPewe = true;
        },
        // 组织权限关闭时
        corpEditClose () {
            this.corpRoleList = [];
            this.gisCorpRoleList = [];
            this.activeName = 'first';
            this.filterTextVas = ''; //过滤清空
            this.filterTextGis = ''; //过滤清空
        },
        // tab
        tabClick (tab, event) {
            this.tabName = tab.name; //将点击的tab存入
            if (tab.name == 'second') {
                // 查当前用户 有无选择组织权限
                let para = {
                    userid: this.userId,
                    system: 'E',
                    showCount: 1000
                };
                this.treeRouseLoading = true;
                getThisCorpList(para).then((res) => {
                    let dk = [],
                        ek = [],
                        tempdata = [];
                    res.data.data.forEach((obj, index) => { //遍历当前用户已选组织
                        if (obj.corporateid >= 0) { //第一级不再遍历选中
                            tempdata.push(obj.corporateid); //筛选出子集——公司
                            this.vehStatus.push({
                                corpid: obj.corporateid,
                                vehiclescope: obj.vehiclescope,
                                usercorpid: obj.ID
                            }); //筛选出子集——公司、状态、组织用户关联id
                        }
                    });
                    tempdata.forEach(function (item) { //重新遍历删除后的数组
                        dk.push(item);
                        ek.push(item);
                    });
                    this.$refs.treeRouse.setCheckedKeys(dk, true);
                    this.gisDefaultExpandedKeys = ek; //展开
                    this.gisCorpRoleList = this.corpRoleList;
                    this.treeRouseLoading = false;
                });
            }
        },
        //树的选中操作——VAS
        handleCheckChangeVas (data, checked, indeterminate) {
            let arr = this.$refs.treeRouseVas.getCheckedKeys(), //目前被选中的节点所组成的数组
                kesarry = this.$refs.treeRouseVas.getCheckedNodes(), //目前被选中的节点所组成的数组
                isClearFl = false;
            /*如果子菜单有选中不能取消当前选择 start*/
            if (!checked && data.parentId != -1) {
                kesarry.forEach((res, index) => {
                    if (res.id == data.parentId) {
                        res.children.forEach((res, index) => {
                            if ($.inArray(parseInt(res.id), arr) >= 0) {
                                isClearFl = true;
                                return false;
                            }
                        });
                        if (!isClearFl) {
                            this.$refs.treeRouseVas.setCheckedTwo(data.parentId, false); //通过 key/data设置某个节点的勾选状态
                            return false;
                        }
                    }
                });
            }

            /*选中父类时候选中给所有子类*/
            if (checked) {
                util.setCheckedTwo(this.$refs.treeRouseVas, data, true, true);
            } else {
                util.setCheckedTwo(this.$refs.treeRouseVas, data, false, true);
            }
        },
        //  点击提交时
        handleCorpClick () {
            this.corpLoading = true;
            let treeNode, para = [],
                _this = this;
            if (this.tabName == 'second') { // 如果是gis权限
                treeNode = this.$refs.treeRouse.getCheckedNodes(); //目前被选中的节点所组成的数组
            } else { // 如果是vas权限
                treeNode = this.$refs.treeRouseVas.getCheckedNodes(); //目前被选中的节点所组成的数组
            }

            if (treeNode.length == 0) { //当没选组织时
                para.push({
                    userid: _this.userId,
                    system: (_this.activeName == 'first') ? 'A' : 'E'
                });
            } else {
                treeNode.forEach(function (item, index) {
                    let obj = {};
                    obj.userid = _this.userId; //当前用户id
                    obj.system = (_this.activeName == 'first') ? 'A' : 'E'; //当前用户id
                    obj.corporateid = item.id; //第一级id
                    para.push(obj);
                    // /*2c*/
                    // if(item.corporateinfos.length > 0) {
                    // 	item.corporateinfos.forEach(function(item1, index) {
                    // 		let obj = {};
                    // 		obj.userid = _this.userId;
                    // 		obj.corporateid = item1.id; //子级id
                    // 		para.push(obj);
                    // 	});
                    // }
                });
            }

            editCorpRole(para).then((res) => {
                // let data = res.data.data;
                // if (res.data.result.code == 4001) {
                //     this.$message({
                //         message: res.result.desc,
                //         type: 'error'
                //     });
                // } else {
                this.$message({
                    message: '编辑组织成功！',
                    type: 'success'
                });
                this.corpLoading = false;
                this.editCorpInfoVisible = false;
                // }
            }, err => {
                this.corpLoading = false;
            });
        },

        // 编辑角色
        roleEditClose () {
            this.checkedCities = [];
        },
        handleCheckAllChange (event) {
            let arry = [];
            this.cities.forEach(function (obj) {
                arry.push(obj.roleId);
            });
            this.checkedCities = event ? arry : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange (value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.cities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        },
        // 角色提交时
        handleNodeClick () {
            this.nodeLoading = true;
            let checkedNode = this.checkedCities,
                para = {
                    id: '',
                    role: []
                },
                _this = this;
            para.id = _this.curUserId;
            checkedNode.forEach(function (val) {
                para.role.push(val);
            });
            editUserRole(para).then((res) => {
                this.nodeLoading = false;
                // if (res.data.result.code == 0) {
                this.$message({
                    message: '编辑成功！',
                    type: 'success'
                });
                // }
                this.editRoleInfoVisible = false;
            }, () => {
                this.nodeLoading = false;
            });
        },
        // 员工类型
        typeFormatter (row, column) {
            return row.usertype == 'E' ? '员工' : row.usertype == 'C' ? '客户' : '暂无'
        },
        //时间转换1
        dateFormatter: function (row, col) {
            if (row.firstlogintime == "" || row.firstlogintime == undefined) return '--';
            return util.formatDate.format(new Date(row.firstlogintime), 'yyyy-MM-dd');
        },
        //时间转换2
        dateFormatterSecond: function (row, col) {
            if (row.lastlogintime == "" || row.lastlogintime == undefined) return '--';
            return util.formatDate.format(new Date(row.lastlogintime), 'yyyy-MM-dd');
        },
        handleCurrentChange (val) {
            this.currentPage = val;
            this.handleQuery();
        },
        //搜索按钮——模糊查询
        handleQuerySelect () {
            let para = {
                page: 1,
                limit: this.pageSize,
                username: this.filters.name,
                isenable: this.filters.isenable
            };
            this.listLoading = true;
            getSysUserList(para).then((res) => {
                this.total = res.data.data.total;
                this.listData = res.data.data.records;
                this.listLoading = false;
            }).catch((error) => {
                this.listLoading = false;
            });
        },
        //获取保单列表
        handleQuery () {
            let para = {
                page: this.currentPage,
                limit: this.pageSize,
                username: this.filters.name,
                isenable: this.filters.isenable
            };
            this.listLoading = true;
            getSysUserList(para).then((res) => {
                this.listLoading = false;
                // if (res.data.result.code == 0) {
                this.total = res.data.data.total;
                this.listData = res.data.data.records;
                // }
            }, () => {
                this.listLoading = false;
            });
        },
        //角色编辑显示
        roleEdit: function (index, row) {
            this.editRoleInfoVisible = true;
            this.curUserId = row.id;
            let para = {delFlag: "0"}
            //获取角色权限列表
            getSysRoleInfoList(para).then((res) => {
                this.cities = res.data.data.records;
                let para = {
                    userid: this.curUserId
                };
                //获取用户已有的角色
                getUserRole(para).then((res) => {
                    let carry = [];
                    res.data.data.forEach(function (obj) {
                        carry.push(obj.roleId);
                    });
                    this.checkedCities = carry;
                });
            });
        },
        //删除
        handleDel (index, row) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                let para = {
                    ids: row.id,
                };

                removeSysUserInfo(para).then((res) => {
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
        handleEdit (index, row) {
            // $(".is-error").removeClass('is-error'); //清空验证时的红框
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
            //console.log(this.editForm.checkPassword);
            if (this.editForm.checkPassword == undefined) {
                this.editForm.checkPassword = this.editForm.password;
            }
            this.editForm.usertype = (!row.usertype || row.usertype == 'E') ? 'E' : 'C';
            this.thisInput = this.editForm.name; //将当前验证的字段 已获得的值存入
        },
        //编辑
        editSubmit () {
            if (this.editForm.password != this.editForm.checkPassword) {
                this.$message({
                    message: '两次密码输入的不一样！',
                    type: 'warning'
                });
                return;
            }
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.editLoading = true;
                    //let para = Object.assign({}, this.editForm);
                    let para = {
                        id: this.editForm.id,
                        password: this.editForm.password,
                        mobile: this.editForm.mobile,
                        wechat: this.editForm.wechat,
                        qq: this.editForm.qq,
                        usertype: this.editForm.usertype,
                        isenable: this.editForm.isenable
                    }
                    if (para.password == '****') {
                        para = {
                            id: this.editForm.id,
                            mobile: this.editForm.mobile,
                            wechat: this.editForm.wechat,
                            qq: this.editForm.qq,
                            usertype: this.editForm.usertype,
                            isenable: this.editForm.isenable
                        }
                    }
                    modifySysUserInfo(para).then((res) => {
                        this.editLoading = false;
                        //if (res.data.result.code == 0) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.$refs['editForm'].resetFields();
                        this.editFormVisible = false;
                        this.handleQuery();
                        //}
                    }, () => {
                        this.editLoading = false;
                    });
                }
            });
        },
        selsChange (sels) {
            this.sels = sels;
        },
        //批量删除
        batchRemove () {
            let ids = this.sels.map(item => item.id).toString();
            this.$confirm('确认删除选中记录吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                let para = {
                    ids: ids,
                    method: "delete"
                };
                removeSysUserInfo(para).then((res) => {
                    this.listLoading = false;
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.handleQuery();
                });
            }).catch(() => {
            });
        }
    },
    created () {
        this.handleQuery();
    }
}