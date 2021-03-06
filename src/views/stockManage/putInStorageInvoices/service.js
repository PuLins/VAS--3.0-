import axios from 'axios'
import { checkMobile, checkVehicleNumber } from '@/utils/formValidation'

export const addWarehouseProd = params => {
    return axios.post('sto/stoAction/addWarehouseProd', params)
}

export const returnFactoryProd = params => {
    return axios.post('sto/stoAction/returnFactoryProd', params)
}

export const facilityFormRules = {
    actiontype: [
        {required: true, message: '请选择入库类型', trigger: 'change'}
    ],
    contractno: [
        {required: true, message: '请选择采购合同', trigger: 'change'}
    ],
    suppliername: [
        {required: true, message: '请选择供应商', trigger: 'change'}
    ],
    purchaseDate: [
        {required: true, message: '请选择采购日期"', trigger: 'change'}
    ],
    'stoStorageDto.managername': [
        {required: true, message: '请输入收货人', trigger: 'blur'}
    ],
    'stoStorageDto.storageaddress': [
        {required: true, message: '请输入收货地址', trigger: 'blur'}
    ],
    'stoStorageDto.storagename': [
        {required: true, message: '请输入库房名称', trigger: 'change'}
    ],
    'stoStorageDto.managermobile': [
        {required: true, message: '请输入收货电话', trigger: 'blur'}
    ],
    'stoDelivery.deliverytype': [
        {required: true, message: '请选择发货方式', trigger: 'change'}
    ],
    'stoDelivery.deliverydate': [
        {required: true, message: '请选择发货日期', trigger: 'change'}
    ],
    'stoDelivery.deliveryno': [
        {required: true, message: '请输入物流号', trigger: 'blur'}
    ],
    'stoDelivery.deliverycorp': [
        {required: true, message: '请选择物流公司', trigger: 'change'}
    ],
    'stoDelivery.vehicleplate': [
        {required: true, message: '请输入车牌号', trigger: 'blur'},
        {validator: checkVehicleNumber, trigger: 'blur'}
    ],
    'stoDelivery.contactno': [
        {required: true, message: '请输入联系电话', trigger: 'blur'},
        {validator: checkMobile, trigger: 'blur'}
    ],
    username: [
        {required: true, message: '请选择经办人', trigger: 'change'}
    ]
}

export const getDeliveryCorps = params => {
    return axios.get(`/admin/sysDictionaryData/query`, {
        params
    })
}

export const getProdByBatchno = batchno => {
    return axios.get(`/sto/stoAction/query/Prod?batchon=${batchno}`)
}