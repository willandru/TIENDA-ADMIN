import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import React from "react";
import { ApiAlert } from "./api-alert";


interface ApiLIstProps{
    entityName: string;
    entityIdName: string;
}


export const ApiList: React.FC<ApiLIstProps> = ({
    entityName,
    entityIdName,
}) =>{

    const params = useParams();
    const origin = useOrigin();

    const baseUrl = `${origin}/api/${params.storeId}`;







    return(
        <>
        <ApiAlert 
         title="GET"
         variant="public"
         description={`${baseUrl}/${entityName}`}
        />
        <ApiAlert 
         title="GET"
         variant="public"
         description={`${baseUrl}/${entityName}/{${entityIdName}}`}
        />
        <ApiAlert 
         title="POST"
         variant="admin"
         description={`${baseUrl}/${entityName}`}
        />
        <ApiAlert 
         title="PATCH"
         variant="admin"
         description={`${baseUrl}/${entityName}/{${entityIdName}}`}
        />
        <ApiAlert 
         title="DELETE"
         variant="admin"
         description={`${baseUrl}/${entityName}/{${entityIdName}}`}
        />
        </>
    )
}