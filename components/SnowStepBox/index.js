import { memo, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  upper: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 0.8,
    borderStyle: 'solid',
    borderColor: theme.custom.palette.border,
    padding: theme.spacing(1),
  },
  lower: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '14px',
    justifyItems: 'center',
  },
  subtitle: {
    fontSize: '12px',
    justifyItems: 'center',
  },
  ellipse: {
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#DBEDFF',
    padding: theme.spacing(1),
    width: '15px',
    height: '15px',
    left: '47px',
    top: '33px',
  }
}));


const SnowStepBox = ({
    transactionStatus
}) => {
    const [colors, setColors] = useState({
      deposit1:'#DBEDFF',
      deposit2:'#DBEDFF',
      approval1:'#DBEDFF',
      approval2:'#DBEDFF',
    });
  const classes = useStyles();

  const color = {
      enabled: '#28A2FF',
      disabled:'#DBEDFF'
  }

  useEffect(() =>{
    var newStatus = new Object();
    switch(transactionStatus.approvalStep){
      case 0:
        newStatus.approval1 = color.disabled; 
        newStatus.approval2 = color.disabled; 
      break;
      case 1:
        newStatus.approval1 = color.enabled; 
        newStatus.approval2 = color.disabled; 
      break;
      case 2:
        newStatus.approval1 = color.enabled; 
        newStatus.approval2 = color.enabled; 
      break;
    }
    switch(transactionStatus.depositStep){
      case 0:
        newStatus.deposit1 = color.disabled; 
        newStatus.deposit2 = color.disabled; 
        break;
      case 1:
        newStatus.deposit1 = color.enabled; 
        newStatus.deposit2 = color.disabled; 
      break;
      case 2:
        newStatus.deposit1 = color.enabled; 
        newStatus.deposit2 = color.enabled; 
      break;
    }
    setColors(newStatus);
  }),[transactionStatus];

  return (
    <div className={classes.root}>
      <div className={classes.upper}>
        <div className={classes.container}>
          <Typography className={classes.title} >Approval Steps</Typography>
          <Typography className={classes.title} >Deposit Steps</Typography>
        </div>
        <div className={classes.lower}>
          <div className={classes.container}>
            <Box className={classes.ellipse} 
              style={{background:colors?.approval1}} borderRadius="50%"/>
            <Box className={classes.ellipse} 
              style={{background:colors?.approval2}} borderRadius="50%"/>
            <Box className={classes.ellipse} 
              style={{background:colors?.deposit1}} borderRadius="50%"/>
            <Box className={classes.ellipse} 
              style={{background:colors?.deposit2}} borderRadius="50%"/>
          </div>
        </div>
        <div className={classes.lower}>
          <div className={classes.container}>
            <Typography className={classes.subtitle}>{transactionStatus.approvalStep}/2 Step</Typography>
            <Typography className={classes.subtitle}>{transactionStatus.depositStep}/2 Step</Typography>
          </div>
        </div>
      </div>  
    </div>
  );

}

export default memo(SnowStepBox);
