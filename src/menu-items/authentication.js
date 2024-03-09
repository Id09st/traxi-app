// assets
import { IconKey } from '@tabler/icons';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const authentication = {
  id: 'authentication',
  title: 'Xác thực người dùng',
  caption: 'Bạn cần phải đăng nhập',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Xác thực người dùng',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'login3',
          title: 'Đăng nhập',
          type: 'item',
          url: '/pages/login/login3'
        }
      ]
    }
  ]
};

export default authentication;
