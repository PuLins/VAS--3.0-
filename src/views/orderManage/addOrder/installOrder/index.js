import { getVehList } from "@/views/basicManage/ownerVehicleManage/service";
import { getToken } from '@/utils/auth'
import util from 'utils/tools';
import productList from '../subComponent/productList'
import { getProducts, initForm, installRules, submitInstall, getVehicleInfo, submitInstallCust, transformOrder, sendOrder, saveOrder } from '../service'
import { getAllColorList, getCarModel } from '@/views/basicManage/ownerVehicleManage/service'
import { getParentInfoList } from '@/views/sysManage/organizationManage/service'
import installInfo from '../subComponent/install-info'
import { mapState } from "vuex";

export default {
    name: "installOrder",
    components: {
        productList,
        installInfo
    },
    props: ['corpid', 'baseForm', 'flow'],
    data () {
        return {
            form: initForm(), //表单
            rules: installRules(this),//表单验证规则
            vehlist: [], // 车型
            carColor: [],//车辆颜色列表
            token: getToken(),
            accept: '.jpg,.png',
            util: util,
            activeNames: ['1', '2', '3'],
            addressList: [],//地址列表
            productList: [],//产品列表
            groupList: [],//分组列表
            groupBeanList: [],//原始分组列表
            vehiclepowerList: [
                {
                    value: 1,
                    label: '汽油'
                }, {
                    value: 2,
                    label: '柴油'
                }, {
                    value: 3,
                    label: '纯电'
                }, {
                    value: 4,
                    label: '混动'
                },
            ],
            groupArr: [],
            selectEmployee: {},
            addressDetail: '',
            vehiclecategoryList: [//汽车分类列表
                {
                    value: 1,
                    label: '新车'
                }, {
                    value: 2,
                    label: '二手车'
                }, {
                    value: 3,
                    label: '资管追回'
                },
            ],
            oldVehicleFlag: false,
            isView: true,
            basePackageid: '',
            baseGroupList: [],
            currentUploadItem: {}
        }
    },
    computed: {
        ...mapState({
            userid: state => state.user.userid,
            isEmployee: state => state.user.isEmployee
        })
    },
    watch: {
        corpid (newValue) {
            if (newValue) {
                this.getProducts()
            }
        },
        baseForm (newValue) {
            this.initBaseForm()
        }
    },
    methods: {
        /**
         * 获取车辆类型
         * @param r
         */
        vehChange (r) {
            const params = {
                page: 1,
                limit: 10000,
                isactive: 1
            }
            getVehList(params).then((res) => {
                this.vehlist = res.data.data;
            });
        },
        /**
         * 获取第一受益人
         * @param parm
         * @param cb
         * @returns {Promise<void>}
         */
        async getCorpList (parm, cb) {
            // if (!show) return
            let param = {
                page: 1,
                limit: 10000,
                corpcategory: 'BANK',
                corpname: parm
            }
            try {
                const {data} = await getParentInfoList(param)
                cb(data.data.records)
                // this.corplist = data.data.records;
            } catch (e) {

            }
        },
        uploadSuccess (res, file) {
            this.currentUploadItem.piclink = res.data
            this.initViewer()
        },
        clickUpload (item) {
            this.currentUploadItem = item
        },
        removePic (item) {
            this.$confirm('确定删除图片？', '提示', {
                type: 'warning '
            }).then(() => {
                item.piclink = ''
                this.initViewer()
            }).catch(() => {

            })
        },
        /**
         * 图片浏览器
         */
        initViewer () {
            if (this.viewer)
                this.viewer.destroy()
            const el = this.$refs['rpShowimgDialog'].$el
            this.$nextTick(() => {
                this.viewer = new Viewer(el)
            });
        },
        /**
         * 选择产品
         * @param item
         */
        selectProduct (item) {
            this.form.packageid = item.packageid
            this.form.hastheftinsurance = 0
            if (item.cmsPackprod.length) {
                _.forEach(item.cmsPackprod, itemBean => {
                    if (itemBean.cmsProduct.prodcategory === 'INSURANCE') {
                        this.form.hastheftinsurance = 1
                    }
                })
            }
        },
        /**
         * 获取产品列表
         * @returns {Promise<void>}
         */
        async getProducts () {
            try {
                const params = {
                    page: 1,
                    limit: 1000
                }
                const {data} = await getProducts(params, this.corpid)
                this.productList = data.data.records
            } catch (e) {
                console.log(e)
            }
        },
        /**
         * 获取车辆颜色
         * @param queryString
         * @param cb
         */
        handleColorChange (queryString, cb) {
            let para = {
                model: this.form.busiVehicleinfo.model,
                color: queryString,
                limit: 100
            }, colorArray = [];
            getAllColorList(para).then((res) => {
                if (res.data.data.records) {
                    res.data.data.records.forEach(function (item, index) {
                        if (item && item.color) {
                            colorArray.push({
                                value: item.color,
                                color_rgb: item.color_rgb,
                            });
                        }
                    });
                    cb(colorArray);
                }
            });
        },
        /**
         * 选择车辆颜色
         * @param v
         */
        changeCarColor (v) {
            if (typeof v != "object") return;
            this.form.busiVehicleinfo.colorname = v.value; //存colorname汉字
            this.form.busiVehicleinfo.color = v.color_rgb; //存color码
        },
        //选择车型查询颜色
        handleSelectColor (v) {
            this.form.busiVehicleinfo.model = v.value;
            this.form.busiVehicleinfo.color = '';
            this.form.busiVehicleinfo.colorname = '';
        },
        /**
         * 车型列表模糊查询
         * @param queryString
         * @param cb
         */
        handleItemChange (queryString, cb) {
            let para = {
                    model: queryString,
                    viewName: "VW_VAS_WEB_VAS_VEHICLE_MODEL",
                    limit: 30,
                },
                ownerArray = [];
            getCarModel(para).then((res) => {
                if (res.data.data != null) {
                    res.data.data.records.forEach(function (item, index) {
                        ownerArray.push({
                            value: item.model,
                            brand: item.brand,
                            serious: item.serious
                        });
                    });
                    cb(ownerArray);
                }
            });
        },
        /**
         * 提交订单
         */
        submit () {
            if (!this.form.packageid) {
                this.$message.warning('请选择安装产品')
                return
            }
            this.$refs.form.validate(async valid => {
                if (valid) {
                    this.form.corpid = this.corpid
                    try {
                        if (this.isEmployee) {
                            await this.submitInstall()
                        } else {
                            this.form.userid = this.userid
                            await submitInstallCust(this.form)
                        }
                        this.$message.success('提交派单成功')
                        this.$router.go(-1)
                    } catch (e) {
                        console.log(e)
                    }
                } else {
                    this.$message.warning('请完善信息')
                }
            })
        },
        save () {
            this.$refs.form.validate(async valid => {
                if (valid) {
                    this.form.corpid = this.corpid
                    try {
                        if (this.form.busiVehicleinfo && !this.form.busiVehicleinfo.firstregisterdate) {
                            this.form.busiVehicleinfo.firstregisterdate = ''
                        }
                        await saveOrder(this.form)
                        this.$message.success('保存成功')
                        this.$router.go(-1)
                    } catch (e) {
                        console.log(e)
                    }
                } else {
                    this.$message.warning('请完善信息')
                }
            })
        },
        /**
         * 提交安装单
         * @returns {Promise<void>}
         */
        async submitInstall () {
            try {
                if (this.form.taskid && this.flow) {
                    if (this.flow === '1') {
                        await sendOrder(this.form)
                    } else {
                        await transformOrder(this.form)
                    }
                } else {
                    await submitInstall(this.form)
                }
            } catch (e) {
                throw Error(e)
            }
        },
        /**
         * 验证数字保留两位小数
         * @param value
         * @param obj
         * @param property
         */
        checkNum (value, obj, property) {
            if (/^\d+$/.test(value)) {
                obj[property] = value + '.00'
            } else {
                obj[property] = value
                return
            }
            if (property === 'price') {
                this.form.busiVehicleinfo.indemnitylimit = obj[property]
            }
        },
        /**
         * 根据车架号查车辆
         * @param vin
         * @returns {Promise<void>}
         */
        async getVehicleInfo (vin) {
            if (!vin || vin.length < 17)
                return
            const oldVin = vin
            try {
                const params = {
                    vin
                }
                const {data} = await getVehicleInfo(params)
                const vehicle = data.data
                if (vehicle) {
                    this.oldVehicleFlag = true
                    this.form.busiVehicleinfo.ownername = vehicle.ownerInfo.name
                    this.form.busiVehicleinfo.mobile = vehicle.ownerInfo.mobile
                    this.form.busiVehicleinfo.idcard = vehicle.ownerInfo.idcard
                    this.form.busiVehicleinfo.model = vehicle.model
                    this.form.busiVehicleinfo.price = vehicle.price + '.00'
                    this.form.busiVehicleinfo.vehiclecategory = vehicle.vehiclecategory
                    this.form.busiVehicleinfo.vehicletype = vehicle.vehicletype
                    this.form.busiVehicleinfo.enginenum = vehicle.enginenum
                    this.form.busiVehicleinfo.licenseplatenum = vehicle.licenseplatenum
                    this.form.busiVehicleinfo.color = vehicle.color
                    this.form.busiVehicleinfo.colorname = vehicle.colorname
                    this.form.busiVehicleinfo.vehiclepower = +vehicle.vehiclepower
                    this.form.busiVehicleinfo.addresshome = vehicle.ownerInfo.addresshome
                    this.form.busiVehicleinfo.indemnitylimit = this.form.busiVehicleinfo.price
                }
            } catch (e) {
                this.oldVehicleFlag = false
                this.form.busiVehicleinfo = initForm().busiVehicleinfo
                this.form.busiVehicleinfo.vin = oldVin
                console.log(e)
            }
        },
        initBaseForm () {
            if (this.baseForm) {
                this.form = _.cloneDeep(this.baseForm)
                const price = this.form.busiVehicleinfo.price
                this.form.busiVehicleinfo.price = price ? this.form.busiVehicleinfo.indemnitylimit + '.00' : ''
                if (this.form.busiVehicleinfo.indemnitylimit) {
                    this.form.busiVehicleinfo.indemnitylimit = this.form.busiVehicleinfo.indemnitylimit + '.00'
                }
                if (this.form.busiVehicleinfo.priceInsucorp) {
                    this.form.busiVehicleinfo.priceInsucorp = this.form.busiVehicleinfo.priceInsucorp + '.00'
                }
                this.basePackageid = this.baseForm.packageid
                this.baseGroupList = [this.form.impgroupid, this.form.impby]
            } else {
                this.form = initForm()
                this.basePackageid = ''
                this.baseGroupList = []
            }
        },
        changeVehicletype (item) {
            if (item) {
                this.form.busiVehicleinfo.vehicletypename = item.typedesc
                this.form.busiVehicleinfo.vehicletype = +item.typecode
                this.form.busiVehicleinfo.platecolorid = item.id
                this.form.busiVehicleinfo.licenseplatecolor = item.platecolordesc
            }
        }
    },
    created () {

        this.vehChange()

        if (this.corpid) {
            this.getProducts()
        }

        this.initBaseForm()
        // this.debouncedGetAnswer = _.debounce(this.autoInput, 500)
    }
}