// import util from 'common/js/util';
import gdmap from '@/views/map/gdmap';
import gdmap1 from '@/views/map/gdmap1';
import { 
            getAttdCenterList, 
            addAttdCenter, 
            modifyAttdCenter, 
            removeAttdCenter
        } from './service';
export default {
    props: ['windowOutHeight'],
    components: {
        gdmap,
        gdmap1
    },
    data() {
        return {
            filters: {
                attendcentername:'',
            },
            listData: [],
            customers: [],
            total: 0,
            currentPage: 1,
            pageSize: 15,
            listLoading: false,
            sels: [], //列表选中列
            editFormVisible: false, //编辑界面是否显示
            editLoading: false,
            editFormRules: {
                attendcentername: [
                	{ required: true, message: '请输入考勤中心区域', trigger: 'blur' }
                ],
                // longitude: [
                // 	{ required: true, message: '不能为空', trigger: 'blur' }
                // ],
                // latitude: [
                // 	{ required: true, message: '不能为空', trigger: 'blur' }
                // ],
                // attendcenteraddress: [
                // 	{ required: true, message: '不能为空', trigger: 'blur' }
                // ],
            },
            //编辑界面数据
            editForm: {
                id: '',
                attendcentername: '',
                longitude: '',
                latitude: '',
                attendcenteraddress: '',
            },

            addFormVisible: false, //新增界面是否显示
            addLoading: false,
            addFormRules: {
                attendcentername: [
                	{ required: true, message: '请输入考勤中心区域', trigger: 'blur' }
                ],
                // longitude: [
                // 	{ required: true, message: '不能为空', trigger: 'blur' }
                // ],
                // latitude: [
                // 	{ required: true, message: '不能为空', trigger: 'blur' }
                // ],
                // attendcenteraddress: [
                // 	{ required: true, message: '不能为空', trigger: 'blur' }
                // ],
            },
            //新增界面数据
            addForm: {
                attendcentername: '',
                longitude: '',
                latitude: '',
                attendcenteraddress: '',
            },
        }
    },
    methods: {
        changeMap() {
            this.$refs.vueAmap.geocoder(this.addForm.attendcenteraddress, (res) => {
                this.addForm.longitude = res.location.lng;
                this.addForm.latitude = res.location.lat;
            });
        },
        changeMap1() {
            this.$refs.vueAmap1.geocoder(this.editForm.attendcenteraddress, (res) => {
                this.editForm.longitude = res.location.lng;
                this.editForm.latitude = res.location.lat;
            });
        },
        //拖拽地图小点返回的地址
        draggerMapMarker(address, lnglatXY, type) {
            if(this.addFormVisible) {
                this.addForm.attendcenteraddress = address;
                this.addForm.longitude = lnglatXY[0];
                this.addForm.latitude = lnglatXY[1];
            }
            if(type == 2) {
                this.editForm.attendcenteraddress = address;
                this.editForm.longitude = lnglatXY[0];
                this.editForm.latitude = lnglatXY[1];
            }
        },
        //查询清空
        clearAll() {
            this.filters = {
                attendcentername:'',
            } //清空查询框;
        },
        //搜索按钮——模糊查询
        handleQuerySelect() {
            let para = {
                page: 1,
                limit: this.pageSize,
                attendcentername: this.filters.attendcentername,
            };
            this.listLoading = true;
            getAttdCenterList(para).then((res) => {
                this.total = res.data.data.total;
                this.listData = res.data.data.records;
                this.listLoading = false;
            }).catch((error) => {
                this.listLoading = false;
            });
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
        //获取保单列表
        handleQuery() {
            let para = {
                page: this.currentPage,
                limit: this.pageSize,
                attendcentername: this.filters.attendcentername
        };
            this.listLoading = true;
            getAttdCenterList(para).then((res) => {
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
                removeAttdCenter(para).then((res) => {
                    this.listLoading = false;
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.handleQuerySelect();
                });
            }).catch(() => {

            });
        },
        //显示编辑界面
        handleEdit(index, row) {
            this.editForm = {
                id: row.id,
                attendcentername: row.attendcentername,
                longitude: row.longitude,
                latitude: row.latitude,
                attendcenteraddress: row.attendcenteraddress,
            }
            this.editFormVisible = true;
            this.$nextTick(function(){
                this.$refs.vueAmap1.geocoder(this.editForm.attendcenteraddress, (res) => {
                    this.editForm.longitude = res.location.lng;
                    this.editForm.latitude = res.location.lat;
                });
            });
        },
        //显示新增界面
        handleAdd() {
            this.addFormVisible = true;
            this.addForm = {
                attendcentername: '',
                longitude: '',
                latitude: '',
                attendcenteraddress: '',
            };
        },
        //编辑
        editSubmit() {
            this.$refs.editForm.validate((valid) => {
                if(valid) {
                    this.editLoading = true;
                    let para = {
                        id: this.editForm.id,
                        attendcentername: this.editForm.attendcentername,
                        longitude: this.editForm.longitude,
                        latitude: this.editForm.latitude,
                        attendcenteraddress: this.editForm.attendcenteraddress
                    }
                    modifyAttdCenter(para).then((res) => {
                        this.editLoading = false;
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        });
                        this.$refs['editForm'].resetFields();
                        this.editFormVisible = false;
                        this.handleQuery();
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
                        attendcentername: this.addForm.attendcentername,
                        longitude: this.addForm.longitude,
                        attendcenteraddress: this.addForm.attendcenteraddress,
                        latitude: this.addForm.latitude,
                    }
                    addAttdCenter(para).then((res) => {
                        this.addLoading = false;
                        this.$message({
                            message: '新增成功',
                            type: 'success'
                        });
                        this.$refs['addForm'].resetFields();
                        this.addFormVisible = false;
                        this.handleQuery();
                    });
                }
            });
        },
        selsChange(sels) {
            this.sels = sels;
        },
        //批量删除
        batchRemove() {
            var ids = this.sels.map(item => item.id).toString();
            this.$confirm('确认删除选中记录吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                //NProgress.start();
                let para = {
                    id: ids,
                };
                removeAttdCenter(para).then((res) => {
                    this.listLoading = false;
                    //NProgress.done();
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
    created() {
        this.handleQuery();
    },

}       