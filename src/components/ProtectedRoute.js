import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/JWTContexts'; // Đảm bảo đường dẫn này đúng

const ProtectedRoute = ({ children, roles }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext); // Sử dụng user từ AuthContext
  const userRole = user ? user.role : null; // Truy cập role từ user object

  useEffect(() => {
    // Kiểm tra xem người dùng có được xác thực và có role phù hợp không
    if (!isAuthenticated || (roles && !roles.includes(userRole))) {
      navigate('/pages/login/login3'); // Điều hướng người dùng nếu họ không có quyền
    }
  }, [isAuthenticated, userRole, roles, navigate]);

  return children; // Trả về children nếu người dùng có quyền truy cập
};

export default ProtectedRoute;
