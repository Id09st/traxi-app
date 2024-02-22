import { useState } from 'react';

const useDriverForm = () => {
  const [driver, setDriver] = useState({
    fullname: '',
    imageurl: '',
    phone: '',
    address: '',
    degreeid: '',
    walletid: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    fullname: false,
    imageurl: false,
    phone: false,
    degreeid: false
  });

  const validate = () => {
    let tempErrors = { ...errors };
    tempErrors.fullname = !driver.fullname;
    tempErrors.imageurl = !/^(http|https):\/\/[^ "]+$/.test(driver.imageurl);
    tempErrors.phone = !/^0\d{9}$/.test(driver.phone);
    tempErrors.degreeid = !/^\d+$/.test(driver.degreeid);
    setErrors({ ...tempErrors });

    return Object.values(tempErrors).every((x) => !x);
  };

  const handleChange = (prop) => (event) => {
    setDriver({ ...driver, [prop]: event.target.value });
  };

  return { driver, errors, handleChange, validate };
};

export default useDriverForm;
