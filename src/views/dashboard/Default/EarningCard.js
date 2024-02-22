import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import EarningIcon from 'assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';

// Call API
import { getStatistic } from 'api/statistic';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
    borderRadius: '50%',
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
}));

// Component EarningCard
const EarningCard = ({ isLoading }) => {
  const theme = useTheme();
  const [statistic, setStatistic] = useState(null); // State để lưu trữ dữ liệu thống kê
  const [anchorEl, setAnchorEl] = useState(null);

  // Function mở menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Function đóng menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Function gọi API và cập nhật state
  const getStatistics = async () => {
    try {
      const response = await getStatistic();
      console.log('API Response:', response); // Kiểm tra dữ liệu trả về từ API
      if (response && response.totalIncomeDriver !== undefined) {
        setStatistic(response.totalIncomeDriver);
      } else {
        // Xử lý trường hợp không nhận được dữ liệu mong đợi
        console.error('Error fetching statistic data:', response ? 'Missing totalIncomeDriver in response' : 'Response is undefined');
      }
    } catch (error) {
      console.error('Error fetching statistic data:', error);
    }
  };

  // Gọi API khi component được render
  useEffect(() => {
    getStatistics();
  }, []);

  return (
    <>
      {isLoading ? (
        // Component SkeletonEarningCard cho trường hợp loading
        <SkeletonEarningCard />
      ) : (
        // Component CardWrapper chứa dữ liệu thống kê
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              {/* Nếu có dữ liệu thống kê, render nó */}
              {statistic && (
                <Grid item>
                  <Grid container justifyContent="space-between">
                    <Grid item>
                      {/* Avatar cho icon thu nhập */}
                      <Avatar
                        variant="rounded"
                        sx={{
                          ...theme.typography.commonAvatar,
                          ...theme.typography.largeAvatar,
                          backgroundColor: theme.palette.secondary[800],
                          mt: 1
                        }}
                      >
                        <img src={EarningIcon} alt="Notification" />
                      </Avatar>
                    </Grid>
                    <Grid item>
                      {/* Avatar cho menu */}
                      <Avatar
                        variant="rounded"
                        sx={{
                          ...theme.typography.commonAvatar,
                          ...theme.typography.mediumAvatar,
                          backgroundColor: theme.palette.secondary.dark,
                          color: theme.palette.secondary[200],
                          zIndex: 1
                        }}
                        aria-controls="menu-earning-card"
                        aria-haspopup="true"
                        onClick={handleClick}
                      >
                        <MoreHorizIcon fontSize="inherit" />
                      </Avatar>
                      {/* Menu cho card */}
                      <Menu
                        id="menu-earning-card"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        variant="selectedMenu"
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right'
                        }}
                      >
                        <MenuItem onClick={handleClose}>
                          <GetAppTwoToneIcon sx={{ mr: 1.75 }} /> Thêm thẻ
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <FileCopyTwoToneIcon sx={{ mr: 1.75 }} /> Sao chép dữ liệu
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <PictureAsPdfTwoToneIcon sx={{ mr: 1.75 }} /> Xuất dữ liệu
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <ArchiveTwoToneIcon sx={{ mr: 1.75 }} /> Sao lưu thành tệp
                        </MenuItem>
                      </Menu>
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {/* Nếu có dữ liệu thống kê, render số tiền */}
              {statistic && (
                <Grid item>
                  <Grid container alignItems="center">
                    <Grid item>
                      {/* Hiển thị số tiền từ dữ liệu thống kê */}
                      <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>{statistic}₫</Typography>
                    </Grid>
                    <Grid item>
                      {/* Icon chỉ ra hướng tăng giảm, có thể thay đổi tùy thuộc vào dữ liệu */}
                      <Avatar
                        sx={{
                          cursor: 'pointer',
                          ...theme.typography.smallAvatar,
                          backgroundColor: theme.palette.secondary[200],
                          color: theme.palette.secondary.dark
                        }}
                      >
                        <ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                      </Avatar>
                    </Grid>
                  </Grid>
                </Grid>
              )}
              <Grid item sx={{ mb: 1.25 }}>
                {/* Thêm một dòng cho phần tử này */}
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: theme.palette.secondary[200]
                  }}
                >
                  Tổng thu nhập
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

// PropTypes cho component EarningCard
EarningCard.propTypes = {
  isLoading: PropTypes.bool
};

// Export component EarningCard
export default EarningCard;
