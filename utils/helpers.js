// Function to execute a sql query
export async function queryExecute(connection, sqlQuery, queryParams){
	return await connection.query(sqlQuery,queryParams);
}


// Function to send response to client based on request method
export function queryResponseOutput(expressReq, expressRes, queryResults,error){
	
	try{
		
		if(error){
			return expressRes.status(500).json({ error: error?.message || "Internal server error" });
		}else if(expressReq.method?.toUpperCase() == "GET"){
			expressRes.status(200).json(queryResults);
		}else if(expressReq.method?.toUpperCase() == "POST"){
			return expressRes.status(200).json({
				success : true,
				id: queryResults.insertId
			});
		}else{
			return expressRes.status(200).json({
				success : true,
			});
		}
		
	}catch(e){
		//console.log(e);
		return expressRes.status(500).json({ error: e.message });
	}
}