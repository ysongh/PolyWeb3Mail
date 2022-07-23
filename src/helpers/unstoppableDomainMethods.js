import { ALCHEMYAPI_KEY } from "../config";

export const resolveUnstoppableDomainNamesIntoRecords = async (domain) => {
  try{
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ALCHEMYAPI_KEY}`
      }
    };
    
    const res = await fetch(`https://unstoppabledomains.g.alchemy.com/domains/${domain}`, options)
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error){
    console.error(error);
    return false;
  }
  
}