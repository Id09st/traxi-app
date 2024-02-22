// assets
import { IconBrandChrome, IconHelp, IconUser } from '@tabler/icons';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

// constant
const icons = { IconBrandChrome, IconHelp, IconUser };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
  id: 'manager-manage',
  type: 'group',
  children: [
    {
      id: 'Manager-manage',
      title: 'Quản lý Manager',
      type: 'item',
      url: '/Manager-manage',
      icon: SupportAgentIcon,
      breadcrumbs: false
    },
    {
      id: 'Driver-manage',
      title: 'Quản lý Driver',
      type: 'item',
      url: '/Driver-manage',
      icon: DriveEtaIcon,
      breadcrumbs: false
    }
  ]
};

export default other;
