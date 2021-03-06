import { getParentInfoList } from '@/views/sysManage/organizationManage/service'
import installOrder from './installOrder/index.vue'
import maintainOrder from './maintainOrder/index.vue'
import { mapState } from "vuex";
import { getOrderById } from './service'

export default {
    name: "addInstallOrder",
    components: {
        installOrder,
        maintainOrder
    },
    data () {
        return {
            type: 'INSTALL', //INSTALL REPAIR
            corplist: [],// 公司列表
            corpid: '',
            corpname: '',
            baseForm: null,
            flow: ''
        }
    },
    computed: {
        ...mapState({
            roles: state => state.user.roles,
            corporateinfo: state => state.user.corporateinfo,
            isEmployee: state => state.user.isEmployee
        }),
        isAdd () {
            return Boolean(this.$route.query.id)
        }
    },
    watch: {
        $route (newValue, oldValue) {
            this.init()
        }
    },
    methods: {
        /**
         * 获取公司列表
         */
        async getCorpList (query) {
            let param = {
                page: 1,
                limit: 20,
                corpname: query
            }
            try {
                const {data} = await getParentInfoList(param)
                this.corplist = data.data.records;
            } catch (e) {
                console.log(e)
            }
        },
        changeType (value) {
            this.initCorp()
        },
        initCorp () {
            this.corplist = [{
                id: this.corporateinfo.id,
                corpname: this.corporateinfo.corpname
            }]
            this.corpid = this.corporateinfo.id
            this.corpname = this.corporateinfo.corpname
        },
        async getOrderById (id) {
            try {
                const {data} = await getOrderById({id})
                this.type = data.data.ordertype
                this.corpid = data.data.corpid
                this.corpname = data.data.corporateinfo.corpname
                this.corplist = [{
                    id: this.corpid,
                    corpname: this.corpname
                }]

                if (this.$route.query.taskid) {
                    data.data.taskid = this.$route.query.taskid
                }

                /**
                 * flow: 1 派单 2 转派
                 */
                if (this.$route.query.flow) {
                    this.flow = this.$route.query.flow
                }

                this.baseForm = data.data
            } catch (e) {
                console.log(e)
            }
        },
        init () {
            const query = this.$route.query
            if (query.id) {
                this.getOrderById(query.id)
            } else {
                this.initCorp()
                this.baseForm = null
            }
        }
    },
    created () {
        this.init()
    },
    async beforeRouteLeave (to, from, next) {
        if (this.$route.query.isEdit) {
            await this.$store.dispatch('removeVisitedTag', from)
        }
        next()

    }
}