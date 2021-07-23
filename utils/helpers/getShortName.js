const getShortName = (source) => {
	switch(source) {
	  case "Pangolin":
		return "png"
	  case "Trader Joe":
		return "joe"
	  case "Snowball":
		return "snowball"
	  default:
		return null
	}
}

export default getShortName
