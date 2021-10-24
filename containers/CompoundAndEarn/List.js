import dynamic from 'next/dynamic'
import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import Loading from 'components/Skeletons/pool';
import Skeleton from 'components/Skeletons/CompoundAndEarn'
const ListItem = dynamic(() => import('./ListItem'), { loading: () => <Loading /> })
import { Grid } from '@material-ui/core';

const ITEMS_PER_PAGE = 10;

const List = ({ pools, modal, setModal }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoad, setinitialLoad] = useState(true)
  const hasMore = items.length < pools.length
  const [page, setPage] = useState(0)
  const maxPage = Math.ceil(pools.length / ITEMS_PER_PAGE)
  const contentRef = useRef(null)

  const isBottom = useCallback((ref) => {
    if (!ref.current) return false;
    return ref.current.getBoundingClientRect().bottom <= window.innerHeight
  }, [])

  const loadMore = useCallback(() => {
    const next = (page + 1) % maxPage
    const nexItems = pools.slice(next * ITEMS_PER_PAGE, ITEMS_PER_PAGE * (next + 1))
    setLoading(true)
    setItems([...items, ...nexItems])
    setPage(next)
    setLoading(false)
  }, [maxPage, page, items, setPage])

  useEffect(()=> {
    if(initialLoad) {
      loadMore();
      setinitialLoad(false)
    }
  }, [initialLoad, setinitialLoad, loadMore])

  useEffect(() => {
    const onScroll = () => {
      if (!loading && hasMore && isBottom(contentRef)) {
        loadMore();
      }
    }
    document.addEventListener('scroll', onScroll)
    return () => document.removeEventListener('scroll', onScroll)
  }, [loadMore, loading, initialLoad, hasMore, page, items, isBottom])

  return (
    <>
      <div ref={contentRef}>
        <Grid container spacing={2} >
          {items.map((pool) => (
            <Grid item key={pool.address} xs={12}>
              {(!pool.deprecatedPool || !(pool.withdrew && pool.claimed)) &&
                <ListItem pool={pool} modal={modal} setModal={setModal} />}
            </Grid>
          ))
          }

        </Grid>
        {hasMore && <Skeleton/>}
      </div>

    </>
  )
}

export default List