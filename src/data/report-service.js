// import ApiService from './api-service'

const ReportService = {
  sendReport() {
    // return Promise.reject('report sent')
    return Promise.resolve('report sent')
    // return ApiService.post(`/images/${params.identifier}/report`, params)
  },
}

export default ReportService
