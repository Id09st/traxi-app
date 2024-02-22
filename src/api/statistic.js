import { axiosInstances } from 'utils/axios';

export const getStatistic = () => {
  return axiosInstances.login
    .get(`/api/v1/statistic/income-driver`)
    .then((response) => {
      console.log('Dữ liệu nhận được:', response.data);
      const { result, error } = response.data; // Sửa từ `statistics` thành `result`
      if (error) {
        console.error('Lỗi từ API:', error);
        return null;
      } else {
        return result; // Trả về `result` thay vì `statistics`
      }
    })
    .catch((error) => {
      console.error('Lỗi khi gọi API:', error);
      return null;
    });
};

export const getStatisticDriver = () => {
  return axiosInstances.login
    .get(`/api/v1/statistic/driver`)
    .then((response) => {
      console.log('Dữ liệu nhận được:', response.data);
      const { result, error } = response.data; // Sửa từ `statistics` thành `result`
      if (error) {
        console.error('Lỗi từ API:', error);
        return null;
      } else {
        return result; // Trả về `result` thay vì `statistics`
      }
    })
    .catch((error) => {
      console.error('Lỗi khi gọi API:', error);
      return null;
    });
};

export const getStatisticReview = () => {
  return axiosInstances.login
    .get(`/api/v1/statistic/review`)
    .then((response) => {
      console.log('Dữ liệu nhận được:', response.data);
      const { result, error } = response.data; // Sửa từ `statistics` thành `result`
      if (error) {
        console.error('Lỗi từ API:', error);
        return null;
      } else {
        return result; // Trả về `result` thay vì `statistics`
      }
    })
    .catch((error) => {
      console.error('Lỗi khi gọi API:', error);
      return null;
    });
};
