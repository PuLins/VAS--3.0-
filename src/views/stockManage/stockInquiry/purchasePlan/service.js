import axios from 'axios'

// 库存统计图
export const getStockQuantityKpi = params => {
    return axios.get('sto/stoStat/parchasePlan/query/stockQuantityKpi', {
        params
    })
}

// 查看采购历史
export const purchasePlanHistory = params => {
    return axios.get('sto/stoStat/parchasePlan/query/parchasePlanHistory', {
        params
    })
}

// 二级库房统计数据量
export const getPurchaseData = params => {
    return axios.get('sto/stoStat/parchasePlan/query/allStoragesParchaseData', {
        params
    })
}

// 采购计划二级库房列表
export const getStorages = params => {
    return axios.get('sto/stoStat/parchasePlan/query/listSecondStorageParchases', {
        params
    })
}

// 查询二级库房要货详情
export const getStorageDataDetail = params => {
    return axios.get('sto/stoStat/parchasePlan/query/storageDataDetail', {
        params
    })
}

export const submit = params =>{
    return axios.post('sto/stoPurchase/addBatch', params)
}

export const submitPurchaseQty = params =>{
    return axios.put('sto/stoRequest/mod/updatePurchaseqty', params)
}

// 获取前一年的年月日期列表
export const createDateDate = () => {
    let datelist = []
    let date = new Date()
    let Y = date.getFullYear()
    let M = date.getMonth() + 1
    for (let i = 0; i < 12; i++) {
        let dateoption = {
            label: '',
            value: ''
        }
        if (!M) {
            M = 12
            Y = Y - 1
        }
        let m = M
        m = m < 10 ? '0' + m : m
        dateoption.label = `${Y}年${m}月`
        dateoption.value = `${Y}-${m}`
        M--
        datelist.push(dateoption)
    }
    return datelist
}