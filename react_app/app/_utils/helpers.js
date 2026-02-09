export function setPageParams(paramsObj){
	
	const url = new URL(window.location.href);
	
	for(var key of Object.keys(paramsObj)){
		
		if(paramsObj[key]){
			url.searchParams.set(key, paramsObj[key]);
		}else{
			url.searchParams.delete(key);
		}
	}
	
	window.history.replaceState({}, '', url);
	
}