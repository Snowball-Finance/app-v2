import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Loading from 'components/Skeletons/pool';
import Skeleton from 'components/Skeletons/CompoundAndEarn';

const ListItem = dynamic(() => import('./ListItem'), {
  loading: () => <Loading />,
});

const ITEMS_PER_PAGE = 10;

const List = ({ pools, modal, setModal }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasMore = items.length < pools.length;
  const [page, setPage] = useState(1);
  const maxPage = Math.ceil(pools.length / ITEMS_PER_PAGE);
  const contentRef = useRef(null);

  const isBottom = useCallback((ref) => {
    if (!ref.current) return false;
    return ref.current.getBoundingClientRect().bottom <= window.innerHeight;
  }, []);

  const loadMore = useCallback(() => {
    if (maxPage >= page) {
      const nexItems = pools.slice(
        page * ITEMS_PER_PAGE,
        ITEMS_PER_PAGE * (page + 1)
      );
      setLoading(true);
      setItems([...items, ...nexItems]);
      setPage((prev) => prev + 1);
      setLoading(false);
    }
  }, [maxPage, page, setPage, items, pools]);

  useEffect(() => {
    setPage(1);
    setItems(pools.slice(0, ITEMS_PER_PAGE));
  }, [pools]);

  useEffect(() => {
    const onScroll = () => {
      if (!loading && hasMore && isBottom(contentRef)) {
        loadMore();
      }
    };
    document.addEventListener('scroll', onScroll);
    return () => document.removeEventListener('scroll', onScroll);
  }, [loadMore, loading, hasMore, page, items, isBottom]);

  return (
    <>
      <Box ref={contentRef} width={1}>
        <Grid container spacing={2}>
          {items.map((pool) => (
            <Grid item key={pool.address} xs={12}>
              {(!pool.deprecatedPool || !(pool.withdrew && pool.claimed)) && (
                <ListItem pool={pool} modal={modal} setModal={setModal} />
              )}
            </Grid>
          ))}
        </Grid>
        {hasMore && <Skeleton />}
      </Box>
    </>
  );
};

export default memo(List);
