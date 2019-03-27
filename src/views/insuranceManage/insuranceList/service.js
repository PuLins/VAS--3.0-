/* 
 * @description: 后台数据接口配置中心 
 */
import axios from 'axios';
import Qs from 'qs';

//保单信息管理接口
const getInsuranceInfoList = params => {
    return axios.get(`insurance/insuranceinfo/query/like`, {params: params});
};

const modifyInsuranceInfo = params => {
    return axios.put(`insurance/insuranceinfo/mod`, params);
};

const removeInsuranceInfo = params => {
    return axios.delete(`insurance/insuranceinfo/` + params.id);
};

//保单详情
const getMoreInfo = params => {
    return axios.get(`insurance/insuranceinfo/query/` + params.id, params);
};
// 操作详情
const getRecordsInfo = params => {
    return axios.get(`insurance/insuranceinfo/query/insuranceEvent`, {params: params});
};
// 导出
const exportInsurance = params => {
    return axios.get(`insurance/insuranceinfo/query/export`, {params: params});
};
// 重新出单
const againInsuranceInfo = params => {
    return axios.post(`insurance/insuranceinfo/add/issue`, params);
};
// 保单操作
const handleInsurance = (url, params) => {
    return axios.post(`insurance/insuranceEvent${url}`, params);
};
// 有效保险公司
const getCorpList = params => {
    return axios.get(`insurance/insurancePolicyno/query/validInsuranceCorp`, {params: params})
};
// 第一受益人
const getBankList = params => {
    return axios.get(`admin/corporateinfo/page`, {params: params})
};
// 验证万网保单编号
const getCheckoutOfIns = params => {
    return axios.get(`insurance/insuranceinfo/query/policynoIsExists`, {params: params});
};
// 保险模板
const getInsTemplate = params => {
    return axios.get(`insurance/insuranceTemplate/` + params.id);
};
// 保险批改
const handleCorrect = params => {
    return axios.post(`insurance/insuranceinfo/life/correct`, params);
};
// 查询车型
const getVehTypeList = params => {
    return axios.get(`admin/carModel/query/like`, {params:params})
};


export {
    handleCorrect,
    getVehTypeList,
    getInsuranceInfoList,
    modifyInsuranceInfo,
    exportInsurance,
    getInsTemplate,
    handleInsurance,
    getRecordsInfo,
    getMoreInfo,
    removeInsuranceInfo,
    getCheckoutOfIns,
    getCorpList,
    getBankList,
    againInsuranceInfo,
    printInsuranceInfo
}