import { useState } from 'react';

const useManagerForm = () => {
  const [manager, setManager] = useState({
    fullname: '',
    password: '',
    role: '',
    status: ''
  });

  const [errors, setErrors] = useState({
    fullname: false,
    password: false
  });

  const validate = () => {
    let tempErrors = { ...errors };
    if (!manager.name) {
      tempErrors.name = 'Tên không được để trống';
    } else {
      tempErrors.name = !/^(?=.*[a-zA-Z])(?=.*[0-9])\S+$/.test(manager.name);
    }
    tempErrors.password = !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(manager.password);
    setErrors({ ...tempErrors });

    return Object.values(tempErrors).every((x) => !x);
  };

  const handleChange = (prop) => (event) => {
    setManager({ ...manager, [prop]: event.target.value });
  };

  return { manager, errors, handleChange, validate };
};

export default useManagerForm;
