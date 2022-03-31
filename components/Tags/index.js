import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  tags: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(0.3),
    fontSize: 12,
    borderRadius: 4
  },
  SNOB: {
    backgroundColor: theme.custom.palette.transparent.snob_blue,
    color: theme.custom.palette.snob_blue
  },
  PGL: {
    backgroundColor: theme.custom.palette.transparent.png_orange,
    color: theme.custom.palette.png_orange
  },
  JLP: {
    backgroundColor: theme.custom.palette.transparent.joe_red,
    color: theme.custom.palette.joe_red
  },
  VLP: {
    backgroundColor: theme.custom.palette.transparent.green,
    color: theme.custom.palette.green
  },
  BLP: {
    backgroundColor: theme.custom.palette.transparent.banker_skyblue,
    color: theme.custom.palette.banker_skyblue
  },
  QLP: {
    backgroundColor: theme.custom.palette.transparent.snob_blue,
    color: theme.custom.palette.snob_blue
  },
  ALP: {
    backgroundColor: theme.custom.palette.transparent.aave_purple,
    color: theme.custom.palette.aave_purple,
  },
  TLP: {
    backgroundColor: theme.custom.palette.transparent.teddy_yellow,
    color: theme.custom.palette.teddy_yellow,
  },
  AXLP: {
    backgroundColor: theme.custom.palette.transparent.axlp_skyblue,
    color: theme.custom.palette.axlp_skyblue,
  },
  OLP: {
    backgroundColor: theme.custom.palette.transparent.olp,
    color: theme.custom.palette.olp,
  }
}));

const Tags = ({ children, style, className, type }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.tags, className, classes[type])} style={style}>
      {children}
    </div>
  );
};

export default memo(Tags);
