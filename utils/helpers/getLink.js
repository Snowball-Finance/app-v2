
export const getLink = (url,text) => {
  return (<>
    <a target='_blank' rel="noreferrer" href={url}>
      {text}
    </a>
  </>
  )
};