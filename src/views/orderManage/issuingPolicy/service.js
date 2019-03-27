import axios from 'axios'
import util from 'utils/tools';

export const get = params => {
    return axios.get(`/vasms-web/gis/getHasInsuranceDeclaration`, {
        params: params
    })
}

//检查设备是否在线
export const cldeviceIsOnstate = params => {
    return axios.post(`/gisapiservice/Prod/proddetail`, params)
};

//出单
export const addInsuranceIssue = params => {
    return axios.post(`/business/orderNewBuild/insuranceIssue/${params.taskid}`, params);
};

//人寿投保接口
export const addLifeIssue = params => {
    return axios.post(`insurance/insuranceinfo/life/insure`, params);
};

export const getInsurancePolicyno = params => {
    return axios.get(`insurance/insurancePolicyno/query/validInsuranceCorp`, {
        params
    })
}

/**
 * 查询自动出单失败原因
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const failedReason = params => {
    return axios.get(`/business/orderNewBuild/insuranceIssue/failedReason`, {
        params
    })
}

export const cancelInsurance = params => {
    return axios.post(`/business/orderNewBuild/endInsuranceIssue/${params.taskid}`, params)
}

export const initForm = () => {
    return {
        insurancecorpid: '',//保险公司
        policyno: '',//保单编号
        insurancecorpname: '',//保险公司
        issuedate: new Date().format('yyyy-MM-dd'),//出单日期
        effectivedate: util.addReduceDate(new Date(), +1).format('yyyy-MM-dd'),//保险生效日期
        expiredate: util.getDateThreeYers(new Date(), 3),//保险失效日期
        indemnitylimit: '',//赔偿限额
        price: '',//万网盗抢保障服务费
        vehicleowneridcard: '',//身份证号码
        vehicleowner: '',//车主姓名
        owneraddress: '',//联系地址
        vehicleownercontact: '',//联系电话
        vehicleenginenum: '',//发动机号
        vehiclemodel: '',//厂牌型号
        vehicleplate: '',//车牌号
        createdate: new Date().format('yyyy-MM-dd'),
        remark: '',//备注
        beneficiary: '',//第一受益人
        priceInsucorp: 0,//保费
        declarationid: '', //保单ID
        picregistration: '', //登记证 code 10
        picvehiclelicense: '',//行驶证 code 11
        picidcard: '',//身份证 code 21
        picinvoice: '',//购车发票 code 22
        piccertificate: '',//合格证 code 23
        picimport: '',//货物进口证 code 24
    }
}

