import axios from 'axios';

let base = '/vasms-web';
let admin = '/admin';

//部门管理接口
export const getDepartmentInfoList = params => {
    return axios.get(`${admin}/departmentinfo/queryDepartmentDTO`, {
        params: params
    });
};

//部门管理接口
export const getDepartmentById = id => {
    return axios.get(`${admin}/departmentinfo/${id}`);
};

export const addDepartmentInfo = params => {
    return axios.post(`${admin}/departmentinfo`, params);
};

export const modifyDepartmentInfo = params => {
    return axios.put(`${admin}/departmentinfo`, params);
};

// export const removeDepartmentInfo = params => {
//     return axios.post(`/departmentinfo/${id}`, Qs.stringify(params));
// };

//员工姓名接口
export const getDeptManagerInfoList = params => {
    return axios.get(`${base}/api/v1/org/employeeInfo/?showCount=10000`, {
        params: params
    });
};

// 查询详细公司
// export const getAllCorpList = params => {
//     return axios.get(`${base}/api/v1/org/corporateInfo/query/IDAndName`, {
//         params: params
//     });
// };

/*部门搜索模糊查询接口*/
// export const getSelectListDept = params => {
//     return axios.get(`${base}/api/v1/org/departmentInfo/query/like`, {
//         params: params
//     });
// };

// 查询详细部门
// export const getAllDeptList = params => {
//     return axios.get(`${admin}/departmentinfo/page`, {
//         params: params
//     });
// };

// //根据员工userid获取员工姓名
// export const getNamebyUserid = params => {
//     return axios.get(`${base}/api/v1/org/employeeInfo/getNameByUserid`, {
//         params: params
//     });
// };

// export const getCheckoutOfDeptInfo = params => {
//     return axios.get(`${base}/api/v1/org/departmentInfo/checkout`, {
//         params: params
//     });
// };