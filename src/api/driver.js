import { axiosInstances } from 'utils/axios';

export const getAllDriver = (currentPage, pageSize) => {
  return axiosInstances.login
    .get(`/api/v1/get-all-drivers/${currentPage}/${pageSize}`)
    .then((response) => {
      console.log('Dữ liệu nhận được:', response.data);
      const { listDrivers, error } = response.data;
      if (error) {
        console.error('Lỗi từ API:', error);
        return null;
      } else {
        return listDrivers;
      }
    })
    .catch((error) => {
      console.error('Lỗi khi gọi API:', error);
      return null;
    });
};

export const addDriver = async (driverData) => {
  try {
    const response = await axiosInstances.login.post('/api/v1/driver', {
      Fullname: driverData.fullname,
      ImageUrl: driverData.imageurl,
      Phone: driverData.phone,
      Address: driverData.address,
      Password: driverData.password,
      DegreeId: driverData.degreeid,
      WalletId: driverData.walletid
    });
    return response.data;
  } catch (error) {
    console.error('Có lỗi khi thêm driver mới:', error);
    throw error;
  }
};

export const getDriverById = async (driverId) => {
  try {
    const response = await axiosInstances.login.get(`/api/v1/driver/${driverId}`);
    console.log('Dữ liệu nhận được:', response.data);
    const { result, error } = response.data;
    if (error) {
      console.error('Lỗi từ API:', error);
      return null;
    } else {
      return result;
    }
  } catch (error) {
    console.error('Lỗi khi gọi API:', error);
    return null;
  }
};

export const updateDriverById = async (driverId, driver) => {
  try {
    const response = await axiosInstances.login.put(`/api/v1/driver/${driverId}`, {
      Fullname: driver.fullname,
      ImageUrl: driver.imageurl,
      Phone: driver.phone,
      Address: driver.address,
      Password: driver.password,
      DegreeId: driver.degreeid,
      WalletId: driver.walletid
    });
    return response.data;
  } catch (error) {
    console.error('Có lỗi khi sửa driver:', error);
    throw error;
  }
};

export const banDriverById = async (driverId) => {
  try {
    const response = await axiosInstances.login.put(`/api/v1/driver/ban/${driverId}`);
    return response.data;
  } catch (error) {
    console.error('Có lỗi khi sửa driver:', error);
    throw error;
  }
};
