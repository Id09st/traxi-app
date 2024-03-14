import { axiosInstances } from 'utils/axios';

export const getAllManager = async (currentPage, pageSize) => {
  try {
    const response = await axiosInstances.login.get(`/api/v1/all-manager/${currentPage}/${pageSize}`);

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

export const getManagerById = async (managerId) => {
  try {
    const response = await axiosInstances.login.get(`/api/v1/manager/${managerId}`);

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

export const updateManagerById = async (managerId, manager) => {
  try {
    const response = await axiosInstances.login.put(`/api/v1/manager/${managerId}`, {
      name: manager.name,
      password: manager.password
    });
    return response.data;
  } catch (error) {
    console.error('Có lỗi khi sửa manager:', error);
    throw error;
  }
};

export const banManagerById = async (managerId) => {
  try {
    const response = await axiosInstances.login.put(`/api/v1/manager/ban/${managerId}`);
    return response.data;
  } catch (error) {
    console.error('Có lỗi khi sửa manager:', error);
    throw error;
  }
};

export const addManager = async (managerData) => {
  try {
    const response = await axiosInstances.login.post('/api/v1/manager', {
      name: managerData.name,
      password: managerData.password
    });
    return response.data;
  } catch (error) {
    console.error('Có lỗi khi thêm manager mới:', error);
    throw error;
  }
};
